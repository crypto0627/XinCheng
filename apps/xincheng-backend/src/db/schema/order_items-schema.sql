DROP TABLE IF EXISTS order_items;
CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,            -- UUID
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_name_snapshot TEXT NOT NULL,
  price_snapshot REAL NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
