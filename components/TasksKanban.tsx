import React, { useEffect, useMemo, useState } from 'react';
import { Task, User } from '../types';
import { fetchTasksFromConvex, pushTasksToConvex } from '../convexClient';
import {
  Plus,
  MoreHorizontal,
  UserPlus,
  Check,
  Filter,
  X,
  ChevronDown,
  AlignLeft,
  Calendar,
  Clock,
  Paperclip,
  Rows,
  LayoutPanelLeft,
  Flag,
} from 'lucide-react';

const EMPLOYEES: User[] = [
  { id: 'u1', name: 'Смирнов А.', email: 'smirnov@company.com', role: 'Project Manager', avatar: 'https://placehold.co/100/100?random=101', coins: 0 },
  { id: 'u2', name: 'Егорова Е.', email: 'egorova@company.com', role: 'UX/UI Designer', avatar: 'https://placehold.co/100/100?random=102', coins: 0 },
  { id: 'u3', name: 'Котов И.', email: 'kotov@company.com', role: 'Frontend Dev', avatar: 'https://placehold.co/100/100?random=103', coins: 0 },
  { id: 'u4', name: 'Ли В.', email: 'li@company.com', role: 'QA Engineer', avatar: 'https://placehold.co/100/100?random=104', coins: 0 },
];

const LOCAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Запустить рассылку по новым OKR',
    description: 'Обновить шаблоны писем, добавить ссылки на Confluence, проверить сегменты.',
    status: 'todo',
    priority: 'high',
    assigneeEmail: 'smirnov@company.com',
    assigneeName: 'Смирнов А.',
    assigneeAvatar: EMPLOYEES[0].avatar,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Обновить документацию API',
    description: 'Подтащить новые эндпоинты, примеры запросов и схемы.',
    status: 'todo',
    priority: 'medium',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: '3',
    title: 'Подготовить описание вакансии Junior Designer',
    description: 'Согласовать требования, собрать материалы для страницы, настроить отклики.',
    status: 'in-progress',
    priority: 'high',
    assigneeEmail: 'egorova@company.com',
    assigneeName: 'Егорова Е.',
    assigneeAvatar: EMPLOYEES[1].avatar,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '4',
    title: 'Финализировать макеты лендинга',
    description: 'Учесть правки по иллюстрациям и цвету, проверить адаптив.',
    status: 'in-progress',
    priority: 'low',
    assigneeEmail: 'kotov@company.com',
    assigneeName: 'Котов И.',
    assigneeAvatar: EMPLOYEES[2].avatar,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: '5',
    title: 'Починить отчёт по marketing',
    description: 'Проверить выгрузки, фильтры и дубли.',
    status: 'done',
    priority: 'medium',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
];

const isNewTask = (dateString?: string) => {
  if (!dateString) return false;
  const diffHours = (Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60);
  return diffHours < 24;
};

interface TaskDetailsModalProps {
  task: Task;
  onClose: () => void;
  onAssign: (taskId: string, user: User) => void;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ task, onClose, onAssign }) => {
  const [isAssignDropdownOpen, setIsAssignDropdownOpen] = useState(false);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-3xl shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-start p-8 border-b border-gray-100">
          <div className="flex-1 mr-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[10px] font-mono text-gray-400">#TASK-{task.id}</span>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 border ${
                  task.priority === 'high'
                    ? 'text-red-600 border-red-200 bg-red-50'
                    : task.priority === 'medium'
                      ? 'text-yellow-600 border-yellow-200 bg-yellow-50'
                      : 'text-green-600 border-green-200 bg-green-50'
                }`}
              >
                {task.priority} Priority
              </span>
              {isNewTask(task.createdAt) && (
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-dorren-blue/10 text-dorren-blue border border-dorren-blue/20">
                  Новое
                </span>
              )}
            </div>
            <h2 className="text-2xl font-medium text-dorren-black leading-snug">{task.title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-dorren-black transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-8">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-brand text-dorren-black mb-4 flex items-center">
                <AlignLeft size={16} className="mr-2 text-dorren-blue" /> Описание
              </h3>
              <div className="text-sm text-gray-600 leading-relaxed font-light whitespace-pre-wrap">
                {task.description ? <p>{task.description}</p> : <p className="text-gray-400 italic">Нет описания…</p>}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-brand text-dorren-black mb-4 flex items-center">
                <Paperclip size={16} className="mr-2 text-dorren-blue" /> Вложения
              </h3>
              <div className="bg-gray-50 border border-dashed border-gray-300 p-8 text-center text-gray-400 text-xs uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors">
                Перетащите файлы сюда
              </div>
            </div>
          </div>

          <div className="w-full md:w-64 space-y-6 border-l border-gray-100 pl-0 md:pl-8">
            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-2">Статус</span>
              <select value={task.status} disabled className="w-full bg-gray-50 border border-gray-200 text-xs uppercase tracking-wider px-3 py-2 rounded-sm text-dorren-black cursor-not-allowed opacity-70">
                <option value="todo">К исполнению</option>
                <option value="in-progress">В работе</option>
                <option value="done">Готово</option>
              </select>
            </div>

            <div className="relative">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-2">Исполнитель</span>
              <div
                onClick={() => setIsAssignDropdownOpen(!isAssignDropdownOpen)}
                className="flex items-center gap-3 p-2 border border-gray-200 hover:border-dorren-blue cursor-pointer bg-white transition-colors"
              >
                {task.assignee ? (
                  <>
                    <img src={task.assignee.avatar} alt={task.assignee.name} className="w-8 h-8 rounded-full object-cover" />
                    <span className="text-xs font-medium text-dorren-black truncate">{task.assignee.name}</span>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <UserPlus size={16} />
                    </div>
                    <span className="text-xs text-gray-400">Назначить</span>
                  </>
                )}
                <ChevronDown size={14} className="ml-auto text-gray-400" />
              </div>
              {isAssignDropdownOpen && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white shadow-xl border border-gray-100 z-10 max-h-48 overflow-y-auto custom-scrollbar">
                  {EMPLOYEES.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        onAssign(task.id, user);
                        setIsAssignDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                      <span className="text-xs text-dorren-black truncate">{user.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-2">Сроки</span>
              <div className="flex items-center text-xs text-dorren-black mb-2">
                <Calendar size={14} className="mr-2 text-gray-400" /> 12 янв - 15 янв
              </div>
              <div className="flex items-center text-xs text-dorren-black">
                <Clock size={14} className="mr-2 text-gray-400" /> 3 часа оценки
              </div>
            </div>

            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-2">Создано</span>
              <div className="text-xs text-dorren-black">{task.createdAt ? new Date(task.createdAt).toLocaleDateString() : '-'}</div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button className="px-4 py-2 text-red-500 hover:bg-red-50 text-xs uppercase tracking-wider transition-colors">Удалить</button>
          <button onClick={onClose} className="px-6 py-2 bg-dorren-dark text-white hover:bg-dorren-black transition-colors text-xs uppercase tracking-wider font-bold">
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

interface NewTaskModalProps {
  onClose: () => void;
  onSave: (task: Partial<Task> & { title: string }) => void;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [status, setStatus] = useState<Task['status']>('todo');
  const [assigneeId, setAssigneeId] = useState<string>('unassigned');

  const handleSubmit = () => {
    if (!title.trim()) return;
    const assignee = assigneeId === 'unassigned' ? undefined : EMPLOYEES.find((u) => u.id === assigneeId);
    onSave({ title: title.trim(), description, priority, status, assignee });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-xl shadow-2xl border border-gray-100 flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-dorren-black">Новая задача</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-dorren-black transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs uppercase text-gray-500 mb-1">Заголовок</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-gray-200 px-3 py-2 text-sm" placeholder="Например: Подготовить спринт" />
          </div>
          <div>
            <label className="block text-xs uppercase text-gray-500 mb-1">Описание</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-gray-200 px-3 py-2 text-sm h-20" placeholder="Краткие шаги или контекст" />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase text-gray-500 mb-1">Приоритет</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as Task['priority'])} className="w-full border border-gray-200 px-3 py-2 text-sm">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase text-gray-500 mb-1">Статус</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as Task['status'])} className="w-full border border-gray-200 px-3 py-2 text-sm">
                <option value="todo">К исполнению</option>
                <option value="in-progress">В работе</option>
                <option value="done">Готово</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase text-gray-500 mb-1">Исполнитель</label>
            <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} className="w-full border border-gray-200 px-3 py-2 text-sm">
              <option value="unassigned">Не назначено</option>
              {EMPLOYEES.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-xs uppercase tracking-wider text-gray-500 hover:text-dorren-black transition-colors">Отмена</button>
          <button onClick={handleSubmit} className="px-5 py-2 bg-dorren-dark text-white text-xs uppercase tracking-wider hover:bg-black transition-colors flex items-center gap-1">
            <Flag size={14} /> Добавить
          </button>
        </div>
      </div>
    </div>
  );
};

interface TaskCardProps {
  task: Task;
  onAssign: (taskId: string, user: User) => void;
  onClick: (task: Task) => void;
  onDragStart: (task: Task) => void;
  onDragOverCard: (task: Task, e: React.DragEvent) => void;
  onDropCard: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onAssign, onClick, onDragStart, onDragOverCard, onDropCard }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isNew = isNewTask(task.createdAt);

  return (
    <div
      draggable
      onDragStart={() => onDragStart(task)}
      onDragOver={(e) => onDragOverCard(task, e)}
      onDrop={() => onDropCard(task)}
      onClick={() => onClick(task)}
      className="bg-white p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group border-l-4 border-l-transparent hover:border-l-dorren-blue relative overflow-hidden"
    >
      {isNew && (
        <div className="absolute top-0 right-0 mt-2 mr-2 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-dorren-blue opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-dorren-blue"></span>
        </div>
      )}

      <div className="flex justify-between items-start mb-2 pr-4">
        <span
          className={`text-[10px] font-bold uppercase px-2 py-0.5 border ${
            task.priority === 'high'
              ? 'text-red-600 border-red-200 bg-red-50'
              : task.priority === 'medium'
                ? 'text-yellow-600 border-yellow-200 bg-yellow-50'
                : 'text-green-600 border-green-200 bg-green-50'
          }`}
        >
          {task.priority}
        </span>
        <button
          className="text-gray-300 hover:text-dorren-black absolute top-3 right-3"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <MoreHorizontal size={16} />
        </button>
      </div>

      <p className="text-sm font-medium text-gray-800 leading-snug mb-4 mt-1">{task.title}</p>

      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
            className="flex items-center focus:outline-none group/avatar"
            title={task.assignee ? task.assignee.name : 'Назначить исполнителя'}
          >
            {task.assignee ? (
              <div className="relative">
                <img
                  className="w-6 h-6 rounded-full border-2 border-white group-hover/avatar:border-dorren-blue transition-colors object-cover shadow-sm"
                  src={task.assignee.avatar}
                  alt={task.assignee.name}
                />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-dorren-blue hover:text-dorren-blue hover:bg-dorren-blue/5 transition-all bg-gray-50">
                <UserPlus size={12} />
              </div>
            )}
          </button>

          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10 cursor-default"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownOpen(false);
                }}
              />
              <div className="absolute left-0 bottom-8 w-56 bg-white shadow-xl border border-gray-100 rounded-lg z-20 py-2 animate-fade-in">
                <div className="px-4 py-2 border-b border-gray-50 mb-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Назначить сотрудника</p>
                </div>
                <div className="max-h-48 overflow-y-auto custom-scrollbar">
                  {EMPLOYEES.map((user) => (
                    <button
                      key={user.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAssign(task.id, user);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 transition-colors group/item"
                    >
                      <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-dorren-black group-hover/item:text-dorren-blue transition-colors">{user.name}</p>
                        <p className="text-[10px] text-gray-400">{user.role}</p>
                      </div>
                      {task.assignee?.id === user.id && <Check size={12} className="text-dorren-blue" />}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {task.description && <AlignLeft size={12} className="text-gray-300" title="Есть описание" />}
          <span className="text-[10px] text-gray-400 font-mono">#TASK-{task.id}</span>
        </div>
      </div>
    </div>
  );
};

interface ColumnProps {
  title: string;
  tasks: Task[];
  status: Task['status'];
  onAssign: (taskId: string, user: User) => void;
  onTaskClick: (task: Task) => void;
  onDragStart: (task: Task) => void;
  onDropToColumn: (status: Task['status']) => void;
  onDragOverCard: (task: Task, e: React.DragEvent) => void;
  onDropCard: (task: Task) => void;
}

const Column: React.FC<ColumnProps> = ({
  title,
  tasks,
  status,
  onAssign,
  onTaskClick,
  onDragStart,
  onDropToColumn,
  onDragOverCard,
  onDropCard,
}) => (
  <div
    className="flex-1 min-w-[300px] flex flex-col h-full"
    onDragOver={(e) => e.preventDefault()}
    onDrop={() => onDropToColumn(status)}
  >
    <div className="flex items-center mb-4 pb-2 border-b-2 border-dorren-black/10">
      <h3 className="text-sm font-bold uppercase tracking-brand text-dorren-black">
        {title} <span className="text-gray-400 font-normal ml-1">({tasks.length})</span>
      </h3>
    </div>
    <div className="space-y-3 overflow-y-auto pr-2 flex-1 custom-scrollbar">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onAssign={onAssign}
          onClick={onTaskClick}
          onDragStart={onDragStart}
          onDragOverCard={onDragOverCard}
          onDropCard={onDropCard}
        />
      ))}
      <button className="w-full py-3 border border-dashed border-gray-300 text-gray-400 text-xs uppercase tracking-wider hover:border-dorren-blue hover:text-dorren-blue hover:bg-dorren-blue/5 transition-all flex items-center justify-center rounded-sm">
        <Plus size={14} className="mr-2" /> Добавить задачу
      </button>
    </div>
  </div>
);

const TableView: React.FC<{
  tasks: Task[];
  onAssign: (taskId: string, user: User) => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
  onOpen: (task: Task) => void;
}> = ({ tasks, onAssign, onStatusChange, onOpen }) => (
  <div className="bg-white border border-gray-100 shadow-sm overflow-x-auto">
    <table className="min-w-full text-sm">
      <thead className="bg-gray-50 border-b border-gray-100 text-left text-xs uppercase tracking-wider text-gray-500">
        <tr>
          <th className="px-4 py-2">Задача</th>
          <th className="px-4 py-2">Статус</th>
          <th className="px-4 py-2">Приоритет</th>
          <th className="px-4 py-2">Исполнитель</th>
          <th className="px-4 py-2">Создано</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id} className="border-b border-gray-50 hover:bg-gray-50">
            <td className="px-4 py-3">
              <button className="text-dorren-dark hover:text-dorren-blue font-medium" onClick={() => onOpen(task)}>
                {task.title}
              </button>
              {task.description && <p className="text-xs text-gray-500 line-clamp-1">{task.description}</p>}
            </td>
            <td className="px-4 py-3">
              <select
                className="text-xs border border-gray-200 px-2 py-1"
                value={task.status}
                onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
              >
                <option value="todo">К исполнению</option>
                <option value="in-progress">В работе</option>
                <option value="done">Готово</option>
              </select>
            </td>
            <td className="px-4 py-3 text-xs capitalize">{task.priority}</td>
            <td className="px-4 py-3 text-xs">
              <div className="flex items-center gap-2">
                <img src={task.assignee?.avatar ?? 'https://placehold.co/40'} alt={task.assignee?.name ?? 'NA'} className="w-6 h-6 rounded-full object-cover" />
                <select
                  className="border border-gray-200 text-xs px-2 py-1"
                  value={task.assignee?.id ?? 'unassigned'}
                  onChange={(e) => {
                    const user = EMPLOYEES.find((u) => u.id === e.target.value);
                    onAssign(task.id, user as User);
                  }}
                >
                  <option value="unassigned">Не назначено</option>
                  {EMPLOYEES.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
            </td>
            <td className="px-4 py-3 text-xs text-gray-500">{task.createdAt ? new Date(task.createdAt).toLocaleDateString() : '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const TasksKanban: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Загрузка данных из Convex при инициализации
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const convexTasks = await fetchTasksFromConvex();
        if (convexTasks && convexTasks.length > 0) {
          setTasks(convexTasks);
        } else {
          // Если БД пустая, инициализируем тестовыми данными
          setTasks(LOCAL_TASKS);
          await pushTasksToConvex(LOCAL_TASKS, localStorage.getItem('convex_token'));
        }
      } catch (error) {
        console.error('Ошибка загрузки задач:', error);
        // При ошибке используем локальные данные
        setTasks(LOCAL_TASKS);
      }
    };
    loadTasks();
  }, []);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  const handleAssignTask = async (taskId: string, user?: User) => {
    const updatedTasks = tasks.map((t) => 
      t.id === taskId 
        ? { 
            ...t, 
            assigneeEmail: user?.email,
            assigneeName: user?.name,
            assigneeAvatar: user?.avatar,
            assignee: user 
          } 
        : t
    );
    setTasks(updatedTasks);
    
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(user 
        ? { 
            ...selectedTask, 
            assigneeEmail: user?.email,
            assigneeName: user?.name,
            assigneeAvatar: user?.avatar,
            assignee: user 
          } 
        : { 
            ...selectedTask, 
            assigneeEmail: undefined,
            assigneeName: undefined,
            assigneeAvatar: undefined,
            assignee: undefined 
          }
      );
    }
    
    // Синхронизируем с Convex
    try {
      await pushTasksToConvex(updatedTasks, localStorage.getItem('convex_token'));
    } catch (error) {
      console.error('Ошибка синхронизации назначения задачи:', error);
    }
  };

  const clearFilters = () => {
    setFilterAssignee('all');
    setFilterPriority('all');
    setFilterStatus('all');
  };

  const filteredTasks = tasks.filter((task) => {
    if (filterAssignee !== 'all') {
      if (filterAssignee === 'unassigned') {
        if (task.assignee) return false;
      } else if (task.assignee?.id !== filterAssignee) {
        return false;
      }
    }
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    return true;
  });

  const moveTask = async (taskId: string, toStatus: Task['status'], beforeId?: string) => {
    const updatedTasks = tasks.map((t) => 
      t.id === taskId ? { ...t, status: toStatus } : t
    );
    setTasks(updatedTasks);
    
    // Синхронизируем с Convex
    try {
      await pushTasksToConvex(updatedTasks, localStorage.getItem('convex_token'));
    } catch (error) {
      console.error('Ошибка синхронизации перемещения задачи:', error);
    }
  };

  const handleDragStart = (task: Task) => setDraggingId(task.id);
  const handleDropToColumn = (status: Task['status']) => {
    if (!draggingId) return;
    moveTask(draggingId, status);
    setDraggingId(null);
  };
  const handleDropOnCard = (targetTask: Task) => {
    if (!draggingId || draggingId === targetTask.id) return;
    moveTask(draggingId, targetTask.status, targetTask.id);
    setDraggingId(null);
  };

  return (
    <div className="animate-fade-in h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-3xl font-light text-dorren-black uppercase tracking-widest mb-2">Задачи</h2>
          <p className="text-gray-500 font-light text-sm">Перетаскивайте карточки или переключайтесь в табличный вид.</p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="flex -space-x-2 mr-4 items-center">
            {EMPLOYEES.map((emp) => (
              <img
                key={emp.id}
                src={emp.avatar}
                title={emp.name}
                className="w-8 h-8 rounded-full border-2 border-[#F9FAFB]"
                alt={emp.name}
              />
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-[#F9FAFB] bg-gray-200 flex items-center justify-center text-[10px] text-gray-500 font-bold">
              +4
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider">
            <button
              className={`px-3 py-2 border ${viewMode === 'kanban' ? 'bg-dorren-dark text-white border-dorren-dark' : 'border-gray-200 text-dorren-dark'}`}
              onClick={() => setViewMode('kanban')}
            >
              <LayoutPanelLeft size={14} className="inline mr-1" /> Канбан
            </button>
            <button
              className={`px-3 py-2 border ${viewMode === 'table' ? 'bg-dorren-dark text-white border-dorren-dark' : 'border-gray-200 text-dorren-dark'}`}
              onClick={() => setViewMode('table')}
            >
              <Rows size={14} className="inline mr-1" /> Таблица
            </button>
          </div>
          <button
            className="px-6 py-2 bg-dorren-blue text-white hover:bg-dorren-dark transition-colors text-xs uppercase tracking-wider font-bold shadow-sm"
            onClick={() => setIsNewTaskOpen(true)}
          >
            Новая задача
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6 bg-white p-3 border border-gray-100 shadow-sm">
        <div className="flex items-center text-xs text-gray-400 mr-2 font-medium uppercase tracking-wider">
          <Filter size={14} className="mr-2" />
          Фильтры:
        </div>

        <div className="relative">
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="appearance-none bg-gray-50 border border-gray-200 text-xs uppercase tracking-wider px-3 py-2 pr-8 rounded-sm focus:outline-none focus:border-dorren-blue text-dorren-black cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <option value="all">Все исполнители</option>
            <option value="unassigned">Не назначено</option>
            {EMPLOYEES.map((emp) => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="appearance-none bg-gray-50 border border-gray-200 text-xs uppercase tracking-wider px-3 py-2 pr-8 rounded-sm focus:outline-none focus:border-dorren-blue text-dorren-black cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <option value="all">Все приоритеты</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none bg-gray-50 border border-gray-200 text-xs uppercase tracking-wider px-3 py-2 pr-8 rounded-sm focus:outline-none focus:border-dorren-blue text-dorren-black cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <option value="all">Все статусы</option>
            <option value="todo">К исполнению</option>
            <option value="in-progress">В работе</option>
            <option value="done">Готово</option>
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {(filterAssignee !== 'all' || filterPriority !== 'all' || filterStatus !== 'all') && (
          <button
            onClick={clearFilters}
            className="ml-auto text-xs text-dorren-blue hover:text-dorren-dark uppercase tracking-wider flex items-center font-bold transition-colors"
          >
            <X size={14} className="mr-1" />
            Сбросить
          </button>
        )}
      </div>

      {viewMode === 'kanban' ? (
        <div className="flex gap-6 overflow-x-auto pb-4 h-full items-stretch">
          <Column
            title="К исполнению"
            tasks={filteredTasks.filter((t) => t.status === 'todo')}
            status="todo"
            onAssign={handleAssignTask}
            onTaskClick={setSelectedTask}
            onDragStart={handleDragStart}
            onDropToColumn={handleDropToColumn}
            onDragOverCard={(task, e) => e.preventDefault()}
            onDropCard={handleDropOnCard}
          />
          <Column
            title="В работе"
            tasks={filteredTasks.filter((t) => t.status === 'in-progress')}
            status="in-progress"
            onAssign={handleAssignTask}
            onTaskClick={setSelectedTask}
            onDragStart={handleDragStart}
            onDropToColumn={handleDropToColumn}
            onDragOverCard={(task, e) => e.preventDefault()}
            onDropCard={handleDropOnCard}
          />
          <Column
            title="Готово"
            tasks={filteredTasks.filter((t) => t.status === 'done')}
            status="done"
            onAssign={handleAssignTask}
            onTaskClick={setSelectedTask}
            onDragStart={handleDragStart}
            onDropToColumn={handleDropToColumn}
            onDragOverCard={(task, e) => e.preventDefault()}
            onDropCard={handleDropOnCard}
          />
        </div>
      ) : (
        <TableView
          tasks={filteredTasks}
          onAssign={handleAssignTask}
          onStatusChange={(id, status) => moveTask(id, status)}
          onOpen={setSelectedTask}
        />
      )}

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onAssign={handleAssignTask}
        />
      )}
      {isNewTaskOpen && (
        <NewTaskModal
          onClose={() => setIsNewTaskOpen(false)}
          onSave={async (payload) => {
            const assignee = payload.assignee;
            const newTask: Task = {
              id: Date.now().toString(),
              title: payload.title,
              description: payload.description ?? '',
              priority: payload.priority ?? 'medium',
              status: payload.status ?? 'todo',
              assigneeEmail: assignee?.email,
              assigneeName: assignee?.name,
              assigneeAvatar: assignee?.avatar,
              assignee: assignee,
              createdAt: new Date().toISOString(),
            };
            
            // Сохраняем локально
            const updatedTasks = [newTask, ...tasks];
            setTasks(updatedTasks);
            
            // Сохраняем в Convex
            try {
              await pushTasksToConvex(updatedTasks, localStorage.getItem('convex_token'));
            } catch (error) {
              console.error('Ошибка сохранения задачи в Convex:', error);
            }
          }}
        />
      )}
    </div>
  );
};

export default TasksKanban;
