import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ProposeExchangePage = () => {
  const { userInfo } = useUser();
  const navigate = useNavigate();
  const { targetUserId, offerId, requestId } = useParams();

  const [targetUser, setTargetUser] = useState(null);
  const [offer, setOffer] = useState(null);
  const [request, setRequest] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users/profile/${targetUserId}`,
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        setTargetUser(userRes.data);

        if (offerId) {
          const offerRes = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/offers/${offerId}`
          );
          setOffer(offerRes.data);
        }
        if (requestId) {
          const requestRes = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/requests/${requestId}`
          );
          setRequest(requestRes.data);
        }
      } catch (err) {
        setError('Failed to load exchange details.');
      }
    };
    if (userInfo && targetUserId) fetchData();
  }, [userInfo, targetUserId, offerId, requestId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/exchanges`,
        {
          targetUserId,
          offerId,
          requestId,
          message,
        },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setSuccess('Exchange proposal sent!');
      setLoading(false);
      setTimeout(() => navigate('/exchanges'), 1200);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to propose exchange. Please try again.'
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
        padding: '30px 10px',
      }}
    >
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
          Propose Skill Exchange
        </h2>
        {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
        {success && <div style={{ color: '#28a745', textAlign: 'center' }}>{success}</div>}
        <div style={{ color: '#444', fontSize: '1.05em', marginBottom: 8 }}>
          <strong>To:</strong> {targetUser?.name || 'User'}
        </div>
        {offer && (
          <div style={{ color: '#007bff', fontWeight: 600 }}>
            <span>Offer: {offer.title}</span>
          </div>
        )}
        {request && (
          <div style={{ color: '#28a745', fontWeight: 600 }}>
            <span>Request: {request.title}</span>
          </div>
        )}
        <textarea
          placeholder="Message (optional)"
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={3}
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
          {loading ? 'Sending...' : 'Send Proposal'}
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

export default ProposeExchangePage;