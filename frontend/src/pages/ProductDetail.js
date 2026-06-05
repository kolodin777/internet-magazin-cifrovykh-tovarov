import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import FavoriteButton from '../components/FavoriteButton';
import ProductComments from '../components/ProductComments';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import api from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [hasPurchased, setHasPurchased] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [message, setMessage] = useState('');

  const productQuery = useQuery({
    queryKey: ['product', String(id)],
    queryFn: async () => {
      const response = await api.get(`/products/${id}/`);
      return response.data;
    },
  });

  useEffect(() => {
    if (!user) {
      setHasPurchased(false);
      setOrderId(null);
      return;
    }

    const checkPurchase = async () => {
      try {
        const response = await api.get('/orders/my_orders/');
        const purchased = response.data.find((order) => order.product === Number(id));
        setHasPurchased(Boolean(purchased));
        setOrderId(purchased?.id || null);
      } catch (error) {
        console.error('Не удалось проверить покупку:', error);
      }
    };
    checkPurchase();
  }, [id, user]);

  const handlePurchase = async () => {
    try {
      const response = await api.post('/orders/', { product: id });
      setHasPurchased(true);
      setOrderId(response.data.id);
      setMessage('Товар успешно приобретён.');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Ошибка при покупке.');
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get(`/orders/${orderId}/download/`, {
        responseType: 'blob',
      });
      const disposition = response.headers['content-disposition'] || '';
      const match = disposition.match(/filename="([^"]+)"/);
      const filename = match?.[1] || `${product.title}.txt`;
      const blob = new Blob([response.data], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setMessage('Ошибка при скачивании.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Удалить товар?')) return;
    try {
      await api.delete(`/products/${id}/`);
      navigate('/my-products');
    } catch (error) {
      setMessage('Ошибка при удалении.');
    }
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    const success = await addToCart(id);
    setMessage(success ? 'Товар добавлен в корзину.' : 'Ошибка при добавлении в корзину.');
    setAddingToCart(false);
  };

  if (productQuery.isLoading) return <div className="container">Загрузка...</div>;
  if (productQuery.isError || !productQuery.data) {
    return <div className="container">Товар не найден.</div>;
  }

  const product = productQuery.data;
  const isAuthor = user && product.author === user.username;
  const isAdmin = user && user.is_staff;

  return (
    <div className="container product-page">
      <div className="card product-detail-card">
        <h1>{product.title}</h1>
        <p><strong>Цена:</strong> {product.price} руб.</p>
        <p><strong>Категория:</strong> {product.category?.title}</p>
        <p><strong>Автор:</strong> {product.author}</p>
        <p><strong>Описание:</strong></p>
        <p>{product.description}</p>

        {message && <div className="notice">{message}</div>}

        <div className="product-actions">
          <FavoriteButton product={product} />
          {user ? (
            hasPurchased ? (
              <button className="btn btn-success" onClick={handleDownload}>Скачать</button>
            ) : isAuthor || isAdmin ? (
              <>
                <button className="btn" onClick={() => navigate(`/edit-product/${product.id}`)}>
                  Редактировать
                </button>
                <button className="btn btn-danger" onClick={handleDelete}>Удалить</button>
              </>
            ) : (
              <>
                <button className="btn btn-primary" onClick={handlePurchase}>Купить</button>
                <button className="btn cart-button" onClick={handleAddToCart} disabled={addingToCart}>
                  {addingToCart ? 'Добавление...' : 'В корзину'}
                </button>
              </>
            )
          ) : (
            <p>Для покупки необходимо <Link to="/login">войти</Link>.</p>
          )}
        </div>
      </div>

      <ProductComments productId={id} />
    </div>
  );
};

export default ProductDetail;
