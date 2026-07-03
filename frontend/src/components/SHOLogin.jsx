import React, { useState, useEffect } from 'react';

const thanasByDistrict = {
  "Agra (आगरा)": ["Tajganj (ताजगंज)", "Sikandra (सिकंदरा)", "Rakabganj (रकाबगंज)"],
  "Aligarh (अलीगढ़)": ["Civil Lines (सिविल लाइंस)", "Banna Devi (बन्ना देवी)", "Sasni Gate (सासनी गेट)"],
  "Ayodhya (अयोध्या)": ["Kotwali Ayodhya (कोतवाली अयोध्या)", "Ram Janmabhoomi (राम जन्मभूमि)"],
  "Bareilly (बरेली)": ["Kotwali (कोतवाली)", "Baradari (बारादरी)", "Prem Nagar (प्रेम नगर)"],
  "Ghaziabad (गाज़ियाबाद)": ["Indirapuram (इंदिरापुरम)", "Kavi Nagar (कवि नगर)", "Sihani Gate (सिहानी गेट)"],
  "Gorakhpur (गोरखपुर)": ["Cantt (कैंट)", "Gorakhnath (गोरखनाथ)", "Chauri Chaura (चौरी चौरा)"],
  "Kanpur Nagar (कानपुर नगर)": ["Kalyanpur (कल्याणपुर)", "Swaroop Nagar (स्वरूप नगर)", "Kakadeo (काकादेव)"],
  "Lucknow (लखनऊ)": ["Hazratganj (हज़रतगंज)", "Gomti Nagar (गोमती नगर)", "Alambagh (आलमबाग)"],
  "Meerut (मेरठ)": ["Sadar Bazar (सदर बाजार)", "Nauchandi (नौचंदी)", "Medical (मेडिकल)"],
  "Prayagraj (प्रयागराज)": ["Civil Lines (सिविल लाइंस)", "Kotwali (कोतवाली)", "Cantt (कैंट)"],
  "Varanasi (वाराणसी)": ["Dashashwamedh (दशाश्वमेध)", "Cantt (कैंट)", "Lanka (लंका)"]
};

export default function SHOLogin() {
  const upDistricts = [
    "Agra (आगरा)", "Aligarh (अलीगढ़)", "Ayodhya (अयोध्या)", "Bareilly (बरेली)", 
    "Ghaziabad (गाज़ियाबाद)", "Gorakhpur (गोरखपुर)", "Kanpur Nagar (कानपुर नगर)", 
    "Lucknow (लखनऊ)", "Meerut (मेरठ)", "Prayagraj (प्रयागराज)", "Varanasi (वाराणसी)"
  ];

  const [district, setDistrict] = useState('');
  const [role, setRole] = useState('ThanaDesk');
  const [username, setUsername] = useState('sho.civil.lines');
  const [password, setPassword] = useState('admin123');
  const [jurisdiction, setJurisdiction] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // On mount, load the district that the user selected on the Home Page
    const savedDistrict = localStorage.getItem('up_police_selected_district');
    if (savedDistrict) {
      setDistrict(savedDistrict);
    } else {
      // If no district selected, send back to home page
      window.location.hash = '#';
    }
  }, []);

  const availableThanas = district ? thanasByDistrict[district] || [] : [];

  useEffect(() => {
    if (availableThanas.length > 0 && !availableThanas.includes(jurisdiction)) {
      setJurisdiction(availableThanas[0]);
    } else if (availableThanas.length === 0) {
      setJurisdiction('');
    }
  }, [district]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password || !jurisdiction) {
      setError('कृपया सभी फ़ील्ड भरें (Please fill all fields).');
      return;
    }
    
    setLoading(true);
    
    // Simulate network delay & authentication
    setTimeout(() => {
      if (username === 'sho.civil.lines' && password === 'admin123') {
        if (role === 'SHO/SO') {
          localStorage.setItem('up_police_sho_auth', 'true');
          localStorage.setItem('up_police_sho_jurisdiction', jurisdiction);
          window.location.hash = '#sho-dashboard';
        } else {
          localStorage.setItem('up_police_auth', 'true');
          window.location.hash = '#thana-login';
        }
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
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '5px', background: 'var(--primary-khaki)' }} />
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '8px' }}>👮‍♂️</div>
          <h1 style={{ color: 'var(--primary-blue)', margin: 0, fontSize: '1.8rem', fontWeight: '800' }}>
            SHO / SO Administration
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '8px' }}>
            थाना प्रभारी प्रशासनिक प्रबंधन लॉगिन
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
          
          <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
            {district && (
              <div style={{ color: '#0369a1', fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '8px' }}>
                📍 Selected District: {district}
              </div>
            )}
            <div style={{ borderTop: '1px dashed #bae6fd', paddingTop: '8px' }}>
              <strong style={{ color: '#0284c7', fontSize: '0.85rem', display: 'block' }}>DEMO CREDENTIALS</strong>
              <span style={{ color: '#0ea5e9', fontSize: '0.8rem' }}>ID: sho.civil.lines | Pass: admin123</span>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>
              Role (भूमिका)
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', background: '#f8fafc', color: '#1e293b', boxSizing: 'border-box'
              }}
            >
              <option value="SHO/SO">SHO / SO (थाना प्रभारी)</option>
              <option value="ThanaDesk">Thana Desk (थाना डेस्क)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>
              Jurisdiction (थाना)
            </label>
            <select
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              style={{
                width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', background: '#f8fafc', color: '#1e293b', boxSizing: 'border-box'
              }}
              disabled={!district || availableThanas.length === 0}
            >
              <option value="">-- Select Thana --</option>
              {availableThanas.map(thana => <option key={thana} value={thana}>{thana}</option>)}
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
              placeholder="Enter SHO ID"
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
              width: '100%', padding: '14px', borderRadius: '8px', border: 'none', background: 'var(--primary-blue)', color: 'white',
              fontSize: '1.1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '8px',
              transition: 'background 0.3s ease', boxSizing: 'border-box'
            }}
          >
            {loading ? 'Authenticating...' : 'SECURE LOGIN (लॉगिन करें)'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <a href="#" style={{ color: 'var(--primary-blue)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
            &larr; Back to Home (होम पर लौटें)
          </a>
        </div>
      </div>
    </div>
  );
}
