const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { authenticateToken } = require('../middleware/auth');

// GET /api/users/:id - Получить профиль пользователя (публичный)
router.get('/:id', usersController.getUserProfile);

// GET /api/users/:id/reviews - Получить отзывы о пользователе (публичный)
router.get('/:id/reviews', usersController.getUserReviews);

// GET /api/users/:id/services - Получить услуги пользователя (публичный)
router.get('/:id/services', usersController.getUserServices);

// PUT /api/users/profile - Обновить свой профиль (защищенный)
router.put('/profile', authenticateToken, usersController.updateProfile);

// POST /api/users/avatar - Загрузить аватар (защищенный)
router.post('/avatar', authenticateToken, usersController.uploadAvatar);

// POST /api/users/skills - Добавить навык (защищенный)
router.post('/skills', authenticateToken, usersController.addSkill);

// DELETE /api/users/skills/:skillId - Удалить навык (защищенный)
router.delete('/skills/:skillId', authenticateToken, usersController.removeSkill);

// GET /api/users/me/transactions - История транзакций (защищенный)
router.get('/me/transactions', authenticateToken, usersController.getTimeTransactions);

// PUT /api/users/change-password - Сменить пароль (защищенный)
router.put('/change-password', authenticateToken, usersController.changePassword);

// PUT /api/users/change-email - Сменить email (защищенный)
router.put('/change-email', authenticateToken, usersController.changeEmail);

// DELETE /api/users/account - Удалить аккаунт (защищенный)
router.delete('/account', authenticateToken, usersController.deleteAccount);

module.exports = router;
