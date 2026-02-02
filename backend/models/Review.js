const database = require('../config/database');

class Review {
  // Создать отзыв
  static async create(reviewData) {
    const { booking_id, reviewer_id, reviewed_user_id, rating, comment } = reviewData;

    // Проверяем что отзыв еще не оставлен
    const existing = await database.get(`
      SELECT id FROM reviews
      WHERE booking_id = ? AND reviewer_id = ?
    `, [booking_id, reviewer_id]);

    if (existing) {
      throw new Error('Review already exists for this booking');
    }

    const sql = `
      INSERT INTO reviews (booking_id, reviewer_id, reviewed_user_id, rating, comment)
      VALUES (?, ?, ?, ?, ?)
    `;

    const result = await database.run(sql, [
      booking_id, reviewer_id, reviewed_user_id, rating, comment
    ]);

    // Обновляем рейтинг пользователя
    const User = require('./User');
    await User.updateRating(reviewed_user_id);

    return this.findById(result.lastID);
  }

  // Найти отзыв по ID
  static async findById(id) {
    const sql = `
      SELECT 
        r.*,
        reviewer.name as reviewer_name,
        reviewer.avatar_url as reviewer_avatar,
        reviewed.name as reviewed_user_name
      FROM reviews r
      JOIN users reviewer ON r.reviewer_id = reviewer.id
      JOIN users reviewed ON r.reviewed_user_id = reviewed.id
      WHERE r.id = ?
    `;
    return await database.get(sql, [id]);
  }

  // Получить отзывы о пользователе
  static async findByUserId(userId) {
    const sql = `
      SELECT 
        r.*,
        reviewer.name as reviewer_name,
        reviewer.avatar_url as reviewer_avatar,
        s.title as service_title
      FROM reviews r
      JOIN users reviewer ON r.reviewer_id = reviewer.id
      JOIN bookings b ON r.booking_id = b.id
      JOIN services s ON b.service_id = s.id
      WHERE r.reviewed_user_id = ?
      ORDER BY r.created_at DESC
    `;
    return await database.all(sql, [userId]);
  }

  // Получить отзывы об услуге
  static async findByServiceId(serviceId) {
    const sql = `
      SELECT 
        r.*,
        reviewer.name as reviewer_name,
        reviewer.avatar_url as reviewer_avatar
      FROM reviews r
      JOIN users reviewer ON r.reviewer_id = reviewer.id
      JOIN bookings b ON r.booking_id = b.id
      WHERE b.service_id = ?
      ORDER BY r.created_at DESC
    `;
    return await database.all(sql, [serviceId]);
  }

  // Проверить можно ли оставить отзыв
  static async canReview(bookingId, userId) {
    const booking = await database.get(`
      SELECT * FROM bookings
      WHERE id = ? AND status = 'completed'
        AND (requester_id = ? OR provider_id = ?)
    `, [bookingId, userId, userId]);

    if (!booking) {
      return { canReview: false, reason: 'Booking not found or not completed' };
    }

    const existingReview = await database.get(`
      SELECT id FROM reviews
      WHERE booking_id = ? AND reviewer_id = ?
    `, [bookingId, userId]);

    if (existingReview) {
      return { canReview: false, reason: 'Review already submitted' };
    }

    return { canReview: true, booking };
  }
}

module.exports = Review;
