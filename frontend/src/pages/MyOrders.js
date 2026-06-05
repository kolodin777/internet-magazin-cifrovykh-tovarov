import React, { useEffect, useState } from 'react';
import api from '../services/api';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/my_orders/');
      setOrders(response.data);
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (orderId, title) => {
    try {
      const response = await api.get(`/orders/${orderId}/download/`, {
        responseType: 'blob',
      });
      const disposition = response.headers['content-disposition'] || '';
      const match = disposition.match(/filename="([^"]+)"/);
      const filename = match?.[1] || `${title || 'product'}.txt`;
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
      alert('Ошибка при скачивании');
    }
  };

  if (loading) return <div className="container">Загрузка...</div>;

  return (
    <div className="container">
      <h1 style={{ margin: '20px 0' }}>Мои покупки</h1>
      {orders.length === 0 ? (
        <p>У вас пока нет покупок. Перейдите на <a href="/">главную страницу</a>, чтобы приобрести товары.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="card">
            <h3>{order.product_detail?.title || 'Товар'}</h3>
            <p>Цена: {order.product_detail?.price} ₽</p>
            <p>Автор: {order.product_detail?.author_name}</p>
            <p>Дата покупки: {new Date(order.purchased_at).toLocaleString()}</p>
            <button
              className="btn btn-success"
              onClick={() => handleDownload(order.id, order.product_detail?.title)}
            >
              Скачать
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;
