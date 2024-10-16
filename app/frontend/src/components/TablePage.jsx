import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './TablePage.css';

function TablePage() {
  const { tableName } = useParams();
  const [rows, setRows] = useState([]);
  const [newRow, setNewRow] = useState({});
  const [columns, setColumns] = useState([]);
  const [primaryKey, setPrimaryKey] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editRow, setEditRow] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTableData();
  }, [tableName]);

  // Таймер для исчезновения ошибки
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 10000); // 10 секунд

      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchTableData = () => {
    axios.get(`http://127.0.0.1:8000/data/${tableName}`)
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
    axios.get(`http://127.0.0.1:8000/columns/${tableName}`)
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

    axios.post(`http://127.0.0.1:8000/data/${tableName}`, dataToSubmit)
      .then(() => {
        fetchTableData();
        setNewRow({});
      })
      .catch((error) => {
        console.error("Error creating row:", error);
        if (error.response && error.response.data && error.response.data.detail) {
          setError(error.response.data.detail);
        } else {
          setError("An unexpected error occurred.");
        }
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
          if (error.response && error.response.data && error.response.data.detail) {
            setError(error.response.data.detail);
          } else {
            setError("An unexpected error occurred.");
          }
        });
    } else {
      console.error("Primary key or id is undefined. Cannot delete row.");
    }
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
    axios.put(`http://127.0.0.1:8000/data/${tableName}/${id}`, editRow)
      .then(() => {
        fetchTableData();
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error updating row:", error);
        if (error.response && error.response.data && error.response.data.detail) {
          setError(error.response.data.detail);
        } else {
          setError("An unexpected error occurred.");
        }
      });
  };

  return (
    <div className="table-page">
      <h2>Таблица: {tableName}</h2>
      {error && <div className="error-message">{error}</div>}
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
                  <button className="edit-btn" onClick={() => startEditRow(row)}>Редактировать</button>
                  <button className="delete-btn" onClick={() => handleDelete(row[primaryKey])}>Удалить</button>
                </td>
              </tr>
            ))}
            <tr>
              {columns.map((col, index) => (
                col === primaryKey ? (
                  <td key={index}><em>Auto-generated</em></td>
                ) : (
                  <td key={index}>
                    <input
                      type="text"
                      value={newRow[col] || ''}
                      onChange={(e) => handleInputChange(e, col)}
                    />
                  </td>
                )
              ))}
              <td>
                <button className="add-btn" onClick={handleCreate}>Добавить</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {isEditing && (
        <div className="edit-modal">
          <h3>Редактирование записи</h3>
          {columns.map((col, index) => (
            <div key={index}>
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
