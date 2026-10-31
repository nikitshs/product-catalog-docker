
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteProduct, getProduct } from '../api.js';
import { formatPrice, getCategoryLabel } from '../utils/format.js';

const FALLBACK_IMAGE = 'https://picsum.photos/seed/placeholder/600/400';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError('');

    getProduct(id)
      .then((data) => {
        if (active) {
          setProduct(data);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || 'Не удалось загрузить товар');
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handleDelete = async () => {
    if (!product) return;

    const confirmed = window.confirm(`Удалить товар «${product.name}»?`);

    if (!confirmed) return;

    setDeleting(true);

    try {
      await deleteProduct(product.id);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Не удалось удалить товар');
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="state-box">Загрузка товара...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert error">{error}</div>
        <Link to="/" className="button secondary">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  if (!product) {
    return <div className="state-box">Товар не найден</div>;
  }

  return (
    <section className="product-detail">
      <div className="product-image">
        <img
          src={product.imageUrl || FALLBACK_IMAGE}
          alt={product.name}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
      </div>

      <div className="product-info">
        <span className="badge" style={{position:'static', marginBottom:'12px'}}>{getCategoryLabel(product.category)}</span>

        <h1 className="detail-title">{product.name}</h1>

        <div className="detail-price">{formatPrice(product.price)}</div>

        <p className="detail-description">
          {product.description || 'Описание отсутствует.'}
        </p>

        <p className="muted" style={{fontSize:'0.9rem'}}>
          Добавлен:{' '}
          {new Date(product.createdAt).toLocaleString('ru-RU')}
        </p>

        <div className="card-actions" style={{marginTop:'24px'}}>
          <Link to="/" className="button secondary">
            ← В каталог
          </Link>

          <button
            type="button"
            className="button danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Удаление...' : 'Удалить товар'}
          </button>
        </div>
      </div>
    </section>
  );
}
