import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ExchangeListPage = () => {
  const { userInfo } = useUser();
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExchanges = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/exchanges`,
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        setExchanges(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch exchanges.');
        setLoading(false);
      }
    };
    if (userInfo) fetchExchanges();
  }, [userInfo]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #e3f0ff 0%, #f8f9fa 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 10px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 700,
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
          My Skill Exchanges
        </h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 18 }}>Loading...</div>
        ) : error ? (
          <div style={{ color: 'red', textAlign: 'center', padding: 18 }}>{error}</div>
        ) : exchanges.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888', padding: 18 }}>
            No exchanges yet.
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {exchanges.map((ex) => (
              <li
                key={ex._id}
                style={{
                  borderBottom: '1px solid #eee',
                  padding: '14px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#007bff' }}>
                    With: {ex.otherUser?.name || 'User'}
                  </div>
                  <div style={{ color: '#555', fontSize: '0.98em' }}>
                    Offer: {ex.offer?.title || 'N/A'}<br />
                    Request: {ex.request?.title || 'N/A'}
                  </div>
                  <div style={{ color: '#888', fontSize: '0.93em', marginTop: 2 }}>
                    Status: {ex.status}
                  </div>
                </div>
                <Link
                  to={`/messages/${ex.otherUser?._id}`}
                  style={{
                    background: '#007bff',
                    color: '#fff',
                    borderRadius: 6,
                    padding: '8px 14px',
                    textDecoration: 'none',
                    fontWeight: 500,
                    fontSize: '1em',
                  }}
                >
                  Message
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <style>
        {`
          @media (max-width: 700px) {
            div[style*="max-width: 700px"] {
              padding: 18px 6px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ExchangeListPage;