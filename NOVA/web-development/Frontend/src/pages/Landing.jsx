import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import familyImage from "../assets/assets1.png";

import "./Landing.css";

const articles = [
  {
    id: 1,
    title: "POTRET STUNTING DI INDONESIA",
    description:
      "Penurunan stunting di Indonesia menunjukkan progres signifikan, dengan angka prevalensi nasional berhasil ditekan hingga 19,8% pada tahun 2024 sesuai hasil Survei Status Gizi Indonesia (SSGI) 2024, Capaian ini merupakan hasil intervensi yang dilakukan selama lima tahun terakhir, di mana prevalensi stunting menurun secara bertahap dari 27,7% pada 2019. Hal ini menunjukkan upaya meningkatkan kualitas kesehatan anak dan sumber daya manusia di Indonesia berjalan pada sesuai target dan perencanaan.",
    image: "https://www.badankebijakan.kemkes.go.id/wp-content/uploads/2025/09/V5-Potret-Stunting-Utas-1-683x1024.png",
    url: "https://www.badankebijakan.kemkes.go.id/potret-stunting-di-indonesia/",
  },
  {
    id: 2,
    title: "8,6 Juta Keluarga Berisiko Stunting",
    description:
      "Keluarga berisiko stunting perlu mendapat perhatian melalui pendampingan, edukasi gizi, dan akses layanan kesehatan yang memadai.",
    image: familyImage,
    url: "https://health.detik.com/fotohealth/d-8055083/8-6-juta-keluarga-berisiko-stunting",
  },
  {
    id: 3,
    title: "Pentingnya Nutrisi untuk Anak Demi Entaskan Stunting",
    description:
      "Nutrisi yang cukup dan seimbang menjadi salah satu faktor penting dalam mendukung pertumbuhan anak dan mencegah risiko stunting.",
    image: familyImage,
    url: "https://health.detik.com/fotohealth/d-7755648/pentingnya-nutrisi-untuk-anak-demi-entaskan-stunting",
  },
  {
    id: 4,
    title: "Cegah Stunting, Warga Antusias Ikuti Posyandu",
    description:
      "Kegiatan posyandu membantu masyarakat memantau kesehatan anak, termasuk berat badan, tinggi badan, dan kebutuhan gizi anak.",
    image: familyImage,
    url: "https://health.detik.com/fotohealth/d-7922836/cegah-stunting-warga-cilincing-antusias-ikuti-posyandu",
  },
  {
    id: 5,
    title: "1000 HPK Kunci Cegah Stunting",
    description:
      "Seribu hari pertama kehidupan menjadi masa penting dalam menentukan kualitas tumbuh kembang anak sejak dini.",
    image: familyImage,
    url: "https://ayosehat.kemkes.go.id/1000-hpk-kunci-cegah-stunting",
  },
];

const Landing = () => {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const handleAuthNavigation = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const handleFeatureNavigation = () => {
    const section = document.getElementById("features");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNewsNavigation = () => {
    const section = document.getElementById("news");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="nova-page">
      <nav className="nova-navbar">
        <button className="nova-logo" onClick={() => navigate("/")}>
          NOVA
        </button>

        <div className="nova-nav-menu">
          {isLoggedIn ? (
            <>
              <button onClick={() => navigate("/novition")}>Scan AI</button>
              <button onClick={handleNewsNavigation}>Article</button>
            </>
          ) : (
            <>
              <button onClick={handleFeatureNavigation}>Contoh</button>
              <button onClick={handleNewsNavigation}>Contoh</button>
            </>
          )}
        </div>

        {isLoggedIn ? (
          <button
            className="nova-ai-nav-button"
            onClick={() => navigate("/novition")}
            aria-label="Go to AI Scan"
            type="button"
          >
            <i className="fa-solid fa-robot"></i>
          </button>
        ) : (
          <button
            className="nova-login-button"
            onClick={() => navigate("/login")}
            type="button"
          >
            Login/Register
          </button>
        )}
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
          <img src={familyImage} alt="Keluarga NOVA" className="nova-hero-image" />
        </div>
      </section>

      {isLoggedIn ? (
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
              <i className="fa-solid fa-robot"></i>
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
      ) : (
        <>
          <section className="nova-feature-section" id="features">
            <h2>What u get on app</h2>

            <div className="nova-feature-layout">
              <div className="nova-phone-wrapper">
                <div className="nova-phone-frame">
                  <div className="nova-phone-notch"></div>
                </div>
              </div>

              <div className="nova-feature-list">
                <div className="nova-feature-item">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/4149/4149670.png"
                    alt="AI feature icon"
                    className="nova-feature-icon"
                  />

                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                    enim ad minim veniam, quis nostrud exercitation ullamco laboris
                    nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                    reprehenderit in voluptate velit esse cillum dolore eu fugiat
                    nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                    sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                </div>

                <div className="nova-feature-item">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/1864/1864593.png"
                    alt="Baby feature icon"
                    className="nova-feature-icon"
                  />

                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                    enim ad minim veniam, quis nostrud exercitation ullamco laboris
                    nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                    reprehenderit in voluptate velit esse cillum dolore eu fugiat
                    nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                    sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="nova-benefit-section">
            <h2>Why u should try</h2>

            <div className="nova-benefit-grid">
              <div className="nova-benefit-item">
                <i className="fa-solid fa-shield-heart"></i>
                <h3>Lorem ipsum</h3>
                <p>dolor sit amet Lorem</p>
              </div>

              <div className="nova-benefit-item">
                <i className="fa-solid fa-magnifying-glass-chart"></i>
                <h3>Lorem ipsum</h3>
                <p>dolor sit amet Lorem</p>
              </div>

              <div className="nova-benefit-item">
                <i className="fa-solid fa-chart-line"></i>
                <h3>Lorem ipsum</h3>
                <p>dolor sit amet Lorem</p>
              </div>

              <div className="nova-benefit-item">
                <i className="fa-solid fa-newspaper"></i>
                <h3>Lorem ipsum</h3>
                <p>dolor sit amet Lorem</p>
              </div>
            </div>
          </section>
        </>
      )}

      <section className="nova-news-section" id="news">
        <h2>News</h2>

        <div className="nova-main-news">
          <div className="nova-main-news-left">
            <a href={articles[0].url} target="_blank" rel="noreferrer">
              <img src={articles[0].image} alt={articles[0].title} />
            </a>

            <h3>{articles[0].title}</h3>
            <p>Lorem ipsum dolor sit amet</p>
          </div>

          <div className="nova-main-news-text">
            <p>
              {articles[0].description}
            </p>
          </div>
        </div>

        <div className="nova-news-grid">
          {articles.slice(1).map((article) => (
            <article className="nova-news-card" key={article.id}>
              <a href={article.url} target="_blank" rel="noreferrer">
                <img src={article.image} alt={article.title} />
              </a>

              <h3>{article.title}</h3>
              <p>{article.description}</p>
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