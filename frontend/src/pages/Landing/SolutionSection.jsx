import React from 'react';
import { Clock, Repeat, Heart, TrendingUp } from 'lucide-react';

const SolutionSection = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      {/* Gradient Blobs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gradient-to-bl from-secondary/20 to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 rounded-full mb-6">
              <span className="text-sm font-semibold text-success">Решение</span>
            </div>

            <h2 className="text-5xl font-bold text-text-primary mb-6">
              Timebanking —
              <span className="block mt-2 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                экономика равенства
              </span>
            </h2>

            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Каждый час вашего времени равен часу времени другого человека.
              Нет разницы между CEO и студентом — все навыки ценятся одинаково.
            </p>
          </div>

          {/* Main Concept */}
          <div className="mb-20">
            <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 rounded-3xl p-12 border border-primary/10 shadow-soft">
              <div className="grid lg:grid-cols-3 gap-8 items-center">

                {/* Step 1 */}
                <div className="text-center">
                  <div className="relative inline-flex mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-3xl blur-xl opacity-50" />
                    <div className="relative w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center text-white text-3xl font-bold">
                      1ч
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary mb-3">Вы даете</h3>
                  <p className="text-text-secondary">
                    Помогаете кому-то своими навыками
                  </p>
                </div>

                {/* Equal Sign */}
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-secondary-light flex items-center justify-center shadow-soft">
                    <span className="text-white text-2xl font-bold">=</span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="text-center">
                  <div className="relative inline-flex mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary to-secondary-light rounded-3xl blur-xl opacity-50" />
                    <div className="relative w-24 h-24 bg-gradient-to-br from-secondary to-secondary-light rounded-3xl flex items-center justify-center text-white text-3xl font-bold">
                      1ч
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary mb-3">Вы получаете</h3>
                  <p className="text-text-secondary">
                    Кто-то помогает вам своими навыками
                  </p>
                </div>

              </div>

              {/* Key Point */}
              <div className="mt-12 p-6 bg-white rounded-2xl text-center shadow-soft">
                <p className="text-lg font-semibold text-text-primary">
                  Час юриста = Час репетитора = Час программиста = Час повара
                </p>
                <p className="text-text-secondary mt-2">
                  Все навыки равноценны. Время — единственная валюта.
                </p>
              </div>
            </div>
          </div>

          {/* Benefits Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Clock,
                title: "Честный обмен",
                description: "Нет накруток, комиссий и переплат. Только время.",
                color: "from-primary to-accent"
              },
              {
                icon: Repeat,
                title: "Циклическая экономика",
                description: "Помогайте другим и получайте помощь взамен.",
                color: "from-secondary to-secondary-light"
              },
              {
                icon: Heart,
                title: "Сообщество",
                description: "Знакомьтесь с людьми и создавайте связи.",
                color: "from-accent to-accent-glow"
              },
              {
                icon: TrendingUp,
                title: "Развитие",
                description: "Учитесь новому, делясь своим опытом.",
                color: "from-success to-success"
              }
            ].map((benefit, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 shadow-soft hover:shadow-lifted transition-all duration-500 border border-gray-100 hover:border-primary/20 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                  <benefit.icon size={24} className="text-white" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-text-secondary">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
