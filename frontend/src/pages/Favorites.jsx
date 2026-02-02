import React, { useState, useEffect } from 'react';
import { Heart, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ServiceCard from '../components/services/ServiceCard';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            setLoading(true);
            const res = await api.get('/favorites');
            setFavorites(res.data.favorites);
        } catch (error) {
            console.error('Failed to load favorites:', error);
            setError('Не удалось загрузить избранное');
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
        <div className="min-h-screen bg-warm-cream pb-20 animate-fade-in">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 pt-12 pb-8 text-center sm:text-left">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary/10 text-primary mb-6">
                    <Heart size={32} fill="currentColor" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-display mb-4">
                    Мое <span className="text-primary italic">избранное</span>
                </h1>
                <p className="text-text-secondary text-lg max-w-2xl">
                    Услуги, которые вы сохранили для быстрого доступа. Время бесценно, выбирайте лучшее!
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                {error ? (
                    <div className="bg-red-50 border border-red-100 rounded-3xl p-8 text-center">
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={loadFavorites}
                            className="mt-4 text-primary font-bold hover:underline"
                        >
                            Попробовать снова
                        </button>
                    </div>
                ) : favorites.length === 0 ? (
                    <div className="bg-white rounded-[40px] p-12 text-center shadow-soft border border-surface-dark mt-8">
                        <div className="max-w-md mx-auto">
                            <div className="w-24 h-24 bg-warm-cream rounded-full flex items-center justify-center mx-auto mb-8">
                                <Heart size={40} className="text-text-muted" />
                            </div>
                            <h2 className="text-3xl font-display mb-4">Список пуст</h2>
                            <p className="text-text-secondary mb-10 leading-relaxed">
                                Вы еще не добавили ни одной услуги в избранное. Самое время изучить предложения нашего сообщества!
                            </p>
                            <Link
                                to="/services"
                                className="btn-primary inline-flex items-center gap-3 px-10 py-5"
                            >
                                Все услуги
                                <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                        {favorites.map((service) => (
                            <ServiceCard
                                key={service.id}
                                service={service}
                                isInitiallyFavorite={true}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorites;
