// CategoriesPage.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/data/category')
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
