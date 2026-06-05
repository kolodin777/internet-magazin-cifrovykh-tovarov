import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const updateProduct = (product, productId, changes) => {
  if (!product || Number(product.id) !== Number(productId)) return product;
  return { ...product, ...changes };
};

const updateCache = (data, productId, changes) => {
  if (!data) return data;
  if (Array.isArray(data)) return data.map((item) => updateProduct(item, productId, changes));
  if (Array.isArray(data.results)) {
    return { ...data, results: data.results.map((item) => updateProduct(item, productId, changes)) };
  }
  return updateProduct(data, productId, changes);
};

const FavoriteButton = ({ product }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => api.post(`/products/${product.id}/favorite/`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      await queryClient.cancelQueries({ queryKey: ['product', String(product.id)] });
      const previousLists = queryClient.getQueriesData({ queryKey: ['products'] });
      const previousDetail = queryClient.getQueryData(['product', String(product.id)]);
      const changes = {
        is_favorite: !product.is_favorite,
        favorite_count: Math.max(0, (product.favorite_count || 0) + (product.is_favorite ? -1 : 1)),
      };

      queryClient.setQueriesData(
        { queryKey: ['products'] },
        (data) => updateCache(data, product.id, changes),
      );
      queryClient.setQueryData(
        ['product', String(product.id)],
        (data) => updateCache(data, product.id, changes),
      );
      return { previousLists, previousDetail };
    },
    onError: (_error, _variables, context) => {
      context?.previousLists.forEach(([key, data]) => queryClient.setQueryData(key, data));
      queryClient.setQueryData(['product', String(product.id)], context?.previousDetail);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', String(product.id)] });
    },
  });

  const handleClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    mutation.mutate();
  };

  return (
    <button
      type="button"
      className={`btn ${product.is_favorite ? 'btn-danger' : ''}`}
      onClick={handleClick}
      disabled={mutation.isPending}
      aria-pressed={product.is_favorite}
    >
      {product.is_favorite ? 'В избранном' : 'В избранное'} ({product.favorite_count || 0})
    </button>
  );
};

export default FavoriteButton;
