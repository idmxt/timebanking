const Booking = require('../models/Booking');
const User = require('../models/User');
const Service = require('../models/Service');

// Создать бронирование
const createBooking = async (req, res) => {
  try {
    const requesterId = req.userId;
    const { service_id, booking_date, booking_time, message } = req.body;

    // Получаем услугу
    const service = await Service.findById(service_id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Нельзя забронировать свою услугу
    if (service.user_id === requesterId) {
      return res.status(400).json({ error: 'Cannot book your own service' });
    }

    // Проверяем баланс времени requester
    const requester = await User.findById(requesterId);
    const minBalance = parseFloat(process.env.MIN_TIME_BALANCE) || -10.0;
    
    if (requester.time_balance - service.duration < minBalance) {
      return res.status(400).json({
        error: 'Insufficient time balance',
        required: service.duration,
        current: requester.time_balance,
        minimum: minBalance
      });
    }

    // Создаем бронирование
    const booking = await Booking.create({
      service_id,
      requester_id: requesterId,
      provider_id: service.user_id,
      booking_date,
      booking_time,
      duration: service.duration,
      message
    });

    // Создаем уведомление для provider
    const database = require('../config/database');
    await database.run(`
      INSERT INTO notifications (user_id, type, title, message, link)
      VALUES (?, 'booking_request', ?, ?, ?)
    `, [
      service.user_id,
      'Новый запрос на услугу',
      `${requester.name} хочет забронировать "${service.title}"`,
      `/bookings/${booking.id}`
    ]);

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

// Получить свои бронирования
const getMyBookings = async (req, res) => {
  try {
    const userId = req.userId;
    const { role } = req.query; // 'requester', 'provider', или null (все)

    const bookings = await Booking.findByUserId(userId, role);
    res.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to get bookings' });
  }
};

// Получить бронирование по ID
const getBookingById = async (req, res) => {
  try {
    const userId = req.userId;
    const bookingId = parseInt(req.params.id);

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Проверяем что пользователь участвует в бронировании
    if (booking.requester_id !== userId && booking.provider_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Failed to get booking' });
  }
};

// Принять бронирование (provider)
const acceptBooking = async (req, res) => {
  try {
    const userId = req.userId;
    const bookingId = parseInt(req.params.id);

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.provider_id !== userId) {
      return res.status(403).json({ error: 'Only provider can accept booking' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ error: 'Booking is not pending' });
    }

    const updatedBooking = await Booking.updateStatus(bookingId, 'accepted', userId);

    // Уведомление для requester
    const database = require('../config/database');
    await database.run(`
      INSERT INTO notifications (user_id, type, title, message, link)
      VALUES (?, 'booking_accepted', ?, ?, ?)
    `, [
      booking.requester_id,
      'Бронирование подтверждено',
      `${booking.provider_name} подтвердил вашу заявку на "${booking.service_title}"`,
      `/bookings/${bookingId}`
    ]);

    res.json({
      message: 'Booking accepted',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Accept booking error:', error);
    res.status(500).json({ error: 'Failed to accept booking' });
  }
};

// Отклонить бронирование (provider)
const declineBooking = async (req, res) => {
  try {
    const userId = req.userId;
    const bookingId = parseInt(req.params.id);

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.provider_id !== userId) {
      return res.status(403).json({ error: 'Only provider can decline booking' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ error: 'Booking is not pending' });
    }

    const updatedBooking = await Booking.updateStatus(bookingId, 'declined', userId);

    // Уведомление для requester
    const database = require('../config/database');
    await database.run(`
      INSERT INTO notifications (user_id, type, title, message, link)
      VALUES (?, 'booking_declined', ?, ?, ?)
    `, [
      booking.requester_id,
      'Бронирование отклонено',
      `${booking.provider_name} отклонил вашу заявку на "${booking.service_title}"`,
      `/bookings/${bookingId}`
    ]);

    res.json({
      message: 'Booking declined',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Decline booking error:', error);
    res.status(500).json({ error: 'Failed to decline booking' });
  }
};

// Отменить бронирование
const cancelBooking = async (req, res) => {
  try {
    const userId = req.userId;
    const bookingId = parseInt(req.params.id);

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Оба участника могут отменить
    if (booking.requester_id !== userId && booking.provider_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking cannot be cancelled' });
    }

    const updatedBooking = await Booking.updateStatus(bookingId, 'cancelled', userId);

    // Уведомление для другого участника
    const otherUserId = userId === booking.requester_id ? booking.provider_id : booking.requester_id;
    const database = require('../config/database');
    await database.run(`
      INSERT INTO notifications (user_id, type, title, message, link)
      VALUES (?, 'booking_cancelled', ?, ?, ?)
    `, [
      otherUserId,
      'Бронирование отменено',
      `Бронирование "${booking.service_title}" было отменено`,
      `/bookings/${bookingId}`
    ]);

    res.json({
      message: 'Booking cancelled',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};

// Подтвердить выполнение
const confirmCompletion = async (req, res) => {
  try {
    const userId = req.userId;
    const bookingId = parseInt(req.params.id);

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.requester_id !== userId && booking.provider_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (booking.status !== 'accepted') {
      return res.status(400).json({ error: 'Booking must be accepted first' });
    }

    // Подтверждаем
    const updatedBooking = await Booking.confirmCompletion(bookingId, userId);

    // Проверяем подтвердили ли обе стороны
    if (updatedBooking.requester_confirmed && updatedBooking.provider_confirmed) {
      // Переводим время
      const timeBankService = require('../services/timeBank.service');
      await timeBankService.transferTime(
        updatedBooking.requester_id,
        updatedBooking.provider_id,
        updatedBooking.duration,
        bookingId
      );

      // Обновляем статус
      await Booking.updateStatus(bookingId, 'completed', userId);

      res.json({
        message: 'Booking completed! Time transferred.',
        booking: await Booking.findById(bookingId)
      });
    } else {
      res.json({
        message: 'Completion confirmed. Waiting for the other party.',
        booking: updatedBooking
      });
    }
  } catch (error) {
    console.error('Confirm completion error:', error);
    res.status(500).json({ error: 'Failed to confirm completion' });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  acceptBooking,
  declineBooking,
  cancelBooking,
  confirmCompletion
};
