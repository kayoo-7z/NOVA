import { Link } from 'react-router-dom'
import heroImg from '../../assets/image.png'
import './WelcomePage.css'

// Data fitur — ubah array ini jika menambah/mengganti fitur utama
const FEATURES = [
  {
    icon: '📈',
    title: 'Monitoring Pertumbuhan Anak',
  },
  {
    icon: '📚',
    title: 'Edukasi Pencegahan Stunting',
  },
  {
    icon: '🤖',
    title: 'AI Assistant untuk Orang Tua',
  },
]

export default function WelcomePage() {
  return (
    <div className="welcome-page welcome-page--polished welcome-page--fade-in">
      {/* Lapisan background dekoratif — tidak memengaruhi routing/auth */}
      <div className="welcome-bg" aria-hidden="true">
        <div className="welcome-bg__gradient" />
        <span className="welcome-bg__orb welcome-bg__orb--one" />
        <span className="welcome-bg__orb welcome-bg__orb--two" />
        <span className="welcome-bg__orb welcome-bg__orb--three" />
        <span className="welcome-bg__orb welcome-bg__orb--four" />
      </div>

      <header className="welcome-header">
        <div className="welcome-header__inner welcome-shell">
          <div className="welcome-header__brand">
            <span className="welcome-header__logo" aria-hidden="true">
              N
            </span>
            <span className="welcome-header__name">NOVA</span>
          </div>
        </div>
      </header>

      <main className="welcome-main">
        {/* 1. Hero — judul utama + visual */}
        <section
          className="welcome-hero welcome-shell welcome-reveal"
          aria-labelledby="welcome-title"
        >
          <div className="welcome-hero__copy">
            <p className="welcome-hero__kicker">Platform Kesehatan Anak</p>
            <h1 id="welcome-title" className="welcome-hero__title">
              NOVA - Sahabat Tumbuh Kembang Anak
            </h1>
          </div>

          <div className="welcome-hero__visual">
            <img
              src={heroImg}
              alt="Ilustrasi keluarga memantau pertumbuhan anak dengan NOVA"
              className="welcome-hero__image"
              width={500}
              height={400}
              loading="eager"
            />
          </div>
        </section>

        {/* 2. Tentang Kami — konten edukasi singkat */}
        <section
          id="tentang"
          className="welcome-about welcome-shell welcome-reveal welcome-reveal--delay-1"
          aria-labelledby="about-title"
        >
          <div className="welcome-glass-card welcome-about__card">
            <h2 id="about-title" className="welcome-section__title">
              Tentang Kami
            </h2>
            <p className="welcome-about__text">
              NOVA membantu orang tua memantau pertumbuhan anak, memperoleh
              edukasi terpercaya, dan mencegah stunting sejak dini melalui
              teknologi yang mudah digunakan.
            </p>
          </div>
        </section>

        {/* 3. Fitur Utama — kartu interaktif */}
        <section
          id="fitur"
          className="welcome-features welcome-shell welcome-reveal welcome-reveal--delay-2"
          aria-labelledby="features-title"
        >
          <h2 id="features-title" className="welcome-section__title welcome-section__title--light">
            Fitur Utama
          </h2>

          <ul className="welcome-features__grid">
            {FEATURES.map((feature, index) => (
              <li
                key={feature.title}
                className="welcome-features__card"
                style={{ '--card-delay': `${index * 0.08}s` }}
              >
                <span className="welcome-features__icon" aria-hidden="true">
                  {feature.icon}
                </span>
                <h3 className="welcome-features__card-title">{feature.title}</h3>
              </li>
            ))}
          </ul>
        </section>

        {/* 4. CTA — Link ke /mulai (alur login/register tidak diubah) */}
        <section
          className="welcome-cta welcome-shell welcome-reveal welcome-reveal--delay-3"
          aria-labelledby="cta-title"
        >
          <div className="welcome-glass-card welcome-cta__card">
            <h2 id="cta-title" className="welcome-cta__title">
              Siap Memantau Tumbuh Kembang Anak?
            </h2>
            <p className="welcome-cta__text">
              Mulai perjalanan Anda bersama NOVA — gratis dan mudah digunakan.
            </p>
            <Link
              to="/register"
              className="welcome-btn welcome-btn--primary welcome-btn--glow"
            >
              Mulai Sekarang
            </Link>
          </div>
        </section>
      </main>

      <footer className="welcome-footer">
        <div className="welcome-shell welcome-footer__inner">
          <p>&copy; {new Date().getFullYear()} NOVA. Semua hak dilindungi.</p>
        </div>
      </footer>
    </div>
  )
}
