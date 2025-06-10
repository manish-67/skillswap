import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const RequestDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useUser();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    const fetchRequest = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/requests/${id}`);
        setRequest(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch request details.');
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/requests/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setDeleteLoading(false);
      navigate('/requests');
    } catch (err) {
      setDeleteError('Failed to delete request.');
      setDeleteLoading(false);
    }
  };

  if (loading) return <div style={{ padding: 24, textAlign: 'center' }}>Loading...</div>;
  if (error) return <div style={{ padding: 24, textAlign: 'center', color: 'red' }}>{error}</div>;
  if (!request) return null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #e3f0ff 0%, #f8f9fa 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '30px 10px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 540,
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
        padding: '36px 32px 28px 32px',
        margin: '32px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
      }}>
        <h2 style={{ color: '#007bff', fontWeight: 700, marginBottom: 8, textAlign: 'center', letterSpacing: 1 }}>
          {request.title}
        </h2>
        <div style={{ color: '#555', fontSize: '1.05em', marginBottom: 8 }}>
          <strong>By:</strong> {request.user?.name || 'Unknown'} ({request.user?.location || 'N/A'})
        </div>
        <div style={{ color: '#444', fontSize: '1.08em', marginBottom: 8 }}>
          {request.description}
        </div>
        <div style={{ color: '#777', fontSize: '1em', marginBottom: 8 }}>
          <strong>Category:</strong> {request.category}<br />
          <strong>Skills Needed:</strong> {request.skills.join(', ')}
        </div>
        <div style={{ color: '#777', fontSize: '1em', marginBottom: 8 }}>
          <strong>Posted:</strong> {new Date(request.createdAt).toLocaleString()}
        </div>
        {deleteError && (
          <div style={{ color: 'red', marginBottom: 8 }}>{deleteError}</div>
        )}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 10 }}>
          <Link
            to="/requests"
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              borderRadius: 8,
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '1em',
            }}
          >
            Back to Requests
          </Link>
          {userInfo && request.user && userInfo._id === request.user._id && (
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              style={{
                padding: '10px 20px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: '1em',
                cursor: deleteLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {deleteLoading ? 'Deleting...' : 'Delete Request'}
            </button>
          )}
        </div>
      </div>
      <style>
        {`
          @media (max-width: 700px) {
            div[style*="max-width: 540px"] {
              padding: 18px 6px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default RequestDetailsPage;