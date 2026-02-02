import React from 'react';
import { DollarSign, Users, Clock, TrendingDown } from 'lucide-react';

const ProblemSection = () => {
  const problems = [
    {
      icon: DollarSign,
      title: "Услуги стоят дорого",
      description: "Качественная помощь специалистов часто недоступна из-за высоких цен",
      stat: "70% людей",
      detail: "не могут позволить себе нужные услуги"
    },
    {
      icon: Users,
      title: "Навыки не используются",
      description: "У вас есть опыт, которым вы можете поделиться, но нет способа его монетизировать",
      stat: "65% экспертов",
      detail: "готовы помогать, но не знают как"
    },
    {
      icon: Clock,
      title: "Время тратится впустую",
      description: "Мы тратим время на то, что не умеем, вместо того чтобы делать то, что получается лучше всего",
      stat: "40% времени",
      detail: "уходит на неэффективные задачи"
    },
    {
      icon: TrendingDown,
      title: "Барьеры во взаимопомощи",
      description: "Неловко просить помощь бесплатно, но и платить за мелочи не хочется",
      stat: "80% людей",
      detail: "испыпытывают дискомфорт при просьбе о помощи"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-surface-dark relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-error/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-warning/10 to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-error/10 rounded-full mb-6">
              <span className="text-sm font-semibold text-error">Проблема</span>
            </div>
            
            <h2 className="text-5xl font-bold text-text-primary mb-6">
              Традиционная экономика
              <span className="block mt-2 text-error">не работает для всех</span>
            </h2>
            
            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Миллионы людей сталкиваются с одними и теми же проблемами каждый день
            </p>
          </div>

          {/* Problems Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {problems.map((problem, index) => (
              <div 
                key={index}
                className="group bg-white rounded-3xl p-8 shadow-soft hover:shadow-lifted transition-all duration-500 border border-gray-100 hover:border-error/20 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-6">
                  {/* Icon */}
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-error/20 to-warning/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                    <div className="relative w-16 h-16 bg-gradient-to-br from-error to-warning rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all">
                      <problem.icon size={28} className="text-white" strokeWidth={2} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-text-primary mb-3 group-hover:text-error transition-colors">
                      {problem.title}
                    </h3>
                    <p className="text-text-secondary leading-relaxed mb-4">
                      {problem.description}
                    </p>
                    
                    {/* Stat */}
                    <div className="inline-flex items-baseline gap-2 px-4 py-2 bg-error/5 rounded-xl border border-error/10">
                      <span className="text-2xl font-bold text-error">{problem.stat}</span>
                      <span className="text-sm text-text-secondary">{problem.detail}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Solution */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-4 p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl border border-primary/10">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-2xl">💡</span>
              </div>
              <div className="text-left">
                <div className="font-bold text-text-primary text-lg">А что если есть решение?</div>
                <div className="text-text-secondary">Timebanking меняет правила игры</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
