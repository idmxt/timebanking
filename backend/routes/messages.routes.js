const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messages.controller');
const { authenticateToken } = require('../middleware/auth');

// Все роуты защищены
router.use(authenticateToken);

// POST /api/messages - Отправить сообщение
router.post('/', messagesController.sendMessage);

// GET /api/messages/conversations - Список бесед
router.get('/conversations', messagesController.getConversations);

// GET /api/messages/unread - Количество непрочитанных
router.get('/unread', messagesController.getUnreadCount);

// GET /api/messages/:userId - Переписка с пользователем
router.get('/:userId', messagesController.getConversation);

// PUT /api/messages/:userId/read - Пометить как прочитанные
router.put('/:userId/read', messagesController.markAsRead);

module.exports = router;
