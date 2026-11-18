
import React from "react";
import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import App from "./App.jsx";
import Pemesanan from "./pages/Pemesanan.jsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* HALAMAN UTAMA */}
        <Route path="/" element={<App />} />

        {/* HALAMAN PEMESANAN */}
        <Route
          path="/pemesanan"
          element={<Pemesanan />}
        />

        {/* HALAMAN TIDAK DITEMUKAN */}
        <Route
          path="*"
          element={
            <div style={{
              minHeight: "100vh",
              display: "grid",
              placeItems: "center",
              textAlign: "center",
              padding: "30px",
            }}>
              <div>
                <h1>404 - Halaman Tidak Ditemukan</h1>
                <a href="/">Kembali ke Beranda</a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
