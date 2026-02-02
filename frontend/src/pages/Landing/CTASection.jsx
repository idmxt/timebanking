import React from 'react';
import { ArrowRight, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background with gradient and grid */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />

      {/* Floating decorative elements */}
      <div className="blob bg-white/20 w-[600px] h-[600px] -top-96 -left-48" />
      <div className="blob bg-accent/30 w-[400px] h-[400px] -bottom-48 -right-24" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl rounded-[40px] p-12 lg:p-20 border border-white/20 shadow-lifted text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white font-medium mb-8">
            <Globe className="w-4 h-4" />
            <span>Присоединяйтесь к 12,000+ участников</span>
          </div>

          <h2 className="text-white mb-8 italic">Готовы обмениваться талантами?</h2>
          <p className="text-xl lg:text-2xl text-white/80 mb-12 leading-relaxed">
            Начните свое путешествие в мире TimeBank сегодня. Получите 5 стартовых часов в подарок при регистрации и откройте для себя сотни новых навыков.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/register"
              className="btn-primary bg-white text-primary hover:bg-surface-dark w-full sm:w-auto flex items-center justify-center gap-2 group"
            >
              Начать бесплатно
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/services"
              className="px-8 py-4 rounded-2xl font-semibold text-lg text-white border-2 border-white/30 hover:bg-white/10 transition-all w-full sm:w-auto"
            >
              Смотреть услуги
            </Link>
          </div>

          <p className="mt-10 text-white/50 text-sm">
            Без привязки карты. Полностью на основе обмена временем.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
