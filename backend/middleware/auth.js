const { verifyAccessToken } = require('../utils/jwt');

// Middleware для проверки авторизации
const authenticateToken = (req, res, next) => {
  try {
    // Получаем токен из заголовка Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Проверяем токен
    const decoded = verifyAccessToken(token);

    // Добавляем userId в request для использования в контроллерах
    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(403).json({ error: error.message });
  }
};

// Middleware для опциональной проверки авторизации (не блокирует запрос)
const optionalAuthenticate = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = verifyAccessToken(token);
      req.userId = decoded.userId;
    }
    next();
  } catch (error) {
    // В случае ошибки просто продолжаем без userId
    next();
  }
};

module.exports = { authenticateToken, optionalAuthenticate };
