import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, TrendingUp, TrendingDown, Calendar, MessageSquare, Star, Plus, Search, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, recsRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/recommendations')
      ]);

      setStats(statsRes.data);
      setRecommendations(recsRes.data.services);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-warm-cream pb-12 animate-fade-in">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl mb-2">
          Привет, <span className="text-primary italic">{user?.name}</span>! 👋
        </h1>
        <p className="text-text-secondary text-base sm:text-lg">Вот что происходит в вашем timebank</p>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <Link
            to="/services/create"
            className="flex items-center gap-4 sm:gap-6 p-6 sm:p-8 card group"
          >
            <div className="icon-wrapper bg-primary flex-shrink-0">
              <div className="icon-glow" />
              <Plus size={28} className="relative z-10 text-white sm:hidden" />
              <Plus size={32} className="relative z-10 text-white hidden sm:block" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl mb-1 group-hover:text-primary transition-colors">Создать услугу</h3>
              <p className="text-text-muted text-sm sm:text-base">Предложите свои навыки сообществу</p>
            </div>
          </Link>

          <Link
            to="/services"
            className="flex items-center gap-4 sm:gap-6 p-6 sm:p-8 card group"
          >
            <div className="icon-wrapper bg-secondary flex-shrink-0">
              <div className="icon-glow" style={{ background: 'linear-gradient(135deg, #8B9D77 0%, #B3C5A1 100%)' }} />
              <Search size={28} className="relative z-10 text-white sm:hidden" />
              <Search size={32} className="relative z-10 text-white hidden sm:block" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl mb-1 group-hover:text-secondary transition-colors">Найти услугу</h3>
              <p className="text-text-muted text-sm sm:text-base">Найдите то, что вам нужно сегодня</p>
            </div>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Time Balance */}
          <div className="card p-8 bg-white">
            <div className="flex items-center justify-between mb-6">
              <div className="icon-wrapper !p-3">
                <div className="icon-glow" />
                <Clock size={24} className="relative z-10 text-white" />
              </div>
              <div className={`p-2 rounded-xl ${stats?.time_stats.current_balance >= 0 ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                {stats?.time_stats.current_balance >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              </div>
            </div>
            <p className="text-sm text-text-muted font-bold uppercase tracking-wider mb-2">Баланс времени</p>
            <p className="text-4xl font-display font-bold text-text-primary">
              {stats?.time_stats.current_balance.toFixed(1)}ч
            </p>
          </div>

          {/* Active Bookings */}
          <Link to="/bookings" className="card p-8 bg-white hover:scale-[1.02] transition-transform block">
            <div className="flex items-center justify-between mb-6">
              <div className="icon-wrapper !p-3 bg-secondary">
                <div className="icon-glow" style={{ background: 'linear-gradient(135deg, #8B9D77 0%, #B3C5A1 100%)' }} />
                <Calendar size={24} className="relative z-10 text-white" />
              </div>
            </div>
            <p className="text-sm text-text-muted font-bold uppercase tracking-wider mb-2">Активные брони</p>
            <p className="text-4xl font-display font-bold text-text-primary">
              {stats?.active_bookings || 0}
            </p>
          </Link>

          {/* Completed Exchanges */}
          <div className="card p-8 bg-white">
            <div className="flex items-center justify-between mb-6">
              <div className="icon-wrapper !p-3 bg-accent">
                <div className="icon-glow" style={{ background: 'linear-gradient(135deg, #D4A574 0%, #E8C9A0 100%)' }} />
                <Star size={24} className="relative z-10 text-white" />
              </div>
            </div>
            <p className="text-sm text-text-muted font-bold uppercase tracking-wider mb-2">Завершено</p>
            <p className="text-4xl font-display font-bold text-text-primary">
              {stats?.time_stats.completed_exchanges || 0}
            </p>
          </div>

          {/* Unread Messages */}
          <Link to="/messages" className="card p-8 bg-white hover:scale-[1.02] transition-transform block">
            <div className="flex items-center justify-between mb-6">
              <div className="icon-wrapper !p-3 bg-secondary">
                <div className="icon-glow" style={{ background: 'linear-gradient(135deg, #8B9D77 0%, #B3C5A1 100%)' }} />
                <MessageSquare size={24} className="relative z-10 text-white" />
              </div>
              {stats?.unread_messages > 0 && (
                <span className="w-8 h-8 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  {stats.unread_messages}
                </span>
              )}
            </div>
            <p className="text-sm text-text-muted font-bold uppercase tracking-wider mb-2">Сообщения</p>
            <p className="text-4xl font-display font-bold text-text-primary">
              {stats?.unread_messages || 0}
            </p>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <div className="lg:col-span-2 card p-8 bg-white">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl m-0">Последние транзакции</h3>
              <Link to="/transactions" className="text-sm font-bold text-secondary hover:underline">Все транзакции</Link>
            </div>

            {stats?.recent_transactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-text-muted">Транзакций пока нет</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats?.recent_transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-5 rounded-2xl bg-warm-cream/30 border border-primary/5 hover:border-primary/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${transaction.direction === '+' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                        {transaction.direction}{transaction.hours}ч
                      </div>
                      <div>
                        <p className="font-bold text-text-primary m-0">{transaction.description}</p>
                        <p className="text-xs text-text-muted m-0">{new Date(transaction.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</p>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-text-muted" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div className="card p-8 bg-white overflow-hidden relative">
            <div className="blob w-40 h-40 bg-accent/10 -top-20 -right-20" />
            <h3 className="text-2xl mb-8 relative z-10">Рекомендуем</h3>
            <div className="space-y-4 relative z-10">
              {recommendations.slice(0, 4).map((service) => (
                <Link
                  key={service.id}
                  to={`/services/${service.id}`}
                  className="block p-4 rounded-xl border border-surface-dark hover:border-primary/30 hover:bg-warm-cream/20 transition-all group"
                >
                  <p className="font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">{service.title}</p>
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <div className="flex items-center gap-1.5">
                      <Star size={14} className="fill-accent text-accent" />
                      <span className="font-bold text-text-secondary">{service.provider_rating.toFixed(1)}</span>
                    </div>
                    <span className="bg-surface-dark px-2 py-1 rounded-lg font-bold">{service.duration}ч</span>
                  </div>
                </Link>
              ))}
            </div>
            <Link
              to="/services"
              className="btn-secondary !w-full !text-center !py-3 !mt-8 !text-base"
            >
              Смотреть все
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
