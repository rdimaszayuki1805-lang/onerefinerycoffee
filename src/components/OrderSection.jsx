
import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import "../OrderSection.css";

// ==========================================
// FUNGSI BANTUAN
// ==========================================

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

  const tahun = d.getFullYear();
  const bulan = String(d.getMonth() + 1).padStart(2, "0");
  const hari = String(d.getDate()).padStart(2, "0");

  return `${tahun}-${bulan}-${hari}`;
}

function formatTanggal(value) {
  if (!value) return "-";

  const [tahun, bulan, hari] = value.split("-").map(Number);

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(tahun, bulan - 1, hari));
}

function tanggalDanJamValid(tanggal, jam) {
  if (!tanggal || !jam) return null;

  const waktu = new Date(`${tanggal}T${jam}:00`);

  if (Number.isNaN(waktu.getTime())) return null;

  return waktu;
}

const gambarFallback =
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=700&q=85";

// ==========================================
// KOMPONEN UTAMA
// ==========================================

export default function OrderSection() {
  const bagianAtas = useRef(null);
  const sedangMengirim = useRef(false);

  // Tahapan
  const [langkah, setLangkah] = useState(1);

  // Data pelanggan
  const [nama, setNama] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [jenis, setJenis] = useState("Dine In");
  const [nomorMeja, setNomorMeja] = useState("");

  // Jadwal
  const [tanggal, setTanggal] = useState(tanggalLokal());
  const [jam, setJam] = useState("");

  // Data menu database
  const [menuKopi, setMenuKopi] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [errorMenu, setErrorMenu] = useState("");

  // Pencarian
  const [kategori, setKategori] = useState("Semua Menu");
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

  // ==========================================
  // AMBIL MENU DARI SUPABASE
  // ==========================================

  async function ambilMenu() {
    setLoadingMenu(true);
    setErrorMenu("");

    const { data, error: dbError } = await supabase
      .from("products")
      .select("id, nama, kategori, harga, deskripsi, gambar")
      .eq("aktif", true)
      .order("id", { ascending: true });

    if (dbError) {
      setErrorMenu(
        "Gagal mengambil menu dari database: " + dbError.message
      );
    } else {
      setMenuKopi(data || []);
    }

    setLoadingMenu(false);
  }

  useEffect(() => {
    let aktif = true;

    async function muatMenu() {
      const { data, error: dbError } = await supabase
        .from("products")
        .select("id, nama, kategori, harga, deskripsi, gambar")
        .eq("aktif", true)
        .order("id", { ascending: true });

      if (!aktif) return;

      if (dbError) {
        setErrorMenu(
          "Gagal mengambil menu dari database: " +
            dbError.message
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

  // ==========================================
  // SCROLL
  // ==========================================

  function scrollKeAtas() {
    window.requestAnimationFrame(() => {
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

  // ==========================================
  // KATEGORI DAN FILTER
  // ==========================================

  const kategoriMenu = [
    "Semua Menu",
    ...new Set(menuKopi.map((item) => item.kategori)),
  ];

  const produkTampil = menuKopi.filter((produk) => {
    const cocokKategori =
      kategori === "Semua Menu" ||
      produk.kategori === kategori;

    const kata = pencarian.trim().toLowerCase();

    const cocokCari =
      produk.nama.toLowerCase().includes(kata) ||
      (produk.deskripsi || "").toLowerCase().includes(kata);

    return cocokKategori && cocokCari;
  });

  // ==========================================
  // TOTAL KERANJANG
  // ==========================================

  const totalBarang = keranjang.reduce(
    (total, item) => total + item.qty,
    0
  );

  const totalPembayaran = keranjang.reduce(
    (total, item) => total + item.harga * item.qty,
    0
  );

  // ==========================================
  // TAMBAH MENU KE KERANJANG
  // ==========================================

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
                qty: Math.min(item.qty + 1, 50),
              }
            : item
        );
      }

      if (sebelumnya.length >= 30) {
        return sebelumnya;
      }

      return [
        ...sebelumnya,
        {
          id: produk.id,
          nama: produk.nama,
          harga: produk.harga,
          kategori: produk.kategori,
          qty: 1,
        },
      ];
    });

    setError("");
  }

  // ==========================================
  // UBAH JUMLAH MENU
  // ==========================================

  function ubahJumlah(id, perubahan) {
    setKeranjang((sebelumnya) =>
      sebelumnya
        .map((item) =>
          item.id === id
            ? {
                ...item,
                qty: Math.min(item.qty + perubahan, 50),
              }
            : item
        )
        .filter((item) => item.qty > 0)
    );

    setError("");
  }

  // ==========================================
  // VALIDASI LANGKAH 1
  // ==========================================

  function lanjutIdentitas() {
    if (nama.trim().length < 2) {
      setError("Nama pelanggan minimal 2 karakter.");
      return;
    }

    const nomor = whatsapp.replace(/[\s()-]/g, "");

    const validNomor =
      /^(?:08\d{8,11}|\+628\d{8,11}|628\d{8,11})$/.test(
        nomor
      );

    if (!validNomor) {
      setError(
        "Nomor WhatsApp tidak valid. Contoh: 081234567890."
      );
      return;
    }

    pindahLangkah(2);
  }

  // ==========================================
  // VALIDASI LANGKAH 2
  // ==========================================

  function lanjutPesanan() {
    if (keranjang.length === 0) {
      setError(
        "Keranjang masih kosong. Tambahkan minimal satu menu."
      );
      return;
    }

    if (!tanggal) {
      setError("Silakan pilih tanggal pesanan.");
      return;
    }

    if (!jam) {
      setError(
        "Silakan pilih jam kedatangan atau pengambilan."
      );
      return;
    }

    const waktu = tanggalDanJamValid(tanggal, jam);

    if (!waktu) {
      setError("Tanggal atau jam pesanan tidak valid.");
      return;
    }

    if (waktu <= new Date()) {
      setError(
        "Jadwal pesanan sudah lewat. Pilih waktu yang lebih baru."
      );
      return;
    }

    pindahLangkah(3);
  }

  // ==========================================
  // MEMBUAT REKAP PESANAN
  // ==========================================

  function buatRekap(nomor) {
    return [
      "ONE REFINERY COFFEE",
      "BUKTI PENGAJUAN PESANAN",
      "------------------------------",
      `Nomor Pesanan: ${nomor}`,
      `Nama: ${nama.trim()}`,
      `WhatsApp: ${whatsapp}`,
      `Jenis Layanan: ${jenis}`,
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
      `Total Estimasi: ${rupiah(totalPembayaran)}`,
      "Pembayaran: Bayar di Kasir",
      `Catatan: ${catatan.trim() || "-"}`,
      "",
      "Status: Menunggu konfirmasi kasir",
      "Nominal final mengikuti data yang disimpan sistem.",
    ].join("\n");
  }

  // ==========================================
  // KIRIM PESANAN KE DATABASE SUPABASE
  // ==========================================

  async function kirimPesanan() {
    if (sedangMengirim.current) return;

    sedangMengirim.current = true;
    setMengirim(true);
    setError("");

    try {
      if (nama.trim().length < 2) {
        throw new Error("Nama pelanggan tidak valid.");
      }

      if (keranjang.length === 0) {
        throw new Error("Keranjang masih kosong.");
      }

      const waktu = tanggalDanJamValid(tanggal, jam);

      if (!waktu || waktu <= new Date()) {
        throw new Error(
          "Jadwal sudah lewat. Pilih tanggal dan jam yang baru."
        );
      }

      const payload = {
        nama: nama.trim(),
        whatsapp: whatsapp.replace(/[\s()-]/g, ""),
        jenis,
        nomor_meja:
          jenis === "Dine In" ? nomorMeja.trim() : null,
        jadwal: waktu.toISOString(),
        catatan: catatan.trim(),
        items: keranjang.map((item) => ({
          id: item.id,
          qty: item.qty,
        })),
      };

      const { data, error: kirimError } = await supabase.rpc(
        "buat_pesanan",
        { payload }
      );

      if (kirimError) {
        throw kirimError;
      }

      if (!data) {
        throw new Error(
          "Database tidak mengembalikan nomor pesanan."
        );
      }

      const nomor = String(data).slice(0, 8).toUpperCase();

      setNomorPesanan(nomor);
      setRekapTerkirim(buatRekap(nomor));
      setSelesai(true);
      scrollKeAtas();
    } catch (err) {
      setError(
        err.message ||
          "Gagal mengirim pesanan. Silakan coba kembali."
      );
    } finally {
      sedangMengirim.current = false;
      setMengirim(false);
    }
  }

  // ==========================================
  // SALIN REKAP SETELAH PESANAN TERSIMPAN
  // ==========================================

  async function salinRekap() {
    try {
      await navigator.clipboard.writeText(rekapTerkirim);
      window.alert("Rekap pesanan berhasil disalin.");
    } catch {
      window.alert(
        "Gagal menyalin otomatis. Silakan salin teks rekap secara manual."
      );
    }
  }

  // ==========================================
  // RESET FORMULIR
  // ==========================================

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
    setError("");
    setMengirim(false);
    setSelesai(false);
    setNomorPesanan("");
    setRekapTerkirim("");

    ambilMenu();
    scrollKeAtas();
  }

  // ==========================================
  // TAMPILAN
  // ==========================================

  return (
    <section
      className="checkout-section"
      id="pesan"
      ref={bagianAtas}
    >
      <div className="checkout-background" />

      <div className="checkout-container">

        {/* HEADER */}
        <div className="checkout-heading">
          <p className="checkout-eyebrow">
            ONE REFINERY COFFEE / PEMESANAN
          </p>

          <h2>
            Saatnya Menikmati <em>Kopi Favoritmu.</em>
          </h2>

          <p>
            Pilih Dine In atau Takeaway, temukan kopi
            favoritmu, lalu kirim pesanan ke kasir.
          </p>
        </div>

        {/* =====================================
            PESANAN BERHASIL
        ===================================== */}

        {selesai ? (
          <div className="checkout-success">
            <div className="checkout-success-icon">✓</div>

            <h3>Pesanan Berhasil Dikirim!</h3>

            <p>
              Pesananmu sudah tersimpan di sistem
              One Refinery Coffee dan sedang menunggu
              konfirmasi dari kasir.
            </p>

            <div className="checkout-summary">
              <h4>Nomor Pesanan</h4>

              <div className="checkout-summary-total">
                <strong>#{nomorPesanan}</strong>
              </div>
            </div>

            <div className="checkout-info">
              Simpan nomor pesanan ini.
              Pembayaran dilakukan langsung di kasir.
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
                Salin Rekap Pesanan
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

            {/* =====================================
                PROGRESS
            ===================================== */}

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

            {/* =====================================
                LANGKAH 1 - IDENTITAS
            ===================================== */}

            {langkah === 1 && (
              <div className="checkout-body checkout-animate">

                <div className="checkout-title">
                  <span>01 / DATA PELANGGAN</span>
                  <h3>Kenalan Dulu, Yuk!</h3>

                  <p>
                    Isi data pelanggan dan pilih
                    jenis layanan yang kamu inginkan.
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
                    Pilih cara kamu menikmati kopi.
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
                        Nikmati kopi langsung
                        di One Refinery Coffee.
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
                        Pesan kopi untuk dibawa pulang.
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
                    : "Pesanan disiapkan untuk dibawa pulang."}
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
                LANGKAH 2 - PILIH MENU
            ===================================== */}

            {langkah === 2 && (
              <div className="checkout-body checkout-animate">

                <div className="checkout-title">
                  <span>02 / DETAIL PESANAN</span>
                  <h3>Pilih Kopi Favoritmu</h3>

                  <p>
                    Pilih jadwal dan tambahkan
                    menu yang kamu inginkan.
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
                    Pilih waktu yang belum lewat.
                    Jadwal perlu dikonfirmasi oleh kasir.
                  </p>
                </div>

                {/* HEADER KATALOG */}
                <div className="checkout-catalog-header">
                  <div>
                    <h4>Katalog Kopi</h4>
                    <p>Temukan seduhan pilihanmu.</p>
                  </div>

                  <span>{produkTampil.length} menu</span>
                </div>

                {/* PENCARIAN */}
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

                {/* KATEGORI */}
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
                      {errorMenu}

                      <button
                        type="button"
                        onClick={ambilMenu}
                        style={{
                          display: "block",
                          marginTop: 12,
                        }}
                      >
                        Coba Lagi
                      </button>
                    </div>
                  )}

                  {!loadingMenu &&
                    !errorMenu &&
                    menuKopi.length === 0 && (
                      <p className="checkout-empty">
                        Menu belum tersedia.
                        Admin perlu menambahkan menu.
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
                            src={produk.gambar || gambarFallback}
                            alt={produk.nama}
                            loading="lazy"
                            onError={(e) => {
                              if (
                                e.currentTarget.src !== gambarFallback
                              ) {
                                e.currentTarget.src =
                                  gambarFallback;
                              }
                            }}
                          />
                        </div>

                        <div className="checkout-product-info">
                          <small>{produk.kategori}</small>

                          <h5>{produk.nama}</h5>

                          <p>{produk.deskripsi || ""}</p>

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
                    <span>Estimasi Total</span>

                    <strong>
                      {rupiah(totalPembayaran)}
                    </strong>
                  </div>

                  <p className="checkout-hint">
                    Total final dihitung oleh sistem
                    berdasarkan harga menu di database.
                    Pembayaran dilakukan di kasir.
                  </p>
                </div>

                {/* ERROR */}
                {error && (
                  <div
                    className="checkout-error checkout-error-inline"
                    role="alert"
                  >
                    <strong>Periksa Pesanan</strong>
                    <p>{error}</p>
                  </div>
                )}

                {/* NAVIGASI */}
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

            {/* =====================================
                LANGKAH 3 - KONFIRMASI
            ===================================== */}

            {langkah === 3 && (
              <div className="checkout-body checkout-animate">

                <div className="checkout-title">
                  <span>03 / KONFIRMASI PESANAN</span>
                  <h3>Periksa Pesananmu</h3>

                  <p>
                    Pastikan semua data sudah benar
                    sebelum dikirim ke kasir.
                  </p>
                </div>

                {/* INFORMASI PELANGGAN */}
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

                {/* DAFTAR PESANAN */}
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
                    <span>Estimasi Total</span>

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
                    maxLength={500}
                    value={catatan}
                    onChange={(e) =>
                      setCatatan(e.target.value)
                    }
                    placeholder="Contoh: tanpa gula atau sedikit es..."
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
                    Pembayaran dilakukan langsung di
                    kasir One Refinery Coffee.
                  </p>
                </div>

                {/* INFORMASI */}
                <div className="checkout-notice">
                  <strong>Informasi Penting</strong>

                  <p>
                    Klik tombol konfirmasi untuk
                    menyimpan pesanan ke database.
                    Kasir akan menerima pesanan
                    dengan status baru.
                    Pesanan belum dianggap diterima
                    sampai dikonfirmasi oleh kasir.
                  </p>
                </div>

                {/* ERROR PENGIRIMAN */}
                {error && (
                  <div
                    className="checkout-error checkout-error-inline"
                    role="alert"
                  >
                    <strong>Gagal Mengirim Pesanan</strong>
                    <p>{error}</p>
                  </div>
                )}

                {/* NAVIGASI */}
                <div className="checkout-buttons">

                  <button
                    type="button"
                    className="checkout-secondary-btn"
                    disabled={mengirim}
                    onClick={() => pindahLangkah(2)}
                  >
                    ← Kembali
                  </button>

                  <button
                    type="button"
                    className="checkout-main-btn"
                    onClick={kirimPesanan}
                    disabled={mengirim}
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
