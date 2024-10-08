// AdminPanel.jsx
import React from 'react';
import Header from './Header';

function AdminPanel() {
  return (
    <div>
      <Header />
      <div style={{ paddingTop: '60px' }}> {/* Отступ, чтобы контент не перекрывался Header'ом */}
        {/* Основной контент админ-панели */}
      </div>
    </div>
  );
}

export default AdminPanel;
