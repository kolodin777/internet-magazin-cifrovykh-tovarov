import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const MyFavorites = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/products/favorites/');
      setProducts(response.data.results || response.data || []);
    } catch (error) {
      console.error('Ошибка загрузки избранного:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Загрузка...</div>;

  return (
    <div className="container">
      <h1 style={{ margin: '20px 0' }}>Избранное</h1>
      {products.length === 0 ? (
        <p>
          Пока нет избранных товаров. Вернитесь на <Link to="/">главную</Link> и добавьте что-нибудь.
        </p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFavorites;
