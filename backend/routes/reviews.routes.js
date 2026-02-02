const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviews.controller');
const { authenticateToken } = require('../middleware/auth');

// GET /api/reviews/user/:userId - Отзывы о пользователе (публичный)
router.get('/user/:userId', reviewsController.getUserReviews);

// GET /api/reviews/service/:serviceId - Отзывы об услуге (публичный)
router.get('/service/:serviceId', reviewsController.getServiceReviews);

// Защищенные роуты
router.use(authenticateToken);

// POST /api/reviews - Создать отзыв
router.post('/', reviewsController.createReview);

// GET /api/reviews/can-review/:bookingId - Проверить возможность отзыва
router.get('/can-review/:bookingId', reviewsController.checkCanReview);

module.exports = router;
