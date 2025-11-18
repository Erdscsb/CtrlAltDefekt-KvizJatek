import React from 'react';

const CenterStage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="center-stage">
      {/* Animated Background Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      
      {/* Main Content Wrapper */}
      <div 
        className="z-index-content" 
        style={{ 
          width: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default CenterStage;
