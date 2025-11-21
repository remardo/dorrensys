import React from 'react';
import { ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HomeConfig } from '../types';

interface DashboardProps {
  home: HomeConfig;
}

const Dashboard: React.FC<DashboardProps> = ({ home }) => {
  const { hero, tiles, notifications, tasks, events, orders } = home;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid lg:grid-cols-[2fr_1fr_1fr_1fr] gap-4">
        <Link
          to={hero.ctaLink || '/news'}
          className="relative overflow-hidden bg-gradient-to-br from-[#1f3b57] to-[#101e2b] text-white h-72 flex items-end group"
        >
          <img
            src={hero.image}
            alt={hero.title}
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="relative p-6 space-y-2">
            <p className="text-xs uppercase tracking-wider text-white/70">{hero.date}</p>
            <h2 className="text-2xl font-semibold leading-snug">{hero.title}</h2>
            <p className="text-sm text-white/80 max-w-2xl">{hero.subtitle}</p>
            {hero.ctaText && (
              <span className="text-xs uppercase tracking-wider text-dorren-blue flex items-center gap-1">
                {hero.ctaText} <ArrowRight size={12} />
              </span>
            )}
          </div>
        </Link>

        <div className="bg-gradient-to-br from-[#1f4c7a] to-[#142c44] text-white p-4 space-y-4">
          {tiles
            .filter((t) => t.variant !== 'primary')
            .map((tile, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-white/70">{tile.title}</p>
                <h4 className="text-sm font-semibold">{tile.description}</h4>
                {tile.cta && tile.link ? (
                  <Link to={tile.link} className="text-xs text-dorren-blue mt-1 inline-flex items-center gap-1">
                    {tile.cta} <ArrowRight size={12} />
                  </Link>
                ) : (
                  tile.cta && <span className="text-xs text-dorren-blue mt-1">{tile.cta}</span>
                )}
              </div>
            ))}
        </div>

        {tiles
          .filter((t) => t.variant === 'primary')
          .map((tile, idx) => (
            <Link
              key={idx}
              to={tile.link || '/news'}
              className="bg-gradient-to-br from-[#ff7b8b] to-[#ffca7b] text-white p-6 flex flex-col justify-center items-start hover:opacity-95 transition-opacity"
            >
              <p className="text-sm">{tile.title}</p>
              <p className="text-lg font-semibold">{tile.description}</p>
              {tile.cta && (
                <span className="text-xs uppercase tracking-wider mt-3 flex items-center gap-1">
                  {tile.cta} <ArrowRight size={12} />
                </span>
              )}
            </Link>
          ))}

        <div className="bg-[#2e3b4a] text-white p-4 space-y-3">
          <h4 className="text-sm font-semibold">Уведомления</h4>
          <ul className="space-y-2 text-xs text-white/80">
            {notifications.map((n, idx) => (
              <li key={idx} className="border-b border-white/10 pb-2">
                {n}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        <div className="bg-[#2b3340] text-white p-4">
          <h4 className="text-sm font-semibold mb-3">Ближайшие задачи</h4>
          <div className="space-y-3 text-xs text-white/80">
            <p>{hero.title} — новый проект</p>
            <p>Запуск линии металлоконструкций</p>
            <p>Финал согласований по CRM</p>
          </div>
        </div>

        <div className="bg-[#2b3340] text-white p-4">
          <h4 className="text-sm font-semibold mb-3">Ближайшие события</h4>
          <div className="space-y-3 text-xs text-white/80">
            {events.map((ev, idx) => (
              <div key={idx} className="border-b border-white/10 pb-2">
                <p className="font-semibold">{ev.title}</p>
                <p>
                  {ev.date} • {ev.place}
                </p>
                {ev.cta && (
                  <span className="text-dorren-blue inline-flex items-center gap-1">
                    #{ev.cta} <ArrowRight size={12} />
                  </span>
                )}
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
                <p className="text-white/60">
                  {o.type} • {o.size}
                </p>
                <span className="text-dorren-blue inline-flex items-center gap-1">
                  Скачать <ArrowRight size={12} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

