
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "../Dashboard.css";

const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

export default function KasirDashboard() {
  const [pesanan, setPesanan] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function ambilPesanan() {
    const { data, error: err } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (err) {
      setError(err.message);
      return;
    }

    setPesanan(data || []);
  }

  useEffect(() => {
    ambilPesanan();

    // Refresh berkala ketika dashboard kasir terbuka
    const interval = setInterval(ambilPesanan, 10000);

    return () => clearInterval(interval);
  }, []);

  async function ubahStatus(order, status, bayar = order.sudah_bayar) {
    setLoading(true);
    setError("");

    const { error: err } = await supabase.rpc("proses_pesanan", {
      p_id: order.id,
      p_status: status,
      p_sudah_bayar: bayar,
    });

    if (err) setError(err.message);

    await ambilPesanan();
    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <main className="staff-page">
      <header className="staff-header">
        <div>
          <small>ONE REFINERY COFFEE</small>
          <h1>Dashboard Kasir</h1>
        </div>

        <button className="staff-outline" onClick={logout}>
          Keluar
        </button>
      </header>

      <div className="staff-container">
        <div className="staff-toolbar">
          <h2>Tagihan dan Pesanan Masuk</h2>
          <button className="staff-outline" onClick={ambilPesanan}>
            <icon name="refresh-cw" inline/> Muat Ulang
          </button>
        </div>

        {error && <p className="staff-error">{error}</p>}

        <div className="staff-orders">
          {pesanan.map((order) => (
            <article className="staff-card" key={order.id}>
              <div className="staff-order-head">
                <div>
                  <small>#{order.id.slice(0, 8).toUpperCase()}</small>
                  <h3>{order.nama_pelanggan}</h3>
                  <p>{order.jenis} · {order.whatsapp}</p>
                  <p>
                    {new Date(order.jadwal).toLocaleString("id-ID")}
                  </p>
                </div>
                <span className="staff-status">{order.status}</span>
              </div>

              {order.nomor_meja && (
                <p>Meja: {order.nomor_meja}</p>
              )}

              <div className="staff-order-items">
                {(Array.isArray(order.items) ? order.items : []).map(
                  (item, index) => (
                    <div key={`${item.id}-${index}`}>
                      <span>{item.nama} × {item.qty}</span>
                      <strong>{rupiah(item.harga * item.qty)}</strong>
                    </div>
                  )
                )}
              </div>

              {order.catatan && <p>Catatan: {order.catatan}</p>}

              <div className="staff-order-total">
                <span>Total Tagihan</span>
                <strong>{rupiah(order.total)}</strong>
              </div>

              <p>
                Pembayaran:{" "}
                <strong>
                  {order.sudah_bayar ? "Lunas" : "Belum Bayar"}
                </strong>
              </p>

              <div className="staff-actions">
                {order.status === "baru" && (
                  <>
                    <button
                      disabled={loading}
                      className="staff-primary"
                      onClick={() => ubahStatus(order, "diterima")}
                    >
                      Terima Pesanan
                    </button>
                    <button
                      disabled={loading}
                      className="staff-danger"
                      onClick={() => ubahStatus(order, "ditolak")}
                    >
                      Tolak
                    </button>
                  </>
                )}

                {order.status === "diterima" && (
                  <button
                    disabled={loading}
                    className="staff-primary"
                    onClick={() => ubahStatus(order, "diproses")}
                  >
                    Proses Pesanan
                  </button>
                )}

                {!order.sudah_bayar &&
                  ["baru", "diterima", "diproses"].includes(order.status) && (
                    <button
                      disabled={loading}
                      className="staff-outline"
                      onClick={() =>
                        ubahStatus(order, order.status, true)
                      }
                    >
                      Tandai Lunas
                    </button>
                  )}

                {order.status === "diproses" && (
                  <button
                    disabled={loading || !order.sudah_bayar}
                    className="staff-primary"
                    onClick={() => ubahStatus(order, "selesai")}
                  >
                    Selesaikan Pesanan
                  </button>
                )}
              </div>
            </article>
          ))}

          {pesanan.length === 0 && (
            <p>Belum ada pesanan masuk.</p>
          )}
        </div>
      </div>
    </main>
  );
}
