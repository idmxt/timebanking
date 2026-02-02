import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, TrendingDown, Calendar, User, Search, Filter, ArrowLeft, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [transRes, statsRes] = await Promise.all([
                api.get('/users/me/transactions'),
                api.get('/dashboard/stats')
            ]);
            setTransactions(transRes.data.transactions);
            setStats(statsRes.data.time_stats);
        } catch (error) {
            console.error('Failed to load transaction data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTransactionIcon = (type) => {
        switch (type) {
            case 'service': return <Clock size={18} />;
            case 'bonus': return <TrendingUp size={18} />;
            case 'refund': return <ArrowLeft size={18} />;
            default: return <Clock size={18} />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-warm-cream">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-warm-cream pb-12">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <Link to="/dashboard" className="p-2 rounded-xl bg-white text-text-muted hover:text-primary transition-colors">
                                <ArrowLeft size={20} />
                            </Link>
                            <h1 className="text-4xl font-display font-bold text-text-primary">История времени</h1>
                        </div>
                        <p className="text-text-secondary">Все начисления и списания ваших часов</p>
                    </div>

                    <div className="flex items-center gap-4 p-6 bg-white rounded-[24px] shadow-soft">
                        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Текущий баланс</p>
                            <p className="text-3xl font-display font-bold text-text-primary">
                                {stats?.current_balance.toFixed(1)}ч
                            </p>
                        </div>
                    </div>
                </div>

                {/* Dashboard Stats Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-[24px] shadow-soft border border-primary/5">
                        <div className="flex items-center gap-3 mb-2 text-success">
                            <TrendingUp size={20} />
                            <span className="text-sm font-bold uppercase tracking-wider">Заработано</span>
                        </div>
                        <p className="text-3xl font-display font-bold">+{stats?.total_earned.toFixed(1)}ч</p>
                    </div>
                    <div className="bg-white p-6 rounded-[24px] shadow-soft border border-primary/5">
                        <div className="flex items-center gap-3 mb-2 text-error">
                            <TrendingDown size={20} />
                            <span className="text-sm font-bold uppercase tracking-wider">Потрачено</span>
                        </div>
                        <p className="text-3xl font-display font-bold">-{stats?.total_spent.toFixed(1)}ч</p>
                    </div>
                    <div className="bg-white p-6 rounded-[24px] shadow-soft border border-primary/5">
                        <div className="flex items-center gap-3 mb-2 text-secondary">
                            <Calendar size={20} />
                            <span className="text-sm font-bold uppercase tracking-wider">Обменов</span>
                        </div>
                        <p className="text-3xl font-display font-bold">{stats?.completed_exchanges || 0}</p>
                    </div>
                </div>

                {/* Filters & Search (Mockup for now) */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-primary/10 rounded-xl text-sm font-bold text-text-secondary hover:bg-warm-cream transition-colors">
                            <Filter size={16} />
                            Фильтры
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-primary/10 rounded-xl text-sm font-bold text-text-secondary hover:bg-warm-cream transition-colors">
                            <Download size={16} />
                            Экспорт
                        </button>
                    </div>
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Поиск по описанию..."
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-primary/10 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white rounded-[32px] shadow-soft border border-primary/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-warm-cream/30 border-b border-primary/5">
                                    <th className="px-8 py-5 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Дата</th>
                                    <th className="px-8 py-5 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Тип</th>
                                    <th className="px-8 py-5 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Описание</th>
                                    <th className="px-8 py-5 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Пользователь</th>
                                    <th className="px-8 py-5 text-right text-xs font-bold text-text-muted uppercase tracking-wider">Сумма</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/5">
                                {transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center">
                                            <div className="w-16 h-16 bg-warm-cream rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Clock size={24} className="text-text-muted" />
                                            </div>
                                            <p className="text-text-secondary font-medium">Транзакций пока нет</p>
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map((t) => (
                                        <tr key={t.id} className="hover:bg-warm-cream/20 transition-colors">
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold text-text-primary">
                                                    {new Date(t.created_at).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                </p>
                                                <p className="text-[10px] text-text-muted uppercase tracking-tighter mt-0.5">
                                                    {new Date(t.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.transaction_type === 'service' ? 'bg-blue-100 text-blue-600' :
                                                        t.transaction_type === 'bonus' ? 'bg-amber-100 text-amber-600' :
                                                            'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {getTransactionIcon(t.transaction_type)}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 min-w-[200px]">
                                                <p className="text-sm font-bold text-text-primary mb-0.5">
                                                    {t.service_title || (t.transaction_type === 'bonus' ? 'Бонус за регистрацию' : t.description)}
                                                </p>
                                                <p className="text-xs text-text-muted line-clamp-1 italic">
                                                    {t.transaction_type === 'service' ? `Услуга: ${t.description}` : t.description}
                                                </p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-7 h-7 rounded-lg bg-secondary text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                                                        {t.direction === '+' ? t.from_user_name?.charAt(0) : t.to_user_name?.charAt(0)}
                                                    </div>
                                                    <p className="text-sm font-medium text-text-secondary">
                                                        {t.direction === '+' ? (t.from_user_name || 'Система') : t.to_user_name}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className={`text-lg font-display font-bold ${t.direction === '+' ? 'text-success' : 'text-error'}`}>
                                                    {t.direction}{t.hours}ч
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transactions;
