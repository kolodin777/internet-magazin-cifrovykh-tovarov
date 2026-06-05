import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
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

  useEffect(() => {
    if (!user || !user.is_staff) {
      navigate('/');
      return;
    }
    fetchCategories();
    fetchProduct();
  }, [id, user]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories/');
      console.log('Categories response:', response.data);

      // Обрабатываем разные форматы ответа
      let categoriesList = [];
      if (Array.isArray(response.data)) {
        categoriesList = response.data;
      } else if (response.data.results && Array.isArray(response.data.results)) {
        categoriesList = response.data.results;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        categoriesList = response.data.data;
      }

      setCategories(categoriesList);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
      setCategories([]);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}/`);
      setFormData({
        title: response.data.title,
        slug: response.data.slug,
        description: response.data.description,
        price: response.data.price,
        category: response.data.category?.id || '',
        is_active: response.data.is_active,
      });
    } catch (error) {
      console.error('Ошибка загрузки товара:', error);
      setError('Товар не найден');
      setTimeout(() => navigate('/my-products'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.patch(`/products/${id}/`, formData);
      navigate('/my-products');
    } catch (error) {
      console.error('Ошибка обновления:', error);
      setError('Ошибка при обновлении товара');
    }
  };

  if (!user || !user.is_staff) {
    return null;
  }

  if (loading) return <div className="container">Загрузка...</div>;

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '50px' }}>
      <div className="card">
        <h2>Редактировать товар</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Название</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
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
              value={formData.slug}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Описание</label>
            <textarea
              name="description"
              className="form-control"
              rows="5"
              value={formData.description}
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
              value={formData.price}
              onChange={handleChange}
              step="0.01"
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
            <label>
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
              Активен
            </label>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary">Сохранить</button>
            <button type="button" className="btn" onClick={() => navigate('/my-products')}>Отмена</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;