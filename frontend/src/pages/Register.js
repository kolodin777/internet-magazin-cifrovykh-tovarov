import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.password2) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      await register(formData);
      setSuccess('Регистрация успешна! Теперь вы можете войти.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      if (err.response?.data) {
        const errors = err.response.data;
        if (errors.username) setError(`Имя пользователя: ${errors.username.join(', ')}`);
        else if (errors.email) setError(`Email: ${errors.email.join(', ')}`);
        else if (errors.password) setError(`Пароль: ${errors.password.join(', ')}`);
        else setError('Ошибка регистрации. Попробуйте другие данные.');
      } else {
        setError('Ошибка сервера. Попробуйте позже.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', background: 'white', borderRadius: '8px' }}>
      <h2>Регистрация</h2>
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: '15px' }}>{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="text" name="username" className="form-control" placeholder="Имя пользователя*" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <input type="email" name="email" className="form-control" placeholder="Email*" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <input type="text" name="first_name" className="form-control" placeholder="Имя" onChange={handleChange} />
        </div>
        <div className="form-group">
          <input type="text" name="last_name" className="form-control" placeholder="Фамилия" onChange={handleChange} />
        </div>
        <div className="form-group">
          <input type="password" name="password" className="form-control" placeholder="Пароль*" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <input type="password" name="password2" className="form-control" placeholder="Подтверждение пароля*" onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary">Зарегистрироваться</button>
      </form>
      <p style={{ marginTop: '15px' }}>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
};

export default Register;