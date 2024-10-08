// Header.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/tables')
      .then((response) => {
        setTables(response.data.tables);
      })
      .catch((error) => {
        console.error("Error fetching tables:", error);
      });
  }, []);

  return (
    <div className="header-container">
      <div className="header-scroll">
        {tables.map((table, index) => (
          <Link to={`/table/${table}`} key={index} className="header-item">
            {table}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Header;
