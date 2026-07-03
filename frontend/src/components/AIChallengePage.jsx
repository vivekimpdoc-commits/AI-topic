import React from 'react';

export default function AIChallengePage() {
  return (
    <div className="homepage-container">
      {/* Header */}
      <header className="hp-header">
        <div className="hp-header-content" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="hp-logo-container" style={{ marginBottom: 0 }}>
            <span className="hp-shield">🛡️</span>
            <div>
              <h1 className="hp-title" style={{ fontSize: '1.5rem', textAlign: 'left' }}>KARTAVYA (कर्तव्य)</h1>
              <p className="hp-subtitle" style={{ fontSize: '0.8rem', textAlign: 'left' }}>AI Innovation Challenge</p>
            </div>
          </div>
          <a href="#" className="btn btn-secondary" style={{ textDecoration: 'none', background: 'transparent', border: '1px solid #64748b', color: '#ffffff' }}>
            &larr; Back to Home
          </a>
        </div>
      </header>

      {/* Alert Banner */}
      <div className="hp-alert-wrapper">
        <div className="hp-alert-banner">
          <div className="hp-alert-text">
            <span className="hp-alert-icon">🚨</span>
            <strong>अलर्ट:</strong> कंट्रोल रूम से लाइव अपडेट्स और आपातकालीन सूचनाएं यहां दिखेंगी।
          </div>
          <button className="btn btn-danger hp-emergency-btn">EMERGENCY SOS</button>
        </div>
      </div>

      {/* Main Content */}
      <main className="hp-main">
        <h2 style={{ fontSize: '1.8rem', color: '#1e293b', marginBottom: '24px', fontWeight: 'bold' }}>AI Innovation Challenge के अंतर्गत UP Police</h2>
        
        <div className="hp-grid animate-fade-in">
          {/* Placeholder card */}
          <div className="hp-card" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
            <p className="hp-card-desc" style={{ marginBottom: 0, fontSize: '1rem', color: '#1e293b' }}>
              विवरण जल्द ही उपलब्ध होगा... (Details Coming Soon)
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: '#1e293b', borderTop: '1px solid #334155', padding: '20px 0', marginTop: 'auto', textAlign: 'left' }}>
        <div style={{ maxWidth: '100%', margin: '0', padding: '0 24px' }}>
          <h4 style={{ color: '#94a3b8', marginBottom: '16px', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
            KARTAVYA Stands For
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
            {[
              { l: 'K', hi: 'कानून और व्यवस्था', color: '#ef4444' },
              { l: 'A', hi: 'आपातकालीन प्रबंधन', color: '#f97316' },
              { l: 'R', hi: 'तैयारी और रिपोर्टिंग', color: '#eab308' },
              { l: 'T', hi: 'तत्परता और त्वरित कार्रवाई', color: '#22c55e' },
              { l: 'A', hi: 'अधिकार और कर्तव्यों का संतुलन', color: '#0ea5e9' },
              { l: 'V', hi: 'विश्वसनीयता और निष्पक्षता', color: '#3b82f6' },
              { l: 'Y', hi: 'योजनाबद्ध कार्यप्रणाली', color: '#8b5cf6' },
              { l: 'A', hi: 'आदेश पालन और समन्वय', color: '#d946ef' }
            ].map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.05)', padding: '6px 12px', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ color: item.color, fontWeight: 'bold', fontSize: '1rem' }}>{item.l}</div>
                <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>- {item.hi}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.75rem', color: '#64748b' }}>
            &copy; {new Date().getFullYear()} UP Police Special Duty Management System
          </div>
        </div>
      </footer>
    </div>
  );
}
