// AdminPage.jsx
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';

function AdminPage() {
  const [tables, setTables] = useState([]);
  const apiUrl = import.meta.env.DEV
  ? 'http://localhost:8000'   // Если мы в режиме разработки
  : 'api';  // Если мы в продакшене

  useEffect(() => {
    // Загружаем список таблиц из API
    axios.get(`${apiUrl}/tables`)
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
