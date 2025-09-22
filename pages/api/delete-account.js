// pages/api/delete-account.js
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "User ID dibutuhkan" });

  try {
    // ❗ Pastikan Service Role Key sudah ada di environment variables
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!serviceRoleKey) {
      return res.status(500).json({
        error: "SUPABASE_SERVICE_ROLE_KEY belum di-set di environment variables",
      });
    }

    // Client admin hanya untuk server
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // 1. Hapus semua notes user
    const { error: notesError } = await supabaseAdmin
      .from("notes")
      .delete()
      .eq("user_id", userId);
    if (notesError) throw notesError;

    // 2. Hapus profile user
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .delete()
      .eq("id", userId);
    if (profileError) throw profileError;

    // 3. Hapus user dari auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (authError) throw authError;

    return res.status(200).json({ message: "Akun dan semua data berhasil dihapus." });
  } catch (err) {
    console.error("Delete account error:", err);
    return res.status(500).json({ error: err.message || "Terjadi kesalahan" });
  }
}
