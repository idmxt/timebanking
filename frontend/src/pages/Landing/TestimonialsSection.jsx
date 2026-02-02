import React from 'react';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: "Айнур Аскар",
    role: "UX/UI Дизайнер",
    content: "TimeBank помог мне найти потрясающего репетитора по испанскому в обмен на мои консультации по дизайну. Это невероятно круто!",
    avatar: "AS",
    rating: 5
  },
  {
    name: "Мария Козлова",
    role: "Преподаватель йоги",
    content: "Я научилась печь хлеб на закваске благодаря общению с Еленой. Взамен я провожу для нее утренние практики йоги. Ощущение сообщества бесценно.",
    avatar: "MK",
    rating: 5
  },
  {
    name: "Куаныш Касен",
    role: "Fullstack Разработчик",
    content: "Искал помощи по ремонту велосипеда и нашел мастера за 10 минут. Система кредитов времени работает идеально и справедливо. Очень рекомендую!",
    avatar: "IM",
    rating: 5
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 opacity-20 pointer-events-none">
        <div className="w-[800px] h-[800px] bg-gradient-radial from-secondary/20 to-transparent rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-end justify-between mb-20 gap-8 animate-fade-in">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-accent text-accent" />
              ))}
              <span className="ml-2 font-bold text-text-primary">4.9/5 на основе 2000+ отзывов</span>
            </div>
            <h2 className="italic leading-none">Голоса нашего <span className="text-secondary">сообщества</span></h2>
          </div>
          <p className="text-xl text-text-secondary max-w-md lg:text-right">
            Узнайте, как TimeBank помогает людям находить новые возможности без финансовых барьеров.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="card relative p-10 flex flex-col h-full animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <Quote className="w-12 h-12 text-primary/10 mb-6" />
              <p className="text-lg text-text-primary mb-10 italic leading-relaxed flex-grow">
                "{t.content}"
              </p>

              <div className="pt-8 border-t border-primary/10 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-hero flex items-center justify-center text-white font-bold text-xl shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-display font-bold text-text-primary text-lg">{t.name}</div>
                  <div className="text-sm text-text-secondary">{t.role}</div>
                </div>
              </div>

              {/* Decorative corner element */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[100px] -z-10 group-hover:bg-primary/10 transition-colors" />
            </div>
          ))}
        </div>

        <div className="mt-20 text-center animate-fade-in delay-500">
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-warm-cream border border-primary/10">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-secondary/20 flex items-center justify-center text-[10px] font-bold">
                  UA
                </div>
              ))}
            </div>
            <p className="text-sm font-medium text-text-secondary">
              Более <span className="text-text-primary font-bold">1000+</span> человек уже присоединились на этой неделе
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
