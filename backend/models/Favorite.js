const database = require('../config/database');

class Favorite {
    // Toggle favorite status
    static async toggle(userId, serviceId) {
        // Check if exists
        const existing = await database.get(
            'SELECT id FROM favorites WHERE user_id = ? AND service_id = ?',
            [userId, serviceId]
        );

        if (existing) {
            await database.run(
                'DELETE FROM favorites WHERE user_id = ? AND service_id = ?',
                [userId, serviceId]
            );
            return { is_favorited: false };
        } else {
            await database.run(
                'INSERT INTO favorites (user_id, service_id) VALUES (?, ?)',
                [userId, serviceId]
            );
            return { is_favorited: true };
        }
    }

    // Check if service is favorited
    static async isFavorited(userId, serviceId) {
        if (!userId) return false;
        const result = await database.get(
            'SELECT id FROM favorites WHERE user_id = ? AND service_id = ?',
            [userId, serviceId]
        );
        return !!result;
    }

    // Get user's favorites
    static async findByUserId(userId) {
        const sql = `
      SELECT 
        s.*,
        u.name as provider_name,
        u.avatar_url as provider_avatar,
        u.rating as provider_rating
      FROM services s
      JOIN favorites f ON s.id = f.service_id
      JOIN users u ON s.user_id = u.id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `;
        return await database.all(sql, [userId]);
    }
}

module.exports = Favorite;
