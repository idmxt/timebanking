const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Путь к базе данных из .env
const DB_PATH = process.env.DATABASE_PATH || './database/timebank.db';

// Функция инициализации базы данных
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    // Убедимся что папка database существует
    const dbDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Создаем или открываем БД
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('❌ Error opening database:', err.message);
        reject(err);
        return;
      }
      console.log('📦 Connected to SQLite database');
    });

    // Читаем SQL схему
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Выполняем SQL схему
    db.exec(schema, (err) => {
      if (err) {
        console.error('❌ Error creating tables:', err.message);
        reject(err);
        return;
      }
      console.log('✅ Database tables created successfully');
      resolve(db);
    });
  });
};

// Функция для получения подключения к БД
const getDatabase = () => {
  return new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Error connecting to database:', err.message);
      throw err;
    }
  });
};

module.exports = {
  initDatabase,
  getDatabase
};
