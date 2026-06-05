import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], total_price: 0, total_items: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [], total_price: 0, total_items: 0 });
      setLoading(false);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart/my_cart/');
      console.log('Cart data:', response.data);
      setCart(response.data);
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await api.post('/cart/add_item/', { product_id: productId, quantity });
      await fetchCart();
      return true;
    } catch (error) {
      console.error('Ошибка добавления в корзину:', error);
      return false;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      await api.post('/cart/update_item/', { item_id: itemId, quantity });
      await fetchCart();
    } catch (error) {
      console.error('Ошибка обновления:', error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await api.post('/cart/remove_item/', { item_id: itemId });
      await fetchCart();
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  };

  const clearCart = async () => {
    try {
      await api.post('/cart/clear_cart/');
      await fetchCart();
    } catch (error) {
      console.error('Ошибка очистки:', error);
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};