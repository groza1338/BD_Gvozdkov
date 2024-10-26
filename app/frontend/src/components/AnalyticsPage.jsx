import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AnalyticsPage.css';

function AnalyticsPage() {
  const apiUrl = import.meta.env.DEV ? 'http://localhost:8000' : 'api';
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [currentQuery, setCurrentQuery] = useState('');
  const [productId, setProductId] = useState('');
  const [products, setProducts] = useState([]);
  const limit = 50;

  const fetchAnalyticsData = (query, params = {}, newOffset = 0) => {
    axios
      .get(`${apiUrl}/analytics/${query}`, {
        params: { ...params, limit, offset: newOffset },
      })
      .then((response) => {
        const newRows = response.data.rows;
        if (newRows.length < limit) setHasMore(false);
        setRows(newOffset === 0 ? newRows : [...rows, ...newRows]);

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
      fetchAnalyticsData(query, {}, 0);
    }
  };

  const loadMoreRows = () => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    fetchAnalyticsData(currentQuery, currentQuery === 'product-reviews' ? { product_id: productId } : {}, newOffset);
  };

  const fetchProducts = () => {
    axios
      .get(`${apiUrl}/products`)
      .then((response) => {
        setProducts(response.data.products);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  };

  useEffect(() => {
    if (currentQuery === 'product-reviews' && productId) {
      setOffset(0);
      setRows([]);
      setHasMore(true);
      fetchAnalyticsData('product-reviews', { product_id: productId }, 0);
    }
  }, [productId]);

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="analytics-page">
      <h2>Аналитические запросы</h2>
      <button onClick={() => navigate('/admin')} className="back-to-admin">Назад в админку</button>
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
        <button onClick={() => handleAnalyticsSelection('product-reviews')}>
          Отзывы на товары
        </button>
      </div>
      {currentQuery === 'product-reviews' && (
        <div className="product-review-section">
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            <option value="">Выберите товар</option>
            {products.map((product) => (
              <option key={product.product_id} value={product.product_id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {currentQuery === 'product-reviews' && productId && (
        <h3>Отзывы на товар: {products.find(p => p.product_id === productId)?.name}</h3>
      )}
      <div className="table-container">
        {rows.length > 0 && (
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
        )}
        {rows.length > 0 && hasMore && (
          <button onClick={loadMoreRows} className="pagination-button">Загрузить еще</button>
        )}
      </div>
    </div>
  );
}

export default AnalyticsPage;
