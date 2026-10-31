
import { Routes, Route, Link } from 'react-router-dom';
import CatalogPage from './pages/CatalogPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import CreateProductPage from './pages/CreateProductPage.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            DNS
          </Link>

          <nav>
            <Link to="/">Каталог</Link>
            <Link to="/products/new" className="button primary">
                Добавить товар
            </Link>
          </nav>
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/products/new" element={<CreateProductPage />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="*" element={<div className="state-box">Страница не найдена</div>} />
        </Routes>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>Учебный проект: React + Vite, Express, PostgreSQL, Docker Compose.</p>
        </div>
      </footer>
    </div>
  );
}
