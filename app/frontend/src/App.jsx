import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import CategoriesPage from './components/CategoriesPage';
import TablePage from "./components/TablePage.jsx";
import AdminPage from "./components/AdminPage.jsx";
import AnalyticsPage from "./components/AnalyticsPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminPage />}>
          <Route path=":tableName" element={<TablePage />} />
        </Route>
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
