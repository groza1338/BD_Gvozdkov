// Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/token', {
        username,
        password
      });

      const token = response.data.access_token;
      localStorage.setItem('token', token);

      // Проверка роли пользователя
      const userInfoResponse = await axios.get('http://127.0.0.1:8000/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (userInfoResponse.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/categories');
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Ошибка входа");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Вход</h2>
      <input type="text" placeholder="Логин" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Войти</button>
    </form>
  );
}

export default Login;
