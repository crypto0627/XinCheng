
DROP TABLE IF EXISTS orders;
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,            -- UUID
  user_id TEXT NOT NULL,
  user_email_snapshot TEXT NOT NULL,
  total_price REAL NOT NULL,
  status TEXT CHECK(status IN ('processing', 'completed', 'cancelled')) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);