const database = require('../config/database');

class Message {
  // Отправить сообщение
  static async create(senderId, receiverId, content, bookingId = null, attachmentUrl = null, attachmentType = null) {
    const sql = `
      INSERT INTO messages (sender_id, receiver_id, content, booking_id, attachment_url, attachment_type)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const result = await database.run(sql, [senderId, receiverId, content, bookingId, attachmentUrl, attachmentType]);
    return this.findById(result.lastID);
  }

  // Найти сообщение по ID
  static async findById(id) {
    const sql = `
      SELECT 
        m.*,
        sender.name as sender_name,
        sender.avatar_url as sender_avatar,
        receiver.name as receiver_name,
        receiver.avatar_url as receiver_avatar
      FROM messages m
      JOIN users sender ON m.sender_id = sender.id
      JOIN users receiver ON m.receiver_id = receiver.id
      WHERE m.id = ?
    `;
    return await database.get(sql, [id]);
  }

  // Получить переписку между двумя пользователями
  static async getConversation(userId1, userId2, limit = 100) {
    const sql = `
      SELECT 
        m.*,
        sender.name as sender_name,
        sender.avatar_url as sender_avatar
      FROM messages m
      JOIN users sender ON m.sender_id = sender.id
      WHERE (m.sender_id = ? AND m.receiver_id = ?)
         OR (m.sender_id = ? AND m.receiver_id = ?)
      ORDER BY m.created_at ASC
      LIMIT ?
    `;
    return await database.all(sql, [userId1, userId2, userId2, userId1, limit]);
  }

  // Получить список бесед пользователя
  static async getConversations(userId) {
    const sql = `
      SELECT 
        CASE 
          WHEN m.sender_id = ? THEN m.receiver_id 
          ELSE m.sender_id 
        END as other_user_id,
        MAX(m.created_at) as last_message_at,
        COUNT(CASE WHEN m.receiver_id = ? AND m.is_read = 0 THEN 1 END) as unread_count
      FROM messages m
      WHERE m.sender_id = ? OR m.receiver_id = ?
      GROUP BY other_user_id
      ORDER BY last_message_at DESC
    `;

    const conversations = await database.all(sql, [userId, userId, userId, userId]);

    // Получаем информацию о пользователях
    for (let conv of conversations) {
      const user = await database.get(`
        SELECT id, name, avatar_url FROM users WHERE id = ?
      `, [conv.other_user_id]);

      // Получаем последнее сообщение
      const lastMessage = await database.get(`
        SELECT content, created_at, sender_id
        FROM messages
        WHERE (sender_id = ? AND receiver_id = ?)
           OR (sender_id = ? AND receiver_id = ?)
        ORDER BY created_at DESC
        LIMIT 1
      `, [userId, user.id, user.id, userId]);

      conv.other_user = user;
      conv.last_message = lastMessage;
    }

    return conversations;
  }

  // Пометить сообщения как прочитанные
  static async markAsRead(userId, otherUserId) {
    const sql = `
      UPDATE messages
      SET is_read = 1
      WHERE receiver_id = ? AND sender_id = ? AND is_read = 0
    `;
    return await database.run(sql, [userId, otherUserId]);
  }

  // Получить количество непрочитанных
  static async getUnreadCount(userId) {
    const sql = `
      SELECT COUNT(*) as count
      FROM messages
      WHERE receiver_id = ? AND is_read = 0
    `;
    const result = await database.get(sql, [userId]);
    return result.count;
  }
}

module.exports = Message;
