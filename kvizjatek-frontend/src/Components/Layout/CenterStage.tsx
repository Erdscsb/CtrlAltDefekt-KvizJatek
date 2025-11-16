import React from 'react';

const CenterStage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="center-stage">{children}</div>;
};

export default CenterStage;