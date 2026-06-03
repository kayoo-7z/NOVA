import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import Novition from "./pages/Novition";
import WelcomePage from "./pages/WelcomePage/WelcomePage";

const MainLayout = () => {
  return (
    <div style={layoutStyle}>
      <Header />

      <main style={mainContentStyle}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

const ProtectedRoute = () => {
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={dashboardWrapperStyle}>
      <h2 style={dashboardTitleStyle}>Riwayat Anak</h2>

      <div style={historyListStyle}>
        <div style={historyCardStyle}>Hasil Scan 1: Stunting Terdeteksi</div>
        <div style={historyCardStyle}>Hasil Scan 2: Gizi Baik</div>
      </div>

      <div style={dashboardButtonGroupStyle}>
        <button style={scanButtonStyle} onClick={() => navigate("/novition")}>
          Scan Anak Stunting
        </button>

        <button style={artikelButtonStyle} onClick={() => navigate("/")}>
          Baca Artikel Edukasi
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public pages tanpa Header/Footer lama */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/landing" element={<Landing />} />

        {/* Halaman Scan AI sendiri, protected tapi TANPA Header/Footer lama */}
        <Route element={<ProtectedRoute />}>
          <Route path="/novition" element={<Novition />} />
        </Route>

        {/* Pages yang butuh login dan memakai Header/Footer lama */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Route>

        {/* Kalau route tidak ada, balik ke landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

const layoutStyle = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  backgroundColor: "#F2DCDB",
};

const mainContentStyle = {
  flex: 1,
  padding: 0,
  margin: 0,
};

const dashboardWrapperStyle = {
  maxWidth: "600px",
  margin: "40px auto",
  padding: "0 20px",
  fontFamily: "sans-serif",
};

const dashboardTitleStyle = {
  color: "#6C0820",
  textAlign: "center",
};

const historyListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  marginBottom: "40px",
};

const historyCardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  color: "#6C0820",
};

const dashboardButtonGroupStyle = {
  display: "flex",
  gap: "20px",
  justifyContent: "center",
};

const scanButtonStyle = {
  background: "#6C0820",
  color: "white",
  padding: "15px 25px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
  flex: 1,
};

const artikelButtonStyle = {
  background: "white",
  color: "#6C0820",
  padding: "15px 25px",
  borderRadius: "12px",
  border: "2px solid #6C0820",
  cursor: "pointer",
  fontWeight: "bold",
  flex: 1,
};

export default App;