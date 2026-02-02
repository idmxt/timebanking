const database = require('../config/database');

// Получить уведомления пользователя
const getNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const { limit = 50, unread_only = false } = req.query;

    let sql = `
      SELECT * FROM notifications
      WHERE user_id = ?
    `;

    const params = [userId];

    if (unread_only === 'true') {
      sql += ' AND is_read = 0';
    }

    sql += ' ORDER BY created_at DESC LIMIT ?';
    params.push(parseInt(limit));

    const notifications = await database.all(sql, params);

    res.json({ notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to get notifications' });
  }
};

// Пометить уведомление как прочитанное
const markAsRead = async (req, res) => {
  try {
    const userId = req.userId;
    const notificationId = parseInt(req.params.id);

    await database.run(`
      UPDATE notifications
      SET is_read = 1
      WHERE id = ? AND user_id = ?
    `, [notificationId, userId]);

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ error: 'Failed to mark as read' });
  }
};

// Пометить все как прочитанные
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.userId;

    await database.run(`
      UPDATE notifications
      SET is_read = 1
      WHERE user_id = ? AND is_read = 0
    `, [userId]);

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
};

// Получить количество непрочитанных
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await database.get(`
      SELECT COUNT(*) as count
      FROM notifications
      WHERE user_id = ? AND is_read = 0
    `, [userId]);

    res.json({ unread_count: result.count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
};

// Удалить уведомление
const deleteNotification = async (req, res) => {
  try {
    const userId = req.userId;
    const notificationId = parseInt(req.params.id);

    await database.run(`
      DELETE FROM notifications
      WHERE id = ? AND user_id = ?
    `, [notificationId, userId]);

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification
};
