import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateProduct from './pages/CreateProduct';
import EditProduct from './pages/EditProduct';
import MyProducts from './pages/MyProducts';
import MyOrders from './pages/MyOrders';
import MyFavorites from './pages/MyFavorites';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/create-product" element={
                <PrivateRoute>
                  <CreateProduct />
                </PrivateRoute>
              } />
              <Route path="/edit-product/:id" element={
                <PrivateRoute>
                  <EditProduct />
                </PrivateRoute>
              } />
              <Route path="/my-products" element={
                <PrivateRoute>
                  <MyProducts />
                </PrivateRoute>
              } />
              <Route path="/my-orders" element={
                <PrivateRoute>
                  <MyOrders />
                </PrivateRoute>
              } />
              <Route path="/favorites" element={
                <PrivateRoute>
                  <MyFavorites />
                </PrivateRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
