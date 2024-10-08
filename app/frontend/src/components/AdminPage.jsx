// AdminPage.jsx
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';

function AdminPage() {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    // Загружаем список таблиц из API
    axios.get('http://127.0.0.1:8000/tables')
      .then((response) => {
        setTables(response.data.tables);
      })
      .catch((error) => {
        console.error("Error fetching tables:", error);
      });
  }, []);

  return (
    <div>
      <Header tables={tables} />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminPage;
