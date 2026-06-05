import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [tempPriceMin, setTempPriceMin] = useState('');
  const [tempPriceMax, setTempPriceMax] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const params = useMemo(() => ({
    page,
    page_size: pageSize,
    search: debouncedSearch || undefined,
    category: selectedCategory || undefined,
    price_min: priceMin || undefined,
    price_max: priceMax || undefined,
  }), [debouncedSearch, page, pageSize, priceMax, priceMin, selectedCategory]);

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories/');
      return response.data.results || response.data;
    },
  });

  const productsQuery = useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const response = await api.get('/products/', { params });
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const resetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setSelectedCategory('');
    setTempPriceMin('');
    setTempPriceMax('');
    setPriceMin('');
    setPriceMax('');
    setPage(1);
  };

  const products = productsQuery.data?.results || [];
  const categories = categoriesQuery.data || [];
  const totalPages = Math.max(1, Math.ceil((productsQuery.data?.count || 0) / pageSize));

  return (
    <div className="container">
      <h1 className="page-title">Каталог цифровых товаров</h1>

      <div className="catalog-toolbar">
        <input
          type="search"
          className="form-control"
          placeholder="Поиск по названию и описанию"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
        <select
          className="form-control page-size"
          value={pageSize}
          onChange={(event) => {
            setPageSize(Number(event.target.value));
            setPage(1);
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
        <button className="btn" onClick={() => setShowFilters((value) => !value)}>
          {showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <select
            className="form-control"
            value={selectedCategory}
            onChange={(event) => {
              setSelectedCategory(event.target.value);
              setPage(1);
            }}
          >
            <option value="">Все категории</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.title}</option>
            ))}
          </select>
          <input
            type="number"
            className="form-control"
            placeholder="Цена от"
            min="0"
            value={tempPriceMin}
            onChange={(event) => setTempPriceMin(event.target.value)}
          />
          <input
            type="number"
            className="form-control"
            placeholder="Цена до"
            min="0"
            value={tempPriceMax}
            onChange={(event) => setTempPriceMax(event.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={() => {
              setPriceMin(tempPriceMin);
              setPriceMax(tempPriceMax);
              setPage(1);
            }}
          >
            Применить
          </button>
          <button className="btn btn-danger" onClick={resetFilters}>Сбросить</button>
        </div>
      )}

      {productsQuery.isLoading ? (
        <p>Загрузка...</p>
      ) : productsQuery.isError ? (
        <p className="error">Не удалось загрузить каталог.</p>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <p>Товары не найдены.</p>
          <button className="btn" onClick={resetFilters}>Сбросить фильтры</button>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
          <div className="pagination">
            <button className="btn" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>
              Назад
            </button>
            <span>Страница {page} из {totalPages}</span>
            <button
              className="btn"
              disabled={page >= totalPages}
              onClick={() => setPage((value) => value + 1)}
            >
              Вперёд
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
