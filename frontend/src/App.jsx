import React, { useState, useEffect } from 'react';
import { getDB, switchRole, logAudit, playSound, logout } from './mockData';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DutyWorkflow from './components/DutyWorkflow';
import LiveMonitoring from './components/LiveMonitoring';
import ForceManagement from './components/ForceManagement';
import Reports from './components/Reports';
import AuditTrail from './components/AuditTrail';
import FleetManagement from './components/FleetManagement';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [db, setDb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('up_police_auth') === 'true';
  });
  const { language, toggleLanguage, t } = useLanguage();

  const loadData = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    const data = await getDB();
    setDb(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    localStorage.setItem('up_police_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('up_police_auth');
    setIsAuthenticated(false);
    setDb(null);
  };

  const handleRoleChange = async (e) => {
    const selectedUserId = e.target.value;
    const switchedUser = await switchRole(selectedUserId);
    if (switchedUser) {
      playSound('logon');
      await logAudit("ROLE_SWITCH", "AUTH", `Switched active login session to ${switchedUser.name} (${switchedUser.rank})`);
      await loadData();
    }
  };

  const toggleTheme = () => {
    setIsLightTheme(!isLightTheme);
    document.body.classList.toggle('light-theme');
  };

  const renderContent = () => {
    if (!isAuthenticated) {
      return null; // Login component handled in main return
    }
    if (loading || !db) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '20px' }}>
          <span style={{ fontSize: '2rem', animation: 'fadeIn 1s infinite alternate' }}>👮</span>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-title)' }}>{t('sidebar.loading')}</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard db={db} onRefresh={loadData} />;
      case 'workflow':
        return <DutyWorkflow db={db} onRefresh={loadData} />;
      case 'monitoring':
        return <LiveMonitoring db={db} onRefresh={loadData} />;
      case 'force':
        return <ForceManagement db={db} onRefresh={loadData} />;
      case 'fleet':
        return <FleetManagement db={db} onRefresh={loadData} />;
      case 'reports':
        return <Reports db={db} onRefresh={loadData} />;
      case 'audit':
        return <AuditTrail db={db} onRefresh={loadData} />;
      default:
        return <Dashboard db={db} onRefresh={loadData} />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      
      {/* Sidebar navigation */}
      <aside className="sidebar">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Brand/Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '2rem' }}>👮</span>
            <div className="logo-text">
              <h2 style={{ fontSize: '1.2rem', color: 'var(--primary-khaki)', textTransform: 'uppercase', tracking: '1px' }}>{t('sidebar.title')}</h2>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{t('sidebar.subtitle')}</span>
            </div>
          </div>

          <a href="#" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'transparent', color: 'var(--primary-khaki)', border: '1px solid var(--primary-khaki)', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', transition: 'all 0.3s' }} onMouseOver={e => {e.currentTarget.style.background='var(--primary-khaki)'; e.currentTarget.style.color='#0a1124'}} onMouseOut={e => {e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--primary-khaki)'}}>
            🏠 Back to Home
          </a>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            
            <button 
              className="btn btn-secondary" 
              onClick={() => setActiveTab('dashboard')}
              style={{ justifyContent: 'flex-start', background: activeTab === 'dashboard' ? 'rgba(215, 170, 103, 0.15)' : 'transparent', border: activeTab === 'dashboard' ? '1px solid var(--primary-khaki)' : '1px solid transparent' }}
            >
              📊 <span className="nav-label">{t('sidebar.dashboard')}</span>
            </button>

            <button 
              className="btn btn-secondary" 
              onClick={() => setActiveTab('workflow')}
              style={{ justifyContent: 'flex-start', background: activeTab === 'workflow' ? 'rgba(215, 170, 103, 0.15)' : 'transparent', border: activeTab === 'workflow' ? '1px solid var(--primary-khaki)' : '1px solid transparent' }}
            >
              📝 <span className="nav-label">{t('sidebar.duties')}</span>
            </button>

            <button 
              className="btn btn-secondary" 
              onClick={() => setActiveTab('monitoring')}
              style={{ justifyContent: 'flex-start', background: activeTab === 'monitoring' ? 'rgba(215, 170, 103, 0.15)' : 'transparent', border: activeTab === 'monitoring' ? '1px solid var(--primary-khaki)' : '1px solid transparent' }}
            >
              📡 <span className="nav-label">{t('sidebar.radar')}</span>
            </button>

            <button 
              className="btn btn-secondary" 
              onClick={() => setActiveTab('force')}
              style={{ justifyContent: 'flex-start', background: activeTab === 'force' ? 'rgba(215, 170, 103, 0.15)' : 'transparent', border: activeTab === 'force' ? '1px solid var(--primary-khaki)' : '1px solid transparent' }}
            >
              👮 <span className="nav-label">{t('sidebar.force')}</span>
            </button>

            <button 
              className="btn btn-secondary" 
              onClick={() => setActiveTab('fleet')}
              style={{ justifyContent: 'flex-start', background: activeTab === 'fleet' ? 'rgba(215, 170, 103, 0.15)' : 'transparent', border: activeTab === 'fleet' ? '1px solid var(--primary-khaki)' : '1px solid transparent' }}
            >
              🚓 <span className="nav-label">{t('sidebar.fleet')}</span>
            </button>

            <button 
              className="btn btn-secondary" 
              onClick={() => setActiveTab('reports')}
              style={{ justifyContent: 'flex-start', background: activeTab === 'reports' ? 'rgba(215, 170, 103, 0.15)' : 'transparent', border: activeTab === 'reports' ? '1px solid var(--primary-khaki)' : '1px solid transparent' }}
            >
              📉 <span className="nav-label">{t('sidebar.reports')}</span>
            </button>

            <button 
              className="btn btn-secondary" 
              onClick={() => setActiveTab('audit')}
              style={{ justifyContent: 'flex-start', background: activeTab === 'audit' ? 'rgba(215, 170, 103, 0.15)' : 'transparent', border: activeTab === 'audit' ? '1px solid var(--primary-khaki)' : '1px solid transparent' }}
            >
              🛡️ <span className="nav-label">{t('sidebar.audit')}</span>
            </button>

          </nav>
        </div>

        {/* Bottom controls: Role switcher & Theme toggle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--bg-card-border)', paddingTop: '16px' }}>
          
          <button className="btn btn-secondary" onClick={toggleLanguage} style={{ width: '100%', border: '1px solid #00f3ff' }}>
            {language === 'en' ? '🌐 हिंदी में देखें' : '🌐 View in English'}
          </button>

          <button className="btn btn-secondary" onClick={toggleTheme} style={{ width: '100%' }}>
            {isLightTheme ? t('sidebar.dark_mode') : t('sidebar.light_mode')}
          </button>

          <button className="btn btn-danger" onClick={handleLogout} style={{ width: '100%', border: '1px solid var(--accent-crimson)' }}>
            🚪 {t('sidebar.logout') || 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main viewport */}
      <main className="main-content">
        {renderContent()}
      </main>

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
