import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';

const NotificationBell = () => {
  const { userInfo, logout } = useUser();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    if (!userInfo) {
      setUnreadCount(0); // No user, no unread notifications
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/notifications`, config);
      const count = data.filter(n => !n.read).length;
      setUnreadCount(count);
    } catch (err) {
      console.error('Error fetching unread notifications:', err);
      // If token is invalid, log out
      if (err.response && err.response.status === 401) {
        logout();
        navigate('/login');
      }
      setUnreadCount(0); // Assume 0 on error
    }
  };

  useEffect(() => {
    fetchUnreadCount(); // Fetch on component mount

    // Poll for new notifications every 10 seconds (adjust as needed)
    const interval = setInterval(fetchUnreadCount, 10000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [userInfo, logout, navigate]);

  return (
    <Link to="/notifications" style={{ position: 'relative', color: '#fff', textDecoration: 'none', marginLeft: '1rem', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
      <span role="img" aria-label="notifications" style={{ fontSize: '1.5rem' }}>🔔</span>
      {unreadCount > 0 && (
        <span style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          backgroundColor: 'red',
          color: 'white',
          borderRadius: '50%',
          padding: '2px 6px',
          fontSize: '0.7em',
          fontWeight: 'bold',
          minWidth: '20px',
          textAlign: 'center',
        }}>
          {unreadCount}
        </span>
      )}
      <span style={{ marginLeft: '5px' }}>Notifications</span>
    </Link>
  );
};

export default NotificationBell;