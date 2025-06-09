import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const NotificationListPage = () => {
  const { userInfo } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/notifications`,
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        setNotifications(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch notifications.');
        setLoading(false);
      }
    };
    if (userInfo) fetchNotifications();
  }, [userInfo]);

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      // Optionally show error
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
      <div
        style={{
          width: '100%',
          maxWidth: 600,
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
          Notifications
        </h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 18 }}>Loading...</div>
        ) : error ? (
          <div style={{ color: 'red', textAlign: 'center', padding: 18 }}>{error}</div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888', padding: 18 }}>
            No notifications yet.
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {notifications.map((n) => (
              <li
                key={n._id}
                style={{
                  borderBottom: '1px solid #eee',
                  padding: '14px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: n.read ? '#f8fafd' : '#e3f0ff33',
                  borderRadius: 6,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: n.read ? 400 : 600, color: n.read ? '#555' : '#007bff' }}>
                    {n.message}
                  </div>
                  <div style={{ color: '#888', fontSize: '0.93em', marginTop: 2 }}>
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
                {!n.read && (
                  <button
                    onClick={() => markAsRead(n._id)}
                    style={{
                      background: '#007bff',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '7px 14px',
                      fontWeight: 500,
                      fontSize: '0.98em',
                      cursor: 'pointer',
                    }}
                  >
                    Mark as Read
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <style>
        {`
          @media (max-width: 700px) {
            div[style*="max-width: 600px"] {
              padding: 18px 6px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default NotificationListPage;