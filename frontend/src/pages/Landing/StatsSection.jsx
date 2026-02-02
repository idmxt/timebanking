import React from 'react';

const stats = [
  { label: 'Часов обмена', value: '50,000+' },
  { label: 'Активных участников', value: '12,000+' },
  { label: 'Видов услуг', value: '150+' },
  { label: 'Городов мира', value: '45+' }
];

const StatsSection = () => {
  return (
    <section className="py-24 bg-text-primary relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10" />
      <div className="blob bg-accent/20 w-96 h-96 top-0 right-0" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="text-[56px] lg:text-[72px] font-display font-bold text-accent mb-2 tracking-tighter">
                {stat.value}
              </div>
              <div className="text-lg lg:text-xl text-surface-dark/80 font-medium uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 pt-12 border-t border-surface-dark/10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left">
            <h3 className="text-white mb-2 italic">Готовы изменить свое представление о ценностях?</h3>
            <p className="text-surface-dark/60 text-lg">Присоединяйтесь к экономике будущего уже сегодня.</p>
          </div>
          <button className="btn-primary bg-accent hover:bg-accent-glow text-text-primary px-12 py-5 text-xl">
            Стать частью сообщества
          </button>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
