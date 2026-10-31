
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createProduct } from '../api.js';
import { CATEGORY_OPTIONS } from '../utils/format.js';

const CATEGORY_SELECT_OPTIONS = CATEGORY_OPTIONS.filter(
  (option) => option.value !== 'all'
);

export default function CreateProductPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    description: '',
    imageUrl: '',
    price: '',
    category: 'laptops',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = 'Укажите название товара';
    }

    const priceValue = Number(form.price);

    if (form.price === '' || Number.isNaN(priceValue) || priceValue < 0) {
      nextErrors.price = 'Укажите корректную цену';
    }

    if (!form.category) {
      nextErrors.category = 'Выберите категорию';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const created = await createProduct({
        name: form.name.trim(),
        description: form.description.trim(),
        imageUrl: form.imageUrl.trim(),
        price: priceValue,
        category: form.category,
      });

      navigate(`/products/${created.id}`);
    } catch (err) {
      setErrors({
        submit: err.message || 'Не удалось добавить товар',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="form-card">
      <h1>Добавление товара</h1>

      {errors.submit && <div className="alert error">{errors.submit}</div>}

      <form onSubmit={handleSubmit} className="form-grid" noValidate>
        <div>
          <label htmlFor="name">Название товара *</label>
          <input
            id="name"
            name="name"
            className="input"
            value={form.name}
            onChange={handleChange}
            placeholder="Например: Игровой ноутбук ASUS"
          />
          {errors.name && <div className="error-text">{errors.name}</div>}
        </div>

        <div className="form-row">
          <div>
            <label htmlFor="category">Категория *</label>
            <select
              id="category"
              name="category"
              className="select"
              value={form.category}
              onChange={handleChange}
            >
              {CATEGORY_SELECT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <div className="error-text">{errors.category}</div>
            )}
          </div>

          <div>
            <label htmlFor="price">Цена, ₽ *</label>
            <input
              id="price"
              name="price"
              className="input"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              placeholder="9990"
            />
            {errors.price && <div className="error-text">{errors.price}</div>}
          </div>
        </div>

        <div>
          <label htmlFor="imageUrl">Ссылка на изображение</label>
          <input
            id="imageUrl"
            name="imageUrl"
            className="input"
            type="url"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
          <div className="help">
            Можно использовать любую прямую ссылку на картинку.
          </div>
        </div>

        <div>
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            name="description"
            className="textarea"
            rows="5"
            value={form.description}
            onChange={handleChange}
            placeholder="Краткое описание товара"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Сохранение...' : 'Добавить товар'}
          </button>

          <Link to="/" className="button secondary">
            Отмена
          </Link>
        </div>
      </form>
    </section>
  );
}
