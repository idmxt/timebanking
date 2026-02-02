import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Trash2, Shield, User, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
    const { user, logout, checkAuth } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Personal Info state
    const [personalData, setPersonalData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        patronymic: user?.patronymic || '',
        birth_date: user?.birth_date || '',
        gender: user?.gender || ''
    });

    // Password state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);

    // Email state
    const [emailData, setEmailData] = useState({
        newEmail: user?.email || '',
        currentPassword: ''
    });

    useEffect(() => {
        if (user) {
            setPersonalData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                patronymic: user.patronymic || '',
                birth_date: user.birth_date || '',
                gender: user.gender || ''
            });
            setEmailData(prev => ({ ...prev, newEmail: user.email }));
        }
    }, [user]);

    const handlePersonalInfoUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await api.put('/users/profile', {
                ...personalData,
                name: `${personalData.last_name} ${personalData.first_name}`.trim() || user.name
            });
            await checkAuth(); // Refresh user data in context
            setMessage({ type: 'success', text: 'Личные данные успешно обновлены' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.error || 'Ошибка при обновлении данных' });
        } finally {
            setLoading(false);
        }
    };

    const handleEmailUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await api.put('/users/change-email', emailData);
            await checkAuth();
            setEmailData({ ...emailData, currentPassword: '' });
            setMessage({ type: 'success', text: 'Email успешно обновлен' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.error || 'Ошибка при обновлении email' });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Новые пароли не совпадают' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await api.put('/users/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setMessage({ type: 'success', text: 'Пароль успешно изменен' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.error || 'Ошибка при смене пароля' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Вы уверены, что хотите удалить аккаунт? Это действие необратимо.')) {
            try {
                await api.delete('/users/account');
                logout();
                navigate('/');
            } catch (error) {
                setMessage({ type: 'error', text: 'Ошибка при удалении аккаунта' });
            }
        }
    };

    return (
        <div className="min-h-screen bg-warm-cream py-12">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8 font-display" style={{ color: '#E07856' }}>Настройки</h1>

                {message.text && (
                    <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                        {message.type === 'error' && <AlertTriangle size={20} />}
                        {message.text}
                    </div>
                )}

                <div className="grid gap-8">
                    {/* Personal Information */}
                    <section className="bg-white rounded-2xl shadow-soft p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-green-100 text-green-600">
                                <User size={24} />
                            </div>
                            <h2 className="text-2xl font-bold">Личные данные</h2>
                        </div>

                        <form onSubmit={handlePersonalInfoUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Фамилия</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 transition-all"
                                    value={personalData.last_name}
                                    onChange={(e) => setPersonalData({ ...personalData, last_name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 transition-all"
                                    value={personalData.first_name}
                                    onChange={(e) => setPersonalData({ ...personalData, first_name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Отчество</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 transition-all"
                                    value={personalData.patronymic}
                                    onChange={(e) => setPersonalData({ ...personalData, patronymic: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Дата рождения</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 transition-all"
                                    value={personalData.birth_date}
                                    onChange={(e) => setPersonalData({ ...personalData, birth_date: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Пол</label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 transition-all"
                                    value={personalData.gender}
                                    onChange={(e) => setPersonalData({ ...personalData, gender: e.target.value })}
                                >
                                    <option value="">Не указан</option>
                                    <option value="male">Мужской</option>
                                    <option value="female">Женский</option>
                                </select>
                            </div>

                            <div className="md:col-span-2 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary"
                                    style={{ backgroundColor: '#8B9D77' }}
                                >
                                    {loading ? 'Обновление...' : 'Сохранить изменения'}
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Change Password */}
                    <section className="bg-white rounded-2xl shadow-soft p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                                <Lock size={24} />
                            </div>
                            <h2 className="text-2xl font-bold">Безопасность</h2>
                        </div>

                        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Текущий пароль</label>
                                <div className="relative">
                                    <input
                                        type={showCurrent ? 'text' : 'password'}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 transition-all"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                        onClick={() => setShowCurrent(!showCurrent)}
                                    >
                                        {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Новый пароль</label>
                                <div className="relative">
                                    <input
                                        type={showNew ? 'text' : 'password'}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 transition-all"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                        onClick={() => setShowNew(!showNew)}
                                    >
                                        {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Подтвердите новый пароль</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 transition-all"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary"
                                style={{ backgroundColor: '#E07856' }}
                            >
                                {loading ? 'Обновление...' : 'Сменить пароль'}
                            </button>
                        </form>
                    </section>

                    {/* Email Settings */}
                    <section className="bg-white rounded-2xl shadow-soft p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                <Mail size={24} />
                            </div>
                            <h2 className="text-2xl font-bold">Контактные данные</h2>
                        </div>

                        <form onSubmit={handleEmailUpdate} className="max-w-md space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Новый Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                                    value={emailData.newEmail}
                                    onChange={(e) => setEmailData({ ...emailData, newEmail: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Текущий пароль</label>
                                <input
                                    type="password"
                                    placeholder="Введите пароль для подтверждения"
                                    className="w-full px-4 py-2 border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                                    value={emailData.currentPassword}
                                    onChange={(e) => setEmailData({ ...emailData, currentPassword: e.target.value })}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full md:w-auto"
                                style={{ backgroundColor: '#4A90E2' }}
                            >
                                {loading ? 'Обновление...' : 'Обновить Email'}
                            </button>
                        </form>
                    </section>

                    {/* Danger Zone */}
                    <section className="bg-white rounded-2xl shadow-soft p-8 border border-red-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-red-100 text-red-600">
                                <Shield size={24} />
                            </div>
                            <h2 className="text-2xl font-bold">Опасная зона</h2>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-red-50 border border-red-100">
                            <div>
                                <h3 className="font-bold text-red-800">Удалить аккаунт</h3>
                                <p className="text-sm text-red-600">Все ваши данные, услуги и история будут безвозвратно удалены.</p>
                            </div>
                            <button
                                onClick={handleDeleteAccount}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all"
                            >
                                <Trash2 size={18} />
                                Удалить
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Settings;
