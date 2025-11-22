import { Course, DocumentItem, NewsItem, User, Task } from '../types';

export const database = {
  users: [
    {
      id: 'u1',
      email: 'admin@dorren.com',
      name: 'Смирнов Андрей',
      role: 'admin',
      avatar: 'https://placehold.co/100/100?random=101',
      coins: 0,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'u2',
      email: 'pm@dorren.com',
      name: 'Смирнов А.',
      role: 'user',
      avatar: 'https://placehold.co/100/100?random=102',
      coins: 0,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'u3',
      email: 'designer@dorren.com',
      name: 'Егорова Е.',
      role: 'user',
      avatar: 'https://placehold.co/100/100?random=103',
      coins: 0,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'u4',
      email: 'dev@dorren.com',
      name: 'Котов И.',
      role: 'user',
      avatar: 'https://placehold.co/100/100?random=104',
      coins: 0,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'u5',
      email: 'qa@dorren.com',
      name: 'Ли В.',
      role: 'user',
      avatar: 'https://placehold.co/100/100?random=105',
      coins: 0,
      createdAt: new Date().toISOString(),
    },
  ] as User[],

  sessions: new Map<string, { email: string; token: string; createdAt: number }>(),
  authCodes: new Map<string, { code: string; createdAt: number }>(),

  news: [
    {
      id: 1,
      title: 'Запуск новой линии в Доррен Продакшн',
      category: 'Производство',
      date: '21 ноября',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'Стартует модернизированный цех металлоконструкций. План выпуска на 2025 год — плюс 22% к прошлому.',
      description: 'Иногда в описании нужно дать больше контекста, чем уместится в коротком анонсе. Здесь — о модернизации, сроках и командах проекта.',
      slug: 'dpr-line-2025',
      body: [
        'В Доррен Продакшн открывается новая линия, которая позволит увеличить выпуск металлоконструкций и ускорить сроки отгрузки.',
        'Проект реализован в срок, автоматизация снижает простои и улучшает качество контроля.',
        'Новая линия оснащена современным оборудованием и роботизированными системами управления качеством.',
      ],
      createdAt: Date.now(),
    },
    {
      id: 2,
      title: 'Итоги Q3: рост продаж и новые партнёры',
      category: 'Продажи',
      date: '20 ноября',
      image: 'https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'Команда Доррен Констракшн закрыла квартал с ростом +18% к плану и подписала три крупных контракта.',
      description: 'Подробно разбираем драйверы роста, конверсию по воронке и планы на следующий квартал.',
      slug: 'sales-q3',
      body: [
        'Команда продаж усилила региональное присутствие и внедрила новый процесс пресейла.',
        'В следующем квартале фокус — расширение продуктовой линейки и совместные вебинары с партнёрами.',
        'Заключены контракты на строительство моста в Новосибирске и промышленного комплекса в Екатеринбурге.',
      ],
      createdAt: Date.now() - 86400000,
    },
    {
      id: 3,
      title: 'Запуск программы наставничества DORREN Pro',
      category: 'HR',
      date: '19 ноября',
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'В компании стартует программа менторства для сотрудников с опытом до 2 лет.',
      description: 'Что такое менторство в Dorren, как подать заявку и какие цели ставим на пилот.',
      slug: 'mentoring-2025',
      body: [
        'Каждый участник получит наставника из числа руководителей направлений.',
        'Цель — ускорить рост специалистов и повысить вовлечённость команд.',
        'Пилотный запуск планируется на январь 2025 года с участием 15 сотрудников.',
      ],
      createdAt: Date.now() - 172800000,
    },
    {
      id: 4,
      title: 'Новая система управления проектами',
      category: 'IT',
      date: '18 ноября',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'Внедряется единая платформа для управления всеми проектами компании.',
      description: 'Переход на современную систему управления проектами с интеграцией всех инструментов.',
      slug: 'project-management-system',
      body: [
        'Новая система заменит разрозненные инструменты единой платформой.',
        'Все проекты, задачи и коммуникации будут в одном месте.',
        'Обучение пользователей начнется в декабре 2024 года.',
      ],
      createdAt: Date.now() - 259200000,
    },
    {
      id: 5,
      title: 'Обновление корпоративного портала',
      category: 'IT',
      date: '17 ноября',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'Запущена новая версия корпоративного портала с улучшенным функционалом.',
      description: 'Что нового в портале, как это улучшит вашу работу.',
      slug: 'portal-update',
      body: [
        'Новый дизайн и улучшенная навигация.',
        'Интеграция с системой задач и обучения.',
        'Мобильная версия для работы с телефона.',
      ],
      createdAt: Date.now() - 345600000,
    },
  ] as NewsItem[],

  docs: [
    { id: 1, title: 'Политика безопасности', type: 'PDF', size: '1.2 MB', category: 'Общее', updated: '20 ноября 2024', link: '#' },
    { id: 2, title: 'Гайд по адаптации', type: 'DOCX', size: '850 KB', category: 'HR', updated: '19 ноября 2024', link: '#' },
    { id: 3, title: 'Регламент OKR', type: 'XLSX', size: '620 KB', category: 'Процессы', updated: '18 ноября 2024', link: '#' },
    { id: 4, title: 'Брендбук', type: 'PDF', size: '980 KB', category: 'Маркетинг', updated: '17 ноября 2024', link: '#' },
    { id: 5, title: 'Положение о премиях', type: 'PDF', size: '1.1 MB', category: 'Финансы', updated: '16 ноября 2024', link: '#' },
    { id: 6, title: 'Технический регламент', type: 'PDF', size: '2.3 MB', category: 'Производство', updated: '15 ноября 2024', link: '#' },
    { id: 7, title: 'План развития на 2025', type: 'PDF', size: '1.8 MB', category: 'Стратегия', updated: '14 ноября 2024', link: '#' },
    { id: 8, title: 'Стандарты качества', type: 'PDF', size: '950 KB', category: 'Качество', updated: '13 ноября 2024', link: '#' },
  ] as DocumentItem[],

  tasks: [
    {
      id: '1',
      title: 'Запустить рассылку по новым OKR',
      description: 'Обновить шаблоны писем, добавить ссылки на Confluence, проверить сегменты.',
      status: 'todo',
      priority: 'high',
      assigneeEmail: 'pm@dorren.com',
      assigneeName: 'Смирнов А.',
      assigneeAvatar: 'https://placehold.co/100/100?random=102',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Обновить документацию API',
      description: 'Подтащить новые эндпоинты, примеры запросов и схемы.',
      status: 'todo',
      priority: 'medium',
      assigneeEmail: 'dev@dorren.com',
      assigneeName: 'Котов И.',
      assigneeAvatar: 'https://placehold.co/100/100?random=104',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: '3',
      title: 'Подготовить описание вакансии Junior Designer',
      description: 'Согласовать требования, собрать материалы для страницы, настроить отклики.',
      status: 'in-progress',
      priority: 'high',
      assigneeEmail: 'designer@dorren.com',
      assigneeName: 'Егорова Е.',
      assigneeAvatar: 'https://placehold.co/100/100?random=103',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '4',
      title: 'Финализировать макеты лендинга',
      description: 'Учесть правки по иллюстрациям и цвету, проверить адаптив.',
      status: 'in-progress',
      priority: 'low',
      assigneeEmail: 'designer@dorren.com',
      assigneeName: 'Егорова Е.',
      assigneeAvatar: 'https://placehold.co/100/100?random=103',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: '5',
      title: 'Починить отчёт по marketing',
      description: 'Проверить выгрузки, фильтры и дубли.',
      status: 'done',
      priority: 'medium',
      assigneeEmail: 'qa@dorren.com',
      assigneeName: 'Ли В.',
      assigneeAvatar: 'https://placehold.co/100/100?random=105',
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
    {
      id: '6',
      title: 'Подготовить презентацию для клиента',
      description: 'Создать слайды с новыми проектами и кейсами.',
      status: 'todo',
      priority: 'high',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: '7',
      title: 'Обновить базу знаний',
      description: 'Добавить новые инструкции и FAQ.',
      status: 'in-progress',
      priority: 'medium',
      assigneeEmail: 'dev@dorren.com',
      assigneeName: 'Котов И.',
      assigneeAvatar: 'https://placehold.co/100/100?random=104',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
  ] as Task[],

  courses: [
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
      createdAt: Date.now(),
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
      createdAt: Date.now(),
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
      createdAt: Date.now(),
    },
  ] as Course[],
};

// Функции для работы с базой данных
export const db = {
  // Пользователи
  getUsers: async () => database.users,
  getUserByEmail: async (email: string) => database.users.find(u => u.email === email),
  getUserByToken: async (token: string) => {
    const session = database.sessions.get(token);
    if (!session) return null;
    return database.users.find(u => u.email === session.email);
  },

  // Сессии
  createSession: async (email: string, token: string) => {
    database.sessions.set(token, { email, token, createdAt: Date.now() });
  },
  deleteSession: async (token: string) => {
    database.sessions.delete(token);
  },

  // Коды авторизации
  createAuthCode: async (email: string, code: string) => {
    database.authCodes.set(email.toLowerCase(), { code, createdAt: Date.now() });
  },
  verifyAuthCode: async (email: string, code: string) => {
    const entry = database.authCodes.get(email.toLowerCase());
    if (!entry) return false;
    if (entry.code !== code) return false;
    const age = Date.now() - entry.createdAt;
    if (age > 10 * 60 * 1000) return false; // 10 минут
    return true;
  },

  // Новости
  getNews: async () => database.news.sort((a, b) => b.createdAt - a.createdAt),
  getNewsById: async (id: number) => database.news.find(n => n.id === id),
  getNewsBySlug: async (slug: string) => database.news.find(n => n.slug === slug),

  // Документы
  getDocs: async () => database.docs,
  getDocsById: async (id: number) => database.docs.find(d => d.id === id),

  // Курсы
  getCourses: async () => database.courses,
  getCourseById: async (id: number) => database.courses.find(c => c.id === id),

  // Задачи
  getTasks: async () => database.tasks,
  getTaskById: async (id: string) => database.tasks.find(t => t.id === id),
  updateTask: async (id: string, updates: Partial<Task>) => {
    const index = database.tasks.findIndex(t => t.id === id);
    if (index >= 0) {
      database.tasks[index] = { ...database.tasks[index], ...updates };
      return database.tasks[index];
    }
    return null;
  },
  createTask: async (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    database.tasks.unshift(newTask);
    return newTask;
  },
};