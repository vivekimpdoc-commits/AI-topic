import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { logAudit, playSound } from '../mockData';

export default function Dashboard({ db, onRefresh }) {
  const [sosActive, setSosActive] = useState(false);
  const [sosReason, setSosReason] = useState('');
  const { t } = useLanguage();

  const totalForce = db.personnel.length;
  const availableForce = db.personnel.filter(p => p.current_status === 'AVAILABLE').length;
  const activeDutiesCount = db.duties.filter(d => d.status === 'ACTIVE').length;
  const pendingDutiesCount = db.duties.filter(d => d.status === 'PENDING_APPROVAL').length;
  
  const totalVehicles = db.equipment.filter(e => e.equipment_type === 'VEHICLE').length;
  const availableVehicles = db.equipment.filter(e => e.equipment_type === 'VEHICLE' && e.status === 'AVAILABLE').length;

  const handleTriggerSOS = async (e) => {
    e.preventDefault();
    if (!sosReason) return;
    
    playSound('alarm');

    await logAudit("SOS_BROADCAST", "MONITORING", `🚨 EMERGENCY PANIC BROADCAST: ${sosReason} (Issued by SHO)`);
    setSosActive(false);
    setSosReason('');
    onRefresh();
    alert("Emergency SOS Broadcast has been transmitted to all patrolling units and wireless networks.");
  };

  const handleTriggerSOSClick = () => {
    playSound('confirm');
    setSosActive(true);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      <div className="ticker-wrap">
        <div className="ticker-content">
          <span className="ticker-item">⚡ [WIRELESS CHANNEL 1] KOTWALI LKO COMMAND: ALL RESERVE UNITS ON STANDBY BY ORDER OF SSP LUCKNOW</span>
          <span className="ticker-item">🚨 [PATROL BOLERO-1] ROUTE CONVOY PASSING CIVIL LINES: SECURE STATUS IN EFFECT</span>
          <span className="ticker-item">👮 [SUB-INSPECTOR SHARMA] CHECKED IN AT RAMAKRISHNA MISSION GROUND FOR BANDOBAST DUTY</span>
          <span className="ticker-item">⚡ [THANA DESK LOG] SHIFT ROTATION ACTIVE: NEXT ASSIGNMENT FOR FESTIVAL ROUTE SCHEDULED AT 18:00 HRS</span>
        </div>
      </div>

      <div className="glass" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '8px', color: 'var(--primary-khaki)' }}>{t('dashboard.thana_title')}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>{t('dashboard.console_subtitle')}</p>
          </div>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <button 
              className="btn btn-danger" 
              onClick={handleTriggerSOSClick}
              style={{ fontWeight: 'bold' }}
            >
              🚨 {t('dashboard.emergency_sos')}
            </button>
            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-active" style={{ fontSize: '0.85rem' }}>● {t('dashboard.live_state')}</span>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '6px' }}>{t('dashboard.logged_in')}: <strong>{db.currentUser.name} ({db.currentUser.rank})</strong></p>
            </div>
          </div>
        </div>
      </div>

      {sosActive && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="glass animate-fade-in" style={{ padding: '30px', maxWidth: '450px', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid var(--accent-crimson)', boxShadow: '0 4px 20px rgba(220, 38, 38, 0.25)' }}>
            <h2 style={{ color: 'var(--accent-crimson)', display: 'flex', alignItems: 'center', gap: '10px' }}>🚨 {t('dashboard.panic_sos')}</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {t('dashboard.sos_instruction')}
            </p>
            <form onSubmit={handleTriggerSOS} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input 
                type="text" 
                placeholder={t('dashboard.sos_placeholder')}
                value={sosReason}
                onChange={e => setSosReason(e.target.value)}
                style={{ padding: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b', borderRadius: '6px' }}
                required 
              />
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="submit" className="btn btn-danger">{t('dashboard.transmit')}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setSosActive(false)}>{t('dashboard.cancel')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="stat-card" style={{ borderTop: '4px solid #ff3366' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('dashboard.active_deployments')}</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span className="stat-value" style={{ color: '#ff3366' }}>{activeDutiesCount}</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ {db.duties.length}</span>
          </div>
        </div>

        <div className="stat-card" style={{ borderTop: '4px solid #00f3ff' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('dashboard.available_force')}</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span className="stat-value" style={{ color: '#00f3ff' }}>{availableForce}</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ {totalForce}</span>
          </div>
        </div>

        <div className="stat-card" style={{ borderTop: '4px solid #f59e0b' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('dashboard.critical_alerts')}</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span className="stat-value" style={{ color: '#f59e0b' }}>{db.duties.filter(d => d.severity === 'CRITICAL').length}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="glass" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-khaki)' }}>{t('dashboard.active_deployments')}</h3>
            <button className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>{t('dashboard.view_all')}</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {db.duties.filter(d => d.status === 'ACTIVE').length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>{t('dashboard.no_active_duties')}</p>
            ) : (
              db.duties.filter(d => d.status === 'ACTIVE').map(duty => (
                <div key={duty.id} style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid var(--primary-blue)', border: '1px solid #e2e8f0', borderLeftWidth: '4px', borderLeftColor: 'var(--primary-blue)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge badge-active">ACTIVE</span>
                      <strong style={{ fontSize: '1.05rem' }}>{duty.title}</strong>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '6px' }}>📍 {duty.location_name} | {t('dashboard.assigned')}: <strong>{duty.assignments ? duty.assignments.length : 0} {t('dashboard.officers')}</strong></p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('dashboard.started')}: {new Date(duty.start_time).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-khaki)' }}>📋 {t('dashboard.force_matrix')}</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span>{t('dashboard.available_constables')}</span>
              <strong>{db.personnel.filter(p => p.rank === 'Constable' && p.current_status === 'AVAILABLE').length}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span>{t('dashboard.on_leave')}</span>
              <strong style={{ color: 'var(--accent-crimson)' }}>{db.personnel.filter(p => p.current_status === 'ON_LEAVE').length}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span>{t('dashboard.allocated_weapons')}</span>
              <strong>{db.equipment.filter(e => e.equipment_type === 'WEAPON' && e.status === 'ALLOCATED').length}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span>Wireless Handhelds Active</span>
              <strong>{db.equipment.filter(e => e.equipment_type === 'WIRELESS_SET' && e.status === 'ALLOCATED').length}</strong>
            </div>
          </div>
          
          <div style={{ marginTop: 'auto', padding: '12px', background: '#eff6ff', border: '1px dashed var(--primary-blue)', borderRadius: '8px' }}>
            <strong style={{ fontSize: '0.85rem', color: 'var(--primary-blue)', display: 'block', marginBottom: '4px' }}>🛡️ SHO COMMAND COMMANDMENT</strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>All reserve units must carry standard issue INSAS or Glock handguns. Confirm status on assignment panel.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
