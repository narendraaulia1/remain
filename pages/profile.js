"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/login");
        return;
      }
      setUser(session.user);
    }
    init();
  }, []);

  const updatePassword = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      setMessage("Password baru tidak boleh kosong.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setMessage("Gagal update password: " + error.message);
    } else {
      setMessage("Password berhasil diperbarui.");
      setNewPassword("");
    }
  };

  const backToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '10%',
        width: '80px',
        height: '80px',
        background: '#ffd60a',
        borderRadius: '50%',
        opacity: 0.1,
        animation: 'float 6s ease-in-out infinite'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '25%',
        right: '12%',
        width: '100px',
        height: '100px',
        background: '#343a40',
        borderRadius: '20px',
        opacity: 0.05,
        animation: 'float 8s ease-in-out infinite reverse'
      }}></div>

      <div style={{
        width: '100%',
        maxWidth: '450px',
        position: 'relative',
        zIndex: 1
      }}>
        
        {/* Main Profile Card */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          
          {/* Yellow accent bar */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #ffd60a, #ffbe0b)',
          }}></div>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #343a40, #495057)',
              borderRadius: '15px',
              marginBottom: '20px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Yellow corner accent */}
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                width: '30px',
                height: '30px',
                background: '#ffd60a',
                borderRadius: '50%'
              }}></div>
              <span style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
                zIndex: 1
              }}>R</span>
            </div>
            
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#343a40',
              margin: '0 0 8px 0',
              letterSpacing: '-0.5px'
            }}>
              Profile
            </h1>
            
            <p style={{
              color: '#6c757d',
              margin: 0,
              fontSize: '15px'
            }}>
              Manage your account settings
            </p>
          </div>

          {/* Content */}
          {user ? (
            <>
              {/* User Email Display */}
              <div style={{
                background: '#f8f9fa',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '30px',
                border: '1px solid #e9ecef'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    background: 'linear-gradient(135deg, #ffd60a20, #ffbe0b20)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px'
                  }}>✉</div>
                  <div>
                    <p style={{
                      fontSize: '14px',
                      color: '#6c757d',
                      margin: '0 0 4px 0',
                      fontWeight: '500'
                    }}>
                      Email:
                    </p>
                    <p style={{
                      fontSize: '16px',
                      color: '#343a40',
                      margin: 0,
                      fontWeight: '600'
                    }}>
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Password Update Form */}
              <form onSubmit={updatePassword} style={{ marginBottom: '20px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#343a40',
                    marginBottom: '8px'
                  }}>
                    Ganti Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Password baru"
                      style={{
                        width: '100%',
                        padding: '14px 50px 14px 16px',
                        border: '2px solid #e9ecef',
                        borderRadius: '12px',
                        fontSize: '15px',
                        color: '#343a40',
                        background: '#fafafa',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#ffd60a';
                        e.target.style.background = 'white';
                        e.target.style.boxShadow = '0 0 0 3px rgba(255, 214, 10, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e9ecef';
                        e.target.style.background = '#fafafa';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#6c757d',
                        cursor: 'pointer',
                        fontSize: '18px',
                        padding: '4px',
                        borderRadius: '4px',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.color = '#343a40'}
                      onMouseLeave={(e) => e.target.style.color = '#6c757d'}
                    >
                      {showPassword ? '🙈' : '👁'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'linear-gradient(135deg, #343a40, #495057)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    marginBottom: '16px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(52, 58, 64, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Update Password
                </button>
              </form>

              {/* Message Display */}
              {message && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: message.includes('berhasil') ? '#f0fdf4' : '#fff5f5',
                  border: message.includes('berhasil') ? '1px solid #bbf7d0' : '1px solid #fed7d7',
                  color: message.includes('berhasil') ? '#15803d' : '#e53e3e',
                  fontSize: '14px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>{message.includes('berhasil') ? '✅' : '⚠️'}</span>
                  <span>{message}</span>
                </div>
              )}

              {/* Back Button */}
              <button
                onClick={backToDashboard}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'transparent',
                  border: '2px solid #6c757d',
                  borderRadius: '12px',
                  color: '#6c757d',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#6c757d';
                  e.target.style.color = 'white';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#6c757d';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Kembali ke Dashboard
              </button>
            </>
          ) : (
            // Loading State
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{
                display: 'inline-block',
                width: '32px',
                height: '32px',
                border: '3px solid #e9ecef',
                borderTop: '3px solid #343a40',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '16px'
              }}></div>
              <p style={{
                color: '#6c757d',
                fontSize: '16px',
                margin: 0
              }}>
                Loading...
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        input::placeholder {
          color: #adb5bd;
        }
      `}</style>
    </div>
  );
}