
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  category VARCHAR(100) NOT NULL DEFAULT 'other',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

INSERT INTO products (name, description, image_url, price, category)
SELECT name, description, image_url, price, category
FROM (VALUES
  (
    'ASUS Vivobook 15 X1505ZA-EJ423',
    'Ноутбук 15.6 дюймов, Intel Core i5, 16 ГБ ОЗУ, SSD 512 ГБ, IPS-экран, подходит для работы и учебы.',
    'https://avatars.mds.yandex.net/get-mpic/17775441/2a0000019d2a5d5790f0e00b401634846486/orig',
    74990.00,
    'laptops'
  ),
  (
    'MSI Katana 15 B13VEK-262XRU',
    'Игровой ноутбук 15.6 дюймов, Intel Core i7, RTX 4050, 16 ГБ ОЗУ, SSD 1 ТБ, экран 144 Гц.',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbw_YY8yGhFillYX15UxcJUagzP3tFIAuJYyEfuz6BGg&s=10',
    129990.00,
    'laptops'
  ),
  (
    'Xiaomi Redmi Note 13 Pro 8/256GB',
    'Смартфон с AMOLED-экраном 120 Гц, камерой 200 МП, быстрой зарядкой и большим аккумулятором.',
    'https://img.mvideo.ru/product-medias/photos/400257981/247c72d0-a23a-440d-83a9-310bd9a39282.jpg',
    29990.00,
    'phones'
  ),
  (
    'Samsung Galaxy A55 5G 8/256GB',
    'Смартфон Samsung с защитой IP67, ярким Super AMOLED-дисплеем и хорошей камерой для повседневного использования.',
    'https://techmart.ru/image/cache/catalog/samsung/Galaxy%20A55/dark%20blue/galaxy-a55-dark-blue-840x840.jpg',
    45990.00,
    'phones'
  ),
  (
    'LG UltraGear 27GN800-B',
    'Игровой монитор 27 дюймов, IPS, 144 Гц, 1 мс, поддержка G-Sync и FreeSync.',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWcfDgd0fRqQ-lhJd7J2zmoj6PuGiHwJusRhBD5FV2ZR2D26lNGkG_N78&s=10',
    32990.00,
    'monitors'
  ),
  (
    'Samsung Odyssey G5 32"',
    'Изогнутый игровой монитор 32 дюйма, VA, 165 Гц, 1 мс, QHD-разрешение.',
    'https://images.samsung.com/is/image/samsung/ru-odyssey-g5-g95t-lc32g54tqwixci-frontblack-317543929?$624_624_PNG$',
    39990.00,
    'monitors'
  ),
  (
    'Logitech MX Keys S',
    'Беспроводная клавиатура с подсветкой, тихими клавишами и возможностью подключения к нескольким устройствам.',
    'https://img-artline.ams3.cdn.digitaloceanspaces.com/images/editor/editor_1789198228691803_0.webp',
    12990.00,
    'accessories'
  ),
  (
    'Logitech MX Master 3S',
    'Эргономичная беспроводная мышь с точным сенсором, быстрой прокруткой и поддержкой нескольких устройств.',
    'https://cmstore.ru/upload/resize_cache/iblock/616/457_457_1/xvze2cu26r756pwya69letmsidapiw8y.png',
    10990.00,
    'accessories'
  )
) AS t(name, description, image_url, price, category)
WHERE NOT EXISTS (SELECT 1 FROM products);
