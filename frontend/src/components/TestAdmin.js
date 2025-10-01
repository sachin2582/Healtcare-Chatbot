import React from 'react';

const TestAdmin = () => {
  return (
    <div style={{ 
      padding: '50px', 
      textAlign: 'center',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: 'blue' }}>🎉 ADMIN PANEL TEST</h1>
      <p>If you can see this, the admin route is working!</p>
      <p>Current Time: {new Date().toLocaleString()}</p>
      <p>URL: {window.location.href}</p>
    </div>
  );
};

export default TestAdmin;
