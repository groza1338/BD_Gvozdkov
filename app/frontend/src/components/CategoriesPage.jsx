// CategoriesPage.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
    const apiUrl = import.meta.env.DEV
  ? 'http://localhost:8000'   // Если мы в режиме разработки
  : 'api';  // Если мы в продакшене
  useEffect(() => {
    axios.get(`${apiUrl}/data/category`)
      .then((response) => {
        setCategories(response.data.rows);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  return (
    <div>
      <h2>Категории товаров</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.category_id}>{category.category_name}</li>
        ))}
      </ul>
    </div>
  );
}

export default CategoriesPage;
