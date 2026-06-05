import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const CartPage = () => {
  const { user } = useAuth();
  const { cart, loading, updateQuantity, removeItem, clearCart } = useCart();

  if (!user) {
    return (
      <div className="container" style={{ textAlign: 'center' }}>
        <h2>🔒 Войдите в аккаунт</h2>
        <p>Чтобы просмотреть корзину, пожалуйста, войдите или зарегистрируйтесь.</p>
        <Link to="/login" className="btn btn-primary">Войти</Link>
        <Link to="/register" className="btn" style={{ marginLeft: '10px' }}>Зарегистрироваться</Link>
      </div>
    );
  }

  if (loading) return <div className="container">Загрузка корзины...</div>;

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center' }}>
        <h2>Корзина пуста</h2>
        <p>Добавьте товары в корзину, чтобы оформить заказ.</p>
        <Link to="/" className="btn btn-primary">Перейти в каталог</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ margin: '20px 0' }}>Корзина</h1>

      <div className="cart-items">
        {cart.items.map(item => (
          <div key={item.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 2 }}>
              <h3>{item.product_detail?.title || 'Товар'}</h3>
              <p>{item.product_detail?.price} ₽</p>
            </div>
            <div style={{ flex: 1 }}>
              <input
                type="number"
                value={item.quantity}
                min="1"
                max="99"
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                style={{ width: '60px', padding: '5px' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <p><strong>{item.total_price} ₽</strong></p>
            </div>
            <div>
              <button className="btn btn-danger" onClick={() => removeItem(item.id)}>Удалить</button>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '20px', marginBottom: '40px' }}>
        <h3>Итого: {cart.total_items} товаров на {cart.total_price} ₽</h3>
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button className="btn btn-danger" onClick={clearCart}>Очистить корзину</button>
          <button className="btn btn-success">Оформить заказ</button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;