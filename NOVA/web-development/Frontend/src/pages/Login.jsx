import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/auth/login", {
        email: email.toLowerCase().trim(),
        password,
      });

      console.log("Login success:", response.data);

      const token =
        response.data.accessToken ||
        response.data.token ||
        response.data.data?.accessToken ||
        response.data.data?.token;

      if (!token) {
        alert("Token tidak ditemukan dari server");
        return;
      }

      localStorage.setItem("token", token);

      alert("Login berhasil");
      navigate("/landing");
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);

      alert(
        error.response?.data?.message ||
          "Login gagal. Email atau password salah."
      );
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card auth-card-login">
        <h1>Login</h1>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-submit-button">
            Login
          </button>
        </form>

        <p className="auth-footer-text">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </section>
    </main>
  );
};

export default Login;