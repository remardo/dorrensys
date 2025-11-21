import { Course, DocumentItem, NewsItem, HomeConfig } from './types';

export const initialNews: NewsItem[] = [
  {
    id: 1,
    title: 'Запуск новой линии в Доррен Продакшн',
    category: 'Производство',
    date: '12 марта',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Стартует модернизированный цех металлоконструкций. План выпуска на 2025 год — плюс 22% к прошлому.',
    slug: 'dpr-line-2025',
    body: [
      'В Доррен Продакшн открывается новая линия, которая позволит увеличить выпуск металлоконструкций и ускорить сроки отгрузки.',
      'Проект реализован в срок, автоматизация снижает простои и улучшает качество контроля.',
    ],
  },
  {
    id: 2,
    title: 'Итоги Q1: рост продаж и новые партнёры',
    category: 'Продажи',
    date: '10 марта',
    image: 'https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Команда Доррен Констракшн закрыла квартал с ростом +18% к плану и подписала три крупных контракта.',
    slug: 'sales-q1',
    body: [
      'Команда продаж усилила региональное присутствие и внедрила новый процесс пресейла.',
      'В следующем квартале фокус — расширение продуктовой линейки и совместные вебинары с партнёрами.',
    ],
  },
  {
    id: 3,
    title: 'Запуск программы наставничества',
    category: 'HR',
    date: '05 марта',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'В компании стартует программа менторства для сотрудников с опытом до 2 лет.',
    slug: 'mentoring-2025',
    body: [
      'Каждый участник получит наставника из числа руководителей направлений.',
      'Цель — ускорить рост специалистов и повысить вовлечённость команд.',
    ],
  },
];

export const initialDocs: DocumentItem[] = [
  { id: 1, title: 'Политика безопасности', type: 'PDF', size: '1.2 MB', category: 'Общее', updated: '10 марта 2025', link: '#' },
  { id: 2, title: 'Гайд по адаптации', type: 'DOCX', size: '850 KB', category: 'HR', updated: '08 марта 2025', link: '#' },
  { id: 3, title: 'Регламент OKR', type: 'XLSX', size: '620 KB', category: 'Процессы', updated: '05 марта 2025', link: '#' },
  { id: 4, title: 'Брендбук', type: 'PDF', size: '980 KB', category: 'Маркетинг', updated: '03 марта 2025', link: '#' },
];

export const initialHome: HomeConfig = {
  hero: {
    title: 'Соединяя берега',
    subtitle: 'Новый мост через Обь в Новосибирске строится по концессии. Работы начались в прошлом году и завершатся в 2025. Проезд — 100 рублей.',
    date: '21.03.2022',
    image: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1400&q=80',
    ctaText: 'Подробнее',
    ctaLink: '/news/dpr-line-2025',
  },
  tiles: [
    { title: 'Новый опрос', description: 'Оценка удовлетворенности персонала', cta: 'Пройти опрос', link: '/survey', variant: 'secondary' },
    { title: 'Новый курс', description: 'Курс молодого бойца', cta: 'Пройти', link: '/lms', variant: 'secondary' },
    { title: 'Календарь', description: '13:43, среда, 3 марта', cta: 'Открыть', link: '/calendar', variant: 'primary' },
  ],
  notifications: [
    '10 новых писем',
    'Новый ответ в опросе — 13 июня, 10:22',
    'Вы записаны на мероприятие — 10 июля, 11:15',
    'Новый комментарий',
  ],
  tasks: [
    { id: 1, title: 'Заполнить график отпусков', time: '15 июня, 13:00', status: 'pending' },
    { id: 2, title: 'Обновить контакт-лист', time: '17 июня, 09:00', status: 'pending' },
    { id: 3, title: 'Загрузить отчёт CRM', time: 'Пятница, 16:30', status: 'done' },
  ],
  events: [
    { title: 'Воркшоп по аналитике', date: '13 сент.', place: 'Учебный класс', cta: 'Записаться' },
    { title: 'Презентация продукта', date: '20 сент.', place: 'Онлайн', cta: 'Присоединиться' },
  ],
  orders: [
    { title: 'Приказ по отпускной кампании', type: 'DOCX', size: '12.9 KB' },
    { title: 'Список партнёров (обновление)', type: 'XLSX', size: '181 KB' },
  ],
};

export const initialCourses: Course[] = [
  {
    id: 1,
    title: 'Онбординг: как мы работаем в Dorren',
    category: 'Введение',
    description: 'Культура, команда, процессы и основные системы.',
    progress: 100,
    totalModules: 5,
    duration: '4 ч',
    badge: 'Обязательно',
    thumbnail: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80',
    modules: [
      { id: '1-1', title: 'Компания и ценности', type: 'video', duration: '8 мин', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', content: 'Кто мы, что производим, ключевые проекты.' },
      { id: '1-2', title: 'Офис и безопасность', type: 'article', duration: '10 мин', sections: ['Доступ и пропуска', 'Охрана труда', 'Куда обращаться за помощью'], content: 'Базовые инструкции и контакты.' },
      { id: '1-3', title: 'Рабочие системы', type: 'image', duration: '3 мин', imageUrl: 'https://placehold.co/1200x720?text=Apps', description: 'Confluence, Gmail, Slack, Jira.' },
      { id: '1-4', title: 'Проверка знаний', type: 'quiz', duration: '5 мин', quiz: { title: 'База по компании', questions: [
        { id: 'q1', text: 'Где лежат регламенты?', options: ['Confluence', 'Notion', 'На общем диске'], correctIndex: 0 },
        { id: 'q2', text: 'К кому идти за пропуском?', options: ['HR', 'IT', 'Финансы'], correctIndex: 0 },
      ] } },
      { id: '1-5', title: 'Финальное задание', type: 'assessment', duration: '8 мин', quiz: { title: 'Итог', questions: [
        { id: 'aq1', text: 'Какой инструмент для задач?', options: ['Jira', 'Excel', 'Почта'], correctIndex: 0 },
        { id: 'aq2', text: 'Что такое OKR?', options: ['Метод постановки целей', 'Тип договора', 'CRM-система'], correctIndex: 0 },
      ] } },
    ],
  },
  {
    id: 2,
    title: 'Лидерство: обратная связь и one-to-one',
    category: 'Управление',
    description: 'Практики 1:1, встречи по целям, культура feedback.',
    progress: 45,
    totalModules: 12,
    duration: '6 часов',
    badge: 'Рекомендуется',
    thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80',
    modules: [
      { id: '2-1', title: 'Формат 1:1', type: 'video', duration: '12 мин', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', content: 'Частота, структура, материалы.' },
      { id: '2-2', title: 'SBI-модель', type: 'article', duration: '7 мин', sections: ['Situation', 'Behavior', 'Impact', 'Action'], content: 'Как давать обратную связь без конфликтов.' },
      { id: '2-3', title: 'Примеры метрик', type: 'image', duration: '4 мин', imageUrl: 'https://placehold.co/1200x720?text=Metrics', description: 'Рабочие показатели и артефакты.' },
      { id: '2-4', title: 'Квиз по практике', type: 'quiz', duration: '6 мин', quiz: { title: 'Быстрый тест', questions: [
        { id: 'lq1', text: 'Что значит Impact?', options: ['Влияние результата', 'Время встречи', 'Название отчёта'], correctIndex: 0 },
        { id: 'lq2', text: 'Сколько длится 1:1?', options: ['15 минут', '30–60 минут', '120 минут'], correctIndex: 1 },
      ] } },
    ],
  },
  {
    id: 3,
    title: 'Data-driven продукт',
    category: 'Продукт',
    description: 'Метрики, гипотезы, эксперименты: как решать задачи на данных.',
    progress: 10,
    totalModules: 8,
    duration: '3 часа',
    badge: 'Новый',
    thumbnail: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80',
    modules: [
      { id: '3-1', title: 'Основы метрик', type: 'article', duration: '9 мин', sections: ['North Star', 'Input-метрики', 'Качественные сигналы'], content: 'Что измерять и как интерпретировать.' },
      { id: '3-2', title: 'Аналитика воронки', type: 'video', duration: '14 мин', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
      { id: '3-3', title: 'Квиз: базовые понятия', type: 'quiz', duration: '6 мин', quiz: { title: 'Проверка', questions: [
        { id: 'dq1', text: 'North Star — это...', options: ['Ключевая метрика продукта', 'Сума оплат', 'Срок релиза'], correctIndex: 0 },
        { id: 'dq2', text: 'Что важно при экспериментах?', options: ['Размер выборки', 'Цвет кнопки', 'Яркость экрана'], correctIndex: 0 },
      ] } },
    ],
  },
];
