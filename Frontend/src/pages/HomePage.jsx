import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => (
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
        borderRadius: 18,
        boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
        padding: '40px 32px 32px 32px',
        margin: '32px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 22,
      }}
    >
      <h1 style={{ color: '#007bff', fontWeight: 800, textAlign: 'center', letterSpacing: 1, fontSize: '2.2em' }}>
        Welcome to SkillSwap Connect!
      </h1>
      <p style={{ color: '#444', fontSize: '1.18em', textAlign: 'center', marginBottom: 0 }}>
        Exchange skills, connect with others, and grow together.<br />
        <span style={{ color: '#6c757d', fontSize: '1em' }}>
          Browse offers and requests, or create your own!
        </span>
      </p>
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center', marginTop: 10 }}>
        <Link
          to="/offers"
          style={{
            padding: '12px 28px',
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: 8,
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '1.08em',
            boxShadow: '0 2px 8px rgba(0,123,255,0.08)',
            transition: 'background 0.2s',
          }}
        >
          View Offers
        </Link>
        <Link
          to="/requests"
          style={{
            padding: '12px 28px',
            backgroundColor: '#28a745',
            color: 'white',
            borderRadius: 8,
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '1.08em',
            boxShadow: '0 2px 8px rgba(40,167,69,0.08)',
            transition: 'background 0.2s',
          }}
        >
          View Requests
        </Link>
      </div>
      <div style={{ textAlign: 'center', marginTop: 18, color: '#888', fontSize: '0.98em' }}>
        <span>Ready to share or learn? <Link to="/offers/create" style={{ color: '#007bff', textDecoration: 'underline' }}>Create an Offer</Link> or <Link to="/requests/create" style={{ color: '#28a745', textDecoration: 'underline' }}>Request a Skill</Link>!</span>
      </div>
    </div>
    <style>
      {`
        @media (max-width: 700px) {
          div[style*="max-width: 600px"] {
            padding: 18px 6px !important;
          }
          h1 {
            font-size: 1.3em !important;
          }
        }
      `}
    </style>
  </div>
);

export default HomePage;