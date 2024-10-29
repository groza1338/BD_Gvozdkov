import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import CategoriesPage from './components/CategoriesPage';
import TablePage from './components/TablePage';
import AdminPage from './components/AdminPage';
import AnalyticsPage from './components/AnalyticsPage';
const publicDirUrl = import.meta.env.DEV
  ? '/public/'   // Если мы в режиме разработки
  : '/';  // Если мы в продакшене

function App() {
  useEffect(() => {
    // Функция для изменения фавикона
    const changeFavicon = (src) => {
      const link = document.querySelector("link[rel~='icon']");
      if (!link) {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = src;
        document.head.appendChild(newLink);
      } else {
        link.href = src;
      }
    };

    // Обработчик события visibilitychange
    const handleVisibilityChange = () => {
      if (document.hidden) {
        changeFavicon(`${publicDirUrl}inactive.svg`); // Используем favicon для неактивной вкладки
      } else {
        changeFavicon(`${publicDirUrl}postgres.svg`); // Используем favicon для активной вкладки
      }
    };

    // Добавляем обработчик события visibilitychange
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Удаляем обработчик при размонтировании компонента
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminPage />}>
            <Route path=":tableName" element={<TablePage />} />
          </Route>
          <Route path="/analytics" element={<AnalyticsPage />} /> {/* Новый маршрут для аналитики */}
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
