const database = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Создать нового пользователя
  static async create({ email, password, name, city = null, bio = null }) {
    try {
      // Хешируем пароль
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const sql = `
        INSERT INTO users (email, password_hash, name, city, bio)
        VALUES (?, ?, ?, ?, ?)
      `;

      const result = await database.run(sql, [email, passwordHash, name, city, bio]);

      // Создаем initial транзакцию времени (стартовый баланс)
      const initialCredits = parseFloat(process.env.INITIAL_TIME_CREDITS) || 5.0;
      await database.run(`
        INSERT INTO time_transactions (to_user_id, hours, transaction_type, description)
        VALUES (?, ?, 'initial', 'Initial time credits')
      `, [result.lastID, initialCredits]);

      return this.findById(result.lastID);
    } catch (error) {
      throw error;
    }
  }

  // Найти пользователя по ID
  static async findById(id) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    return await database.get(sql, [id]);
  }

  // Найти пользователя по email
  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    return await database.get(sql, [email]);
  }

  // Проверить пароль
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Обновить профиль
  static async update(id, data) {
    const allowedFields = ['name', 'city', 'bio', 'avatar_url', 'occupation', 'phone', 'languages', 'first_name', 'last_name', 'patronymic', 'birth_date', 'gender'];
    const updates = [];
    const values = [];

    Object.keys(data).forEach(key => {
      if (allowedFields.includes(key) && data[key] !== undefined) {
        updates.push(`${key} = ?`);
        values.push(data[key]);
      }
    });

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(id);
    const sql = `
      UPDATE users 
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await database.run(sql, values);
    return this.findById(id);
  }

  // Обновить баланс времени
  static async updateTimeBalance(userId, amount) {
    const sql = `
      UPDATE users 
      SET time_balance = time_balance + ?
      WHERE id = ?
    `;
    await database.run(sql, [amount, userId]);
    return this.findById(userId);
  }

  // Обновить рейтинг
  static async updateRating(userId) {
    // Получаем все отзывы о пользователе
    const reviews = await database.all(`
      SELECT rating FROM reviews WHERE reviewed_user_id = ?
    `, [userId]);

    if (reviews.length === 0) {
      return;
    }

    // Вычисляем средний рейтинг
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = totalRating / reviews.length;

    // Обновляем в БД
    await database.run(`
      UPDATE users 
      SET rating = ?, total_reviews = ?
      WHERE id = ?
    `, [avgRating, reviews.length, userId]);
  }

  // Добавить навык
  static async addSkill(userId, skill) {
    const sql = 'INSERT INTO user_skills (user_id, skill) VALUES (?, ?)';
    return await database.run(sql, [userId, skill]);
  }

  // Получить навыки пользователя
  static async getSkills(userId) {
    const sql = 'SELECT * FROM user_skills WHERE user_id = ?';
    return await database.all(sql, [userId]);
  }

  // Удалить навык
  static async removeSkill(userId, skillId) {
    const sql = 'DELETE FROM user_skills WHERE id = ? AND user_id = ?';
    return await database.run(sql, [skillId, userId]);
  }

  // Обновить пароль
  static async updatePassword(id, newPassword) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    const sql = 'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    return await database.run(sql, [passwordHash, id]);
  }

  // Получить список всех пользователей (для админки или поиска)
  static async findAll(limit = 50, offset = 0) {
    const sql = `
      SELECT id, email, name, city, bio, avatar_url, rating, total_reviews, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    return await database.all(sql, [limit, offset]);
  }

  // Поиск пользователей
  static async search(query, limit = 20) {
    const sql = `
      SELECT id, name, city, bio, avatar_url, rating, total_reviews
      FROM users
      WHERE name LIKE ? OR city LIKE ? OR bio LIKE ?
      ORDER BY rating DESC
      LIMIT ?
    `;
    const searchTerm = `%${query}%`;
    return await database.all(sql, [searchTerm, searchTerm, searchTerm, limit]);
  }
}

module.exports = User;
