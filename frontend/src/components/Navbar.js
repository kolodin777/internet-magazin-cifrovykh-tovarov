import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ backgroundColor: '#333', padding: '15px', color: 'white', position: 'sticky', top: 0, zIndex: 1000 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold' }}>
          DigitalShop
        </Link>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Главная</Link>
          <Link to="/cart" style={{ color: 'white', textDecoration: 'none', position: 'relative' }}>
            Корзина
            {cart?.total_items > 0 && (
              <span style={{
                position: 'absolute',
                top: '-10px',
                right: '-15px',
                backgroundColor: '#ff5722',
                color: 'white',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '12px'
              }}>
                {cart.total_items}
              </span>
            )}
          </Link>

          {user ? (
            <>
              {user.is_staff && (
                <Link to="/my-products" style={{ color: 'white', textDecoration: 'none' }}>Мои товары</Link>
              )}
              <Link to="/my-orders" style={{ color: 'white', textDecoration: 'none' }}>Мои покупки</Link>
              <Link to="/favorites" style={{ color: 'white', textDecoration: 'none' }}>Избранное</Link>
              {user.is_staff && (
                <Link to="/create-product" style={{ color: 'white', textDecoration: 'none' }}>+ Добавить товар</Link>
              )}
              <Link
                to="/profile"
                style={{
                  color: '#ffd700',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  borderLeft: '1px solid #555',
                  paddingLeft: '15px'
                }}
              >
                👤 {user.username}
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: '1px solid #ff5722',
                  color: '#ff5722',
                  cursor: 'pointer',
                  padding: '5px 12px',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Вход</Link>
              <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
