import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import familyImage from "../assets/assets1.png";
import aiIcon from "../assets/Ai-icon.png";

import "./Landing.css";

const articles = [
  {
    id: 1,
    title: "Gejala Stunting yang Harus Diwaspadai",
    description:
      "Orang tua perlu waspada terhadap tanda-tanda stunting, terutama jika pertumbuhan tinggi atau panjang badan anak tidak sesuai standar usia. Deteksi dini membantu anak mendapat penanganan lebih cepat.",
    image: "https://ayosehat.kemkes.go.id/imagex/content/4e28e54eWhatsApp_Image_2023-02-02_at_17.13.37.jpeg",
    url: "https://ayosehat.kemkes.go.id/gejala-stunting-yang-harus-diwaspadai",
  },
  {
    id: 2,
    title: "ASI Eksklusif 6 Bulan untuk Bayi Tumbuh Sehat",
    description:
      "ASI eksklusif selama 6 bulan membantu memenuhi kebutuhan gizi bayi. Ibu perlu memahami cara menyusui yang benar agar bayi mendapat asupan optimal.",
    image: "https://ayosehat.kemkes.go.id/imagex/content/1750733182685a117e9f6dd0.78611671.webp",
    url: "https://ayosehat.kemkes.go.id/topik-non-penyakit/kesehatan-lainnya/asi",
  },
  {
      id: 4,
    title: "Manfaat Penimbangan Balita di Posyandu",
    description:
      "Penimbangan dan pengukuran anak secara rutin di Posyandu membantu orang tua memantau pertumbuhan anak, mendeteksi masalah gizi lebih awal, dan mencegah risiko stunting.",
    image: "https://ayosehat.kemkes.go.id/imagex/content/94d31b99aea60c5465df1df409a76a09.webp",
    url: "https://ayosehat.kemkes.go.id/manfaat-penimbangan-balita-di-posyandu",
  },
  {
      id: 5,
    title: "Buku Resep MPASI Makanan Lokal",
    description:
      "Panduan resep MPASI berbasis makanan lokal yang membantu orang tua menyiapkan menu bergizi seimbang, termasuk sumber protein hewani untuk mendukung pertumbuhan anak.",
    image: "https://ayosehat.kemkes.go.id/imagex/content/fd5162dc26ded71db534db7882c3e164.webp",
    url: "https://ayosehat.kemkes.go.id/buku-resep-makanan-lokal",
  },
  {
    id: 6,
    title: "Kebutuhan Nutrisi Ibu Hamil",
    description:
      "Selain karbohidrat, protein, dan lemak, ibu hamil juga membutuhkan zat gizi mikro seperti vitamin dan mineral. Pemenuhan nutrisi selama hamil penting untuk kesehatan ibu dan janin.",
    image: "https://ayosehat.kemkes.go.id/imagex/content/58008aca38308a68d8f274a406b7cf16.webp",
    url: "https://ayosehat.kemkes.go.id/kebutuhan-nutrisi-ibu-hamil",
  },
  {
    id: 7,
    title: "Wasting dan Stunting, Sama atau Beda?",
    description:
      "Wasting dan stunting sama-sama termasuk masalah gizi anak, tetapi memiliki kondisi dan dampak yang berbeda. Orang tua perlu memahami perbedaannya agar lebih waspada terhadap tumbuh kembang anak.",
    image: "https://www.unicef.org/indonesia/sites/unicef.org.indonesia/files/styles/hero_extended/public/%5BWasting%5DArtikel-Juli-1.jpg.webp?itok=XNaRHN1b",
    url: "https://www.unicef.org/indonesia/id/gizi/artikel/stunting-wasting-sama-atau-beda",
  },
  {
    id: 8,
    title: "Memberi Makan pada Bayi: Kapan, Apa, dan Bagaimana",
    description:
      "Pemberian makan pada bayi perlu memperhatikan usia, tekstur, dan kemampuan anak. Tekstur makanan sebaiknya dinaikkan bertahap agar anak belajar makan dengan aman dan cukup gizi.",
    image: "https://www.idai.or.id/wp-content/uploads/FOTO%20MPASI.jpg",
    url: "https://www.idai.or.id/artikel/klinik/pengasuhan-anak/memberi-makan-pada-bayi-kapan-apa-dan-bagaimana",
  },
  {
    id: 9,
    title: "Pentingnya Protein Hewani dalam MPASI",
    description:
      "Protein hewani dalam MPASI penting untuk mendukung pertumbuhan anak. Pemberian makanan bergizi tidak cukup hanya membuat anak kenyang, tetapi juga perlu memperhatikan kualitas nutrisi.",
    image: "https://www.idai.or.id/assets/templates/images/logo.png",
    url: "https://www.idai.or.id/artikel/seputar-kesehatan-anak/bukan-sekadar-kenyang-pentingnya-protein-hewani-dalam-mp-asi-untuk-cegah-stunting",
  },
  {
      id: 10,
    title: "Potret Stunting di Indonesia",
    description:
      "Prevalensi stunting nasional pada 2024 tercatat turun menjadi 19,8%. Capaian ini menunjukkan adanya progres, tetapi pencegahan dan pemantauan tumbuh kembang anak tetap perlu dilakukan secara konsisten.",
    image:
      "https://www.badankebijakan.kemkes.go.id/wp-content/uploads/2025/09/V5-Potret-Stunting-Utas-1-683x1024.png",
    url: "https://www.badankebijakan.kemkes.go.id/potret-stunting-di-indonesia/",
  },
];

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  return (
    <main className="nova-page">
      <nav className="nova-navbar">
        <button className="nova-logo" onClick={() => navigate("/landing")}>
          NOVA
        </button>

        <div className="nova-nav-menu"></div>

        <button
          className="nova-logout-button"
          onClick={handleLogout}
          aria-label="Logout"
          title="Logout"
          type="button"
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          <span>Log out</span>
        </button>
      </nav>

      <section className="nova-hero">
        <div className="nova-hero-content">
          <h1>
            Lorem Ipsum
            <br />
            dolor sit amet Lorem
          </h1>

          <p>
            Lorem Ipsum
            <br />
            dolor sit amet Lorem
          </p>
        </div>

        <div className="nova-hero-image-wrapper">
          <img
            src={familyImage}
            alt="Keluarga NOVA"
            className="nova-hero-image"
          />
        </div>
      </section>

      <section className="nova-ai-shortcut-section" id="features">
        <div
          className="nova-ai-shortcut-card"
          onClick={() => navigate("/novition")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              navigate("/novition");
            }
          }}
        >
          <div className="nova-ai-shortcut-icon">
            <img src={aiIcon} alt="AI Assistant" className="nova-ai-icon" />
          </div>

          <p>
            Hallo aku asisten AI, yuk tap aku untuk cari tau tumbuh kembang anak
          </p>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/novition");
            }}
          >
            Chat
          </button>
        </div>
      </section>

      <section className="nova-news-section" id="news">
        <h2>News</h2>

        <div className="nova-news-list">
          {articles.map((article) => (
            <article className="nova-news-list-item" key={article.id}>
              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="nova-news-list-image-link"
              >
                <img src={article.image} alt={article.title} />
              </a>

              <div className="nova-news-list-content">
                <h3>{article.title}</h3>
                <p>{article.description}</p>

                <a
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  className="nova-news-read-more"
                >
                  Baca Selengkapnya
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="nova-footer">
        <div>
          <h2>NOVA</h2>
          <p>©Copyright 2026 Nova.</p>
        </div>

        <div className="nova-socials">
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
            <i className="fa-brands fa-instagram"></i>
          </a>

          <a href="https://www.youtube.com/" target="_blank" rel="noreferrer">
            <i className="fa-brands fa-youtube"></i>
          </a>
        </div>
      </footer>
    </main>
  );
};

export default Landing;