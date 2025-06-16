import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const RegisterAdmin = () => {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    adminId: '' 
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post('/auth/register-admin', form);
      alert("Admin registered successfully! Please login.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Register as Admin</h2>
        <input 
          name="name" 
          placeholder="Full Name" 
          value={form.name}
          onChange={handleChange} 
          required 
        />
        <input 
          name="email" 
          type="email"
          placeholder="Email" 
          value={form.email}
          onChange={handleChange} 
          required 
        />
        <input 
          name="password" 
          type="password" 
          placeholder="Password" 
          value={form.password}
          onChange={handleChange} 
          required 
        />
        <input 
          name="adminId" 
          placeholder="College Admin ID" 
          value={form.adminId}
          onChange={handleChange} 
          required 
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        
        <div className="auth-links">
          <p>Already have an account?</p>
          <button type="button" onClick={() => navigate('/login')}>
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterAdmin;