import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { addEquipment, addMaintenanceLog, completeMaintenance, logAudit } from '../mockData';

export default function FleetManagement({ db, onRefresh }) {
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLanguage();
  
  // New Vehicle form state
  const [modelName, setModelName] = useState('');
  const [serialNumber, setSerialNumber] = useState(''); // Registration number

  // Maintenance form state
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [maintType, setMaintType] = useState('OIL_CHANGE');
  const [maintDesc, setMaintDesc] = useState('');
  const [maintCost, setMaintCost] = useState('');

  const vehicles = (db.equipment || []).filter(e => e.equipment_type === 'VEHICLE');
  const activeDuties = (db.duties || []).filter(d => d.status === 'ACTIVE' || d.status === 'APPROVED');
  
  const filteredVehicles = vehicles.filter(v => 
    v.model_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.serial_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getVehicleDuty = (vehicleId) => {
    for (const duty of activeDuties) {
      if (duty.allocations && duty.allocations.some(a => a.equipment_id === vehicleId)) {
        return duty;
      }
    }
    return null;
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    if (!modelName || !serialNumber) {
      alert("Model name and registration number are required.");
      return;
    }

    const newEq = {
      id: `eq-${Date.now()}`,
      equipment_type: 'VEHICLE',
      model_name: modelName,
      serial_number: serialNumber,
      status: "AVAILABLE"
    };

    await addEquipment(newEq);
    await logAudit("ADD_VEHICLE", "FLEET_MANAGEMENT", `Registered new vehicle: ${modelName} (${serialNumber})`);
    
    setModelName('');
    setSerialNumber('');
    onRefresh();
  };

  const handleAddMaintenance = async (e) => {
    e.preventDefault();
    if (!selectedVehicleId || !maintDesc) {
      alert("Please select a vehicle and provide a description.");
      return;
    }

    const logData = {
      id: `vm-${Date.now()}`,
      vehicle_id: selectedVehicleId,
      maintenance_type: maintType,
      description: maintDesc,
      cost: maintCost ? parseFloat(maintCost) : 0,
      service_date: new Date().toISOString().split('T')[0],
      next_service_date: null,
      status: "IN_PROGRESS",
      created_at: new Date().toISOString()
    };

    await addMaintenanceLog(logData);
    await logAudit("MAINTENANCE_LOG", "FLEET_MANAGEMENT", `Added maintenance log for vehicle ID ${selectedVehicleId}: ${maintType}`);
    
    setSelectedVehicleId('');
    setMaintDesc('');
    setMaintCost('');
    onRefresh();
  };

  const handleCompleteMaintenance = async (id, vehicle_id) => {
    await completeMaintenance(id, vehicle_id);
    await logAudit("MAINTENANCE_COMPLETED", "FLEET_MANAGEMENT", `Completed maintenance for vehicle ID ${vehicle_id}`);
    onRefresh();
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '28px' }}>
      
      {/* Fleet Overview Panel */}
      <div className="glass" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', color: 'var(--primary-khaki)' }}>{t('fleet.title')}</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <input 
            type="text" 
            placeholder={t('fleet.search')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', color: 'white', borderRadius: '6px' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredVehicles.map(vehicle => {
            const duty = getVehicleDuty(vehicle.id);
            const isMaintenance = vehicle.status === 'MAINTENANCE';
            
            return (
              <div 
                key={vehicle.id} 
                className="glass"
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  padding: '16px', 
                  borderRadius: '8px',
                  borderLeft: vehicle.status === 'AVAILABLE' ? '4px solid #059669' : (isMaintenance ? '4px solid #d97706' : '4px solid #2563eb'),
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '2rem' }}>
                      {vehicle.model_name.toLowerCase().includes('bike') ? '🏍️' : '🚓'}
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{vehicle.model_name}</strong>
                      <span style={{ fontSize: '0.9rem', color: 'var(--primary-khaki)' }}>{vehicle.serial_number}</span>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge badge-${vehicle.status === 'AVAILABLE' ? 'approved' : (isMaintenance ? 'pending' : 'active')}`} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                      {vehicle.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {duty && (
                  <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(37, 99, 235, 0.1)', border: '1px solid var(--primary-blue)', borderRadius: '6px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary-blue)', display: 'block', marginBottom: '4px' }}>{t('fleet.assigned_to')}</span>
                    <strong style={{ fontSize: '0.9rem', color: 'white' }}>{duty.title} ({duty.duty_number})</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>{t('fleet.location')} {duty.location_name}</span>
                  </div>
                )}
              </div>
            );
          })}
          
          {filteredVehicles.length === 0 && (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              {t('fleet.no_vehicles')}
            </div>
          )}
        </div>
      </div>

      {/* Forms & Maintenance Logs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Register Vehicle */}
        <div className="glass" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--primary-khaki)' }}>{t('fleet.add_vehicle')}</h2>
          <form onSubmit={handleAddVehicle} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input type="text" placeholder={t('fleet.model')} value={modelName} onChange={e => setModelName(e.target.value)} style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', color: 'white', borderRadius: '6px' }} />
            <input type="text" placeholder={t('fleet.reg_no')} value={serialNumber} onChange={e => setSerialNumber(e.target.value)} style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', color: 'white', borderRadius: '6px' }} />
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>{t('fleet.register_btn')}</button>
          </form>
        </div>

        {/* Maintenance Log */}
        <div className="glass" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--primary-khaki)' }}>{t('fleet.log_servicing')}</h2>
          <form onSubmit={handleAddMaintenance} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <select value={selectedVehicleId} onChange={e => setSelectedVehicleId(e.target.value)} style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', color: 'white', borderRadius: '6px' }}>
              <option value="">{t('fleet.select_vehicle')}</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.serial_number} - {v.model_name}</option>
              ))}
            </select>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <select value={maintType} onChange={e => setMaintType(e.target.value)} style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', color: 'white', borderRadius: '6px' }}>
                <option value="OIL_CHANGE">{t('fleet.oil_change')}</option>
                <option value="REPAIR">{t('fleet.repair')}</option>
                <option value="INSPECTION">{t('fleet.inspection')}</option>
                <option value="TYRE_CHANGE">{t('fleet.tyre_change')}</option>
              </select>
              <input type="number" placeholder={t('fleet.cost')} value={maintCost} onChange={e => setMaintCost(e.target.value)} style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', color: 'white', borderRadius: '6px' }} />
            </div>
            <textarea placeholder={t('fleet.desc')} value={maintDesc} onChange={e => setMaintDesc(e.target.value)} style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', color: 'white', borderRadius: '6px', minHeight: '60px' }}></textarea>
            <button type="submit" className="btn btn-secondary" style={{ alignSelf: 'flex-start', background: '#d97706', borderColor: '#d97706', color: 'white' }}>{t('fleet.send_maintenance')}</button>
          </form>

          {/* Active Maintenance */}
          <h3 style={{ fontSize: '1rem', marginBottom: '12px', color: 'var(--text-secondary)' }}>{t('fleet.active_jobs')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(db.maintenance || []).filter(m => m.status === 'IN_PROGRESS').map(m => {
              const v = vehicles.find(v => v.id === m.vehicle_id);
              return (
                <div key={m.id} style={{ padding: '12px', background: 'var(--bg-secondary)', border: '1px solid #d97706', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.9rem' }}>{v ? v.serial_number : 'Unknown'} - {m.maintenance_type.replace('_', ' ')}</strong>
                    <button onClick={() => handleCompleteMaintenance(m.id, m.vehicle_id)} style={{ padding: '4px 8px', background: '#059669', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>
                      {t('fleet.mark_complete')}
                    </button>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginTop: '4px' }}>{m.description}</span>
                </div>
              );
            })}
            {(db.maintenance || []).filter(m => m.status === 'IN_PROGRESS').length === 0 && (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('fleet.no_maintenance')}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
