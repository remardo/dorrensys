import React, { useEffect, useMemo, useState } from 'react';
import { Building2 } from 'lucide-react';
import { fetchUsersFromConvex } from '../convexClient';
import { User } from '../types';

type Department = {
  id: string;
  title: string;
  description: string;
  people: User[];
};

const DEPARTMENTS = [
  { id: 'prod', title: 'Доррен Продакшн', description: 'Производственный блок' },
  { id: 'mgmt', title: 'Доррен (УК)', description: 'Управляющая компания' },
  { id: 'sales', title: 'Доррен Констракшн', description: 'Продажи/маркетинг' },
];

const groupByDepartment = (users: User[]): Department[] => {
  const grouped: Record<string, User[]> = { prod: [], mgmt: [], sales: [] };
  users.forEach((u) => {
    const dep = (u as any).department ?? 'mgmt';
    if (dep === 'prod') grouped.prod.push(u);
    else if (dep === 'sales') grouped.sales.push(u);
    else grouped.mgmt.push(u);
  });
  return DEPARTMENTS.map((d) => ({ ...d, people: grouped[d.id as keyof typeof grouped] ?? [] }));
};

const Company: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [activeId, setActiveId] = useState('prod');

  useEffect(() => {
    fetchUsersFromConvex().then((list) => setDepartments(groupByDepartment(list ?? [])));
  }, []);

  const active = useMemo(() => departments.find((d) => d.id === activeId) ?? departments[0], [departments, activeId]);

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-light text-dorren-black uppercase tracking-widest mb-2">Компания</h2>
          <p className="text-gray-500 font-light text-sm">Сотрудники берутся из Convex и доступны во всех модулях.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Building2 size={18} />
          <span>Обновлено: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[320px_auto] gap-6">
        <div className="bg-white border border-gray-100 p-4 space-y-2 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-brand text-dorren-black mb-2">Подразделения</h3>
          {departments.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveId(d.id)}
              className={`w-full text-left border p-3 ${d.id === activeId ? 'border-dorren-blue bg-dorren-blue/5' : 'border-gray-200 hover:border-dorren-blue'}`}
            >
              <p className="text-sm font-semibold text-dorren-black">{d.title}</p>
              <p className="text-xs text-gray-500">{d.description}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">{d.people.length} сотрудников</p>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {active ? (
            <div className="bg-white border border-gray-100 shadow-sm p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold uppercase tracking-brand text-dorren-black">{active.title}</h3>
                <span className="text-xs text-gray-400">{active.description}</span>
              </div>
              {active.people.length === 0 ? (
                <div className="text-sm text-gray-500">Нет сотрудников в этом подразделении.</div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {active.people.map((p) => (
                    <div key={p.email ?? p.id} className="border border-gray-200 p-3 bg-white shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <img src={p.avatar ?? 'https://placehold.co/100'} alt={p.name} className="w-10 h-10 rounded-full object-cover border border-white shadow" />
                        <div>
                          <p className="text-sm font-semibold text-dorren-black">{p.name}</p>
                          <p className="text-xs text-gray-500">{p.role}</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>{p.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500">Нет данных о сотрудниках.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Company;
