import React from 'react';
import { CheckCircle2, Star, Users, Shield } from 'lucide-react';

const benefits = [
  {
    title: "Нулевая стоимость",
    text: "Забудьте о деньгах, используйте свои таланты как валюту.",
    icon: <Star className="w-6 h-6 text-primary" />
  },
  {
    title: "Душевные связи",
    text: "Находите людей, разделяющих ваши ценности и интересы.",
    icon: <Users className="w-6 h-6 text-secondary" />
  },
  {
    title: "Доверие и безопасность",
    text: "Проверенное сообщество с прозрачной системой рейтингов.",
    icon: <Shield className="w-6 h-6 text-accent" />
  }
];

const BenefitsSection = () => {
  return (
    <section className="py-24 bg-[#FFF9F0] relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -ml-48 -mb-48" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 order-2 lg:order-1">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[40px] blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <div className="relative bg-white rounded-[32px] overflow-hidden shadow-2xl border border-primary/10 animate-fade-in">
                <img
                  src="/assets/community.png"
                  alt="TimeBanking Community"
                  className="w-full h-auto transform hover:scale-102 transition-transform duration-500"
                />

                {/* Floating card info */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-xl hidden md:block animate-bounce-slow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Star className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-display font-bold text-text-primary text-lg">Доступно каждому</div>
                      <div className="text-text-secondary text-sm">Начните обмен уже сегодня</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 order-1 lg:order-2 animate-fade-in delay-200">
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6 tracking-wider uppercase">
              Почему TimeBank?
            </div>
            <h2 className="mb-8 italic leading-tight">
              Обмен, который наполняет жизнь <span className="text-primary">смыслом</span>
            </h2>
            <p className="text-xl text-text-secondary mb-12 leading-relaxed max-w-xl">
              Мы создали пространство, где человеческие отношения важнее рыночных цен. Ваше время стоит столько же, сколько время любого другого участника.
            </p>

            <div className="space-y-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-soft border border-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="mb-2 font-display font-bold group-hover:text-primary transition-colors">{benefit.title}</h4>
                    <p className="text-text-secondary leading-relaxed">{benefit.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
