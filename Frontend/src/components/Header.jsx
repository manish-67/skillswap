import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import logo from '../assets/logo-new.png';

const Header = () => {
  const { userInfo, logout } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      style={{
        width: '100%',
        background: '#fff',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        padding: '0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <nav
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          height: 64,
        }}
      >
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            fontWeight: 800,
            fontSize: '1.35em',
            color: '#007bff',
            textDecoration: 'none',
            letterSpacing: 1,
            gap: 10,
          }}
        >
          <img
            src={logo}
            alt="SkillSwap Connect Logo"
            style={{
              width: 250,
              height: 250,
              objectFit: 'contain',
              borderRadius: 10,
              marginRight: 0,
              background: 'transparent',
              
              
              transition: 'width 0.2s, height 0.2s',
            }}
            className="header-logo"
          />
        </Link>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="header-menu-btn"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            fontSize: 28,
            cursor: 'pointer',
            color: '#007bff',
          }}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
        <ul
          className={`header-nav ${menuOpen ? 'open' : ''}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            listStyle: 'none',
            margin: 0,
            padding: 0,
            transition: 'all 0.2s',
          }}
        >
          <li>
            <Link to="/offers" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 600 }}>Offers</Link>
          </li>
          <li>
            <Link to="/requests" style={{ color: '#28a745', textDecoration: 'none', fontWeight: 600 }}>Requests</Link>
          </li>
          {userInfo && (
            <>
              <li>
                <Link to="/exchanges" style={{ color: '#6f42c1', textDecoration: 'none', fontWeight: 600 }}>Exchanges</Link>
              </li>
              <li>
                <Link to="/messages" style={{ color: '#fd7e14', textDecoration: 'none', fontWeight: 600 }}>Messages</Link>
              </li>
              <li>
                <Link to="/notifications" style={{ color: '#17a2b8', textDecoration: 'none', fontWeight: 600 }}>Notifications</Link>
              </li>
              <li>
                <Link to="/profile" style={{ color: '#343a40', textDecoration: 'none', fontWeight: 600 }}>
                  {userInfo.profilePicture ? (
                    <img
                      src={userInfo.profilePicture}
                      alt="Profile"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        marginRight: 8,
                        verticalAlign: 'middle',
                        border: '2px solid #e3e3e3',
                      }}
                    />
                  ) : (
                    <span style={{
                      display: 'inline-block',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: '#e3f0ff',
                      color: '#007bff',
                      textAlign: 'center',
                      lineHeight: '32px',
                      fontWeight: 700,
                      marginRight: 8,
                      verticalAlign: 'middle',
                    }}>
                      {userInfo.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  )}
                  {userInfo.name?.split(' ')[0]}
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  style={{
                    background: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '7px 16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          )}
          {!userInfo && (
            <>
              <li>
                <Link to="/login" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 600 }}>Login</Link>
              </li>
              <li>
                <Link to="/register" style={{ color: '#28a745', textDecoration: 'none', fontWeight: 600 }}>Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <style>
        {`
          @media (max-width: 900px) {
            nav {
              padding: 0 8px !important;
            }
          }
          @media (max-width: 700px) {
            .header-menu-btn {
              display: block !important;
            }
            .header-nav {
              position: absolute;
              top: 64px;
              left: 0;
              width: 100vw;
              background: #fff;
              flex-direction: column;
              align-items: flex-start;
              gap: 0;
              border-bottom: 1px solid #e3e3e3;
              box-shadow: 0 2px 12px rgba(0,0,0,0.06);
              display: none;
              z-index: 1000;
            }
            .header-nav.open {
              display: flex !important;
            }
            .header-nav li {
              width: 100%;
              padding: 14px 24px;
              border-bottom: 1px solid #f0f0f0;
            }
            .header-logo {
              width: 34px !important;
              height: 34px !important;
            }
          }
          @media (max-width: 400px) {
            .header-logo {
              width: 26px !important;
              height: 26px !important;
            }
          }
        `}
      </style>
    </header>
  );
};

export default Header;