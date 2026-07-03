import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { checkInOfficer, checkOutOfficer, completeDuty, logAudit, playSound } from '../mockData';

export default function LiveMonitoring({ db, onRefresh }) {
  const [selectedDutyId, setSelectedDutyId] = useState('');
  const [filterMode, setFilterMode] = useState('ALL');
  const { t } = useLanguage();
  const [radarScannerAngle, setRadarScannerAngle] = useState(0);
  
  const activeDuties = db.duties.filter(d => d.status === 'ACTIVE');

  // Automatically select first active duty if none is selected
  useEffect(() => {
    if (!selectedDutyId && activeDuties.length > 0) {
      setSelectedDutyId(activeDuties[0].id);
    }
  }, [activeDuties, selectedDutyId]);

  // Rotate simulated radar sweeps
  useEffect(() => {
    const sweep = setInterval(() => {
      setRadarScannerAngle(prev => (prev + 3) % 360);
    }, 50);
    return () => clearInterval(sweep);
  }, []);

  const selectedDuty = db.duties.find(d => d.id === selectedDutyId);

  const handleCheckInClick = async (personnelId) => {
    // Play telemetry checkin sound!
    playSound('confirm');

    const officer = db.personnel.find(p => p.id === personnelId);
    const checkInTime = new Date().toISOString();
    const lat = selectedDuty.latitude + (Math.random() - 0.5) * 0.002;
    const lon = selectedDuty.longitude + (Math.random() - 0.5) * 0.002;
    
    await checkInOfficer(selectedDutyId, personnelId, checkInTime, lat, lon);
    await logAudit("CHECK_IN", "MONITORING", `${officer.name} checked in at ${selectedDuty.location_name} (GPS Verified)`);
    onRefresh();
  };

  const handleCheckOutClick = async (personnelId) => {
    // Play telemetry checkout sound!
    playSound('confirm');

    const officer = db.personnel.find(p => p.id === personnelId);
    const checkOutTime = new Date().toISOString();
    
    await checkOutOfficer(selectedDutyId, personnelId, checkOutTime);
    await logAudit("CHECK_OUT", "MONITORING", `${officer.name} completed duty and checked out safely`);
    onRefresh();
  };

  const handleCompleteDutyClick = async () => {
    playSound('confirm');
    await completeDuty(selectedDutyId);
    await logAudit("COMPLETE_DUTY", "DUTY_MANAGEMENT", `Duty order ${selectedDuty.duty_number} completed and closed`);
    onRefresh();
    alert("Duty has been closed and personnel released.");
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px' }}>
      
      {/* Left panel: Active Duties & GPS Radar map */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Interactive GPS Radar */}
        <div className="glass" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '16px', color: 'var(--primary-blue)', textShadow: '0 0 10px rgba(0, 243, 255, 0.2)' }}>{t('radar.title')}</h2>
          
          <div style={{ position: 'relative', height: '240px', background: '#050814', borderRadius: '8px', border: '1px solid var(--bg-card-border)', overflow: 'hidden' }}>
            
            {/* Grid effect */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0, 243, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.04) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            
            {/* Blinking radar grid rings */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '120px', height: '120px', borderRadius: '50%', border: '1px dashed rgba(0, 243, 255, 0.2)' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '220px', height: '220px', borderRadius: '50%', border: '1px solid rgba(0, 243, 255, 0.1)' }} />
            
            {/* Radar scanner sweep line */}
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              width: '200px', 
              height: '2px', 
              background: 'linear-gradient(90deg, var(--primary-blue), transparent)', 
              transformOrigin: 'left center', 
              transform: `translate(0, -50%) rotate(${radarScannerAngle}deg)`, 
              pointerEvents: 'none' 
            }} />

            {/* Dynamic Map Pins & Patrolling Paths */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              {/* Patrol Route corridor representation */}
              <path d="M 50,120 Q 150,50 300,120 T 550,120" fill="none" stroke="rgba(0, 243, 255, 0.25)" strokeWidth="4" strokeDasharray="5,5" />
              
              {/* Checkpoint indicators */}
              <circle cx="150" cy="85" r="4" fill="var(--accent-gold)" />
              <text x="160" y="88" fill="var(--text-secondary)" fontSize="10">CP-01</text>
              
              <circle cx="360" cy="100" r="4" fill="var(--accent-gold)" />
              <text x="370" y="103" fill="var(--text-secondary)" fontSize="10">CP-02</text>
            </svg>

            {selectedDuty ? (
              <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10, background: 'rgba(10, 17, 36, 0.85)', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--bg-card-border)', boxShadow: '0 0 15px rgba(0, 243, 255, 0.2)' }}>
                <span className="badge badge-active" style={{ fontSize: '0.75rem' }}>📍 {selectedDuty.location_name}</span>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '6px' }}>
                  {t('radar.coords')}: {selectedDuty.latitude ? selectedDuty.latitude.toFixed(4) : '26.8467'}°N, {selectedDuty.longitude ? selectedDuty.longitude.toFixed(4) : '80.9462'}°E
                </div>
              </div>
            ) : (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--text-muted)' }}>{t('radar.no_duty')}</div>
            )}

            {/* Simulated Live Officers Markers */}
            {selectedDuty && selectedDuty.assignments && selectedDuty.assignments.map((ass, i) => {
              const officer = db.personnel.find(p => p.id === ass.personnel_id);
              const xPos = 100 + (i * 120);
              const yPos = 80 + (i * 40);
              return (
                <div 
                  key={ass.id} 
                  style={{ 
                    position: 'absolute', 
                    left: `${xPos}px`, 
                    top: `${yPos}px`, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    transition: 'all 1s ease'
                  }}
                >
                  <div style={{ 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    background: ass.status === 'CHECKED_IN' ? 'var(--accent-success)' : 'var(--accent-crimson)',
                    boxShadow: ass.status === 'CHECKED_IN' ? '0 0 10px var(--accent-success)' : '0 0 10px var(--accent-crimson)',
                    animation: ass.status === 'CHECKED_IN' ? 'pulseGlow 2s infinite' : 'none'
                  }} />
                  <span style={{ fontSize: '0.7rem', background: 'rgba(0,0,0,0.7)', padding: '2px 4px', borderRadius: '3px', marginTop: '4px', whiteSpace: 'nowrap' }}>
                    {officer ? officer.name.split(' ')[0] : 'Officer'} ({ass.status})
                  </span>
                </div>
              );
            })}

          </div>
        </div>

        {/* Live Attendance & Duty logs */}
        <div className="glass" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', color: 'var(--primary-khaki)' }}>{t('radar.officers')}</h2>
          
          {!selectedDuty ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>{t('radar.select_duty')}</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{selectedDuty.title}</h3>
                <button className="btn btn-danger" onClick={handleCompleteDutyClick} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>{t('radar.complete')}</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                {!selectedDuty.assignments || selectedDuty.assignments.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('radar.no_force')}</p>
                ) : (
                  selectedDuty.assignments.map(ass => {
                    const officer = db.personnel.find(p => p.id === ass.personnel_id);
                    return (
                      <div key={ass.id} style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--bg-card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong>{officer?.name}</strong> <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>({officer?.rank})</span>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            {t('radar.role')}: {ass.role_in_duty} | PNO: {officer?.pno_number}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span className={`badge badge-${ass.status.toLowerCase().replace('_', '')}`} style={{ fontSize: '0.7rem' }}>{ass.status}</span>
                          
                          {ass.status === 'ASSIGNED' && (
                            <button className="btn btn-primary" onClick={() => handleCheckInClick(ass.personnel_id)} style={{ padding: '4px 10px', fontSize: '0.75rem' }}>{t('radar.checkin')}</button>
                          )}
                          {ass.status === 'CHECKED_IN' && (
                            <button className="btn btn-secondary" onClick={() => handleCheckOutClick(ass.personnel_id)} style={{ padding: '4px 10px', fontSize: '0.75rem' }}>{t('radar.checkout')}</button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Right Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '350px' }}>
        
        {/* Unit Status List */}
        <div className="glass" style={{ padding: '24px', flexGrow: 1 }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--primary-khaki)' }}>{t('radar.assignments')}</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '70vh', paddingRight: '5px' }}>
            {activeDuties.map(duty => (
              <div key={duty.id} style={{ padding: '16px', background: 'var(--bg-secondary)', borderLeft: '4px solid var(--primary-blue)', borderRadius: '6px' }}>
                <strong style={{ fontSize: '1rem', display: 'block', marginBottom: '4px' }}>{duty.title}</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>📍 {duty.location_name}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', display: 'block', marginTop: '6px' }}>
                  {duty.assignments ? duty.assignments.length : 0} {t('dashboard.officers')} {t('dashboard.assigned')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live System Activity Feed */}
        <div className="glass" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '16px', color: 'var(--primary-khaki)' }}>{t('radar.timeline')}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '250px', overflowY: 'auto' }}>
            {db.audit.filter(log => log.module === 'MONITORING').map(log => (
              <div key={log.id} style={{ borderLeft: '2px solid var(--primary-blue)', paddingLeft: '10px', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{new Date(log.created_at).toLocaleTimeString()}</span>
                <p style={{ color: 'var(--text-primary)', marginTop: '2px' }}>{log.description}</p>
              </div>
            ))}
            {db.audit.filter(log => log.module === 'MONITORING').length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>{t('radar.no_events')}</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
