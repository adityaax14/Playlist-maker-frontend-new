
import React, { useState } from "react";
import AuthLayout from "../components/AuthLayout.jsx";
import { loginUser } from "../api/auth.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await loginUser(form);

    if (res?.data?.user) {
      setUser(res.data.user);
      navigate("/dashboard");
    }
  } catch (err) {
    setError(err.message);
  }
};


  return (
    <AuthLayout>
  <div className="auth-card">
    <h2 className="auth-title">Login</h2>

    <form onSubmit={handleSubmit} className="auth-form">
      <input
        name="email"
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="password"
        type="password"
        onChange={handleChange}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>

    <p className="auth-footer">
      Don’t have an account? <span onClick={() => navigate("/register")}>Register</span>
    </p>
  </div>
</AuthLayout>

  );
}
