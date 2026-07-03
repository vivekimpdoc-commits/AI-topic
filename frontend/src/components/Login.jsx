import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { authenticate } from '../mockData';

export default function Login({ onLoginSuccess }) {
  const { t } = useLanguage();
  const [thanaId, setThanaId] = useState('CIVIL-LINES-01'); // Pre-filled for demo
  const [password, setPassword] = useState('admin'); // Pre-filled for demo
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await authenticate(thanaId, password);
      if (success) {
        onLoginSuccess();
      } else {
        setError(t('login.invalid_creds'));
      }
    } catch (err) {
      setError(t('login.invalid_creds'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
      <div className="glass animate-fade-in" style={{ padding: '40px', maxWidth: '400px', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', borderTop: '4px solid var(--primary-khaki)' }}>
        
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '10px' }}>👮</span>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--primary-khaki)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
            {t('login.title')}
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {t('login.subtitle')}
          </p>
        </div>

        <div style={{ padding: '12px', background: 'rgba(0, 243, 255, 0.1)', border: '1px solid var(--primary-blue)', borderRadius: '6px', textAlign: 'center', width: '100%' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--primary-blue)', fontWeight: 'bold' }}>🔑 DEMO CREDENTIALS</span>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '4px' }}>
            <strong>ID:</strong> CIVIL-LINES-01 &nbsp; | &nbsp; <strong>Pass:</strong> admin
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{t('login.thana_id')}</label>
            <input 
              type="text" 
              value={thanaId}
              onChange={(e) => setThanaId(e.target.value)}
              placeholder={t('login.thana_id_placeholder')}
              style={{ padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', color: 'var(--text-primary)', borderRadius: '6px', outline: 'none' }}
              required 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{t('login.password')}</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('login.password_placeholder')}
              style={{ padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', color: 'var(--text-primary)', borderRadius: '6px', outline: 'none' }}
              required 
            />
          </div>

          {error && (
            <div style={{ padding: '10px', background: 'rgba(220, 38, 38, 0.1)', border: '1px solid var(--accent-crimson)', color: 'var(--accent-crimson)', fontSize: '0.85rem', borderRadius: '4px', textAlign: 'center' }}>
              ⚠️ {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-secondary" 
            style={{ marginTop: '10px', background: 'var(--primary-khaki)', color: '#1a1d24', fontWeight: 'bold', padding: '14px', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer' }}
            disabled={isLoading}
          >
            {isLoading ? '...' : t('login.submit')}
          </button>
        </form>
        
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '10px' }}>
          Restricted Access. Unauthorized entry is prohibited.
        </div>
      </div>
    </div>
  );
}
