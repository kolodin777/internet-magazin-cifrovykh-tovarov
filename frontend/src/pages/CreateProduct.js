import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const CreateProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: '',
    category: '',
    is_active: true,
  });
  const [file, setFile] = useState(null);

  // Проверка прав доступа
  if (!user || !user.is_staff) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '100px auto',
        padding: '40px',
        textAlign: 'center',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#dc3545', marginBottom: '20px' }}>Доступ запрещён</h1>
        <p style={{ fontSize: '18px', marginBottom: '20px' }}>
          У вас нет прав для создания товаров.
        </p>
        <p style={{ marginBottom: '30px', color: '#666' }}>
          Только администраторы могут добавлять товары в магазин.
        </p>
        <p style={{ marginBottom: '20px' }}>
          Свяжитесь с администратором: <strong>admin@digitalshop.com</strong>
        </p>
        <Link to="/" style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px'
        }}>
          Вернуться на главную
        </Link>
      </div>
    );
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories/');
      console.log('Categories response:', response.data);

      let categoriesList = [];
      if (Array.isArray(response.data)) {
        categoriesList = response.data;
      } else if (response.data.results && Array.isArray(response.data.results)) {
        categoriesList = response.data.results;
      }

      setCategories(categoriesList);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    if (file) {
      data.append('file', file);
    }

    try {
      await api.post('/products/', data);
      navigate('/my-products');
    } catch (error) {
      console.error('Ошибка создания:', error);
      setError('Ошибка при создании товара');
    }
  };

  if (loading) return <div className="container">Загрузка категорий...</div>;

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '50px' }}>
      <div className="card">
        <h2>Добавить товар</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Название</label>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="Название"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>URL (транслит)</label>
            <input
              type="text"
              name="slug"
              className="form-control"
              placeholder="url-translit"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Описание</label>
            <textarea
              name="description"
              className="form-control"
              placeholder="Описание"
              rows="5"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Цена</label>
            <input
              type="number"
              name="price"
              className="form-control"
              placeholder="Цена"
              step="0.01"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Категория</label>
            <select
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Выберите категорию</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Файл (необязательно)</label>
            <input
              type="file"
              onChange={handleFileChange}
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="is_active"
                defaultChecked
                onChange={handleChange}
              />
              Активен
            </label>
          </div>

          <button type="submit" className="btn btn-primary">Создать</button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;