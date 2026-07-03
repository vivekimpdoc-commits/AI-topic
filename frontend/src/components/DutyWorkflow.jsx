import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { createDuty, approveDuty, rejectDuty, logAudit } from '../mockData';

export default function DutyWorkflow({ db, onRefresh }) {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('VIP Duty');
  const [locationName, setLocationName] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [severity, setSeverity] = useState('NORMAL');
  
  const [selectedForce, setSelectedForce] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [allocationOptions, setAllocationOptions] = useState([]);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [draftDutyData, setDraftDutyData] = useState(null);

  // Custom Requirements
  const [requirements, setRequirements] = useState([]);
  const [reqRank, setReqRank] = useState('Constable');
  const [reqCount, setReqCount] = useState(1);

  const [printDuty, setPrintDuty] = useState(null);

  const handleAddRequirement = (e) => {
    e.preventDefault();
    if (reqCount > 0) {
      setRequirements([...requirements, { rank: reqRank, count: parseInt(reqCount) }]);
      setReqCount(1);
    }
  };

  const handleRemoveRequirement = (idx) => {
    setRequirements(requirements.filter((_, i) => i !== idx));
  };

  const isApprover = ['SHO', 'Inspector'].includes(db.currentUser.rank);

  const availablePersonnel = db.personnel.filter(p => p.current_status === 'AVAILABLE');
  const availableEquipment = db.equipment.filter(e => e.status === 'AVAILABLE');

  const handleTogglePersonnel = (id) => {
    if (selectedForce.includes(id)) {
      setSelectedForce(selectedForce.filter(fid => fid !== id));
    } else {
      setSelectedForce([...selectedForce, id]);
    }
  };

  const handleToggleEquipment = (id) => {
    if (selectedEquipment.includes(id)) {
      setSelectedEquipment(selectedEquipment.filter(eid => eid !== id));
    } else {
      setSelectedEquipment([...selectedEquipment, id]);
    }
  };

  const handleCreateDutySubmit = async (e) => {
    e.preventDefault();
    if (!title || !locationName || !startTime || !endTime) {
      alert(t("duty.fill_mandatory"));
      return;
    }

    const dutyId = `d-${Date.now()}`;
    const dutyNumber = `UPDMS/CIVIL/2026/${Math.floor(100 + Math.random() * 900)}`;

    let availableStaff = db.personnel.filter(p => p.current_status === 'AVAILABLE');
    availableStaff = availableStaff.sort(() => Math.random() - 0.5);

    let options = [];

    const mapToAssignments = (staffArr) => staffArr.filter(Boolean).map((p, idx) => ({
      id: `da-${Date.now()}-${idx}`,
      personnel_id: p.id,
      role_in_duty: idx === 0 ? "TEAM_LEAD" : "MEMBER",
      name: p.name,
      rank: p.rank
    }));

    if (requirements.length > 0) {
      let customStrategy = [];
      requirements.forEach(req => {
        const matchingStaff = availableStaff.filter(p => p.rank === req.rank);
        customStrategy.push(...matchingStaff.slice(0, req.count));
        availableStaff = availableStaff.filter(p => !customStrategy.includes(p));
      });

      options = [
        {
          title: t("duty.custom_allocation"),
          description: t("duty.custom_desc"),
          score: "100%",
          assignments: mapToAssignments(customStrategy)
        }
      ];
    } else {
      let requiredCount = category === 'VIP Duty' ? 5 : category === 'Mela' ? 8 : 4;
      
      let strategy1 = [];
      if (category === 'VIP Duty') {
        const seniors = availableStaff.filter(p => ['SHO', 'Inspector', 'SI'].includes(p.rank));
        const juniors = availableStaff.filter(p => ['Head Constable', 'Constable'].includes(p.rank));
        strategy1 = [...seniors.slice(0, 2), ...juniors.slice(0, requiredCount - 2)];
      } else {
        const juniors = availableStaff.filter(p => ['Constable', 'Home Guard'].includes(p.rank));
        const seniors = availableStaff.filter(p => ['SI', 'ASI', 'Head Constable'].includes(p.rank));
        strategy1 = [...seniors.slice(0, 1), ...juniors.slice(0, requiredCount - 1)];
      }

      let strategy2 = [];
      const allSeniors = availableStaff.filter(p => ['SHO', 'Inspector', 'SI', 'ASI'].includes(p.rank));
      const allJuniors = availableStaff.filter(p => ['Head Constable', 'Constable', 'Home Guard'].includes(p.rank));
      strategy2 = [...allSeniors.slice(0, requiredCount - 1), ...allJuniors.slice(0, 1)];

      let strategy3 = [];
      strategy3 = [...allSeniors.slice(0, 1), ...allJuniors.slice(0, requiredCount - 1)];

      options = [
        {
          title: t("duty.strat_balanced"),
          description: t("duty.strat_balanced_desc"),
          score: "96%",
          assignments: mapToAssignments(strategy1)
        },
        {
          title: t("duty.strat_high_sec"),
          description: t("duty.strat_high_sec_desc"),
          score: "91%",
          assignments: mapToAssignments(strategy2)
        },
        {
          title: t("duty.strat_max_cov"),
          description: t("duty.strat_max_cov_desc"),
          score: "85%",
          assignments: mapToAssignments(strategy3)
        }
      ];
    }

    setAllocationOptions(options);
    setSelectedOptionIndex(0);

    const baseDuty = {
      id: dutyId,
      duty_number: dutyNumber,
      title,
      description,
      category,
      severity,
      location_name: locationName,
      latitude: 26.8467 + (Math.random() - 0.5) * 0.05,
      longitude: 80.9462 + (Math.random() - 0.5) * 0.05,
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
      status: "PENDING_APPROVAL",
      created_by: db.currentUser.id,
      allocations: []
    };

    setDraftDutyData(baseDuty);
    setShowModal(true);
  };

  const handleConfirmSubmission = async () => {
    if (!draftDutyData) return;
    
    const selectedOption = allocationOptions[selectedOptionIndex];

    if (!selectedOption || !selectedOption.assignments || selectedOption.assignments.length === 0) {
      alert(t("duty.no_staff_err"));
      setShowModal(false);
      return;
    }
    
    const finalDuty = {
      ...draftDutyData,
      assignments: selectedOption.assignments,
      ai_match_data: {
        confidence_score: selectedOption.score,
        reason: `${t("duty.strategy")}: ${selectedOption.title}. ${selectedOption.description}`
      }
    };

    await createDuty(finalDuty);
    await logAudit("CREATE_DUTY", "DUTY_MANAGEMENT", `${t("duty.audit_created")} ${finalDuty.duty_number}`);
    
    setTitle('');
    setLocationName('');
    setDescription('');
    setStartTime('');
    setEndTime('');
    setRequirements([]);
    setSelectedForce([]);
    setSelectedEquipment([]);
    
    setShowModal(false);
    onRefresh();
    alert(t("duty.success_msg"));
  };

  const handleApproveDutyClick = async (dutyId, dutyNumber) => {
    await approveDuty(dutyId, db.currentUser.id);
    await logAudit("APPROVE_DUTY", "DUTY_MANAGEMENT", `${t("duty.audit_approved")} ${dutyNumber}`);
    onRefresh();
  };

  const handleRejectDutyClick = async (dutyId, dutyNumber) => {
    await rejectDuty(dutyId);
    await logAudit("REJECT_DUTY", "DUTY_MANAGEMENT", `${t("duty.audit_rejected")} ${dutyNumber}`);
    onRefresh();
  };

  const handleCompleteDutyClick = async (dutyId, dutyNumber) => {
    if (window.confirm(t("duty.confirm_complete"))) {
      await fetch(`/api/duties/${dutyId}/complete`, { method: 'PUT' });
      await logAudit("COMPLETE_DUTY", "DUTY_MANAGEMENT", `${t("duty.audit_completed")} ${dutyNumber}`);
      onRefresh();
    }
  };

  const printCommandCertificate = () => {
    window.print();
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px' }}>
      
      <div className="glass" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: 'var(--primary-khaki)' }}>{t('duty.req_draft')}</h2>
        <form onSubmit={handleCreateDutySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('duty.category')} *</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', color: 'var(--text-primary)', borderRadius: '6px' }}>
                <option>VIP Duty</option>
                <option>Festival Duty</option>
                <option>Election Duty</option>
                <option>Bandobast Duty</option>
                <option>Emergency Duty</option>
                <option>Reserve Force</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('duty.severity')}</label>
              <select value={severity} onChange={e => setSeverity(e.target.value)} style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', color: 'var(--text-primary)', borderRadius: '6px' }}>
                <option>CRITICAL</option>
                <option>HIGH</option>
                <option>NORMAL</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('duty.title')} *</label>
            <input type="text" placeholder={t('duty.title_placeholder')} value={title} onChange={e => setTitle(e.target.value)} style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', color: 'var(--text-primary)', borderRadius: '6px' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('duty.location')} *</label>
            <input type="text" placeholder={t('duty.loc_placeholder')} value={locationName} onChange={e => setLocationName(e.target.value)} style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', color: 'var(--text-primary)', borderRadius: '6px' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('duty.start')} *</label>
              <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', color: 'var(--text-primary)', borderRadius: '6px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('duty.end')} *</label>
              <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', color: 'var(--text-primary)', borderRadius: '6px' }} />
            </div>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', borderRadius: '8px' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 'bold', marginBottom: '10px', display: 'block' }}>{t('duty.custom_req')}</label>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{t('duty.custom_note')}</p>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <select value={reqRank} onChange={e => setReqRank(e.target.value)} style={{ flex: '1', padding: '8px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                <option>SHO</option>
                <option>Inspector</option>
                <option>SI</option>
                <option>ASI</option>
                <option>Head Constable</option>
                <option>Constable</option>
                <option>Home Guard</option>
              </select>
              <input type="number" min="1" value={reqCount} onChange={e => setReqCount(e.target.value)} style={{ width: '80px', padding: '8px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px' }} />
              <button className="btn btn-secondary" onClick={handleAddRequirement} style={{ padding: '8px 16px' }}>{t('duty.add')}</button>
            </div>

            {requirements.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {requirements.map((req, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '8px 12px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.85rem' }}><strong>{req.count}x</strong> {req.rank}</span>
                    <button type="button" onClick={() => handleRemoveRequirement(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('duty.briefing')}</label>
            <textarea rows="3" placeholder={t('duty.briefing_placeholder')} value={description} onChange={e => setDescription(e.target.value)} style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', color: 'var(--text-primary)', borderRadius: '6px', resize: 'vertical' }} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
            🚀 {t('duty.submit_btn')}
          </button>
        </form>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div className="glass" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '16px', color: 'var(--primary-khaki)' }}>{t('duty.signoff_queue')}</h2>
          {!isApprover && (
            <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '6px', marginBottom: '16px', fontSize: '0.85rem', color: '#f87171' }}>
              ⚠️ {t('duty.no_privilege', { role: db.currentUser.rank })}
            </div>
          )}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {db.duties.filter(d => d.status === 'PENDING_APPROVAL').length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>{t('duty.no_pending')}</p>
            ) : (
              db.duties.filter(d => d.status === 'PENDING_APPROVAL').map(duty => (
                <div key={duty.id} style={{ padding: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <strong style={{ fontSize: '0.95rem' }}>{duty.title}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{t('duty.id')}: {duty.duty_number} | {t('duty.category')}: {duty.category}</div>
                    </div>
                    <span className="badge badge-pending">{t('duty.pending')}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>📍 {duty.location_name}</p>
                  
                  {isApprover && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button className="btn btn-primary" onClick={() => handleApproveDutyClick(duty.id, duty.duty_number)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>{t('duty.approve')}</button>
                      <button className="btn btn-danger" onClick={() => handleRejectDutyClick(duty.id, duty.duty_number)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>{t('duty.reject')}</button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '16px', color: 'var(--primary-khaki)' }}>{t('duty.history')}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {db.duties.map(d => (
              <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#f8fafc', borderRadius: '6px', borderBottom: '1px solid var(--bg-card-border)' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{d.duty_number}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{d.title}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`badge badge-${d.status.toLowerCase().replace('_', '')}`}>{t(`duty.${d.status.toLowerCase()}`)}</span>
                  {d.status === 'ACTIVE' && isApprover && (
                    <button 
                      onClick={() => handleCompleteDutyClick(d.id, d.duty_number)} 
                      style={{ padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer', background: '#10b981', border: 'none', color: '#fff', borderRadius: '4px' }}
                    >
                      ✓ {t('duty.complete')}
                    </button>
                  )}
                  {(d.status === 'ACTIVE' || d.status === 'COMPLETED') && (
                    <button 
                      onClick={() => setPrintDuty(d)} 
                      style={{ padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer', background: 'rgba(215, 170, 103, 0.1)', border: '1px solid var(--primary-khaki)', color: 'var(--primary-khaki)', borderRadius: '4px' }}
                    >
                      🖨️ PDF
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div style={{
            background: '#ffffff', width: '800px', maxWidth: '95%',
            borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh'
          }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>🤖 {t('duty.ai_alloc_title')}</h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>{t('duty.ai_alloc_desc')}</p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
            </div>

            <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', gap: '20px' }}>
              <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {allocationOptions.map((opt, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setSelectedOptionIndex(idx)}
                    style={{
                      padding: '16px', borderRadius: '8px', cursor: 'pointer',
                      border: selectedOptionIndex === idx ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      background: selectedOptionIndex === idx ? '#eff6ff' : '#ffffff',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <strong style={{ color: selectedOptionIndex === idx ? '#1e3a8a' : '#1e293b' }}>{opt.title}</strong>
                      <span className="badge badge-active">{opt.score} {t('duty.match')}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569' }}>{opt.description}</p>
                  </div>
                ))}
              </div>

              <div style={{ flex: '1.2', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', color: '#0f172a' }}>{t('duty.preview')}: {allocationOptions[selectedOptionIndex].title}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {allocationOptions[selectedOptionIndex].assignments.map((ass, i) => (
                    <div key={i} style={{ background: '#ffffff', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.9rem', color: '#1e293b' }}>{ass.name || 'Unknown'}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{ass.rank}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: ass.role_in_duty === 'TEAM_LEAD' ? '#b45309' : '#2563eb', background: ass.role_in_duty === 'TEAM_LEAD' ? '#fef3c7' : '#dbeafe', padding: '4px 8px', borderRadius: '4px' }}>
                        {ass.role_in_duty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ padding: '10px 20px', background: '#e2e8f0', color: '#475569', border: 'none' }}>{t('duty.cancel')}</button>
              <button onClick={handleConfirmSubmission} className="btn btn-primary" style={{ padding: '10px 24px' }}>{t('duty.confirm_submit')}</button>
            </div>
          </div>
        </div>
      )}

      {printDuty && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div className="glass" style={{ width: '100%', maxWidth: '750px', background: '#fff', color: '#000', padding: '40px', borderRadius: '8px', position: 'relative', display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: '"Georgia", serif', boxShadow: 'none', border: '1px solid #ddd' }}>
            
            <button 
              onClick={() => setPrintDuty(null)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#000' }}
              className="no-print"
            >
              ✕
            </button>

            <div style={{ textAlign: 'center', borderBottom: '3px double #000', paddingBottom: '16px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{t('duty.police_dept')}</div>
              <div style={{ fontSize: '1rem', fontStyle: 'italic', marginTop: '4px' }}>{t('duty.office_title')}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '1px', marginTop: '14px', textDecoration: 'underline' }}>{t('duty.cmd_order')}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '20px', fontFamily: 'monospace' }}>
                <span>{t('duty.ref_no')}: {printDuty.duty_number}</span>
                <span>{t('duty.date')}: {new Date(printDuty.start_time).toLocaleDateString('hi-IN')}</span>
              </div>
            </div>

            <div style={{ fontSize: '1rem', lineHeight: '1.6', textAlign: 'justify' }}>
              {t('duty.order_intro', { category: printDuty.category })}
            </div>

            <div style={{ border: '1px solid #000', padding: '16px', background: '#fcfcfc', fontSize: '0.9rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', marginBottom: '8px' }}>
                <strong>{t('duty.title')}:</strong> <span>{printDuty.title}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', marginBottom: '8px' }}>
                <strong>{t('duty.location')}:</strong> <span>{printDuty.location_name}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', marginBottom: '8px' }}>
                <strong>{t('duty.time')}:</strong> <span>{new Date(printDuty.start_time).toLocaleString()} {t('duty.to')} {new Date(printDuty.end_time).toLocaleString()}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
                <strong>{t('duty.briefing')}:</strong> <span>{printDuty.description || "N/A"}</span>
              </div>
            </div>

            <div>
              <h4 style={{ borderBottom: '1px solid #000', paddingBottom: '4px', marginBottom: '10px', fontSize: '1rem' }}>{t('duty.deployed_personnel')}</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #000', textAlign: 'left', fontWeight: 'bold' }}>
                    <th style={{ padding: '6px' }}>{t('duty.cmd_role')}</th>
                    <th style={{ padding: '6px' }}>{t('duty.name')}</th>
                    <th style={{ padding: '6px' }}>{t('duty.rank')}</th>
                    <th style={{ padding: '6px' }}>{t('duty.pno')}</th>
                  </tr>
                </thead>
                <tbody>
                  {printDuty.assignments && printDuty.assignments.map((ass, i) => {
                    const officer = db.personnel.find(p => p.id === ass.personnel_id);
                    return (
                      <tr key={i} style={{ borderBottom: '1px dotted #ccc' }}>
                        <td style={{ padding: '6px' }}>{ass.role_in_duty === 'TEAM_LEAD' ? t('duty.team_lead') : t('duty.sec_staff')}</td>
                        <td style={{ padding: '6px' }}>{officer ? officer.name : 'N/A'}</td>
                        <td style={{ padding: '6px' }}>{officer ? officer.rank : 'N/A'}</td>
                        <td style={{ padding: '6px' }}>{officer ? officer.pno_number : 'N/A'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {printDuty.allocations && printDuty.allocations.length > 0 && (
              <div>
                <h4 style={{ borderBottom: '1px solid #000', paddingBottom: '4px', marginBottom: '10px', fontSize: '1rem' }}>{t('duty.logistics')}</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.85rem' }}>
                  {printDuty.allocations.map((al, idx) => {
                    const eq = db.equipment.find(e => e.id === al.equipment_id);
                    return (
                      <div key={idx} style={{ padding: '6px 12px', border: '1px dashed #555', borderRadius: '4px' }}>
                        <strong>[{eq?.equipment_type}]</strong> {eq?.model_name} ({t('duty.reg_no')}: {eq?.serial_number})
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.9rem' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                {t('duty.digital_id')}: <br />
                {printDuty.id.slice(0, 18)}
              </div>
              <div style={{ textAlign: 'center' }}>
                <br /><br />
                थानाध्यक्ष / Station House Officer<br />
                थाना सिविल लाइन्स, लखनऊ
              </div>
            </div>

            {/* Controls */}
            <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }} className="no-print">
              <button className="btn" onClick={printCommandCertificate} style={{ background: 'var(--primary-navy)', color: '#fff', border: '1px solid #000' }}>🖨️ आदेश प्रिंट करें</button>
              <button className="btn btn-secondary" onClick={() => setPrintDuty(null)} style={{ color: '#000', borderColor: '#000' }}>रद्द करें</button>
            </div>

          </div>
        </div>
      )}

      {/* Print stylesheet */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #root, .no-print {
            display: none !important;
          }
          div[style*="fixed"] {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            background: #fff !important;
            padding: 0 !important;
          }
          div[style*="fixed"] * {
            visibility: visible;
          }
        }
      `}</style>

    </div>
  );
}
