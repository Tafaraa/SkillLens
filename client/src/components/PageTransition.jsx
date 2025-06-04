import React from 'react';

const PageTransition = ({ children }) => {
  return (
    <div className="animate-fadein">
      {children}
    </div>
  );
};

export default PageTransition;
