import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Shield, ArrowRight, Zap } from 'lucide-react';
import HeroSection from './Landing/HeroSection';
import ProblemSection from './Landing/ProblemSection';
import SolutionSection from './Landing/SolutionSection';

const LandingPage = () => {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
            <h2 className="mb-6">Как работает <span className="text-secondary">Timebank</span></h2>
            <p className="text-lg text-text-secondary">
              Простая математика добрых дел: 1 час работы всегда равен 1 часу на вашем счету.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap size={32} />,
                title: "Предложите навык",
                desc: "Вы умеете готовить, программировать или выгуливать собак? Создайте услугу за пару минут.",
                color: "bg-primary"
              },
              {
                icon: <Clock size={32} />,
                title: "Зарабатывайте время",
                desc: "Помогайте другим участникам и получайте временные кредиты на свой баланс.",
                color: "bg-secondary"
              },
              {
                icon: <Shield size={32} />,
                title: "Меняйте на пользу",
                desc: "Тратьте накопленные часы на любые услуги от других участников сообщества.",
                color: "bg-accent"
              }
            ].map((feature, i) => (
              <div key={i} className={`card p-10 animate-fade-in delay-${(i+1)*100}`}>
                <div className={`w-16 h-16 rounded-2xl ${feature.color} text-white flex items-center justify-center mb-8 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl mb-4">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="blob w-[600px] h-[600px] bg-secondary/10 -bottom-20 left-1/2 -translate-x-1/2" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="card p-16 bg-gradient-hero text-white border-none">
            <h2 className="text-white hero-title mb-6">Готовы изменить мир?</h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Начните с малого — помогите кому-то сегодня. Ваше время имеет значение.
            </p>
            <Link to="/register" className="inline-flex items-center gap-2 px-10 py-5 bg-white text-primary rounded-2xl font-bold text-xl hover:scale-105 transition-transform shadow-xl">
              Создать аккаунт <ArrowRight size={24} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-surface-dark bg-warm-cream">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">TB</div>
            <span className="text-xl font-bold font-display">Timebank</span>
          </div>
          <div className="flex gap-8 text-text-muted font-medium">
            <Link to="/services" className="hover:text-primary transition-colors">Услуги</Link>
            <Link to="/register" className="hover:text-primary transition-colors">Регистрация</Link>
            <Link to="/login" className="hover:text-primary transition-colors">Вход</Link>
          </div>
          <p className="text-text-muted text-sm">© 2026 Timebank. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
