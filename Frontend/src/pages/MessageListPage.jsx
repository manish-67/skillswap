import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const MessageListPage = () => {
  const { userInfo } = useUser();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/messages/conversations`,
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        setConversations(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch conversations.');
        setLoading(false);
      }
    };
    if (userInfo) fetchConversations();
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
          My Conversations
        </h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 18 }}>Loading...</div>
        ) : error ? (
          <div style={{ color: 'red', textAlign: 'center', padding: 18 }}>{error}</div>
        ) : conversations.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888', padding: 18 }}>
            No conversations yet.
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {conversations.map((conv) => (
              <li
                key={conv._id}
                style={{
                  borderBottom: '1px solid #eee',
                  padding: '14px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <img
                  src={conv.otherUser?.profilePicture || '/default-avatar.png'}
                  alt={conv.otherUser?.name || 'User'}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #e3e3e3',
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#007bff' }}>
                    {conv.otherUser?.name || 'User'}
                  </div>
                  <div style={{ color: '#555', fontSize: '0.98em' }}>
                    {conv.lastMessage?.content
                      ? conv.lastMessage.content.length > 40
                        ? conv.lastMessage.content.slice(0, 40) + '...'
                        : conv.lastMessage.content
                      : 'No messages yet.'}
                  </div>
                </div>
                <Link
                  to={`/messages/${conv.otherUser?._id}`}
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
                  Open
                </Link>
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

export default MessageListPage;