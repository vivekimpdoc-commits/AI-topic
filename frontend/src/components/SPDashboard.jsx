import React, { useState, useEffect } from 'react';
import DutyManagement from './DutyManagement';
import GPSRadar from './GPSRadar';

// Mock data for SP Dashboard
const mockThanaStatus = [
  { id: 1, name: 'Civil Lines (सिविल लाइंस)', force: 45, pending: 2, status: 'Normal' },
  { id: 2, name: 'Kotwali (कोतवाली)', force: 38, pending: 5, status: 'Alert' },
  { id: 3, name: 'Cantt (कैंट)', force: 52, pending: 1, status: 'Normal' },
  { id: 4, name: 'Kydganj (कीडगंज)', force: 30, pending: 0, status: 'Normal' },
  { id: 5, name: 'Mutthiganj (मुट्ठीगंज)', force: 28, pending: 3, status: 'Normal' }
];

export default function SPDashboard() {
  const [district, setDistrict] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Auth check
    const isAuth = localStorage.getItem('up_police_sp_auth');
    if (isAuth !== 'true') {
      window.location.hash = '#sp-login';
    }
    const savedDistrict = localStorage.getItem('up_police_sp_district');
    setDistrict(savedDistrict || 'Unknown District');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('up_police_sp_auth');
    window.location.hash = '#';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: 'var(--font-primary)' }}>
      {/* SP Top Navbar */}
      <nav style={{ background: '#1e3a8a', color: 'white', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>

        {/* Left Side: Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.5rem' }}>🏢</span>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold', color: 'white' }}>SSP / SP Dashboard</h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#93c5fd' }}>District: {district}</p>
          </div>
        </div>

        {/* Center: Navigation Menu */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              color: activeTab === 'overview' ? 'white' : '#93c5fd',
              textDecoration: 'none', fontWeight: 'bold', padding: '8px 16px',
              background: activeTab === 'overview' ? 'rgba(255,255,255,0.2)' : 'transparent',
              border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab('duty-management')}
            style={{
              color: activeTab === 'duty-management' ? 'white' : '#93c5fd',
              textDecoration: 'none', fontWeight: 'bold', padding: '8px 16px',
              background: activeTab === 'duty-management' ? 'rgba(255,255,255,0.2)' : 'transparent',
              border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            📋 Duty Management (ड्यूटी प्रबंधन)
          </button>
        </div>

        {/* Right Side: Logout & Home */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <a href="#" style={{ background: 'transparent', color: '#fbbf24', border: '1px solid #fbbf24', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.3s' }} onMouseOver={e => {e.target.style.background='#fbbf24'; e.target.style.color='#1e3a8a'}} onMouseOut={e => {e.target.style.background='transparent'; e.target.style.color='#fbbf24'}}>
            🏠 Home
          </a>
          <button onClick={handleLogout} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.3s' }} onMouseOver={e => e.target.style.background = '#dc2626'} onMouseOut={e => e.target.style.background = '#ef4444'}>
            Logout
          </button>
        </div>
      </nav>

      {activeTab === 'overview' ? (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>

          {/* Top Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #3b82f6' }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '0.9rem' }}>Total Thanas (कुल थाने)</h3>
              <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b' }}>{mockThanaStatus.length}</p>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #10b981' }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '0.9rem' }}>Active District Force (सक्रिय पुलिस बल)</h3>
              <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b' }}>193 <span style={{ fontSize: '1rem', color: '#10b981' }}>Officers</span></p>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #f59e0b' }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '0.9rem' }}>VIP / Special Duties (विशेष ड्यूटी)</h3>
              <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b' }}>11 <span style={{ fontSize: '1rem', color: '#f59e0b' }}>Active</span></p>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #ef4444' }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '0.9rem' }}>Law & Order Alerts (अलर्ट)</h3>
              <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: '#ef4444' }}>1 Active</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>

            {/* Main Thana List */}
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b' }}>Thana Performance & Status (थाना स्थिति)</h2>
                <button style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>View All</button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '12px', color: '#475569', fontWeight: '600' }}>Thana (थाना)</th>
                      <th style={{ padding: '12px', color: '#475569', fontWeight: '600' }}>Active Force</th>
                      <th style={{ padding: '12px', color: '#475569', fontWeight: '600' }}>Officers on Leave (अवकाश पर)</th>
                      <th style={{ padding: '12px', color: '#475569', fontWeight: '600' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockThanaStatus.map((t) => (
                      <tr key={t.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '12px', fontWeight: '500', color: '#1e293b' }}>{t.name}</td>
                        <td style={{ padding: '12px', color: '#64748b' }}>{t.force} Personnel</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            background: t.pending > 3 ? '#fee2e2' : '#f1f5f9',
                            color: t.pending > 3 ? '#b91c1c' : '#475569',
                            padding: '4px 8px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold'
                          }}>
                            {t.pending} on Leave
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            color: t.status === 'Alert' ? '#ef4444' : '#10b981', fontWeight: '600', fontSize: '0.9rem'
                          }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.status === 'Alert' ? '#ef4444' : '#10b981' }}></span>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#1e293b' }}>Quick Actions (त्वरित कार्रवाई)</h2>

                <button style={{
                  width: '100%', padding: '12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px',
                  fontWeight: 'bold', marginBottom: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}>
                  <span>🚨</span> Issue District Alert
                </button>

                <button style={{
                  width: '100%', padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px',
                  fontWeight: 'bold', marginBottom: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}>
                  <span>📅</span> Major Event Deployment
                </button>

                <button style={{
                  width: '100%', padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px',
                  fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}>
                  <span>📊</span> Generate District Report
                </button>
              </div>

              <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#1e293b' }}>Live District Map</h2>
                <GPSRadar title="Live District Tracking" />
              </div>
            </div>

          </div>
        </div>
      ) : (
        <DutyManagement />
      )}
    </div>
  );
}
