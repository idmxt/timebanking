const database = require('../config/database');

class Booking {
  // Создать бронирование
  static async create(bookingData) {
    const {
      service_id,
      requester_id,
      provider_id,
      booking_date,
      booking_time,
      duration,
      message
    } = bookingData;

    const sql = `
      INSERT INTO bookings 
      (service_id, requester_id, provider_id, booking_date, booking_time, duration, message)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await database.run(sql, [
      service_id, requester_id, provider_id,
      booking_date, booking_time, duration, message
    ]);

    return this.findById(result.lastID);
  }

  // Найти бронирование по ID
  static async findById(id) {
    const sql = `
      SELECT 
        b.*,
        s.title as service_title,
        s.description as service_description,
        s.category as service_category,
        requester.name as requester_name,
        requester.avatar_url as requester_avatar,
        provider.name as provider_name,
        provider.avatar_url as provider_avatar
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN users requester ON b.requester_id = requester.id
      JOIN users provider ON b.provider_id = provider.id
      WHERE b.id = ?
    `;
    return await database.get(sql, [id]);
  }

  // Получить бронирования пользователя
  static async findByUserId(userId, role = null) {
    let sql = `
      SELECT 
        b.*,
        s.title as service_title,
        s.category as service_category,
        requester.name as requester_name,
        requester.avatar_url as requester_avatar,
        provider.name as provider_name,
        provider.avatar_url as provider_avatar
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN users requester ON b.requester_id = requester.id
      JOIN users provider ON b.provider_id = provider.id
      WHERE 
    `;

    const params = [];

    if (role === 'requester') {
      sql += 'b.requester_id = ?';
      params.push(userId);
    } else if (role === 'provider') {
      sql += 'b.provider_id = ?';
      params.push(userId);
    } else {
      sql += '(b.requester_id = ? OR b.provider_id = ?)';
      params.push(userId, userId);
    }

    sql += ' ORDER BY b.created_at DESC';
    return await database.all(sql, params);
  }

  // Обновить статус
  static async updateStatus(id, status, userId) {
    // Проверяем что пользователь участвует в бронировании
    const booking = await this.findById(id);
    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.requester_id !== userId && booking.provider_id !== userId) {
      throw new Error('Unauthorized');
    }

    const sql = `
      UPDATE bookings
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await database.run(sql, [status, id]);
    return this.findById(id);
  }

  // Подтвердить выполнение
  static async confirmCompletion(id, userId) {
    const booking = await this.findById(id);
    if (!booking) {
      throw new Error('Booking not found');
    }

    let field;
    if (booking.requester_id === userId) {
      field = 'requester_confirmed';
    } else if (booking.provider_id === userId) {
      field = 'provider_confirmed';
    } else {
      throw new Error('Unauthorized');
    }

    const sql = `
      UPDATE bookings
      SET ${field} = 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await database.run(sql, [id]);
    return this.findById(id);
  }
}

module.exports = Booking;
