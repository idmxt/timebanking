import React from 'react';
import { Search, Calendar, RefreshCcw, Star } from 'lucide-react';

const steps = [
  {
    icon: <Search className="w-8 h-8 text-primary" />,
    title: "Найдите навык",
    description: "Используйте поиск и фильтры по категориям, чтобы найти именно то, что вам нужно — от изучения языков до помощи в саду."
  },
  {
    icon: <Calendar className="w-8 h-8 text-secondary" />,
    title: "Забронируйте время",
    description: "Выберите удобную дату и время в календаре исполнителя. Обсудите детали в чате и отправьте запрос."
  },
  {
    icon: <RefreshCcw className="w-8 h-8 text-accent" />,
    title: "Проведите обмен",
    description: "Встретьтесь онлайн или оффлайн. Получите услугу и подтвердите выполнение. Время автоматически переведется исполнителю."
  },
  {
    icon: <Star className="w-8 h-8 text-primary" />,
    title: "Оцените опыт",
    description: "Поделитесь впечатлениями и поставьте оценку. Это помогает нашему сообществу оставаться качественным и надежным."
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20 animate-fade-in">
          <h2 className="mb-6 italic">Как это работает?</h2>
          <p className="text-xl text-text-secondary">
            Простой и интуитивно понятный процесс обмена вашим временем на ценные навыки других участников.
          </p>
        </div>

        <div className="relative">
          {/* Connector line for desktop */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-secondary/20 -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="w-24 h-24 rounded-full bg-warm-cream border-2 border-primary/20 flex items-center justify-center mb-8 shadow-soft relative bg-white">
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white font-display font-bold flex items-center justify-center shadow-btn">
                    {index + 1}
                  </div>
                  {step.icon}
                </div>
                <h4 className="mb-4">{step.title}</h4>
                <p className="text-text-secondary">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
