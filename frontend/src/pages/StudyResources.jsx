import React from 'react';

const StudyResources = () => {
  return (
    <div className="fade-up-enter" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div>
        <h2 style={{ marginBottom: '16px' }}>Interactive Learning</h2>
        <div className="card" style={{ height: '600px', overflow: 'hidden', padding: 0 }}>
          <iframe 
            src="https://algolabs-frontend.pages.dev/" 
            title="AlgoLabs" 
            style={{ width: '100%', height: '100%', border: 'none' }} 
          />
        </div>
      </div>

      <div>
        <h2 style={{ marginBottom: '16px' }}>Video Resources</h2>
        <div className="dashboard-grid-3">
          {[1,2,3].map(i => (
            <div key={i} className="card" style={{ overflow: 'hidden' }}>
              <div style={{ height: '160px', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tx-secondary)' }}>
                Thumbnail Placeholder
              </div>
              <div className="card-body" style={{ padding: '16px' }}>
                <span className="badge badge-amber" style={{ marginBottom: '8px' }}>Coming Soon</span>
                <h3 style={{ fontSize: '1rem', marginBottom: '4px' }}>React Fundamentals Part {i}</h3>
                <div className="text-sm">Code Academy Pro</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default StudyResources;
