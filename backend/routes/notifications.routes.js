const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notifications.controller');
const { authenticateToken } = require('../middleware/auth');

// Все роуты защищены
router.use(authenticateToken);

// GET /api/notifications - Получить уведомления
router.get('/', notificationsController.getNotifications);

// GET /api/notifications/unread-count - Количество непрочитанных
router.get('/unread-count', notificationsController.getUnreadCount);

// PUT /api/notifications/mark-all-read - Пометить все как прочитанные
router.put('/mark-all-read', notificationsController.markAllAsRead);

// PUT /api/notifications/:id/read - Пометить одно как прочитанное
router.put('/:id/read', notificationsController.markAsRead);

// DELETE /api/notifications/:id - Удалить уведомление
router.delete('/:id', notificationsController.deleteNotification);

module.exports = router;
