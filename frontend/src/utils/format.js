cat > frontend/src/utils/format.js <<'EOF'
export const CATEGORY_OPTIONS = [
  { value: 'all', label: 'Все категории' },
  { value: 'laptops', label: 'Ноутбуки' },
  { value: 'phones', label: 'Смартфоны' },
  { value: 'monitors', label: 'Мониторы' },
  { value: 'accessories', label: 'Аксессуары' },
  { value: 'other', label: 'Другое' },
];

const CATEGORY_LABELS = Object.fromEntries(
  CATEGORY_OPTIONS
    .filter((item) => item.value !== 'all')
    .map((item) => [item.value, item.label])
);

export function getCategoryLabel(category) {
  return CATEGORY_LABELS[category] || category || 'Другое';
}

export function formatPrice(value) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}
EOF