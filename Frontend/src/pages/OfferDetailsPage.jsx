import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const OfferDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useUser();

  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    const fetchOffer = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/offers/${id}`);
        setOffer(data);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          'Failed to fetch offer details.'
        );
        setLoading(false);
      }
    };
    fetchOffer();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/offers/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setDeleteLoading(false);
      navigate('/offers');
    } catch (err) {
      setDeleteError('Failed to delete offer.');
      setDeleteLoading(false);
    }
  };

  if (loading) return <div style={{ padding: 24, textAlign: 'center' }}>Loading...</div>;
  if (error) return <div style={{ padding: 24, textAlign: 'center', color: 'red' }}>{error}</div>;
  if (!offer) return null;

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
          {offer.title}
        </h2>
        <div style={{ color: '#555', fontSize: '1.05em', marginBottom: 8 }}>
          <strong>By:</strong> {offer.user?.name || 'Unknown'} ({offer.user?.location || 'N/A'})
        </div>
        <div style={{ color: '#444', fontSize: '1.08em', marginBottom: 8 }}>
          {offer.description}
        </div>
        <div style={{ color: '#777', fontSize: '1em', marginBottom: 8 }}>
          <strong>Category:</strong> {offer.category}<br />
          <strong>Skills:</strong> {offer.skills.join(', ')}
        </div>
        <div style={{ color: '#777', fontSize: '1em', marginBottom: 8 }}>
          <strong>Posted:</strong> {new Date(offer.createdAt).toLocaleString()}
        </div>
        {deleteError && (
          <div style={{ color: 'red', marginBottom: 8 }}>{deleteError}</div>
        )}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 10 }}>
          <Link
            to="/offers"
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
            Back to Offers
          </Link>
          {userInfo && offer.user && userInfo._id === offer.user._id && (
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
              {deleteLoading ? 'Deleting...' : 'Delete Offer'}
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

export default OfferDetailsPage;