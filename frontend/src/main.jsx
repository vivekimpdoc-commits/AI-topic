import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import HomePage from './components/HomePage'
import CoreModulesPage from './components/CoreModulesPage'
import AIChallengePage from './components/AIChallengePage'
import SHOLogin from './components/SHOLogin'
import SHODashboard from './components/SHODashboard'
import SPLogin from './components/SPLogin'
import SPDashboard from './components/SPDashboard'
import './index.css'

function Root() {
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const onHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const renderPage = () => {
    if (currentHash === '#thana-login') return <App />;
    if (currentHash === '#sho-login') return <SHOLogin />;
    if (currentHash === '#sho-dashboard') return <SHODashboard />;
    if (currentHash === '#sp-login') return <SPLogin />;
    if (currentHash === '#sp-dashboard') return <SPDashboard />;
    if (currentHash === '#core-modules') return <CoreModulesPage />;
    if (currentHash === '#ai-challenge') return <AIChallengePage />;
    return <HomePage />;
  };

  return (
    <>
      {renderPage()}
      {currentHash && currentHash !== '#' && currentHash !== '' && (
        <a
          href="#"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#0f172a',
            color: '#fbbf24',
            padding: '12px 20px',
            borderRadius: '50px',
            textDecoration: 'none',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '2px solid #fbbf24',
            transition: 'all 0.2s',
            fontFamily: 'var(--font-primary)'
          }}
          onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.background = '#1e293b' }}
          onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = '#0f172a' }}
          title="Back to Home Page"
        >
          <span style={{ fontSize: '1.2rem' }}>🏠</span> Home Page
        </a>
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
