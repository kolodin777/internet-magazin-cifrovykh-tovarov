import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      backgroundColor: '#333',
      color: '#fff',
      padding: '40px 20px 20px',
      marginTop: '60px',
      borderTop: '1px solid #444'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '30px',
        marginBottom: '30px'
      }}>

        {/* О магазине */}
        <div>
          <h3 style={{ marginBottom: '15px', fontSize: '18px' }}>🛒 О магазине</h3>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#ccc' }}>
            DigitalShop — магазин цифровых товаров. Курсы, шаблоны, музыка, дизайн и многое другое. Мгновенная доставка после оплаты.
          </p>
        </div>

        {/* Контакты */}
        <div>
          <h3 style={{ marginBottom: '15px', fontSize: '18px' }}>📞 Контакты</h3>
          <p style={{ fontSize: '14px', marginBottom: '8px', color: '#ccc' }}>
            ✉️ <a href="mailto:support@digitalshop.com" style={{ color: '#ffd700', textDecoration: 'none' }}>support@digitalshop.com</a>
          </p>
          <p style={{ fontSize: '14px', marginBottom: '8px', color: '#ccc' }}>
            📱 Telegram: <a href="https://t.me/internet_magazin_cifrovykh_tovarov" style={{ color: '#ffd700', textDecoration: 'none' }}>@интернет_магазин_цифровых_товаров</a>
          </p>
          <p style={{ fontSize: '14px', marginBottom: '8px', color: '#ccc' }}>
            💬 Время работы: Пн-Пт 10:00-20:00
          </p>
        </div>

        {/* Навигация */}
        <div>
          <h3 style={{ marginBottom: '15px', fontSize: '18px' }}>🔗 Быстрые ссылки</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/" style={{ color: '#ccc', textDecoration: 'none', fontSize: '14px' }}>Главная</Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/cart" style={{ color: '#ccc', textDecoration: 'none', fontSize: '14px' }}>Корзина</Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/profile" style={{ color: '#ccc', textDecoration: 'none', fontSize: '14px' }}>Личный кабинет</Link>
            </li>
          </ul>
        </div>

        {/* Платежные системы */}
        <div>
          <h3 style={{ marginBottom: '15px', fontSize: '18px' }}>💳 Принимаем к оплате</h3>
          <div style={{ fontSize: '24px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <span title="Visa">💳 Visa</span>
            <span title="MasterCard">💳 MasterCard</span>
            <span title="МИР">🌍 МИР</span>
            <span title="SBP">📱 СБП</span>
          </div>
        </div>
      </div>

      {/* Копирайт */}
      <div style={{
        textAlign: 'center',
        paddingTop: '20px',
        borderTop: '1px solid #444',
        fontSize: '12px',
        color: '#888'
      }}>
        <p>© {currentYear} Интернет магазин цифровых товаров. Все права защищены.</p>
        <p style={{ marginTop: '5px' }}>
          Разработано в рамках курсового проекта по дисциплине «Технология разработки программного обеспечения»
        </p>
      </div>
    </footer>
  );
};

export default Footer;
