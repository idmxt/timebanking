const database = require('../config/database');
const User = require('../models/User');

class TimeBankService {
  /**
   * Перевод времени между пользователями
   * @param {number} fromUserId - От кого (получатель услуги)
   * @param {number} toUserId - Кому (исполнитель услуги)
   * @param {number} hours - Количество часов
   * @param {number} bookingId - ID бронирования
   */
  async transferTime(fromUserId, toUserId, hours, bookingId) {
    try {
      // Начинаем транзакцию
      await database.run('BEGIN TRANSACTION');

      // Проверяем минимальный баланс
      const fromUser = await User.findById(fromUserId);
      const minBalance = parseFloat(process.env.MIN_TIME_BALANCE) || -10.0;

      if (fromUser.time_balance - hours < minBalance) {
        throw new Error('Insufficient time balance');
      }

      // Списываем у получателя услуги
      await database.run(`
        UPDATE users
        SET time_balance = time_balance - ?
        WHERE id = ?
      `, [hours, fromUserId]);

      // Начисляем исполнителю
      await database.run(`
        UPDATE users
        SET time_balance = time_balance + ?
        WHERE id = ?
      `, [hours, toUserId]);

      // Создаем запись транзакции
      await database.run(`
        INSERT INTO time_transactions 
        (from_user_id, to_user_id, hours, booking_id, transaction_type, description)
        VALUES (?, ?, ?, ?, 'service', ?)
      `, [
        fromUserId,
        toUserId,
        hours,
        bookingId,
        `Service completed: Booking #${bookingId}`
      ]);

      // Коммитим транзакцию
      await database.run('COMMIT');

      console.log(`✅ Transferred ${hours} hours from user ${fromUserId} to user ${toUserId}`);

      return {
        success: true,
        from_user_id: fromUserId,
        to_user_id: toUserId,
        hours,
        booking_id: bookingId
      };
    } catch (error) {
      // Откатываем при ошибке
      await database.run('ROLLBACK');
      console.error('Transfer time error:', error);
      throw error;
    }
  }

  /**
   * Добавить бонусные часы
   * @param {number} userId - ID пользователя
   * @param {number} hours - Количество часов
   * @param {string} reason - Причина начисления
   */
  async addBonus(userId, hours, reason = 'Bonus') {
    try {
      await database.run(`
        UPDATE users
        SET time_balance = time_balance + ?
        WHERE id = ?
      `, [hours, userId]);

      await database.run(`
        INSERT INTO time_transactions 
        (to_user_id, hours, transaction_type, description)
        VALUES (?, ?, 'bonus', ?)
      `, [userId, hours, reason]);

      console.log(`✅ Added ${hours} bonus hours to user ${userId}`);

      return {
        success: true,
        user_id: userId,
        hours,
        reason
      };
    } catch (error) {
      console.error('Add bonus error:', error);
      throw error;
    }
  }

  /**
   * Возврат времени (при отмене бронирования после оплаты)
   * @param {number} bookingId - ID бронирования
   */
  async refundTime(bookingId) {
    try {
      // Находим оригинальную транзакцию
      const transaction = await database.get(`
        SELECT * FROM time_transactions
        WHERE booking_id = ? AND transaction_type = 'service'
      `, [bookingId]);

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      await database.run('BEGIN TRANSACTION');

      // Возвращаем время обратно
      await database.run(`
        UPDATE users
        SET time_balance = time_balance + ?
        WHERE id = ?
      `, [transaction.hours, transaction.from_user_id]);

      await database.run(`
        UPDATE users
        SET time_balance = time_balance - ?
        WHERE id = ?
      `, [transaction.hours, transaction.to_user_id]);

      // Создаем refund транзакцию
      await database.run(`
        INSERT INTO time_transactions 
        (from_user_id, to_user_id, hours, booking_id, transaction_type, description)
        VALUES (?, ?, ?, ?, 'refund', ?)
      `, [
        transaction.to_user_id,
        transaction.from_user_id,
        transaction.hours,
        bookingId,
        `Refund for Booking #${bookingId}`
      ]);

      await database.run('COMMIT');

      console.log(`✅ Refunded ${transaction.hours} hours for booking ${bookingId}`);

      return {
        success: true,
        booking_id: bookingId,
        hours: transaction.hours
      };
    } catch (error) {
      await database.run('ROLLBACK');
      console.error('Refund time error:', error);
      throw error;
    }
  }

  /**
   * Получить историю транзакций пользователя
   * @param {number} userId - ID пользователя
   * @param {number} limit - Лимит записей
   */
  async getTransactionHistory(userId, limit = 50) {
    try {
      const transactions = await database.all(`
        SELECT 
          t.*,
          from_user.name as from_user_name,
          to_user.name as to_user_name,
          s.title as service_title,
          CASE 
            WHEN t.to_user_id = ? THEN '+'
            ELSE '-'
          END as direction
        FROM time_transactions t
        LEFT JOIN users from_user ON t.from_user_id = from_user.id
        JOIN users to_user ON t.to_user_id = to_user.id
        LEFT JOIN bookings b ON t.booking_id = b.id
        LEFT JOIN services s ON b.service_id = s.id
        WHERE t.from_user_id = ? OR t.to_user_id = ?
        ORDER BY t.created_at DESC
        LIMIT ?
      `, [userId, userId, userId, limit]);

      return transactions;
    } catch (error) {
      console.error('Get transaction history error:', error);
      throw error;
    }
  }

  /**
   * Получить статистику времени пользователя
   * @param {number} userId - ID пользователя
   */
  async getUserTimeStats(userId) {
    try {
      const user = await User.findById(userId);

      // Заработано всего
      const earned = await database.get(`
        SELECT COALESCE(SUM(hours), 0) as total
        FROM time_transactions
        WHERE to_user_id = ?
      `, [userId]);

      // Потрачено всего
      const spent = await database.get(`
        SELECT COALESCE(SUM(hours), 0) as total
        FROM time_transactions
        WHERE from_user_id = ?
      `, [userId]);

      // Количество завершенных обменов
      const exchanges = await database.get(`
        SELECT COUNT(*) as total
        FROM bookings
        WHERE (requester_id = ? OR provider_id = ?) AND status = 'completed'
      `, [userId, userId]);

      return {
        current_balance: user.time_balance,
        total_earned: earned.total,
        total_spent: spent.total,
        completed_exchanges: exchanges.total
      };
    } catch (error) {
      console.error('Get user time stats error:', error);
      throw error;
    }
  }
}

module.exports = new TimeBankService();
