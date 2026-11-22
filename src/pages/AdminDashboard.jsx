
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../Dashboard.css";

// ==========================================
// KONFIGURASI
// ==========================================

const BUCKET = "menu-images";
const MAKSIMAL_FOTO = 5 * 1024 * 1024;

const FORMAT_FOTO = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const formAwal = {
  nama: "",
  harga: "",
  deskripsi: "",
  gambar: "",
  aktif: true,
};

const gambarFallback =
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=650&q=85";

function rupiah(nominal) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(nominal) || 0);
}

// ==========================================
// DASHBOARD ADMIN
// ==========================================

export default function AdminDashboard() {
  const navigate = useNavigate();
  const inputFotoRef = useRef(null);
  const urlPreviewRef = useRef(null);

  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState({ ...formAwal });
  const [editId, setEditId] = useState(null);

  const [fileFoto, setFileFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState("");

  const [pencarian, setPencarian] = useState("");

  const [loadingMenu, setLoadingMenu] = useState(true);
  const [menyimpan, setMenyimpan] = useState(false);
  const [menghapusId, setMenghapusId] = useState(null);

  const [pesan, setPesan] = useState("");
  const [tipePesan, setTipePesan] = useState("success");

  // ========================================
  // NOTIFIKASI
  // ========================================

  function notifikasi(teks, tipe = "success") {
    setPesan(teks);
    setTipePesan(tipe);
  }

  // ========================================
  // AMBIL SEMUA MENU
  // ========================================

  async function ambilMenu() {
    setLoadingMenu(true);

    try {
      const { data, error } = await supabase
        .from("products")
        .select(
          "id, nama, harga, deskripsi, gambar, aktif, created_at"
        )
        .order("id", { ascending: false });

      if (error) throw error;

      setMenu(data || []);
    } catch (error) {
      notifikasi(
        "Gagal mengambil menu: " + error.message,
        "error"
      );
    } finally {
      setLoadingMenu(false);
    }
  }

  useEffect(() => {
    let aktif = true;

    async function muatMenu() {
      const { data, error } = await supabase
        .from("products")
        .select(
          "id, nama, harga, deskripsi, gambar, aktif, created_at"
        )
        .order("id", { ascending: false });

      if (!aktif) return;

      if (error) {
        setPesan("Gagal mengambil menu: " + error.message);
        setTipePesan("error");
      } else {
        setMenu(data || []);
      }

      setLoadingMenu(false);
    }

    muatMenu();

    return () => {
      aktif = false;
    };
  }, []);

  // ========================================
  // BERSIHKAN PREVIEW SEMENTARA
  // ========================================

  function bersihkanPreview() {
    if (urlPreviewRef.current) {
      URL.revokeObjectURL(urlPreviewRef.current);
      urlPreviewRef.current = null;
    }
  }

  useEffect(() => {
    return () => {
      if (urlPreviewRef.current) {
        URL.revokeObjectURL(urlPreviewRef.current);
      }
    };
  }, []);

  // ========================================
  // UBAH FIELD FORM
  // ========================================

  function ubahForm(namaField, nilai) {
    setForm((sebelumnya) => ({
      ...sebelumnya,
      [namaField]: nilai,
    }));
  }

  // ========================================
  // PILIH FOTO DARI GALERI
  // ========================================

  function pilihFoto(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!FORMAT_FOTO[file.type]) {
      notifikasi(
        "Format foto harus JPG, PNG, atau WEBP.",
        "error"
      );
      event.target.value = "";
      return;
    }

    if (file.size > MAKSIMAL_FOTO) {
      notifikasi(
        "Ukuran foto maksimal 5 MB.",
        "error"
      );
      event.target.value = "";
      return;
    }

    bersihkanPreview();

    const previewBaru = URL.createObjectURL(file);

    urlPreviewRef.current = previewBaru;

    setFileFoto(file);
    setPreviewFoto(previewBaru);
    setPesan("");
  }

  // ========================================
  // BATALKAN FOTO BARU
  // ========================================

  function batalFoto() {
    bersihkanPreview();

    setFileFoto(null);
    setPreviewFoto(form.gambar || "");

    if (inputFotoRef.current) {
      inputFotoRef.current.value = "";
    }
  }

  // ========================================
  // UPLOAD FOTO KE SUPABASE STORAGE
  // ========================================

  async function uploadFoto(file) {
    const ekstensi = FORMAT_FOTO[file.type];

    if (!ekstensi || file.size > MAKSIMAL_FOTO) {
      throw new Error("Foto tidak valid.");
    }

    const path =
      `produk/${crypto.randomUUID()}.${ekstensi}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      throw new Error(
        "Gagal upload foto: " + error.message
      );
    }

    const { data } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(path);

    if (!data?.publicUrl) {
      throw new Error(
        "URL foto tidak berhasil dibuat."
      );
    }

    return {
      url: data.publicUrl,
      path,
    };
  }

  // ========================================
  // RESET FORM
  // ========================================

  function resetForm() {
    bersihkanPreview();

    setForm({ ...formAwal });
    setEditId(null);
    setFileFoto(null);
    setPreviewFoto("");

    if (inputFotoRef.current) {
      inputFotoRef.current.value = "";
    }
  }

  // ========================================
  // SIMPAN ATAU UPDATE MENU
  // ========================================

  async function simpan(event) {
    event.preventDefault();

    if (menyimpan) return;

    setPesan("");

    const nama = form.nama.trim();
    const harga = Number(form.harga);

    if (nama.length < 2 || nama.length > 100) {
      notifikasi(
        "Nama menu harus 2 sampai 100 karakter.",
        "error"
      );
      return;
    }

    if (
      !Number.isSafeInteger(harga) ||
      harga <= 0 ||
      harga > 2147483647
    ) {
      notifikasi(
        "Harga menu harus berupa angka bulat positif.",
        "error"
      );
      return;
    }

    setMenyimpan(true);

    let uploadBaru = null;

    try {
      let urlFoto = form.gambar || "";

      if (fileFoto) {
        uploadBaru = await uploadFoto(fileFoto);
        urlFoto = uploadBaru.url;
      }

      const payload = {
        nama,
        harga,
        deskripsi: form.deskripsi.trim(),
        gambar: urlFoto,
        aktif: Boolean(form.aktif),
      };

      const hasil =
        editId !== null
          ? await supabase
              .from("products")
              .update(payload)
              .eq("id", editId)
              .select("id")
              .single()
          : await supabase
              .from("products")
              .insert(payload)
              .select("id")
              .single();

      if (hasil.error) throw hasil.error;

      const sedangEdit = editId !== null;

      resetForm();
      await ambilMenu();

      notifikasi(
        sedangEdit
          ? "Menu berhasil diperbarui."
          : "Menu berhasil ditambahkan."
      );
    } catch (error) {
      // Hapus upload baru jika penyimpanan database gagal.
      // Penghapusan membutuhkan izin DELETE pada Storage.
      if (uploadBaru?.path) {
        await supabase.storage
          .from(BUCKET)
          .remove([uploadBaru.path]);
      }

      notifikasi(
        "Gagal menyimpan menu: " + error.message,
        "error"
      );
    } finally {
      setMenyimpan(false);
    }
  }

  // ========================================
  // EDIT MENU
  // ========================================

  function mulaiEdit(item) {
    bersihkanPreview();

    setEditId(item.id);
    setFileFoto(null);

    setForm({
      nama: item.nama,
      harga: String(item.harga),
      deskripsi: item.deskripsi || "",
      gambar: item.gambar || "",
      aktif: item.aktif,
    });

    setPreviewFoto(item.gambar || "");
    setPesan("");

    if (inputFotoRef.current) {
      inputFotoRef.current.value = "";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ========================================
  // HAPUS MENU
  // ========================================

  async function hapus(item) {
    const konfirmasi = window.confirm(
      `Yakin ingin menghapus menu "${item.nama}"?`
    );

    if (!konfirmasi) return;

    setMenghapusId(item.id);
    setPesan("");

    try {
      const { data, error } = await supabase
        .from("products")
        .delete()
        .eq("id", item.id)
        .select("id");

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error(
          "Menu tidak dihapus. Periksa hak akses Admin."
        );
      }

      if (editId === item.id) {
        resetForm();
      }

      await ambilMenu();

      notifikasi("Menu berhasil dihapus.");
    } catch (error) {
      notifikasi(
        "Gagal menghapus menu: " + error.message,
        "error"
      );
    } finally {
      setMenghapusId(null);
    }
  }

  // ========================================
  // LOGOUT
  // ========================================

  async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      notifikasi(
        "Gagal keluar: " + error.message,
        "error"
      );
      return;
    }

    navigate("/login", { replace: true });
  }

  // ========================================
  // PENCARIAN BERDASARKAN NAMA SAJA
  // ========================================

  const menuTampil = menu.filter((item) =>
    item.nama
      .toLowerCase()
      .includes(pencarian.trim().toLowerCase())
  );

  return (
    <main className="staff-page">

      {/* =====================================
          HEADER ADMIN
      ===================================== */}

      <header className="staff-header">
        <div>
          <small>ONE REFINERY COFFEE</small>
          <h1>Dashboard Admin</h1>
        </div>

        <button
          type="button"
          className="staff-outline"
          onClick={logout}
        >
          Keluar
        </button>
      </header>

      <div className="staff-container">

        {/* =====================================
            FORM TAMBAH DAN EDIT MENU
        ===================================== */}

        <section className="staff-card">

          <div className="staff-section-heading">
            <div>
              <p className="staff-section-label">
                MANAJEMEN MENU
              </p>

              <h2>
                {editId !== null
                  ? "Edit Menu"
                  : "Tambah Menu Baru"}
              </h2>

              <p className="staff-section-desc">
                Kelola nama, harga, foto, deskripsi,
                dan ketersediaan menu One Refinery Coffee.
              </p>
            </div>
          </div>

          {pesan && (
            <div
              role="alert"
              className={
                tipePesan === "error"
                  ? "staff-error"
                  : "staff-message"
              }
            >
              {pesan}
            </div>
          )}

          <form
            className="staff-form"
            onSubmit={simpan}
          >

            {/* NAMA MENU */}
            <label>
              Nama Menu *
              <input
                type="text"
                required
                maxLength={100}
                value={form.nama}
                onChange={(e) =>
                  ubahForm("nama", e.target.value)
                }
                placeholder="Contoh: Liberika Latte"
              />
            </label>

            {/* HARGA MENU */}
            <label>
              Harga Menu (Rp) *
              <input
                type="number"
                min="1"
                max="2147483647"
                step="1"
                required
                value={form.harga}
                onChange={(e) =>
                  ubahForm("harga", e.target.value)
                }
                placeholder="Contoh: 30000"
              />

              {Number(form.harga) > 0 && (
                <small className="staff-field-hint">
                  {rupiah(form.harga)}
                </small>
              )}
            </label>

            {/* FOTO DARI GALERI */}
            <div className="staff-photo-field">
              <span className="staff-photo-label">
                Foto Menu
              </span>

              <input
                ref={inputFotoRef}
                id="foto-menu"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="staff-file-input"
                onChange={pilihFoto}
              />

              <label
                htmlFor="foto-menu"
                className="staff-upload-area"
              >
                {previewFoto ? (
                  <img
                    src={previewFoto}
                    alt="Preview foto menu"
                    className="staff-photo-preview"
                  />
                ) : (
                  <div className="staff-upload-placeholder">
                    <span className="staff-upload-icon">
                      +
                    </span>

                    <strong>
                      Pilih Foto dari Galeri
                    </strong>

                    <small>
                      Pilih foto dari HP atau komputer
                    </small>
                  </div>
                )}

                <span className="staff-change-photo">
                  {previewFoto
                    ? "Ganti Foto"
                    : "Pilih Foto"}
                </span>
              </label>

              <small className="staff-field-hint">
                JPG, PNG, atau WEBP. Maksimal 5 MB.
              </small>

              {fileFoto && (
                <div className="staff-selected-file">
                  <span>{fileFoto.name}</span>

                  <button
                    type="button"
                    disabled={menyimpan}
                    onClick={batalFoto}
                  >
                    Batal
                  </button>
                </div>
              )}
            </div>

            {/* DESKRIPSI */}
            <label className="staff-wide">
              Deskripsi Menu
              <textarea
                rows={4}
                maxLength={500}
                value={form.deskripsi}
                onChange={(e) =>
                  ubahForm("deskripsi", e.target.value)
                }
                placeholder="Tuliskan deskripsi menu..."
              />
            </label>

            {/* STATUS KETERSEDIAAN */}
            <label className="staff-checkbox staff-wide">
              <input
                type="checkbox"
                checked={form.aktif}
                onChange={(e) =>
                  ubahForm("aktif", e.target.checked)
                }
              />
              Menu tersedia untuk pelanggan
            </label>

            {/* AKSI FORM */}
            <div className="staff-actions staff-wide">

              <button
                type="submit"
                className="staff-primary"
                disabled={menyimpan}
              >
                {menyimpan
                  ? "Sedang Menyimpan..."
                  : editId !== null
                  ? "Simpan Perubahan"
                  : "Tambah Menu"}
              </button>

              {editId !== null && (
                <button
                  type="button"
                  className="staff-outline"
                  disabled={menyimpan}
                  onClick={() => {
                    resetForm();
                    setPesan("");
                  }}
                >
                  Batal Edit
                </button>
              )}
            </div>
          </form>
        </section>

        {/* =====================================
            DAFTAR MENU
        ===================================== */}

        <section className="staff-card">

          <div className="staff-list-heading">
            <div>
              <p className="staff-section-label">
                DAFTAR PRODUK
              </p>

              <h2>
                Daftar Menu ({menu.length})
              </h2>
            </div>

            <button
              type="button"
              className="staff-outline"
              onClick={ambilMenu}
              disabled={loadingMenu}
            >
              Muat Ulang
            </button>
          </div>

          {/* PENCARIAN */}
          <div className="staff-search">
            <input
              type="search"
              value={pencarian}
              onChange={(e) =>
                setPencarian(e.target.value)
              }
              placeholder="Cari nama menu..."
            />
          </div>

          {/* HASIL MENU */}
          {loadingMenu ? (
            <div className="staff-empty-state">
              Sedang memuat daftar menu...
            </div>
          ) : menuTampil.length === 0 ? (
            <div className="staff-empty-state">
              {menu.length === 0
                ? "Belum ada menu. Tambahkan menu pertama."
                : "Menu tidak ditemukan."}
            </div>
          ) : (
            <div className="staff-products">
              {menuTampil.map((item) => (
                <article
                  className="staff-product"
                  key={item.id}
                >
                  <div className="staff-product-image">
                    <img
                      src={
                        item.gambar ||
                        gambarFallback
                      }
                      alt={item.nama}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          gambarFallback;
                      }}
                    />
                  </div>

                  <div className="staff-product-content">

                    <h3>{item.nama}</h3>

                    <p className="staff-product-price">
                      {rupiah(item.harga)}
                    </p>

                    {item.deskripsi && (
                      <p className="staff-product-desc">
                        {item.deskripsi}
                      </p>
                    )}

                    <span
                      className={`staff-product-status ${
                        item.aktif
                          ? "tersedia"
                          : "nonaktif"
                      }`}
                    >
                      {item.aktif
                        ? "Tersedia"
                        : "Tidak Tersedia"}
                    </span>

                    <div className="staff-actions">

                      <button
                        type="button"
                        className="staff-outline"
                        disabled={menyimpan}
                        onClick={() =>
                          mulaiEdit(item)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="staff-danger"
                        disabled={
                          menyimpan ||
                          menghapusId === item.id
                        }
                        onClick={() =>
                          hapus(item)
                        }
                      >
                        {menghapusId === item.id
                          ? "Menghapus..."
                          : "Hapus"}
                      </button>

                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

        </section>
      </div>
    </main>
  );
}
