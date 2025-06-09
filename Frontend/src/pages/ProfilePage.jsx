import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const ProfilePage = () => {
  const { userInfo, updateUser } = useUser();

  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [aboutMe, setAboutMe] = useState(userInfo?.aboutMe || '');
  const [location, setLocation] = useState(userInfo?.location || '');
  const [skillsOffered, setSkillsOffered] = useState(userInfo?.skillsOffered?.join(', ') || '');
  const [skillsNeeded, setSkillsNeeded] = useState(userInfo?.skillsNeeded?.join(', ') || '');
  const [profilePicture, setProfilePicture] = useState(userInfo?.profilePicture || '');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(userInfo?.name || '');
    setEmail(userInfo?.email || '');
    setAboutMe(userInfo?.aboutMe || '');
    setLocation(userInfo?.location || '');
    setSkillsOffered(userInfo?.skillsOffered?.join(', ') || '');
    setSkillsNeeded(userInfo?.skillsNeeded?.join(', ') || '');
    setProfilePicture(userInfo?.profilePicture || '');
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/users/profile`,
        {
          name,
          email,
          aboutMe,
          location,
          skillsOffered: skillsOffered.split(',').map(s => s.trim()),
          skillsNeeded: skillsNeeded.split(',').map(s => s.trim()),
          profilePicture,
        },
        config
      );
      updateUser(data);
      setMessage('Profile updated successfully!');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setMessage(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
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
        padding: '30px 10px'
      }}
    >
      <form
        onSubmit={submitHandler}
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
          My Profile
        </h2>
        {message && (
          <div
            style={{
              color: message.includes('success') ? '#28a745' : '#dc3545',
              background: message.includes('success') ? '#eafaf1' : '#fff0f0',
              borderRadius: 6,
              padding: '10px 0',
              marginBottom: 8,
              textAlign: 'center',
              fontWeight: 500,
            }}
          >
            {message}
          </div>
        )}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={{
            padding: '12px',
            border: '1.5px solid #e3e3e3',
            borderRadius: 8,
            fontSize: '1rem',
            outline: 'none',
            background: '#f8fafd',
          }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{
            padding: '12px',
            border: '1.5px solid #e3e3e3',
            borderRadius: 8,
            fontSize: '1rem',
            outline: 'none',
            background: '#f8fafd',
          }}
        />
        <textarea
          placeholder="About Me"
          value={aboutMe}
          onChange={e => setAboutMe(e.target.value)}
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
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
          style={{
            padding: '12px',
            border: '1.5px solid #e3e3e3',
            borderRadius: 8,
            fontSize: '1rem',
            outline: 'none',
            background: '#f8fafd',
          }}
        />
        <input
          type="text"
          placeholder="Skills Offered (comma separated)"
          value={skillsOffered}
          onChange={e => setSkillsOffered(e.target.value)}
          style={{
            padding: '12px',
            border: '1.5px solid #e3e3e3',
            borderRadius: 8,
            fontSize: '1rem',
            outline: 'none',
            background: '#f8fafd',
          }}
        />
        <input
          type="text"
          placeholder="Skills Needed (comma separated)"
          value={skillsNeeded}
          onChange={e => setSkillsNeeded(e.target.value)}
          style={{
            padding: '12px',
            border: '1.5px solid #e3e3e3',
            borderRadius: 8,
            fontSize: '1rem',
            outline: 'none',
            background: '#f8fafd',
          }}
        />
        <input
          type="text"
          placeholder="Profile Picture URL"
          value={profilePicture}
          onChange={e => setProfilePicture(e.target.value)}
          style={{
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
          {loading ? 'Saving...' : 'Update Profile'}
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

export default ProfilePage;