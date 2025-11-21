import React, { useEffect, useMemo, useState } from 'react';
import {
  Course,
  CourseModule,
  DocumentItem,
  ModuleKind,
  NewsItem,
  Quiz,
  QuizQuestion,
  HomeConfig,
} from '../types';
import { Save, AlertTriangle, Plus, Trash, GripVertical, Upload, Image as ImageIcon, Layers, FileText, BookOpen, HelpCircle } from 'lucide-react';

type TabKey = 'news' | 'docs' | 'courses' | 'home';

interface AdminPanelProps {
  news: NewsItem[];
  docs: DocumentItem[];
  courses: Course[];
  home: HomeConfig;
  onNewsChange: (items: NewsItem[]) => void;
  onDocsChange: (items: DocumentItem[]) => void;
  onCoursesChange: (items: Course[]) => void;
  onHomeChange: (config: HomeConfig) => void;
  adminEnabled: boolean;
}

const emptyNews = (): NewsItem => ({
  id: Date.now(),
  title: '',
  category: 'Общее',
  date: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' }),
  image: '',
  excerpt: '',
  slug: `novost-${Date.now()}`,
  body: [''],
});

const emptyDoc = (): DocumentItem => ({
  id: Date.now(),
  title: '',
  type: 'PDF',
  size: '-',
  category: 'Общее',
  updated: new Date().toLocaleDateString('ru-RU'),
  link: '#',
});

const emptyCourse = (): Course => ({
  id: Date.now(),
  title: 'Новый курс',
  category: 'Общее',
  description: '',
  progress: 0,
  totalModules: 0,
  thumbnail: 'https://placehold.co/600x400',
  duration: '0 мин',
  badge: 'Черновик',
  modules: [],
});

const emptyModule = (courseId: number): CourseModule => ({
  id: `${courseId}-${Date.now()}`,
  title: 'Новый модуль',
  type: 'article',
  duration: '5 мин',
  description: '',
  content: '',
  sections: [],
});

const emptyQuiz = (): Quiz => ({
  title: 'Новый тест',
  questions: [],
});

const emptyQuestion = (): QuizQuestion => ({
  id: `${Date.now()}`,
  text: 'Новый вопрос',
  options: ['Вариант 1', 'Вариант 2', 'Вариант 3'],
  correctIndex: 0,
});

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</label>
    {children}
  </div>
);

const ListCard: React.FC<{
  active: boolean;
  onClick: () => void;
  onDelete: () => void;
  dragProps?: any;
  title: string;
  subtitle?: string;
}> = ({ active, onClick, onDelete, dragProps, title, subtitle }) => (
  <div
    {...dragProps}
    className={`flex items-center gap-3 p-3 border ${active ? 'border-dorren-blue bg-dorren-blue/5' : 'border-gray-200'} hover:border-dorren-blue transition-colors`}
  >
    <GripVertical size={14} className="text-gray-400 cursor-move" />
    <button className="flex-1 text-left" onClick={onClick}>
      <p className="text-sm font-semibold text-dorren-black line-clamp-1">{title || 'Без названия'}</p>
      {subtitle && <p className="text-xs text-gray-500 line-clamp-1">{subtitle}</p>}
    </button>
    <button onClick={onDelete} className="text-red-500 hover:text-red-700">
      <Trash size={14} />
    </button>
  </div>
);
const AdminPanel: React.FC<AdminPanelProps> = ({
  news,
  docs,
  courses,
  home,
  onNewsChange,
  onDocsChange,
  onCoursesChange,
  onHomeChange,
  adminEnabled,
}) => {
  const [tab, setTab] = useState<TabKey>('news');
  const [newsList, setNewsList] = useState(news);
  const [docsList, setDocsList] = useState(docs);
  const [courseList, setCourseList] = useState(courses);
  const [homeConfig, setHomeConfig] = useState<HomeConfig>(home);

  const [selectedNewsId, setSelectedNewsId] = useState<number | null>(news[0]?.id ?? null);
  const [selectedDocId, setSelectedDocId] = useState<number | null>(docs[0]?.id ?? null);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(courses[0]?.id ?? null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(courses[0]?.modules?.[0]?.id ?? null);

  const [newsCategoryFilter, setNewsCategoryFilter] = useState('Все');
  const [docCategoryFilter, setDocCategoryFilter] = useState('Все');
  const [error, setError] = useState('');

  useEffect(() => setNewsList(news), [news]);
  useEffect(() => setDocsList(docs), [docs]);
  useEffect(() => setCourseList(courses), [courses]);
  useEffect(() => setHomeConfig(home), [home]);

  const newsCategories = useMemo(() => ['Все', ...new Set(newsList.map((n) => n.category))], [newsList]);
  const docCategories = useMemo(() => ['Все', ...new Set(docsList.map((d) => d.category))], [docsList]);

  const selectedNews = newsList.find((n) => n.id === selectedNewsId) ?? null;
  const selectedDoc = docsList.find((d) => d.id === selectedDocId) ?? null;
  const selectedCourse = courseList.find((c) => c.id === selectedCourseId) ?? null;
  const selectedModule = selectedCourse?.modules?.find((m) => m.id === selectedModuleId) ?? null;

  const saveAll = () => {
    setError('');
    try {
      onNewsChange(newsList);
      onDocsChange(docsList);
      onCoursesChange(courseList);
      onHomeChange(homeConfig);
    } catch (e) {
      setError('Ошибка сохранения: проверьте введенные данные.');
    }
  };

  const handleDropReorder = <T,>(list: T[], setList: (v: T[]) => void, e: React.DragEvent, to: number) => {
    const from = Number(e.dataTransfer.getData('text/plain'));
    if (Number.isNaN(from)) return;
    const copy = [...list];
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    setList(copy);
  };

  const newsFiltered = newsCategoryFilter === 'Все' ? newsList : newsList.filter((n) => n.category === newsCategoryFilter);
  const docsFiltered = docCategoryFilter === 'Все' ? docsList : docsList.filter((d) => d.category === docCategoryFilter);

  const updateModule = (field: keyof CourseModule, value: any) => {
    if (!selectedCourse || !selectedModule) return;
    setCourseList((prev) =>
      prev.map((c) =>
        c.id === selectedCourse.id
          ? {
              ...c,
              modules: c.modules?.map((m) => (m.id === selectedModule.id ? { ...m, [field]: value } : m)),
              totalModules: c.modules?.length ?? 0,
            }
          : c,
      ),
    );
  };

  const updateCourse = (field: keyof Course, value: any) => {
    if (!selectedCourse) return;
    setCourseList((prev) =>
      prev.map((c) =>
        c.id === selectedCourse.id ? { ...c, [field]: value, totalModules: c.modules?.length ?? c.totalModules ?? 0 } : c,
      ),
    );
  };

  const updateQuizQuestion = (qid: string, updater: (q: QuizQuestion) => QuizQuestion) => {
    if (!selectedModule || !selectedModule.quiz) return;
    const questions = selectedModule.quiz.questions.map((q) => (q.id === qid ? updater(q) : q));
    updateModule('quiz', { ...selectedModule.quiz, questions });
  };
  const newsEditor = (
    <div className="grid lg:grid-cols-[340px_auto] gap-6">
      <div className="bg-white border border-gray-200 p-3 space-y-3 max-h-[520px] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-dorren-black flex items-center gap-2">
            <Layers size={16} /> Новости
          </div>
          <button
            className="text-xs uppercase tracking-wider text-dorren-dark flex items-center gap-1"
            onClick={() => {
              const item = emptyNews();
              setNewsList([item, ...newsList]);
              setSelectedNewsId(item.id);
            }}
          >
            <Plus size={14} /> Добавить
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Категория:</span>
          <select
            className="border border-gray-200 text-xs px-2 py-1"
            value={newsCategoryFilter}
            onChange={(e) => setNewsCategoryFilter(e.target.value)}
          >
            {newsCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          {newsFiltered.map((item, idx) => (
            <ListCard
              key={item.id}
              active={item.id === selectedNewsId}
              title={item.title}
              subtitle={item.category}
              onClick={() => setSelectedNewsId(item.id)}
              onDelete={() => {
                const updated = newsList.filter((n) => n.id !== item.id);
                setNewsList(updated);
                if (selectedNewsId === item.id) setSelectedNewsId(updated[0]?.id ?? null);
              }}
              dragProps={{
                draggable: true,
                onDragStart: (e: any) => e.dataTransfer.setData('text/plain', String(newsList.findIndex((n) => n.id === item.id))),
                onDragOver: (e: any) => e.preventDefault(),
                onDrop: (e: any) => handleDropReorder(newsList, setNewsList, e, idx),
              }}
            />
          ))}
        </div>
      </div>

      {selectedNews ? (
        <div className="bg-white border border-gray-100 p-6 space-y-4 shadow-sm">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Заголовок">
              <input
                className="w-full border border-gray-200 px-3 py-2 text-sm"
                value={selectedNews.title}
                onChange={(e) =>
                  setNewsList((prev) => prev.map((n) => (n.id === selectedNews.id ? { ...n, title: e.target.value } : n)))
                }
              />
            </Field>
            <Field label="Категория">
              <input
                className="w-full border border-gray-200 px-3 py-2 text-sm"
                value={selectedNews.category}
                onChange={(e) =>
                  setNewsList((prev) => prev.map((n) => (n.id === selectedNews.id ? { ...n, category: e.target.value } : n)))
                }
              />
            </Field>
            <Field label="Дата">
              <input
                className="w-full border border-gray-200 px-3 py-2 text-sm"
                value={selectedNews.date}
                onChange={(e) =>
                  setNewsList((prev) => prev.map((n) => (n.id === selectedNews.id ? { ...n, date: e.target.value } : n)))
                }
              />
            </Field>
            <Field label="Краткое описание">
              <input
                className="w-full border border-gray-200 px-3 py-2 text-sm"
                value={selectedNews.excerpt}
                onChange={(e) =>
                  setNewsList((prev) => prev.map((n) => (n.id === selectedNews.id ? { ...n, excerpt: e.target.value } : n)))
                }
              />
            </Field>
            <Field label="Slug (для ссылки)">
              <input
                className="w-full border border-gray-200 px-3 py-2 text-sm"
                value={selectedNews.slug ?? ''}
                onChange={(e) =>
                  setNewsList((prev) => prev.map((n) => (n.id === selectedNews.id ? { ...n, slug: e.target.value } : n)))
                }
              />
            </Field>
          </div>
          <Field label="Текст новости (по абзацам)">
            <textarea
              className="w-full border border-gray-200 px-3 py-2 text-sm h-28"
              value={(selectedNews.body ?? []).join('\n')}
              onChange={(e) =>
                setNewsList((prev) =>
                  prev.map((n) =>
                    n.id === selectedNews.id
                      ? { ...n, body: e.target.value.split('\n').map((line) => line.trim()).filter(Boolean) }
                      : n,
                  ),
                )
              }
            />
          </Field>
          <Field label="Изображение (URL или перетянуть ссылку)">
            <input
              className="w-full border border-gray-200 px-3 py-2 text-sm"
              value={selectedNews.image}
              onChange={(e) =>
                setNewsList((prev) => prev.map((n) => (n.id === selectedNews.id ? { ...n, image: e.target.value } : n)))
              }
            />
            <div
              onDrop={(e) => {
                e.preventDefault();
                const url = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
                if (url)
                  setNewsList((prev) => prev.map((n) => (n.id === selectedNews.id ? { ...n, image: url } : n)));
              }}
              onDragOver={(e) => e.preventDefault()}
              className="mt-2 border border-dashed border-gray-300 p-3 text-xs text-gray-500 flex items-center gap-2"
            >
              <ImageIcon size={14} /> Перетащите ссылку на изображение
            </div>
            {selectedNews.image && (
              <img src={selectedNews.image} alt={selectedNews.title} className="mt-3 w-full max-h-48 object-cover border border-gray-100" />
            )}
          </Field>
        </div>
      ) : (
        <div className="p-6 bg-white border border-gray-100 text-sm text-gray-500">Выберите новость для редактирования</div>
      )}
    </div>
  );
  const docsEditor = (
    <div className="grid lg:grid-cols-[340px_auto] gap-6">
      <div className="bg-white border border-gray-200 p-3 space-y-3 max-h-[520px] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-dorren-black flex items-center gap-2">
            <FileText size={16} /> Документы
          </div>
          <button
            className="text-xs uppercase tracking-wider text-dorren-dark flex items-center gap-1"
            onClick={() => {
              const item = emptyDoc();
              setDocsList([item, ...docsList]);
              setSelectedDocId(item.id);
            }}
          >
            <Plus size={14} /> Добавить
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Категория:</span>
          <select
            className="border border-gray-200 text-xs px-2 py-1"
            value={docCategoryFilter}
            onChange={(e) => setDocCategoryFilter(e.target.value)}
          >
            {docCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          {docsFiltered.map((item, idx) => (
            <ListCard
              key={item.id}
              active={item.id === selectedDocId}
              title={item.title}
              subtitle={item.category}
              onClick={() => setSelectedDocId(item.id)}
              onDelete={() => {
                const updated = docsList.filter((d) => d.id !== item.id);
                setDocsList(updated);
                if (selectedDocId === item.id) setSelectedDocId(updated[0]?.id ?? null);
              }}
              dragProps={{
                draggable: true,
                onDragStart: (e: any) => e.dataTransfer.setData('text/plain', String(docsList.findIndex((d) => d.id === item.id))),
                onDragOver: (e: any) => e.preventDefault(),
                onDrop: (e: any) => handleDropReorder(docsList, setDocsList, e, idx),
              }}
            />
          ))}
        </div>
      </div>

      {selectedDoc ? (
        <div className="bg-white border border-gray-100 p-6 space-y-4 shadow-sm">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Название">
              <input
                className="w-full border border-gray-200 px-3 py-2 text-sm"
                value={selectedDoc.title}
                onChange={(e) =>
                  setDocsList((prev) => prev.map((d) => (d.id === selectedDoc.id ? { ...d, title: e.target.value } : d)))
                }
              />
            </Field>
            <Field label="Категория">
              <input
                className="w-full border border-gray-200 px-3 py-2 text-sm"
                value={selectedDoc.category}
                onChange={(e) =>
                  setDocsList((prev) => prev.map((d) => (d.id === selectedDoc.id ? { ...d, category: e.target.value } : d)))
                }
              />
            </Field>
            <Field label="Тип">
              <input
                className="w-full border border-gray-200 px-3 py-2 text-sm"
                value={selectedDoc.type}
                onChange={(e) =>
                  setDocsList((prev) => prev.map((d) => (d.id === selectedDoc.id ? { ...d, type: e.target.value } : d)))
                }
              />
            </Field>
            <Field label="Размер">
              <input
                className="w-full border border-gray-200 px-3 py-2 text-sm"
                value={selectedDoc.size}
                onChange={(e) =>
                  setDocsList((prev) => prev.map((d) => (d.id === selectedDoc.id ? { ...d, size: e.target.value } : d)))
                }
              />
            </Field>
            <Field label="Обновлено">
              <input
                className="w-full border border-gray-200 px-3 py-2 text-sm"
                value={selectedDoc.updated}
                onChange={(e) =>
                  setDocsList((prev) => prev.map((d) => (d.id === selectedDoc.id ? { ...d, updated: e.target.value } : d)))
                }
              />
            </Field>
            <Field label="Ссылка / путь">
              <input
                className="w-full border border-gray-200 px-3 py-2 text-sm"
                value={selectedDoc.link}
                onChange={(e) =>
                  setDocsList((prev) => prev.map((d) => (d.id === selectedDoc.id ? { ...d, link: e.target.value } : d)))
                }
              />
            </Field>
          </div>
          <div
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (!file) return;
              const parts = file.name.split('.');
              const ext = parts.length > 1 ? parts.pop() : 'file';
              const sizeMb = `${(file.size / 1024 / 1024).toFixed(1)} MB`;
              setDocsList((prev) =>
                prev.map((d) =>
                  d.id === selectedDoc.id
                    ? { ...d, title: file.name, type: (ext || 'file').toUpperCase(), size: sizeMb }
                    : d,
                ),
              );
            }}
            onDragOver={(e) => e.preventDefault()}
            className="border border-dashed border-gray-300 p-4 text-xs text-gray-500 flex items-center gap-2"
          >
            <Upload size={14} /> Перетащите файл, чтобы заполнить название/тип/размер
          </div>
        </div>
      ) : (
        <div className="p-6 bg-white border border-gray-100 text-sm text-gray-500">Выберите документ для редактирования</div>
      )}
    </div>
  );
  const coursesEditor = (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-[320px_auto] gap-6">
        <div className="bg-white border border-gray-200 p-3 space-y-3 max-h-[520px] overflow-y-auto">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-dorren-black flex items-center gap-2">
              <BookOpen size={16} /> Курсы
            </div>
            <button
              className="text-xs uppercase tracking-wider text-dorren-dark flex items-center gap-1"
              onClick={() => {
                const c = emptyCourse();
                setCourseList([c, ...courseList]);
                setSelectedCourseId(c.id);
                setSelectedModuleId(null);
              }}
            >
              <Plus size={14} /> Новый курс
            </button>
          </div>
          <div className="space-y-2">
            {courseList.map((course) => (
              <div
                key={course.id}
                className={`p-3 border ${course.id === selectedCourseId ? 'border-dorren-blue bg-dorren-blue/5' : 'border-gray-200'} hover:border-dorren-blue transition-colors`}
              >
                <button
                  className="w-full text-left"
                  onClick={() => {
                    setSelectedCourseId(course.id);
                    setSelectedModuleId(course.modules?.[0]?.id ?? null);
                  }}
                >
                  <p className="text-sm font-semibold text-dorren-black line-clamp-1">{course.title}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {course.category ?? 'Общее'} • {course.duration ?? '—'}
                  </p>
                </button>
                <div className="flex justify-end mt-2">
                  <button
                    className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                    onClick={() => {
                      const updated = courseList.filter((c) => c.id !== course.id);
                      setCourseList(updated);
                      if (selectedCourseId === course.id) {
                        setSelectedCourseId(updated[0]?.id ?? null);
                        setSelectedModuleId(updated[0]?.modules?.[0]?.id ?? null);
                      }
                    }}
                  >
                    <Trash size={14} /> Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedCourse ? (
          <div className="bg-white border border-gray-100 p-6 space-y-5 shadow-sm">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Название курса">
                <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={selectedCourse.title} onChange={(e) => updateCourse('title', e.target.value)} />
              </Field>
              <Field label="Категория">
                <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={selectedCourse.category ?? ''} onChange={(e) => updateCourse('category', e.target.value)} />
              </Field>
              <Field label="Бейдж">
                <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={selectedCourse.badge ?? ''} onChange={(e) => updateCourse('badge', e.target.value)} />
              </Field>
              <Field label="Длительность">
                <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={selectedCourse.duration ?? ''} onChange={(e) => updateCourse('duration', e.target.value)} />
              </Field>
              <Field label="Автор / тренер">
                <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={selectedCourse.author ?? ''} onChange={(e) => updateCourse('author', e.target.value)} />
              </Field>
              <Field label="Прогресс (%)">
                <input
                  type="number"
                  className="w-full border border-gray-200 px-3 py-2 text-sm"
                  value={selectedCourse.progress}
                  onChange={(e) => updateCourse('progress', Number(e.target.value))}
                />
              </Field>
              <Field label="Количество модулей">
                <input
                  type="number"
                  className="w-full border border-gray-200 px-3 py-2 text-sm"
                  value={selectedCourse.totalModules ?? selectedCourse.modules?.length ?? 0}
                  onChange={(e) => updateCourse('totalModules', Number(e.target.value))}
                />
              </Field>
              <Field label="Обложка (URL)">
                <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={selectedCourse.thumbnail} onChange={(e) => updateCourse('thumbnail', e.target.value)} />
              </Field>
            </div>

            <Field label="Описание">
              <textarea className="w-full border border-gray-200 px-3 py-2 text-sm h-20" value={selectedCourse.description ?? ''} onChange={(e) => updateCourse('description', e.target.value)} />
            </Field>

            <div className="border border-gray-200 p-3 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-dorren-black flex items-center gap-2">
                  <Layers size={16} /> Модули курса ({selectedCourse.modules?.length ?? 0})
                </p>
                <button
                  className="text-xs uppercase tracking-wider text-dorren-dark flex items-center gap-1"
                  onClick={() => {
                    const m = emptyModule(selectedCourse.id);
                    setCourseList((prev) =>
                      prev.map((c) =>
                        c.id === selectedCourse.id
                          ? { ...c, modules: [...(c.modules ?? []), m], totalModules: (c.modules?.length ?? 0) + 1 }
                          : c,
                      ),
                    );
                    setSelectedModuleId(m.id);
                  }}
                >
                  <Plus size={14} /> Добавить модуль
                </button>
              </div>

              <div className="grid md:grid-cols-[300px_auto] gap-3">
                <div className="space-y-2">
                  {(selectedCourse.modules ?? []).map((module, idx) => (
                    <ListCard
                      key={module.id}
                      active={module.id === selectedModuleId}
                      title={module.title}
                      subtitle={module.type}
                      onClick={() => setSelectedModuleId(module.id)}
                      onDelete={() => {
                        const updatedModules = (selectedCourse.modules ?? []).filter((m) => m.id !== module.id);
                        setCourseList((prev) =>
                          prev.map((c) =>
                            c.id === selectedCourse.id ? { ...c, modules: updatedModules, totalModules: updatedModules.length } : c,
                          ),
                        );
                        if (selectedModuleId === module.id) setSelectedModuleId(updatedModules[0]?.id ?? null);
                      }}
                      dragProps={{
                        draggable: true,
                        onDragStart: (e: any) =>
                          e.dataTransfer.setData(
                            'text/plain',
                            String((selectedCourse.modules ?? []).findIndex((m) => m.id === module.id)),
                          ),
                        onDragOver: (e: any) => e.preventDefault(),
                        onDrop: (e: any) => {
                          if (!selectedCourse.modules) return;
                          const from = Number(e.dataTransfer.getData('text/plain'));
                          if (Number.isNaN(from)) return;
                          const copy = [...selectedCourse.modules];
                          const [moved] = copy.splice(from, 1);
                          copy.splice(idx, 0, moved);
                          setCourseList((prev) =>
                            prev.map((c) => (c.id === selectedCourse.id ? { ...c, modules: copy, totalModules: copy.length } : c)),
                          );
                        },
                      }}
                    />
                  ))}
                </div>

                {selectedModule ? (
                  <div className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      <Field label="Название модуля">
                        <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={selectedModule.title} onChange={(e) => updateModule('title', e.target.value)} />
                      </Field>
                      <Field label="Тип">
                        <select
                          className="w-full border border-gray-200 px-3 py-2 text-sm"
                          value={selectedModule.type}
                          onChange={(e) => updateModule('type', e.target.value as ModuleKind)}
                        >
                          <option value="video">Видео</option>
                          <option value="article">Статья</option>
                          <option value="image">Изображение</option>
                          <option value="quiz">Квиз</option>
                          <option value="assessment">Аттестация</option>
                        </select>
                      </Field>
                      <Field label="Длительность">
                        <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={selectedModule.duration} onChange={(e) => updateModule('duration', e.target.value)} />
                      </Field>
                      <Field label="Видео (URL)">
                        <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={selectedModule.videoUrl ?? ''} onChange={(e) => updateModule('videoUrl', e.target.value)} />
                      </Field>
                      <Field label="Изображение (URL)">
                        <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={selectedModule.imageUrl ?? ''} onChange={(e) => updateModule('imageUrl', e.target.value)} />
                      </Field>
                    </div>

                    <Field label="Контент / описание">
                      <textarea className="w-full border border-gray-200 px-3 py-2 text-sm h-20" value={selectedModule.content ?? selectedModule.description ?? ''} onChange={(e) => updateModule('content', e.target.value)} />
                    </Field>

                    <Field label="Подразделы (каждый с новой строки)">
                      <textarea
                        className="w-full border border-gray-200 px-3 py-2 text-sm h-20"
                        value={(selectedModule.sections ?? []).join('\n')}
                        onChange={(e) =>
                          updateModule(
                            'sections',
                            e.target.value
                              .split('\n')
                              .map((l) => l.trim())
                              .filter(Boolean),
                          )
                        }
                      />
                    </Field>

                    {(selectedModule.type === 'quiz' || selectedModule.type === 'assessment') && (
                      <div className="border border-gray-200 p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-dorren-black flex items-center gap-2">
                            <HelpCircle size={16} /> Вопросы ({selectedModule.quiz?.questions.length ?? 0})
                          </p>
                          <button
                            className="text-xs uppercase tracking-wider text-dorren-dark flex items-center gap-1"
                            onClick={() =>
                              updateModule(
                                'quiz',
                                selectedModule.quiz
                                  ? { ...selectedModule.quiz, questions: [...selectedModule.quiz.questions, emptyQuestion()] }
                                  : { ...emptyQuiz(), questions: [emptyQuestion()] },
                              )
                            }
                          >
                            <Plus size={14} /> Добавить вопрос
                          </button>
                        </div>
                        {(selectedModule.quiz?.questions ?? []).map((q, idx) => (
                          <div key={q.id} className="border border-gray-200 p-3 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">Вопрос {idx + 1}</span>
                              <button
                                className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                                onClick={() =>
                                  updateModule('quiz', {
                                    ...(selectedModule.quiz ?? emptyQuiz()),
                                    questions: (selectedModule.quiz?.questions ?? []).filter((qq) => qq.id !== q.id),
                                  })
                                }
                              >
                                <Trash size={12} /> Удалить
                              </button>
                            </div>
                            <input
                              className="w-full border border-gray-200 px-3 py-2 text-sm"
                              value={q.text}
                              onChange={(e) => updateQuizQuestion(q.id, (prev) => ({ ...prev, text: e.target.value }))}
                            />
                            {(q.options ?? []).map((opt, optIdx) => (
                              <div key={optIdx} className="flex items-center gap-2">
                                <input
                                  className="flex-1 border border-gray-200 px-3 py-2 text-sm"
                                  value={opt}
                                  onChange={(e) =>
                                    updateQuizQuestion(q.id, (prev) => {
                                      const options = [...prev.options];
                                      options[optIdx] = e.target.value;
                                      return { ...prev, options };
                                    })
                                  }
                                />
                                <label className="flex items-center gap-1 text-xs text-gray-600">
                                  <input
                                    type="radio"
                                    checked={q.correctIndex === optIdx}
                                    onChange={() => updateQuizQuestion(q.id, (prev) => ({ ...prev, correctIndex: optIdx }))}
                                  />
                                  Правильный
                                </label>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 border border-dashed border-gray-200 text-sm text-gray-500">Выберите модуль для редактирования</div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-white border border-gray-100 text-sm text-gray-500">Выберите курс, чтобы открыть редактирование.</div>
        )}
      </div>
    </div>
  );
  const homeEditor = (
    <div className="space-y-6">
      <div className="bg-white border border-gray-100 p-4 shadow-sm space-y-3">
        <h4 className="text-sm font-semibold text-dorren-black uppercase tracking-brand">Hero-блок</h4>
        <div className="grid md:grid-cols-2 gap-3">
          <Field label="Заголовок">
            <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={homeConfig.hero?.title ?? ''} onChange={(e) => setHomeConfig({ ...homeConfig, hero: { ...homeConfig.hero, title: e.target.value } })} />
          </Field>
          <Field label="Дата">
            <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={homeConfig.hero?.date ?? ''} onChange={(e) => setHomeConfig({ ...homeConfig, hero: { ...homeConfig.hero, date: e.target.value } })} />
          </Field>
          <Field label="Подзаголовок">
            <textarea className="w-full border border-gray-200 px-3 py-2 text-sm h-16" value={homeConfig.hero?.subtitle ?? ''} onChange={(e) => setHomeConfig({ ...homeConfig, hero: { ...homeConfig.hero, subtitle: e.target.value } })} />
          </Field>
          <Field label="Изображение (URL)">
            <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={homeConfig.hero?.image ?? ''} onChange={(e) => setHomeConfig({ ...homeConfig, hero: { ...homeConfig.hero, image: e.target.value } })} />
          </Field>
          <Field label="CTA текст">
            <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={homeConfig.hero?.ctaText ?? ''} onChange={(e) => setHomeConfig({ ...homeConfig, hero: { ...homeConfig.hero, ctaText: e.target.value } })} />
          </Field>
          <Field label="CTA ссылка">
            <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={homeConfig.hero?.ctaLink ?? ''} onChange={(e) => setHomeConfig({ ...homeConfig, hero: { ...homeConfig.hero, ctaLink: e.target.value } })} />
          </Field>
        </div>
      </div>

      <div className="bg-white border border-gray-100 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-dorren-black uppercase tracking-brand">Плитки рядом</h4>
          <button
            className="text-xs uppercase tracking-wider text-dorren-dark flex items-center gap-1"
            onClick={() =>
              setHomeConfig({
                ...homeConfig,
                tiles: [...homeConfig.tiles, { title: 'Новая плитка', description: '', cta: '', link: '', variant: 'secondary' }],
              })
            }
          >
            <Plus size={14} /> Добавить
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {homeConfig.tiles.map((tile, idx) => (
            <div key={idx} className="border border-gray-200 p-3 space-y-2">
              <Field label="Заголовок">
                <input
                  className="w-full border border-gray-200 px-3 py-2 text-sm"
                  value={tile.title}
                  onChange={(e) =>
                    setHomeConfig({
                      ...homeConfig,
                      tiles: homeConfig.tiles.map((t, i) => (i === idx ? { ...t, title: e.target.value } : t)),
                    })
                  }
                />
              </Field>
              <Field label="Описание">
                <input
                  className="w-full border border-gray-200 px-3 py-2 text-sm"
                  value={tile.description}
                  onChange={(e) =>
                    setHomeConfig({
                      ...homeConfig,
                      tiles: homeConfig.tiles.map((t, i) => (i === idx ? { ...t, description: e.target.value } : t)),
                    })
                  }
                />
              </Field>
              <Field label="CTA текст">
                <input
                  className="w-full border border-gray-200 px-3 py-2 text-sm"
                  value={tile.cta ?? ''}
                  onChange={(e) =>
                    setHomeConfig({
                      ...homeConfig,
                      tiles: homeConfig.tiles.map((t, i) => (i === idx ? { ...t, cta: e.target.value } : t)),
                    })
                  }
                />
              </Field>
              <Field label="CTA ссылка">
                <input
                  className="w-full border border-gray-200 px-3 py-2 text-sm"
                  value={tile.link ?? ''}
                  onChange={(e) =>
                    setHomeConfig({
                      ...homeConfig,
                      tiles: homeConfig.tiles.map((t, i) => (i === idx ? { ...t, link: e.target.value } : t)),
                    })
                  }
                />
              </Field>
              <Field label="Вариант (primary/secondary)">
                <input
                  className="w-full border border-gray-200 px-3 py-2 text-sm"
                  value={tile.variant ?? ''}
                  onChange={(e) =>
                    setHomeConfig({
                      ...homeConfig,
                      tiles: homeConfig.tiles.map((t, i) => (i === idx ? { ...t, variant: e.target.value as any } : t)),
                    })
                  }
                />
              </Field>
              <div className="flex justify-end">
                <button
                  className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                  onClick={() =>
                    setHomeConfig({ ...homeConfig, tiles: homeConfig.tiles.filter((_, i) => i !== idx) })
                  }
                >
                  <Trash size={12} /> Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-100 p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-dorren-black uppercase tracking-brand">Уведомления</h4>
            <button
              className="text-xs text-dorren-dark flex items-center gap-1"
              onClick={() => setHomeConfig({ ...homeConfig, notifications: [...homeConfig.notifications, 'Новое уведомление'] })}
            >
              <Plus size={14} /> Добавить
            </button>
          </div>
          {homeConfig.notifications.map((n, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                className="flex-1 border border-gray-200 px-3 py-2 text-sm"
                value={n}
                onChange={(e) =>
                  setHomeConfig({
                    ...homeConfig,
                    notifications: homeConfig.notifications.map((v, i) => (i === idx ? e.target.value : v)),
                  })
                }
              />
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() =>
                  setHomeConfig({ ...homeConfig, notifications: homeConfig.notifications.filter((_, i) => i !== idx) })
                }
              >
                <Trash size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-100 p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-dorren-black uppercase tracking-brand">Задачи</h4>
            <button
              className="text-xs text-dorren-dark flex items-center gap-1"
              onClick={() =>
                setHomeConfig({
                  ...homeConfig,
                  tasks: [...homeConfig.tasks, { id: Date.now(), title: 'Новая задача', time: '', status: 'pending' }],
                })
              }
            >
              <Plus size={14} /> Добавить
            </button>
          </div>
          {homeConfig.tasks.map((t, idx) => (
            <div key={t.id} className="grid grid-cols-3 gap-2 items-center">
              <input
                className="col-span-2 border border-gray-200 px-3 py-2 text-sm"
                value={t.title}
                onChange={(e) =>
                  setHomeConfig({
                    ...homeConfig,
                    tasks: homeConfig.tasks.map((task, i) => (i === idx ? { ...task, title: e.target.value } : task)),
                  })
                }
              />
              <input
                className="border border-gray-200 px-3 py-2 text-sm"
                value={t.time}
                onChange={(e) =>
                  setHomeConfig({
                    ...homeConfig,
                    tasks: homeConfig.tasks.map((task, i) => (i === idx ? { ...task, time: e.target.value } : task)),
                  })
                }
              />
              <select
                className="border border-gray-200 px-3 py-2 text-sm col-span-2"
                value={t.status}
                onChange={(e) =>
                  setHomeConfig({
                    ...homeConfig,
                    tasks: homeConfig.tasks.map((task, i) => (i === idx ? { ...task, status: e.target.value as any } : task)),
                  })
                }
              >
                <option value="pending">в работе</option>
                <option value="done">готово</option>
              </select>
              <button
                className="text-red-500 hover:text-red-700 text-xs"
                onClick={() => setHomeConfig({ ...homeConfig, tasks: homeConfig.tasks.filter((_, i) => i !== idx) })}
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-100 p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-dorren-black uppercase tracking-brand">События</h4>
            <button
              className="text-xs text-dorren-dark flex items-center gap-1"
              onClick={() =>
                setHomeConfig({
                  ...homeConfig,
                  events: [...homeConfig.events, { title: 'Новое событие', date: '', place: '', cta: '' }],
                })
              }
            >
              <Plus size={14} /> Добавить
            </button>
          </div>
          {homeConfig.events.map((ev, idx) => (
            <div key={idx} className="grid grid-cols-3 gap-2 items-center">
              <input
                className="col-span-2 border border-gray-200 px-3 py-2 text-sm"
                value={ev.title}
                onChange={(e) =>
                  setHomeConfig({
                    ...homeConfig,
                    events: homeConfig.events.map((v, i) => (i === idx ? { ...v, title: e.target.value } : v)),
                  })
                }
              />
              <input
                className="border border-gray-200 px-3 py-2 text-sm"
                value={ev.date}
                onChange={(e) =>
                  setHomeConfig({
                    ...homeConfig,
                    events: homeConfig.events.map((v, i) => (i === idx ? { ...v, date: e.target.value } : v)),
                  })
                }
              />
              <input
                className="border border-gray-200 px-3 py-2 text-sm"
                value={ev.place}
                onChange={(e) =>
                  setHomeConfig({
                    ...homeConfig,
                    events: homeConfig.events.map((v, i) => (i === idx ? { ...v, place: e.target.value } : v)),
                  })
                }
              />
              <input
                className="col-span-2 border border-gray-200 px-3 py-2 text-sm"
                value={ev.cta ?? ''}
                onChange={(e) =>
                  setHomeConfig({
                    ...homeConfig,
                    events: homeConfig.events.map((v, i) => (i === idx ? { ...v, cta: e.target.value } : v)),
                  })
                }
              />
              <button
                className="text-red-500 hover:text-red-700 text-xs"
                onClick={() => setHomeConfig({ ...homeConfig, events: homeConfig.events.filter((_, i) => i !== idx) })}
              >
                Удалить
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-100 p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-dorren-black uppercase tracking-brand">Приказы / файлы</h4>
            <button
              className="text-xs text-dorren-dark flex items-center gap-1"
              onClick={() =>
                setHomeConfig({
                  ...homeConfig,
                  orders: [...homeConfig.orders, { title: 'Новый приказ', type: 'DOC', size: '' }],
                })
              }
            >
              <Plus size={14} /> Добавить
            </button>
          </div>
          {homeConfig.orders.map((o, idx) => (
            <div key={idx} className="grid grid-cols-3 gap-2 items-center">
              <input
                className="col-span-2 border border-gray-200 px-3 py-2 text-sm"
                value={o.title}
                onChange={(e) =>
                  setHomeConfig({
                    ...homeConfig,
                    orders: homeConfig.orders.map((v, i) => (i === idx ? { ...v, title: e.target.value } : v)),
                  })
                }
              />
              <input
                className="border border-gray-200 px-3 py-2 text-sm"
                value={o.type}
                onChange={(e) =>
                  setHomeConfig({
                    ...homeConfig,
                    orders: homeConfig.orders.map((v, i) => (i === idx ? { ...v, type: e.target.value } : v)),
                  })
                }
              />
              <input
                className="border border-gray-200 px-3 py-2 text-sm"
                value={o.size}
                onChange={(e) =>
                  setHomeConfig({
                    ...homeConfig,
                    orders: homeConfig.orders.map((v, i) => (i === idx ? { ...v, size: e.target.value } : v)),
                  })
                }
              />
              <button
                className="text-red-500 hover:text-red-700 text-xs"
                onClick={() => setHomeConfig({ ...homeConfig, orders: homeConfig.orders.filter((_, i) => i !== idx) })}
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  if (!adminEnabled)
    return (
      <div className="p-6 bg-white border border-gray-200 text-sm text-gray-500">
        Режим администратора выключен или недоступен для текущей роли.
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-light text-dorren-black uppercase tracking-widest mb-1">Админ-панель</h2>
          <p className="text-sm text-gray-500">
            Управляйте новостями, документами, курсами и главной страницей. Поддерживаются перетаскивание, категории, квизы.
          </p>
        </div>
        <button
          className="px-4 py-2 bg-dorren-dark text-white text-xs uppercase tracking-wider hover:bg-black transition-colors flex items-center gap-2"
          onClick={saveAll}
        >
          <Save size={16} /> Сохранить всё
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 p-3">
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      <div className="flex gap-2 text-sm">
        <button
          className={`px-3 py-2 border ${tab === 'news' ? 'border-dorren-dark bg-dorren-dark text-white' : 'border-gray-200 text-dorren-dark hover:border-dorren-dark'}`}
          onClick={() => setTab('news')}
        >
          Новости
        </button>
        <button
          className={`px-3 py-2 border ${tab === 'docs' ? 'border-dorren-dark bg-dorren-dark text-white' : 'border-gray-200 text-dorren-dark hover:border-dorren-dark'}`}
          onClick={() => setTab('docs')}
        >
          Документы
        </button>
        <button
          className={`px-3 py-2 border ${tab === 'courses' ? 'border-dorren-dark bg-dorren-dark text-white' : 'border-gray-200 text-dorren-dark hover:border-dorren-dark'}`}
          onClick={() => setTab('courses')}
        >
          Курсы
        </button>
        <button
          className={`px-3 py-2 border ${tab === 'home' ? 'border-dorren-dark bg-dorren-dark text-white' : 'border-gray-200 text-dorren-dark hover:border-dorren-dark'}`}
          onClick={() => setTab('home')}
        >
          Главная
        </button>
      </div>

      {tab === 'news' && newsEditor}
      {tab === 'docs' && docsEditor}
      {tab === 'courses' && coursesEditor}
      {tab === 'home' && homeEditor}
    </div>
  );
};

export default AdminPanel;
