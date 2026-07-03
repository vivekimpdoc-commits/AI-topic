import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Reports({ db }) {
  const { t } = useLanguage();
  const [reportType, setReportType] = useState('Daily Duty Report');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filteredDuties = db.duties.filter(d => {
    return categoryFilter === 'ALL' || d.category === categoryFilter;
  });

  const downloadCSV = () => {
    let headers = ["Duty Number", "Title", "Category", "Location", "Severity", "Status", "Start Time", "End Time"];
    let rows = filteredDuties.map(d => [
      d.duty_number,
      `"${d.title.replace(/"/g, '""')}"`,
      d.category,
      `"${d.location_name.replace(/"/g, '""')}"`,
      d.severity,
      d.status,
      d.start_time,
      d.end_time
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${reportType.toLowerCase().replace(/ /g, "_")}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Configuration Console */}
      <div className="glass" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', color: 'var(--primary-khaki)' }}>{t('reports.title')}</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('reports.select_template') || 'Select Report Template'}</label>
            <select value={reportType} onChange={e => setReportType(e.target.value)} style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', color: 'white', borderRadius: '6px' }}>
              <option>Daily Duty Report</option>
              <option>Weekly Force Utilization</option>
              <option>Monthly Bandobast Summary</option>
              <option>Logistics & Equipment Allocation Ledger</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Filter by Category</label>
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', color: 'white', borderRadius: '6px' }}>
              <option value="ALL">All Categories</option>
              <option value="VIP Duty">VIP Duty</option>
              <option value="Festival Duty">Festival Duty</option>
              <option value="Election Duty">Election Duty</option>
              <option value="Bandobast Duty">Bandobast Duty</option>
              <option value="Emergency Duty">Emergency Duty</option>
              <option value="Reserve Force">Reserve Force</option>
            </select>
          </div>

          <button className="btn btn-primary" onClick={downloadCSV} style={{ height: '42px' }}>
            📥 EXPORT AS CSV (EXCEL READY)
          </button>
        </div>
      </div>

      {/* Report Preview Panel */}
      <div className="glass" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--bg-card-border)', paddingBottom: '12px' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-khaki)' }}>📋 PREVIEW: {reportType}</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Matches: <strong>{filteredDuties.length} Duties</strong></span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--bg-card-border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '10px' }}>Duty Order</th>
                <th style={{ padding: '10px' }}>Category</th>
                <th style={{ padding: '10px' }}>Title & Location</th>
                <th style={{ padding: '10px' }}>Force Count</th>
                <th style={{ padding: '10px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredDuties.map(d => (
                <tr key={d.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px', fontWeight: '600' }}>{d.duty_number}</td>
                  <td style={{ padding: '10px' }}>{d.category}</td>
                  <td style={{ padding: '10px' }}>
                    <strong>{d.title}</strong>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>📍 {d.location_name}</span>
                  </td>
                  <td style={{ padding: '10px' }}>{d.assignments?.length || 0} Officers</td>
                  <td style={{ padding: '10px' }}>
                    <span className={`badge badge-${d.status.toLowerCase().replace('_', '')}`} style={{ fontSize: '0.7rem' }}>{d.status}</span>
                  </td>
                </tr>
              ))}
              {filteredDuties.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No records match the current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
