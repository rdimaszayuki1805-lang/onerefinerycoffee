
import { useEffect, useState } from "react";
import "./App.css";

// ======================================================
// ONE REFINERY COFFEE
// LANDING PAGE EDUKASI KOPI LIBERIKA
// ======================================================

// Semua foto menggunakan URL langsung.
// Tidak menggunakan gambar kemasan kopi bermerek lain.

const FOTO = {
  // LOGO RESMI ONE REFINERY - DARI PENGGUNA
  logo:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0z_iOJnXfXNFa4aqJ85v0o5YNwmb28S40G-B3LmvqOg&s=10",

  // HERO: SUASANA KOPI
  hero:
    "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=2000&q=90",

  // PERKENALAN: FOTO BIJI KOPI, TANPA KEMASAN
  perkenalan:
    "https://images.unsplash.com/photo-1769437031391-25445ec090ab?auto=format&fit=crop&w=1600&q=90",

  // PERJALANAN: FOTO BIJI KOPI, TANPA KEMASAN
  perjalanan:
    "https://images.unsplash.com/photo-1643410223482-113e58195261?auto=format&fit=crop&w=1600&q=90",

  // DETAIL CIRI KHAS
  biji:
    "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1600&q=90",

  // ILUSTRASI LINGKUNGAN TROPIS
  habitat:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Coffee%20tree%20chary.jpg",

  // SEDUHAN KOPI
  seduhan:
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=90",

  // PENUTUP
  penutup:
    "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=2000&q=90",
};

// ======================================================
// DATA NAVIGASI
// ======================================================

const NAVIGASI = [
  { nama: "Beranda", link: "#beranda" },
  { nama: "Tentang", link: "#tentang" },
  { nama: "Perjalanan", link: "#perjalanan" },
  { nama: "Ciri Khas", link: "#ciri-khas" },
  { nama: "Habitat", link: "#habitat" },
  { nama: "Perbandingan", link: "#perbandingan" },
  { nama: "Testimoni", link: "#testimoni" },
];

// ======================================================
// PERJALANAN LIBERIKA
// ======================================================

const PERJALANAN = [
  {
    nomor: "01",
    waktu: "ASAL USUL",
    judul: "Berawal dari Afrika",
    deskripsi:
      "Kopi Liberika berasal dari wilayah tropis Afrika Barat dan Tengah. Nama Liberika berkaitan dengan Liberia, salah satu wilayah yang dikenal dalam sejarah tanaman kopi ini.",
  },
  {
    nomor: "02",
    waktu: "ABAD KE-19",
    judul: "Menyebar ke Asia Tenggara",
    deskripsi:
      "Liberika diperkenalkan ke sejumlah wilayah Asia Tenggara sebagai salah satu alternatif tanaman kopi ketika penyakit tanaman menjadi tantangan bagi perkebunan.",
  },
  {
    nomor: "03",
    waktu: "DI INDONESIA",
    judul: "Tumbuh di Tanah Nusantara",
    deskripsi:
      "Liberika kemudian berkembang di berbagai wilayah Indonesia, termasuk daerah dataran rendah. Provinsi Jambi merupakan salah satu daerah yang dikenal dengan pengembangan kopi Liberika.",
  },
  {
    nomor: "04",
    waktu: "MASA KINI",
    judul: "Identitas yang Semakin Dikenal",
    deskripsi:
      "Karakter biji, aroma, dan cita rasa yang khas membuat Liberika semakin menarik untuk dikenalkan kepada masyarakat dan penikmat kopi.",
  },
];

// ======================================================
// CIRI KHAS LIBERIKA
// ======================================================

const CIRI_KHAS = [
  {
    nomor: "01",
    ikon: "◈",
    judul: "Bentuk Biji",
    deskripsi:
      "Biji Liberika umumnya memiliki ukuran relatif besar, bentuk memanjang, serta karakter fisik berbeda dari Arabika dan Robusta.",
  },
  {
    nomor: "02",
    ikon: "✦",
    judul: "Aroma yang Unik",
    deskripsi:
      "Liberika dapat menghadirkan aroma fruity, floral, woody, maupun earthy bergantung pada asal dan pengolahan kopinya.",
  },
  {
    nomor: "03",
    ikon: "☕",
    judul: "Karakter Cita Rasa",
    deskripsi:
      "Profil rasa Liberika cukup beragam. Proses pascapanen, tingkat sangrai, dan metode seduh turut memengaruhi karakter akhirnya.",
  },
  {
    nomor: "04",
    ikon: "❋",
    judul: "Pohon yang Besar",
    deskripsi:
      "Tanaman Liberika dapat tumbuh tinggi dengan ukuran daun relatif lebar dan bentuk pertumbuhan yang khas.",
  },
];

// ======================================================
// CARA HIDUP POHON LIBERIKA
// ======================================================

const HABITAT = [
  {
    nomor: "01",
    judul: "Iklim Tropis",
    deskripsi:
      "Liberika dapat tumbuh pada lingkungan tropis yang hangat dengan kelembapan dan curah hujan yang sesuai.",
  },
  {
    nomor: "02",
    judul: "Lingkungan Dataran Rendah",
    deskripsi:
      "Liberika dapat dibudidayakan di dataran rendah. Kesesuaian lahan tetap bergantung pada suhu, kondisi tanah, serta pengelolaan air.",
  },
  {
    nomor: "03",
    judul: "Tanah dan Ketersediaan Air",
    deskripsi:
      "Pada daerah tertentu, Liberika dibudidayakan pada lahan gambut dengan pengelolaan air dan nutrisi yang tepat.",
  },
  {
    nomor: "04",
    judul: "Perawatan dan Pemanenan",
    deskripsi:
      "Perawatan tanaman meliputi pemilihan bibit, pemupukan, pemangkasan, pengendalian hama, serta pemanenan buah yang telah matang.",
  },
];

// ======================================================
// JENIS KOPI
// ======================================================

const JENIS_KOPI = [
  {
    nomor: "01",
    nama: "LIBERIKA",
    namaIlmiah: "Coffea liberica",
    inisial: "L",
    label: "UNIQUE & DISTINCTIVE",
    deskripsi:
      "Jenis kopi dengan karakter biji yang khas dan potensi profil aroma serta rasa yang berbeda.",
  },
  {
    nomor: "02",
    nama: "ROBUSTA",
    namaIlmiah: "Coffea canephora",
    inisial: "R",
    label: "STRONG & INTENSE",
    deskripsi:
      "Dikenal dengan cita rasa yang cenderung kuat, body tebal, dan kandungan kafein relatif tinggi.",
  },
  {
    nomor: "03",
    nama: "ARABIKA",
    namaIlmiah: "Coffea arabica",
    inisial: "A",
    label: "COMPLEX & AROMATIC",
    deskripsi:
      "Dikenal dengan keragaman cita rasa, aroma kompleks, serta karakter keasaman yang dapat menonjol.",
  },
];

// ======================================================
// TABEL PERBANDINGAN
// ======================================================

const PERBANDINGAN = [
  {
    aspek: "Nama ilmiah",
    liberika: "Coffea liberica",
    robusta: "Coffea canephora",
    arabika: "Coffea arabica",
  },
  {
    aspek: "Lingkungan tumbuh",
    liberika: "Tropis hangat, termasuk dataran rendah",
    robusta: "Umumnya dataran rendah hingga menengah",
    arabika: "Umumnya dataran lebih tinggi dan relatif sejuk",
  },
  {
    aspek: "Bentuk biji",
    liberika: "Relatif besar dan memanjang",
    robusta: "Relatif kecil, cenderung membulat",
    arabika: "Umumnya berbentuk oval",
  },
  {
    aspek: "Karakter aroma",
    liberika: "Dapat fruity, floral, atau woody",
    robusta: "Dapat nutty, earthy, atau cokelat",
    arabika: "Dapat floral, fruity, dan kompleks",
  },
  {
    aspek: "Cita rasa",
    liberika: "Khas, dapat fruity hingga earthy",
    robusta: "Cenderung kuat dan pahit",
    arabika: "Beragam, sering dengan keasaman menonjol",
  },
  {
    aspek: "Kandungan kafein",
    liberika: "Bervariasi",
    robusta: "Umumnya lebih tinggi daripada Arabika",
    arabika: "Umumnya lebih rendah daripada Robusta",
  },
];

// ======================================================
// TESTIMONI
// Catatan: ini contoh ilustrasi, bukan ulasan asli.
// ======================================================

const TESTIMONI = [
  {
    nama: "Contoh Pengunjung 01",
    keterangan: "Ilustrasi pengalaman",
    isi:
      "Saya baru mengetahui bahwa kopi Liberika mempunyai sejarah panjang dan karakteristik yang berbeda dari kopi yang biasa saya kenal.",
  },
  {
    nama: "Contoh Pengunjung 02",
    keterangan: "Ilustrasi pengalaman",
    isi:
      "Penjelasan mengenai cara hidup pohon Liberika membuat saya lebih memahami bagaimana lingkungan memengaruhi pertumbuhan tanaman kopi.",
  },
  {
    nama: "Contoh Pengunjung 03",
    keterangan: "Ilustrasi pengalaman",
    isi:
      "Perbandingan antara Liberika, Robusta, dan Arabika membantu saya mengenali perbedaan ketiga jenis kopi tersebut.",
  },
];

// ======================================================
// KOMPONEN FOTO
// ======================================================

function Gambar({
  src,
  alt,
  className = "",
  loading = "lazy",
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      onError={(event) => {
        const img = event.currentTarget;

        img.onerror = null;

        // Foto cadangan apabila link utama gagal.
        img.src = FOTO.seduhan;
      }}
    />
  );
}

// ======================================================
// JUDUL SECTION
// ======================================================

function JudulBagian({
  nomor,
  label,
  judul,
  aksen,
  deskripsi,
  center = false,
  dark = false,
}) {
  return (
    <div
      className={`section-heading reveal ${
        center ? "center" : ""
      } ${dark ? "light" : ""}`}
    >
      <span className="eyebrow">
        {nomor} — {label}
      </span>

      <h2>
        {judul}
        <br />
        <em>{aksen}</em>
      </h2>

      {deskripsi && <p>{deskripsi}</p>}
    </div>
  );
}

// ======================================================
// MAIN APP
// ======================================================

export default function App() {
  const [menuTerbuka, setMenuTerbuka] = useState(false);
  const [sudahScroll, setSudahScroll] = useState(false);
  const [testimoniAktif, setTestimoniAktif] = useState(0);

  // NAVBAR SCROLL
  useEffect(() => {
    const cekScroll = () => {
      setSudahScroll(window.scrollY > 45);
    };

    cekScroll();

    window.addEventListener("scroll", cekScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", cekScroll);
    };
  }, []);

  // ANIMASI SCROLL
  useEffect(() => {
    const elemen = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
      elemen.forEach((item) => {
        item.classList.add("visible");
      });

      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -15px 0px",
      }
    );

    elemen.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  function tutupMenu() {
    setMenuTerbuka(false);
  }

  function geserTestimoni(arah) {
    setTestimoniAktif(
      (index) =>
        (index + arah + TESTIMONI.length) %
        TESTIMONI.length
    );
  }

  const testimoni = TESTIMONI[testimoniAktif];

  return (
    <>
      {/* ==================================
          HEADER
      ================================== */}

      <header
        className={`navbar ${
          sudahScroll ? "scrolled" : ""
        }`}
      >
        <div className="container navbar-inner">
          <a
            href="#beranda"
            className="navbar-brand"
            onClick={tutupMenu}
            aria-label="One Refinery Coffee - Beranda"
          >
            <img
              src={FOTO.logo}
              alt="Logo One Refinery Coffee"
              className="navbar-logo"
              onError={(event) => {
                event.currentTarget.style.display = "none";
                event.currentTarget.nextElementSibling.style.display =
                  "flex";
              }}
            />

            <span
              className="navbar-logo-fallback"
              style={{ display: "none" }}
            >
              <strong>ONE REFINERY</strong>
              <small>COFFEE</small>
            </span>
          </a>

          <button
            type="button"
            className="menu-toggle"
            aria-label="Buka atau tutup menu"
            aria-controls="navigasi-utama"
            aria-expanded={menuTerbuka}
            onClick={() => {
              setMenuTerbuka(!menuTerbuka);
            }}
          >
            <span />
            <span />
            <span />
          </button>

          <nav
            id="navigasi-utama"
            className={menuTerbuka ? "nav-open" : ""}
            aria-label="Navigasi utama"
          >
            {NAVIGASI.map((item) => (
              <a
                href={item.link}
                key={item.link}
                onClick={tutupMenu}
              >
                {item.nama}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        {/* ==================================
            HERO
        ================================== */}

        <section id="beranda" className="hero">
          <div className="hero-image">
            <Gambar
              src={FOTO.hero}
              alt="Suasana penyeduhan kopi"
              loading="eager"
            />
          </div>

          <div className="hero-overlay" />

          <div className="container hero-content">
            <span className="hero-label">
              ONE REFINERY COFFEE / LIBERICA STORIES
            </span>

            <h1>
              Setiap Seduhan,
              <br />
              <em>Punya Cerita.</em>
            </h1>

            <p>
              Mengenal kopi Liberika dari
              asal-usul dan perjalanan sejarahnya
              hingga karakter unik dan kehidupan
              pohonnya.
            </p>

            <div className="hero-buttons">
              <a
                href="#tentang"
                className="btn btn-primary"
              >
                Jelajahi Liberika
                <span>↗</span>
              </a>

              <a
                href="#perbandingan"
                className="btn btn-outline"
              >
                Bandingkan Kopi
              </a>
            </div>
          </div>

          <a href="#tentang" className="hero-scroll">
            <span />
            SCROLL TO EXPLORE
          </a>
        </section>

        {/* ==================================
            RUNNING TEXT
        ================================== */}

        <div className="marquee">
          <div className="marquee-track">
            {Array.from({ length: 4 }, (_, i) => (
              <span key={i}>
                LIBERICA COFFEE
                <b>✳</b>
                FROM ROOT TO CUP
                <b>✳</b>
                ONE REFINERY COFFEE
                <b>✳</b>
              </span>
            ))}
          </div>
        </div>

        {/* ==================================
            PERKENALAN LIBERIKA
        ================================== */}

        <section
          id="tentang"
          className="section introduction-section"
        >
          <div className="container introduction-grid">
            <div className="introduction-visual reveal">
              <Gambar
                src={FOTO.perkenalan}
                alt="Close-up biji kopi tanpa kemasan"
              />

              <div className="introduction-stamp">
                <small>01 / 06</small>

                <strong>
                  DISCOVER
                  <br />
                  LIBERICA
                </strong>
              </div>
            </div>

            <div className="introduction-copy">
              <span className="eyebrow reveal">
                01 — MENGENAL LIBERIKA
              </span>

              <h2 className="display-title reveal">
                Lebih dari
                <br />
                <em>Sekadar Kopi.</em>
              </h2>

              <div className="accent-line reveal" />

              <p className="reveal">
                Kopi Liberika merupakan salah
                satu jenis tanaman kopi dengan
                nama ilmiah <em>Coffea liberica</em>.
                Jenis ini dikenal melalui bentuk
                biji, aroma, dan pertumbuhan
                pohonnya yang khas.
              </p>

              <p className="reveal">
                Meskipun belum sepopuler Arabika
                dan Robusta, Liberika memiliki
                karakter tersendiri. Keunikannya
                menjadikan kopi ini menarik
                untuk dikenali dan dipelajari.
              </p>

              <div className="introduction-signature reveal">
                <span>ONE REFINERY COFFEE</span>
                <strong>Discover the Uncommon.</strong>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================
            PERJALANAN LIBERIKA
        ================================== */}

        <section
          id="perjalanan"
          className="section journey-section"
        >
          <div className="container">
            <JudulBagian
              nomor="02"
              label="PERJALANAN LIBERIKA"
              judul="Dari Tanah Asal"
              aksen="Hingga Nusantara."
              deskripsi="Perjalanan kopi Liberika memperlihatkan bagaimana tanaman ini menyebar dari kawasan asalnya dan kemudian berkembang di berbagai wilayah tropis."
              center
            />

            <div className="journey-grid">
              <div className="journey-photo reveal">
                <Gambar
                  src={FOTO.perjalanan}
                  alt="Foto biji kopi alami tanpa kemasan dan merek"
                />

                <div className="journey-caption">
                  THE JOURNEY OF LIBERICA
                </div>
              </div>

              <div className="journey-timeline">
                {PERJALANAN.map((item) => (
                  <article
                    className="timeline-item reveal"
                    key={item.nomor}
                  >
                    <span className="timeline-number">
                      {item.nomor}
                    </span>

                    <div>
                      <small>{item.waktu}</small>
                      <h3>{item.judul}</h3>
                      <p>{item.deskripsi}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ==================================
            QUOTE
        ================================== */}

        <section className="quote-section">
          <div className="container reveal">
            <span className="eyebrow">
              A DIFFERENT KIND OF COFFEE
            </span>

            <blockquote>
              “Setiap Jenis Kopi Memiliki Cerita.
              <br />
              <em>
                Liberika Punya Karakter Berbeda.
              </em>”
            </blockquote>

            <small>ONE REFINERY COFFEE</small>
          </div>
        </section>

        {/* ==================================
            CIRI KHAS
        ================================== */}

        <section
          id="ciri-khas"
          className="section characteristics-section"
        >
          <div className="container">
            <JudulBagian
              nomor="03"
              label="CIRI KHAS LIBERIKA"
              judul="Keunikan yang"
              aksen="Membedakan."
              deskripsi="Mulai dari biji, aroma, cita rasa, hingga bentuk pohonnya, Liberika memiliki karakteristik yang menarik untuk dipelajari."
              center
            />

            <div className="character-grid">
              {CIRI_KHAS.map((item) => (
                <article
                  className="character-card reveal"
                  key={item.nomor}
                >
                  <small>{item.nomor} / 04</small>

                  <span className="character-icon">
                    {item.ikon}
                  </span>

                  <h3>{item.judul}</h3>

                  <p>{item.deskripsi}</p>

                  <span className="character-bottom">
                    LIBERICA CHARACTER
                  </span>
                </article>
              ))}
            </div>

            <div className="character-feature reveal">
              <div className="character-feature-photo">
                <Gambar
                  src={FOTO.biji}
                  alt="Biji kopi sangrai alami"
                />
              </div>

              <div className="character-feature-copy">
                <span className="eyebrow">
                  THE UNIQUE CHARACTER
                </span>

                <h3>
                  Keunikan dalam
                  <br />
                  <em>Setiap Biji.</em>
                </h3>

                <p>
                  Karakter kopi bukan hanya
                  ditentukan oleh jenis tanaman.
                  Lingkungan tumbuh, proses
                  pascapanen, tingkat sangrai,
                  dan teknik penyeduhan juga
                  memengaruhi hasil akhirnya.
                </p>

                <a href="#perbandingan">
                  Kenali Perbedaannya ↗
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================
            HABITAT POHON LIBERIKA
        ================================== */}

        <section
          id="habitat"
          className="section habitat-section"
        >
          <div className="container habitat-grid">
            <div className="habitat-copy">
              <span className="eyebrow reveal">
                04 — CARA HIDUP POHON LIBERIKA
              </span>

              <h2 className="display-title reveal">
                Tumbuh di Alam,
                <br />
                <em>Membentuk Karakter.</em>
              </h2>

              <p className="habitat-lead reveal">
                Kondisi lingkungan berperan
                penting dalam kehidupan
                pohon kopi Liberika.
                Iklim, tanah, ketersediaan
                air, serta perawatan
                memengaruhi pertumbuhan
                dan hasil panennya.
              </p>

              <div className="habitat-list">
                {HABITAT.map((item) => (
                  <article
                    className="habitat-item reveal"
                    key={item.nomor}
                  >
                    <span>{item.nomor}</span>

                    <div>
                      <h3>{item.judul}</h3>
                      <p>{item.deskripsi}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="habitat-photo reveal">
              <Gambar
                src={FOTO.habitat}
                alt="Ilustrasi lingkungan hutan tropis"
              />

              <div className="habitat-badge">
                <small>COFFEA LIBERICA</small>

                <strong>
                  Dari Pohon
                  <br />
                  ke Cangkir.
                </strong>

                <span>
                  Mengenal tanaman,
                  menghargai setiap seduhan.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================
            PERBANDINGAN KOPI
        ================================== */}

        <section
          id="perbandingan"
          className="section comparison-section"
        >
          <div className="container">
            <JudulBagian
              nomor="05"
              label="PERBANDINGAN JENIS KOPI"
              judul="Tiga Jenis Kopi,"
              aksen="Tiga Karakter Berbeda."
              deskripsi="Kenali perbedaan umum Liberika, Robusta, dan Arabika dari bentuk biji, lingkungan tumbuh, hingga karakter aroma dan cita rasanya."
              center
              dark
            />

            <div className="coffee-types">
              {JENIS_KOPI.map((item, index) => (
                <article
                  className={`coffee-type reveal ${
                    index === 0 ? "featured" : ""
                  }`}
                  key={item.nama}
                >
                  <small>
                    {item.nomor} / {item.label}
                  </small>

                  <div className="coffee-type-initial">
                    {item.inisial}
                  </div>

                  <h3>{item.nama}</h3>
                  <em>{item.namaIlmiah}</em>

                  <p>{item.deskripsi}</p>

                  <strong>{item.label}</strong>
                </article>
              ))}
            </div>

            <div className="comparison-table-wrap reveal">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>ASPEK</th>
                    <th>LIBERIKA</th>
                    <th>ROBUSTA</th>
                    <th>ARABIKA</th>
                  </tr>
                </thead>

                <tbody>
                  {PERBANDINGAN.map((item) => (
                    <tr key={item.aspek}>
                      <th scope="row">{item.aspek}</th>
                      <td>{item.liberika}</td>
                      <td>{item.robusta}</td>
                      <td>{item.arabika}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="comparison-note">
              *Perbandingan ini bersifat umum.
              Karakter tiap kopi dapat berubah
              menurut lingkungan tumbuh,
              varietas, proses pengolahan,
              sangrai, dan metode seduh.
            </p>
          </div>
        </section>

        {/* ==================================
            TESTIMONI
        ================================== */}

        <section
          id="testimoni"
          className="section testimonials-section"
        >
          <div className="container">
            <JudulBagian
              nomor="06"
              label="CERITA PENGUNJUNG"
              judul="Setiap Pengalaman"
              aksen="Punya Ceritanya."
              deskripsi="Ruang untuk mengenal pengalaman pengunjung dalam mempelajari karakter dan keunikan kopi Liberika."
              center
            />

            <div className="testimonial-layout reveal">
              <div className="testimonial-photo">
                <Gambar
                  src={FOTO.seduhan}
                  alt="Secangkir kopi tanpa merek"
                />
              </div>

              <div className="testimonial-content">
                <span className="eyebrow">
                  VISITOR STORIES
                </span>

                <span className="big-quote">“</span>

                <blockquote>
                  {testimoni.isi}
                </blockquote>

                <div className="testimonial-person">
                  <div className="person-avatar">
                    {testimoniAktif + 1}
                  </div>

                  <div>
                    <strong>{testimoni.nama}</strong>
                    <small>
                      {testimoni.keterangan}
                    </small>
                  </div>
                </div>

                <div className="testimonial-controls">
                  <div className="testimonial-dots">
                    {TESTIMONI.map((_, index) => (
                      <button
                        type="button"
                        key={index}
                        className={
                          index === testimoniAktif
                            ? "active"
                            : ""
                        }
                        aria-label={`Testimoni ${index + 1}`}
                        onClick={() =>
                          setTestimoniAktif(index)
                        }
                      />
                    ))}
                  </div>

                  <div className="testimonial-arrows">
                    <button
                      type="button"
                      aria-label="Sebelumnya"
                      onClick={() =>
                        geserTestimoni(-1)
                      }
                    >
                      ←
                    </button>

                    <button
                      type="button"
                      aria-label="Berikutnya"
                      onClick={() =>
                        geserTestimoni(1)
                      }
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <p className="testimonial-disclaimer">
              Testimoni di atas merupakan contoh
              isi tampilan. Ganti dengan ulasan
              asli setelah diperoleh dari
              pengunjung One Refinery Coffee.
            </p>
          </div>
        </section>

        {/* ==================================
            PENUTUP
        ================================== */}

        <section
          className="closing-section"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(30,16,9,.85),
                rgba(30,16,9,.85)
              ),
              url("${FOTO.penutup}")
            `,
          }}
        >
          <div className="container closing-content reveal">
            <span className="eyebrow">
              ONE REFINERY COFFEE
            </span>

            <h2>
              Cerita Liberika
              <br />
              <em>Masih Berlanjut.</em>
            </h2>

            <p>
              Dari asal-usul hingga keunikan
              setiap seduhan, selalu ada
              cerita yang layak untuk dikenal.
            </p>

            <a
              href="#beranda"
              className="btn btn-primary"
            >
              Kembali ke Awal ↑
            </a>
          </div>
        </section>
      </main>

      {/* ==================================
          FOOTER
      ================================== */}

      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-about">
            <a
              href="#beranda"
              className="footer-brand"
              aria-label="Kembali ke Beranda"
            >
              <img
                src={FOTO.logo}
                alt="Logo One Refinery Coffee"
                className="footer-logo"
              />
            </a>

            <p>
              Mengenal dan menghargai
              kopi Liberika melalui sejarah,
              ciri khas, habitat, dan
              karakter uniknya.
            </p>
          </div>

          <div className="footer-links">
            <h4>JELAJAHI</h4>

            <a href="#tentang">Mengenal Liberika</a>
            <a href="#perjalanan">Perjalanan</a>
            <a href="#ciri-khas">Ciri Khas</a>
            <a href="#habitat">Cara Hidup Pohon</a>
          </div>

          <div className="footer-links">
            <h4>INFORMASI</h4>

            <a href="#perbandingan">
              Perbandingan Kopi
            </a>

            <a href="#testimoni">
              Testimoni
            </a>

            <a href="#beranda">
              Kembali ke Beranda
            </a>
          </div>
        </div>

        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} One Refinery
            Coffee. All Rights Reserved.
          </span>

          <span>A STORY IN EVERY BREW</span>
        </div>
      </footer>
    </>
  );
}
