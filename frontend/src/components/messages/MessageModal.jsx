import React, { useState } from 'react';
import { X, Send, MessageSquare, AlertCircle } from 'lucide-react';
import api from '../../utils/api';

const MessageModal = ({ service, onClose, onSuccess }) => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        setLoading(true);
        setError(null);

        try {
            await api.post('/messages', {
                receiver_id: service.provider_id,
                content: message.trim()
            });
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send message');
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
            <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-lifted overflow-hidden animate-fade-in border border-primary/5">
                {/* Header */}
                <div className="p-8 bg-gradient-to-br from-secondary to-secondary-dark text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                            <MessageSquare size={20} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-display font-bold">Написать мастеру</h2>
                    </div>
                    <p className="text-white/80 text-sm italic font-medium">Получатель: {service.provider_name}</p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-2xl text-error text-sm flex items-center gap-3">
                            <AlertCircle size={20} />
                            <span className="font-bold">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider ml-1">
                                Сообщение об услуге: {service.title}
                            </label>
                            <textarea
                                autoFocus
                                className="input-field resize-none h-40 !py-4"
                                placeholder="Здравствуйте! У меня есть вопрос по вашей услуге..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            />
                        </div>

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
                                disabled={loading || !message.trim()}
                                className={`flex-1 btn-secondary !bg-secondary !text-white !py-4 shadow-lifted flex items-center justify-center gap-2 ${(!message.trim() || loading) ? 'opacity-50 grayscale' : ''
                                    }`}
                            >
                                {loading ? 'Отправка...' : (
                                    <>
                                        <Send size={20} />
                                        Отправить
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

export default MessageModal;
