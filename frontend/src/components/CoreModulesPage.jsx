import React from 'react';

export default function CoreModulesPage() {
  return (
    <div className="homepage-container">
      {/* Header */}
      <header className="hp-header">
        <div className="hp-header-content" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="hp-logo-container" style={{ marginBottom: 0 }}>
            <span className="hp-shield">🛡️</span>
            <div>
              <h1 className="hp-title" style={{ fontSize: '1.5rem', textAlign: 'left' }}>KARTAVYA (कर्तव्य)</h1>
              <p className="hp-subtitle" style={{ fontSize: '0.8rem', textAlign: 'left' }}>मुख्य कार्यक्षेत्र (Core Modules)</p>
            </div>
          </div>
          <a href="#" className="btn btn-secondary" style={{ textDecoration: 'none', background: 'transparent', border: '1px solid #64748b', color: '#ffffff' }}>
            &larr; Back to Home
          </a>
        </div>
      </header>

      {/* Alert Banner */}
      <div className="hp-alert-wrapper">
        <div className="hp-alert-banner">
          <div className="hp-alert-text">
            <span className="hp-alert-icon">🚨</span>
            <strong>अलर्ट:</strong> कंट्रोल रूम से लाइव अपडेट्स और आपातकालीन सूचनाएं यहां दिखेंगी।
          </div>
          <button className="btn btn-danger hp-emergency-btn">EMERGENCY SOS</button>
        </div>
      </div>

      {/* Main Content */}
      <main className="hp-main">
        <h2 style={{ fontSize: '1.8rem', color: '#1e293b', marginBottom: '24px', fontWeight: 'bold' }}>मुख्य कार्यक्षेत्र (Core Modules)</h2>
        
        <div className="hp-grid animate-fade-in">
          {/* Card 1 */}
          <div className="hp-card">
            <div className="hp-icon-box bg-blue">K</div>
            <h3 className="hp-card-title">AI मॉड्यूल "थाना प्रभारी प्रशासनिक प्रबंधन(SHO / SO Administration)"</h3>
            <p className="hp-card-desc">थाना स्तर पर AI (Artificial Intelligence) मॉड्यूल का उपयोग पुलिसिंग को स्मार्ट, तेज और अधिक कुशल बनाने के लिए किया जा रहा है। इसका मुख्य उद्देश्य कागजी कार्रवाई को कम करना, अपराधियों को जल्दी पकड़ना और आम जनता की सुरक्षा सुनिश्चित करना है।</p>
            <a href="#sho-login" className="hp-link">लॉगिन हेतु &rarr;</a>
          </div>

          {/* Card 2 */}
          <div className="hp-card">
            <div className="hp-icon-box bg-blue">T</div>
            <h3 className="hp-card-title">AI मॉड्यूल "वरिष्ठ पुलिस अधीक्षक / पुलिस अधीक्षक प्रशासनिक प्रबंधन(SSP/SP Administration)"</h3>
            <p className="hp-card-desc">जनपद स्तर (District Level) पर AI मॉड्यूल का कार्यक्षेत्र थाना स्तर से कहीं अधिक व्यापक और रणनीतिक (strategic) होता है। जनपद स्तर पर पुलिस अधीक्षक (SP) या वरिष्ठ पुलिस अधीक्षक (SSP) पूरे जिले की कानून-व्यवस्था की निगरानी करते हैं। यहाँ AI मॉड्यूल का मुख्य काम अलग-अलग थानों के डेटा को एक जगह जोड़कर (centralize करके) बड़े पैमाने पर निर्णय लेना होता है।</p>
            <a href="#sp-login" className="hp-link">लॉगिन हेतु &rarr;</a>
          </div>

          {/* Card 3 */}
          <div className="hp-card">
            <div className="hp-icon-box bg-blue">V</div>
            <h3 className="hp-card-title">AI मॉड्यूल "पुलिस परिक्षेत्रीय प्रशासनिक प्रबंधन(Range Level Administration)"</h3>
            <p className="hp-card-desc">रेंज स्तर (Range Level) पर AI मॉड्यूल का मुख्य उद्देश्य कई जनपदों (Districts) के बीच समन्वय (Coordination) स्थापित करना और बड़े पैमाने पर अपराध नियंत्रण की निगरानी करना है. भारतीय पुलिस प्रणाली में रेंज का नेतृत्व आमतौर पर पुलिस उप-महानिरीक्षक (DIG) या पुलिस महानिरीक्षक (IG) करते हैं, जिनके अधीन 3 से 6 जिले आते हैं।</p>
            <a href="#dig-login" className="hp-link">लॉगिन हेतु &rarr;</a>
          </div>

          {/* Card 4 */}
          <div className="hp-card">
            <div className="hp-icon-box bg-blue">Y</div>
            <h3 className="hp-card-title">AI मॉड्यूल "पुलिस ज़ोन स्तरीय प्रशासन(Zone Level Administration)"</h3>
            <p className="hp-card-desc">ज़ोन स्तर (Zone Level) पर AI मॉड्यूल का कार्यक्षेत्र सबसे व्यापक, नीतिगत (Policy-making) और उच्च-स्तरीय पर्यवेक्षण (High-level Supervision) का होता है. भारतीय पुलिस प्रणाली में एक ज़ोन का नेतृत्व अपर पुलिस महानिदेशक (ADG - Additional Director General of Police) करते हैं. एक ज़ोन के अंतर्गत कई रेंज (Ranges) और दर्जनों जनपद (Districts) आते हैं।</p>
            <a href="#ig-login" className="hp-link">लॉगिन हेतु &rarr;</a>
          </div>

          {/* Card 5 */}
          <div className="hp-card">
            <div className="hp-icon-box bg-blue">Y</div>
            <h3 className="hp-card-title">AI मॉड्यूल "शीर्ष राज्य पुलिस प्रशासनिक प्रबंधन(DGP / Police Headquarters (PHQ) Level Administration)"</h3>
            <p className="hp-card-desc">"पुलिस महानिदेशक (DGP) / पुलिस मुख्यालय स्तर पर समग्र राज्य पुलिस बल का शीर्ष नेतृत्व, नीति निर्धारण, रणनीतिक सुरक्षा, संकट प्रबंधन एवं बजटीय व प्रशासनिक नियंत्रण का कुशल संचालन।</p>
            <a href="#dgp-login" className="hp-link">लॉगिन हेतु &rarr;</a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: '#1e293b', borderTop: '1px solid #334155', padding: '20px 0', marginTop: 'auto', textAlign: 'left' }}>
        <div style={{ maxWidth: '100%', margin: '0', padding: '0 24px' }}>
          <h4 style={{ color: '#94a3b8', marginBottom: '16px', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
            KARTAVYA Stands For
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
            {[
              { l: 'K', hi: 'कानून और व्यवस्था', color: '#ef4444' },
              { l: 'A', hi: 'आपातकालीन प्रबंधन', color: '#f97316' },
              { l: 'R', hi: 'तैयारी और रिपोर्टिंग', color: '#eab308' },
              { l: 'T', hi: 'तत्परता और त्वरित कार्रवाई', color: '#22c55e' },
              { l: 'A', hi: 'अधिकार और कर्तव्यों का संतुलन', color: '#0ea5e9' },
              { l: 'V', hi: 'विश्वसनीयता और निष्पक्षता', color: '#3b82f6' },
              { l: 'Y', hi: 'योजनाबद्ध कार्यप्रणाली', color: '#8b5cf6' },
              { l: 'A', hi: 'आदेश पालन और समन्वय', color: '#d946ef' }
            ].map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.05)', padding: '6px 12px', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ color: item.color, fontWeight: 'bold', fontSize: '1rem' }}>{item.l}</div>
                <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>- {item.hi}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.75rem', color: '#64748b' }}>
            &copy; {new Date().getFullYear()} UP Police Special Duty Management System
          </div>
        </div>
      </footer>
    </div>
  );
}
