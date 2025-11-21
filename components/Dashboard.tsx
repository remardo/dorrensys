import React from 'react';
import { ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { HomeConfig } from '../types';

interface DashboardProps {
  home: HomeConfig;
}

const Dashboard: React.FC<DashboardProps> = ({ home }) => {
  const { hero, tiles, notifications, tasks, events, orders } = home;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid lg:grid-cols-[2fr_1fr_1fr_1fr] gap-4">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1f3b57] to-[#101e2b] text-white h-72 flex items-end">
          <img src={hero.image} alt="hero" className="absolute inset-0 w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="relative p-6 space-y-2">
            <p className="text-xs uppercase tracking-wider text-white/70">{hero.date}</p>
            <h2 className="text-2xl font-semibold leading-snug">{hero.title}</h2>
            <p className="text-sm text-white/80 max-w-2xl">{hero.subtitle}</p>
            {hero.ctaText && (
              <button className="text-xs uppercase tracking-wider text-dorren-blue flex items-center gap-1">
                {hero.ctaText} <ArrowRight size={12} />
              </button>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#1f4c7a] to-[#142c44] text-white p-4 space-y-4">
          {tiles.filter((t) => t.variant !== 'primary').map((tile, idx) => (
            <div key={idx}>
              <p className="text-xs uppercase tracking-wider text-white/70">{tile.title}</p>
              <h4 className="text-sm font-semibold">{tile.description}</h4>
              {tile.cta && <button className="text-xs text-dorren-blue mt-1">{tile.cta}</button>}
            </div>
          ))}
        </div>

        {tiles.filter((t) => t.variant === 'primary').map((tile, idx) => (
          <div key={idx} className="bg-gradient-to-br from-[#ff7b8b] to-[#ffca7b] text-white p-6 flex flex-col justify-center items-start">
            <p className="text-sm">{tile.title}</p>
            <p className="text-lg font-semibold">{tile.description}</p>
            {tile.cta && <button className="text-xs uppercase tracking-wider mt-3">{tile.cta}</button>}
          </div>
        ))}

        <div className="bg-[#2e3b4a] text-white p-4 space-y-3">
          <h4 className="text-sm font-semibold">Уведомления</h4>
          <ul className="space-y-2 text-xs text-white/80">
            {notifications.map((n, idx) => (
              <li key={idx} className="border-b border-white/10 pb-2">{n}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        <div className="bg-[#2b3340] text-white p-4">
          <h4 className="text-sm font-semibold mb-3">Последние новости</h4>
          <div className="space-y-3 text-xs text-white/80">
            <p>{hero.title} — узнать больше</p>
            <p>Запуск мобильного приложения</p>
            <p>Новый соцпакет для сотрудников</p>
          </div>
        </div>

        <div className="bg-[#2b3340] text-white p-4">
          <h4 className="text-sm font-semibold mb-3">Ближайшие события</h4>
          <div className="space-y-3 text-xs text-white/80">
            {events.map((ev, idx) => (
              <div key={idx} className="border-b border-white/10 pb-2">
                <p className="font-semibold">{ev.title}</p>
                <p>{ev.date} · {ev.place}</p>
                {ev.cta && <button className="text-dorren-blue">#{ev.cta}</button>}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#2b3340] text-white p-4">
          <h4 className="text-sm font-semibold mb-3">Мои задачи</h4>
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li key={task.id} className="border-b border-white/10 pb-2">
                <div className="flex items-center gap-2 text-xs text-white/80">
                  <div className={`mt-0.5 ${task.status === 'done' ? 'text-dorren-blue' : 'text-gray-400'}`}>
                    <CheckCircle2 size={12} />
                  </div>
                  <div>
                    <p className={task.status === 'done' ? 'line-through text-white/60' : ''}>{task.title}</p>
                    <p className="text-white/60">{task.time}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#2b3340] text-white p-4">
          <h4 className="text-sm font-semibold mb-3">Последние приказы</h4>
          <div className="space-y-3 text-xs text-white/80">
            {orders.map((o, idx) => (
              <div key={idx} className="border-b border-white/10 pb-2">
                <p className="font-semibold">{o.title}</p>
                <p className="text-white/60">{o.type} · {o.size}</p>
                <button className="text-dorren-blue">Скачать</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
