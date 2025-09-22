"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [oldPassword, setOldPassword] = useState(""); // password lama
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error"); // "error", "success", "warning"
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
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

    if (!oldPassword || !newPassword) {
      setMessage("Password lama dan baru harus diisi.");
      return;
    }

    // verifikasi password lama
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: oldPassword,
    });

    if (signInError) {
      setMessage("Password lama salah. Silakan coba lagi.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) setMessage("Gagal update password: " + error.message);
    else {
      setMessage("Password berhasil diperbarui.");
      setNewPassword("");
      setOldPassword("");
    }
  };

  const backToDashboard = () => router.push("/dashboard");

  const handleDeleteAccount = () => {
    setShowDeletePopup(true);
  };

  const closeDeletePopup = () => {
    setShowDeletePopup(false);
    setDeletePassword("");
  };

  const deleteAccount = async () => {
    if (!deletePassword) {
      showCustomAlert("Masukkan password untuk verifikasi!", "warning");
      return;
    }
    
    showCustomConfirm("Apakah kamu yakin ingin menghapus akun beserta semua data?", async () => {
      try {
        // 1. Verifikasi password
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: deletePassword,
        });
        if (signInError) {
          showCustomAlert("Password salah, verifikasi gagal!", "error");
          return;
        }

        // 2. Panggil endpoint hapus akun
        const res = await fetch("/api/delete-account", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });

        const result = await res.json();
        if (res.ok) {
          showCustomAlert(result.message, "success");
          setTimeout(async () => {
            await supabase.auth.signOut();
            router.push("/login");
          }, 2000);
        } else {
          showCustomAlert("Gagal hapus akun: " + result.error, "error");
        }
      } catch (err) {
        showCustomAlert("Terjadi error: " + err.message, "error");
      }
    });
  };

  const showCustomAlert = (message, type = "error") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const showCustomConfirm = (message, onConfirm) => {
    setAlertMessage(message);
    setAlertType("confirm");
    setShowAlert(true);
    window.confirmCallback = onConfirm;
  };

  const handleConfirmYes = () => {
    setShowAlert(false);
    if (window.confirmCallback) {
      window.confirmCallback();
      window.confirmCallback = null;
    }
  };

  const handleConfirmNo = () => {
    setShowAlert(false);
    window.confirmCallback = null;
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      padding: "20px", 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      position: "relative"
    }}>
      {/* Decorative Elements */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "10%",
        width: "100px",
        height: "100px",
        background: "linear-gradient(45deg, #ffd700, #ffed4a)",
        borderRadius: "50%",
        opacity: "0.1",
        animation: "float 6s ease-in-out infinite"
      }} />
      <div style={{
        position: "absolute",
        bottom: "20%",
        right: "15%",
        width: "60px",
        height: "60px",
        background: "linear-gradient(45deg, #ffd700, #ffed4a)",
        borderRadius: "50%",
        opacity: "0.1",
        animation: "float 8s ease-in-out infinite reverse"
      }} />

      <div style={{ width: "100%", maxWidth: "450px", position: "relative", zIndex: "1" }}>
        {/* Main Card */}
        <div style={{ 
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px", 
          padding: "40px", 
          boxShadow: "0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,215,0,0.2)", 
          border: "1px solid rgba(255,255,255,0.2)",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Header Accent */}
          <div style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            height: "4px",
            background: "linear-gradient(90deg, #ffd700, #ffed4a, #ffd700)",
            borderRadius: "24px 24px 0 0"
          }} />

          {/* Header */}
          <div style={{ 
            textAlign: "center", 
            marginBottom: "32px", 
            paddingBottom: "20px",
            position: "relative"
          }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, #ffd700, #ffed4a)",
              borderRadius: "50%",
              marginBottom: "16px",
              boxShadow: "0 8px 32px rgba(255,215,0,0.3)"
            }}>
              <span style={{ fontSize: "36px" }}>👤</span>
            </div>
            <h1 style={{ 
              color: "#1a1a1a", 
              fontSize: "32px", 
              fontWeight: "800", 
              margin: "0",
              letterSpacing: "-1px",
              background: "linear-gradient(135deg, #1a1a1a, #333)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Profile
            </h1>
          </div>

          {user ? (
            <>
              {/* User Email Card */}
              <div style={{ 
                background: "linear-gradient(135deg, #f8f9fa, #e9ecef)", 
                padding: "20px", 
                borderRadius: "16px", 
                marginBottom: "28px",
                border: "1px solid rgba(255,215,0,0.1)",
                position: "relative",
                overflow: "hidden"
              }}>
                <div style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  right: "0",
                  height: "2px",
                  background: "linear-gradient(90deg, #ffd700, #ffed4a)"
                }} />
                <p style={{ 
                  margin: "0 0 8px 0", 
                  color: "#666", 
                  fontSize: "14px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  📧 Email Address
                </p>
                <p style={{ 
                  margin: "0", 
                  color: "#1a1a1a", 
                  fontSize: "18px",
                  fontWeight: "700"
                }}>
                  {user.email}
                </p>
              </div>

              {/* Update Password Form */}
              <form onSubmit={updatePassword} style={{ marginBottom: "28px" }}>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#333",
                    fontSize: "14px",
                    fontWeight: "600"
                  }}>
                    🔒 Password Lama
                  </label>
                  <div style={{ position: "relative" }}>
                    <input 
                      type={showOldPassword ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Masukkan password lama"
                      style={{
                        width: "100%", 
                        padding: "16px 50px 16px 20px", 
                        border: "2px solid #e8e8e8",
                        borderRadius: "12px",
                        fontSize: "16px",
                        outline: "none",
                        transition: "all 0.3s ease",
                        boxSizing: "border-box",
                        background: "rgba(255,255,255,0.8)"
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#ffd700";
                        e.target.style.boxShadow = "0 0 0 3px rgba(255,215,0,0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e8e8e8";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      style={{
                        position: "absolute",
                        right: "16px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "#666",
                        cursor: "pointer",
                        fontSize: "20px",
                        padding: "4px"
                      }}
                    >
                      {showOldPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#333",
                    fontSize: "14px",
                    fontWeight: "600"
                  }}>
                    🔑 Password Baru
                  </label>
                  <div style={{ position: "relative" }}>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                      placeholder="Masukkan password baru" 
                      style={{ 
                        width: "100%", 
                        padding: "16px 50px 16px 20px", 
                        border: "2px solid #e8e8e8",
                        borderRadius: "12px",
                        fontSize: "16px",
                        outline: "none",
                        transition: "all 0.3s ease",
                        boxSizing: "border-box",
                        background: "rgba(255,255,255,0.8)"
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#ffd700";
                        e.target.style.boxShadow = "0 0 0 3px rgba(255,215,0,0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e8e8e8";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "16px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "#666",
                        cursor: "pointer",
                        fontSize: "20px",
                        padding: "4px"
                      }}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  style={{ 
                    width: "100%", 
                    padding: "16px", 
                    background: "linear-gradient(135deg, #ffd700, #ffed4a)",
                    color: "#1a1a1a",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    boxShadow: "0 8px 32px rgba(255,215,0,0.3)"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 12px 40px rgba(255,215,0,0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 8px 32px rgba(255,215,0,0.3)";
                  }}
                >
                  🔄 Update Password
                </button>
              </form>

              {/* Message */}
              {message && (
                <div style={{ 
                  background: message.includes("berhasil") ? 
                    "linear-gradient(135deg, #f0f9ff, #e0f2fe)" : 
                    "linear-gradient(135deg, #fef2f2, #fee2e2)", 
                  color: message.includes("berhasil") ? "#059669" : "#dc2626",
                  padding: "16px 20px", 
                  borderRadius: "12px", 
                  marginBottom: "28px",
                  fontSize: "14px",
                  fontWeight: "600",
                  border: `2px solid ${message.includes("berhasil") ? "#bfdbfe" : "#fecaca"}`,
                  position: "relative"
                }}>
                  <span style={{ marginRight: "8px", fontSize: "16px" }}>
                    {message.includes("berhasil") ? "✅" : "❌"}
                  </span>
                  {message}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <button 
                  onClick={backToDashboard} 
                  style={{ 
                    width: "100%", 
                    padding: "16px", 
                    background: "linear-gradient(135deg, #1a1a1a, #333)",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 8px 32px rgba(0,0,0,0.2)";
                  }}
                >
                  ← Dashboard
                </button>

                <button
                  onClick={handleDeleteAccount}
                  style={{ 
                    width: "100%", 
                    padding: "16px", 
                    background: "rgba(220, 38, 38, 0.1)",
                    color: "#dc2626",
                    border: "2px solid #dc2626",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = "#dc2626";
                    e.target.style.color = "white";
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 12px 40px rgba(220, 38, 38, 0.3)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "rgba(220, 38, 38, 0.1)";
                    e.target.style.color = "#dc2626";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  🗑️ Hapus Akun
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{
                width: "60px",
                height: "60px",
                border: "4px solid #ffd700",
                borderTop: "4px solid transparent",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 20px"
              }} />
              <p style={{ color: "#666", margin: "0", fontSize: "16px", fontWeight: "600" }}>
                Memuat data...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Account Popup */}
      {showDeletePopup && (
        <div style={{
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "1000",
          padding: "20px",
          backdropFilter: "blur(10px)"
        }}>
          <div style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            padding: "40px",
            width: "100%",
            maxWidth: "450px",
            boxShadow: "0 25px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,215,0,0.2)",
            position: "relative",
            border: "1px solid rgba(255,255,255,0.2)"
          }}>
            {/* Header Accent */}
            <div style={{
              position: "absolute",
              top: "0",
              left: "0",
              right: "0",
              height: "4px",
              background: "linear-gradient(90deg, #dc2626, #ef4444, #dc2626)",
              borderRadius: "24px 24px 0 0"
            }} />

            <button
              onClick={closeDeletePopup}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "rgba(0,0,0,0.1)",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#666",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.background = "rgba(220, 38, 38, 0.1)";
                e.target.style.color = "#dc2626";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "rgba(0,0,0,0.1)";
                e.target.style.color = "#666";
              }}
            >
              ×
            </button>

            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "80px",
                height: "80px",
                background: "linear-gradient(135deg, #dc2626, #ef4444)",
                borderRadius: "50%",
                marginBottom: "20px",
                boxShadow: "0 8px 32px rgba(220, 38, 38, 0.3)"
              }}>
                <span style={{ fontSize: "36px" }}>⚠️</span>
              </div>
              <h2 style={{ 
                color: "#1a1a1a", 
                fontSize: "28px", 
                fontWeight: "800", 
                margin: "0 0 12px 0",
                letterSpacing: "-0.5px"
              }}>
                Hapus Akun
              </h2>
              <p style={{ 
                color: "#666", 
                fontSize: "16px", 
                margin: "0", 
                lineHeight: "1.6",
                fontWeight: "500"
              }}>
                Tindakan ini tidak dapat dibatalkan.<br/>
                Semua data Anda akan dihapus secara permanen.
              </p>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                color: "#333",
                fontSize: "14px",
                fontWeight: "600"
              }}>
                🔐 Konfirmasi Password
              </label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Masukkan password untuk konfirmasi"
                style={{
                  width: "100%",
                  padding: "16px 20px",
                  border: "2px solid #e8e8e8",
                  borderRadius: "12px",
                  fontSize: "16px",
                  outline: "none",
                  boxSizing: "border-box",
                  background: "rgba(255,255,255,0.8)",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#dc2626";
                  e.target.style.boxShadow = "0 0 0 3px rgba(220, 38, 38, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e8e8e8";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <button
                onClick={closeDeletePopup}
                style={{
                  flex: "1",
                  padding: "16px",
                  background: "rgba(0,0,0,0.05)",
                  color: "#666",
                  border: "2px solid #e8e8e8",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "rgba(0,0,0,0.1)";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "rgba(0,0,0,0.05)";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Batal
              </button>
              <button
                onClick={() => {
                  deleteAccount();
                  closeDeletePopup();
                }}
                style={{
                  flex: "1",
                  padding: "16px",
                  background: "linear-gradient(135deg, #dc2626, #ef4444)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  boxShadow: "0 8px 32px rgba(220, 38, 38, 0.3)"
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 12px 40px rgba(220, 38, 38, 0.4)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 8px 32px rgba(220, 38, 38, 0.3)";
                }}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Alert/Confirm Popup */}
      {showAlert && (
        <div style={{
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "1001",
          padding: "20px",
          backdropFilter: "blur(10px)"
        }}>
          <div style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            padding: "40px",
            width: "100%",
            maxWidth: "450px",
            boxShadow: "0 25px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,215,0,0.2)",
            textAlign: "center",
            border: "1px solid rgba(255,255,255,0.2)",
            position: "relative"
          }}>
            {/* Header Accent */}
            <div style={{
              position: "absolute",
              top: "0",
              left: "0",
              right: "0",
              height: "4px",
              background: `linear-gradient(90deg, ${
                alertType === "error" ? "#dc2626, #ef4444, #dc2626" : 
                alertType === "success" ? "#059669, #10b981, #059669" : 
                alertType === "warning" ? "#d97706, #f59e0b, #d97706" : "#ffd700, #ffed4a, #ffd700"
              })`,
              borderRadius: "24px 24px 0 0"
            }} />

            <div style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "80px",
              height: "80px",
              background: `linear-gradient(135deg, ${
                alertType === "error" ? "#dc2626, #ef4444" : 
                alertType === "success" ? "#059669, #10b981" : 
                alertType === "warning" ? "#d97706, #f59e0b" : "#ffd700, #ffed4a"
              })`,
              borderRadius: "50%",
              marginBottom: "20px",
              boxShadow: `0 8px 32px ${
                alertType === "error" ? "rgba(220, 38, 38, 0.3)" : 
                alertType === "success" ? "rgba(5, 150, 105, 0.3)" : 
                alertType === "warning" ? "rgba(217, 119, 6, 0.3)" : "rgba(255, 215, 0, 0.3)"
              }`
            }}>
              <span style={{ fontSize: "36px" }}>
                {alertType === "error" ? "❌" : 
                 alertType === "success" ? "✅" : 
                 alertType === "warning" ? "⚠️" : "❓"}
              </span>
            </div>

            <p style={{
              color: "#1a1a1a",
              fontSize: "18px",
              lineHeight: "1.6",
              margin: "0 0 32px 0",
              fontWeight: "600"
            }}>
              {alertMessage}
            </p>

            {alertType === "confirm" ? (
              <div style={{ display: "flex", gap: "16px" }}>
                <button
                  onClick={handleConfirmNo}
                  style={{
                    flex: "1",
                    padding: "16px",
                    background: "rgba(0,0,0,0.05)",
                    color: "#666",
                    border: "2px solid #e8e8e8",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = "rgba(0,0,0,0.1)";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "rgba(0,0,0,0.05)";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  Tidak
                </button>
                <button
                  onClick={handleConfirmYes}
                  style={{
                    flex: "1",
                    padding: "16px",
                    background: "linear-gradient(135deg, #dc2626, #ef4444)",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    boxShadow: "0 8px 32px rgba(220, 38, 38, 0.3)"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 12px 40px rgba(220, 38, 38, 0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 8px 32px rgba(220, 38, 38, 0.3)";
                  }}
                >
                  Ya
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAlert(false)}
                style={{
                  padding: "16px 32px",
                  background: `linear-gradient(135deg, ${
                    alertType === "error" ? "#dc2626, #ef4444" : 
                    alertType === "success" ? "#059669, #10b981" : 
                    alertType === "warning" ? "#d97706, #f59e0b" : "#ffd700, #ffed4a"
                  })`,
                  color: alertType === "warning" ? "#1a1a1a" : "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: "pointer",
                  minWidth: "120px",
                  transition: "all 0.3s ease",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  boxShadow: `0 8px 32px ${
                    alertType === "error" ? "rgba(220, 38, 38, 0.3)" : 
                    alertType === "success" ? "rgba(5, 150, 105, 0.3)" : 
                    alertType === "warning" ? "rgba(217, 119, 6, 0.3)" : "rgba(255, 215, 0, 0.3)"
                  }`
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = `0 12px 40px ${
                    alertType === "error" ? "rgba(220, 38, 38, 0.4)" : 
                    alertType === "success" ? "rgba(5, 150, 105, 0.4)" : 
                    alertType === "warning" ? "rgba(217, 119, 6, 0.4)" : "rgba(255, 215, 0, 0.4)"
                  }`;
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = `0 8px 32px ${
                    alertType === "error" ? "rgba(220, 38, 38, 0.3)" : 
                    alertType === "success" ? "rgba(5, 150, 105, 0.3)" : 
                    alertType === "warning" ? "rgba(217, 119, 6, 0.3)" : "rgba(255, 215, 0, 0.3)"
                  }`;
                }}
              >
                OK
              </button>
            )}
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}