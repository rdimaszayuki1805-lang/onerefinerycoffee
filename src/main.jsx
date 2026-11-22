
import React from "react";
import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

// ==========================================
// HALAMAN PUBLIK
// ==========================================

import App from "./App.jsx";
import Pemesanan from "./pages/Pemesanan.jsx";

// ==========================================
// HALAMAN LOGIN
// ==========================================

import Login from "./pages/Login.jsx";

// ==========================================
// DASHBOARD ADMIN DAN KASIR
// ==========================================

import AdminDashboard from "./pages/AdminDashboard.jsx";
import KasirDashboard from "./pages/KasirDashboard.jsx";

// ==========================================
// PROTEKSI HALAMAN
// ==========================================

import ProtectedRoute from "./components/ProtectedRoute.jsx";

// ==========================================
// CSS UTAMA
// ==========================================

import "./index.css";

// ==========================================
// RENDER APLIKASI
// ==========================================

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>

        {/* HALAMAN BERANDA */}
        <Route
          path="/"
          element={<App />}
        />

        {/* HALAMAN PEMESANAN */}
        <Route
          path="/pemesanan"
          element={<Pemesanan />}
        />

        {/* HALAMAN LOGIN ADMIN DAN KASIR */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* DASHBOARD ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* DASHBOARD KASIR */}
        <Route
          path="/kasir"
          element={
            <ProtectedRoute role="kasir">
              <KasirDashboard />
            </ProtectedRoute>
          }
        />

        {/* HALAMAN TIDAK DITEMUKAN */}
        <Route
          path="*"
          element={
            <div
              style={{
                minHeight: "100vh",
                display: "grid",
                placeItems: "center",
                textAlign: "center",
                padding: "30px",
                background: "#21140d",
                color: "#ffffff",
              }}
            >
              <div>
                <h1>404 - Halaman Tidak Ditemukan</h1>

                <p style={{ margin: "18px 0" }}>
                  Maaf, halaman yang kamu cari tidak tersedia.
                </p>

                <Link
                  to="/"
                  style={{
                    color: "#d9af7a",
                    textDecoration: "none",
                    fontWeight: "600",
                  }}
                >
                  ← Kembali ke Beranda
                </Link>
              </div>
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
