// TablePage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './TablePage.css';

function TablePage() {
  const { tableName } = useParams();
  const [rows, setRows] = useState([]);
  const [newRow, setNewRow] = useState({});
  const [columns, setColumns] = useState([]);
  const [primaryKey, setPrimaryKey] = useState(null);

  useEffect(() => {
    fetchTableData();
  }, [tableName]);

  const fetchTableData = () => {
    axios.get(`http://127.0.0.1:8000/data/${tableName}`)
      .then((response) => {
        setRows(response.data.rows);
        if (response.data.rows.length > 0) {
          const columns = Object.keys(response.data.rows[0]);
          setColumns(columns);
          setPrimaryKey(columns[0]); // Допустим, первый ключ — это id, если его нет, можно уточнить
        } else {
          fetchTableColumns();
        }
      })
      .catch((error) => {
        console.error("Error fetching table data:", error);
      });
  };

  const fetchTableColumns = () => {
    axios.get(`http://127.0.0.1:8000/columns/${tableName}`)
      .then((response) => {
        setColumns(response.data.columns);
        setPrimaryKey(response.data.columns[0]); // Устанавливаем первый столбец как первичный ключ
      })
      .catch((error) => {
        console.error("Error fetching table columns:", error);
      });
  };

  const handleInputChange = (e, column) => {
    setNewRow({ ...newRow, [column]: e.target.value });
  };

  const handleCreate = () => {
    axios.post(`http://127.0.0.1:8000/data/${tableName}`, newRow)
      .then(() => {
        fetchTableData();
        setNewRow({});
      })
      .catch((error) => {
        console.error("Error creating row:", error);
      });
  };

  const handleDelete = (id) => {
    if (primaryKey && id !== undefined) {
      axios.delete(`http://127.0.0.1:8000/data/${tableName}/${id}`)
        .then(() => {
          fetchTableData();
        })
        .catch((error) => {
          console.error("Error deleting row:", error);
        });
    } else {
      console.error("Primary key or id is undefined. Cannot delete row.");
    }
  };

  return (
    <div className="table-page">
      <h2>Таблица: {tableName}</h2>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index}>{col}</th>
              ))}
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[primaryKey]}>
                {columns.map((col, index) => (
                  <td key={index}>{row[col]}</td>
                ))}
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(row[primaryKey])}>Удалить</button>
                </td>
              </tr>
            ))}
            <tr>
              {columns.map((col, index) => (
                <td key={index}>
                  <input
                    type="text"
                    value={newRow[col] || ''}
                    onChange={(e) => handleInputChange(e, col)}
                  />
                </td>
              ))}
              <td>
                <button className="add-btn" onClick={handleCreate}>Добавить</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TablePage;
