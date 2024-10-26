import { useEffect, useState } from 'react';
import axios from 'axios';

function AnalyticsPage() {
  const apiUrl = import.meta.env.DEV ? 'http://localhost:8000' : 'api';
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [currentQuery, setCurrentQuery] = useState('');
  const [productId, setProductId] = useState(''); // Новый стейт для ID товара
  const limit = 50;

  const fetchAnalyticsData = (query, params = {}) => {
    axios
      .get(`${apiUrl}/analytics/${query}`, {
        params: { ...params, limit, offset },
      })
      .then((response) => {
        const newRows = response.data.rows;
        if (newRows.length < limit) setHasMore(false);
        setRows(offset === 0 ? newRows : [...rows, ...newRows]);

        if (newRows.length > 0) {
          const columns = Object.keys(newRows[0]);
          setColumns(columns);
        }
      })
      .catch((error) => {
        console.error('Error fetching analytics data:', error);
      });
  };

  const handleAnalyticsSelection = (query) => {
    setCurrentQuery(query);
    setOffset(0);
    setRows([]);
    setHasMore(true);
    if (query !== 'product-reviews') {
      fetchAnalyticsData(query);
    }
  };

  const loadMoreRows = () => {
    setOffset((prevOffset) => prevOffset + limit);
  };

  const handleFetchReviews = () => {
    if (productId) {
      fetchAnalyticsData('product-reviews', { product_id: productId });
    }
  };

  return (
    <div className="analytics-page">
      <h2>Аналитические запросы</h2>
      <div className="analytics-buttons">
        <button onClick={() => handleAnalyticsSelection('available-products')}>
          Товары в наличии
        </button>
        <button onClick={() => handleAnalyticsSelection('out-of-stock-products')}>
          Товары, которые кончились
        </button>
        <button onClick={() => handleAnalyticsSelection('orders-in-delivery')}>
          Заказы в доставке
        </button>
        <div className="product-review-section">
          <input
            type="number"
            placeholder="Введите ID товара"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          />
          <button onClick={handleFetchReviews}>Показать отзывы</button>
        </div>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {columns.map((col) => (
                  <td key={col}>{row[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {hasMore && <button onClick={loadMoreRows}>Загрузить еще</button>}
      </div>
    </div>
  );
}

export default AnalyticsPage;
