import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Award, Globe, Phone, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

const ProfileView = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, [id]);

  const loadProfileData = async () => {
    try {
      const [profileRes, reviewsRes, servicesRes] = await Promise.all([
        api.get(`/users/${id}`),
        api.get(`/users/${id}/reviews`),
        api.get(`/users/${id}/services`)
      ]);

      setProfile(profileRes.data.user);
      setReviews(reviewsRes.data.reviews);
      setServices(servicesRes.data.services);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту услугу?')) {
      try {
        await api.delete(`/services/${serviceId}`);
        setServices(services.filter(s => s.id !== serviceId));
      } catch (error) {
        console.error('Failed to delete service:', error);
        alert('Ошибка при удалении услуги');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#8B9D77' }}></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Пользователь не найден</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-cream py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-soft p-8 mb-6">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              {profile.avatar_url ? (
                <img
                  src={`http://localhost:5001${profile.avatar_url}`}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full object-cover border-4"
                  style={{ borderColor: '#E07856' }}
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold"
                  style={{ backgroundColor: '#E07856' }}
                >
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2 font-display" style={{ color: '#E07856' }}>
                {profile.name}
              </h1>

              {profile.city && (
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <MapPin size={16} />
                  <span>{profile.city}</span>
                </div>
              )}

              {profile.occupation && (
                <p className="text-gray-800 font-medium mb-3">{profile.occupation}</p>
              )}

              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <Star size={18} fill="#D4A574" color="#D4A574" />
                  <span className="font-semibold">{profile.rating ? profile.rating.toFixed(1) : '0.0'}</span>
                  <span className="text-gray-500">({profile.total_reviews || 0} отзывов)</span>
                </div>

                <div className="flex items-center gap-2" style={{ color: '#8B9D77' }}>
                  <Award size={18} />
                  <span className="font-semibold">{profile.time_balance ? profile.time_balance.toFixed(1) : '0.0'} часов</span>
                </div>
              </div>

              {profile.languages && (
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                  <Globe size={16} />
                  <span>{profile.languages}</span>
                </div>
              )}

              {profile.phone && (
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Phone size={16} />
                  <span>{profile.phone}</span>
                </div>
              )}
            </div>
          </div>

          {profile.bio && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="font-semibold mb-2 text-gray-800">О себе:</h3>
              <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {profile.total_reviews >= 10 && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium">
              <Award size={16} />
              Надежный участник
            </div>
          )}

          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold mb-3">Навыки:</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-3 py-1 rounded-full text-sm"
                    style={{ backgroundColor: '#F5E6D3', color: '#2F5233' }}
                  >
                    {skill.skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Services */}
        {services.length > 0 && (
          <div className="bg-white rounded-2xl shadow-soft p-8 mb-6">
            <h2 className="text-2xl font-bold mb-6 font-display" style={{ color: '#E07856' }}>
              Услуги ({services.length})
            </h2>
            <div className="grid gap-4">
              {services.map((service) => (
                <Link
                  key={service.id}
                  to={`/services/${service.id}`}
                  className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all flex justify-between items-start"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{service.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="px-2 py-1 rounded" style={{ backgroundColor: '#F5E6D3' }}>
                        {service.category}
                      </span>
                      <span>{service.duration}ч</span>
                      <span>{service.location_type === 'online' ? '🌐 Онлайн' : '📍 Оффлайн'}</span>
                    </div>
                  </div>

                  {currentUser?.id === parseInt(id) && (
                    <div className="flex gap-2 ml-4">
                      <Link
                        to={`/services/edit/${service.id}`}
                        className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDeleteService(service.id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="bg-white rounded-2xl shadow-soft p-8">
            <h2 className="text-2xl font-bold mb-6 font-display" style={{ color: '#E07856' }}>
              Отзывы ({reviews.length})
            </h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {review.reviewer_avatar ? (
                        <img
                          src={`http://localhost:5001${review.reviewer_avatar}`}
                          alt={review.reviewer_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: '#8B9D77' }}
                        >
                          {review.reviewer_name.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{review.reviewer_name}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              fill={i < review.rating ? '#D4A574' : 'none'}
                              color={i < review.rating ? '#D4A574' : '#D1D5DB'}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-sm text-gray-500 mb-2">
                        Услуга: {review.service_title}
                      </p>

                      {review.comment && (
                        <p className="text-gray-700">{review.comment}</p>
                      )}

                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(review.created_at).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
