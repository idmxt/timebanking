const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favorites.controller');
const { authenticateToken } = require('../middleware/auth');

// POST /api/favorites/:serviceId - Переключить избранное (защищенный)
router.post('/:serviceId', authenticateToken, favoritesController.toggleFavorite);

// GET /api/favorites - Получить список избранного (защищенный)
router.get('/', authenticateToken, favoritesController.getFavorites);

module.exports = router;
