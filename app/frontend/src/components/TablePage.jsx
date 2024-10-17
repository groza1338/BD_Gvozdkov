import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './TablePage.css';

function TablePage() {
  const apiUrl = import.meta.env.DEV ? 'http://localhost:8000' : 'api';
  const { tableName } = useParams();
  const [rows, setRows] = useState([]);
  const [newRow, setNewRow] = useState({});
  const [columns, setColumns] = useState([]);
  const [primaryKey, setPrimaryKey] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editRow, setEditRow] = useState({});
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchTableData();
  }, [tableName, filters]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchTableData = () => {
    const filterParams = Object.entries(filters)
      .map(([key, value]) => `${key}=${value}`)
      .join(',');

    axios.get(`${apiUrl}/data/${tableName}`, { params: { filters: filterParams } })
      .then((response) => {
        setRows(response.data.rows);
        if (response.data.rows.length > 0) {
          const columns = Object.keys(response.data.rows[0]);
          setColumns(columns);
          setPrimaryKey(columns[0]);
        } else {
          fetchTableColumns();
        }
      })
      .catch((error) => {
        console.error("Error fetching table data:", error);
      });
  };

  const fetchTableColumns = () => {
    axios.get(`${apiUrl}/columns/${tableName}`)
      .then((response) => {
        setColumns(response.data.columns);
        setPrimaryKey(response.data.columns[0]);
      })
      .catch((error) => {
        console.error("Error fetching table columns:", error);
      });
  };

  const handleInputChange = (e, column) => {
    setNewRow({ ...newRow, [column]: e.target.value });
  };

  const handleCreate = () => {
    const dataToSubmit = { ...newRow };
    delete dataToSubmit[primaryKey];

    axios.post(`${apiUrl}/data/${tableName}`, dataToSubmit)
      .then(() => {
        fetchTableData();
        setNewRow({});
      })
      .catch((error) => {
        console.error("Error creating row:", error);
        setError(error.response?.data?.detail || "An unexpected error occurred.");
      });
  };

  const handleDelete = (id) => {
    axios.delete(`${apiUrl}/data/${tableName}/${id}`)
      .then(() => fetchTableData())
      .catch((error) => {
        console.error("Error deleting row:", error);
        setError(error.response?.data?.detail || "An unexpected error occurred.");
      });
  };

  const startEditRow = (row) => {
    setEditRow(row);
    setIsEditing(true);
  };

  const handleEditChange = (e, column) => {
    setEditRow({ ...editRow, [column]: e.target.value });
  };

  const handleEditSave = () => {
    const id = editRow[primaryKey];
    axios.put(`${apiUrl}/data/${tableName}/${id}`, editRow)
      .then(() => {
        fetchTableData();
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error updating row:", error);
        setError(error.response?.data?.detail || "An unexpected error occurred.");
      });
  };

  const handleFilterChange = (e, column) => {
  const value = e.target.value;

  if (value) {
    setFilters({ ...filters, [column]: value });
  } else {
    const updatedFilters = { ...filters };
    delete updatedFilters[column];
    setFilters(updatedFilters);
  }
};

  return (
    <div className="table-page">
      <h2>Таблица: {tableName}</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>
                  {col}
                  <input
                    type="text"
                    placeholder={`Filter by ${col}`}
                    value={filters[col] || ''}
                    onChange={(e) => handleFilterChange(e, col)}
                    className="filter-input"
                  />
                </th>
              ))}
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[primaryKey]}>
                {columns.map((col) => (
                  <td key={col}>{row[col]}</td>
                ))}
                <td>
                  <button onClick={() => startEditRow(row)}>Редактировать</button>
                  <button onClick={() => handleDelete(row[primaryKey])}>Удалить</button>
                </td>
              </tr>
            ))}
            <tr>
              {columns.map((col) => (
                col === primaryKey ? (
                  <td key={col}><em>Auto-generated</em></td>
                ) : (
                  <td key={col}>
                    <input
                      type="text"
                      value={newRow[col] || ''}
                      onChange={(e) => handleInputChange(e, col)}
                    />
                  </td>
                )
              ))}
              <td>
                <button onClick={handleCreate}>Добавить</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {isEditing && (
        <div className="edit-modal">
          <h3>Редактирование записи</h3>
          {columns.map((col) => (
            <div key={col}>
              <label>{col}</label>
              <input
                type="text"
                value={editRow[col] || ''}
                onChange={(e) => handleEditChange(e, col)}
                disabled={col === primaryKey}
              />
            </div>
          ))}
          <button onClick={handleEditSave}>Сохранить</button>
          <button onClick={() => setIsEditing(false)}>Отмена</button>
        </div>
      )}
    </div>
  );
}

export default TablePage;
