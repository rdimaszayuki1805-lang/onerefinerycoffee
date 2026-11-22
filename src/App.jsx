
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";

// ==========================================
// SUMBER FOTO ONE REFINERY COFFEE
// ==========================================

const commons = (nama) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(nama)}`;

const gambar = {
  hero:
    "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1800&q=85",

  biji1: commons("Biji Kopi Liberika Tungkal 01.jpg"),

  biji2: commons("Liberica coffee beans, roasted.jpg"),

  biji3: commons("Kopi Liberika Tungkal Dark Roast.jpg"),

  biji4: commons("Biji Kopi Liberika Tungkal Dark Roast.jpg"),

  tanaman: commons("Coffea liberica (5597934575).jpg"),

  buah: commons("Coffea liberica (5598419030).jpg"),

  seduhan:
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85",
};

// ==========================================
// KOMPONEN FOTO
// ==========================================

function Foto({ src, alt, className = "" }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = gambar.seduhan;
      }}
    />
  );
}

// ==========================================
// DATA FAKTA LIBERIKA
// ==========================================

const fakta = [
  {
    nomor: "01",
    judul: "Aroma yang Khas",
    deskripsi:
      "Liberika memiliki profil aroma yang unik dan kompleks, yang dapat menghadirkan nuansa buah, bunga, serta sentuhan kayu.",
    icon: "✦",
  },
  {
    nomor: "02",
    judul: "Bentuk Biji Berbeda",
    deskripsi:
      "Biji kopi Liberika umumnya lebih besar dan memiliki bentuk yang tidak simetris, membuatnya mudah dikenali.",
    icon: "◇",
  },
  {
    nomor: "03",
    judul: "Rasa Berkarakter",
    deskripsi:
      "Cita rasanya memiliki karakter tersendiri yang dipengaruhi oleh daerah asal, pengolahan, dan teknik penyeduhan.",
    icon: "✳",
  },
];

// ==========================================
// DATA GALERI
// ==========================================

const galeri = [
  {
    gambar: gambar.biji1,
    judul: "Liberika Tungkal",
    kategori: "Biji Kopi",
  },
  {
    gambar: gambar.biji2,
    judul: "Karakter Biji Liberika",
    kategori: "Biji Sangrai",
  },
  {
    gambar: gambar.biji3,
    judul: "Sangrai Pilihan",
    kategori: "Dark Roast",
  },
  {
    gambar: gambar.tanaman,
    judul: "Dari Alam",
    kategori: "Tanaman Liberika",
  },
  {
    gambar: gambar.biji4,
    judul: "Keunikan di Setiap Biji",
    kategori: "Kopi Liberika",
  },
  {
    gambar: gambar.buah,
    judul: "Awal Sebuah Cerita",
    kategori: "Tanaman Kopi",
  },
];

// ==========================================
// HALAMAN UTAMA
// ==========================================

function App() {
  const [menuTerbuka, setMenuTerbuka] = useState(false);
  const [scroll, setScroll] = useState(false);

  // ========================================
  // NAVBAR SCROLL DAN ANIMASI REVEAL
  // ========================================

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".reveal").forEach((el) => {
      observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  function tutupMenu() {
    setMenuTerbuka(false);
  }

  return (
    <div className="website">

      {/* =====================================
          NAVBAR ONE REFINERY COFFEE
      ===================================== */}

      <header className={`navbar ${scroll ? "scrolled" : ""}`}>

        {/* LOGO */}
        <a
          href="#beranda"
          className="brand"
          onClick={tutupMenu}
          aria-label="One Refinery Coffee - Beranda"
        >
          <span className="brand-main">
            ONE<span>REFINERY</span>
          </span>

          <small>COFFEE</small>
        </a>

        {/* TOGGLE MOBILE */}
        <button
          type="button"
          className="menu-toggle"
          aria-label={
            menuTerbuka
              ? "Tutup navigasi"
              : "Buka navigasi"
          }
          aria-expanded={menuTerbuka}
          onClick={() =>
            setMenuTerbuka((sebelumnya) => !sebelumnya)
          }
        >
          <span />
          <span />
          <span />
        </button>

        {/* MENU NAVIGASI */}
        <nav className={menuTerbuka ? "nav-open" : ""}>

          <a href="#beranda" onClick={tutupMenu}>
            Beranda
          </a>

          <a href="#tentang" onClick={tutupMenu}>
            Tentang Kami
          </a>

          <a href="#liberica" onClick={tutupMenu}>
            Kopi Liberika
          </a>

          <a href="#galeri" onClick={tutupMenu}>
            Galeri
          </a>

          {/* LOGIN ADMIN DAN KASIR */}
          <Link
            to="/login"
            className="nav-login"
            onClick={tutupMenu}
          >
            Login
          </Link>

          {/* PEMESANAN PELANGGAN */}
          <Link
            to="/pemesanan"
            className="nav-order"
            onClick={tutupMenu}
          >
            Pesan Sekarang ↗
          </Link>

        </nav>
      </header>

      <main>

        {/* =====================================
            HERO / BERANDA
        ===================================== */}

        <section className="hero" id="beranda">

          <div
            className="hero-background"
            style={{
              backgroundImage: `url("${gambar.hero}")`,
            }}
          />

          <div className="hero-overlay" />

          <div className="hero-glow glow-one" />
          <div className="hero-glow glow-two" />

          <div className="hero-content">

            <div className="hero-label">
              <span className="label-line" />
              CITA RASA KHAS KOPI LIBERIKA
            </div>

            <h1>
              Setiap Seduhan,
              <br />
              Punya <em>Cerita.</em>
            </h1>

            <p className="hero-description">
              Selamat datang di One Refinery Coffee.
              Tempat di mana keunikan kopi Liberika,
              aroma yang khas, dan kehangatan setiap
              cangkir berpadu menjadi pengalaman
              yang tak terlupakan.
            </p>

            <div className="hero-actions">

              <a
                href="#tentang"
                className="primary-button"
              >
                Jelajahi Cerita Kami
                <span>↗</span>
              </a>

              <Link
                to="/pemesanan"
                className="outline-button"
              >
                Pesan Kopi
                <span>↗</span>
              </Link>

            </div>

            <div className="hero-bottom">
              <span>ONE REFINERY COFFEE</span>
              <span>GULIR UNTUK MENJELAJAHI ↓</span>
            </div>

          </div>
        </section>

        {/* =====================================
            TEKS BERJALAN
        ===================================== */}

        <div className="marquee">
          <div className="marquee-track">
            {Array.from({ length: 4 }, (_, index) => (
              <span key={index}>
                KOPI LIBERIKA <b>✦</b> AROMA KHAS <b>✦</b>
                SETIAP SEDUHAN PUNYA CERITA <b>✦</b>
              </span>
            ))}
          </div>
        </div>

        {/* =====================================
            TENTANG KAMI
        ===================================== */}

        <section className="about-section" id="tentang">

          <div className="about-image reveal">

            <div className="image-frame">
              <Foto
                src={gambar.biji1}
                alt="Biji kopi Liberika Tungkal"
              />
            </div>

            <div className="floating-label">
              <span>✦</span>
              <div>
                <strong>LIBERICA</strong>
                <small>KOPI KHAS KAMI</small>
              </div>
            </div>

          </div>

          <div className="about-text reveal">

            <p className="eyebrow">
              01 / CERITA KAMI
            </p>

            <h2>
              Lebih dari
              <br />
              Sekadar <em>Kopi.</em>
            </h2>

            <div className="section-line" />

            <p>
              Di One Refinery Coffee, kami percaya bahwa
              setiap cangkir kopi memiliki cerita.
              Cerita tentang asal-usulnya, perjalanan
              bijinya, dan pengalaman yang hadir
              dalam setiap seduhan.
            </p>

            <p>
              Dengan mengangkat kopi Liberika sebagai
              ciri khas, kami ingin memperkenalkan
              keunikan aroma dan karakternya kepada
              lebih banyak pencinta kopi.
            </p>

            <a
              href="#liberica"
              className="text-link"
            >
              Temukan Keunikannya <span>↗</span>
            </a>

          </div>
        </section>

        {/* =====================================
            KOPI LIBERIKA
        ===================================== */}

        <section
          className="liberica-intro"
          id="liberica"
        >

          <div className="section-heading reveal">

            <p className="eyebrow">
              02 / KENALI KOPI KAMI
            </p>

            <h2>
              Bukan Kopi Biasa.
              <br />
              Ini <em>Liberika.</em>
            </h2>

            <p>
              Salah satu jenis kopi dengan bentuk biji,
              karakter aroma, dan cita rasa yang
              membuatnya berbeda.
            </p>

          </div>

          <div className="liberica-showcase">

            <div className="showcase-image reveal">

              <Foto
                src={gambar.biji2}
                alt="Biji kopi Liberika yang disangrai"
              />

              <div className="image-caption">
                <span>01 — BIJI BERKARAKTER</span>
                <strong>Biji Penuh Karakter</strong>
              </div>

            </div>

            <div className="showcase-side">

              <div className="showcase-small reveal">
                <Foto
                  src={gambar.biji3}
                  alt="Kopi Liberika sangrai gelap"
                />
              </div>

              <div className="showcase-quote reveal">
                <span className="quote-symbol">“</span>

                <h3>
                  Keunikan rasa dimulai dari
                  setiap biji yang berbeda.
                </h3>

                <p>ONE REFINERY COFFEE</p>
              </div>

            </div>
          </div>

        </section>

        {/* =====================================
            FAKTA KOPI LIBERIKA
        ===================================== */}

        <section className="facts-section">

          <div className="facts-header reveal">
            <p className="eyebrow">
              TAHUKAH KAMU?
            </p>

            <h2>
              Fakta Menarik
              <br />
              <em>Kopi Liberika</em>
            </h2>

            <p>
              Yuk, kenali lebih jauh kopi yang
              menjadi ciri khas One Refinery Coffee.
            </p>
          </div>

          <div className="fact-grid">
            {fakta.map((item) => (
              <article
                className="fact-card reveal"
                key={item.nomor}
              >
                <div className="fact-top">
                  <span className="fact-number">
                    {item.nomor}
                  </span>

                  <span className="fact-icon">
                    {item.icon}
                  </span>
                </div>

                <div className="fact-content">
                  <h3>{item.judul}</h3>
                  <p>{item.deskripsi}</p>
                </div>

                <div className="fact-bottom">
                  <span>FAKTA LIBERIKA</span>
                  <span>↗</span>
                </div>

              </article>
            ))}
          </div>

        </section>

        {/* =====================================
            GALERI KOPI LIBERIKA
        ===================================== */}

        <section
          className="gallery-section"
          id="galeri"
        >

          <div className="gallery-heading reveal">

            <div>
              <p className="eyebrow">
                03 / GALERI KOPI
              </p>

              <h2>
                Dari Biji,
                <br />
                Menjadi <em>Cerita.</em>
              </h2>
            </div>

            <p>
              Melihat lebih dekat keindahan dan
              karakter unik kopi Liberika,
              mulai dari tanaman hingga bijinya.
            </p>

          </div>

          <div className="gallery-grid">

            {galeri.map((item, index) => (
              <div
                className={`gallery-card gallery-${index + 1} reveal`}
                key={index}
              >
                <Foto
                  src={item.gambar}
                  alt={item.judul}
                />

                <div className="gallery-overlay">
                  <span>{item.kategori}</span>
                  <h3>{item.judul}</h3>
                </div>
              </div>
            ))}

          </div>

        </section>

        {/* =====================================
            QUOTE
        ===================================== */}

        <section className="quote-section">
          <div className="quote-bg" />

          <div className="quote-content reveal">

            <span className="quote-decoration">
              ✦
            </span>

            <h2>
              Kopi yang Istimewa
              Bukan Hanya Tentang Rasa,
              Tapi Juga <em>Cerita.</em>
            </h2>

            <p>ONE REFINERY COFFEE</p>

          </div>
        </section>

        {/* =====================================
            PROMOSI PEMESANAN
            CHECKOUT TETAP DI /pemesanan
        ===================================== */}

        <section
          className="order-section"
          id="pesan"
        >
          <div className="order-banner-custom reveal">

            <div className="order-banner-content">

              <p className="eyebrow">
                04 / PESAN KOPI FAVORITMU
              </p>

              <h2>
                Secangkir Kopi,
                <br />
                <em>Untuk Hari yang Istimewa.</em>
              </h2>

              <p>
                Pilih kopi favoritmu dari menu
                One Refinery Coffee. Nikmati langsung
                di tempat dengan layanan Dine In,
                atau pesan Takeaway untuk dibawa pulang.
              </p>

              <Link
                to="/pemesanan"
                className="primary-button"
              >
                Pesan Kopi Sekarang <span>↗</span>
              </Link>

            </div>

            <div className="order-banner-image">
              <Foto
                src={gambar.seduhan}
                alt="Sajian kopi One Refinery Coffee"
              />
            </div>

          </div>
        </section>

      </main>

      {/* =====================================
          FOOTER
      ===================================== */}

      <footer className="footer">

        <div className="footer-top">

          <div>
            <h2>
              ONE<span>REFINERY</span>
            </h2>

            <small>COFFEE</small>

            <p>
              Setiap seduhan punya cerita.
              <br />
              Nikmati keunikan kopi Liberika.
            </p>
          </div>

          <div className="footer-links">
            <h4>Jelajahi</h4>

            <a href="#beranda">
              Beranda
            </a>

            <a href="#tentang">
              Tentang Kami
            </a>

            <a href="#liberica">
              Kopi Liberika
            </a>

            <a href="#galeri">
              Galeri
            </a>

            <Link to="/pemesanan">
              Pemesanan
            </Link>

            <Link to="/login">
              Login Staf
            </Link>
          </div>

        </div>

        <div className="footer-bottom">
          <span>
            © 2026 One Refinery Coffee.
            Seluruh hak cipta dilindungi.
          </span>

          <a href="#beranda">
            Kembali ke Atas ↑
          </a>
        </div>

        <p className="photo-credit">
          Foto dokumentasi Liberika menggunakan
          sumber Wikimedia Commons. Hak penggunaan
          gambar mengikuti lisensi masing-masing.
        </p>

      </footer>

    </div>
  );
}

export default App;
