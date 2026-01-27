import React from "react";

import { useState } from "react";
import { registerUser } from "../api/auth.js";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";



export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const [error, setError] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
    const res = await registerUser(form);

    
  } catch (err) {
    setError(err.message);
  }
  };

  return (
    <AuthLayout>
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input name="username" onChange={handleChange} placeholder="Username" />
      <input name="email" onChange={handleChange} placeholder="Email" />
      <input name="password" type="password" onChange={handleChange} placeholder="Password" />
      <button type="submit">Register</button>
       <p className="auth-footer">
        Already have an account? <span onClick={() => navigate("/login")}>Login</span>
      </p>
      {error && <p className="error-text">{error}</p>}
    </form>
    </AuthLayout>
  );
}
