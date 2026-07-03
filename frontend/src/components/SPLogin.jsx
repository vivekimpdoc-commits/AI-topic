import React, { useState, useEffect } from 'react';

const upDistricts = [
  "Agra (आगरा)", "Aligarh (अलीगढ़)", "Ayodhya (अयोध्या)", "Bareilly (बरेली)", 
  "Ghaziabad (गाज़ियाबाद)", "Gorakhpur (गोरखपुर)", "Kanpur Nagar (कानपुर नगर)", 
  "Lucknow (लखनऊ)", "Meerut (मेरठ)", "Prayagraj (प्रयागराज)", "Varanasi (वाराणसी)"
];

export default function SPLogin() {
  const [district, setDistrict] = useState('');
  const [username, setUsername] = useState('sp.admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password || !district) {
      setError('कृपया सभी फ़ील्ड भरें (Please fill all fields).');
      return;
    }
    
    setLoading(true);
    
    // Simulate network delay & authentication
    setTimeout(() => {
      if (username === 'sp.admin' && password === 'admin123') {
        localStorage.setItem('up_police_sp_auth', 'true');
        localStorage.setItem('up_police_sp_district', district);
        window.location.hash = '#sp-dashboard';
      } else {
        setError('अमान्य क्रेडेंशियल (Invalid Credentials).');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      fontFamily: 'var(--font-primary)'
    }}>
      <div style={{
        background: '#ffffff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        width: '100%',
        maxWidth: '450px',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}>
        {/* Top Accent Line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '5px', background: '#1d4ed8' }} />
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🏢</div>
          <h1 style={{ color: '#1d4ed8', margin: 0, fontSize: '1.8rem', fontWeight: '800' }}>
            SSP / SP Administration
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '8px' }}>
            वरिष्ठ पुलिस अधीक्षक प्रशासनिक प्रबंधन लॉगिन
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#b91c1c',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '0.9rem',
            textAlign: 'center',
            border: '1px solid #f87171'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
            <strong style={{ color: '#1d4ed8', fontSize: '0.85rem', display: 'block' }}>DEMO CREDENTIALS</strong>
            <span style={{ color: '#2563eb', fontSize: '0.8rem' }}>ID: sp.admin | Pass: admin123</span>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>
              District (ज़िला)
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              style={{
                width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', background: '#f8fafc', color: '#1e293b', boxSizing: 'border-box'
              }}
            >
              <option value="">-- Select District --</option>
              {upDistricts.map(dist => <option key={dist} value={dist}>{dist}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>
              Username / ID (लॉगिन आईडी)
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter SP ID"
              style={{
                width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>
              Password (पासवर्ड)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              style={{
                width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: '#1d4ed8',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '10px',
              opacity: loading ? 0.7 : 1,
              transition: 'background 0.3s'
            }}
          >
            {loading ? 'Authenticating...' : 'SECURE LOGIN (लॉगिन करें)'}
          </button>

          <a href="#" style={{
            display: 'block',
            textAlign: 'center',
            color: '#1d4ed8',
            textDecoration: 'none',
            fontSize: '0.9rem',
            marginTop: '8px'
          }}>
            &larr; Back to Home (होम पर लौटें)
          </a>
        </form>
      </div>
    </div>
  );
}
