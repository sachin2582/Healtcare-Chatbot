import React from 'react';

const AdminTest = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🎉 Admin Panel Test</h1>
      <p>If you can see this, the admin route is working!</p>
      <p>Time: {new Date().toLocaleString()}</p>
    </div>
  );
};

export default AdminTest;
