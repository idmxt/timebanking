const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticateToken } = require('../middleware/auth');

// Все роуты защищены
router.use(authenticateToken);

// GET /api/dashboard/stats - Статистика
router.get('/stats', dashboardController.getDashboardStats);

// GET /api/dashboard/recommendations - Рекомендации
router.get('/recommendations', dashboardController.getRecommendedServices);

module.exports = router;
