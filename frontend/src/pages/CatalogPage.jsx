
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { deleteProduct, getProducts } from '../api.js';
import { CATEGORY_OPTIONS } from '../utils/format.js';

const DEFAULT_FILTERS = {
  q: '',
  category: 'all',
  sort: 'created_at',
  order: 'desc',
};

const SORT_OPTIONS = [
  { value: 'created_at', label: 'По дате добавления' },
  { value: 'name', label: 'По названию' },
  { value: 'price', label: 'По цене' },
];

const ORDER_OPTIONS = [
  { value: 'desc', label: 'по убыванию' },
  { value: 'asc', label: 'по возрастанию' },
];

export default function CatalogPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError('');

    const delay = filters.q.trim() ? 300 : 0;

    const timer = setTimeout(async () => {
      try {
        const data = await getProducts(filters);

        if (active) {
          setProducts(data);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Не удалось загрузить товары');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }, delay);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [filters]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(`Удалить товар «${product.name}»?`);

    if (!confirmed) return;

    setDeletingId(product.id);

    try {
      await deleteProduct(product.id);

      setProducts((prev) => prev.filter((item) => item.id !== product.id));
    } catch (err) {
      window.alert(err.message || 'Не удалось удалить товар');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Каталог компьютерной техники</h1>
          <p className="muted">
            Товары загружаются из PostgreSQL через Express API.
          </p>
        </div>

        <Link to="/products/new" className="button">
          Добавить товар
        </Link>
      </div>

      <div className="toolbar">
        <input
          className="input"
          type="search"
          placeholder="Поиск по названию или описанию"
          value={filters.q}
          onChange={(event) => updateFilter('q', event.target.value)}
        />

        <select
          className="select"
          value={filters.category}
          onChange={(event) => updateFilter('category', event.target.value)}
        >
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          className="select"
          value={filters.sort}
          onChange={(event) => updateFilter('sort', event.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          className="select"
          value={filters.order}
          onChange={(event) => updateFilter('order', event.target.value)}
        >
          {ORDER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button type="button" className="button secondary" onClick={resetFilters}>
          Сбросить
        </button>
      </div>

      {error && <div className="alert error">{error}</div>}

      {loading ? (
        <div className="state-box">Загрузка товаров...</div>
      ) : products.length === 0 ? (
        <div className="state-box">
          Ничего не найдено. Добавьте товар или измените фильтры.
        </div>
      ) : (
        <div className="grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleDelete}
              deletingId={deletingId}
            />
          ))}
        </div>
      )}
    </section>
  );
}
