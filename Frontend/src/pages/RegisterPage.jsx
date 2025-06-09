import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { userInfo, login } = useUser();

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/register`,
        { name, email, password }
      );
      login(data);
      setLoading(false);
      navigate('/');
    } catch (err) {
      setMessage(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #e3f0ff 0%, #f8f9fa 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 10px'
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
          padding: '36px 32px 28px 32px',
          margin: '32px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        <h2 style={{ color: '#007bff', fontWeight: 700, textAlign: 'center', letterSpacing: 1 }}>
          Register
        </h2>
        {message && (
          <div
            style={{
              color: message.includes('match') ? '#dc3545' : '#dc3545',
              background: '#fff0f0',
              borderRadius: 6,
              padding: '10px 0',
              marginBottom: 8,
              textAlign: 'center',
              fontWeight: 500,
            }}
          >
            {message}
          </div>
        )}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={{
            padding: '12px',
            border: '1.5px solid #e3e3e3',
            borderRadius: 8,
            fontSize: '1rem',
            outline: 'none',
            background: '#f8fafd',
          }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{
            padding: '12px',
            border: '1.5px solid #e3e3e3',
            borderRadius: 8,
            fontSize: '1rem',
            outline: 'none',
            background: '#f8fafd',
          }}
        />
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{
            padding: '12px',
            border: '1.5px solid #e3e3e3',
            borderRadius: 8,
            fontSize: '1rem',
            outline: 'none',
            background: '#f8fafd',
          }}
        />
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          style={{
            padding: '12px',
            border: '1.5px solid #e3e3e3',
            borderRadius: 8,
            fontSize: '1rem',
            outline: 'none',
            background: '#f8fafd',
          }}
        />
        <label style={{ fontSize: '0.98em', color: '#555', marginBottom: 0 }}>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            style={{ marginRight: 8 }}
            aria-label="Show Password"
          />
          Show Password
        </label>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            background: 'linear-gradient(90deg, #007bff 60%, #6f42c1 100%)',
            color: '#fff',
            padding: '12px',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: '1.1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            transition: 'background 0.2s, box-shadow 0.2s',
            marginBottom: 10,
          }}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        <div style={{ textAlign: 'center', fontSize: '0.98em', marginTop: 8 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#007bff', textDecoration: 'underline' }}>
            Login
          </Link>
        </div>
      </form>
      <style>
        {`
          @media (max-width: 700px) {
            form[style*="max-width: 420px"] {
              padding: 18px 6px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default RegisterPage;