import React from 'react';
import { NewsItem } from '../types';
import { ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const newsData: NewsItem[] = [
  {
    id: 1,
    title: 'Новая система целей и метрик по командам',
    category: 'HR аналитика',
    date: '12 янв',
    image: 'https://picsum.photos/800/400?random=1',
    excerpt: 'Запускаем регулярные OKR и прозрачные KPI для всех продуктовых групп.',
  },
  {
    id: 2,
    title: 'Дорожная карта Q1: фокус на AI‑интеграциях',
    category: 'Продукт',
    date: '10 янв',
    image: 'https://picsum.photos/800/400?random=2',
    excerpt: 'Улучшаем обработку заявок и отчётность через LLM‑модули.',
  },
  {
    id: 3,
    title: 'Мероприятия по бренду работодателя',
    category: 'HR',
    date: '05 янв',
    image: 'https://picsum.photos/800/400?random=3',
    excerpt: 'Календарь встреч для кандидатов и свежие материалы про компанию.',
  },
];

const productivityData = [
  { name: 'Пн', tasks: 4, efficiency: 80 },
  { name: 'Вт', tasks: 7, efficiency: 90 },
  { name: 'Ср', tasks: 5, efficiency: 85 },
  { name: 'Чт', tasks: 8, efficiency: 95 },
  { name: 'Пт', tasks: 6, efficiency: 88 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-light text-dorren-black uppercase tracking-widest mb-2">
            Доброе утро, Андрей
          </h2>
          <p className="text-gray-500 font-light">
            У вас 4 непрочитанных уведомления и 2 задачи на сегодня.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white p-4 shadow-sm border border-gray-100 w-48">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Баланс</p>
            <p className="text-2xl font-light text-dorren-dark">1,450 D.</p>
          </div>
          <div className="bg-dorren-blue p-4 shadow-sm w-48">
            <p className="text-xs text-white/80 uppercase tracking-wider mb-1">eNPS</p>
            <p className="text-2xl font-light text-white">72</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-dorren-black uppercase tracking-brand">Свежие новости</h3>
              <button className="text-xs text-dorren-dark hover:text-dorren-blue uppercase tracking-wider flex items-center transition-colors">
                Все новости <ArrowRight size={14} className="ml-1" />
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2 relative group cursor-pointer overflow-hidden bg-black">
                <img
                  src={newsData[0].image}
                  alt={newsData[0].title}
                  className="w-full h-80 object-cover opacity-70 group-hover:opacity-50 transition-opacity duration-500"
                />
                <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black/90 to-transparent">
                  <span className="text-dorren-blue text-xs uppercase tracking-widest mb-2 block">{newsData[0].category}</span>
                  <h4 className="text-white text-2xl font-light leading-tight mb-2">{newsData[0].title}</h4>
                  <p className="text-gray-300 text-sm font-light line-clamp-2">{newsData[0].excerpt}</p>
                </div>
              </div>
              {newsData.slice(1).map((news) => (
                <div key={news.id} className="bg-white border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer">
                  <div className="h-48 overflow-hidden bg-gray-100">
                    <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] text-dorren-blue uppercase tracking-wider font-semibold">{news.category}</span>
                      <span className="text-[10px] text-gray-400">{news.date}</span>
                    </div>
                    <h4 className="text-lg text-dorren-black font-medium leading-snug mb-2">{news.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-6 border border-gray-100 shadow-sm">
            <h3 className="text-xs font-bold text-dorren-black uppercase tracking-brand mb-6">Эффективность за неделю</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={productivityData}>
                  <defs>
                    <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#85CEE4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#85CEE4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} />
                  <YAxis width={30} tick={{ fontSize: 10, fill: '#999' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#183141', border: 'none', borderRadius: '0px', color: '#fff' }} itemStyle={{ color: '#85CEE4' }} />
                  <Area type="monotone" dataKey="efficiency" stroke="#183141" strokeWidth={2} fillOpacity={1} fill="url(#colorEff)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-bold text-dorren-black uppercase tracking-brand">Задачи на сегодня</h3>
              <span className="text-xs text-gray-400">4 из 6</span>
            </div>
            <ul className="space-y-4">
              {[
                { id: 1, title: 'Запуск рассылки по OKR', time: '14:00', status: 'pending' },
                { id: 2, title: 'Созвон с дизайнерами', time: '16:30', status: 'done' },
                { id: 3, title: 'Ревью фичи в CRM', time: '17:00', status: 'pending' },
              ].map((task) => (
                <li key={task.id} className="flex items-start group">
                  <div className={`mt-1 mr-3 ${task.status === 'done' ? 'text-dorren-blue' : 'text-gray-300'}`}>
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className={`text-sm ${task.status === 'done' ? 'line-through text-gray-400' : 'text-dorren-black'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center mt-1 text-xs text-gray-400">
                      <Clock size={12} className="mr-1" /> {task.time}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-dorren-dark p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-dorren-blue rounded-full opacity-20 blur-xl"></div>
            <h3 className="text-xs font-bold uppercase tracking-brand mb-4 text-dorren-blue">Прогресс обучения</h3>
            <div className="mb-4">
              <p className="text-lg font-light leading-tight mb-2">Курс «Лидерство в продукте»</p>
              <div className="w-full bg-white/10 h-1 mt-2">
                <div className="bg-dorren-blue h-1 w-3/4"></div>
              </div>
              <p className="text-[10px] text-gray-300 mt-2 text-right">75% завершено</p>
            </div>
            <button className="w-full py-2 border border-white/20 text-xs uppercase tracking-wider hover:bg-white hover:text-dorren-dark transition-colors">
              Перейти к курсу
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
