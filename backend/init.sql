
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
    'https://dlcdnwebimgs.asus.com/gain/859297d3-da9f-4807-81e8-7a2fdf14204d/w800',
    74990.00,
    'laptops'
  ),
  (
    'MSI Katana 15 B13VEK-262XRU',
    'Игровой ноутбук 15.6 дюймов, Intel Core i7, RTX 4050, 16 ГБ ОЗУ, SSD 1 ТБ, экран 144 Гц.',
    'https://picsum.photos/seed/msi-katana/600/400',
    129990.00,
    'laptops'
  ),
  (
    'Xiaomi Redmi Note 13 Pro 8/256GB',
    'Смартфон с AMOLED-экраном 120 Гц, камерой 200 МП, быстрой зарядкой и большим аккумулятором.',
    'https://picsum.photos/seed/redmi-note-13/600/400',
    29990.00,
    'phones'
  ),
  (
    'Samsung Galaxy A55 5G 8/256GB',
    'Смартфон Samsung с защитой IP67, ярким Super AMOLED-дисплеем и хорошей камерой для повседневного использования.',
    'https://picsum.photos/seed/galaxy-a55/600/400',
    45990.00,
    'phones'
  ),
  (
    'LG UltraGear 27GN800-B',
    'Игровой монитор 27 дюймов, IPS, 144 Гц, 1 мс, поддержка G-Sync и FreeSync.',
    'https://picsum.photos/seed/lg-ultragear/600/400',
    32990.00,
    'monitors'
  ),
  (
    'Samsung Odyssey G5 32"',
    'Изогнутый игровой монитор 32 дюйма, VA, 165 Гц, 1 мс, QHD-разрешение.',
    'https://picsum.photos/seed/samsung-odyssey/600/400',
    39990.00,
    'monitors'
  ),
  (
    'Logitech MX Keys S',
    'Беспроводная клавиатура с подсветкой, тихими клавишами и возможностью подключения к нескольким устройствам.',
    'https://picsum.photos/seed/mx-keys/600/400',
    12990.00,
    'accessories'
  ),
  (
    'Logitech MX Master 3S',
    'Эргономичная беспроводная мышь с точным сенсором, быстрой прокруткой и поддержкой нескольких устройств.',
    'https://picsum.photos/seed/mx-master/600/400',
    10990.00,
    'accessories'
  )
) AS t(name, description, image_url, price, category)
WHERE NOT EXISTS (SELECT 1 FROM products);
