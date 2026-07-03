import React, { useState, useEffect } from 'react';
import { getDB, approveDuty, rejectDuty, createDuty } from '../mockData';
import GPSRadar from './GPSRadar';

export default function SHODashboard() {
  const [jurisdiction, setJurisdiction] = useState('');
  const [db, setDb] = useState(null);
  const [loading, setLoading] = useState(true);

  // Assignment Form State
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [assigneeId, setAssigneeId] = useState('');

  const loadData = async () => {
    setLoading(true);
    const data = await getDB();
    setDb(data);
    setLoading(false);
  };

  useEffect(() => {
    const isAuth = localStorage.getItem('up_police_sho_auth');
    if (isAuth !== 'true') {
      window.location.hash = '#sho-login';
    }
    const jur = localStorage.getItem('up_police_sho_jurisdiction');
    setJurisdiction(jur || 'CIVIL LINES');

    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('up_police_sho_auth');
    localStorage.removeItem('up_police_sho_jurisdiction');
    window.location.hash = '#';
  };

  const handleApprove = async (id) => {
    await approveDuty(id, 'SHO ' + jurisdiction);
    loadData();
  };

  const handleReject = async (id) => {
    await rejectDuty(id);
    loadData();
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!newTask || !assigneeId) return;

    const newDuty = {
      id: `DUTY-${Date.now()}`,
      title: newTask,
      type: 'SHO_ASSIGNMENT',
      priority: 'HIGH',
      status: 'ACTIVE',
      start_time: new Date().toISOString(),
      location_lat: 25.4358,
      location_lon: 81.8463,
      assignments: [{ id: `A-${Date.now()}`, personnel_id: assigneeId, role_in_duty: 'Lead' }],
      allocations: []
    };

    await createDuty(newDuty);
    setNewTask('');
    setAssigneeId('');
    setShowAssignModal(false);
    loadData();
  };

  if (loading || !db) return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading SHO Dashboard...</div>;

  const pendingDuties = db.duties.filter(d => d.status === 'PENDING' || d.status === 'REQUESTED');
  const activeDuties = db.duties.filter(d => d.status === 'ACTIVE' || d.status === 'ONGOING');
  const activeStaff = db.personnel.filter(p => p.current_status === 'ON_DUTY');

  // Custom tasks assigned directly by SHO (filtered from duties)
  const shoAssignments = db.duties.filter(d => d.type === 'SHO_ASSIGNMENT');

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: 'var(--font-primary)' }}>
      {/* Header */}
      <header style={{ background: '#1e293b', color: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '2rem' }}>👮‍♂️</span>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700', color: '#e2e8f0' }}>SHO / SO Dashboard</h1>
            <span style={{ fontSize: '0.85rem', color: 'var(--primary-khaki)' }}>Jurisdiction: {jurisdiction}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <a href="#" style={{ background: 'transparent', color: '#fbbf24', border: '1px solid #fbbf24', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.3s' }} onMouseOver={e => {e.target.style.background='#fbbf24'; e.target.style.color='#1e293b'}} onMouseOut={e => {e.target.style.background='transparent'; e.target.style.color='#fbbf24'}}>
            🏠 Home
          </a>
          <button onClick={handleLogout} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.3s' }} onMouseOver={e => e.target.style.background='#dc2626'} onMouseOut={e => e.target.style.background='#ef4444'}>
            Logout
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '32px auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

        {/* Live Monitoring Metrics */}
        <section>
          <h2 style={{ color: '#1e293b', marginBottom: '16px', fontSize: '1.2rem', borderBottom: '2px solid #cbd5e1', paddingBottom: '8px' }}>Live Thana Status</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <MetricCard title="Total Force Available" value={db.personnel.filter(p => p.current_status === 'AVAILABLE').length} icon="👮" color="#3b82f6" />
            <MetricCard title="Active Duties / Patrols" value={activeDuties.length} icon="🚔" color="#10b981" />
            <MetricCard title="Pending Approvals" value={pendingDuties.length} icon="⏳" color="#f59e0b" />
            <MetricCard title="Staff On Duty" value={activeStaff.length} icon="🛡️" color="#6366f1" />
          </div>
        </section>

        <section style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <GPSRadar title={`Live Tracking Radar - ${jurisdiction} Jurisdiction`} />
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          {/* Pending Approvals (Linked to special_duties) */}
          <section>
            <h2 style={{ color: '#1e293b', marginBottom: '16px', fontSize: '1.2rem', borderBottom: '2px solid #cbd5e1', paddingBottom: '8px' }}>Pending Approvals from Thana Desk</h2>
            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <tr>
                    <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: '600', fontSize: '0.9rem' }}>Duty ID & Type</th>
                    <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: '600', fontSize: '0.9rem' }}>Description</th>
                    <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: '600', fontSize: '0.9rem' }}>Priority</th>
                    <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: '600', fontSize: '0.9rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingDuties.length === 0 ? (
                    <tr><td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>No pending duties awaiting approval.</td></tr>
                  ) : pendingDuties.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{item.id}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.type}</div>
                      </td>
                      <td style={{ padding: '16px', color: '#334155' }}>{item.title}</td>
                      <td style={{ padding: '16px', color: '#334155' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', background: item.priority === 'HIGH' ? '#fee2e2' : '#fef3c7', color: item.priority === 'HIGH' ? '#b91c1c' : '#b45309' }}>
                          {item.priority}
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button onClick={() => handleApprove(item.id)} style={{ background: '#10b981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>Approve</button>
                          <button onClick={() => handleReject(item.id)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>Reject</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Work Assignment (Direct Duty Assignment) */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '2px solid #cbd5e1', paddingBottom: '8px' }}>
              <h2 style={{ color: '#1e293b', margin: 0, fontSize: '1.2rem' }}>Direct Assignments</h2>
              <button onClick={() => setShowAssignModal(true)} style={{ background: 'var(--primary-blue)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>
                + Assign Officer
              </button>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {shoAssignments.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '12px' }}>No direct assignments made.</div>
              ) : shoAssignments.map(a => {
                const assignedOfficerId = a.assignments?.[0]?.personnel_id;
                const officer = db.personnel.find(p => p.id === assignedOfficerId);
                return (
                  <div key={a.id} style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                    <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>{a.title}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: '#64748b' }}>Assigned to: <strong style={{ color: '#334155' }}>{officer ? `${officer.rank} ${officer.name}` : 'Unknown'}</strong></span>
                      <span style={{ color: '#10b981', fontWeight: '600' }}>Active</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      {/* Assignment Modal */}
      {showAssignModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>Assign Direct Duty</h3>
            <form onSubmit={handleAssign} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>Duty Description</label>
                <input required type="text" value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="e.g. Secret VIP Escort" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>Select Available Officer</label>
                <select required value={assigneeId} onChange={e => setAssigneeId(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}>
                  <option value="">-- Choose Officer --</option>
                  {db.personnel.filter(p => p.current_status === 'AVAILABLE').map(p => (
                    <option key={p.id} value={p.id}>{p.rank} {p.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowAssignModal(false)} style={{ flex: 1, padding: '10px', background: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', color: '#475569' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '10px', background: 'var(--primary-blue)', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', color: 'white' }}>Assign</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ title, value, icon, color }) {
  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: `4px solid ${color}` }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: color }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>{title}</div>
        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1e293b' }}>{value}</div>
      </div>
    </div>
  );
}
