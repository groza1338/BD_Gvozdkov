import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Header() {
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/tables', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTables(response.data.tables);
      } catch (error) {
        console.error("Failed to fetch tables:", error);
        navigate('/login');  // Редирект на логин, если запрос не удался
      }
    };

    fetchTables();
  }, [navigate]);

  return (
    <header>
      <h1>Admin Panel</h1>
      <nav>
        <ul>
          {tables.map((table) => (
            <li key={table}>
              <button onClick={() => navigate(`/admin/${table}`)}>
                {table}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
