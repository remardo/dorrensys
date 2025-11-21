import React, { useEffect, useMemo, useState } from 'react';
import { Course, CourseModule, DocumentItem, ModuleKind, NewsItem, Quiz, QuizQuestion } from '../types';
import { Save, AlertTriangle, Plus, Trash, GripVertical, Upload, Image as ImageIcon, Layers, FileText, BookOpen, HelpCircle } from 'lucide-react';

type TabKey = 'news' | 'docs' | 'courses' | 'home';

interface AdminPanelProps {
  news: NewsItem[];
  docs: DocumentItem[];
  courses: Course[];
  onNewsChange: (items: NewsItem[]) => void;
  onDocsChange: (items: DocumentItem[]) => void;
  onCoursesChange: (items: Course[]) => void;
  home: any;
  onHomeChange: (config: any) => void;
  adminEnabled: boolean;
}

const emptyNews = (): NewsItem => ({
  id: Date.now(),
  title: '',
  category: 'General',
  date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
  image: '',
  excerpt: '',
});

const emptyDoc = (): DocumentItem => ({
  id: Date.now(),
  title: '',
  type: 'PDF',
  size: '—',
  category: 'General',
  updated: new Date().toLocaleDateString('en-GB'),
  link: '#',
});

const emptyCourse = (): Course => ({
  id: Date.now(),
  title: 'New course',
  category: 'General',
  description: '',
  progress: 0,
  totalModules: 0,
  thumbnail: 'https://placehold.co/600/400',
  duration: '0 min',
  badge: 'Draft',
  modules: [],
});

const emptyModule = (courseId: number): CourseModule => ({
  id: `${courseId}-${Date.now()}`,
  title: 'New module',
  type: 'article',
  duration: '5 min',
  description: '',
  content: '',
  sections: [],
});

const emptyQuiz = (): Quiz => ({
  title: 'New quiz',
  questions: [],
});

const emptyQuestion = (): QuizQuestion => ({
  id: `${Date.now()}`,
  text: 'New question',
  options: ['Option 1', 'Option 2', 'Option 3'],
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
      <p className="text-sm font-semibold text-dorren-black line-clamp-1">{title || 'Untitled'}</p>
      {subtitle && <p className="text-xs text-gray-500 line-clamp-1">{subtitle}</p>}
    </button>
    <button onClick={onDelete} className="text-red-500 hover:text-red-700">
      <Trash size={14} />
    </button>
  </div>
);

const AdminPanel: React.FC<AdminPanelProps> = ({ news, docs, courses, home, onNewsChange, onDocsChange, onCoursesChange, onHomeChange, adminEnabled }) => {
  const [tab, setTab] = useState<TabKey>('news');
  const [newsList, setNewsList] = useState(news);
  const [docsList, setDocsList] = useState(docs);
  const [courseList, setCourseList] = useState(courses);
  const [homeConfig, setHomeConfig] = useState(home);

  const [selectedNewsId, setSelectedNewsId] = useState<number | null>(news[0]?.id ?? null);
  const [selectedDocId, setSelectedDocId] = useState<number | null>(docs[0]?.id ?? null);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(courses[0]?.id ?? null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(courses[0]?.modules?.[0]?.id ?? null);

  const [newsCategoryFilter, setNewsCategoryFilter] = useState('All');
  const [docCategoryFilter, setDocCategoryFilter] = useState('All');
  const [error, setError] = useState('');

  useEffect(() => setNewsList(news), [news]);
  useEffect(() => setDocsList(docs), [docs]);
  useEffect(() => setCourseList(courses), [courses]);
  useEffect(() => setHomeConfig(home), [home]);

  const newsCategories = useMemo(() => ['All', ...new Set(newsList.map((n) => n.category))], [newsList]);
  const docCategories = useMemo(() => ['All', ...new Set(docsList.map((d) => d.category))], [docsList]);

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
      setError('Save failed. Check data format.');
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

  const newsFiltered = newsCategoryFilter === 'All' ? newsList : newsList.filter((n) => n.category === newsCategoryFilter);
  const docsFiltered = docCategoryFilter === 'All' ? docsList : docsList.filter((d) => d.category === docCategoryFilter);

  const updateModule = (field: keyof CourseModule, value: any) => {
    if (!selectedCourse || !selectedModule) return;
    setCourseList((prev) =>
      prev.map((c) =>
        c.id === selectedCourse.id
          ? { ...c, modules: c.modules?.map((m) => (m.id === selectedModule.id ? { ...m, [field]: value } : m)) }
          : c,
      ),
    );
  };

  const updateCourse = (field: keyof Course, value: any) => {
    if (!selectedCourse) return;
    setCourseList((prev) => prev.map((c) => (c.id === selectedCourse.id ? { ...c, [field]: value } : c)));
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
            <Layers size={16} /> News
          </div>
          <button
            className="text-xs uppercase tracking-wider text-dorren-dark flex items-center gap-1"
            onClick={() => {
              const item = emptyNews();
              setNewsList([item, ...newsList]);
              setSelectedNewsId(item.id);
            }}
          >
            <Plus size={14} /> Add
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Category:</span>
          <select className="border border-gray-200 text-xs px-2 py-1" value={newsCategoryFilter} onChange={(e) => setNewsCategoryFilter(e.target.value)}>
            {newsCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
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
            <Field label="Title">
              <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={selectedNews.title} onChange={(e) => setNewsList((prev) => prev.map((n) => (n.id === selectedNews.id ? { ...n, title: e.target.value } : n)))} />
            </Field>
            <Field label="Category">
              <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={selectedNews.category} onChange={(e) => setNewsList((prev) => prev.map((n) => (n.id === selectedNews.id ? { ...n, category: e.target.value } : n)))} />
            </Field>
            <Field label="Date">
              <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={selectedNews.date} onChange={(e) => setNewsList((prev) => prev.map((n) => (n.id === selectedNews.id ? { ...n, date: e.target.value } : n)))} />
            </Field>
            <Field label="Excerpt">
              <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={selectedNews.excerpt} onChange={(e) => setNewsList((prev) => prev.map((n) => (n.id === selectedNews.id ? { ...n, excerpt: e.target.value } : n)))} />
            </Field>
          </div>
          <Field label="Image URL (or drop link)">
            <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={selectedNews.image} onChange={(e) => setNewsList((prev) => prev.map((n) => (n.id === selectedNews.id ? { ...n, image: e.target.value } : n)))} />
            <div
              onDrop={(e) => {
                e.preventDefault();
                const url = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
                if (url) setNewsList((prev) => prev.map((n) => (n.id === selectedNews.id ? { ...n, image: url } : n)));
              }}
              onDragOver={(e) => e.preventDefault()}
              className="mt-2 border border-dashed border-gray-300 p-3 text-xs text-gray-500 flex items-center gap-2"
            >
              <ImageIcon size={14} /> Drop image link here
            </div>
            {selectedNews.image && <img src={selectedNews.image} alt={selectedNews.title} className="mt-3 w-full max-h-48 object-cover border border-gray-100" />}
          </Field>
        </div>
      ) : (
        <div className="p-6 bg-white border border-gray-100 text-sm text-gray-500">Select a news item to edit</div>
      )}
    </div>
  );

  const docsEditor = (
    <div className="grid lg:grid-cols-[340px_auto] gap-6">
      <div className="bg-white border border-gray-200 p-3 space-y-3 max-h-[520px] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-dorren-black flex items-center gap-2">
            <FileText size={16} /> Documents
          </div>
          <button
            className="text-xs uppercase tracking-wider text-dorren-dark flex items-center gap-1"
            onClick={() => {
              const item = emptyDoc();
              setDocsList([item, ...docsList]);
              setSelectedDocId(item.id);
            }}
          >
            <Plus size={14} /> Add
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Category:</span>
          <select className="border border-gray-200 text-xs px-2 py-1" value={docCategoryFilter} onChange={(e) => setDocCategoryFilter(e.target.value)}>
            {docCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
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
            <Field label="Title">
              <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={selectedDoc.title} onChange={(e) => setDocsList((prev) => prev.map((d) => (d.id === selectedDoc.id ? { ...d, title: e.target.value } : d)))} />
            </Field>
            <Field label="Category">
              <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={selectedDoc.category} onChange={(e) => setDocsList((prev) => prev.map((d) => (d.id === selectedDoc.id ? { ...d, category: e.target.value } : d)))} />
            </Field>
            <Field label="Type">
              <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={selectedDoc.type} onChange={(e) => setDocsList((prev) => prev.map((d) => (d.id === selectedDoc.id ? { ...d, type: e.target.value } : d)))} />
            </Field>
            <Field label="Size">
              <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={selectedDoc.size} onChange={(e) => setDocsList((prev) => prev.map((d) => (d.id === selectedDoc.id ? { ...d, size: e.target.value } : d)))} />
            </Field>
            <Field label="Updated">
              <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={selectedDoc.updated} onChange={(e) => setDocsList((prev) => prev.map((d) => (d.id === selectedDoc.id ? { ...d, updated: e.target.value } : d)))} />
            </Field>
            <Field label="Link">
              <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={selectedDoc.link} onChange={(e) => setDocsList((prev) => prev.map((d) => (d.id === selectedDoc.id ? { ...d, link: e.target.value } : d)))} />
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
            <Upload size={14} /> Drop a file to autofill name/type/size
          </div>
        </div>
      ) : (
        <div className="p-6 bg-white border border-gray-100 text-sm text-gray-500">Select a document to edit</div>
      )}
    </div>
  );

  const coursesEditor = (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-[320px_auto] gap-6">
        <div className="bg-white border border-gray-200 p-3 space-y-3 max-h-[520px] overflow-y-auto">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-dorren-black flex items-center gap-2">
              <BookOpen size={16} /> Courses
            </div>
            <button className="text-xs uppercase tracking-wider text-dorren-dark flex items-center gap-1" onClick={() => {
              const c = emptyCourse();
              setCourseList([c, ...courseList]);
              setSelectedCourseId(c.id);
              setSelectedModuleId(null);
            }}>
              <Plus size={14} /> New course
            </button>
          </div>
          <div className="space-y-2">
            {courseList.map((course) => (
              <div
                key={course.id}
                className={`p-3 border ${course.id === selectedCourseId ? 'border-dorren-blue bg-dorren-blue/5' : 'border-gray-200'} hover:border-dorren-blue transition-colors`}
              >
                <button className="w-full text-left" onClick={() => { setSelectedCourseId(course.id); setSelectedModuleId(course.modules?.[0]?.id ?? null); }}>
                  <p className="text-sm font-semibold text-dorren-black line-clamp-1">{course.title}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{course.category ?? 'General'} · {course.duration}</p>
                </button>
                <div className="flex justify-end mt-2">
                  <button className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1" onClick={() => {
                    const updated = courseList.filter((c) => c.id !== course.id);
                    setCourseList(updated);
                    if (selectedCourseId === course.id) {
                      setSelectedCourseId(updated[0]?.id ?? null);
                      setSelectedModuleId(updated[0]?.modules?.[0]?.id ?? null);
                    }
                  }}>
                    <Trash size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedCourse ? (
          <div className="bg-white border border-gray-100 p-6 space-y-5 shadow-sm">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Course title">
                <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={selectedCourse.title} onChange={(e) => updateCourse('title', e.target.value)} />
              </Field>
              <Field label="Category">
                <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={selectedCourse.category ?? ''} onChange={(e) => updateCourse('category', e.target.value)} />
              </Field>
              <Field label="Badge">
                <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={selectedCourse.badge ?? ''} onChange={(e) => updateCourse('badge', e.target.value)} />
              </Field>
              <Field label="Duration">
                <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={selectedCourse.duration ?? ''} onChange={(e) => updateCourse('duration', e.target.value)} />
              </Field>
              <Field label="Author">
                <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={selectedCourse.author ?? ''} onChange={(e) => updateCourse('author', e.target.value)} />
              </Field>
              <Field label="Thumbnail URL">
                <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={selectedCourse.thumbnail} onChange={(e) => updateCourse('thumbnail', e.target.value)} />
              </Field>
            </div>
            <Field label="Description">
              <textarea className="w-full border border-gray-200 px-3 py-2 text-sm h-20" value={selectedCourse.description ?? ''} onChange={(e) => updateCourse('description', e.target.value)} />
            </Field>

            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-dorren-black flex items-center gap-2">Modules ({selectedCourse.modules?.length ?? 0})</h4>
              <button className="text-xs uppercase tracking-wider text-dorren-dark flex items-center gap-1" onClick={() => {
                const m = emptyModule(selectedCourse.id);
                updateCourse('modules', [...(selectedCourse.modules ?? []), m]);
                updateCourse('totalModules', (selectedCourse.modules?.length ?? 0) + 1);
                setSelectedModuleId(m.id);
              }}>
                <Plus size={14} /> Add module
              </button>
            </div>

            <div className="grid md:grid-cols-[280px_auto] gap-4">
              <div className="border border-gray-200 p-3 space-y-2 max-h-[360px] overflow-y-auto">
                {(selectedCourse.modules ?? []).map((module, idx) => (
                  <ListCard
                    key={module.id}
                    active={module.id === selectedModuleId}
                    title={module.title}
                    subtitle={`${module.type} · ${module.duration}`}
                    onClick={() => setSelectedModuleId(module.id)}
                    onDelete={() => {
                      const mods = (selectedCourse.modules ?? []).filter((m) => m.id !== module.id);
                      updateCourse('modules', mods);
                      updateCourse('totalModules', mods.length);
                      if (selectedModuleId === module.id) setSelectedModuleId(mods[0]?.id ?? null);
                    }}
                    dragProps={{
                      draggable: true,
                      onDragStart: (e: any) => e.dataTransfer.setData('text/plain', String(idx)),
                      onDragOver: (e: any) => e.preventDefault(),
                      onDrop: (e: any) => {
                        const from = Number(e.dataTransfer.getData('text/plain'));
                        if (Number.isNaN(from)) return;
                        const mods = [...(selectedCourse.modules ?? [])];
                        const [moved] = mods.splice(from, 1);
                        mods.splice(idx, 0, moved);
                        updateCourse('modules', mods);
                      },
                    }}
                  />
                ))}
              </div>

              {selectedModule ? (
                <div className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-3">
                    <Field label="Title">
                      <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={selectedModule.title} onChange={(e) => updateModule('title', e.target.value)} />
                    </Field>
                    <Field label="Type">
                      <select className="w-full border border-gray-200 px-3 py-2 text-sm" value={selectedModule.type} onChange={(e) => updateModule('type', e.target.value as ModuleKind)}>
                        <option value="video">Video</option>
                        <option value="article">Article</option>
                        <option value="image">Image</option>
                        <option value="quiz">Quiz</option>
                        <option value="assessment">Assessment</option>
                      </select>
                    </Field>
                    <Field label="Duration">
                      <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={selectedModule.duration} onChange={(e) => updateModule('duration', e.target.value)} />
                    </Field>
                    <Field label="Video URL">
                      <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={selectedModule.videoUrl ?? ''} onChange={(e) => updateModule('videoUrl', e.target.value)} />
                    </Field>
                    <Field label="Image URL">
                      <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={selectedModule.imageUrl ?? ''} onChange={(e) => updateModule('imageUrl', e.target.value)} />
                    </Field>
                  </div>

                  <Field label="Rich content / description">
                    <textarea className="w-full border border-gray-200 px-3 py-2 text-sm h-20" value={selectedModule.content ?? selectedModule.description ?? ''} onChange={(e) => updateModule('content', e.target.value)} />
                  </Field>

                  <Field label="Subsections (one per line)">
                    <textarea className="w-full border border-gray-200 px-3 py-2 text-sm h-20" value={(selectedModule.sections ?? []).join('\n')} onChange={(e) => updateModule('sections', e.target.value.split('\n').map((l) => l.trim()).filter(Boolean))} />
                  </Field>

                  {(selectedModule.type === 'quiz' || selectedModule.type === 'assessment') && (
                    <div className="border border-gray-200 p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-dorren-black flex items-center gap-2"><HelpCircle size={16} /> Questions ({selectedModule.quiz?.questions.length ?? 0})</p>
                        <button
                          className="text-xs uppercase tracking-wider text-dorren-dark flex items-center gap-1"
                          onClick={() => updateModule('quiz', selectedModule.quiz ? { ...selectedModule.quiz, questions: [...selectedModule.quiz.questions, emptyQuestion()] } : { ...emptyQuiz(), questions: [emptyQuestion()] })}
                        >
                          <Plus size={14} /> Add question
                        </button>
                      </div>
                      {(selectedModule.quiz?.questions ?? []).map((q, idx) => (
                        <div key={q.id} className="border border-gray-200 p-3 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Question {idx + 1}</span>
                            <button className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1" onClick={() => updateModule('quiz', { ...(selectedModule.quiz ?? emptyQuiz()), questions: (selectedModule.quiz?.questions ?? []).filter((qq) => qq.id !== q.id) })}>
                              <Trash size={12} /> Delete
                            </button>
                          </div>
                          <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={q.text} onChange={(e) => updateQuizQuestion(q.id, (prev) => ({ ...prev, text: e.target.value }))} />
                          {(q.options ?? []).map((opt, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-2">
                              <input className="flex-1 border border-gray-200 px-3 py-2 text-sm" value={opt} onChange={(e) => updateQuizQuestion(q.id, (prev) => { const options = [...prev.options]; options[optIdx] = e.target.value; return { ...prev, options }; })} />
                              <label className="flex items-center gap-1 text-xs text-gray-600">
                                <input type="radio" checked={q.correctIndex === optIdx} onChange={() => updateQuizQuestion(q.id, (prev) => ({ ...prev, correctIndex: optIdx }))} />
                                Correct
                              </label>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-gray-50 border border-dashed border-gray-200 text-sm text-gray-500">Select a module to edit</div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 bg-white border border-gray-100 text-sm text-gray-500">Select or create a course to edit.</div>
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
          <h4 className="text-sm font-semibold text-dorren-black uppercase tracking-brand">Верхние плитки</h4>
          <button className="text-xs uppercase tracking-wider text-dorren-dark flex items-center gap-1" onClick={() => setHomeConfig({ ...homeConfig, tiles: [...homeConfig.tiles, { title: 'Новая плитка', description: '', cta: '', link: '', variant: 'secondary' }] })}>
            <Plus size={14} /> Добавить
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {homeConfig.tiles.map((tile: any, idx: number) => (
            <div key={idx} className="border border-gray-200 p-3">
              <Field label="Заголовок">
                <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={tile.title} onChange={(e) => setHomeConfig({ ...homeConfig, tiles: homeConfig.tiles.map((t: any, i: number) => i === idx ? { ...t, title: e.target.value } : t) })} />
              </Field>
              <Field label="Описание">
                <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={tile.description} onChange={(e) => setHomeConfig({ ...homeConfig, tiles: homeConfig.tiles.map((t: any, i: number) => i === idx ? { ...t, description: e.target.value } : t) })} />
              </Field>
              <Field label="CTA">
                <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={tile.cta ?? ''} onChange={(e) => setHomeConfig({ ...homeConfig, tiles: homeConfig.tiles.map((t: any, i: number) => i === idx ? { ...t, cta: e.target.value } : t) })} />
              </Field>
              <Field label="Ссылка">
                <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={tile.link ?? ''} onChange={(e) => setHomeConfig({ ...homeConfig, tiles: homeConfig.tiles.map((t: any, i: number) => i === idx ? { ...t, link: e.target.value } : t) })} />
              </Field>
              <Field label="Вариант (primary/secondary)">
                <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={tile.variant ?? ''} onChange={(e) => setHomeConfig({ ...homeConfig, tiles: homeConfig.tiles.map((t: any, i: number) => i === idx ? { ...t, variant: e.target.value } : t) })} />
              </Field>
              <div className="flex justify-end">
                <button className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1" onClick={() => setHomeConfig({ ...homeConfig, tiles: homeConfig.tiles.filter((_: any, i: number) => i !== idx) })}>
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
            <button className="text-xs text-dorren-dark flex items-center gap-1" onClick={() => setHomeConfig({ ...homeConfig, notifications: [...homeConfig.notifications, 'Новое уведомление'] })}>
              <Plus size={14} /> Добавить
            </button>
          </div>
          {homeConfig.notifications.map((n: string, idx: number) => (
            <div key={idx} className="flex gap-2 items-center">
              <input className="flex-1 border border-gray-200 px-3 py-2 text-sm" value={n} onChange={(e) => setHomeConfig({ ...homeConfig, notifications: homeConfig.notifications.map((v: string, i: number) => i === idx ? e.target.value : v) })} />
              <button className="text-red-500 hover:text-red-700" onClick={() => setHomeConfig({ ...homeConfig, notifications: homeConfig.notifications.filter((_: string, i: number) => i !== idx) })}>
                <Trash size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-100 p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-dorren-black uppercase tracking-brand">Задачи</h4>
            <button className="text-xs text-dorren-dark flex items-center gap-1" onClick={() => setHomeConfig({ ...homeConfig, tasks: [...homeConfig.tasks, { id: Date.now(), title: 'Новая задача', time: '', status: 'pending' }] })}>
              <Plus size={14} /> Добавить
            </button>
          </div>
          {homeConfig.tasks.map((t: any, idx: number) => (
            <div key={t.id} className="grid grid-cols-3 gap-2 items-center">
              <input className="col-span-2 border border-gray-200 px-3 py-2 text-sm" value={t.title} onChange={(e) => setHomeConfig({ ...homeConfig, tasks: homeConfig.tasks.map((task: any, i: number) => i === idx ? { ...task, title: e.target.value } : task) })} />
              <input className="border border-gray-200 px-3 py-2 text-sm" value={t.time} onChange={(e) => setHomeConfig({ ...homeConfig, tasks: homeConfig.tasks.map((task: any, i: number) => i === idx ? { ...task, time: e.target.value } : task) })} />
              <select className="border border-gray-200 px-3 py-2 text-sm col-span-2" value={t.status} onChange={(e) => setHomeConfig({ ...homeConfig, tasks: homeConfig.tasks.map((task: any, i: number) => i === idx ? { ...task, status: e.target.value } : task) })}>
                <option value="pending">pending</option>
                <option value="done">done</option>
              </select>
              <button className="text-red-500 hover:text-red-700 text-xs" onClick={() => setHomeConfig({ ...homeConfig, tasks: homeConfig.tasks.filter((_: any, i: number) => i !== idx) })}>
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
            <button className="text-xs text-dorren-dark flex items-center gap-1" onClick={() => setHomeConfig({ ...homeConfig, events: [...homeConfig.events, { title: 'Новое событие', date: '', place: '', cta: '' }] })}>
              <Plus size={14} /> Добавить
            </button>
          </div>
          {homeConfig.events.map((ev: any, idx: number) => (
            <div key={idx} className="grid grid-cols-3 gap-2 items-center">
              <input className="col-span-2 border border-gray-200 px-3 py-2 text-sm" value={ev.title} onChange={(e) => setHomeConfig({ ...homeConfig, events: homeConfig.events.map((v: any, i: number) => i === idx ? { ...v, title: e.target.value } : v) })} />
              <input className="border border-gray-200 px-3 py-2 text-sm" value={ev.date} onChange={(e) => setHomeConfig({ ...homeConfig, events: homeConfig.events.map((v: any, i: number) => i === idx ? { ...v, date: e.target.value } : v) })} />
              <input className="border border-gray-200 px-3 py-2 text-sm" value={ev.place} onChange={(e) => setHomeConfig({ ...homeConfig, events: homeConfig.events.map((v: any, i: number) => i === idx ? { ...v, place: e.target.value } : v) })} />
              <input className="col-span-2 border border-gray-200 px-3 py-2 text-sm" value={ev.cta ?? ''} onChange={(e) => setHomeConfig({ ...homeConfig, events: homeConfig.events.map((v: any, i: number) => i === idx ? { ...v, cta: e.target.value } : v) })} />
              <button className="text-red-500 hover:text-red-700 text-xs" onClick={() => setHomeConfig({ ...homeConfig, events: homeConfig.events.filter((_: any, i: number) => i !== idx) })}>
                Удалить
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-100 p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-dorren-black uppercase tracking-brand">Приказы</h4>
            <button className="text-xs text-dorрен-dark flex items-center gap-1" onClick={() => setHomeConfig({ ...homeConfig, orders: [...homeConfig.orders, { title: 'Новый приказ', type: 'DOC', size: '' }] })}>
              <Plus size={14} /> Добавить
            </button>
          </div>
          {homeConfig.orders.map((o: any, idx: number) => (
            <div key={idx} className="grid grid-cols-3 gap-2 items-center">
              <input className="col-span-2 border border-gray-200 px-3 py-2 text-sm" value={o.title} onChange={(e) => setHomeConfig({ ...homeConfig, orders: homeConfig.orders.map((v: any, i: number) => i === idx ? { ...v, title: e.target.value } : v) })} />
              <input className="border border-gray-200 px-3 py-2 text-sm" value={o.type} onChange={(e) => setHomeConfig({ ...homeConfig, orders: homeConfig.orders.map((v: any, i: number) => i === idx ? { ...v, type: e.target.value } : v) })} />
              <input className="border border-gray-200 px-3 py-2 text-sm" value={o.size} onChange={(e) => setHomeConfig({ ...homeConfig, orders: homeConfig.orders.map((v: any, i: number) => i === idx ? { ...v, size: e.target.value } : v) })} />
              <button className="text-red-500 hover:text-red-700 text-xs" onClick={() => setHomeConfig({ ...homeConfig, orders: homeConfig.orders.filter((_: any, i: number) => i !== idx) })}>
                Удалить
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (!adminEnabled) return <div className="p-6 bg-white border border-gray-200 text-sm text-gray-500">Turn admin mode ON in header to edit content.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-light text-dorren-black uppercase tracking-widest mb-1">Admin panel</h2>
          <p className="text-sm text-gray-500">Edit news, documents, and courses. Drag & drop ordering, categories, quizzes.</p>
        </div>
        <button className="px-4 py-2 bg-dorren-dark text-white text-xs uppercase tracking-wider hover:bg-black transition-colors flex items-center gap-2" onClick={saveAll}>
          <Save size={16} /> Save all
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 p-3">
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      <div className="flex gap-2 text-sm">
        <button className={`px-3 py-2 border ${tab === 'news' ? 'border-dorren-dark bg-dorren-dark text-white' : 'border-gray-200 text-dorren-dark hover:border-dorren-dark'}`} onClick={() => setTab('news')}>News</button>
        <button className={`px-3 py-2 border ${tab === 'docs' ? 'border-dorren-dark bg-dorren-dark text-white' : 'border-gray-200 text-dorren-dark hover:border-dorren-dark'}`} onClick={() => setTab('docs')}>Docs</button>
        <button className={`px-3 py-2 border ${tab === 'courses' ? 'border-dorren-dark bg-dorren-dark text-white' : 'border-gray-200 text-dorren-dark hover:border-dorren-dark'}`} onClick={() => setTab('courses')}>Courses</button>
        <button className={`px-3 py-2 border ${tab === 'home' ? 'border-dorren-dark bg-dorren-dark text-white' : 'border-gray-200 text-dorren-dark hover:border-dorren-dark'}`} onClick={() => setTab('home')}>Home</button>
      </div>

      {tab === 'news' && newsEditor}
      {tab === 'docs' && docsEditor}
      {tab === 'courses' && coursesEditor}
      {tab === 'home' && homeEditor}
    </div>
  );
};

export default AdminPanel;
