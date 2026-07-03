import React, { useState } from 'react';

// Mock Data
const thanas = ['Civil Lines', 'Kotwali', 'Cantt', 'Kydganj', 'Mutthiganj'];
const mockAbsentees = [
  { id: 1, name: 'R. K. Sharma', rank: 'SHO', thana: 'Kotwali', status: 'Medical Leave (till 15 Aug)', inCharge: 'S.I. Verma' },
  { id: 2, name: 'Anita Singh', rank: 'Inspector', thana: 'Civil Lines', status: 'Casual Leave (2 Days)', inCharge: 'S.I. Kumar' },
];

export default function DutyManagement() {
  const [sourceThana, setSourceThana] = useState('');
  const [destThana, setDestThana] = useState('');
  const [personnelCount, setPersonnelCount] = useState('');

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'var(--font-primary)' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.5rem', fontWeight: '800' }}>Duty Management Dashboard</h2>
        <span style={{ background: '#d97706', color: 'white', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
          District Chief Access
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
        
        {/* Module A: District Force Reallocation */}
        <div style={{ background: '#1e3a8a', padding: '24px', borderRadius: '12px', color: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#fbbf24', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '8px' }}>
            <span style={{ marginRight: '8px' }}>🔄</span> District Force Reallocation
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#cbd5e1' }}>Source Thana</label>
              <select value={sourceThana} onChange={e => setSourceThana(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white' }}>
                <option value="" style={{ color: 'black' }}>Select Source</option>
                {thanas.map(t => <option key={t} value={t} style={{ color: 'black' }}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#cbd5e1' }}>Destination Thana</label>
              <select value={destThana} onChange={e => setDestThana(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white' }}>
                <option value="" style={{ color: 'black' }}>Select Destination</option>
                {thanas.map(t => <option key={t} value={t} style={{ color: 'black' }}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#cbd5e1' }}>Personnel Count</label>
            <input type="number" placeholder="Enter number of officers" value={personnelCount} onChange={e => setPersonnelCount(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', boxSizing: 'border-box' }} />
          </div>
          <button style={{ width: '100%', padding: '12px', background: '#fbbf24', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Execute Transfer Order
          </button>
        </div>

        {/* Module B: VIP/Event Duty Planner */}
        <div style={{ background: '#0f172a', padding: '24px', borderRadius: '12px', color: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#fbbf24', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '8px' }}>
            <span style={{ marginRight: '8px' }}>⭐</span> VIP / Event Duty Planner
          </h3>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#cbd5e1' }}>Event Name / Type</label>
            <input type="text" placeholder="e.g. CM Visit, Festival Duty" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#cbd5e1' }}>Supervising Officer</label>
              <input type="text" placeholder="DSP / SHO Name" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#cbd5e1' }}>Reserve Force Req.</label>
              <input type="number" placeholder="Count from Lines" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', boxSizing: 'border-box' }} />
            </div>
          </div>
          <button style={{ width: '100%', padding: '12px', background: 'transparent', border: '2px solid #fbbf24', color: '#fbbf24', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer' }}>
            Create Event Profile
          </button>
        </div>

        {/* Module C: Live Absentee & Leave Tracker */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderTop: '4px solid #1e3a8a' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
            <span style={{ marginRight: '8px' }}>📅</span> Live Absentee & Leave Tracker
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ color: '#64748b', borderBottom: '1px solid #cbd5e1' }}>
                  <th style={{ padding: '8px' }}>Officer</th>
                  <th style={{ padding: '8px' }}>Base Thana</th>
                  <th style={{ padding: '8px' }}>Status</th>
                  <th style={{ padding: '8px' }}>Active In-Charge</th>
                </tr>
              </thead>
              <tbody>
                {mockAbsentees.map(a => (
                  <tr key={a.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 8px', fontWeight: 'bold', color: '#1e3a8a' }}>{a.name} <span style={{display:'block', fontSize:'0.75rem', color:'#64748b'}}>{a.rank}</span></td>
                    <td style={{ padding: '12px 8px', color: '#334155' }}>{a.thana}</td>
                    <td style={{ padding: '12px 8px' }}><span style={{ background: '#fee2e2', color: '#b91c1c', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>{a.status}</span></td>
                    <td style={{ padding: '12px 8px', color: '#0f172a', fontWeight: '600' }}>{a.inCharge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Module D: Duty Efficiency Analytics */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderTop: '4px solid #d97706' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
            <span style={{ marginRight: '8px' }}>📈</span> Duty Efficiency Analytics
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 'bold', color: '#334155' }}>
                <span>Civil Lines</span>
                <span style={{ color: '#16a34a' }}>94%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '94%', height: '100%', background: '#fbbf24' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 'bold', color: '#334155' }}>
                <span>Cantt</span>
                <span style={{ color: '#16a34a' }}>88%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '88%', height: '100%', background: '#fbbf24' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 'bold', color: '#334155' }}>
                <span>Kotwali</span>
                <span style={{ color: '#ea580c' }}>65%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '65%', height: '100%', background: '#f59e0b' }}></div>
              </div>
            </div>
            
            <p style={{ margin: '10px 0 0 0', fontSize: '0.8rem', color: '#64748b', textAlign: 'center' }}>
              * Compliance based on timely duty roster updates and active patrols.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
