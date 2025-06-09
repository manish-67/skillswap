import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ConversationPage = () => {
  const { userInfo } = useUser();
  const { otherUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchConversation = async () => {
      if (!userInfo) return;
      setLoading(true);
      setError(null);
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/messages/conversation/${otherUserId}`,
          config
        );
        setMessages(data.messages || []);
        setOtherUser(data.otherUser || null);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message
        );
      }
    };
    fetchConversation();
    // Optionally, add polling or websockets for real-time updates
  }, [userInfo, otherUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/messages/conversation/${otherUserId}`,
        { content: newMessage },
        config
      );
      setMessages((prev) => [...prev, data]);
      setNewMessage('');
      setSending(false);
    } catch (err) {
      setError('Failed to send message.');
      setSending(false);
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
          minHeight: 500,
        }}
      >
        <h2 style={{ color: '#007bff', fontWeight: 700, textAlign: 'center', letterSpacing: 1 }}>
          Conversation with {otherUser?.name || 'User'}
        </h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 18 }}>Loading...</div>
        ) : error ? (
          <div style={{ color: 'red', textAlign: 'center', padding: 18 }}>{error}</div>
        ) : (
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              background: '#f8fafd',
              borderRadius: 10,
              padding: '16px 8px',
              marginBottom: 10,
              minHeight: 200,
              maxHeight: 350,
            }}
          >
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#888' }}>No messages yet.</div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  style={{
                    display: 'flex',
                    flexDirection: userInfo._id === msg.sender ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      background: userInfo._id === msg.sender ? '#007bff' : '#e3f0ff',
                      color: userInfo._id === msg.sender ? '#fff' : '#222',
                      borderRadius: 12,
                      padding: '10px 16px',
                      maxWidth: '70%',
                      wordBreak: 'break-word',
                      fontSize: '1em',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}
                  >
                    {msg.content}
                    <div style={{ fontSize: '0.85em', color: '#888', marginTop: 4, textAlign: 'right' }}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
        <form
          onSubmit={handleSend}
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'center',
            marginTop: 8,
          }}
        >
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            disabled={sending}
            style={{
              flex: 1,
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
            disabled={sending || !newMessage.trim()}
            style={{
              background: 'linear-gradient(90deg, #007bff 60%, #6f42c1 100%)',
              color: '#fff',
              padding: '12px 18px',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: '1.05rem',
              cursor: sending ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'background 0.2s, box-shadow 0.2s',
            }}
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
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

export default ConversationPage;