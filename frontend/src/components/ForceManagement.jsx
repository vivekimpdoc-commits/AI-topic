import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { inductPersonnel, updatePersonnelStatus, addEquipment, logAudit } from '../mockData';
import * as XLSX from 'xlsx';

export default function ForceManagement({ db, onRefresh }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const { t } = useLanguage();
  
  // Add personnel form state
  const [name, setName] = useState('');
  const [pno, setPno] = useState('');
  const [rank, setRank] = useState('Constable');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Add equipment form state
  const [eqType, setEqType] = useState('WEAPON');
  const [eqModel, setEqModel] = useState('');
  const [eqSerial, setEqSerial] = useState('');

  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        let successCount = 0;
        for (const row of data) {
          if (row.Name && row.PNO) {
            const newOfficer = {
              id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              pno_number: String(row.PNO),
              name: String(row.Name),
              rank: String(row.Rank || 'Constable'),
              phone_number: String(row.Phone || 'N/A'),
              email: String(row.Email || `${String(row.Name).toLowerCase().replace(' ', '')}@uppolice.gov.in`),
              current_status: "AVAILABLE"
            };
            await inductPersonnel(newOfficer);
            successCount++;
          }
        }
        
        if (successCount > 0) {
          await logAudit("BULK_UPLOAD", "FORCE_MANAGEMENT", `Bulk uploaded ${successCount} personnel from Excel`);
          alert(`Successfully uploaded ${successCount} personnel!`);
          onRefresh();
        } else {
          alert("No valid rows found. Ensure Excel has columns: Name, PNO, Rank, Phone, Email.");
        }
      } catch (err) {
        console.error(err);
        alert("Error parsing Excel file.");
      }
    };
    reader.readAsBinaryString(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddPersonnelSubmit = async (e) => {
    e.preventDefault();
    if (!name || !pno || !phone) {
      alert("Name, PNO number and phone number are required.");
      return;
    }

    const newOfficer = {
      id: `p-${Date.now()}`,
      pno_number: pno,
      name,
      rank,
      phone_number: phone,
      email: email || `${name.toLowerCase().replace(' ', '')}@uppolice.gov.in`,
      current_status: "AVAILABLE"
    };

    await inductPersonnel(newOfficer);
    await logAudit("ADD_PERSONNEL", "FORCE_MANAGEMENT", `Registered new police personnel: ${name} (${rank}) with PNO ${pno}`);
    
    // Reset Form
    setName('');
    setPno('');
    setPhone('');
    setEmail('');
    onRefresh();
  };

  const handleAddEquipmentSubmit = async (e) => {
    e.preventDefault();
    if (!eqModel || !eqSerial) {
      alert("Model name and Serial Number are required.");
      return;
    }

    const newEq = {
      id: `eq-${Date.now()}`,
      equipment_type: eqType,
      model_name: eqModel,
      serial_number: eqSerial,
      status: "AVAILABLE"
    };

    await addEquipment(newEq);
    await logAudit("ADD_EQUIPMENT", "LOGISTICS", `Registered new ${eqType}: ${eqModel} (${eqSerial})`);
    
    setEqModel('');
    setEqSerial('');
    onRefresh();
  };

  const handleToggleLeaveClick = async (officerId, currentStatus, officerName) => {
    const newStatus = currentStatus === 'ON_LEAVE' ? 'AVAILABLE' : 'ON_LEAVE';
    await updatePersonnelStatus(officerId, newStatus);
    await logAudit("UPDATE_STATUS", "FORCE_MANAGEMENT", `Updated status of ${officerName} to ${newStatus}`);
    onRefresh();
  };

  const filteredPersonnel = db.personnel.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.pno_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.rank.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || p.current_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '28px' }}>
      
      {/* Force Availability & Management Panel */}
      <div className="glass" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', color: 'var(--primary-khaki)' }}>{t('force.title')}</h2>
        
        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <input 
            type="text" 
            placeholder={t('force.search')} 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ flexGrow: 1, padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', color: 'white', borderRadius: '6px' }}
          />
          <select 
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', color: 'white', borderRadius: '6px' }}
          >
            <option value="ALL">{t('force.all_statuses')}</option>
            <option value="AVAILABLE">{t('force.active')}</option>
            <option value="ON_DUTY">ON DUTY</option>
            <option value="ON_LEAVE">ON LEAVE</option>
          </select>
        </div>

        {/* Roster Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredPersonnel.map(person => (
            <div 
              key={person.id} 
              className="glass"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '16px', 
                borderRadius: '8px',
                borderLeft: person.current_status === 'AVAILABLE' ? '4px solid #059669' : person.current_status === 'ON_LEAVE' ? '4px solid #d97706' : '4px solid #2563eb',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(5px)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 243, 255, 0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Avatar */}
                <div style={{ 
                  width: '45px', height: '45px', borderRadius: '50%', 
                  background: 'var(--bg-secondary)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid var(--bg-card-border)',
                  fontSize: '1.2rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  👮
                </div>
                {/* Details */}
                <div>
                  <strong style={{ display: 'block', fontSize: '1.1rem', color: 'var(--text-primary)', letterSpacing: '0.5px' }}>{person.name}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>PNO: <span style={{ color: 'var(--primary-khaki)'}}>{person.pno_number}</span> | Tel: {person.phone_number}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                {/* Rank */}
                <div style={{ textAlign: 'center', minWidth: '100px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>{t('force.rank')}</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{person.rank}</span>
                </div>

                {/* Status */}
                <div style={{ textAlign: 'center', minWidth: '100px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>{t('force.status')}</span>
                  <span className={`badge badge-${person.current_status.toLowerCase().replace('_', '')}`} style={{ fontSize: '0.75rem', padding: '4px 10px', boxShadow: '0 0 10px rgba(0,0,0,0.5)' }}>
                    {person.current_status.replace('_', ' ')}
                  </span>
                </div>

                {/* Action */}
                <div style={{ minWidth: '100px', textAlign: 'right' }}>
                  <button 
                    onClick={() => handleToggleLeaveClick(person.id, person.current_status, person.name)}
                    style={{ 
                      padding: '8px 16px', fontSize: '0.8rem', fontWeight: 'bold',
                      background: person.current_status === 'ON_LEAVE' ? 'rgba(0, 243, 255, 0.1)' : 'rgba(255, 51, 102, 0.1)',
                      border: person.current_status === 'ON_LEAVE' ? '1px solid var(--primary-blue)' : '1px solid #ff3366',
                      color: person.current_status === 'ON_LEAVE' ? 'var(--primary-blue)' : '#ff3366',
                      borderRadius: '4px', cursor: person.current_status === 'ON_DUTY' ? 'not-allowed' : 'pointer',
                      opacity: person.current_status === 'ON_DUTY' ? 0.3 : 1,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { if(person.current_status !== 'ON_DUTY') e.currentTarget.style.background = person.current_status === 'ON_LEAVE' ? 'rgba(0, 243, 255, 0.2)' : 'rgba(255, 51, 102, 0.2)' }}
                    onMouseLeave={e => { if(person.current_status !== 'ON_DUTY') e.currentTarget.style.background = person.current_status === 'ON_LEAVE' ? 'rgba(0, 243, 255, 0.1)' : 'rgba(255, 51, 102, 0.1)' }}
                    disabled={person.current_status === 'ON_DUTY'}
                  >
                    {person.current_status === 'ON_LEAVE' ? t('force.end_leave') : t('force.set_leave')}
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredPersonnel.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', border: '1px dashed var(--bg-card-border)', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '10px', opacity: 0.5 }}>📭</span>
              <p style={{ margin: 0, fontSize: '1.1rem' }}>{t('force.no_personnel')}</p>
              <span style={{ fontSize: '0.85rem' }}>{t('force.adjust_filters')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Register New Force & Gear Allocation Check */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Registration Form */}
        <div className="glass" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', color: 'var(--primary-khaki)' }}>{t('force.induct')}</h2>
          <form onSubmit={handleAddPersonnelSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('force.full_name')} *</label>
              <input type="text" placeholder={t('force.full_name')} value={name} onChange={e => setName(e.target.value)} style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', color: 'white', borderRadius: '6px' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('force.pno')} *</label>
                <input type="text" placeholder={t('force.pno')} value={pno} onChange={e => setPno(e.target.value)} style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', color: 'white', borderRadius: '6px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('force.rank')} *</label>
                <select value={rank} onChange={e => setRank(e.target.value)} style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', color: 'white', borderRadius: '6px' }}>
                  <option>SHO</option>
                  <option>Inspector</option>
                  <option>SI</option>
                  <option>ASI</option>
                  <option>Head Constable</option>
                  <option>Constable</option>
                  <option>Home Guard</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('force.phone')} *</label>
                <input type="text" placeholder={t('force.phone')} value={phone} onChange={e => setPhone(e.target.value)} style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', color: 'white', borderRadius: '6px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Email (Optional)</label>
                <input type="email" placeholder="e.g. ramesh@upp.gov.in" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', color: 'white', borderRadius: '6px' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
              <button type="submit" className="btn btn-primary">{t('force.induct_btn')}</button>
              <button type="button" className="btn btn-secondary" onClick={() => fileInputRef.current.click()} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                📁 {t('force.upload_excel')}
              </button>
              <input type="file" accept=".xlsx, .xls, .csv" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />
            </div>
          </form>
        </div>

        {/* Weapons & Vehicles Stats */}
        <div className="glass" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '16px', color: 'var(--primary-khaki)' }}>{t('force.logistics_title')}</h2>
          
          <form onSubmit={handleAddEquipmentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--bg-card-border)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
              <select value={eqType} onChange={e => setEqType(e.target.value)} style={{ padding: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', color: 'white', borderRadius: '6px', fontSize: '0.8rem' }}>
                <option value="WEAPON">{t('force.weapon')}</option>
                <option value="VEHICLE">{t('force.vehicle')}</option>
                <option value="WIRELESS_SET">{t('force.wireless')}</option>
              </select>
              <input type="text" placeholder={t('force.model_name')} value={eqModel} onChange={e => setEqModel(e.target.value)} style={{ padding: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', color: 'white', borderRadius: '6px', fontSize: '0.8rem' }} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="text" placeholder={t('force.serial_no')} value={eqSerial} onChange={e => setEqSerial(e.target.value)} style={{ flexGrow: 1, padding: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', color: 'white', borderRadius: '6px', fontSize: '0.8rem' }} />
              <button type="submit" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>+ {t('force.add_gear')}</button>
            </div>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto', paddingRight: '5px' }}>
            {db.equipment.map(eq => (
              <div key={eq.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#f8fafc', border: '1px solid var(--bg-card-border)', borderRadius: '6px' }}>
                <div>
                  <strong style={{ fontSize: '0.85rem', textTransform: 'capitalize' }}>{eq.model_name}</strong>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>SN: {eq.serial_number}</span>
                </div>
                <span className={`badge badge-${eq.status === 'AVAILABLE' ? 'approved' : 'pending'}`} style={{ fontSize: '0.7rem' }}>
                  {eq.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
