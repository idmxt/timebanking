-- ===========================================
-- TIMEBANK PLATFORM DATABASE SCHEMA
-- ===========================================

-- Пользователи
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  city TEXT,
  bio TEXT,
  occupation TEXT,           -- Профессия/заголовок
  phone TEXT,                -- Телефон
  languages TEXT,            -- Языки
  first_name TEXT,           -- Имя
  last_name TEXT,            -- Фамилия
  patronymic TEXT,           -- Отчество
  birth_date DATE,           -- Дата рождения
  gender TEXT,               -- Пол
  time_balance REAL DEFAULT 5.0,
  rating REAL DEFAULT 0,           -- Средний рейтинг
  total_reviews INTEGER DEFAULT 0, -- Количество отзывов
  role TEXT DEFAULT 'user',        -- 'user', 'admin'
  status TEXT DEFAULT 'active',    -- 'active', 'blocked'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Навыки пользователя (что может предложить)
CREATE TABLE IF NOT EXISTS user_skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  skill TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Услуги/предложения
CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,              -- Кто предлагает
  title TEXT NOT NULL,                   -- Название услуги
  description TEXT,                      -- Подробное описание
  category TEXT NOT NULL,                -- Категория
  duration REAL NOT NULL,                -- Длительность в часах
  location_type TEXT NOT NULL,           -- 'online' или 'offline'
  address TEXT,                          -- Адрес для offline
  city TEXT,                             -- Город
  image_url TEXT,                        -- Фото услуги
  is_active BOOLEAN DEFAULT 1,           -- Активна ли услуга (скрыта пользователем)
  moderation_status TEXT DEFAULT 'approved', -- 'pending', 'approved', 'rejected'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Расписание доступности услуги
CREATE TABLE IF NOT EXISTS availability (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  service_id INTEGER NOT NULL,
  day_of_week INTEGER,      -- 0=Понедельник, 6=Воскресенье, NULL=любой день
  start_time TEXT,          -- Формат 'HH:MM'
  end_time TEXT,            -- Формат 'HH:MM'
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- Бронирования
CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  service_id INTEGER NOT NULL,
  requester_id INTEGER NOT NULL,         -- Кто запрашивает
  provider_id INTEGER NOT NULL,          -- Кто предоставляет
  booking_date DATE NOT NULL,            -- Дата встречи
  booking_time TIME NOT NULL,            -- Время встречи
  duration REAL NOT NULL,                -- Длительность в часах
  status TEXT DEFAULT 'pending',         -- pending, accepted, declined, completed, cancelled
  message TEXT,                          -- Сообщение от requester
  requester_confirmed BOOLEAN DEFAULT 0, -- Подтвердил ли получатель выполнение
  provider_confirmed BOOLEAN DEFAULT 0,  -- Подтвердил ли исполнитель
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Транзакции времени
CREATE TABLE IF NOT EXISTS time_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_user_id INTEGER,                  -- От кого (NULL для бонусов)
  to_user_id INTEGER NOT NULL,           -- Кому
  hours REAL NOT NULL,                   -- Количество часов (+/-)
  booking_id INTEGER,                    -- Связь с бронированием
  transaction_type TEXT NOT NULL,        -- 'service', 'bonus', 'refund', 'initial'
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
);

-- Сообщения
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id INTEGER NOT NULL,
  receiver_id INTEGER NOT NULL,
  booking_id INTEGER,                    -- Контекст беседы (опционально)
  content TEXT NOT NULL,
  attachment_url TEXT,
  attachment_type TEXT,                -- 'image', 'file'
  is_read BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
);

-- Отзывы
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id INTEGER NOT NULL,
  reviewer_id INTEGER NOT NULL,          -- Кто оставил отзыв
  reviewed_user_id INTEGER NOT NULL,     -- О ком отзыв
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(booking_id, reviewer_id)        -- Один отзыв на бронирование от одного user
);

-- Уведомления
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL,                    -- 'booking_request', 'booking_accepted', 'message', etc.
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,                             -- Ссылка на связанный объект
  is_read BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Избранное
CREATE TABLE IF NOT EXISTS favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  service_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  UNIQUE(user_id, service_id)
);

-- ===========================================
-- ИНДЕКСЫ ДЛЯ ПРОИЗВОДИТЕЛЬНОСТИ
-- ===========================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_services_user ON services(user_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_city ON services(city);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_bookings_requester ON bookings(requester_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider ON bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_time_transactions_user ON time_transactions(to_user_id);
