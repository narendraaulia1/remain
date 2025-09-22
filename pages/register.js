"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from '../lib/supabaseClient';


export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      // 1. Sign up user
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        setMessage(error.message);
        setIsLoading(false);
        return;
      }

      const user = data.user ?? data.session?.user;

      if (!user) {
        setMessage("Gagal mendapatkan user ID setelah sign up.");
        setIsLoading(false);
        return;
      }

      // 2. Insert profile setelah user berhasil dibuat
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([{ id: user.id, email }]); // pastikan id sama dengan auth.users.id

      if (profileError) {
        setMessage("Database error saving new user: " + profileError.message);
        setIsLoading(false);
        return;
      }

      // 3. Berhasil → redirect ke halaman login
setIsSuccess(true);
setMessage("Registrasi berhasil! Mengarahkan ke login...");

setTimeout(() => {
  router.push("/login"); // ← redirect ke login
}, 1500); // jeda 1.5 detik supaya user sempat lihat pesan


    } catch (err) {
      setMessage("Terjadi error: " + err.message);
    } finally {
      setIsLoading(false);
    }
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
      
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '100px',
        height: '100px',
        background: '#ffd60a',
        borderRadius: '50%',
        opacity: 0.1,
        animation: 'float 6s ease-in-out infinite'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '15%',
        width: '150px',
        height: '150px',
        background: '#343a40',
        borderRadius: '20px',
        opacity: 0.05,
        animation: 'float 8s ease-in-out infinite reverse'
      }}></div>

      <div style={{
        width: '100%',
        maxWidth: '400px',
        position: 'relative',
        zIndex: 1
      }}>
        
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #ffd60a, #ffbe0b)',
          }}></div>

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
              Join Remain
            </h1>
            
            <p style={{
              color: '#6c757d',
              margin: 0,
              fontSize: '15px'
            }}>
              Create your account to get started
            </p>
          </div>

          {message && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '10px',
              background: isSuccess ? '#f0fdf4' : '#fff5f5',
              border: isSuccess ? '1px solid #bbf7d0' : '1px solid #fed7d7',
              color: isSuccess ? '#15803d' : '#e53e3e',
              fontSize: '14px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>{isSuccess ? '✅' : '⚠️'}</span>
              <span>{message}</span>
            </div>
          )}

          <div style={{ marginBottom: '30px' }}>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#343a40',
                marginBottom: '8px'
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
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
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#343a40',
                marginBottom: '8px'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
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
              type="button"
              onClick={handleRegister}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '16px',
                background: isLoading 
                  ? 'linear-gradient(135deg, #adb5bd, #6c757d)' 
                  : 'linear-gradient(135deg, #343a40, #495057)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(52, 58, 64, 0.25)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: isLoading ? '0%' : '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #ffd60a, #ffbe0b)',
                transition: 'left 0.3s ease',
                zIndex: 0
              }}></div>
              
              <span style={{ position: 'relative', zIndex: 1 }}>
                {isLoading ? (
                  <>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  'Create Account'
                )}
              </span>
            </button>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{
              color: '#6c757d',
              fontSize: '14px',
              margin: '0 0 10px 0'
            }}>
              Already have an account?{' '}
              <a href="login"><button style={{
                background: 'none',
                border: 'none',
                color: '#343a40',
                textDecoration: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                position: 'relative',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#000000ff';
                e.target.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#343a40';
                e.target.style.textDecoration = 'none';
              }}
              >
                Sign in
                <div style={{
                  position: 'absolute',
                  bottom: '-2px',
                  left: 0,
                  width: '100%',
                  height: '2px',
                  background: '#ffd60a',
                  transform: 'scaleX(0)',
                  transition: 'transform 0.2s ease',
                  transformOrigin: 'left'
                }}></div>
              </button></a>
            </p>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <p style={{
            color: '#6c757d',
            fontSize: '12px',
            margin: 0
          }}>
            By creating an account, you agree to our{' '}
            <button style={{
              background: 'none',
              border: 'none',
              color: '#ffd60a',
              fontSize: '12px',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}>
              Terms of Service
            </button>
            {' '}and{' '}
            <button style={{
              background: 'none',
              border: 'none',
              color: '#ffd60a',
              fontSize: '12px',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}>
              Privacy Policy
            </button>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        input::placeholder {
          color: #adb5bd;
        }
        
        button:hover .hover-effect {
          left: 0;
        }
      `}</style>
    </div>
  );
}
