import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar, MessageSquare, AlertCircle, CheckCircle, Wallet } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

const BookingForm = ({ service, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState(new Date());
  const [formData, setFormData] = useState({
    booking_time: '12:00',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const hasEnoughBalance = user?.time_balance >= service.duration;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasEnoughBalance) {
      setError('Недостаточно времени на балансе для этой услуги');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/bookings', {
        service_id: service.id,
        booking_date: startDate.toISOString().split('T')[0],
        booking_time: formData.booking_time,
        message: formData.message,
        duration: service.duration,
        provider_id: service.user_id
      });
      onSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-text-primary/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-[32px] shadow-lifted overflow-hidden animate-fade-in border border-primary/5">
        {/* Header */}
        <div className="p-8 bg-gradient-to-br from-primary to-primary-dark text-white relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Calendar size={20} className="text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold">Бронирование</h2>
          </div>
          <p className="text-white/80 text-sm italic font-medium">Услуга: {service.title}</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-2xl text-error text-sm flex items-center gap-3 animate-shake">
              <AlertCircle size={20} />
              <span className="font-bold">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Date Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider ml-1">
                  Дата
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    className="input-field w-full"
                    min={new Date().toISOString().split('T')[0]}
                    value={startDate.toISOString().split('T')[0]}
                    onChange={(e) => setStartDate(new Date(e.target.value))}
                  />
                </div>
              </div>

              {/* Time Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider ml-1">
                  Время
                </label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={18} />
                  <input
                    type="time"
                    required
                    className="input-field !pl-12 w-full"
                    value={formData.booking_time}
                    onChange={(e) => setFormData({ ...formData, booking_time: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider ml-1">
                Сообщение для мастера
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 text-text-muted" size={18} />
                <textarea
                  className="input-field !pl-12 resize-none h-32"
                  placeholder="Опишите ваши пожелания или детали..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
            </div>

            {/* Balance Check */}
            <div className={`p-6 rounded-2xl border transition-all ${hasEnoughBalance ? 'bg-secondary/5 border-secondary/20' : 'bg-error/5 border-error/20'
              }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wallet size={18} className={hasEnoughBalance ? 'text-secondary' : 'text-error'} />
                  <span className="text-sm font-bold text-text-secondary">Ваш баланс:</span>
                </div>
                <span className={`text-xl font-display font-bold ${hasEnoughBalance ? 'text-secondary' : 'text-error'}`}>
                  {user?.time_balance?.toFixed(1) || 0}ч
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-primary" />
                  <span className="text-sm font-bold text-text-secondary">Стоимость:</span>
                </div>
                <span className="text-xl font-display font-bold text-primary">
                  {service.duration}ч
                </span>
              </div>

              {!hasEnoughBalance && (
                <div className="mt-4 pt-4 border-t border-error/10 flex items-center gap-2 text-error">
                  <AlertCircle size={16} />
                  <span className="text-xs font-bold">Недостаточно времени. Попробуйте заработать часы!</span>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={loading || !hasEnoughBalance}
                className={`flex-1 btn-primary !py-4 shadow-lifted flex items-center justify-center gap-2 ${(!hasEnoughBalance || loading) ? 'opacity-50 grayscale' : ''
                  }`}
              >
                {loading ? 'Создание...' : (
                  <>
                    <CheckCircle size={20} />
                    Подтвердить
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
