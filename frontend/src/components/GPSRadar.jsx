import React, { useState, useEffect } from 'react';

export default function GPSRadar({ title = "Live Force Tracking & GPS Radar" }) {
  const [radarScannerAngle, setRadarScannerAngle] = useState(0);

  // Rotate simulated radar sweeps
  useEffect(() => {
    const sweep = setInterval(() => {
      setRadarScannerAngle(prev => (prev + 3) % 360);
    }, 50);
    return () => clearInterval(sweep);
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#1e293b', fontWeight: 'bold' }}>{title}</h2>
      
      <div style={{ position: 'relative', height: '240px', background: '#050814', borderRadius: '8px', border: '1px solid #1e3a8a', overflow: 'hidden' }}>
        
        {/* Grid effect */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0, 243, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.04) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        
        {/* Blinking radar grid rings */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100px', height: '100px', borderRadius: '50%', border: '1px dashed rgba(0, 243, 255, 0.2)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '180px', height: '180px', borderRadius: '50%', border: '1px solid rgba(0, 243, 255, 0.1)' }} />
        
        {/* Radar scanner sweep line */}
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          width: '200px', 
          height: '2px', 
          background: 'linear-gradient(90deg, #0ea5e9, transparent)', 
          transformOrigin: 'left center', 
          transform: `translate(0, -50%) rotate(${radarScannerAngle}deg)`, 
          pointerEvents: 'none' 
        }} />

        {/* Dynamic Map Pins & Patrolling Paths */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          {/* Patrol Route corridor representation */}
          <path d="M 20,120 Q 150,50 250,120 T 500,120" fill="none" stroke="rgba(0, 243, 255, 0.25)" strokeWidth="3" strokeDasharray="5,5" />
          
          {/* Checkpoint indicators */}
          <circle cx="120" cy="85" r="4" fill="#fbbf24" />
          <text x="130" y="88" fill="#94a3b8" fontSize="10">CP-01</text>
          
          <circle cx="260" cy="100" r="4" fill="#fbbf24" />
          <text x="270" y="103" fill="#94a3b8" fontSize="10">CP-02</text>
        </svg>

        {/* Simulated Live Officers Markers */}
        <div style={{ position: 'absolute', left: '100px', top: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
          <span style={{ color: 'white', fontSize: '0.65rem', marginTop: '4px', background: 'rgba(0,0,0,0.6)', padding: '2px 4px', borderRadius: '4px' }}>Unit Alpha</span>
        </div>

        <div style={{ position: 'absolute', left: '220px', top: '70px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 10px #3b82f6' }} />
          <span style={{ color: 'white', fontSize: '0.65rem', marginTop: '4px', background: 'rgba(0,0,0,0.6)', padding: '2px 4px', borderRadius: '4px' }}>Unit Bravo</span>
        </div>

        <div style={{ position: 'absolute', left: '180px', top: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 10px #f59e0b' }} />
          <span style={{ color: 'white', fontSize: '0.65rem', marginTop: '4px', background: 'rgba(0,0,0,0.6)', padding: '2px 4px', borderRadius: '4px' }}>QRT-1</span>
        </div>
      </div>
    </div>
  );
}
