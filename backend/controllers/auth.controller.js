const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');

// Регистрация нового пользователя
const register = async (req, res) => {
  try {
    const { email, password, name, city, bio } = req.body;

    // Валидация входных данных
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password and name are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Проверяем существует ли пользователь
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Создаем пользователя
    const user = await User.create({
      email,
      password,
      name,
      city,
      bio
    });

    // Генерируем токены
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Не возвращаем password_hash клиенту
    delete user.password_hash;

    res.status(201).json({
      message: 'User registered successfully',
      user,
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Вход пользователя
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Находим пользователя
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Проверяем пароль
    const isPasswordValid = await User.verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Проверяем статус пользователя
    if (user.status === 'blocked') {
      return res.status(403).json({ error: 'Ваш аккаунт заблокирован' });
    }

    // Генерируем токены
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Не возвращаем password_hash
    delete user.password_hash;

    res.json({
      message: 'Login successful',
      user,
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Обновление access токена через refresh токен
const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    // Проверяем refresh токен
    const decoded = verifyRefreshToken(refreshToken);

    // Генерируем новый access токен
    const newAccessToken = generateAccessToken(decoded.userId);

    res.json({
      accessToken: newAccessToken
    });
  } catch (error) {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
};

// Получить текущего пользователя
const getCurrentUser = async (req, res) => {
  try {
    // req.userId установлен middleware authenticateToken
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ error: 'Account blocked' });
    }

    delete user.password_hash;
    res.json({ user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

module.exports = {
  register,
  login,
  refresh,
  getCurrentUser
};
