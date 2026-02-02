const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookings.controller');
const { authenticateToken } = require('../middleware/auth');

// Все роуты защищены аутентификацией
router.use(authenticateToken);

// POST /api/bookings - Создать бронирование
router.post('/', bookingsController.createBooking);

// GET /api/bookings - Получить свои бронирования
router.get('/', bookingsController.getMyBookings);

// GET /api/bookings/:id - Получить бронирование по ID
router.get('/:id', bookingsController.getBookingById);

// PUT /api/bookings/:id/accept - Принять бронирование
router.put('/:id/accept', bookingsController.acceptBooking);

// PUT /api/bookings/:id/decline - Отклонить бронирование
router.put('/:id/decline', bookingsController.declineBooking);

// PUT /api/bookings/:id/cancel - Отменить бронирование
router.put('/:id/cancel', bookingsController.cancelBooking);

// PUT /api/bookings/:id/confirm - Подтвердить выполнение
router.put('/:id/confirm', bookingsController.confirmCompletion);

module.exports = router;
