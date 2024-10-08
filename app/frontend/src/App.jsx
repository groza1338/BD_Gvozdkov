// App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import CategoriesPage from './components/CategoriesPage';
import TablePage from "./components/TablePage.jsx";
import AdminPage from "./components/AdminPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminPage />}>
          <Route path=":tableName" element={<TablePage />} />
        </Route>
        <Route path="/categories" element={<CategoriesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
