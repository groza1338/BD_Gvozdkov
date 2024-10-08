import React from 'react';
import Header from './Header';

function AdminPanel() {
  return (
    <div>
      <Header />
      <main>
        <h2>Welcome to the Admin Panel</h2>
        <p>Select a table to manage its data.</p>
      </main>
    </div>
  );
}

export default AdminPanel;
