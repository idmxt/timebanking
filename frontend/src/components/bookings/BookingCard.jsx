import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User as UserIcon,
  Star,
  CheckCircle2,
  XCircle,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { formatDistanceToNow, isPast } from 'date-fns';
import { ru } from 'date-fns/locale';

const BookingCard = ({ booking, isProvider, onAction, onReview }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const bookingDateTime = new Date(`${booking.booking_date}T${booking.booking_time}`);
      if (isPast(bookingDateTime)) {
        setTimeLeft('Время пришло!');
      } else {
        setTimeLeft(formatDistanceToNow(bookingDateTime, { addSuffix: true, locale: ru }));
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [booking.booking_date, booking.booking_time]);

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-accent/10 text-accent border-accent/20',
      accepted: 'bg-secondary/10 text-secondary border-secondary/20',
      completed: 'bg-success/10 text-success border-success/20',
      cancelled: 'bg-error/10 text-error border-error/20',
      declined: 'bg-error/10 text-error border-error/20'
    };

    const labels = {
      pending: 'Ожидает',
      accepted: 'Принято',
      completed: 'Завершено',
      cancelled: 'Отменено',
      declined: 'Отклонено'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${styles[status]}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="card p-6 sm:p-8 bg-white group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden relative">
      {/* Decorative blob */}
      <div className="blob w-32 h-32 bg-primary/5 -top-16 -right-16 group-hover:scale-150 transition-transform duration-700" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
        {/* Service & Details */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            {getStatusBadge(booking.status)}
            <span className="text-xs font-bold text-text-muted">#TB-{booking.id}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl mb-4 group-hover:text-primary transition-colors font-display">
            {booking.service_title}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 text-text-secondary">
              <div className="w-12 h-12 rounded-2xl bg-warm-cream flex items-center justify-center text-primary shadow-sm border border-primary/5">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-0.5">Дата встречи</p>
                <p className="font-bold text-sm">
                  {new Date(booking.booking_date).toLocaleDateString('ru-RU')} в {booking.booking_time}
                </p>
                {booking.status === 'accepted' && (
                  <p className="text-[10px] text-primary font-bold animate-pulse mt-0.5">
                    {timeLeft}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-text-secondary">
              <div className="w-12 h-12 rounded-2xl bg-warm-cream flex items-center justify-center text-secondary shadow-sm border border-secondary/5">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-0.5">Длительность</p>
                <p className="font-bold text-sm">{booking.duration} ч. общения</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile Info */}
        <div className="lg:w-72 p-5 rounded-3xl bg-warm-cream/40 border border-primary/5 group/profile transition-all">
          <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-4">
            {isProvider ? 'Заказчик' : 'Провайдер'}
          </p>
          <div className="flex items-center gap-4">
            <div className="relative">
              {(isProvider ? booking.requester_avatar : booking.provider_avatar) ? (
                <img
                  src={isProvider ? booking.requester_avatar : booking.provider_avatar}
                  alt="avatar"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-lifted"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border-2 border-white shadow-lifted">
                  <UserIcon size={28} />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-white shadow-sm" />
            </div>
            <div>
              <p className="font-bold text-text-primary group-hover/profile:text-primary transition-colors">
                {isProvider ? booking.requester_name : booking.provider_name}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-accent/10 text-accent">
                  <Star size={12} className="fill-current" />
                  <span className="text-xs font-bold">4.9</span>
                </div>
                <span className="text-[10px] text-text-muted font-bold uppercase">50+ отзывов</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row lg:flex-col gap-3 min-w-[180px]">
          {booking.status === 'pending' && isProvider && (
            <>
              <button
                onClick={() => onAction(booking.id, 'accept')}
                className="flex-1 btn-primary !py-3.5 flex items-center justify-center gap-2 group/btn"
              >
                <CheckCircle2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                <span>Принять</span>
              </button>
              <button
                onClick={() => onAction(booking.id, 'decline')}
                className="flex-1 btn-outline !py-3.5 flex items-center justify-center gap-2 border-error text-error hover:bg-error/5 group/btn"
              >
                <XCircle size={18} className="group-hover/btn:scale-110 transition-transform" />
                <span>Отклонить</span>
              </button>
            </>
          )}

          {booking.status === 'pending' && !isProvider && (
            <button
              onClick={() => onAction(booking.id, 'cancel')}
              className="flex-1 btn-outline !py-3.5 flex items-center justify-center gap-2 border-error text-error hover:bg-error/5"
            >
              <XCircle size={18} />
              <span>Отменить запрос</span>
            </button>
          )}

          {booking.status === 'accepted' && (
            <button
              onClick={() => onAction(booking.id, 'confirm')}
              className={`
                flex-1 btn-secondary !py-3.5 flex items-center justify-center gap-2 transition-all
                ${((isProvider && booking.provider_confirmed) || (!isProvider && booking.requester_confirmed))
                  ? 'opacity-50 cursor-not-allowed scale-95'
                  : 'hover:scale-105 active:scale-95'}
              `}
              disabled={(isProvider && booking.provider_confirmed) || (!isProvider && booking.requester_confirmed)}
            >
              <CheckCircle2 size={18} />
              <span>
                {(isProvider && booking.provider_confirmed) || (!isProvider && booking.requester_confirmed)
                  ? 'Ожидаем вторую сторону'
                  : 'Завершить встречу'}
              </span>
            </button>
          )}

          {booking.status === 'completed' && (
            <button
              onClick={() => onReview(booking)}
              className="flex-1 btn-primary !py-3.5 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
            >
              <Star size={18} className="fill-current" />
              <span>Оставить отзыв</span>
            </button>
          )}

          <button
            onClick={() => navigate(`/messages/${isProvider ? booking.requester_id : booking.provider_id}`)}
            className="flex-1 btn-outline !py-3.5 flex items-center justify-center gap-2 hover:bg-secondary/5 border-secondary/20 text-secondary"
          >
            <MessageSquare size={18} />
            <span>Написать</span>
          </button>
        </div>
      </div>

      {/* Booking Message */}
      {booking.message && (
        <div className="mt-8 p-5 rounded-2xl bg-warm-cream/30 border border-primary/5 relative z-10 group/msg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={14} className="text-text-muted" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Комментарий к бронированию</p>
          </div>
          <p className="text-sm text-text-secondary italic leading-relaxed">
            "{booking.message}"
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingCard;
