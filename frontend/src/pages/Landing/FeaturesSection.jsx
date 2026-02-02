import React from 'react';
import { ShieldCheck, Zap, Users, Globe, Clock, Heart } from 'lucide-react';

const features = [
  {
    icon: <Clock className="w-8 h-8 text-primary" />,
    title: "Атомарный обмен",
    description: "1 час помощи равен 1 кредиту времени. Справедливая и прозрачная система обмена без скрытых комиссий."
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-secondary" />,
    title: "Проверенные навыки",
    description: "Система отзывов и рейтингов гарантирует качество услуг. Каждый участник сообщества важен."
  },
  {
    icon: <Users className="w-8 h-8 text-accent" />,
    title: "Сильное сообщество",
    description: "Общайтесь с единомышленниками, находите новых друзей и расширяйте свой круг общения."
  },
  {
    icon: <Globe className="w-8 h-8 text-primary" />,
    title: "Онлайн и оффлайн",
    description: "Выбирайте формат, который удобен вам: учитесь языкам онлайн или помогайте с ремонтом в своем городе."
  },
  {
    icon: <Zap className="w-8 h-8 text-secondary" />,
    title: "Мгновенные уведомления",
    description: "Будьте всегда на связи. Получайте уведомления о новых запросах и сообщениях в реальном времени."
  },
  {
    icon: <Heart className="w-8 h-8 text-accent" />,
    title: "Взаимовыручка",
    description: "Помогая другим, вы инвестируете в свое будущее. Время — самый ценный ресурс."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-warm-cream relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-50" />
      <div className="blob bg-primary/10 w-96 h-96 -top-48 -left-24" />
      <div className="blob bg-secondary/10 w-[500px] h-[500px] -bottom-48 -right-24" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
          <h2 className="mb-6">Ценности нашего сообщества</h2>
          <p className="text-xl text-text-secondary">
            Мы строим мир, где таланты и время ценятся выше денег. Наша платформа предоставляет все инструменты для гармоничного обмена.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`card p-10 animate-fade-in delay-${(index % 3 + 1) * 100}`}
            >
              <div className="icon-wrapper mb-8">
                <div className="icon-glow" />
                <div className="relative z-10">
                  {feature.icon}
                </div>
              </div>
              <h4 className="mb-4">{feature.title}</h4>
              <p className="text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
