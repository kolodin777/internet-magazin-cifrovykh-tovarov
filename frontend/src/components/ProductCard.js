import React from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';

const ProductCard = ({ product }) => (
  <div className="card">
    <h3>{product.title}</h3>
    <p>Цена: {product.price} руб.</p>
    <p>Автор: {product.author_name}</p>
    <p>Категория: {product.category_title}</p>
    <p>Комментарии: {product.comment_count || 0}</p>
    <div className="card-actions">
      <FavoriteButton product={product} />
      <Link to={`/product/${product.id}`} className="btn">Подробнее</Link>
    </div>
  </div>
);

export default ProductCard;
