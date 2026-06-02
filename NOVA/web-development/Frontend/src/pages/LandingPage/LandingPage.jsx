import { Link } from 'react-router-dom'
import reactLogo from '../../assets/react.svg'
import viteLogo from '../../assets/vite.svg'
import heroImg from '../../assets/hero.png'
import './LandingPage.css'

export default function LandingPage() {
  return (
    <div className="landing-layout">
      <nav className="landing-nav" aria-label="Navigasi utama">
        <Link to="/" className="landing-nav__back">
          ← Kembali ke Beranda
        </Link>
      </nav>

      <section id="center" className="landing-center">
        <div className="hero" aria-hidden="true">
          <img
            src={heroImg}
            className="base"
            width="170"
            height="179"
            alt=""
          />
          <img src={reactLogo} className="framework" alt="" />
          <img src={viteLogo} className="vite" alt="" />
        </div>
        <div>
          <h1>Mulai dengan NOVA</h1>
          <p>
            Daftar akun, tambahkan profil anak, dan pantau pertumbuhan dari
            dashboard Anda.
          </p>
        </div>
        <Link to="/" className="landing-cta">
          Kembali ke Halaman Utama
        </Link>
      </section>

      <div className="ticks" aria-hidden="true"></div>

      <section id="next-steps" aria-label="Langkah selanjutnya">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Dokumentasi</h2>
          <p>Panduan pengembangan proyek</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank" rel="noopener noreferrer">
                <img className="logo" src={viteLogo} alt="Logo Vite" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">
                <img className="button-icon" src={reactLogo} alt="Logo React" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Tim NOVA</h2>
          <p>Hubungi kami untuk pertanyaan proyek</p>
          <ul>
            <li>
              <a
                href="https://github.com/vitejs/vite"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks" aria-hidden="true"></div>
      <section id="spacer" aria-hidden="true"></section>
    </div>
  )
}
