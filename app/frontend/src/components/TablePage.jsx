// TablePage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function TablePage() {
  const { tableName } = useParams();
  const [rows, setRows] = useState([]);
  const [newRow, setNewRow] = useState({});
  const [idColumn, setIdColumn] = useState('id'); // Имя столбца ID по умолчанию

  // Загрузка данных таблицы при загрузке компонента
  useEffect(() => {
    fetchTableData();
  }, [tableName]);

  const fetchTableData = () => {
    axios.get(`http://127.0.0.1:8000/data/${tableName}`)
      .then((response) => {
        setRows(response.data.rows);
        if (response.data.rows.length > 0) {
          // Автоматически определяем название ID столбца
          const potentialId = Object.keys(response.data.rows[0]).find(key => key.toLowerCase().includes("id"));
          setIdColumn(potentialId || 'id');
        }
      })
      .catch((error) => {
        console.error("Error fetching table data:", error);
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
    if (!id) {
      console.error("No ID found for deletion");
      return;
    }

    axios.delete(`http://127.0.0.1:8000/data/${tableName}/${id}`)
      .then(() => {
        fetchTableData();
      })
      .catch((error) => {
        console.error("Error deleting row:", error);
      });
  };

  return (
    <div>
      <h2>Таблица: {tableName}</h2>

      {/* Отображение таблицы данных */}
      <table>
        <thead>
          <tr>
            {rows.length > 0 && Object.keys(rows[0]).map((col, index) => (
              <th key={index}>{col}</th>
            ))}
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[idColumn]}>
              {Object.values(row).map((value, index) => (
                <td key={index}>{value}</td>
              ))}
              <td>
                <button onClick={() => handleDelete(row[idColumn])}>Удалить</button>
              </td>
            </tr>
          ))}
          {/* Добавление новой строки */}
          <tr>
            {rows.length > 0 && Object.keys(rows[0]).map((col, index) => (
              <td key={index}>
                <input
                  type="text"
                  value={newRow[col] || ''}
                  onChange={(e) => handleInputChange(e, col)}
                />
              </td>
            ))}
            <td>
              <button onClick={handleCreate}>Добавить</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default TablePage;
