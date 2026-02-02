const database = require('../config/database');

class Service {
  // Создать услугу
  static async create(serviceData) {
    const {
      user_id,
      title,
      description,
      category,
      duration,
      location_type,
      address,
      city,
      image_url
    } = serviceData;

    const sql = `
      INSERT INTO services 
      (user_id, title, description, category, duration, location_type, address, city, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await database.run(sql, [
      user_id, title, description, category, duration,
      location_type, address, city, image_url
    ]);

    return this.findById(result.lastID);
  }

  // Найти услугу по ID с информацией о пользователе
  static async findById(id, userId = null) {
    const sql = `
      SELECT 
        s.*,
        u.id as provider_id,
        u.name as provider_name,
        u.avatar_url as provider_avatar,
        u.rating as provider_rating,
        u.total_reviews as provider_total_reviews,
        CASE WHEN f.id IS NOT NULL THEN 1 ELSE 0 END as is_favorited
      FROM services s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN favorites f ON s.id = f.service_id AND f.user_id = ?
      WHERE s.id = ?
    `;
    return await database.get(sql, [userId, id]);
  }

  // Получить все услуги с фильтрами
  static async findAll(filters = {}, limit = 20, offset = 0) {
    let sql = `
      SELECT 
        s.*,
        u.name as provider_name,
        u.avatar_url as provider_avatar,
        u.rating as provider_rating
      FROM services s
      JOIN users u ON s.user_id = u.id
      WHERE s.is_active = 1
    `;
    const params = [];

    // Фильтр по категории
    if (filters.category) {
      sql += ' AND s.category = ?';
      params.push(filters.category);
    }

    // Фильтр по городу
    if (filters.city) {
      sql += ' AND s.city = ?';
      params.push(filters.city);
    }

    // Фильтр по типу локации
    if (filters.location_type) {
      sql += ' AND s.location_type = ?';
      params.push(filters.location_type);
    }

    // Фильтр по рейтингу
    if (filters.min_rating) {
      sql += ' AND u.rating >= ?';
      params.push(parseFloat(filters.min_rating));
    }

    // Поиск по названию/описанию/имени провайдера
    if (filters.search) {
      sql += ' AND (s.title LIKE ? OR s.description LIKE ? OR u.name LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Сортировка
    let orderBy = 's.created_at DESC';
    if (filters.sort) {
      switch (filters.sort) {
        case 'rating_desc': orderBy = 'u.rating DESC'; break;
        case 'rating_asc': orderBy = 'u.rating ASC'; break;
        case 'duration_desc': orderBy = 's.duration DESC'; break;
        case 'duration_asc': orderBy = 's.duration ASC'; break;
        case 'newest': orderBy = 's.created_at DESC'; break;
        case 'oldest': orderBy = 's.created_at ASC'; break;
      }
    }

    sql += ` ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    return await database.all(sql, params);
  }

  // Получить услуги пользователя
  static async findByUserId(userId) {
    const sql = `
      SELECT * FROM services
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;
    return await database.all(sql, [userId]);
  }

  // Обновить услугу
  static async update(id, userId, data) {
    const allowedFields = [
      'title', 'description', 'category', 'duration',
      'location_type', 'address', 'city', 'image_url', 'is_active'
    ];

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

    values.push(id, userId);
    const sql = `
      UPDATE services
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `;

    const result = await database.run(sql, values);

    if (result.changes === 0) {
      throw new Error('Service not found or you are not the owner');
    }

    return this.findById(id);
  }

  // Удалить услугу
  static async delete(id, userId) {
    const sql = 'DELETE FROM services WHERE id = ? AND user_id = ?';
    const result = await database.run(sql, [id, userId]);

    if (result.changes === 0) {
      throw new Error('Service not found or you are not the owner');
    }

    return result;
  }

  // Получить доступность услуги
  static async getAvailability(serviceId) {
    const sql = 'SELECT * FROM availability WHERE service_id = ?';
    return await database.all(sql, [serviceId]);
  }

  // Добавить слот доступности
  static async addAvailability(serviceId, dayOfWeek, startTime, endTime) {
    const sql = `
      INSERT INTO availability (service_id, day_of_week, start_time, end_time)
      VALUES (?, ?, ?, ?)
    `;
    return await database.run(sql, [serviceId, dayOfWeek, startTime, endTime]);
  }

  // Получить категории (уникальные значения)
  static async getCategories() {
    const sql = 'SELECT DISTINCT category FROM services WHERE is_active = 1 ORDER BY category';
    const rows = await database.all(sql);
    return rows.map(row => row.category);
  }

  // Получить города
  static async getCities() {
    const sql = 'SELECT DISTINCT city FROM services WHERE is_active = 1 AND city IS NOT NULL ORDER BY city';
    const rows = await database.all(sql);
    return rows.map(row => row.city);
  }
}

module.exports = Service;
