const database = require('../config/database');
const User = require('../models/User');
const Service = require('../models/Service');

// Получить общую статистику платформы
const getStats = async (req, res) => {
    try {
        const stats = await database.get(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM services) as total_services,
        (SELECT COUNT(*) FROM bookings WHERE status = 'completed') as total_completed_exchanges,
        (SELECT COALESCE(SUM(hours), 0) FROM time_transactions WHERE transaction_type = 'service') as total_hours_exchanged
    `);

        // Рост пользователей за последние 7 дней
        const userGrowth = await database.all(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM users
      WHERE created_at >= DATE('now', '-7 days')
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

        // Распределение услуг по категориям
        const categoryDistribution = await database.all(`
      SELECT category, COUNT(*) as count
      FROM services
      GROUP BY category
      ORDER BY count DESC
    `);

        // Последние 5 пользователей
        const recentUsers = await database.all(`
      SELECT id, name, email, avatar_url, created_at, status
      FROM users
      ORDER BY created_at DESC
      LIMIT 5
    `);

        // Последние 5 транзакций
        const recentTransactions = await database.all(`
      SELECT t.*, u_to.name as to_user_name, u_from.name as from_user_name
      FROM time_transactions t
      JOIN users u_to ON t.to_user_id = u_to.id
      LEFT JOIN users u_from ON t.from_user_id = u_from.id
      ORDER BY t.created_at DESC
      LIMIT 5
    `);

        // Последние 5 бронирований
        const recentBookings = await database.all(`
      SELECT b.*, s.title as service_title, u_req.name as requester_name, u_prov.name as provider_name
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN users u_req ON b.requester_id = u_req.id
      JOIN users u_prov ON b.provider_id = u_prov.id
      ORDER BY b.created_at DESC
      LIMIT 5
    `);

        res.json({
            summary: stats,
            charts: {
                userGrowth,
                categoryDistribution
            },
            activity: {
                recentUsers,
                recentTransactions,
                recentBookings
            }
        });
    } catch (error) {
        console.error('Admin get stats error:', error);
        res.status(500).json({ error: 'Failed to get stats' });
    }
};

// Список всех пользователей для управления
const getUsers = async (req, res) => {
    try {
        const users = await database.all(`
      SELECT id, email, name, role, status, time_balance, rating, total_reviews, created_at
      FROM users
      ORDER BY created_at DESC
    `);
        res.json({ users });
    } catch (error) {
        console.error('Admin get users error:', error);
        res.status(500).json({ error: 'Failed to get users' });
    }
};

// Обновить статус/роль пользователя
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, status } = req.body;

        const updates = [];
        const values = [];

        if (role) {
            updates.push('role = ?');
            values.push(role);
        }
        if (status) {
            updates.push('status = ?');
            values.push(status);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(id);
        await database.run(`
      UPDATE users 
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, values);

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Admin update user error:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

// Список всех услуг для модерации
const getServices = async (req, res) => {
    try {
        const services = await database.all(`
      SELECT s.*, u.name as provider_name
      FROM services s
      JOIN users u ON s.user_id = u.id
      ORDER BY s.created_at DESC
    `);
        res.json({ services });
    } catch (error) {
        console.error('Admin get services error:', error);
        res.status(500).json({ error: 'Failed to get services' });
    }
};

// Модерация услуги
const moderateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { moderation_status, is_active } = req.body;

        const updates = [];
        const values = [];

        if (moderation_status) {
            updates.push('moderation_status = ?');
            values.push(moderation_status);
        }
        if (is_active !== undefined) {
            updates.push('is_active = ?');
            values.push(is_active ? 1 : 0);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(id);
        await database.run(`
      UPDATE services 
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, values);

        res.json({ message: 'Service updated successfully' });
    } catch (error) {
        console.error('Admin moderate service error:', error);
        res.status(500).json({ error: 'Failed to moderate service' });
    }
};

module.exports = {
    getStats,
    getUsers,
    updateUser,
    getServices,
    moderateService
};
