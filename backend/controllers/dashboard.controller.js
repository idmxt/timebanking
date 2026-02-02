const database = require('../config/database');
const timeBankService = require('../services/timeBank.service');

// Получить статистику dashboard
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.userId;

    // Статистика времени
    const timeStats = await timeBankService.getUserTimeStats(userId);

    // Активные бронирования
    const activeBookings = await database.get(`
      SELECT COUNT(*) as count
      FROM bookings
      WHERE (requester_id = ? OR provider_id = ?)
        AND status IN ('pending', 'accepted')
    `, [userId, userId]);

    // Активные услуги
    const activeServices = await database.get(`
      SELECT COUNT(*) as count
      FROM services
      WHERE user_id = ? AND is_active = 1
    `, [userId]);

    // Непрочитанные сообщения
    const unreadMessages = await database.get(`
      SELECT COUNT(*) as count
      FROM messages
      WHERE receiver_id = ? AND is_read = 0
    `, [userId]);

    // Последние транзакции
    const recentTransactions = await timeBankService.getTransactionHistory(userId, 5);

    // График баланса за последние 30 дней
    const balanceHistory = await database.all(`
      SELECT 
        DATE(created_at) as date,
        SUM(CASE WHEN to_user_id = ? THEN hours ELSE -hours END) as change
      FROM time_transactions
      WHERE (from_user_id = ? OR to_user_id = ?)
        AND created_at >= DATE('now', '-30 days')
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, [userId, userId, userId]);

    res.json({
      time_stats: timeStats,
      active_bookings: activeBookings.count,
      active_services: activeServices.count,
      unread_messages: unreadMessages.count,
      recent_transactions: recentTransactions,
      balance_history: balanceHistory
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
};

// Получить рекомендованные услуги
const getRecommendedServices = async (req, res) => {
  try {
    const userId = req.userId;

    // Простая рекомендация: услуги в городе пользователя
    const user = await database.get('SELECT city FROM users WHERE id = ?', [userId]);

    let sql = `
      SELECT 
        s.*,
        u.name as provider_name,
        u.avatar_url as provider_avatar,
        u.rating as provider_rating
      FROM services s
      JOIN users u ON s.user_id = u.id
      WHERE s.is_active = 1 AND s.user_id != ?
    `;

    const params = [userId];

    if (user && user.city) {
      sql += ' AND s.city = ?';
      params.push(user.city);
    }

    sql += ' ORDER BY u.rating DESC LIMIT 6';

    const services = await database.all(sql, params);

    res.json({ services });
  } catch (error) {
    console.error('Get recommended services error:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
};

module.exports = {
  getDashboardStats,
  getRecommendedServices
};
