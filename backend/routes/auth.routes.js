const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// POST /api/auth/register - Регистрация
router.post('/register', validateRegistration, authController.register);

// POST /api/auth/login - Вход
router.post('/login', validateLogin, authController.login);

// POST /api/auth/refresh - Обновление токена
router.post('/refresh', authController.refresh);

// GET /api/auth/me - Получить текущего пользователя (защищенный роут)
router.get('/me', authenticateToken, authController.getCurrentUser);

module.exports = router;
