// Register.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({});
  const [fields, setFields] = useState([]);
  const navigate = useNavigate();

  // Загрузка списка полей таблицы useraccount
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/useraccount/fields')
      .then((response) => {
        const initialFormData = {};
        response.data.fields.forEach((field) => {
          initialFormData[field.name] = ''; // Поле начальное значение пустое
        });
        setFields(response.data.fields);
        setFormData(initialFormData);
      })
      .catch((error) => {
        console.error("Error fetching user fields:", error);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/register', formData)
      .then((response) => {
        alert("Registration successful!");
        navigate('/login');
      })
      .catch((error) => {
        console.error("Error registering user:", error);
        alert("Registration failed. Please try again.");
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      {fields.map((field) => (
        <input
          key={field.name}
          type={field.name === "email" ? "email" : field.name === "password" ? "password" : "text"}
          name={field.name}
          placeholder={field.name.charAt(0).toUpperCase() + field.name.slice(1)}
          value={formData[field.name]}
          onChange={handleChange}
          required={!field.nullable} // Устанавливаем required, только если поле не nullable
        />
      ))}
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
