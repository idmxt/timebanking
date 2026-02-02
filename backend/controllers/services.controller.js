const Service = require('../models/Service');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Настройка multer для изображений услуг
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/services');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'service-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// Получить все услуги с фильтрами
const getAllServices = async (req, res) => {
  try {
    const { category, city, location_type, search, min_rating, sort, limit = 20, offset = 0 } = req.query;

    const filters = {};
    if (category) filters.category = category;
    if (city) filters.city = city;
    if (location_type) filters.location_type = location_type;
    if (search) filters.search = search;
    if (min_rating) filters.min_rating = min_rating;
    if (sort) filters.sort = sort;

    const services = await Service.findAll(
      filters,
      parseInt(limit),
      parseInt(offset)
    );

    res.json({ services, count: services.length });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Failed to get services' });
  }
};

// Получить услугу по ID
const getServiceById = async (req, res) => {
  try {
    const serviceId = parseInt(req.params.id);
    const userId = req.userId || null;
    const service = await Service.findById(serviceId, userId);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Получить доступность
    const availability = await Service.getAvailability(serviceId);

    res.json({
      service: {
        ...service,
        availability
      }
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ error: 'Failed to get service' });
  }
};

// Создать услугу
const createService = async (req, res) => {
  try {
    const userId = req.userId;
    const serviceData = {
      ...req.body,
      user_id: userId,
      duration: parseFloat(req.body.duration)
    };

    if (req.file) {
      serviceData.image_url = `/uploads/services/${req.file.filename}`;
    }

    // Валидация обязательных полей
    const required = ['title', 'category', 'duration', 'location_type'];
    for (const field of required) {
      if (!serviceData[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    const service = await Service.create(serviceData);

    res.status(201).json({
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
};

// Обновить услугу
const updateService = async (req, res) => {
  try {
    const userId = req.userId;
    const serviceId = parseInt(req.params.id);
    const updates = { ...req.body };

    if (req.body.duration) {
      updates.duration = parseFloat(req.body.duration);
    }

    if (req.file) {
      updates.image_url = `/uploads/services/${req.file.filename}`;

      // Удаляем старое изображение
      const oldService = await Service.findById(serviceId);
      if (oldService && oldService.image_url) {
        const oldImagePath = path.join(__dirname, '..', oldService.image_url);
        try {
          await fs.unlink(oldImagePath);
        } catch (err) {
          // Игнорируем
        }
      }
    }

    const service = await Service.update(serviceId, userId, updates);

    res.json({
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ error: error.message || 'Failed to update service' });
  }
};

// Удалить услугу
const deleteService = async (req, res) => {
  try {
    const userId = req.userId;
    const serviceId = parseInt(req.params.id);

    await Service.delete(serviceId, userId);

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete service' });
  }
};

// Получить категории
const getCategories = async (req, res) => {
  try {
    const categories = await Service.getCategories();
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
};

// Получить города
const getCities = async (req, res) => {
  try {
    const cities = await Service.getCities();
    res.json({ cities });
  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({ error: 'Failed to get cities' });
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  createService: [upload.single('image'), createService],
  updateService: [upload.single('image'), updateService],
  deleteService,
  getCategories,
  getCities
};
