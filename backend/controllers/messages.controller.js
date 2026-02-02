const Message = require('../models/Message');
const { emitToUser } = require('../utils/socket');
const multer = require('multer');
const path = require('path');

// Настройка multer для вложений в сообщениях
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/messages');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'msg-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    // В сообщениях разрешаем больше типов файлов
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname || mimetype) {
      return cb(null, true);
    }
    cb(new Error('File type not allowed'));
  }
});

// Отправить сообщение
const sendMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const { receiver_id, content, booking_id } = req.body;
    let attachmentUrl = null;
    let attachmentType = null;

    if (req.file) {
      attachmentUrl = `/uploads/messages/${req.file.filename}`;
      const ext = path.extname(req.file.originalname).toLowerCase();
      attachmentType = (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) ? 'image' : 'file';
    }

    if (!content && !attachmentUrl) {
      return res.status(400).json({ error: 'Message content or attachment is required' });
    }

    const message = await Message.create(senderId, receiver_id, (content || '').trim(), booking_id, attachmentUrl, attachmentType);

    // Создаем уведомление для получателя
    const database = require('../config/database');
    await database.run(`
      INSERT INTO notifications (user_id, type, title, message, link)
      VALUES (?, 'message', ?, ?, ?)
    `, [
      receiver_id,
      'Новое сообщение',
      attachmentUrl && !content ? '📎 Вложение' : (content || '').substring(0, 50) + ((content || '').length > 50 ? '...' : ''),
      `/messages/${senderId}`
    ]);

    // Отправляем через сокет
    emitToUser(receiver_id, 'new_message', message);
    // Также уведомляем отправителя (для синхронизации вкладок, если нужно)
    emitToUser(senderId, 'message_sent', message);

    res.status(201).json({
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Получить переписку
const getConversation = async (req, res) => {
  try {
    const userId = req.userId;
    const otherUserId = parseInt(req.params.userId);

    const messages = await Message.getConversation(userId, otherUserId);

    // Помечаем как прочитанные
    const result = await Message.markAsRead(userId, otherUserId);

    // Если сообщения были прочитаны, уведомляем отправителя
    if (result && result.changes > 0) {
      emitToUser(otherUserId, 'messages_read', { by_user_id: userId });
    }

    res.json({ messages });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'Failed to get conversation' });
  }
};

// Получить список бесед
const getConversations = async (req, res) => {
  try {
    const userId = req.userId;
    const conversations = await Message.getConversations(userId);

    res.json({ conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
};

// Получить количество непрочитанных
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.userId;
    const count = await Message.getUnreadCount(userId);

    res.json({ unread_count: count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
};

// Пометить как прочитанные
const markAsRead = async (req, res) => {
  try {
    const userId = req.userId;
    const otherUserId = parseInt(req.params.userId);

    const result = await Message.markAsRead(userId, otherUserId);

    if (result && result.changes > 0) {
      emitToUser(otherUserId, 'messages_read', { by_user_id: userId });
    }

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Failed to mark as read' });
  }
};

module.exports = {
  sendMessage: [upload.single('attachment'), sendMessage],
  getConversation,
  getConversations,
  getUnreadCount,
  markAsRead
};
