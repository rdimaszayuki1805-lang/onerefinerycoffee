
import { useEffect } from "react";
import { Link } from "react-router-dom";

import OrderSection from "../components/OrderSection";
import "../App.css";

function Pemesanan() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title =
      "Pemesanan Kopi | One Refinery Coffee";
  }, []);

  return (
    <div className="website halaman-pemesanan">

      {/* NAVBAR HALAMAN PEMESANAN */}
      <header className="order-page-navbar">

        <Link to="/" className="brand">
          <span className="brand-main">
            ONE<span>REFINERY</span>
          </span>

          <small>COFFEE</small>
        </Link>

        <Link to="/" className="order-back-button">
          ← Kembali ke Beranda
        </Link>

      </header>

      <main>
        {/* FORMULIR PEMESANAN 3 LANGKAH */}
        <OrderSection />
      </main>

      {/* FOOTER KHUSUS PEMESANAN */}
      <footer className="order-page-footer">

        <p>
          © 2026 One Refinery Coffee.
          Seluruh hak cipta dilindungi.
        </p>

        <Link to="/">
          Kembali ke Beranda ↑
        </Link>

      </footer>

    </div>
  );
}

export default Pemesanan;
