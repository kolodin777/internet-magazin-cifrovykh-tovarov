import React, { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api, { API_URL } from '../services/api';

const getWebSocketUrl = (productId, token) => {
  const apiUrl = new URL(API_URL);
  const protocol = apiUrl.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${apiUrl.host}/ws/products/${productId}/comments/?token=${encodeURIComponent(token)}`;
};

const ProductComments = ({ productId }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const socketRef = useRef(null);
  const [text, setText] = useState('');
  const [connectionState, setConnectionState] = useState('offline');
  const queryKey = ['comments', String(productId)];

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await api.get(`/comments/?product=${productId}&page_size=100`);
      return response.data.results || response.data;
    },
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!user || !token) return undefined;

    const socket = new WebSocket(getWebSocketUrl(productId, token));
    socketRef.current = socket;
    socket.onopen = () => setConnectionState('online');
    socket.onclose = () => setConnectionState('offline');
    socket.onerror = () => setConnectionState('error');
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type !== 'comment') return;

      queryClient.setQueryData(queryKey, (comments = []) => {
        const incoming = message.comment;
        const optimisticIndex = comments.findIndex(
          (comment) => comment.client_id && comment.client_id === incoming.client_id,
        );
        if (optimisticIndex >= 0) {
          return comments.map((comment, index) => (index === optimisticIndex ? incoming : comment));
        }
        if (comments.some((comment) => comment.id === incoming.id)) return comments;
        return [...comments, incoming];
      });
      queryClient.invalidateQueries({ queryKey: ['product', String(productId)] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    };

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [productId, queryClient, user]);

  const submitComment = (event) => {
    event.preventDefault();
    const value = text.trim();
    if (!value || socketRef.current?.readyState !== WebSocket.OPEN) return;

    const clientId = `${Date.now()}-${Math.random()}`;
    const optimisticComment = {
      id: clientId,
      client_id: clientId,
      product: Number(productId),
      username: user.username,
      text: value,
      created_at: new Date().toISOString(),
      optimistic: true,
    };
    queryClient.setQueryData(queryKey, (comments = []) => [...comments, optimisticComment]);
    socketRef.current.send(JSON.stringify({ type: 'comment', text: value, client_id: clientId }));
    setText('');
  };

  const comments = data || [];

  return (
    <section className="comments-section">
      <div className="comments-heading">
        <h2>Комментарии ({comments.length})</h2>
        {user && <span className={`connection-status ${connectionState}`}>{connectionState}</span>}
      </div>

      {user ? (
        <form onSubmit={submitComment} className="comment-form">
          <textarea
            className="form-control"
            value={text}
            onChange={(event) => setText(event.target.value)}
            maxLength={1000}
            placeholder="Напишите комментарий"
          />
          <button className="btn btn-primary" disabled={!text.trim() || connectionState !== 'online'}>
            Отправить
          </button>
        </form>
      ) : (
        <p>Чтобы комментировать, <Link to="/login">войдите</Link>.</p>
      )}

      {isLoading ? (
        <p>Загрузка комментариев...</p>
      ) : comments.length === 0 ? (
        <p>Комментариев пока нет.</p>
      ) : (
        <div className="comments-list">
          {comments.map((comment) => (
            <article key={comment.id} className={comment.optimistic ? 'comment optimistic' : 'comment'}>
              <strong>{comment.username}</strong>
              <time>{new Date(comment.created_at).toLocaleString('ru-RU')}</time>
              <p>{comment.text}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductComments;
