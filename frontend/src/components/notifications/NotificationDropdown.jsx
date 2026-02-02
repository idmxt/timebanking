import React from 'react';
import { Bell, Check, Trash2, Calendar, MessageSquare, Star, Clock, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useNotifications } from '../../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

const NotificationDropdown = ({ onClose }) => {
    const { notifications, loading, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
    const navigate = useNavigate();

    const getIcon = (type) => {
        switch (type) {
            case 'booking_request':
            case 'booking_accepted':
            case 'booking_declined':
            case 'booking_cancelled':
            case 'booking_completed':
                return <Calendar size={16} />;
            case 'new_message':
                return <MessageSquare size={16} />;
            case 'new_review':
                return <Star size={16} />;
            case 'balance_update':
                return <Clock size={16} />;
            default:
                return <Bell size={16} />;
        }
    };

    const getStyle = (type) => {
        switch (type) {
            case 'booking_request':
                return 'bg-blue-100 text-blue-600';
            case 'booking_accepted':
            case 'booking_completed':
                return 'bg-green-100 text-green-600';
            case 'booking_declined':
            case 'booking_cancelled':
                return 'bg-red-100 text-red-600';
            case 'balance_update':
                return 'bg-amber-100 text-amber-600';
            default:
                return 'bg-primary/10 text-primary';
        }
    };

    const handleNotificationClick = (notification) => {
        if (!notification.is_read) {
            markAsRead(notification.id);
        }

        // Navigation logic based on notification type/data
        if (notification.type.startsWith('booking')) {
            navigate('/bookings');
        } else if (notification.type === 'new_message') {
            navigate('/messages');
        }

        onClose();
    };

    return (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-[32px] shadow-lifted border border-primary/5 overflow-hidden animate-fade-in z-50">
            <div className="p-6 border-b border-surface-dark flex justify-between items-center bg-white/50 backdrop-blur-sm">
                <h3 className="font-display text-xl font-bold">Уведомления</h3>
                <button
                    onClick={markAllAsRead}
                    className="text-xs font-bold text-primary hover:underline"
                >
                    Прочитать все
                </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                {loading ? (
                    <div className="p-10 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
                        <p className="text-sm text-text-muted">Загрузка...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-10 text-center">
                        <div className="w-16 h-16 bg-warm-cream rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell size={28} className="text-text-muted" />
                        </div>
                        <p className="text-text-secondary font-medium">У вас пока нет уведомлений</p>
                    </div>
                ) : (
                    <div className="divide-y divide-surface-dark">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`
                  relative p-5 hover:bg-warm-cream transition-colors cursor-pointer group
                  ${!notification.is_read ? 'bg-primary/5' : ''}
                `}
                            >
                                {!notification.is_read && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                                )}

                                <div className="flex gap-4">
                                    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${getStyle(notification.type)}`}>
                                        {getIcon(notification.type)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm leading-snug mb-1 ${!notification.is_read ? 'font-bold text-text-primary' : 'text-text-secondary'}`}>
                                            {notification.message}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: ru })}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteNotification(notification.id);
                                        }}
                                        className="shrink-0 p-2 text-text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {notifications.length > 0 && (
                <div className="p-4 bg-warm-cream/30 border-t border-surface-dark">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 bg-white hover:bg-primary/5 text-primary text-sm font-bold rounded-2xl border border-primary/10 transition-colors flex items-center justify-center gap-2"
                    >
                        Закрыть
                        <ArrowRight size={14} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
