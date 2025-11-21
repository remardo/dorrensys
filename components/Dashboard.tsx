import React from 'react';
import { ArrowRight, CheckCircle2, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const notifications = [
    '10 новых писем',
    'Ответ в опросе — 13 июня, 10:22',
    'Вы записаны на мероприятие — 10 июля, 11:15',
    'Новый комментарий',
  ];

  const tasks = [
    { id: 1, title: 'Заполнить отпускной график', time: '15 июня, 13:00', status: 'pending' },
    { id: 2, title: 'Запись на медосмотр', time: '17 июня, 09:00', status: 'pending' },
    { id: 3, title: 'Созвон по проекту CRM', time: 'Сегодня, 16:30', status: 'done' },
  ];

  const events = [
    { title: 'Воркшоп по аналитике', date: '13 сент.', place: 'Учебный класс', cta: 'Записаться' },
    { title: 'Демо новых фич', date: '20 сент.', place: 'Онлайн', cta: 'Добавить в календарь' },
  ];

  const orders = [
    { title: 'Список партнёров', size: '12.9 Kb', type: 'DOCX' },
    { title: 'Схема мотивации', size: '181 Kb', type: 'XLSX' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid lg:grid-cols-[2fr_1fr_1fr_1fr] gap-4">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1f3b57] to-[#101e2b] text-white h-72 flex items-end">
          <img src="https://placehold.co/900x600/1d3557/ffffff?text=Dorren+Project" alt="hero" className="absolute inset-0 w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="relative p-6 space-y-2">
            <p className="text-xs uppercase tracking-wider text-white/70">21.03.2022</p>
            <h2 className="text-2xl font-semibold leading-snug">Соединяя берега</h2>
            <p className="text-sm text-white/80 max-w-2xl">
              Новый мост через Обь в Новосибирске; работы завершатся в 2023. Платный проезд — 100 рублей. Подробнее в проекте.
            </p>
            <button className="text-xs uppercase tracking-wider text-dorren-blue flex items-center gap-1">
              Подробнее <ArrowRight size={12} />
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#1f4c7a] to-[#142c44] text-white p-4 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-white/70">Новый опрос</p>
            <h4 className="text-sm font-semibold">Оценка удовлетворенности персонала</h4>
            <button className="text-xs text-dorren-blue mt-1">Пройти опрос</button>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-white/70">Новый курс</p>
            <h4 className="text-sm font-semibold">Курс молодого бойца</h4>
            <button className="text-xs text-dorren-blue mt-1">Пройти</button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#ff7b8b] to-[#ffca7b] text-white p-6 flex flex-col justify-center items-start">
          <p className="text-sm">13:43</p>
          <p className="text-lg font-semibold">Среда, 3 марта</p>
          <button className="text-xs uppercase tracking-wider mt-3">Перейти в календарь</button>
        </div>

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
            <p>Соединяя берега — узнать больше</p>
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
                <button className="text-dorрен-blue">#{ev.cta}</button>
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
                  <div className={`mt-0.5 ${task.status === 'done' ? 'text-dorрен-blue' : 'text-gray-400'}`}>
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
                <button className="text-dorрен-blue">Скачать</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
