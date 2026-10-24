cat > README.md <<'EOF'
# Каталог товаров: React + Vite, Express, PostgreSQL, Docker Compose

Учебное полнофункциональное веб-приложение: каталог компьютерной техники.

## Стек технологий

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL
- API: REST, JSON
- Containerization: Docker + Docker Compose

## Возможности

- Отображение каталога товаров в виде карточек.
- Каждая карточка содержит:
  - название;
  - описание;
  - изображение;
  - цену.
- Добавление товара через API и веб-форму.
- Удаление товара через API.
- Поиск по названию и описанию.
- Фильтрация по категории.
- Сортировка по дате, названию и цене.
- Отдельная страница товара.
- Данные хранятся в PostgreSQL и загружаются через Express API.
- Возможность добавить товар напрямую в базу данных и увидеть его после обновления страницы.

## Быстрый запуск

Требуется установленные:

- Docker
- Docker Compose v2

Выполни в корне проекта:

    docker compose up --build

После запуска открой браузер:

    http://localhost:8080

API доступно:

    http://localhost:8080/api

или напрямую:

    http://localhost:5000/api

## Остановка проекта

    docker compose down

Полный сброс с удалением данных базы:

    docker compose down -v

## Проверка API

Health check:

    curl http://localhost:8080/api/health

Список товаров:

    curl http://localhost:8080/api/products

Добавление товара:

    curl -X POST http://localhost:8080/api/products -H "Content-Type: application/json" -d '{"name":"Test SSD","description":"Fast drive","imageUrl":"https://picsum.photos/seed/test-ssd/600/400","price":8990,"category":"accessories"}'

Удаление товара:

    curl -X DELETE http://localhost:8080/api/products/1

## Добавление товара напрямую в базу данных

Войди в PostgreSQL:

    docker compose exec db psql -U catalog_user -d catalog_db

Выполни SQL:

    INSERT INTO products (name, description, image_url, price, category)
    VALUES (
      'Товар от преподавателя',
      'Добавлен напрямую в PostgreSQL.',
      'https://picsum.photos/seed/teacher-product/600/400',
      12345.67,
      'accessories'
    );

После этого обнови страницу:

    http://localhost:8080

## Архитектура взаимодействия

1. Браузер открывает http://localhost:8080.
2. Контейнер web отвечает за статику React-приложения через Nginx.
3. React выполняет fetch-запросы к /api/...
4. Nginx проксирует запросы /api/... в контейнер api на порт 5000.
5. Express обрабатывает HTTP-запросы.
6. Express через драйвер pg выполняет SQL-запросы к PostgreSQL.
7. PostgreSQL возвращает данные.
8. Express отдает JSON.
9. React отображает карточки товаров.
EOF