import React from 'react';
import { Mail, Phone, Users, Building2 } from 'lucide-react';

const hierarchy = [
  {
    name: 'CEO — Анна Смирнова',
    title: 'CEO',
    team: [
      {
        name: 'CTO — Павел Воронов',
        title: 'Технологии',
        members: [
          { name: 'Игорь Котов', role: 'Lead Frontend', email: 'igor.kotov@example.com', phone: '+7 999 123-45-67' },
          { name: 'Вера Ли', role: 'QA Lead', email: 'vera.li@example.com', phone: '+7 999 234-56-78' },
        ],
      },
      {
        name: 'CPO — Ирина Егорова',
        title: 'Продукт и дизайн',
        members: [
          { name: 'Егор Поляков', role: 'Product Lead B2B', email: 'egor.polyakov@example.com', phone: '+7 999 345-67-89' },
          { name: 'Юлия Федорова', role: 'Head of Design', email: 'yulia.fed@example.com', phone: '+7 999 456-78-90' },
        ],
      },
      {
        name: 'CHRO — Дмитрий Петров',
        title: 'People & Culture',
        members: [
          { name: 'Елена Соколова', role: 'HR BP', email: 'elena.sokolova@example.com', phone: '+7 999 567-89-01' },
          { name: 'Мария Орлова', role: 'Recruiter', email: 'maria.orlova@example.com', phone: '+7 999 678-90-12' },
        ],
      },
    ],
  },
];

const Company: React.FC = () => {
  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-light text-dorren-black uppercase tracking-widest mb-2">Компания</h2>
          <p className="text-gray-500 font-light text-sm">Оргструктура и контакты ключевых сотрудников.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Building2 size={18} />
          <span>Обновлено: январь 2025</span>
        </div>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-brand text-dorren-black mb-2">Иерархия</h3>
        <div className="space-y-6">
          {hierarchy.map((node) => (
            <div key={node.name} className="border border-gray-100 p-4">
              <div className="mb-4">
                <p className="text-xs uppercase tracking-wider text-gray-400">Первый уровень</p>
                <p className="text-lg text-dorren-black">{node.name}</p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {node.team.map((team) => (
                  <div key={team.name} className="border border-gray-100 p-3 bg-gray-50">
                    <p className="text-xs uppercase tracking-wider text-gray-500">{team.title}</p>
                    <p className="text-sm font-semibold text-dorren-black mb-2">{team.name}</p>
                    <div className="space-y-3">
                      {team.members.map((m) => (
                        <div key={m.email} className="bg-white border border-gray-200 p-3">
                          <p className="text-sm font-semibold text-dorren-black">{m.name}</p>
                          <p className="text-xs text-gray-500">{m.role}</p>
                          <div className="text-xs text-gray-600 mt-2 space-y-1">
                            <a href={`mailto:${m.email}`} className="flex items-center gap-2 hover:text-dorren-blue">
                              <Mail size={14} /> {m.email}
                            </a>
                            <a href={`tel:${m.phone}`} className="flex items-center gap-2 hover:text-dorren-blue">
                              <Phone size={14} /> {m.phone}
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users size={16} className="text-dorren-blue" />
          <h3 className="text-sm font-bold uppercase tracking-brand text-dorren-black">Команда — быстрые контакты</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EMPLOYEES.concat(
            hierarchy[0].team.flatMap((t) =>
              t.members.map((m) => ({
                id: m.email,
                name: m.name,
                role: m.role,
                email: m.email,
                phone: m.phone,
                avatar: 'https://placehold.co/100',
              })),
            ),
          ).map((m) => (
            <div key={m.name + m.role} className="border border-gray-100 p-4 bg-gray-50 flex items-center gap-3">
              <img src={(m as any).avatar || 'https://placehold.co/100'} alt={m.name} className="w-10 h-10 rounded-full object-cover border border-white shadow" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-dorren-black">{m.name}</p>
                <p className="text-xs text-gray-500">{m.role}</p>
                {'email' in m && m.email && (
                  <a href={`mailto:${(m as any).email}`} className="text-xs text-dorren-blue flex items-center gap-1">
                    <Mail size={12} /> {(m as any).email}
                  </a>
                )}
                {'phone' in m && m.phone && (
                  <a href={`tel:${(m as any).phone}`} className="text-xs text-dorren-blue flex items-center gap-1">
                    <Phone size={12} /> {(m as any).phone}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Company;
