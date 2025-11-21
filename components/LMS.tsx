import React, { useEffect, useMemo, useState } from 'react';
import { Course, CourseModule, ModuleKind, QuizQuestion, User } from '../types';
import { Clock, Award, CheckCircle2, ChevronRight, Image as ImageIcon, FileText, Video, HelpCircle } from 'lucide-react';

type AnswerMap = Record<string, number>;
type CompletionMap = Record<string, string[]>;

interface LMSProps {
  courses: Course[];
}

const employees: User[] = [
  { id: 'u1', name: 'Смирнов Андрей', role: 'Руководитель направления', avatar: 'https://picsum.photos/100/100?random=51', coins: 0 },
  { id: 'u2', name: 'Егорова Елена', role: 'HR BP', avatar: 'https://picsum.photos/100/100?random=52', coins: 0 },
];

const ModuleIcon: React.FC<{ type: ModuleKind }> = ({ type }) => {
  switch (type) {
    case 'video': return <Video size={16} />;
    case 'image': return <ImageIcon size={16} />;
    case 'article': return <FileText size={16} />;
    case 'quiz': return <HelpCircle size={16} />;
    case 'assessment': return <Award size={16} />;
    default: return null;
  }
};

const QuizBlock: React.FC<{ questions: QuizQuestion[]; answers: AnswerMap; onAnswer: (id: string, idx: number) => void }> = ({ questions, answers, onAnswer }) => (
  <div className="space-y-4">
    {questions.map((q) => (
      <div key={q.id} className="border border-gray-200 p-3">
        <p className="text-sm font-medium text-dorren-black mb-2">{q.text}</p>
        <div className="space-y-2">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              className={`block w-full text-left px-3 py-2 text-sm border ${answers[q.id] === idx ? 'border-dorren-blue bg-dorren-blue/10' : 'border-gray-200 hover:border-dorren-blue'}`}
              onClick={() => onAnswer(q.id, idx)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const LMS: React.FC<LMSProps> = ({ courses }) => {
  const [localCourses, setLocalCourses] = useState<Course[]>(courses);
  useEffect(() => setLocalCourses(courses), [courses]);

  const [activeCourseId, setActiveCourseId] = useState(localCourses[0]?.id ?? 0);
  const activeCourse = useMemo(() => localCourses.find((c) => c.id === activeCourseId) ?? localCourses[0], [localCourses, activeCourseId]);
  const [activeModuleId, setActiveModuleId] = useState<string>(activeCourse?.modules?.[0]?.id ?? '');

  useEffect(() => {
    setActiveModuleId(activeCourse?.modules?.[0]?.id ?? '');
  }, [activeCourseId, activeCourse]);

  const [answers, setAnswers] = useState<Record<string, AnswerMap>>({});
  const [completed, setCompleted] = useState<CompletionMap>({});

  const activeModule = useMemo(
    () => activeCourse?.modules?.find((m) => m.id === activeModuleId) ?? activeCourse?.modules?.[0],
    [activeCourse, activeModuleId],
  );

  const markCompleted = (courseId: number, moduleId: string) => {
    setCompleted((prev) => {
      const list = prev[courseId] ?? [];
      if (list.includes(moduleId)) return prev;
      return { ...prev, [courseId]: [...list, moduleId] };
    });
  };

  const handleAnswer = (qid: string, idx: number) => {
    setAnswers((prev) => ({ ...prev, [activeCourseId]: { ...(prev[activeCourseId] ?? {}), [qid]: idx } }));
  };

  const courseCompletion = useMemo(() => {
    const total = activeCourse?.modules?.length ?? 0;
    const done = completed[activeCourseId]?.length ?? 0;
    return total > 0 ? Math.round((done / total) * 100) : 0;
  }, [activeCourse, activeCourseId, completed]);

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-light text-dorren-black uppercase tracking-widest mb-2">Обучение</h2>
          <p className="text-gray-500 font-light text-sm">Курсы, видео, подразделы и квизы.</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <div className="flex -space-x-2">
            {employees.map((u) => (
              <img
                key={u.id}
                src={u.avatar}
                alt={u.name}
                className="w-8 h-8 rounded-full border border-white object-cover"
              />
            ))}
          </div>
          <span>Кураторы обучения</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[320px_auto] gap-8">
        <div className="space-y-4">
          {localCourses.map((course) => {
            const done = completed[course.id]?.length ?? 0;
            const total = course.modules?.length ?? course.totalModules;
            const percent = total > 0 ? Math.round((done / total) * 100) : course.progress;
            return (
              <button
                key={course.id}
                onClick={() => {
                  setActiveCourseId(course.id);
                  setActiveModuleId(course.modules?.[0]?.id ?? '');
                }}
                className={`w-full text-left border ${course.id === activeCourseId ? 'border-dorren-blue bg-dorren-blue/5' : 'border-gray-200'} bg-white shadow-sm hover:shadow-md transition-all`}
              >
                <div className="relative h-32 overflow-hidden">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  {course.badge && (
                    <span className="absolute top-2 left-2 bg-dorren-dark text-white text-[10px] uppercase tracking-wider px-2 py-1">
                      {course.badge}
                    </span>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="text-md font-semibold text-dorren-black leading-snug">{course.title}</h4>
                  {course.description && <p className="text-xs text-gray-500 line-clamp-2">{course.description}</p>}
                  <div className="flex items-center text-xs text-gray-500 gap-3">
                    <span className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {course.duration}
                    </span>
                    <span>{total} модулей</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1">
                    <div className="bg-dorren-black h-1" style={{ width: `${percent}%` }}></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Прогресс: {percent}%</span>
                    <span className="text-dorren-dark font-semibold">{done}/{total}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-white border border-gray-100 shadow-sm p-6 space-y-6">
          <div className="flex flex-wrap justify-between gap-3 items-start">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Активный курс</p>
              <h3 className="text-2xl font-light text-dorren-black leading-snug">{activeCourse?.title}</h3>
              <p className="text-sm text-gray-500">Прогресс {courseCompletion}% • {activeCourse?.modules?.length ?? activeCourse?.totalModules} модулей</p>
              {activeCourse?.description && (
                <p className="text-sm text-gray-600 mt-1">{activeCourse.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Award className="text-dorren-blue" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Сертификат</p>
                <p className="text-sm text-dorren-black">Выдаётся после аттестации</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-[260px_auto] gap-6">
            <div className="border border-gray-200 p-3 space-y-2 max-h-[500px] overflow-y-auto">
              {activeCourse?.modules?.map((module) => {
                const isActive = module.id === activeModule?.id;
                const isDone = completed[activeCourseId]?.includes(module.id);
                return (
                  <button
                    key={module.id}
                    onClick={() => setActiveModuleId(module.id)}
                    className={`w-full text-left flex items-start gap-3 p-3 border ${isActive ? 'border-dorren-blue bg-dorren-blue/5' : 'border-gray-200 hover:border-dorren-blue'}`}
                  >
                    <div className="mt-0.5 text-gray-600">
                      <ModuleIcon type={module.type} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-dorren-black">{module.title}</p>
                      <p className="text-xs text-gray-500">{module.duration}</p>
                    </div>
                    {isDone && <CheckCircle2 size={16} className="text-green-500" />}
                  </button>
                );
              })}
            </div>

            <div className="space-y-4">
              {activeModule && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{activeModule.type}</p>
                      <h4 className="text-xl text-dorren-black font-semibold">{activeModule.title}</h4>
                    </div>
                    <button
                      onClick={() => markCompleted(activeCourseId, activeModule.id)}
                      className="px-4 py-2 text-xs uppercase tracking-wider bg-dorren-dark text-white hover:bg-black transition-colors flex items-center gap-2"
                    >
                      <CheckCircle2 size={16} /> Отметить выполненным
                    </button>
                  </div>

                  {activeModule.type === 'video' && (
                    <div className="space-y-2">
                      <video src={activeModule.videoUrl} controls className="w-full max-h-[320px] bg-black" />
                      <p className="text-sm text-gray-500">Совет: законспектируйте выводы.</p>
                    </div>
                  )}

                  {activeModule.type === 'image' && (
                    <div className="space-y-3">
                      <img src={activeModule.imageUrl} alt={activeModule.title} className="w-full rounded-sm border border-gray-200" />
                      {activeModule.description && <p className="text-sm text-gray-600">{activeModule.description}</p>}
                    </div>
                  )}

                  {activeModule.type === 'article' && (
                    <div className="space-y-2">
                      {activeModule.content && <p className="text-sm text-gray-700">{activeModule.content}</p>}
                      {(activeModule.sections ?? []).map((s, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 border border-gray-100 text-sm text-dorren-black">
                          {s}
                        </div>
                      ))}
                    </div>
                  )}

                  {(activeModule.type === 'quiz' || activeModule.type === 'assessment') && activeModule.quiz && (
                    <div className="space-y-3">
                      <QuizBlock
                        questions={activeModule.quiz.questions}
                        answers={answers[activeCourseId] ?? {}}
                        onAnswer={handleAnswer}
                      />
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {activeModule.duration}
                    </span>
                    <span className="flex items-center">
                      <ChevronRight size={14} className="mr-1" />
                      Отметьте завершение, чтобы обновить прогресс
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LMS;
