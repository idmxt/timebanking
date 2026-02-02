import React, { useState, useEffect } from 'react';
import {
    Users,
    Shield,
    BarChart3,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Search,
    Clock,
    UserX,
    UserCheck,
    Eye,
    ArrowUpRight,
    ArrowDownRight,
    History,
    Activity
} from 'lucide-react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const COLORS = ['#D97D66', '#879476', '#E9C46A', '#2A9D8F', '#264653', '#F4A261', '#E76F51'];

const AdminPanel = () => {
    const { user: currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('stats');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [services, setServices] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'stats') {
                const res = await api.get('/admin/stats');
                setStats(res.data);
            } else if (activeTab === 'users') {
                const res = await api.get('/admin/users');
                setUsers(res.data.users);
            } else if (activeTab === 'services') {
                const res = await api.get('/admin/services');
                setServices(res.data.services);
            }
        } catch (error) {
            console.error('Failed to load admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUserStatus = async (userId, status) => {
        try {
            await api.put(`/admin/users/${userId}`, { status });
            loadData();
        } catch (error) {
            alert('Failed to update user status');
        }
    };

    const handleModerateService = async (serviceId, status) => {
        try {
            await api.put(`/admin/services/${serviceId}`, {
                moderation_status: status,
                is_active: status === 'approved'
            });
            loadData();
        } catch (error) {
            alert('Failed to moderate service');
        }
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredServices = services.filter(s =>
        s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.provider_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (currentUser?.role !== 'admin') {
        return <div className="p-20 text-center">Unauthorized</div>;
    }

    return (
        <div className="min-h-screen bg-warm-cream pb-12">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 rounded-2xl bg-terracotta text-white">
                        <Shield size={28} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-display font-medium">Панель администратора</h1>
                        <p className="text-text-secondary">Управление платформой и модерация</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 p-1 bg-white rounded-2xl shadow-soft w-fit">
                    {[
                        { id: 'stats', label: 'Статистика', icon: BarChart3 },
                        { id: 'users', label: 'Пользователи', icon: Users },
                        { id: 'services', label: 'Услуги', icon: Clock }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all
                                ${activeTab === tab.id
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'text-text-muted hover:bg-warm-cream'}
                            `}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        {activeTab === 'stats' && stats && (
                            <div className="space-y-8">
                                {/* Summary Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[
                                        { label: 'Всего пользователей', value: stats.summary.total_users, color: 'text-primary' },
                                        { label: 'Активных услуг', value: stats.summary.total_services, color: 'text-secondary' },
                                        { label: 'Завершенных обменов', value: stats.summary.total_completed_exchanges, color: 'text-terracotta' },
                                        { label: 'Кредитов в обороте', value: stats.summary.total_hours_exchanged.toFixed(1), color: 'text-accent' }
                                    ].map((card, i) => (
                                        <div key={i} className="card p-8 bg-white hover:shadow-lifted transition-shadow group">
                                            <p className="text-xs text-text-muted font-bold uppercase tracking-widest mb-3 group-hover:text-primary transition-colors">{card.label}</p>
                                            <p className={`text-5xl font-display font-bold ${card.color}`}>{card.value}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Main Charts */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 card p-8 bg-white min-h-[400px]">
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-xl font-bold flex items-center gap-2">
                                                <Activity size={20} className="text-primary" />
                                                Прирост пользователей
                                            </h3>
                                            <span className="text-xs font-bold text-text-muted bg-warm-cream px-3 py-1 rounded-full">Последние 7 дней</span>
                                        </div>
                                        <div className="h-[300px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={stats.charts.userGrowth}>
                                                    <defs>
                                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#879476" stopOpacity={0.3} />
                                                            <stop offset="95%" stopColor="#879476" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F1ED" />
                                                    <XAxis
                                                        dataKey="date"
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tick={{ fontSize: 10, fill: '#8C8B87' }}
                                                        tickFormatter={(val) => val.split('-').slice(1).reverse().join('.')}
                                                    />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8C8B87' }} />
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                                    />
                                                    <Area type="monotone" dataKey="count" stroke="#879476" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="card p-8 bg-white flex flex-col items-center">
                                        <h3 className="text-xl font-bold mb-8 self-start">Темы услуг</h3>
                                        <div className="h-[250px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={stats.charts.categoryDistribution}
                                                        innerRadius={60}
                                                        outerRadius={80}
                                                        paddingAngle={5}
                                                        dataKey="count"
                                                        nameKey="category"
                                                    >
                                                        {stats.charts.categoryDistribution.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-4 w-full h-full max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                                            {stats.charts.categoryDistribution.map((item, index) => (
                                                <div key={item.category} className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                                    <span className="text-[10px] text-text-muted font-bold truncate underline decoration-primary/20">{item.category}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="card p-8 bg-white">
                                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                            <History size={20} className="text-secondary" />
                                            Новые пользователи
                                        </h3>
                                        <div className="space-y-4">
                                            {stats.activity.recentUsers.map(u => (
                                                <div key={u.id} className="flex items-center gap-4 p-3 hover:bg-warm-cream/30 rounded-2xl transition-colors border border-transparent hover:border-primary/5">
                                                    {u.avatar_url ? (
                                                        <img src={`http://localhost:5001${u.avatar_url}`} alt={u.name} className="w-10 h-10 rounded-xl object-cover" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                                                            {u.name.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <p className="text-sm font-bold text-text-primary">{u.name}</p>
                                                        <p className="text-xs text-text-muted">{u.email}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs font-bold text-text-muted uppercase tracking-tighter">
                                                            {new Date(u.created_at).toLocaleDateString('ru-RU')}
                                                        </p>
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${u.status === 'active' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                                                            {u.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => setActiveTab('users')}
                                                className="w-full text-center text-xs font-bold text-primary hover:underline mt-2"
                                            >
                                                Смотреть всех пользователей
                                            </button>
                                        </div>
                                    </div>

                                    <div className="card p-8 bg-white">
                                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                            <ArrowUpRight size={20} className="text-terracotta" />
                                            Последние транзакции
                                        </h3>
                                        <div className="space-y-4">
                                            {stats.activity.recentTransactions.map(t => (
                                                <div key={t.id} className="flex items-center gap-4 p-3 hover:bg-warm-cream/30 rounded-2xl transition-colors border border-transparent hover:border-primary/5">
                                                    <div className={`p-2 rounded-xl ${t.transaction_type === 'bonus' ? 'bg-accent/10 text-accent' : 'bg-secondary/10 text-secondary'}`}>
                                                        {t.transaction_type === 'bonus' ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-1.5 overflow-hidden">
                                                            <span className="text-sm font-bold text-text-primary truncate">{t.from_user_name || 'System'}</span>
                                                            <ArrowUpRight size={12} className="text-text-muted" />
                                                            <span className="text-sm font-bold text-text-primary truncate">{t.to_user_name}</span>
                                                        </div>
                                                        <p className="text-xs text-text-muted truncate underline decoration-primary/5">{t.description || t.transaction_type}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-bold text-terracotta italic">{t.hours > 0 ? `+${t.hours}` : t.hours}ч</p>
                                                        <p className="text-[10px] text-text-muted font-bold tracking-tighter">
                                                            {new Date(t.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            {stats.activity.recentTransactions.length === 0 && (
                                                <div className="text-center py-10">
                                                    <p className="text-sm text-text-muted">Транзакций пока нет</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Recent Activities Row 2 */}
                        <div className="grid grid-cols-1 gap-8">
                            <div className="card p-8 bg-white">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <Clock size={20} className="text-primary" />
                                    Последние бронирования
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-[10px] font-bold uppercase text-text-muted tracking-widest border-b border-surface-dark">
                                                <th className="pb-4">Услуга</th>
                                                <th className="pb-4">Кто</th>
                                                <th className="pb-4">Кому</th>
                                                <th className="pb-4">Статус</th>
                                                <th className="pb-4 text-right">Дата</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-surface-dark">
                                            {stats.activity.recentBookings.map(b => (
                                                <tr key={b.id} className="group">
                                                    <td className="py-4 font-bold text-sm text-text-primary group-hover:text-primary transition-colors">{b.service_title}</td>
                                                    <td className="py-4 text-sm">{b.requester_name}</td>
                                                    <td className="py-4 text-sm">{b.provider_name}</td>
                                                    <td className="py-4">
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${b.status === 'completed' ? 'bg-success/10 text-success' :
                                                            b.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-warm-cream text-text-muted'
                                                            }`}>
                                                            {b.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 text-right text-xs text-text-muted font-bold">
                                                        {new Date(b.booking_date).toLocaleDateString('ru-RU')}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {(activeTab === 'users' || activeTab === 'services') && (
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <div className="relative max-w-md flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                <input
                                    type="text"
                                    placeholder={`Поиск по ${activeTab === 'users' ? 'имени или email' : 'названию или автору'}...`}
                                    className="w-full pl-11 pr-4 py-3 bg-white border border-primary/10 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <span className="bg-white px-4 py-3 rounded-xl border border-primary/5 text-sm font-bold text-text-muted flex items-center gap-2">
                                    Всего: {activeTab === 'users' ? filteredUsers.length : filteredServices.length}
                                </span>
                            </div>
                        </div>

                        <div className="bg-white rounded-[24px] shadow-soft overflow-hidden border border-primary/5">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-warm-cream/30 border-b border-primary/5">
                                        <tr>
                                            {activeTab === 'users' ? (
                                                <>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase">Пользователь</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase">Роль</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase">Статус</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase">Баланс</th>
                                                    <th className="px-6 py-4 text-right text-xs font-bold uppercase">Действия</th>
                                                </>
                                            ) : (
                                                <>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase">Услуга</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase">Автор</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase">Модерация</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase">Видимость</th>
                                                    <th className="px-6 py-4 text-right text-xs font-bold uppercase">Действия</th>
                                                </>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-primary/5">
                                        {activeTab === 'users' ? (
                                            filteredUsers.map(u => (
                                                <tr key={u.id} className="hover:bg-warm-cream/10 transition-colors group">
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                                                {u.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-text-primary">{u.name}</div>
                                                                <div className="text-xs text-text-muted">{u.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-terracotta/10 text-terracotta' : 'bg-warm-cream text-text-muted'}`}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${u.status === 'active' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                                                            {u.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-1.5 font-bold italic text-text-primary">
                                                            {u.time_balance.toFixed(1)}ч
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {u.status === 'active' ? (
                                                                <button
                                                                    onClick={() => handleUpdateUserStatus(u.id, 'blocked')}
                                                                    className="p-2 text-error hover:bg-error/10 rounded-xl transition-all"
                                                                    title="Заблокировать"
                                                                >
                                                                    <UserX size={18} />
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleUpdateUserStatus(u.id, 'active')}
                                                                    className="p-2 text-success hover:bg-success/10 rounded-xl transition-all"
                                                                    title="Разблокировать"
                                                                >
                                                                    <UserCheck size={18} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            filteredServices.map(s => (
                                                <tr key={s.id} className="hover:bg-warm-cream/10 transition-colors group">
                                                    <td className="px-6 py-5">
                                                        <div className="font-bold text-text-primary">{s.title}</div>
                                                        <div className="text-xs text-text-muted font-bold uppercase tracking-tighter">{s.category}</div>
                                                    </td>
                                                    <td className="px-6 py-5 text-sm font-medium text-text-secondary">{s.provider_name}</td>
                                                    <td className="px-6 py-5">
                                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${s.moderation_status === 'approved' ? 'bg-success/10 text-success' :
                                                            s.moderation_status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-error/10 text-error'
                                                            }`}>
                                                            {s.moderation_status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${s.is_active ? 'bg-primary/10 text-primary' : 'bg-text-muted/10 text-text-muted'}`}>
                                                            {s.is_active ? 'Видно' : 'Скрыто'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {s.moderation_status !== 'approved' && (
                                                                <button
                                                                    onClick={() => handleModerateService(s.id, 'approved')}
                                                                    className="p-2 text-success hover:bg-success/10 rounded-xl transition-all"
                                                                    title="Одобрить"
                                                                >
                                                                    <CheckCircle size={18} />
                                                                </button>
                                                            )}
                                                            {s.moderation_status !== 'rejected' && (
                                                                <button
                                                                    onClick={() => handleModerateService(s.id, 'rejected')}
                                                                    className="p-2 text-error hover:bg-error/10 rounded-xl transition-all"
                                                                    title="Отклонить"
                                                                >
                                                                    <XCircle size={18} />
                                                                </button>
                                                            )}
                                                            <a
                                                                href={`/services/${s.id}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="p-2 text-text-muted hover:bg-warm-cream rounded-xl transition-all"
                                                                title="Посмотреть на сайте"
                                                            >
                                                                <Eye size={18} />
                                                            </a>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
