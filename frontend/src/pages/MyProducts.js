import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const MyProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchMyProducts();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchMyProducts = async () => {
    setLoading(true);
    try {
      if (user.is_staff) {
        let allProducts = [];
        let nextPage = 1;
        let hasMore = true;

        while (hasMore) {
          const response = await api.get(`/products/?page=${nextPage}&page_size=100`);
          const results = response.data.results || [];
          allProducts = [...allProducts, ...results];

          if (response.data.next) {
            nextPage++;
          } else {
            hasMore = false;
          }
        }
        setProducts(allProducts);
      } else {
        let allProducts = [];
        let nextPage = 1;
        let hasMore = true;

        while (hasMore) {
          const response = await api.get(`/products/?page=${nextPage}&page_size=100`);
          const results = response.data.results || [];
          allProducts = [...allProducts, ...results];

          if (response.data.next) {
            nextPage++;
          } else {
            hasMore = false;
          }
        }

        const userProducts = allProducts.filter(p => p.author_name === user.username);
        setProducts(userProducts);
      }
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      setError('Не удалось загрузить товары');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!user || !user.is_staff) {
      alert('У вас нет прав для удаления товаров');
      return;
    }
    if (window.confirm('Удалить товар?')) {
      try {
        await api.delete(`/products/${id}/`);
        fetchMyProducts();
      } catch (error) {
        alert('Ошибка при удалении');
      }
    }
  };

  if (!user?.is_staff) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '80px auto',
        padding: '40px',
        textAlign: 'center',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔒</div>
        <h1 style={{ color: '#dc3545', marginBottom: '20px' }}>Доступ запрещён</h1>
        <p style={{ fontSize: '18px', marginBottom: '20px', color: '#333' }}>
          Только администраторы могут просматривать эту страницу.
        </p>

        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '12px',
          margin: '30px 0',
          textAlign: 'left'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#007bff' }}>Как получить права администратора:</h3>
          <ul style={{ lineHeight: '1.8', paddingLeft: '20px' }}>
            <li>Свяжитесь с технической поддержкой</li>
            <li>Опишите цель добавления товаров</li>
            <li>После проверки вам выдадут права</li>
          </ul>
        </div>

        <div style={{
          backgroundColor: '#e9ecef',
          padding: '20px',
          borderRadius: '12px',
          margin: '20px 0',
          textAlign: 'left'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#28a745' }}>Контакты для связи:</h3>
          <p>Email: <strong>admin@digitalshop.com</strong></p>
          <p>Telegram: <strong>@интернет_магазин_цифровых_товаров_support</strong></p>
          <p>Вопросы и предложения: <strong>support@digitalshop.com</strong></p>
        </div>

        <Link to="/" style={{
          display: 'inline-block',
          padding: '12px 30px',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          marginTop: '20px',
          fontSize: '16px'
        }}>
          Вернуться на главную
        </Link>
      </div>
    );
  }

  if (loading) return <div className="container">Загрузка...</div>;

  if (error) return <div className="container" style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="container">
      <h1 style={{ margin: '20px 0' }}>
        {user?.is_staff ? `Все товары (${products.length})` : 'Мои товары'}
      </h1>
      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>У вас пока нет товаров.</p>
          <Link to="/create-product" className="btn btn-primary" style={{ marginTop: '20px' }}>
            Создать первый товар
          </Link>
        </div>
      ) : (
        products.map(product => (
          <div key={product.id} className="card">
            <h3>{product.title}</h3>
            <p>Цена: {product.price} ₽</p>
            <p>Категория: {product.category_title}</p>
            <p>Скачиваний: {product.downloads || 0}</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <Link to={`/product/${product.id}`} className="btn">Просмотр</Link>
              <Link to={`/edit-product/${product.id}`} className="btn" style={{ backgroundColor: '#ffc107', color: '#333' }}>Редактировать</Link>
              <button className="btn btn-danger" onClick={() => handleDelete(product.id)}>Удалить</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyProducts;
