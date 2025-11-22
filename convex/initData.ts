import { mutation } from './_generated/server';
import { v } from 'convex/values';
import { requireAdmin } from './auth';

// Импортируем данные из старой БД
const mockUsers = [
  {
    email: 'admin@dorren.com',
    name: 'Смирнов Андрей',
    role: 'admin',
    avatar: 'https://placehold.co/100/100?random=101',
    coins: 0,
    createdAtOffset: 0,
  },
  {
    email: 'pm@dorren.com',
    name: 'Смирнов А.',
    role: 'user',
    avatar: 'https://placehold.co/100/100?random=102',
    coins: 0,
    createdAtOffset: 3600000,
  },
  {
    email: 'designer@dorren.com',
    name: 'Егорова Е.',
    role: 'user',
    avatar: 'https://placehold.co/100/100?random=103',
    coins: 0,
    createdAtOffset: 7200000,
  },
  {
    email: 'dev@dorren.com',
    name: 'Котов И.',
    role: 'user',
    avatar: 'https://placehold.co/100/100?random=104',
    coins: 0,
    createdAtOffset: 10800000,
  },
  {
    email: 'qa@dorren.com',
    name: 'Ли В.',
    role: 'user',
    avatar: 'https://placehold.co/100/100?random=105',
    coins: 0,
    createdAtOffset: 14400000,
  },
];

const mockNews = [
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
    createdAtOffset: 0,
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
    createdAtOffset: 86400000,
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
    createdAtOffset: 172800000,
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
    createdAtOffset: 259200000,
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
    createdAtOffset: 345600000,
  },
];

const mockDocs = [
  { id: 1, title: 'Политика безопасности', type: 'PDF', size: '1.2 MB', category: 'Общее', updated: '20 ноября 2024', link: '#', createdAtOffset: 86400000 },
  { id: 2, title: 'Гайд по адаптации', type: 'DOCX', size: '850 KB', category: 'HR', updated: '19 ноября 2024', link: '#', createdAtOffset: 172800000 },
  { id: 3, title: 'Регламент OKR', type: 'XLSX', size: '620 KB', category: 'Процессы', updated: '18 ноября 2024', link: '#', createdAtOffset: 259200000 },
  { id: 4, title: 'Брендбук', type: 'PDF', size: '980 KB', category: 'Маркетинг', updated: '17 ноября 2024', link: '#', createdAtOffset: 345600000 },
  { id: 5, title: 'Положение о премиях', type: 'PDF', size: '1.1 MB', category: 'Финансы', updated: '16 ноября 2024', link: '#', createdAtOffset: 432000000 },
  { id: 6, title: 'Технический регламент', type: 'PDF', size: '2.3 MB', category: 'Производство', updated: '15 ноября 2024', link: '#', createdAtOffset: 518400000 },
  { id: 7, title: 'План развития на 2025', type: 'PDF', size: '1.8 MB', category: 'Стратегия', updated: '14 ноября 2024', link: '#', createdAtOffset: 604800000 },
  { id: 8, title: 'Стандарты качества', type: 'PDF', size: '950 KB', category: 'Качество', updated: '13 ноября 2024', link: '#', createdAtOffset: 691200000 },
];

const mockTasks = [
  {
    id: '1',
    title: 'Запустить рассылку по новым OKR',
    description: 'Обновить шаблоны писем, добавить ссылки на Confluence, проверить сегменты.',
    status: 'todo',
    priority: 'high',
    assigneeEmail: 'pm@dorren.com',
    assigneeName: 'Смирнов А.',
    assigneeAvatar: 'https://placehold.co/100/100?random=102',
    createdAtOffset: 0,
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
    createdAtOffset: 86400000 * 2,
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
    createdAtOffset: 3600000,
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
    createdAtOffset: 86400000 * 5,
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
    createdAtOffset: 86400000 * 10,
  },
  {
    id: '6',
    title: 'Подготовить презентацию для клиента',
    description: 'Создать слайды с новыми проектами и кейсами.',
    status: 'todo',
    priority: 'high',
    createdAtOffset: 1800000,
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
    createdAtOffset: 7200000,
  },
];

const mockCourses = [
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
    createdAtOffset: 0,
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
    createdAtOffset: 86400000,
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
    createdAtOffset: 172800000,
  },
];

// Функция инициализации всех данных
export const initializeAllData = mutation(async ({ db }, {
  token
}: {
  token: string
}) => {
  await requireAdmin(db, token);
  
  const results = {
    users: { success: false, count: 0 },
    news: { success: false, count: 0 },
    docs: { success: false, count: 0 },
    tasks: { success: false, count: 0 },
    courses: { success: false, count: 0 },
  };
  
  const now = Date.now();
  
  try {
    // Инициализация пользователей
    const existingUsers = await db.query('users').collect();
    if (existingUsers.length === 0) {
      for (const user of mockUsers) {
        await db.insert('users', {
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          coins: user.coins,
          createdAt: now - user.createdAtOffset,
        });
      }
      results.users = { success: true, count: mockUsers.length };
    }
    
    // Инициализация новостей
    const existingNews = await db.query('news').collect();
    if (existingNews.length === 0) {
      for (const newsItem of mockNews) {
        await db.insert('news', {
          id: newsItem.id,
          title: newsItem.title,
          category: newsItem.category,
          date: newsItem.date,
          image: newsItem.image,
          excerpt: newsItem.excerpt,
          description: newsItem.description,
          slug: newsItem.slug,
          body: newsItem.body,
          createdAt: now - newsItem.createdAtOffset,
        });
      }
      results.news = { success: true, count: mockNews.length };
    }
    
    // Инициализация документов
    const existingDocs = await db.query('docs').collect();
    if (existingDocs.length === 0) {
      for (const doc of mockDocs) {
        await db.insert('docs', {
          id: doc.id,
          title: doc.title,
          type: doc.type,
          size: doc.size,
          category: doc.category,
          updated: doc.updated,
          link: doc.link,
          createdAt: now - doc.createdAtOffset,
        });
      }
      results.docs = { success: true, count: mockDocs.length };
    }
    
    // Инициализация задач
    const existingTasks = await db.query('tasks').collect();
    if (existingTasks.length === 0) {
      for (const task of mockTasks) {
        await db.insert('tasks', {
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          assigneeEmail: task.assigneeEmail,
          assigneeName: task.assigneeName,
          assigneeAvatar: task.assigneeAvatar,
          createdAt: now - task.createdAtOffset,
        });
      }
      results.tasks = { success: true, count: mockTasks.length };
    }
    
    // Инициализация курсов
    const existingCourses = await db.query('courses').collect();
    if (existingCourses.length === 0) {
      for (const course of mockCourses) {
        await db.insert('courses', {
          id: course.id,
          title: course.title,
          category: course.category,
          description: course.description,
          progress: course.progress,
          totalModules: course.totalModules,
          thumbnail: course.thumbnail,
          duration: course.duration,
          badge: course.badge,
          createdAt: now - course.createdAtOffset,
        });
      }
      results.courses = { success: true, count: mockCourses.length };
    }
    
    return { 
      success: true, 
      message: 'Все данные успешно инициализированы',
      results 
    };
    
  } catch (error) {
    return { 
      success: false, 
      message: `Ошибка при инициализации данных: ${error.message}`,
      results 
    };
  }
});
