import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const categories = [
  'Academics', 'Arts & Crafts', 'Home Services', 'Tech & IT', 'Language', 'Health & Wellness', 'Other'
];

const CreateRequestPage = () => {
  const { userInfo } = useUser();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [skillsNeeded, setSkillsNeeded] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/requests`,
        {
          title,
          description,
          category,
          skillsNeeded: skillsNeeded.split(',').map(s => s.trim()),
          location,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      setSuccess('Request created successfully!');
      setLoading(false);
      setTimeout(() => navigate('/requests'), 1200);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to create request. Please try again.'
      );
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #e3f0ff 0%, #f8f9fa 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '30px 10px'
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: 500,
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
          Create a New Request
        </h2>
        {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
        {success && <div style={{ color: '#28a745', textAlign: 'center' }}>{success}</div>}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
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
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          rows={4}
          style={{
            padding: '12px',
            border: '1.5px solid #e3e3e3',
            borderRadius: 8,
            fontSize: '1rem',
            outline: 'none',
            background: '#f8fafd',
            resize: 'vertical',
          }}
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
          style={{
            padding: '12px',
            border: '1.5px solid #e3e3e3',
            borderRadius: 8,
            fontSize: '1rem',
            outline: 'none',
            background: '#f8fafd',
          }}
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Skills Needed (comma separated)"
          value={skillsNeeded}
          onChange={e => setSkillsNeeded(e.target.value)}
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
          type="text"
          placeholder="Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
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
          {loading ? 'Creating...' : 'Create Request'}
        </button>
      </form>
      <style>
        {`
          @media (max-width: 700px) {
            form[style*="max-width: 500px"] {
              padding: 18px 6px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default CreateRequestPage;