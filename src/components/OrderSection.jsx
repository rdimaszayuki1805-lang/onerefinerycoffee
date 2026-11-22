
import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import "../OrderSection.css";

// ==========================================
// FUNGSI BANTUAN
// ==========================================

const gambarFallback =
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=700&q=85";

function rupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(angka) || 0);
}

function tanggalLokal(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);

  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

function formatTanggal(value) {
  if (!value) return "-";

  const [tahun, bulan, hari] = value
    .split("-")
    .map(Number);

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(tahun, bulan - 1, hari));
}

function waktuValid(tanggal, jam) {
  if (!tanggal || !jam) return null;

  const waktu = new Date(`${tanggal}T${jam}:00`);

  return Number.isNaN(waktu.getTime())
    ? null
    : waktu;
}

// ==========================================
// KOMPONEN PEMESANAN PELANGGAN
// ==========================================

export default function OrderSection() {
  const bagianAtas = useRef(null);
  const sedangMengirim = useRef(false);

  const [langkah, setLangkah] = useState(1);

  // Pelanggan
  const [nama, setNama] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [jenis, setJenis] = useState("Dine In");
  const [nomorMeja, setNomorMeja] = useState("");

  // Jadwal
  const [tanggal, setTanggal] = useState(tanggalLokal());
  const [jam, setJam] = useState("");

  // Menu
  const [menuKopi, setMenuKopi] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [errorMenu, setErrorMenu] = useState("");
  const [pencarian, setPencarian] = useState("");

  // Keranjang
  const [keranjang, setKeranjang] = useState([]);

  // Konfirmasi
  const [catatan, setCatatan] = useState("");
  const [error, setError] = useState("");
  const [mengirim, setMengirim] = useState(false);
  const [selesai, setSelesai] = useState(false);
  const [nomorPesanan, setNomorPesanan] = useState("");
  const [rekapTerkirim, setRekapTerkirim] = useState("");

  // ========================================
  // AMBIL MENU AKTIF DARI SUPABASE
  // ========================================

  async function ambilMenu() {
    setLoadingMenu(true);
    setErrorMenu("");

    try {
      const { data, error: dbError } = await supabase
        .from("products")
        .select("id, nama, harga, deskripsi, gambar")
        .eq("aktif", true)
        .order("id", { ascending: true });

      if (dbError) throw dbError;

      setMenuKopi(data || []);
    } catch (err) {
      setErrorMenu(
        "Gagal memuat menu: " + err.message
      );
    } finally {
      setLoadingMenu(false);
    }
  }

  useEffect(() => {
    let aktif = true;

    async function muatMenu() {
      const { data, error: dbError } = await supabase
        .from("products")
        .select("id, nama, harga, deskripsi, gambar")
        .eq("aktif", true)
        .order("id", { ascending: true });

      if (!aktif) return;

      if (dbError) {
        setErrorMenu(
          "Gagal memuat menu: " + dbError.message
        );
      } else {
        setMenuKopi(data || []);
      }

      setLoadingMenu(false);
    }

    muatMenu();

    return () => {
      aktif = false;
    };
  }, []);

  // ========================================
  // NAVIGASI
  // ========================================

  function scrollKeAtas() {
    requestAnimationFrame(() => {
      bagianAtas.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  function pindahLangkah(tujuan) {
    setError("");
    setLangkah(tujuan);
    scrollKeAtas();
  }

  // ========================================
  // PENCARIAN MENU TANPA KATEGORI
  // ========================================

  const produkTampil = menuKopi.filter((produk) => {
    const kata = pencarian.trim().toLowerCase();

    return (
      produk.nama.toLowerCase().includes(kata) ||
      (produk.deskripsi || "")
        .toLowerCase()
        .includes(kata)
    );
  });

  const totalBarang = keranjang.reduce(
    (hasil, item) => hasil + item.qty,
    0
  );

  const totalPembayaran = keranjang.reduce(
    (hasil, item) =>
      hasil + item.harga * item.qty,
    0
  );

  // ========================================
  // KERANJANG
  // ========================================

  function tambahProduk(produk) {
    setKeranjang((sebelumnya) => {
      const ada = sebelumnya.find(
        (item) => item.id === produk.id
      );

      if (ada) {
        return sebelumnya.map((item) =>
          item.id === produk.id
            ? {
                ...item,
                qty: Math.min(item.qty + 1, 50),
              }
            : item
        );
      }

      if (sebelumnya.length >= 30) return sebelumnya;

      return [
        ...sebelumnya,
        {
          id: produk.id,
          nama: produk.nama,
          harga: produk.harga,
          qty: 1,
        },
      ];
    });

    setError("");
  }

  function ubahJumlah(id, perubahan) {
    setKeranjang((sebelumnya) =>
      sebelumnya
        .map((item) =>
          item.id === id
            ? {
                ...item,
                qty: Math.min(
                  item.qty + perubahan,
                  50
                ),
              }
            : item
        )
        .filter((item) => item.qty > 0)
    );

    setError("");
  }

  // ========================================
  // VALIDASI LANGKAH 1
  // ========================================

  function lanjutIdentitas() {
    if (nama.trim().length < 2) {
      setError(
        "Masukkan nama pelanggan minimal 2 karakter."
      );
      return;
    }

    const nomor = whatsapp.replace(/[\s()-]/g, "");

    if (
      !/^(?:08\d{8,11}|\+628\d{8,11}|628\d{8,11})$/.test(
        nomor
      )
    ) {
      setError(
        "Nomor WhatsApp tidak valid. Contoh: 081234567890."
      );
      return;
    }

    pindahLangkah(2);
  }

  // ========================================
  // VALIDASI LANGKAH 2
  // ========================================

  function lanjutPesanan() {
    if (keranjang.length === 0) {
      setError(
        "Silakan tambahkan minimal satu menu."
      );
      return;
    }

    if (!tanggal || !jam) {
      setError(
        "Tanggal dan jam pesanan wajib diisi."
      );
      return;
    }

    const waktu = waktuValid(tanggal, jam);

    if (!waktu || waktu <= new Date()) {
      setError(
        "Jadwal sudah lewat atau tidak valid. Pilih waktu berikutnya."
      );
      return;
    }

    pindahLangkah(3);
  }

  // ========================================
  // REKAP PESANAN
  // ========================================

  function buatRekap(nomor) {
    return [
      "ONE REFINERY COFFEE",
      "BUKTI PENGAJUAN PESANAN",
      "--------------------------------",
      `Nomor Pesanan: #${nomor}`,
      `Nama: ${nama.trim()}`,
      `WhatsApp: ${whatsapp}`,
      `Layanan: ${jenis}`,
      ...(jenis === "Dine In" && nomorMeja.trim()
        ? [`Nomor Meja: ${nomorMeja.trim()}`]
        : []),
      `Tanggal: ${formatTanggal(tanggal)}`,
      `Jam: ${jam}`,
      "",
      "DAFTAR MENU",
      ...keranjang.map(
        (item) =>
          `${item.nama} x${item.qty} = ${rupiah(
            item.harga * item.qty
          )}`
      ),
      "",
      `Estimasi Total: ${rupiah(totalPembayaran)}`,
      "Pembayaran: Bayar di Kasir",
      `Catatan: ${catatan.trim() || "-"}`,
      "",
      "Status: Menunggu konfirmasi kasir",
      "Harga final mengikuti data pada sistem kasir.",
    ].join("\n");
  }

  // ========================================
  // KIRIM PESANAN KE SUPABASE
  // ========================================

  async function kirimPesanan() {
    if (sedangMengirim.current) return;

    sedangMengirim.current = true;
    setMengirim(true);
    setError("");

    try {
      const nomor = whatsapp.replace(/[\s()-]/g, "");

      if (
        nama.trim().length < 2 ||
        !/^(?:08\d{8,11}|\+628\d{8,11}|628\d{8,11})$/.test(
          nomor
        )
      ) {
        throw new Error(
          "Data pelanggan tidak valid."
        );
      }

      if (keranjang.length === 0) {
        throw new Error("Keranjang kosong.");
      }

      const waktu = waktuValid(tanggal, jam);

      if (!waktu || waktu <= new Date()) {
        throw new Error(
          "Jadwal sudah lewat. Silakan ubah jadwal."
        );
      }

      const payload = {
        nama: nama.trim(),
        whatsapp: nomor,
        jenis,
        nomor_meja:
          jenis === "Dine In"
            ? nomorMeja.trim()
            : null,
        jadwal: waktu.toISOString(),
        catatan: catatan.trim(),
        items: keranjang.map((item) => ({
          id: item.id,
          qty: item.qty,
        })),
      };

      const { data, error: dbError } = await supabase.rpc(
        "buat_pesanan",
        { payload }
      );

      if (dbError) throw dbError;

      if (!data) {
        throw new Error(
          "Nomor pesanan tidak diterima dari database."
        );
      }

      const kode = String(data)
        .slice(0, 8)
        .toUpperCase();

      setNomorPesanan(kode);
      setRekapTerkirim(buatRekap(kode));
      setSelesai(true);
      scrollKeAtas();
    } catch (err) {
      setError(
        err.message ||
          "Gagal mengirim pesanan."
      );
    } finally {
      sedangMengirim.current = false;
      setMengirim(false);
    }
  }

  // ========================================
  // SALIN REKAP
  // ========================================

  async function salinRekap() {
    try {
      await navigator.clipboard.writeText(
        rekapTerkirim
      );

      alert("Rekap pesanan berhasil disalin.");
    } catch {
      alert(
        "Gagal menyalin. Silakan pilih dan salin teks rekap secara manual."
      );
    }
  }

  // ========================================
  // PESAN LAGI
  // ========================================

  function pesanLagi() {
    setLangkah(1);
    setNama("");
    setWhatsapp("");
    setJenis("Dine In");
    setNomorMeja("");
    setTanggal(tanggalLokal());
    setJam("");
    setPencarian("");
    setKeranjang([]);
    setCatatan("");
    setError("");
    setSelesai(false);
    setNomorPesanan("");
    setRekapTerkirim("");

    ambilMenu();
    scrollKeAtas();
  }

  return (
    <section
      className="checkout-section"
      id="pesan"
      ref={bagianAtas}
    >
      <div className="checkout-background" />

      <div className="checkout-container">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="checkout-heading">
          <p className="checkout-eyebrow">
            ONE REFINERY COFFEE / PEMESANAN
          </p>

          <h2>
            Saatnya Menikmati <em>Kopi Favoritmu.</em>
          </h2>

          <p>
            Nikmati kopi langsung di tempat atau
            pesan untuk dibawa pulang.
          </p>
        </div>

        {/* =====================================
            PESANAN BERHASIL
        ===================================== */}

        {selesai ? (
          <div className="checkout-success">
            <div className="checkout-success-icon">
              ✓
            </div>

            <h3>Pesanan Berhasil Dikirim!</h3>

            <p>
              Pesanan sudah tercatat dalam sistem
              One Refinery Coffee dan sedang
              menunggu konfirmasi kasir.
            </p>

            <div className="checkout-summary">
              <h4>Nomor Pesanan</h4>

              <div className="checkout-summary-total">
                <strong>
                  #{nomorPesanan}
                </strong>
              </div>
            </div>

            <div className="checkout-info">
              Pembayaran dilakukan di kasir
              setelah pesanan dikonfirmasi.
            </div>

            <textarea
              readOnly
              value={rekapTerkirim}
              rows={14}
              aria-label="Rekap pesanan"
            />

            <div className="checkout-buttons">

              <button
                type="button"
                className="checkout-secondary-btn"
                onClick={salinRekap}
              >
                Salin Rekap
              </button>

              <button
                type="button"
                className="checkout-main-btn"
                onClick={pesanLagi}
              >
                Buat Pesanan Baru ↗
              </button>

            </div>
          </div>
        ) : (
          <div className="checkout-panel">

            {/* PROGRESS */}
            <div className="checkout-progress">
              {[
                "Identitas Pelanggan",
                "Detail Pesanan",
                "Konfirmasi",
              ].map((judul, index) => (
                <div
                  key={judul}
                  className={`checkout-step ${
                    langkah >= index + 1
                      ? "active"
                      : ""
                  }`}
                >
                  <span className="checkout-step-number">
                    {index + 1}
                  </span>

                  <div>
                    <small>LANGKAH {index + 1}</small>
                    <strong>{judul}</strong>
                  </div>
                </div>
              ))}
            </div>

            {/* =====================================
                LANGKAH 1
            ===================================== */}

            {langkah === 1 && (
              <div className="checkout-body checkout-animate">

                <div className="checkout-title">
                  <span>01 / DATA PELANGGAN</span>

                  <h3>Kenalan Dulu, Yuk!</h3>

                  <p>
                    Lengkapi data sebelum memilih menu.
                  </p>
                </div>

                <div className="checkout-form-grid">

                  <label className="checkout-field">
                    <span>Nama Lengkap *</span>

                    <input
                      type="text"
                      value={nama}
                      maxLength={100}
                      onChange={(e) => {
                        setNama(e.target.value);
                        setError("");
                      }}
                      placeholder="Masukkan nama lengkap"
                      autoComplete="name"
                    />
                  </label>

                  <label className="checkout-field">
                    <span>Nomor WhatsApp *</span>

                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => {
                        setWhatsapp(e.target.value);
                        setError("");
                      }}
                      placeholder="08xxxxxxxxxx"
                      autoComplete="tel"
                    />
                  </label>
                </div>

                <div className="checkout-subsection">
                  <h4>Jenis Pemesanan</h4>

                  <p>
                    Pilih bagaimana kamu ingin
                    menikmati kopi.
                  </p>

                  <div className="checkout-option-grid">

                    <button
                      type="button"
                      className={`checkout-choice ${
                        jenis === "Dine In"
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => {
                        setJenis("Dine In");
                        setError("");
                      }}
                    >
                      <span className="checkout-choice-icon">
                        ☕
                      </span>

                      <strong>Dine In</strong>

                      <small>
                        Nikmati kopi di coffee shop.
                      </small>
                    </button>

                    <button
                      type="button"
                      className={`checkout-choice ${
                        jenis === "Takeaway"
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => {
                        setJenis("Takeaway");
                        setNomorMeja("");
                        setError("");
                      }}
                    >
                      <span className="checkout-choice-icon">
                        ◇
                      </span>

                      <strong>Takeaway</strong>

                      <small>
                        Ambil kopi untuk dibawa pulang.
                      </small>
                    </button>
                  </div>
                </div>

                {jenis === "Dine In" && (
                  <label className="checkout-field">
                    <span>Nomor Meja (Opsional)</span>

                    <input
                      type="text"
                      value={nomorMeja}
                      maxLength={20}
                      onChange={(e) =>
                        setNomorMeja(e.target.value)
                      }
                      placeholder="Contoh: Meja 05"
                    />
                  </label>
                )}

                <div className="checkout-info">
                  {jenis === "Dine In"
                    ? "Pesanan akan dinikmati di tempat."
                    : "Pesanan akan disiapkan untuk dibawa pulang."}
                </div>

                {error && (
                  <div
                    className="checkout-error checkout-error-inline"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                <div className="checkout-buttons right">
                  <button
                    type="button"
                    className="checkout-main-btn"
                    onClick={lanjutIdentitas}
                  >
                    Lanjut ke Detail Pesanan ↗
                  </button>
                </div>

              </div>
            )}

            {/* =====================================
                LANGKAH 2
            ===================================== */}

            {langkah === 2 && (
              <div className="checkout-body checkout-animate">

                <div className="checkout-title">
                  <span>02 / DETAIL PESANAN</span>
                  <h3>Pilih Kopi Favoritmu</h3>

                  <p>
                    Pilih tanggal, jam, dan menu
                    yang ingin kamu pesan.
                  </p>
                </div>

                {/* JADWAL */}
                <div className="checkout-settings">
                  <h4>Pengaturan Pesanan</h4>

                  <div className="checkout-form-grid">

                    <label className="checkout-field">
                      <span>Tanggal Pesanan *</span>

                      <input
                        type="date"
                        min={tanggalLokal()}
                        value={tanggal}
                        onChange={(e) => {
                          setTanggal(e.target.value);
                          setError("");
                        }}
                      />
                    </label>

                    <label className="checkout-field">
                      <span>
                        {jenis === "Dine In"
                          ? "Jam Kedatangan *"
                          : "Jam Pengambilan *"}
                      </span>

                      <input
                        type="time"
                        value={jam}
                        onChange={(e) => {
                          setJam(e.target.value);
                          setError("");
                        }}
                      />
                    </label>
                  </div>

                  <p className="checkout-hint">
                    Jadwal pesanan harus belum lewat.
                    Ketersediaan jadwal dikonfirmasi
                    oleh kasir.
                  </p>
                </div>

                {/* KATALOG */}
                <div className="checkout-catalog-header">
                  <div>
                    <h4>Katalog Menu</h4>

                    <p>
                      Temukan menu favoritmu.
                    </p>
                  </div>

                  <span>
                    {produkTampil.length} menu
                  </span>
                </div>

                {/* PENCARIAN TANPA KATEGORI */}
                <div className="checkout-filter">
                  <input
                    type="search"
                    value={pencarian}
                    onChange={(e) =>
                      setPencarian(e.target.value)
                    }
                    placeholder="Cari menu..."
                    aria-label="Cari menu"
                  />
                </div>

                {/* DAFTAR PRODUK */}
                <div className="checkout-products">

                  {loadingMenu && (
                    <p className="checkout-empty">
                      Sedang memuat menu...
                    </p>
                  )}

                  {!loadingMenu && errorMenu && (
                    <div
                      className="checkout-error"
                      role="alert"
                    >
                      <p>{errorMenu}</p>

                      <button
                        type="button"
                        onClick={ambilMenu}
                      >
                        Coba Lagi
                      </button>
                    </div>
                  )}

                  {!loadingMenu &&
                    !errorMenu &&
                    menuKopi.length === 0 && (
                      <p className="checkout-empty">
                        Belum ada menu yang tersedia.
                      </p>
                    )}

                  {!loadingMenu &&
                    !errorMenu &&
                    menuKopi.length > 0 &&
                    produkTampil.length === 0 && (
                      <p className="checkout-empty">
                        Menu tidak ditemukan.
                      </p>
                    )}

                  {!loadingMenu &&
                    !errorMenu &&
                    produkTampil.map((produk) => (
                      <article
                        className="checkout-product"
                        key={produk.id}
                      >
                        <div className="checkout-product-image">
                          <img
                            src={
                              produk.gambar ||
                              gambarFallback
                            }
                            alt={produk.nama}
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src =
                                gambarFallback;
                            }}
                          />
                        </div>

                        <div className="checkout-product-info">
                          <h5>{produk.nama}</h5>

                          <p>
                            {produk.deskripsi || ""}
                          </p>

                          <div className="checkout-product-bottom">
                            <strong>
                              {rupiah(produk.harga)}
                            </strong>

                            <button
                              type="button"
                              onClick={() =>
                                tambahProduk(produk)
                              }
                            >
                              + Tambah
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}

                </div>

                {/* KERANJANG */}
                <div className="checkout-cart">

                  <div className="checkout-cart-heading">
                    <h4>Keranjang Pesanan</h4>
                    <span>{totalBarang} barang</span>
                  </div>

                  {keranjang.length === 0 ? (
                    <div className="checkout-empty">
                      <span>☕</span>

                      <p>Keranjang masih kosong.</p>

                      <small>
                        Tambahkan menu dari katalog.
                      </small>
                    </div>
                  ) : (
                    <div className="checkout-cart-items">
                      {keranjang.map((item) => (
                        <div
                          className="checkout-cart-item"
                          key={item.id}
                        >
                          <div className="checkout-cart-name">
                            <strong>{item.nama}</strong>

                            <small>
                              {rupiah(item.harga)}
                            </small>
                          </div>

                          <div className="checkout-quantity">
                            <button
                              type="button"
                              aria-label={`Kurangi ${item.nama}`}
                              onClick={() =>
                                ubahJumlah(item.id, -1)
                              }
                            >
                              −
                            </button>

                            <span>{item.qty}</span>

                            <button
                              type="button"
                              aria-label={`Tambah ${item.nama}`}
                              onClick={() =>
                                ubahJumlah(item.id, 1)
                              }
                            >
                              +
                            </button>
                          </div>

                          <strong>
                            {rupiah(
                              item.harga * item.qty
                            )}
                          </strong>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="checkout-total">
                    <span>Estimasi Total</span>

                    <strong>
                      {rupiah(totalPembayaran)}
                    </strong>
                  </div>

                  <p className="checkout-hint">
                    Total final dihitung berdasarkan
                    harga menu pada database.
                    Pembayaran dilakukan di kasir.
                  </p>
                </div>

                {error && (
                  <div
                    className="checkout-error checkout-error-inline"
                    role="alert"
                  >
                    <strong>Periksa Pesanan</strong>
                    <p>{error}</p>
                  </div>
                )}

                <div className="checkout-buttons">

                  <button
                    type="button"
                    className="checkout-secondary-btn"
                    onClick={() =>
                      pindahLangkah(1)
                    }
                  >
                    ← Kembali
                  </button>

                  <button
                    type="button"
                    className="checkout-main-btn"
                    onClick={lanjutPesanan}
                  >
                    Lanjut Konfirmasi ↗
                  </button>

                </div>
              </div>
            )}

            {/* =====================================
                LANGKAH 3
            ===================================== */}

            {langkah === 3 && (
              <div className="checkout-body checkout-animate">

                <div className="checkout-title">
                  <span>03 / KONFIRMASI PESANAN</span>

                  <h3>Periksa Pesananmu</h3>

                  <p>
                    Pastikan data berikut sudah benar
                    sebelum mengirim pesanan ke kasir.
                  </p>
                </div>

                {/* IDENTITAS */}
                <div className="checkout-summary">
                  <h4>Informasi Pelanggan</h4>

                  <div className="checkout-summary-row">
                    <span>Nama</span>
                    <strong>{nama}</strong>
                  </div>

                  <div className="checkout-summary-row">
                    <span>WhatsApp</span>
                    <strong>{whatsapp}</strong>
                  </div>

                  <div className="checkout-summary-row">
                    <span>Jenis Pesanan</span>
                    <strong>{jenis}</strong>
                  </div>

                  {jenis === "Dine In" &&
                    nomorMeja.trim() && (
                      <div className="checkout-summary-row">
                        <span>Nomor Meja</span>
                        <strong>{nomorMeja}</strong>
                      </div>
                    )}

                  <div className="checkout-summary-row">
                    <span>Tanggal</span>

                    <strong>
                      {formatTanggal(tanggal)}
                    </strong>
                  </div>

                  <div className="checkout-summary-row">
                    <span>
                      {jenis === "Dine In"
                        ? "Jam Kedatangan"
                        : "Jam Pengambilan"}
                    </span>

                    <strong>{jam}</strong>
                  </div>
                </div>

                {/* RINCIAN MENU */}
                <div className="checkout-summary">
                  <h4>Daftar Pesanan</h4>

                  {keranjang.map((item) => (
                    <div
                      className="checkout-summary-row"
                      key={item.id}
                    >
                      <span>
                        {item.nama} × {item.qty}
                      </span>

                      <strong>
                        {rupiah(
                          item.harga * item.qty
                        )}
                      </strong>
                    </div>
                  ))}

                  <div className="checkout-summary-total">
                    <span>Estimasi Total</span>

                    <strong>
                      {rupiah(totalPembayaran)}
                    </strong>
                  </div>
                </div>

                {/* CATATAN */}
                <label className="checkout-field">
                  <span>
                    Catatan Tambahan (Opsional)
                  </span>

                  <textarea
                    rows={4}
                    maxLength={500}
                    value={catatan}
                    onChange={(e) =>
                      setCatatan(e.target.value)
                    }
                    placeholder="Contoh: tanpa gula, sedikit es..."
                  />
                </label>

                {/* PEMBAYARAN */}
                <div className="checkout-summary">
                  <h4>Metode Pembayaran</h4>

                  <div className="checkout-payment-options">
                    <label>
                      <input
                        type="radio"
                        name="pembayaran"
                        checked
                        readOnly
                      />

                      <span>Bayar di Kasir</span>
                    </label>
                  </div>

                  <p className="checkout-hint">
                    Pembayaran dilakukan langsung
                    di kasir One Refinery Coffee.
                  </p>
                </div>

                {/* INFORMASI */}
                <div className="checkout-notice">
                  <strong>Informasi Penting</strong>

                  <p>
                    Pesanan akan disimpan ke sistem.
                    Kasir akan memeriksa dan menerima
                    pesanan sebelum diproses.
                  </p>
                </div>

                {/* ERROR */}
                {error && (
                  <div
                    className="checkout-error checkout-error-inline"
                    role="alert"
                  >
                    <strong>
                      Gagal Mengirim Pesanan
                    </strong>

                    <p>{error}</p>
                  </div>
                )}

                {/* TOMBOL */}
                <div className="checkout-buttons">

                  <button
                    type="button"
                    className="checkout-secondary-btn"
                    disabled={mengirim}
                    onClick={() =>
                      pindahLangkah(2)
                    }
                  >
                    ← Kembali
                  </button>

                  <button
                    type="button"
                    className="checkout-main-btn"
                    disabled={mengirim}
                    onClick={kirimPesanan}
                  >
                    {mengirim
                      ? "Mengirim Pesanan..."
                      : "Konfirmasi & Kirim Pesanan ↗"}
                  </button>

                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </section>
  );
}
