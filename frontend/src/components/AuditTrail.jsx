import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function AuditTrail({ db }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModule, setFilterModule] = useState('ALL');
  const { t } = useLanguage();

  const permissionsMatrix = [
    { module: 'Duty Requisition', action: 'Create Draft Duty', sho: '✅', inspector: '✅', si: '✅', constable: '❌', homeguard: '❌' },
    { module: 'Duty Sign-Off', action: 'Approve & Release Duty Order', sho: '✅', inspector: '✅', si: '❌', constable: '❌', homeguard: '❌' },
    { module: 'Field Attendance', action: 'Live Check-In / Check-Out', sho: '✅', inspector: '✅', si: '✅', constable: '✅', homeguard: '✅' },
    { module: 'Logistics Control', action: 'Allocate Weapons / Vehicles', sho: '✅', inspector: '✅', si: '❌', constable: '❌', homeguard: '❌' },
    { module: 'Audit Controls', action: 'View Operational Audit Logs', sho: '✅', inspector: '❌', si: '❌', constable: '❌', homeguard: '❌' },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Permission Matrix */}
      <div className="glass" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', color: 'var(--primary-khaki)' }}>🛡️ {t('audit.rbac_title')}</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'center' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--bg-card-border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 8px', textAlign: 'left' }}>{t('audit.module')}</th>
                <th style={{ padding: '12px 8px', textAlign: 'left' }}>{t('audit.action')}</th>
                <th style={{ padding: '12px 8px' }}>SHO</th>
                <th style={{ padding: '12px 8px' }}>Inspector</th>
                <th style={{ padding: '12px 8px' }}>SI / ASI</th>
                <th style={{ padding: '12px 8px' }}>Constable</th>
                <th style={{ padding: '12px 8px' }}>Home Guard</th>
              </tr>
            </thead>
            <tbody>
              {permissionsMatrix.map((row, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600' }}>{row.module}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'left', color: 'var(--text-secondary)' }}>{row.action}</td>
                  <td style={{ padding: '12px 8px' }}>{row.sho}</td>
                  <td style={{ padding: '12px 8px' }}>{row.inspector}</td>
                  <td style={{ padding: '12px 8px' }}>{row.si}</td>
                  <td style={{ padding: '12px 8px' }}>{row.constable}</td>
                  <td style={{ padding: '12px 8px' }}>{row.homeguard}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit logs timeline */}
      <div className="glass" style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', color: 'var(--primary-khaki)' }}>{t('audit.title')}</h2>
        
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <input 
            type="text" 
            placeholder={t('audit.search')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ flex: 1, padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', color: 'white', borderRadius: '6px' }}
          />
          <select value={filterModule} onChange={e => setFilterModule(e.target.value)} style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', color: 'white', borderRadius: '6px' }}>
            <option value="ALL">{t('audit.all_modules')}</option>
            <option value="AUTH">Authentication</option>
            <option value="DUTY_MANAGEMENT">Duty Management</option>
            <option value="PERSONNEL_DB">Personnel DB</option>
            <option value="MONITORING">Monitoring</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {db.audit.map(log => (
            <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', border: '1px solid var(--bg-card-border)', borderRadius: '6px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary-khaki)', fontWeight: '700' }}>[{log.module}] - {log.action}</span>
                <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>{log.description}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('audit.triggered_by')}: {log.user_name}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                {new Date(log.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
