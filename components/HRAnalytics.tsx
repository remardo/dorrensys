import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

const hiringData = [
  { stage: 'Отклик', count: 120 },
  { stage: 'Скрининг', count: 85 },
  { stage: 'Интервью', count: 42 },
  { stage: 'Офер', count: 28 },
  { stage: 'Выход', count: 12 },
  { stage: 'Проверка', count: 10 },
];

const eNPSData = [
  { name: 'июл', score: 40 },
  { name: 'авг', score: 45 },
  { name: 'сен', score: 42 },
  { name: 'окт', score: 55 },
  { name: 'ноя', score: 60 },
  { name: 'дек', score: 72 },
];

const turnOverData = [
  { name: 'Продажи', value: 15 },
  { name: 'IT', value: 8 },
  { name: 'Маркетинг', value: 12 },
  { name: 'HR', value: 5 },
];

const COLORS = ['#183141', '#85CEE4', '#A0AEC0', '#000000'];

const HRAnalytics: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-light text-dorren-black uppercase tracking-widest mb-2">HR аналитика</h2>
          <p className="text-gray-500 font-light text-sm">Глобальные метрики подбора, удержания и удовлетворённости.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-dorren-dark text-white text-xs uppercase tracking-wider">Скачать PDF</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Сотрудников', value: '342', sub: '+12 за месяц' },
          { label: 'Текучесть', value: '4.2%', sub: '-0.8% к прошлому месяцу' },
          { label: 'Ср. выход', value: '18 дн.', sub: 'без задержек' },
          { label: 'eNPS', value: '72', sub: 'лучший результат года' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 border border-gray-100 shadow-sm">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">{stat.label}</p>
            <p className="text-3xl font-light text-dorren-black mb-1">{stat.value}</p>
            <p className="text-xs text-dorren-blue">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-brand mb-6">Воронка найма (последние 30 дней)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={hiringData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke="#eee" />
                <XAxis type="number" hide />
                <YAxis dataKey="stage" type="category" tick={{ fontSize: 12 }} width={80} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#183141', color: '#fff', border: 'none' }} />
                <Bar dataKey="count" fill="#183141" barSize={20} radius={[0, 4, 4, 0]}>
                  {hiringData.map((_, index) => (
                    <Cell key={index} fill={index % 2 === 0 ? '#183141' : '#85CEE4'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-brand mb-6">Динамика eNPS</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={eNPSData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#183141', color: '#fff', border: 'none' }} />
                <Line type="monotone" dataKey="score" stroke="#183141" strokeWidth={3} dot={{ r: 4, fill: '#85CEE4', strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 border border-gray-100 shadow-sm lg:col-span-2">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="col-span-1">
              <h3 className="text-sm font-bold uppercase tracking-brand mb-2">Уход по департаментам</h3>
              <p className="text-sm text-gray-500 font-light mb-6">Доля увольнений за последние 3 месяца.</p>
              <ul className="space-y-2">
                {turnOverData.map((entry, index) => (
                  <li key={index} className="flex items-center justify-between text-sm border-b border-gray-50 pb-1">
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                      <span>{entry.name}</span>
                    </div>
                    <span className="font-bold">{entry.value}%</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={turnOverData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {turnOverData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '4px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRAnalytics;
