const Review = require('../models/Review');

// Создать отзыв
const createReview = async (req, res) => {
  try {
    const reviewerId = req.userId;
    const { booking_id, rating, comment } = req.body;

    // Валидация
    if (!booking_id || !rating) {
      return res.status(400).json({ error: 'Booking ID and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Проверяем можно ли оставить отзыв
    const canReviewCheck = await Review.canReview(booking_id, reviewerId);
    if (!canReviewCheck.canReview) {
      return res.status(400).json({ error: canReviewCheck.reason });
    }

    const booking = canReviewCheck.booking;

    // Определяем о ком отзыв
    const reviewedUserId = booking.requester_id === reviewerId
      ? booking.provider_id
      : booking.requester_id;

    // Создаем отзыв
    const review = await Review.create({
      booking_id,
      reviewer_id: reviewerId,
      reviewed_user_id: reviewedUserId,
      rating,
      comment
    });

    // Создаем уведомление
    const database = require('../config/database');
    await database.run(`
      INSERT INTO notifications (user_id, type, title, message, link)
      VALUES (?, 'review', ?, ?, ?)
    `, [
      reviewedUserId,
      'Новый отзыв',
      `Вы получили отзыв с оценкой ${rating}/5`,
      `/profile/${reviewedUserId}`
    ]);

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: error.message || 'Failed to create review' });
  }
};

// Получить отзывы о пользователе
const getUserReviews = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const reviews = await Review.findByUserId(userId);

    res.json({ reviews });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Failed to get reviews' });
  }
};

// Получить отзывы об услуге
const getServiceReviews = async (req, res) => {
  try {
    const serviceId = parseInt(req.params.serviceId);
    const reviews = await Review.findByServiceId(serviceId);

    res.json({ reviews });
  } catch (error) {
    console.error('Get service reviews error:', error);
    res.status(500).json({ error: 'Failed to get service reviews' });
  }
};

// Проверить можно ли оставить отзыв
const checkCanReview = async (req, res) => {
  try {
    const userId = req.userId;
    const bookingId = parseInt(req.params.bookingId);

    const result = await Review.canReview(bookingId, userId);

    res.json(result);
  } catch (error) {
    console.error('Check can review error:', error);
    res.status(500).json({ error: 'Failed to check review status' });
  }
};

module.exports = {
  createReview,
  getUserReviews,
  getServiceReviews,
  checkCanReview
};
