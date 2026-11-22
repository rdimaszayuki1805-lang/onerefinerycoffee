
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "../Dashboard.css";

const kosong = {
  nama: "",
  kategori: "Kopi Liberika",
  harga: "",
  deskripsi: "",
  gambar: "",
  aktif: true,
};

const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

export default function AdminDashboard() {
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState(kosong);
  const [editId, setEditId] = useState(null);
  const [pesan, setPesan] = useState("");
  const [loading, setLoading] = useState(false);

  async function ambilMenu() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      setPesan(error.message);
      return;
    }

    setMenu(data || []);
  }

  useEffect(() => {
    ambilMenu();
  }, []);

  function ubah(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function simpan(e) {
    e.preventDefault();
    setPesan("");

    if (!form.nama.trim() || Number(form.harga) <= 0) {
      setPesan("Nama dan harga menu wajib diisi dengan benar.");
      return;
    }

    setLoading(true);

    const payload = {
      nama: form.nama.trim(),
      kategori: form.kategori,
      harga: Number(form.harga),
      deskripsi: form.deskripsi,
      gambar: form.gambar,
      aktif: form.aktif,
    };

    const hasil = editId
      ? await supabase
          .from("products")
          .update(payload)
          .eq("id", editId)
      : await supabase.from("products").insert(payload);

    setLoading(false);

    if (hasil.error) {
      setPesan(hasil.error.message);
      return;
    }

    setPesan(editId ? "Menu berhasil diperbarui." : "Menu berhasil ditambahkan.");
    setForm(kosong);
    setEditId(null);
    await ambilMenu();
  }

  function mulaiEdit(item) {
    setEditId(item.id);
    setForm({
      nama: item.nama,
      kategori: item.kategori,
      harga: item.harga,
      deskripsi: item.deskripsi || "",
      gambar: item.gambar || "",
      aktif: item.aktif,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function hapus(item) {
    if (!window.confirm(`Hapus menu "${item.nama}"?`)) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", item.id);

    if (error) {
      setPesan(error.message);
    } else {
      setPesan("Menu berhasil dihapus.");
      ambilMenu();
    }
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
          <h1>Dashboard Admin</h1>
        </div>
        <button onClick={logout} className="staff-outline">
          Keluar
        </button>
      </header>

      <div className="staff-container">
        <section className="staff-card">
          <h2>{editId ? "Edit Menu" : "Tambah Menu Baru"}</h2>

          {pesan && <p className="staff-message">{pesan}</p>}

          <form className="staff-form" onSubmit={simpan}>
            <label>
              Nama Menu
              <input
                required
                value={form.nama}
                onChange={(e) => ubah("nama", e.target.value)}
                placeholder="Contoh: Liberika Latte"
              />
            </label>

            <label>
              Kategori
              <select
                value={form.kategori}
                onChange={(e) => ubah("kategori", e.target.value)}
              >
                <option>Kopi Liberika</option>
                <option>Kopi Susu</option>
                <option>Non Kopi</option>
                <option>Makanan</option>
              </select>
            </label>

            <label>
              Harga (Rp)
              <input
                type="number"
                min="1"
                step="1"
                required
                value={form.harga}
                onChange={(e) => ubah("harga", e.target.value)}
              />
            </label>

            <label>
              URL Foto Menu
              <input
                type="url"
                value={form.gambar}
                onChange={(e) => ubah("gambar", e.target.value)}
                placeholder="https://..."
              />
            </label>

            <label className="staff-wide">
              Deskripsi
              <textarea
                rows="3"
                value={form.deskripsi}
                onChange={(e) => ubah("deskripsi", e.target.value)}
              />
            </label>

            <label className="staff-checkbox">
              <input
                type="checkbox"
                checked={form.aktif}
                onChange={(e) => ubah("aktif", e.target.checked)}
              />
              Menu tersedia untuk pelanggan
            </label>

            <div className="staff-actions staff-wide">
              <button
                type="submit"
                className="staff-primary"
                disabled={loading}
              >
                {loading ? "Menyimpan..." : editId ? "Simpan Perubahan" : "Tambah Menu"}
              </button>

              {editId && (
                <button
                  type="button"
                  className="staff-outline"
                  onClick={() => {
                    setEditId(null);
                    setForm(kosong);
                  }}
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="staff-card">
          <h2>Daftar Menu ({menu.length})</h2>

          <div className="staff-products">
            {menu.map((item) => (
              <article className="staff-product" key={item.id}>
                {item.gambar && (
                  <img src={item.gambar} alt={item.nama} />
                )}

                <div>
                  <small>{item.kategori}</small>
                  <h3>{item.nama}</h3>
                  <p>{rupiah(item.harga)}</p>
                  <small>{item.aktif ? "Tersedia" : "Nonaktif"}</small>

                  <div className="staff-actions">
                    <button
                      className="staff-outline"
                      onClick={() => mulaiEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="staff-danger"
                      onClick={() => hapus(item)}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {menu.length === 0 && <p>Belum ada menu.</p>}
          </div>
        </section>
      </div>
    </main>
  );
}
