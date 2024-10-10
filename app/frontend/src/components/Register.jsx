import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

function Register() {
  const [formData, setFormData] = useState({});
  const [fields, setFields] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/useraccount/fields')
      .then((response) => {
        const initialFormData = {};
        response.data.fields.forEach((field) => {
          initialFormData[field.name] = '';
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
    setErrorMessages([]); // Сброс ошибок перед отправкой

    axios.post('http://127.0.0.1:8000/register', formData)
      .then((response) => {
        alert("Registration successful!");
        navigate('/login');
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.detail) {
          const detail = error.response.data.detail;
          if (Array.isArray(detail)) {
            setErrorMessages(detail);
          } else if (typeof detail === 'string') {
            setErrorMessages([detail]);
          } else {
            setErrorMessages(["An error occurred during registration."]);
          }
        } else {
          console.error("Error registering user:", error);
          setErrorMessages(["Registration failed. Please try again."]);
        }
      });
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        <h2 className={styles.heading}>Register</h2>
        {fields.map((field) => (
          <div key={field.name} className={styles.formGroup}>
            <input
              type={
                field.name === "email"
                  ? "email"
                  : field.name === "password"
                  ? "password"
                  : "text"
              }
              name={field.name}
              placeholder={field.name.charAt(0).toUpperCase() + field.name.slice(1)}
              value={formData[field.name] || ''}
              onChange={handleChange}
              required={!field.nullable}
              className={`${styles.inputField} ${errorMessages.some(msg => msg.toLowerCase().includes(field.name)) ? styles.inputError : ''}`}
            />
          </div>
        ))}
        <button type="submit" className={styles.submitButton}>Register</button>
        {errorMessages.length > 0 && (
          <div className={styles.errorMessages}>
            {errorMessages.map((msg, index) => (
              <p key={index} className={styles.errorText}>{msg}</p>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}

export default Register;
