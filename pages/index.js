import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

export default function Home() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fafafa 0%, #ffffff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          color: '#6b7280'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            border: '3px solid rgba(26, 26, 26, 0.1)',
            borderTop: '3px solid #FFD60A',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <span style={{ fontSize: '16px', fontWeight: '500' }}>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fafafa 0%, #ffffff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '8%',
        width: '200px',
        height: '200px',
        background: 'linear-gradient(135deg, #FFD60A20, #FFD60A10)',
        borderRadius: '50%',
        opacity: 0.6,
        animation: 'float 12s ease-in-out infinite',
        filter: 'blur(40px)'
      }}></div>
      
      <div style={{
        position: 'absolute',
        top: '70%',
        right: '5%',
        width: '150px',
        height: '150px',
        background: 'linear-gradient(135deg, #1a1a1a20, #1a1a1a10)',
        borderRadius: '30px',
        opacity: 0.4,
        animation: 'float 8s ease-in-out infinite reverse',
        filter: 'blur(30px)'
      }}></div>

      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '15%',
        width: '100px',
        height: '100px',
        background: 'linear-gradient(135deg, #FFD60A30, #FFD60A20)',
        borderRadius: '20px',
        opacity: 0.5,
        animation: 'float 10s ease-in-out infinite 3s',
        filter: 'blur(20px)'
      }}></div>

      <div style={{
        width: '100%',
        maxWidth: '600px',
        position: 'relative',
        zIndex: 1
      }}>
        
        {/* Main Card */}
        <div style={{
          background: 'white',
          borderRadius: '32px',
          padding: '60px 50px',
          boxShadow: '0 32px 80px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center'
        }}>
          
          {/* Yellow accent gradient */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #FFD60A, #FFC107, #FFD60A)',
          }}></div>

          {/* Brand Logo */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)',
            borderRadius: '24px',
            marginBottom: '40px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 16px 40px rgba(26, 26, 26, 0.2)'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #FFD60A, #FFC107)',
              borderRadius: '50%',
              opacity: 0.9
            }}></div>
            <span style={{
              color: 'white',
              fontSize: '40px',
              fontWeight: '900',
              zIndex: 1
            }}>✦</span>
          </div>

          {/* Main Content */}
          <div style={{ marginBottom: '50px' }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '900',
              color: '#1a1a1a',
              margin: '0 0 20px 0',
              letterSpacing: '-0.03em',
              lineHeight: '1.1',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Welcome to Remain
            </h1>
            
            <p style={{
              fontSize: '22px',
              color: '#6b7280',
              margin: '0 0 12px 0',
              lineHeight: '1.5',
              fontWeight: '400'
            }}>
              Transform your thoughts into something extraordinary
            </p>
            
            <p style={{
              fontSize: '16px',
              color: '#9ca3af',
              margin: 0,
              fontWeight: '500'
            }}>
              Smart notes for creative minds
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '50px'
          }}>
            {user ? (
              // Dashboard button for logged in users
              <button 
                onClick={() => router.push('/dashboard')}
                style={{
                  padding: '18px 40px',
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                  border: 'none',
                  borderRadius: '18px',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  minWidth: '180px',
                  boxShadow: '0 8px 32px rgba(26, 26, 26, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 16px 48px rgba(26, 26, 26, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 32px rgba(26, 26, 26, 0.2)';
                }}
              >
                <span style={{
                  width: '24px',
                  height: '24px',
                  background: '#FFD60A',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1a1a1a',
                  fontSize: '14px',
                  fontWeight: '900'
                }}>→</span>
                <span>Open Dashboard</span>
              </button>
            ) : (
              <>
                {/* Login Button */}
                <button 
                  onClick={() => router.push('/login')}
                  style={{
                    padding: '18px 40px',
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                    border: 'none',
                    borderRadius: '18px',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    minWidth: '140px',
                    boxShadow: '0 8px 32px rgba(26, 26, 26, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 16px 48px rgba(26, 26, 26, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 32px rgba(26, 26, 26, 0.2)';
                  }}
                >
                  Login
                </button>

                {/* Register Button */}
                <button 
                  onClick={() => router.push('/register')}
                  style={{
                    padding: '18px 40px',
                    background: 'transparent',
                    border: '2px solid #1a1a1a',
                    borderRadius: '18px',
                    color: '#1a1a1a',
                    fontSize: '18px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                    minWidth: '140px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#1a1a1a';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 16px 48px rgba(26, 26, 26, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#1a1a1a';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Features Grid */}
          <div style={{
            paddingTop: '40px',
            borderTop: '1px solid rgba(0,0,0,0.06)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '32px',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, rgba(255,214,10,0.1) 0%, rgba(255,214,10,0.05) 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                border: '1px solid rgba(255,214,10,0.2)',
                boxShadow: '0 4px 20px rgba(255,214,10,0.1)'
              }}>🛡</div>
              <div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  marginBottom: '4px'
                }}>Secure</div>
                <div style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  lineHeight: '1.4'
                }}>End-to-end encryption</div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, rgba(255,214,10,0.1) 0%, rgba(255,214,10,0.05) 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                border: '1px solid rgba(255,214,10,0.2)',
                boxShadow: '0 4px 20px rgba(255,214,10,0.1)'
              }}>⚡</div>
              <div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  marginBottom: '4px'
                }}>Lightning Fast</div>
                <div style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  lineHeight: '1.4'
                }}>Instant sync & search</div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, rgba(255,214,10,0.1) 0%, rgba(255,214,10,0.05) 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                border: '1px solid rgba(255,214,10,0.2)',
                boxShadow: '0 4px 20px rgba(255,214,10,0.1)'
              }}>✨</div>
              <div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  marginBottom: '4px'
                }}>Intuitive</div>
                <div style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  lineHeight: '1.4'
                }}>Simple yet powerful</div>
              </div>
            </div>
          </div>

          {/* User Status */}
          {user && (
            <div style={{
              marginTop: '40px',
              padding: '20px',
              background: 'linear-gradient(135deg, rgba(255,214,10,0.05) 0%, rgba(255,214,10,0.02) 100%)',
              borderRadius: '20px',
              border: '1px solid rgba(255,214,10,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #FFD60A, #FFC107)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: '700',
                color: '#1a1a1a'
              }}>
                {user.email.charAt(0).toUpperCase()}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1a1a1a'
                }}>
                  Welcome back!
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                  {user.email}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <p style={{
            color: '#9ca3af',
            fontSize: '14px',
            margin: 0,
            fontWeight: '500'
          }}>
            {user ? 'Ready to capture your next big idea?' : 'Join thousands of creators organizing their thoughts'}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg) scale(1); 
          }
          33% { 
            transform: translateY(-20px) rotate(2deg) scale(1.02); 
          }
          66% { 
            transform: translateY(-10px) rotate(-1deg) scale(0.98); 
          }
        }
        
        @media (max-width: 640px) {
          .main-card {
            padding: 40px 30px !important;
          }
          
          .main-title {
            font-size: 36px !important;
          }
          
          .main-subtitle {
            font-size: 18px !important;
          }
          
          .action-buttons {
            flex-direction: column !important;
            gap: 16px !important;
          }
          
          .action-buttons button {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}