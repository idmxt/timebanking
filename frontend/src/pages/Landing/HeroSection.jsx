import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Users, TrendingUp } from 'lucide-react';

const HeroSection = () => {
  const blobRef = useRef(null);

  useEffect(() => {
    // Parallax эффект для blob
    const handleMouseMove = (e) => {
      if (blobRef.current) {
        const { clientX, clientY } = e;
        const moveX = (clientX - window.innerWidth / 2) * 0.02;
        const moveY = (clientY - window.innerHeight / 2) * 0.02;
        blobRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-warm-cream via-white to-surface-dark">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          ref={blobRef}
          className="blob absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/30 to-accent/30"
          style={{ transition: 'transform 0.3s ease-out' }}
        />
        <div className="blob absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-secondary/30 to-primary/20" />
        <div className="blob absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-accent/40 to-secondary/20" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Column - Text Content */}
          <div className="space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-primary/20 shadow-soft">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-semibold text-text-primary">
                Революция в обмене услугами
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-text-primary">
              Время — это
              <span className="block mt-2 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                новая валюта
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-text-secondary leading-relaxed max-w-xl">
              Обменивайтесь навыками и услугами без денег.
              <span className="font-semibold text-primary"> 1 час вашего времени = 1 час чьего-то времени.</span>
              {' '}Присоединяйтесь к сообществу, где ценится опыт, а не кошелек.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Users size={24} className="text-white" strokeWidth={2} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-text-primary">1,000+</div>
                  <div className="text-sm text-text-secondary">Участников</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary-light flex items-center justify-center">
                  <Clock size={24} className="text-white" strokeWidth={2} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-text-primary">5,000+</div>
                  <div className="text-sm text-text-secondary">Обменов</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center">
                  <TrendingUp size={24} className="text-white" strokeWidth={2} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-text-primary">98%</div>
                  <div className="text-sm text-text-secondary">Довольны</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <Link
                to="/register"
                className="btn-primary group inline-flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                Начать бесплатно
                <ArrowRight
                  size={20}
                  className="transform group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <Link
                to="#how-it-works"
                className="btn-secondary inline-flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                Как это работает
              </Link>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-white" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-secondary-light border-2 border-white" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-glow border-2 border-white" />
              </div>
              <span>
                Присоединяйтесь к <strong className="text-text-primary">1,000+</strong> людям,
                которые уже обмениваются навыками
              </span>
            </div>
          </div>

          {/* Right Column - Visual/Illustration */}
          <div className="relative animate-fade-in delay-200">
            {/* Main Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />

              <div className="relative bg-white rounded-3xl p-8 shadow-lifted border border-primary/10">
                {/* Time Exchange Illustration */}
                <div className="space-y-6">
                  {/* User 1 */}
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xl font-bold">
                      А
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-text-primary">Асем</div>
                      <div className="text-sm text-text-secondary">Дизайнер</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-text-secondary">Отдает</div>
                      <div className="text-xl font-bold text-primary">2 часа</div>
                    </div>
                  </div>

                  {/* Exchange Arrow */}
                  <div className="flex justify-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-secondary-light flex items-center justify-center animate-bounce-slow">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </div>

                  {/* User 2 */}
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-secondary/10 to-secondary-light/10 rounded-2xl">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-secondary-light flex items-center justify-center text-white text-xl font-bold">
                      И
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-text-primary">Кайрат</div>
                      <div className="text-sm text-text-secondary">Программист</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-text-secondary">Получает</div>
                      <div className="text-xl font-bold text-secondary">2 часа</div>
                    </div>
                  </div>
                </div>

                {/* Success Message */}
                <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-xl">
                  <div className="flex items-center gap-2 text-success">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">Обмен завершен успешно!</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-br from-secondary/20 to-transparent rounded-full blur-2xl animate-pulse delay-200" />
          </div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-primary rounded-full animate-scroll" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
