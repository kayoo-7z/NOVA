import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Novition.css";
import { FaArrowLeft, FaEdit, FaLock } from "react-icons/fa";
import { BsRobot, BsLayoutSidebarInset } from "react-icons/bs";

export default function Novition() {
  const navigate = useNavigate();

  const [isLogin] = useState(Boolean(localStorage.getItem("token")));
  const [showSidebar, setShowSidebar] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    weight: "",
    height: "",
  });

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const handleUnauthorized = useCallback(() => {
    alert("Sesi login sudah habis. Silakan login kembali.");
    localStorage.removeItem("token");
    navigate("/login");
  }, [navigate]);

  const fetchHistory = useCallback(
    async (showLoading = false) => {
      const token = getToken();

      if (!token) {
        return;
      }

      try {
        if (showLoading) {
          setIsLoadingHistory(true);
        }

        const response = await api.get("/api/predict/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setHistory(response.data.data || []);
      } catch (error) {
        console.error(
          "Fetch history error:",
          error.response?.data || error.message
        );

        if (error.response?.status === 401) {
          handleUnauthorized();
        }
      } finally {
        if (showLoading) {
          setIsLoadingHistory(false);
        }
      }
    },
    [handleUnauthorized]
  );

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      fetchHistory(false);
    }, 0);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [fetchHistory]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAnalyze = async () => {
    if (
      !formData.name ||
      !formData.gender ||
      !formData.age ||
      !formData.weight ||
      !formData.height
    ) {
      alert("Semua indikator wajib diisi terlebih dahulu.");
      return;
    }

    const token = getToken();

    if (!token) {
      alert("Token tidak ditemukan. Silakan login kembali.");
      navigate("/login");
      return;
    }

    try {
      setIsAnalyzing(true);

      const response = await api.post(
        "/api/predict",
        {
          child_name: formData.name,
          gender: formData.gender,
          age_month: Number(formData.age),
          weight_kg: Number(formData.weight),
          height_cm: Number(formData.height),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const analysis = response.data.data;

      if (!analysis) {
        throw new Error("Response analisis tidak memiliki data.");
      }

      setResult(analysis);

      await fetchHistory(true);
    } catch (error) {
      console.error(
        "Analisis error:",
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        handleUnauthorized();
        return;
      }

      alert(
        error.response?.data?.message ||
          "Gagal melakukan analisis. Silakan coba lagi."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewChat = () => {
    setFormData({
      name: "",
      gender: "",
      age: "",
      weight: "",
      height: "",
    });

    setResult(null);
  };

  const handleSelectHistory = (item) => {
    setResult(item);

    setFormData({
      name: item.child_name || "",
      gender: item.gender || "",
      age: item.age_month || "",
      weight: item.weight_kg || "",
      height: item.height_cm || "",
    });
  };

  return (
    <div className="main-wrapper">
      <main className="askme-container">
        <header className="top-bar">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/")}
            aria-label="Back to landing"
          >
            <FaArrowLeft className="header-icon" />
          </button>

          <div className="top-icons">
            <BsRobot className="robot-top" />

            <BsLayoutSidebarInset
              className="header-icon"
              onClick={() => setShowSidebar((prev) => !prev)}
            />
          </div>
        </header>

        <h1 className="askme-title">Analisis Risiko Stunting</h1>

        <section className="form-full">
          <div className="field">
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Masukkan nama anak"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="field">
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
            >
              <option value="">Pilih Gender</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          <div className="field">
            <label>Age (Month)</label>
            <input
              type="number"
              name="age"
              placeholder="Masukkan usia dalam bulan"
              value={formData.age}
              onChange={handleInputChange}
            />
          </div>

          <div className="field">
            <label>Weight (kg)</label>
            <input
              type="number"
              name="weight"
              placeholder="Masukkan berat badan"
              value={formData.weight}
              onChange={handleInputChange}
            />
          </div>

          <div className="field">
            <label>Height (cm)</label>
            <input
              type="number"
              name="height"
              placeholder="Masukkan tinggi badan"
              value={formData.height}
              onChange={handleInputChange}
            />
          </div>

          <button
            type="button"
            className="analyze-button"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? "Menganalisis..." : "Analisis Stunting"}
          </button>
        </section>

        {result && (
          <section className="result-section-new">
            <h2>Hasil Prediksi</h2>

            <p>
              <strong>Nama Anak:</strong> {result.child_name || formData.name}
            </p>

            <p>
              <strong>Gender:</strong> {result.gender || formData.gender}
            </p>

            <p>
              <strong>Usia:</strong> {result.age_month || formData.age} bulan
            </p>

            <p>
              <strong>Berat Badan:</strong>{" "}
              {result.weight_kg || formData.weight} kg
            </p>

            <p>
              <strong>Tinggi Badan:</strong>{" "}
              {result.height_cm || formData.height} cm
            </p>

            <p>
              <strong>Kategori Risiko:</strong> {result.risk_category}
            </p>

            <p>
              <strong>Keyakinan:</strong> {result.confidence}
            </p>

            <p>
              <strong>BMI:</strong> {result.bmi}
            </p>

            {result.created_at && (
              <p>
                <strong>Waktu Analisis:</strong>{" "}
                {new Date(result.created_at).toLocaleString("id-ID")}
              </p>
            )}
          </section>
        )}

        {result && (
          <section className="bot-section-new">
            <div className="bot-avatar">
              <BsRobot />
            </div>

            <div className="bot-message-new">
              <h3>Respon Asisten AI</h3>
              <p>{result.ai_response}</p>
            </div>
          </section>
        )}

        {!isLogin && (
          <div className="login-overlay">
            <div className="overlay-content">
              <FaLock className="lock-icon" />
              <h2>You have to login or register</h2>
            </div>
          </div>
        )}
      </main>

      {showSidebar && (
        <aside className="sidebar">
          <button className="chat-baru-btn" onClick={handleNewChat}>
            Chat Baru <FaEdit />
          </button>

          <input type="text" className="search-bar" placeholder="Search" />

          <p>
            <strong>Terbaru</strong>
          </p>

          {isLoadingHistory ? (
            <p>Memuat riwayat...</p>
          ) : history.length > 0 ? (
            <div className="history-list">
              {history.map((item) => (
                <button
                  type="button"
                  className="history-item"
                  key={item.id}
                  onClick={() => handleSelectHistory(item)}
                >
                  <p>{item.child_name}</p>
                  <span>{item.risk_category}</span>
                  <small>
                    {item.created_at
                      ? new Date(item.created_at).toLocaleString("id-ID")
                      : ""}
                  </small>
                </button>
              ))}
            </div>
          ) : (
            <p>Riwayat analisis akan muncul di sini...</p>
          )}
        </aside>
      )}
    </div>
  );
}