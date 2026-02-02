const database = require('../config/database');

// Переключить статус избранного (добавить или удалить)
const toggleFavorite = async (req, res) => {
    try {
        const userId = req.userId;
        const serviceId = parseInt(req.params.serviceId);

        if (!serviceId) {
            return res.status(400).json({ error: 'Service ID is required' });
        }

        // Проверяем, есть ли уже в избранном
        const existing = await database.get(
            'SELECT id FROM favorites WHERE user_id = ? AND service_id = ?',
            [userId, serviceId]
        );

        if (existing) {
            // Если есть - удаляем
            await database.run(
                'DELETE FROM favorites WHERE user_id = ? AND service_id = ?',
                [userId, serviceId]
            );
            res.json({ message: 'Removed from favorites', isFavorite: false });
        } else {
            // Если нет - добавляем
            await database.run(
                'INSERT INTO favorites (user_id, service_id) VALUES (?, ?)',
                [userId, serviceId]
            );
            res.json({ message: 'Added to favorites', isFavorite: true });
        }
    } catch (error) {
        console.error('Toggle favorite error:', error);
        res.status(500).json({ error: 'Failed to toggle favorite' });
    }
};

// Получить список избранных услуг пользователя
const getFavorites = async (req, res) => {
    try {
        const userId = req.userId;

        const favorites = await database.all(`
      SELECT 
        s.*,
        u.name as provider_name,
        u.avatar_url as provider_avatar,
        (SELECT AVG(rating) FROM reviews WHERE reviewed_user_id = s.user_id) as average_rating
      FROM services s
      JOIN favorites f ON s.id = f.service_id
      JOIN users u ON s.user_id = u.id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `, [userId]);

        res.json({ favorites });
    } catch (error) {
        console.error('Get favorites error:', error);
        res.status(500).json({ error: 'Failed to get favorites' });
    }
};

module.exports = {
    toggleFavorite,
    getFavorites
};
