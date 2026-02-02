const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/services.controller');
const { authenticateToken, optionalAuthenticate } = require('../middleware/auth');

// GET /api/services - Получить все услуги (публичный)
router.get('/', optionalAuthenticate, servicesController.getAllServices);

// GET /api/services/categories - Получить категории (публичный)
router.get('/categories', servicesController.getCategories);

// GET /api/services/cities - Получить города (публичный)
router.get('/cities', servicesController.getCities);

// GET /api/services/:id - Получить услугу по ID (публичный)
router.get('/:id', optionalAuthenticate, servicesController.getServiceById);

// POST /api/services - Создать услугу (защищенный)
router.post('/', authenticateToken, servicesController.createService);

// PUT /api/services/:id - Обновить услугу (защищенный)
router.put('/:id', authenticateToken, servicesController.updateService);

// DELETE /api/services/:id - Удалить услугу (защищенный)
router.delete('/:id', authenticateToken, servicesController.deleteService);

module.exports = router;
