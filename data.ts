import { Course, DocumentItem, NewsItem } from './types';

export const initialNews: NewsItem[] = [
  {
    id: 1,
    title: 'Новая система целей и метрик по командам',
    category: 'HR аналитика',
    date: '12 янв',
    image: 'https://placehold.co/800/400?random=1',
    excerpt: 'Запускаем регулярные OKR и прозрачные KPI для всех продуктовых групп.',
  },
  {
    id: 2,
    title: 'Дорожная карта Q1: фокус на AI‑интеграциях',
    category: 'Продукт',
    date: '10 янв',
    image: 'https://placehold.co/800/400?random=2',
    excerpt: 'Улучшаем обработку заявок и отчётность через LLM‑модули.',
  },
  {
    id: 3,
    title: 'Мероприятия по бренду работодателя',
    category: 'HR',
    date: '05 янв',
    image: 'https://placehold.co/800/400?random=3',
    excerpt: 'Календарь встреч для кандидатов и свежие материалы про компанию.',
  },
  {
    id: 4,
    title: 'Tech Friday: внутренний митап по AI',
    category: 'R&D',
    date: '02 янв',
    image: 'https://placehold.co/800/400?random=4',
    excerpt: 'Разберём библиотеки для тонкой настройки моделей и покажем живые демо.',
  },
];

export const initialDocs: DocumentItem[] = [
  {
    id: 1,
    title: 'Политика безопасности данных',
    type: 'PDF',
    size: '1.2 MB',
    category: 'Правила',
    updated: '10 янв 2025',
    link: '#',
  },
  {
    id: 2,
    title: 'Гайд по онбордингу для новых сотрудников',
    type: 'DOCX',
    size: '850 KB',
    category: 'HR',
    updated: '08 янв 2025',
    link: '#',
  },
  {
    id: 3,
    title: 'Шаблон квартальных OKR',
    type: 'XLSX',
    size: '620 KB',
    category: 'Процессы',
    updated: '05 янв 2025',
    link: '#',
  },
  {
    id: 4,
    title: 'Регламент удалённой работы',
    type: 'PDF',
    size: '980 KB',
    category: 'Политики',
    updated: '03 янв 2025',
    link: '#',
  },
];

export const initialCourses: Course[] = [
  {
    id: 1,
    title: 'Онбординг: как мы работаем в Dorren',
    category: 'Обязательные',
    description: 'Быстрый старт, доступы, культура и правила взаимодействия.',
    progress: 100,
    totalModules: 5,
    duration: '4 часа',
    badge: 'Обязательный',
    thumbnail: 'https://placehold.co/600/400?random=20',
    modules: [
      { id: '1-1', title: 'Приветствие и структура компании', type: 'video', duration: '8 мин', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', content: 'Кто мы, чем занимаемся, основные продукты.' },
      { id: '1-2', title: 'Ценности и поведение', type: 'article', duration: '10 мин', sections: ['Прозрачность — коммуникация без скрытых повесток.', 'Действуем быстро — MVP, проверки гипотез.', 'Ответственность за результат — каждый владелец метрик.'], content: 'Объяснение ценностей и примеры поведения.' },
      { id: '1-3', title: 'Документы и доступы', type: 'image', duration: '3 мин', imageUrl: 'https://placehold.co/1200/720?random=201', description: 'Схема доступов в Confluence, Gmail, Slack и Jira.' },
      { id: '1-4', title: 'Мини‑квиз по политике фронтдеска', type: 'quiz', duration: '5 мин', quiz: { title: 'Фронтдеск', questions: [
        { id: 'q1', text: 'В какие сроки оформляем пропуск новому сотруднику?', options: ['1 день', '3 дня', '5 дней'], correctIndex: 1 },
        { id: 'q2', text: 'Кто подтверждает выдачу техники?', options: ['HR', 'IT', 'Руководитель'], correctIndex: 2 },
      ] } },
      { id: '1-5', title: 'Финальная аттестация', type: 'assessment', duration: '8 мин', quiz: { title: 'Онбординг итог', questions: [
        { id: 'aq1', text: 'Где лежит брендбук?', options: ['Confluence', 'Notion', 'Диск HR'], correctIndex: 0 },
        { id: 'aq2', text: 'Какая модель целей используется?', options: ['SMART', 'OKR', 'GROW'], correctIndex: 1 },
        { id: 'aq3', text: 'Как быстро отвечаем клиентам в чатах?', options: ['15 мин', '1 час', '1 рабочий день'], correctIndex: 1 },
      ] } },
    ],
  },
  {
    id: 2,
    title: 'Лидерство: инструменты обратной связи',
    category: 'Менеджмент',
    description: 'Регулярные 1:1, сложные разговоры, аттестация руководителя.',
    progress: 45,
    totalModules: 12,
    duration: '6 часов',
    badge: 'Рекомендовано',
    thumbnail: 'https://placehold.co/600/400?random=21',
    modules: [
      { id: '2-1', title: '1:1 как основной инструмент', type: 'video', duration: '12 мин', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', content: 'Формат встречи, чек-лист, частота.' },
      { id: '2-2', title: 'Фреймворк SBI', type: 'article', duration: '7 мин', sections: ['S — Situation', 'B — Behavior', 'I — Impact', 'Всегда закрываем actionable next step.'] },
      { id: '2-3', title: 'Кейс: сложный фидбек', type: 'image', duration: '4 мин', imageUrl: 'https://placehold.co/1200/720?random=202', description: 'Схема разговора с несколькими опциями развилки.' },
      { id: '2-4', title: 'Проверка усвоения (квиз)', type: 'quiz', duration: '6 мин', quiz: { title: 'Обратная связь', questions: [
        { id: 'lq1', text: 'Что важно в разделе Impact?', options: ['Определить чувства', 'Связать с результатом', 'Похвалить коллегу'], correctIndex: 1 },
        { id: 'lq2', text: 'Как часто проводить 1:1?', options: ['Раз в квартал', 'Раз в неделю-полторы', 'По запросу'], correctIndex: 1 },
      ] } },
      { id: '2-5', title: 'Аттестация руководителя', type: 'assessment', duration: '10 мин', quiz: { title: 'Итог лидера', questions: [
        { id: 'la1', text: 'Какая цель 1:1?', options: ['Контроль', 'Связь и поддержка', 'Передача задач'], correctIndex: 1 },
        { id: 'la2', text: 'Что делать после сложного разговора?', options: ['Задать срок ревью', 'Оставить как есть', 'Отложить вопрос'], correctIndex: 0 },
        { id: 'la3', text: 'Лучшее время для фидбека?', options: ['Сразу после события', 'На квартальном ретро', 'Раз в месяц'], correctIndex: 0 },
      ] } },
    ],
  },
  {
    id: 3,
    title: 'Data-driven продукт',
    category: 'Продукт',
    description: 'Метрики, эксперименты и дашборды: как строить решения на данных.',
    progress: 10,
    totalModules: 8,
    duration: '3 часа',
    badge: 'Рост',
    thumbnail: 'https://placehold.co/600/400?random=22',
    modules: [
      { id: '3-1', title: 'Метрики продукта', type: 'article', duration: '9 мин', sections: ['Смотрим на North Star + input metrics.', 'Держим список экспериментов.', 'Публикуем еженедельные апдейты.'], content: 'Набор метрик, примеры, таблицы.' },
      { id: '3-2', title: 'Видео: настройка трекинга', type: 'video', duration: '14 мин', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
      { id: '3-3', title: 'Квиз по метрикам', type: 'quiz', duration: '6 мин', quiz: { title: 'Метрики', questions: [
        { id: 'dq1', text: 'Что NOT является North Star?', options: ['DAU', 'Выручка в $', 'Ключевой outcome клиента'], correctIndex: 0 },
        { id: 'dq2', text: 'Что важно фиксировать в экспериментах?', options: ['Ответственного и дедлайн', 'Только гипотезу', 'Только метрику'], correctIndex: 0 },
      ] } },
    ],
  },
];
