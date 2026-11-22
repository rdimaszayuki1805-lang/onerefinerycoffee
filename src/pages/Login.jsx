
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../Dashboard.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) throw loginError;

      const { data: profil, error: profilError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profilError || !profil) {
        await supabase.auth.signOut();
        throw new Error("Akun belum memiliki akses staf.");
      }

      navigate(
        profil.role === "admin" ? "/admin" : "/kasir",
        { replace: true }
      );
    } catch (err) {
      setError(err.message || "Login gagal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="staff-login">
      <div className="staff-login-card">
        <Link to="/" className="staff-back">
          ← Kembali ke Beranda
        </Link>

        <p className="staff-eyebrow">ONE REFINERY COFFEE</p>
        <h1>Masuk ke Sistem</h1>

        <p className="staff-muted">
          Halaman khusus Admin dan Kasir.
        </p>

        <form onSubmit={handleLogin}>
          <label>
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@contoh.com"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
            />
          </label>

          {error && <p className="staff-error">{error}</p>}

          <button
            type="submit"
            className="staff-primary"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </div>
    </main>
  );
}
