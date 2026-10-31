
import { Link } from 'react-router-dom';
import { formatPrice, getCategoryLabel } from '../utils/format.js';

const FALLBACK_IMAGE = 'https://picsum.photos/seed/placeholder/600/400';

export default function ProductCard({ product, onDelete, deletingId }) {
  const isDeleting = deletingId === product.id;

  return (
    <article className="card">
      <div className="card-image">
        <img
          src={product.imageUrl || FALLBACK_IMAGE}
          alt={product.name}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
        {/* Badge теперь позиционируется абсолютно поверх картинки благодаря CSS */}
        <span className="badge">{getCategoryLabel(product.category)}</span>
      </div>

      <div className="card-body">
        <h2 className="card-title">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h2>

        <p className="card-desc">
          {product.description || 'Описание отсутствует'}
        </p>

        <div className="card-price">{formatPrice(product.price)}</div>

        <div className="card-actions">
          <Link className="button primary small" to={`/products/${product.id}`}>
            Подробнее
          </Link>

          <button
            type="button"
            className="button danger small"
            disabled={isDeleting}
            onClick={() => onDelete(product)}
          >
            {isDeleting ? '...' : 'Удалить'}
          </button>
        </div>
      </div>
    </article>
  );
}
