
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ProtectedRoute({ role, children }) {
  const [loading, setLoading] = useState(true);
  const [profil, setProfil] = useState(null);

  useEffect(() => {
    let aktif = true;

    async function periksaAkun() {
      setLoading(true);

      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        if (aktif) {
          setProfil(null);
          setLoading(false);
        }
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id, nama, role")
        .eq("id", user.id)
        .single();

      if (aktif) {
        setProfil(error ? null : data);
        setLoading(false);
      }
    }

    periksaAkun();

    const { data: listener } = supabase.auth.onAuthStateChange(
      () => {
        periksaAkun();
      }
    );

    return () => {
      aktif = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <p style={{ padding: 40 }}>Memeriksa akun...</p>;
  }

  if (!profil) {
    return <Navigate to="/login" replace />;
  }

  if (profil.role !== role) {
    return (
      <Navigate
        to={profil.role === "admin" ? "/admin" : "/kasir"}
        replace
      />
    );
  }

  return children;
}
