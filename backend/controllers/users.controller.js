const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Настройка multer для загрузки аватаров
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
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

// Получить профиль пользователя по ID
const getUserProfile = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Не возвращаем password_hash
    delete user.password_hash;

    // Получаем навыки пользователя
    const skills = await User.getSkills(userId);

    res.json({
      user: {
        ...user,
        skills
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
};

// Обновить свой профиль
const updateProfile = async (req, res) => {
  try {
    const userId = req.userId; // Из middleware authenticateToken
    const updates = {};

    // Разрешенные поля для обновления
    const allowedFields = ['name', 'city', 'bio', 'occupation', 'phone', 'languages', 'first_name', 'last_name', 'patronymic', 'birth_date', 'gender'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const updatedUser = await User.update(userId, updates);
    delete updatedUser.password_hash;

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Загрузить аватар
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const userId = req.userId;
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // Удаляем старый аватар если есть
    const user = await User.findById(userId);
    if (user.avatar_url) {
      const oldAvatarPath = path.join(__dirname, '..', user.avatar_url);
      try {
        await fs.unlink(oldAvatarPath);
      } catch (err) {
        // Игнорируем если файл не найден
      }
    }

    // Обновляем URL аватара в БД
    const updatedUser = await User.update(userId, { avatar_url: avatarUrl });
    delete updatedUser.password_hash;

    res.json({
      message: 'Avatar uploaded successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ error: 'Failed to upload avatar' });
  }
};

// Добавить навык
const addSkill = async (req, res) => {
  try {
    const userId = req.userId;
    const { skill } = req.body;

    if (!skill || skill.trim().length === 0) {
      return res.status(400).json({ error: 'Skill name is required' });
    }

    await User.addSkill(userId, skill.trim());
    const skills = await User.getSkills(userId);

    res.json({
      message: 'Skill added successfully',
      skills
    });
  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({ error: 'Failed to add skill' });
  }
};

// Удалить навык
const removeSkill = async (req, res) => {
  try {
    const userId = req.userId;
    const skillId = parseInt(req.params.skillId);

    await User.removeSkill(userId, skillId);
    const skills = await User.getSkills(userId);

    res.json({
      message: 'Skill removed successfully',
      skills
    });
  } catch (error) {
    console.error('Remove skill error:', error);
    res.status(500).json({ error: 'Failed to remove skill' });
  }
};

// Получить отзывы о пользователе
const getUserReviews = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const database = require('../config/database');

    const reviews = await database.all(`
      SELECT 
        r.*,
        reviewer.name as reviewer_name,
        reviewer.avatar_url as reviewer_avatar,
        s.title as service_title
      FROM reviews r
      JOIN users reviewer ON r.reviewer_id = reviewer.id
      JOIN bookings b ON r.booking_id = b.id
      JOIN services s ON b.service_id = s.id
      WHERE r.reviewed_user_id = ?
      ORDER BY r.created_at DESC
    `, [userId]);

    res.json({ reviews });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ error: 'Failed to get reviews' });
  }
};

// Получить услуги пользователя
const getUserServices = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const Service = require('../models/Service');

    const services = await Service.findByUserId(userId);
    res.json({ services });
  } catch (error) {
    console.error('Get user services error:', error);
    res.status(500).json({ error: 'Failed to get services' });
  }
};

// Получить историю транзакций
const getTimeTransactions = async (req, res) => {
  try {
    const userId = req.userId;
    const database = require('../config/database');

    const transactions = await database.all(`
      SELECT 
        t.*,
        from_user.name as from_user_name,
        to_user.name as to_user_name
      FROM time_transactions t
      LEFT JOIN users from_user ON t.from_user_id = from_user.id
      JOIN users to_user ON t.to_user_id = to_user.id
      WHERE t.from_user_id = ? OR t.to_user_id = ?
      ORDER BY t.created_at DESC
      LIMIT 50
    `, [userId, userId]);

    res.json({ transactions });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to get transactions' });
  }
};

// Сменить пароль
const changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new passwords are required' });
    }

    const user = await User.findById(userId);
    const isMatch = await User.verifyPassword(currentPassword, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect current password' });
    }

    await User.updatePassword(userId, newPassword);

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};

// Сменить email
const changeEmail = async (req, res) => {
  try {
    const userId = req.userId;
    const { newEmail, currentPassword } = req.body;

    if (!newEmail || !currentPassword) {
      return res.status(400).json({ error: 'New email and current password are required' });
    }

    const user = await User.findById(userId);

    // Проверяем пароль
    const isMatch = await User.verifyPassword(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect current password' });
    }

    // Проверяем, не занят ли новый email другим пользователем
    const database = require('../config/database');
    const existingUser = await database.get('SELECT id FROM users WHERE email = ? AND id != ?', [newEmail, userId]);

    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Обновляем email (используем прямой SQL, так как User.update защищает email)
    await database.run('UPDATE users SET email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [newEmail, userId]);

    res.json({
      message: 'Email updated successfully',
      email: newEmail
    });
  } catch (error) {
    console.error('Change email error:', error);
    res.status(500).json({ error: 'Failed to change email' });
  }
};

// Удалить аккаунт
const deleteAccount = async (req, res) => {
  try {
    const userId = req.userId;
    const database = require('../config/database');

    // В реальном приложении здесь может быть сложная логика очистки данных
    // Для начала просто удаляем из таблицы users (каскадное удаление в БД должно сработать)
    await database.run('DELETE FROM users WHERE id = ?', [userId]);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
};

module.exports = {
  getUserProfile,
  updateProfile,
  uploadAvatar: [upload.single('avatar'), uploadAvatar],
  addSkill,
  removeSkill,
  getUserReviews,
  getUserServices,
  getTimeTransactions,
  changePassword,
  changeEmail,
  deleteAccount
};
