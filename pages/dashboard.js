import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    async function init() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (!profile) {
        await supabase.auth.signOut();
        router.push("/login");
        return;
      }

      if (mounted) {
        setUser(session.user);
        fetchNotes();
      }
    }
    init();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter(note => 
        note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNotes(filtered);
    }
  }, [notes, searchQuery]);

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setNotes(data || []);
  };

  const createNote = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setIsLoading(true);
    try {
      await supabase
        .from("notes")
        .insert([{ title: title.trim(), content: content.trim(), user_id: user.id }]);
      
      setTitle("");
      setContent("");
      setShowCreateModal(false);
      fetchNotes();
    } catch (error) {
      console.error('Error creating note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateNote = async (e) => {
    e.preventDefault();
    if (!title.trim() || !editingNote) return;
    
    setIsLoading(true);
    try {
      await supabase
        .from("notes")
        .update({ title: title.trim(), content: content.trim() })
        .eq("id", editingNote.id);
      
      setTitle("");
      setContent("");
      setShowEditModal(false);
      setEditingNote(null);
      fetchNotes();
    } catch (error) {
      console.error('Error updating note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNote = async (id) => {
    if (window.confirm('Yakin ingin menghapus catatan ini?')) {
      await supabase.from("notes").delete().eq("id", id);
      fetchNotes();
    }
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    setTitle(note.title || "");
    setContent(note.content || "");
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditingNote(null);
    setTitle("");
    setContent("");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModals();
      }
    };
    
    if (showCreateModal || showEditModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showCreateModal, showEditModal]);

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      background: 'linear-gradient(135deg, #fafafa 0%, #ffffff 100%)',
      color: '#1a1a1a'
    }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '280px' : '80px',
        background: 'linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%)',
        color: 'white',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        boxShadow: '0 0 50px rgba(0,0,0,0.1)',
        position: 'relative',
        borderRight: '1px solid rgba(255,214,10,0.1)'
      }}>
        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: 'absolute',
            top: '32px',
            right: '-16px',
            width: '32px',
            height: '32px',
            background: '#FFD60A',
            border: '2px solid #1a1a1a',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            color: '#1a1a1a',
            fontWeight: '700',
            boxShadow: '0 4px 20px rgba(255,214,10,0.3)',
            transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 8px 30px rgba(255,214,10,0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 20px rgba(255,214,10,0.3)';
          }}
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>

        {/* Brand */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '48px',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #FFD60A 0%, #FFC107 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1a1a1a',
            minWidth: '48px',
            boxShadow: '0 4px 20px rgba(255,214,10,0.25)'
          }}>
            ✦
          </div>
          {sidebarOpen && (
            <div>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: '800', 
                margin: 0,
                color: 'white',
                letterSpacing: '-0.02em'
              }}>
                Remain
              </h2>
              <p style={{
                fontSize: '12px',
                color: 'rgba(255,255,255,0.6)',
                margin: 0,
                fontWeight: '500'
              }}>
                Smart Notes
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1 }}>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <li>
              <button
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: 'linear-gradient(135deg, rgba(255,214,10,0.15) 0%, rgba(255,214,10,0.05) 100%)',
                  border: '1px solid rgba(255,214,10,0.3)',
                  color: '#FFD60A',
                  padding: '16px 20px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                  fontSize: '15px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                <span style={{ minWidth: '20px', textAlign: 'center' }}>📒</span>
                {sidebarOpen && <span>Dashboard</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => router.push("/profile")}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.7)',
                  padding: '16px 20px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                  fontSize: '15px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.target.style.color = 'white';
                  e.target.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                  e.target.style.transform = 'translateX(0)';
                }}
              >
                <span style={{ minWidth: '20px', textAlign: 'center' }}>👤</span>
                {sidebarOpen && <span>Profile</span>}
              </button>
            </li>
          </ul>
        </nav>

        {/* User Info & Logout */}
        {sidebarOpen && user && (
          <div style={{
            marginTop: '32px',
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #FFD60A, #FFC107)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '700',
                color: '#1a1a1a'
              }}>
                {user.email.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ 
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '2px'
                }}>
                  Welcome back
                </div>
                <div style={{ 
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  wordBreak: 'break-all'
                }}>
                  {user.email}
                </div>
              </div>
            </div>
            
            <button
              onClick={logout}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.15)';
                e.target.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                e.target.style.color = '#ef4444';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.color = 'rgba(255, 255, 255, 0.8)';
              }}
            >
              <span>⏻</span>
              <span>Logout</span>
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        padding: '48px',
        background: 'transparent',
        overflow: 'auto'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div>
            <h1 style={{
              fontSize: '42px',
              fontWeight: '900',
              color: '#1a1a1a',
              margin: '0 0 8px 0',
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Your Workspace
            </h1>
            <p style={{
              color: '#6b7280',
              margin: 0,
              fontSize: '18px',
              fontWeight: '400'
            }}>
              Capture ideas, organize thoughts, build something amazing
            </p>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{
              background: 'white',
              padding: '16px 24px',
              borderRadius: '20px',
              border: '1px solid rgba(0,0,0,0.08)',
              fontSize: '15px',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                background: notes.length > 0 ? '#22c55e' : '#e5e7eb',
                borderRadius: '50%'
              }}></div>
              <span style={{ fontWeight: '600' }}>{notes.length} notes</span>
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                border: 'none',
                borderRadius: '20px',
                color: 'white',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 8px 32px rgba(26, 26, 26, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 40px rgba(26, 26, 26, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 32px rgba(26, 26, 26, 0.2)';
              }}
            >
              <span style={{
                width: '20px',
                height: '20px',
                background: '#FFD60A',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1a1a1a',
                fontSize: '12px',
                fontWeight: '900'
              }}>✚</span>
              <span>New Note</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{
          marginBottom: '32px'
        }}>
          <div style={{
            position: 'relative',
            maxWidth: '500px'
          }}>
            <input
              type="text"
              placeholder="Search your notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '20px 24px 20px 56px',
                border: '2px solid rgba(0,0,0,0.08)',
                borderRadius: '24px',
                fontSize: '16px',
                color: '#1a1a1a',
                background: 'white',
                transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                outline: 'none',
                boxSizing: 'border-box',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                fontWeight: '500'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#FFD60A';
                e.target.style.boxShadow = '0 8px 32px rgba(255,214,10,0.15)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(0,0,0,0.08)';
                e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)';
                e.target.style.transform = 'translateY(0)';
              }}
            />
            <div style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
              fontSize: '20px'
            }}>
              ⌕
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.05)',
                  border: 'none',
                  borderRadius: '50%',
                  color: '#6b7280',
                  cursor: 'pointer',
                  fontSize: '16px',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(0,0,0,0.05)';
                }}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Notes Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '24px'
        }}>
          {filteredNotes.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '100px 40px',
              color: '#6b7280'
            }}>
              <div style={{
                fontSize: '80px',
                marginBottom: '24px',
                opacity: 0.3
              }}>
                {searchQuery ? '⌕' : '✦'}
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                margin: '0 0 12px 0',
                color: '#1a1a1a'
              }}>
                {searchQuery ? 'No matches found' : 'Start your first note'}
              </h3>
              <p style={{
                fontSize: '16px',
                margin: 0,
                opacity: 0.8,
                maxWidth: '400px',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}>
                {searchQuery 
                  ? `No notes contain "${searchQuery}". Try different keywords.` 
                  : 'Transform your ideas into something extraordinary. Every great project starts with a single note.'
                }
              </p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div 
                key={note.id} 
                onClick={() => openEditModal(note)}
                style={{
                  background: 'white',
                  borderRadius: '24px',
                  padding: '32px',
                  border: '1px solid rgba(0,0,0,0.08)',
                  transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                  position: 'relative',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.12)';
                  e.currentTarget.style.borderColor = '#FFD60A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)';
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '16px',
                  gap: '16px'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1a1a1a',
                    margin: 0,
                    flex: 1,
                    lineHeight: '1.3'
                  }}>
                    {note.title || "Untitled"}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontSize: '16px',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      opacity: 0.7
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#ef4444';
                      e.target.style.color = 'white';
                      e.target.style.opacity = '1';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                      e.target.style.color = '#ef4444';
                      e.target.style.opacity = '0.7';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    ×
                  </button>
                </div>

                {note.content && (
                  <p style={{
                    fontSize: '16px',
                    color: '#6b7280',
                    margin: '0 0 20px 0',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {note.content}
                  </p>
                )}

                <div style={{
                  fontSize: '13px',
                  color: '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '500'
                }}>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    background: '#9ca3af',
                    borderRadius: '50%'
                  }}></span>
                  <span>{new Date(note.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Create/Edit Note Modal */}
      {(showCreateModal || showEditModal) && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(26, 26, 26, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '32px',
            padding: '48px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 32px 80px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            border: '1px solid rgba(0,0,0,0.08)'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '32px'
            }}>
              <h2 style={{
                fontSize: '32px',
                fontWeight: '800',
                color: '#1a1a1a',
                margin: 0,
                letterSpacing: '-0.02em'
              }}>
                {showEditModal ? 'Edit Note' : 'Create New Note'}
              </h2>
              <button
                onClick={closeModals}
                style={{
                  background: 'rgba(0,0,0,0.05)',
                  border: 'none',
                  borderRadius: '50%',
                  color: '#6b7280',
                  cursor: 'pointer',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(0,0,0,0.1)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(0,0,0,0.05)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                ×
              </button>
            </div>

            {/* Form */}
            <form onSubmit={showEditModal ? updateNote : createNote}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '12px'
                }}>
                  Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter note title..."
                  required
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    border: '2px solid rgba(0,0,0,0.08)',
                    borderRadius: '20px',
                    fontSize: '18px',
                    color: '#1a1a1a',
                    background: '#fafafa',
                    transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontWeight: '600'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#FFD60A';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 8px 32px rgba(255,214,10,0.15)';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(0,0,0,0.08)';
                    e.target.style.background = '#fafafa';
                    e.target.style.boxShadow = 'none';
                    e.target.style.transform = 'translateY(0)';
                  }}
                />
              </div>

              <div style={{ marginBottom: '40px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '12px'
                }}>
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your thoughts here..."
                  rows="8"
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    border: '2px solid rgba(0,0,0,0.08)',
                    borderRadius: '20px',
                    fontSize: '16px',
                    color: '#1a1a1a',
                    background: '#fafafa',
                    transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                    minHeight: '160px',
                    lineHeight: '1.6',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#FFD60A';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 8px 32px rgba(255,214,10,0.15)';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(0,0,0,0.08)';
                    e.target.style.background = '#fafafa';
                    e.target.style.boxShadow = 'none';
                    e.target.style.transform = 'translateY(0)';
                  }}
                />
              </div>

              {/* Form Actions */}
              <div style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={closeModals}
                  style={{
                    padding: '16px 32px',
                    background: 'rgba(0,0,0,0.05)',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '16px',
                    color: '#6b7280',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(0,0,0,0.08)';
                    e.target.style.borderColor = 'rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(0,0,0,0.05)';
                    e.target.style.borderColor = 'rgba(0,0,0,0.1)';
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!title.trim() || isLoading}
                  style={{
                    padding: '16px 32px',
                    background: title.trim() ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' : 'rgba(0,0,0,0.1)',
                    border: 'none',
                    borderRadius: '16px',
                    color: title.trim() ? 'white' : '#9ca3af',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: title.trim() && !isLoading ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    minWidth: '140px',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    if (title.trim() && !isLoading) {
                      e.target.style.boxShadow = '0 8px 32px rgba(26, 26, 26, 0.25)';
                      e.target.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.boxShadow = 'none';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  {isLoading ? (
                    <>
                      <span style={{
                        width: '18px',
                        height: '18px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span style={{
                        width: '18px',
                        height: '18px',
                        background: '#FFD60A',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#1a1a1a',
                        fontSize: '12px',
                        fontWeight: '900'
                      }}>✓</span>
                      <span>{showEditModal ? 'Update Note' : 'Create Note'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        input::placeholder,
        textarea::placeholder {
          color: #9ca3af;
          font-weight: 400;
        }
        
        @media (max-width: 768px) {
          aside {
            width: ${sidebarOpen ? '100%' : '60px'} !important;
            position: ${sidebarOpen ? 'fixed' : 'relative'};
            z-index: 999;
            height: ${sidebarOpen ? '100vh' : 'auto'};
          }
          
          main {
            margin-left: ${sidebarOpen ? '0' : '60px'};
            padding: 24px !important;
          }
          
          .notes-grid {
            grid-template-columns: 1fr !important;
          }
          
          .modal-content {
            margin: 16px !important;
            padding: 32px !important;
          }
        }
        
        @media (max-width: 640px) {
          .header {
            flex-direction: column;
            align-items: flex-start !important;
          }
          
          .search-container {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}