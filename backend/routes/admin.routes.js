const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticateToken } = require('../middleware/auth');
const isAdmin = require('../middleware/adminAuth');

// Все маршруты защищены токеном и проверкой на админа
router.use(authenticateToken);
router.use(isAdmin);

// Статистика
router.get('/stats', adminController.getStats);

// Управление пользователями
router.get('/users', adminController.getUsers);
router.put('/users/:id', adminController.updateUser);

// Модерация услуг
router.get('/services', adminController.getServices);
router.put('/services/:id', adminController.moderateService);

module.exports = router;
