import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/token', {
        username,
        password,
      });
      const { access_token } = response.data;

      localStorage.setItem('token', access_token);
      // Запрос для получения информации о пользователе
      const userInfo = await axios.get('http://127.0.0.1:8000/me', {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      localStorage.setItem('role', userInfo.data.role);  // Сохранение роли
      if (userInfo.data.role === 'admin') {
        navigate('/admin');
      } else {
        // Редирект на другую страницу для обычного пользователя
        navigate('/user');
      }
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
