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
  const [limit, setLimit] = useState(50);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setLimit(50);
    setRows([]);
    setNewRow({});
    setHasMore(true);
  }, [tableName]);

  useEffect(() => {
    fetchTableData();
  }, [tableName, filters, limit]);

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

    axios.get(`${apiUrl}/data/${tableName}`, {
      params: { filters: filterParams, limit }
    })
      .then((response) => {
        const newRows = response.data.rows;
        setRows(newRows);
        setHasMore(newRows.length === limit);

        if (newRows.length > 0) {
          const columns = Object.keys(newRows[0]);
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
      .then(() => {
        setRows(rows.filter(row => row[primaryKey] !== id));
      })
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

  const cancelEdit = () => {
    setIsEditing(false);
    setEditRow({});
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

  const loadMoreRows = () => {
    setLimit(limit + 50); // Увеличиваем лимит при каждом клике
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
                    placeholder={`Фильтр по ${col}`}
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
                  <td key={col}>
                    {isEditing && editRow[primaryKey] === row[primaryKey] ? (
                      <input
                        type="text"
                        value={editRow[col] || ''}
                        onChange={(e) => handleEditChange(e, col)}
                        disabled={col === primaryKey}
                      />
                    ) : (
                      row[col]
                    )}
                  </td>
                ))}
                <td>
                  <div className="action-container">
                    {isEditing && editRow[primaryKey] === row[primaryKey] ? (
                      <>
                        <button onClick={handleEditSave} className="save-btn">Сохранить</button>
                        <button onClick={cancelEdit} className="cancel-btn">Отмена</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEditRow(row)} className="edit-btn">Редактировать</button>
                        <button onClick={() => handleDelete(row[primaryKey])} className="delete-btn">Удалить</button>
                      </>
                    )}
                  </div>
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
                      placeholder={`Введите ${col}`}
                      className="add-input"
                    />
                  </td>
                )
              ))}
              <td>
                <button onClick={handleCreate} className="add-btn">Добавить</button>
              </td>
            </tr>
          </tbody>
        </table>
        {rows.length > 0 && hasMore && (
          <button onClick={loadMoreRows} className="pagination-button">Загрузить еще</button>
        )}
      </div>
    </div>
  );
}

export default TablePage;
