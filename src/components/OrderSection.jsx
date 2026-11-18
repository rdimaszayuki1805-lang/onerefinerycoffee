
import { useRef, useState } from "react";
import "../OrderSection.css";

// ==========================================
// DATA MENU ONE REFINERY COFFEE
// Harga dan menu masih contoh
// ==========================================

const menuKopi = [
  {
    id: 1,
    nama: "Liberika Original",
    kategori: "Kopi Liberika",
    harga: 25000,
    deskripsi: "Kopi hitam dengan cita rasa khas biji Liberika.",
    gambar:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=650&q=85",
  },
  {
    id: 2,
    nama: "Liberika Latte",
    kategori: "Kopi Susu",
    harga: 30000,
    deskripsi: "Perpaduan espresso Liberika dan susu yang lembut.",
    gambar:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=650&q=85",
  },
  {
    id: 3,
    nama: "Iced Liberika Coffee",
    kategori: "Kopi Liberika",
    harga: 28000,
    deskripsi: "Kopi Liberika dingin yang menyegarkan.",
    gambar:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=650&q=85",
  },
  {
    id: 4,
    nama: "Liberika Cappuccino",
    kategori: "Kopi Susu",
    harga: 32000,
    deskripsi: "Kopi Liberika dengan susu dan busa lembut.",
    gambar:
      "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=650&q=85",
  },
  {
    id: 5,
    nama: "Liberika Manual Brew",
    kategori: "Kopi Liberika",
    harga: 35000,
    deskripsi: "Seduhan manual untuk menikmati karakter biji Liberika.",
    gambar:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=650&q=85",
  },
  {
    id: 6,
    nama: "Caramel Coffee",
    kategori: "Kopi Susu",
    harga: 33000,
    deskripsi: "Kombinasi kopi, susu, dan rasa karamel.",
    gambar:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=650&q=85",
  },
];

const kategoriMenu = [
  "Semua Menu",
  "Kopi Liberika",
  "Kopi Susu",
];

// ==========================================
// FUNGSI FORMAT RUPIAH
// ==========================================

function rupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);
}

// ==========================================
// FUNGSI TANGGAL LOKAL
// ==========================================

function tanggalLokal(offset = 0) {
  const tanggal = new Date();

  tanggal.setDate(tanggal.getDate() + offset);

  const tahun = tanggal.getFullYear();
  const bulan = String(tanggal.getMonth() + 1).padStart(2, "0");
  const hari = String(tanggal.getDate()).padStart(2, "0");

  return `${tahun}-${bulan}-${hari}`;
}

// ==========================================
// FORMAT TANGGAL UNTUK RINGKASAN
// ==========================================

function formatTanggal(tanggal) {
  if (!tanggal) return "-";

  const [tahun, bulan, hari] = tanggal.split("-").map(Number);

  const date = new Date(tahun, bulan - 1, hari);

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

// ==========================================
// KOMPONEN UTAMA
// ==========================================

function OrderSection() {
  const bagianAtas = useRef(null);
  const areaError = useRef(null);

  // Langkah pemesanan
  const [langkah, setLangkah] = useState(1);

  // Identitas pelanggan
  const [nama, setNama] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [jenis, setJenis] = useState("Dine In");
  const [nomorMeja, setNomorMeja] = useState("");

  // Jadwal pesanan
  const [tanggal, setTanggal] = useState(tanggalLokal());
  const [jam, setJam] = useState("");

  // Katalog menu
  const [kategori, setKategori] = useState("Semua Menu");
  const [pencarian, setPencarian] = useState("");

  // Keranjang
  const [keranjang, setKeranjang] = useState([]);

  // Konfirmasi
  const [catatan, setCatatan] = useState("");
  const [selesai, setSelesai] = useState(false);
  const [error, setError] = useState("");
  const [gagalSalin, setGagalSalin] = useState(false);

  // Pembayaran
  const metodePembayaran = "Bayar di Kasir";

  // ========================================
  // SCROLL KE FORMULIR
  // ========================================

  function scrollKeAtas() {
    requestAnimationFrame(() => {
      bagianAtas.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  // ========================================
  // TAMPILKAN PESAN ERROR
  // ========================================

  function tampilkanError(pesan) {
    setError(pesan);
  }

  // ========================================
  // FILTER KATALOG
  // ========================================

  const produkTampil = menuKopi.filter((produk) => {
    const cocokKategori =
      kategori === "Semua Menu" ||
      produk.kategori === kategori;

    const kata = pencarian.trim().toLowerCase();

    const cocokPencarian =
      produk.nama.toLowerCase().includes(kata) ||
      produk.deskripsi.toLowerCase().includes(kata);

    return cocokKategori && cocokPencarian;
  });

  // ========================================
  // HITUNG TOTAL
  // ========================================

  const totalBarang = keranjang.reduce(
    (total, item) => total + item.qty,
    0
  );

  const subtotal = keranjang.reduce(
    (total, item) => total + item.harga * item.qty,
    0
  );

  const totalPembayaran = subtotal;

  // ========================================
  // TAMBAH PRODUK
  // ========================================

  function tambahProduk(produk) {
    setKeranjang((sebelumnya) => {
      const sudahAda = sebelumnya.find(
        (item) => item.id === produk.id
      );

      if (sudahAda) {
        return sebelumnya.map((item) =>
          item.id === produk.id
            ? {
                ...item,
                qty: item.qty + 1,
              }
            : item
        );
      }

      return [
        ...sebelumnya,
        {
          ...produk,
          qty: 1,
        },
      ];
    });

    setError("");
  }

  // ========================================
  // UBAH JUMLAH PRODUK
  // ========================================

  function ubahJumlah(id, perubahan) {
    setKeranjang((sebelumnya) =>
      sebelumnya
        .map((item) =>
          item.id === id
            ? {
                ...item,
                qty: item.qty + perubahan,
              }
            : item
        )
        .filter((item) => item.qty > 0)
    );

    setError("");
  }

  // ========================================
  // PINDAH LANGKAH
  // ========================================

  function pindahLangkah(tujuan) {
    setError("");
    setLangkah(tujuan);
    scrollKeAtas();
  }

  // ========================================
  // VALIDASI IDENTITAS
  // ========================================

  function lanjutIdentitas() {
    if (nama.trim().length < 2) {
      tampilkanError(
        "Nama pelanggan wajib diisi minimal 2 karakter."
      );
      return;
    }

    const nomor = whatsapp.replace(/[\s()-]/g, "");

    const validWhatsApp =
      /^(?:08\d{8,11}|\+628\d{8,11}|628\d{8,11})$/.test(
        nomor
      );

    if (!validWhatsApp) {
      tampilkanError(
        "Masukkan nomor WhatsApp yang valid, misalnya 081234567890."
      );
      return;
    }

    pindahLangkah(2);
  }

  // ========================================
  // VALIDASI DETAIL PESANAN
  // ========================================

  function lanjutPesanan() {
    // 1. Periksa keranjang
    if (keranjang.length === 0) {
      tampilkanError(
        "Keranjang masih kosong. Pilih minimal satu menu kopi."
      );
      return;
    }

    // 2. Periksa tanggal
    if (!tanggal) {
      tampilkanError(
        "Silakan pilih tanggal pesanan."
      );
      return;
    }

    // 3. Periksa jam
    if (!jam) {
      tampilkanError(
        "Silakan pilih jam kedatangan atau pengambilan."
      );
      return;
    }

    // 4. Buat tanggal dan waktu
    const waktuPesanan = new Date(`${tanggal}T${jam}:00`);

    if (Number.isNaN(waktuPesanan.getTime())) {
      tampilkanError(
        "Tanggal atau jam yang dipilih tidak valid."
      );
      return;
    }

    // 5. Jadwal tidak boleh di masa lalu
    const sekarang = new Date();

    if (waktuPesanan <= sekarang) {
      tampilkanError(
        "Jadwal pesanan sudah lewat. Silakan pilih tanggal atau jam yang lebih baru."
      );
      return;
    }

    // 6. Semua valid
    pindahLangkah(3);
  }

  // ========================================
  // FORMAT REKAP PESANAN
  // ========================================

  const ringkasan = [
    "ONE REFINERY COFFEE",
    "REKAP PESANAN",
    "--------------------------------",
    `Nama Pelanggan: ${nama.trim()}`,
    `WhatsApp: ${whatsapp}`,
    `Jenis Pesanan: ${jenis}`,
    ...(jenis === "Dine In" && nomorMeja.trim()
      ? [`Nomor Meja: ${nomorMeja.trim()}`]
      : []),
    `Tanggal: ${formatTanggal(tanggal)}`,
    `Jam: ${jam}`,
    "",
    "DAFTAR PESANAN",
    ...keranjang.map(
      (item) =>
        `${item.nama} x${item.qty} = ${rupiah(
          item.harga * item.qty
        )}`
    ),
    "",
    `Jumlah Barang: ${totalBarang}`,
    `Total Pembayaran: ${rupiah(totalPembayaran)}`,
    `Metode Pembayaran: ${metodePembayaran}`,
    `Catatan: ${catatan.trim() || "-"}`,
    "",
    "STATUS: BELUM DIKIRIM KE ADMIN",
    "Pembayaran dilakukan di kasir setelah konfirmasi.",
  ].join("\n");

  // ========================================
  // SALIN PESANAN
  // ========================================

  async function salinPesanan() {
    try {
      await navigator.clipboard.writeText(ringkasan);

      setError("");
      setGagalSalin(false);
      setSelesai(true);
      scrollKeAtas();
    } catch {
      setGagalSalin(true);
      setError(
        "Tidak dapat menyalin otomatis. Silakan salin rekap secara manual."
      );
    }
  }

  // ========================================
  // BUAT PESANAN BARU
  // ========================================

  function pesanLagi() {
    setLangkah(1);

    setNama("");
    setWhatsapp("");
    setJenis("Dine In");
    setNomorMeja("");

    setTanggal(tanggalLokal());
    setJam("");

    setKategori("Semua Menu");
    setPencarian("");
    setKeranjang([]);

    setCatatan("");
    setSelesai(false);
    setGagalSalin(false);
    setError("");

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

        {/* ==================================
            HEADER PEMESANAN
        ================================== */}

        <div className="checkout-heading">
          <p className="checkout-eyebrow">
            ONE REFINERY COFFEE / PEMESANAN
          </p>

          <h2>
            Saatnya Menikmati <em>Kopi Favoritmu.</em>
          </h2>

          <p>
            Pilih layanan Dine In atau Takeaway,
            temukan kopi kesukaanmu, dan lengkapi pesanan.
          </p>
        </div>

        {/* ==================================
            PESANAN BERHASIL DISALIN
        ================================== */}

        {selesai ? (
          <div className="checkout-success">
            <div className="checkout-success-icon">
              ✓
            </div>

            <h3>Rekap Pesanan Berhasil Disalin!</h3>

            <p>
              Rekap pesanan sudah disalin.
              Pesanan belum dikirim ke admin dan
              belum tercatat di sistem kasir.
            </p>

            <textarea
              readOnly
              value={ringkasan}
              rows={15}
              aria-label="Rekap pesanan"
            />

            <div className="checkout-buttons">
              <button
                type="button"
                className="checkout-secondary-btn"
                onClick={() => {
                  setSelesai(false);
                  pindahLangkah(3);
                }}
              >
                Lihat Kembali
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

            {/* ==================================
                INDIKATOR LANGKAH
            ================================== */}

            <div className="checkout-progress">
              {[
                "Identitas Pelanggan",
                "Detail Pesanan",
                "Konfirmasi",
              ].map((judul, index) => (
                <div
                  key={judul}
                  className={`checkout-step ${
                    langkah >= index + 1 ? "active" : ""
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

            {/* ==================================
                LANGKAH 1 - IDENTITAS
            ================================== */}

            {langkah === 1 && (
              <div className="checkout-body checkout-animate">

                <div className="checkout-title">
                  <span>01 / DATA PELANGGAN</span>
                  <h3>Kenalan Dulu, Yuk!</h3>

                  <p>
                    Lengkapi informasi berikut
                    sebelum memilih menu kopi.
                  </p>
                </div>

                <div className="checkout-form-grid">

                  <label className="checkout-field">
                    <span>Nama Lengkap *</span>

                    <input
                      type="text"
                      value={nama}
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
                    Pilih cara menikmati kopi favoritmu.
                  </p>

                  <div className="checkout-option-grid">

                    <button
                      type="button"
                      className={`checkout-choice ${
                        jenis === "Dine In" ? "selected" : ""
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
                        Nikmati kopi langsung di coffee shop.
                      </small>
                    </button>

                    <button
                      type="button"
                      className={`checkout-choice ${
                        jenis === "Takeaway" ? "selected" : ""
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
                      onChange={(e) =>
                        setNomorMeja(e.target.value)
                      }
                      placeholder="Contoh: Meja 05"
                      maxLength={20}
                    />
                  </label>
                )}

                <div className="checkout-info">
                  {jenis === "Dine In"
                    ? "Pesanan akan dinikmati langsung di One Refinery Coffee."
                    : "Pesanan akan disiapkan untuk diambil dan dibawa pulang."}
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

            {/* ==================================
                LANGKAH 2 - DETAIL PESANAN
            ================================== */}

            {langkah === 2 && (
              <div className="checkout-body checkout-animate">

                <div className="checkout-title">
                  <span>02 / DETAIL PESANAN</span>
                  <h3>Pilih Kopi Favoritmu</h3>

                  <p>
                    Jelajahi menu dan tambahkan
                    kopi kesukaanmu ke keranjang.
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
                    Pilih tanggal dan jam yang belum lewat.
                    Jadwal masih perlu dikonfirmasi coffee shop.
                  </p>
                </div>

                {/* KATALOG */}
                <div className="checkout-catalog-header">
                  <div>
                    <h4>Katalog Kopi</h4>
                    <p>Temukan seduhan pilihanmu.</p>
                  </div>

                  <span>{produkTampil.length} menu</span>
                </div>

                <div className="checkout-filter">
                  <input
                    type="search"
                    value={pencarian}
                    onChange={(e) =>
                      setPencarian(e.target.value)
                    }
                    placeholder="Cari menu kopi..."
                    aria-label="Cari menu kopi"
                  />
                </div>

                <div className="checkout-categories">
                  {kategoriMenu.map((item) => (
                    <button
                      type="button"
                      key={item}
                      className={
                        kategori === item ? "selected" : ""
                      }
                      onClick={() => setKategori(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                {/* PRODUK */}
                <div className="checkout-products">

                  {produkTampil.length === 0 && (
                    <p className="checkout-empty">
                      Tidak ada menu yang sesuai pencarian.
                    </p>
                  )}

                  {produkTampil.map((produk) => (
                    <article
                      className="checkout-product"
                      key={produk.id}
                    >

                      <div className="checkout-product-image">
                        <img
                          src={produk.gambar}
                          alt={produk.nama}
                          loading="lazy"
                        />
                      </div>

                      <div className="checkout-product-info">
                        <small>{produk.kategori}</small>

                        <h5>{produk.nama}</h5>

                        <p>{produk.deskripsi}</p>

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
                        Pilih menu dari katalog di atas.
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
                            {rupiah(item.harga * item.qty)}
                          </strong>

                        </div>
                      ))}

                    </div>
                  )}

                  <div className="checkout-total">
                    <span>Total Pembayaran</span>

                    <strong>
                      {rupiah(totalPembayaran)}
                    </strong>
                  </div>

                  <p className="checkout-hint">
                    Pembayaran dilakukan langsung
                    di kasir setelah pesanan dikonfirmasi.
                  </p>

                </div>

                {/* ERROR DI DEKAT TOMBOL */}
                {error && (
                  <div
                    className="checkout-error checkout-error-inline"
                    role="alert"
                    ref={areaError}
                  >
                    <strong>Periksa Pesanan</strong>
                    <p>{error}</p>
                  </div>
                )}

                {/* TOMBOL LANGKAH 2 */}
                <div className="checkout-buttons">

                  <button
                    type="button"
                    className="checkout-secondary-btn"
                    onClick={() => pindahLangkah(1)}
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

            {/* ==================================
                LANGKAH 3 - KONFIRMASI
            ================================== */}

            {langkah === 3 && (
              <div className="checkout-body checkout-animate">

                <div className="checkout-title">
                  <span>03 / KONFIRMASI PESANAN</span>
                  <h3>Periksa Pesananmu</h3>

                  <p>
                    Pastikan semua data dan menu
                    pesanan sudah sesuai.
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

                  {jenis === "Dine In" && nomorMeja && (
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

                {/* DETAIL PRODUK */}
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
                        {rupiah(item.harga * item.qty)}
                      </strong>
                    </div>
                  ))}

                  <div className="checkout-summary-total">
                    <span>Total Pembayaran</span>
                    <strong>
                      {rupiah(totalPembayaran)}
                    </strong>
                  </div>
                </div>

                {/* CATATAN */}
                <label className="checkout-field">
                  <span>Catatan Tambahan (Opsional)</span>

                  <textarea
                    rows="4"
                    value={catatan}
                    onChange={(e) =>
                      setCatatan(e.target.value)
                    }
                    placeholder="Contoh: tanpa gula, es sedikit, atau permintaan lainnya..."
                  />
                </label>

                {/* PEMBAYARAN */}
                <div className="checkout-summary">
                  <h4>Metode Pembayaran</h4>

                  <div className="checkout-payment-options">
                    <label>
                      <input
                        type="radio"
                        checked
                        readOnly
                        name="pembayaran"
                      />
                      <span>Bayar di Kasir</span>
                    </label>
                  </div>

                  <p className="checkout-hint">
                    Pembayaran dilakukan secara langsung
                    di kasir One Refinery Coffee.
                  </p>
                </div>

                <div className="checkout-notice">
                  <strong>Informasi Penting</strong>

                  <p>
                    Rekap yang disalin belum otomatis
                    dikirim ke admin dan belum tercatat
                    sebagai pesanan yang diterima.
                  </p>
                </div>

                {gagalSalin && error && (
                  <div
                    className="checkout-error checkout-error-inline"
                    role="alert"
                  >
                    {error}
                    <textarea
                      readOnly
                      value={ringkasan}
                      rows={10}
                      style={{ width: "100%", marginTop: 12 }}
                    />
                  </div>
                )}

                <div className="checkout-buttons">

                  <button
                    type="button"
                    className="checkout-secondary-btn"
                    onClick={() => pindahLangkah(2)}
                  >
                    ← Kembali
                  </button>

                  <button
                    type="button"
                    className="checkout-main-btn"
                    onClick={salinPesanan}
                  >
                    Salin Rekap Pesanan ↗
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

export default OrderSection;
