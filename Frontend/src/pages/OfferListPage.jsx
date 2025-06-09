import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Categories (ensure this matches backend categories or fetch them)
const categories = [
  'Academics', 'Arts & Crafts', 'Home Services', 'Tech & IT', 'Language', 'Health & Wellness', 'Other'
];

const OfferListPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and Filter states
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  // Fetch offers with filters
  const fetchOffers = async (searchParams) => {
    setLoading(true);
    setError(null);
    try {
      const queryString = new URLSearchParams(searchParams).toString();
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/offers?${queryString}`);
      setOffers(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch offers. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const initialKeyword = params.get('keyword') || '';
    const initialCategory = params.get('category') || '';
    const initialLocation = params.get('location') || '';

    setKeyword(initialKeyword);
    setSelectedCategory(initialCategory);
    setLocationFilter(initialLocation);

    fetchOffers({
      keyword: initialKeyword,
      category: initialCategory,
      location: initialLocation,
    });
  }, [location.search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (keyword) params.keyword = keyword;
    if (selectedCategory) params.category = selectedCategory;
    if (locationFilter) params.location = locationFilter;
    navigate(`/offers?${new URLSearchParams(params).toString()}`);
  };

  // Responsive card style
  const cardStyle = {
    border: '1px solid #e3e3e3',
    borderRadius: '14px',
    padding: '20px',
    background: '#fff',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: 200,
    transition: 'box-shadow 0.2s',
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: 'linear-gradient(120deg, #e3f0ff 0%, #f8f9fa 100%)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '32px', color: '#007bff', fontWeight: 700, letterSpacing: 1 }}>
        Available Skill Offers
      </h2>

      {/* Search and Filter Form */}
      <form
        onSubmit={handleSearchSubmit}
        style={{
          margin: '0 auto 32px auto',
          padding: '18px',
          border: '1px solid #ddd',
          borderRadius: '12px',
          background: '#fff',
          maxWidth: 900,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '14px',
          justifyContent: 'center',
        }}
      >
        <input
          type="text"
          placeholder="Search by keyword (e.g., React, tutoring)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            flex: '1 1 200px',
            minWidth: 180,
            fontSize: '1em',
          }}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            flex: '1 1 150px',
            minWidth: 140,
            fontSize: '1em',
          }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Filter by location (e.g., Delhi)"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          style={{
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            flex: '1 1 150px',
            minWidth: 120,
            fontSize: '1em',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 18px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '1em',
          }}
        >
          Search & Filter
        </button>
        <button
          type="button"
          onClick={() => { setKeyword(''); setSelectedCategory(''); setLocationFilter(''); navigate('/offers'); }}
          style={{
            padding: '10px 18px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '1em',
          }}
        >
          Reset
        </button>
      </form>

      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>Loading offers...</div>
      ) : error ? (
        <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>Error: {error}</div>
      ) : offers.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No offers found matching your criteria.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '24px',
            maxWidth: 1200,
            margin: '0 auto',
          }}
        >
          {offers.map((offer) => (
            <div
              key={offer._id}
              style={cardStyle}
              tabIndex={0}
              aria-label={`Offer: ${offer.title}`}
            >
              <h3 style={{ margin: '0 0 10px 0', color: '#007bff', fontWeight: 600 }}>
                <Link to={`/offers/${offer._id}`} style={{ textDecoration: 'none', color: '#007bff' }}>
                  {offer.title}
                </Link>
              </h3>
              <p style={{ fontSize: '0.97em', color: '#555', margin: '0 0 8px 0' }}>
                By: {offer.user ? offer.user.name : 'Unknown'} ({offer.user ? offer.user.location : 'N/A'})
              </p>
              <p style={{ margin: '0 0 10px 0', color: '#444' }}>
                {offer.description.length > 100
                  ? offer.description.substring(0, 100) + '...'
                  : offer.description}
              </p>
              <div style={{ fontSize: '0.93em', color: '#777', marginBottom: 10 }}>
                <strong>Category:</strong> {offer.category}<br />
                <strong>Skills:</strong> {offer.skills.join(', ')}
              </div>
              <Link
                to={`/offers/${offer._id}`}
                style={{
                  display: 'inline-block',
                  marginTop: 'auto',
                  padding: '8px 14px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontWeight: 500,
                  fontSize: '1em',
                  alignSelf: 'flex-start',
                }}
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Link
          to="/offers/create"
          style={{
            display: 'inline-block',
            padding: '12px 28px',
            backgroundColor: '#28a745',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '1.15em',
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(40,167,69,0.08)',
            transition: 'background 0.2s',
          }}
        >
          + Create New Offer
        </Link>
      </div>

      {/* Responsive styles */}
      <style>
        {`
          @media (max-width: 700px) {
            form {
              flex-direction: column !important;
              gap: 10px !important;
            }
            .offer-card {
              min-width: 90vw !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default OfferListPage;