import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: user?.phone || '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch('/auth/profile/', formData);
      if (updateProfile) await updateProfile(formData);
      setMessage('Профиль успешно обновлён!');
      setEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Ошибка при обновлении');
    }
  };

  if (!user) return <div className="container" style={{ minHeight: 'calc(100vh - 200px)' }}>Загрузка...</div>;

  return (
   <div className="container" style={{ maxWidth: '600px', marginTop: '50px' }}>
      <div className="card">
        <h2>👤 Личный кабинет</h2>

        {message && <div style={{ color: 'green', marginBottom: '15px' }}>{message}</div>}

        {!editing ? (
          <div>
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <h3 style={{ marginBottom: '15px', fontSize: '16px', color: '#666' }}>📋 Основная информация</h3>

              <p><strong>👤 Имя пользователя:</strong> {user.username}</p>
              <p><strong>📛 Имя:</strong> {user.first_name || '—'}</p>
              <p><strong>👪 Фамилия:</strong> {user.last_name || '—'}</p>
              <p><strong>📧 Email:</strong> {user.email}</p>
              <p><strong>📱 Телефон:</strong> {user.phone || '—'}</p>

              <p><strong>👑 Статус:</strong> {user.is_staff ? '✅ Администратор' : '👤 Пользователь'}</p>
            </div>

            <button className="btn btn-primary" onClick={() => setEditing(true)} style={{ marginTop: '20px' }}>
              ✏️ Редактировать телефон
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '15px', fontSize: '16px', color: '#666' }}>📋 Основная информация</h3>

              <div className="form-group">
                <label>Имя пользователя</label>
                <input type="text" className="form-control" value={user.username} disabled style={{ backgroundColor: '#e9ecef' }} />
              </div>

              <div className="form-group">
                <label>Имя</label>
                <input type="text" className="form-control" value={user.first_name || ''} disabled style={{ backgroundColor: '#e9ecef' }} />
              </div>

              <div className="form-group">
                <label>Фамилия</label>
                <input type="text" className="form-control" value={user.last_name || ''} disabled style={{ backgroundColor: '#e9ecef' }} />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-control" value={user.email} disabled style={{ backgroundColor: '#e9ecef' }} />
              </div>

              <div className="form-group">
                <label>Телефон</label>
                <input type="tel" name="phone" className="form-control" placeholder="Телефон" value={formData.phone} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Статус</label>
                <input type="text" className="form-control" value={user.is_staff ? 'Администратор' : 'Пользователь'} disabled style={{ backgroundColor: '#e9ecef' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="submit" className="btn btn-primary">💾 Сохранить</button>
              <button type="button" className="btn" onClick={() => setEditing(false)}>❌ Отмена</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;