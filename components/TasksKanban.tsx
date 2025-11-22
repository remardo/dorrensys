import React, { useEffect, useMemo, useState } from 'react';
import { Task, User } from '../types';
import { fetchTasksFromConvex, fetchUsersFromConvex, pushTasksToConvex } from '../convexClient';
import { Plus, X, LayoutPanelLeft, Rows, Filter, ChevronDown, Flag, MoreHorizontal, UserPlus, Trash } from 'lucide-react';

type ViewMode = 'kanban' | 'table';

const statusLabels: Record<Task['status'], string> = {
  todo: 'К исполнению',
  'in-progress': 'В работе',
  done: 'Готово',
};

const priorityLabels: Record<Task['priority'], string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const resolveAssignee = (task: Task, users: User[]) => {
  const byEmail = users.find((u) => u.email && u.email === task.assigneeEmail);
  if (byEmail) return byEmail;
  const byName = users.find((u) => u.name === task.assigneeName);
  if (byName) return byName;
  return task.assignee;
};

const TaskCard: React.FC<{
  task: Task;
  onClick: () => void;
  onAssign: (user?: User) => void;
}> = ({ task, onClick, onAssign }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-gray-200 shadow-sm p-4 hover:shadow-md transition cursor-pointer relative" onClick={onClick}>
      <div className="flex justify-between items-start mb-2">
        <span
          className={`text-[10px] font-bold uppercase px-2 py-0.5 border ${
            task.priority === 'high'
              ? 'text-red-600 border-red-200 bg-red-50'
              : task.priority === 'medium'
                ? 'text-yellow-600 border-yellow-200 bg-yellow-50'
                : 'text-green-600 border-green-200 bg-green-50'
          }`}
        >
          {priorityLabels[task.priority]}
        </span>
        <button
          className="text-gray-400 hover:text-dorren-dark"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((p) => !p);
          }}
        >
          <MoreHorizontal size={16} />
        </button>
        {open && (
          <div className="absolute right-3 top-8 bg-white border border-gray-100 shadow-lg z-10 text-sm">
            <button
              className="block px-3 py-2 hover:bg-gray-50 w-full text-left"
              onClick={(e) => {
                e.stopPropagation();
                onAssign(undefined);
                setOpen(false);
              }}
            >
              Снять назначение
            </button>
          </div>
        )}
      </div>
      <p className="text-sm font-medium text-dorren-black leading-snug mb-3">{task.title}</p>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        {task.assigneeAvatar ? (
          <img src={task.assigneeAvatar} alt={task.assigneeName ?? ''} className="w-6 h-6 rounded-full object-cover" />
        ) : (
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
            <UserPlus size={14} />
          </div>
        )}
        <span className="truncate">{task.assigneeName || 'Не назначен'}</span>
      </div>
    </div>
  );
};

const NewTaskModal: React.FC<{
  users: User[];
  onClose: () => void;
  onSave: (task: Task) => void;
}> = ({ users, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [status, setStatus] = useState<Task['status']>('todo');
  const [assigneeEmail, setAssigneeEmail] = useState<string>('unassigned');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const submit = () => {
    if (!title.trim()) return;
    const assignee = assigneeEmail === 'unassigned' ? undefined : users.find((u) => u.email === assigneeEmail);
    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      description,
      status,
      priority,
      assigneeEmail: assignee?.email,
      assigneeName: assignee?.name,
      assigneeAvatar: assignee?.avatar,
      assignee,
      createdAt: new Date().toISOString(),
    };
    onSave(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl shadow-xl border border-gray-100">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-dorren-black">Новая задача</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-dorren-black">
            <X size={18} />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="block text-xs uppercase text-gray-500 mb-1">Название</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-gray-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs uppercase text-gray-500 mb-1">Описание</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-gray-200 px-3 py-2 text-sm h-20" />
          </div>
          <div className="grid grid-cols-2 gap-3">
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
            <select value={assigneeEmail} onChange={(e) => setAssigneeEmail(e.target.value)} className="w-full border border-gray-200 px-3 py-2 text-sm">
              <option value="unassigned">Не назначен</option>
              {users.map((u) => (
                <option key={u.email ?? u.id} value={u.email ?? u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-xs uppercase tracking-wider text-gray-500 hover:text-dorren-black">
            Отмена
          </button>
          <button onClick={submit} className="px-5 py-2 bg-dorren-dark text-white text-xs uppercase tracking-wider hover:bg-black flex items-center gap-1">
            <Flag size={14} /> Создать
          </button>
        </div>
      </div>
    </div>
  );
};

const TasksKanban: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [filters, setFilters] = useState({ assignee: 'all', priority: 'all', status: 'all' });
  const [dragging, setDragging] = useState<string | null>(null);
  const [newModal, setNewModal] = useState(false);
  const [selected, setSelected] = useState<Task | null>(null);

  useEffect(() => {
    fetchUsersFromConvex().then((list) => setUsers(list ?? []));
    fetchTasksFromConvex().then((list) => setTasks(list ?? []));
  }, []);

  useEffect(() => {
    if (newModal) {
      fetchUsersFromConvex().then((list) => setUsers(list ?? []));
    }
  }, [newModal]);

  const tasksWithAssignee = useMemo(
    () => tasks.map((t) => ({ ...t, assignee: resolveAssignee(t, users) })),
    [tasks, users],
  );

  const filtered = useMemo(() => {
    return tasksWithAssignee.filter((t) => {
      const a = filters.assignee === 'all' || (!t.assignee && filters.assignee === 'unassigned') || t.assigneeEmail === filters.assignee || t.assignee?.email === filters.assignee;
      const p = filters.priority === 'all' || t.priority === filters.priority;
      const s = filters.status === 'all' || t.status === filters.status;
      return a && p && s;
    });
  }, [tasksWithAssignee, filters]);

  const saveTasks = async (updated: Task[]) => {
    setTasks(updated);
    await pushTasksToConvex(updated, localStorage.getItem('convex_token'));
  };

  const handleAssign = async (taskId: string, user?: User) => {
    const updated = tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            assigneeEmail: user?.email,
            assigneeName: user?.name,
            assigneeAvatar: user?.avatar,
            assignee: user,
          }
        : t,
    );
    await saveTasks(updated);
  };

  const moveTask = async (taskId: string, status: Task['status']) => {
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, status } : t));
    await saveTasks(updated);
  };

const addTask = async (task: Task) => {
    await saveTasks([task, ...tasks]);
    const freshUsers = await fetchUsersFromConvex();
    if (freshUsers) setUsers(freshUsers);
  };
  const deleteTask = async (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    await saveTasks(updated);
    setSelected(null);
  };

  const renderColumn = (status: Task['status']) => (
    <div className="flex-1 min-w-[320px]" onDragOver={(e) => e.preventDefault()} onDrop={() => dragging && moveTask(dragging, status)}>
      <div className="flex items-center mb-3 pb-2 border-b border-gray-200">
        <h3 className="text-sm font-bold uppercase tracking-brand text-dorren-black">
          {statusLabels[status]} <span className="text-gray-400 font-normal ml-1">({filtered.filter((t) => t.status === status).length})</span>
        </h3>
      </div>
      <div className="space-y-3">
        {filtered
          .filter((t) => t.status === status)
          .map((task) => (
            <div key={task.id} draggable onDragStart={() => setDragging(task.id)} onClick={() => setSelected(task)}>
              <TaskCard task={task} onClick={() => setSelected(task)} onAssign={(u) => handleAssign(task.id, u)} />
            </div>
          ))}
        <button className="w-full py-3 border border-dashed border-gray-300 text-gray-400 text-xs uppercase tracking-wider hover:border-dorren-blue hover:text-dorren-blue hover:bg-dorren-blue/5 transition-all flex items-center justify-center rounded-sm">
          <Plus size={14} className="mr-2" /> Добавить задачу
        </button>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-3xl font-light text-dorren-black uppercase tracking-widest mb-1">Задачи</h2>
          <p className="text-gray-500 text-sm">Все задачи загружаются из Convex. Назначайте ответственных из списка пользователей.</p>
        </div>
        <div className="flex gap-2 items-center">
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
          <button className="px-6 py-2 bg-dorren-blue text-white text-xs uppercase tracking-wider hover:bg-dorren-dark" onClick={() => setNewModal(true)}>
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
            value={filters.assignee}
            onChange={(e) => setFilters((f) => ({ ...f, assignee: e.target.value }))}
            className="appearance-none bg-gray-50 border border-gray-200 text-xs uppercase tracking-wider px-3 py-2 pr-8 rounded-sm focus:outline-none focus:border-dorren-blue text-dorren-black cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <option value="all">Все исполнители</option>
            <option value="unassigned">Не назначен</option>
            {users.map((u) => (
              <option key={u.email ?? u.id} value={u.email ?? u.id}>
                {u.name}
              </option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={filters.priority}
            onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}
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
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            className="appearance-none bg-gray-50 border border-gray-200 text-xs uppercase tracking-wider px-3 py-2 pr-8 rounded-sm focus:outline-none focus:border-dorren-blue text-dorren-black cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <option value="all">Все статусы</option>
            <option value="todo">К исполнению</option>
            <option value="in-progress">В работе</option>
            <option value="done">Готово</option>
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <div className="flex gap-6 overflow-x-auto pb-4 h-full items-stretch">
          {renderColumn('todo')}
          {renderColumn('in-progress')}
          {renderColumn('done')}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 shadow-sm overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-left text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-2">Название</th>
                <th className="px-4 py-2">Статус</th>
                <th className="px-4 py-2">Приоритет</th>
                <th className="px-4 py-2">Исполнитель</th>
                <th className="px-4 py-2">Создана</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((task) => (
                <tr key={task.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <button className="text-dorren-dark hover:text-dorren-blue font-medium" onClick={() => setSelected(task)}>
                      {task.title}
                    </button>
                    {task.description && <p className="text-xs text-gray-500 line-clamp-1">{task.description}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <select className="text-xs border border-gray-200 px-2 py-1" value={task.status} onChange={(e) => moveTask(task.id, e.target.value as Task['status'])}>
                      <option value="todo">К исполнению</option>
                      <option value="in-progress">В работе</option>
                      <option value="done">Готово</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs capitalize">{task.priority}</td>
                  <td className="px-4 py-3 text-xs">
                    <div className="flex items-center gap-2">
                      <img src={task.assigneeAvatar ?? 'https://placehold.co/40'} alt={task.assigneeName ?? ''} className="w-6 h-6 rounded-full object-cover" />
                      <select
                        className="border border-gray-200 text-xs px-2 py-1"
                        value={task.assigneeEmail ?? 'unassigned'}
                        onChange={(e) => {
                          const user = users.find((u) => u.email === e.target.value);
                          handleAssign(task.id, user);
                        }}
                      >
                        <option value="unassigned">Не назначен</option>
                        {users.map((u) => (
                          <option key={u.email ?? u.id} value={u.email ?? u.id}>
                            {u.name}
                          </option>
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
      )}

      {newModal && <NewTaskModal users={users} onClose={() => setNewModal(false)} onSave={addTask} />}

      {selected && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-3xl shadow-2xl border border-gray-100 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs text-gray-400 mb-1">#TASK-{selected.id}</div>
              <h3 className="text-2xl font-semibold text-dorren-black mb-2">{selected.title}</h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{selected.description}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-dorren-black">
                <X size={20} />
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs text-gray-500 uppercase mb-1">Приоритет</div>
                <div>{priorityLabels[selected.priority]}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase mb-1">Статус</div>
                <div>{statusLabels[selected.status]}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase mb-1">Исполнитель</div>
                <div className="flex items-center gap-2">
                  <img src={selected.assigneeAvatar ?? 'https://placehold.co/40'} className="w-7 h-7 rounded-full object-cover" />
                  <span>{selected.assigneeName ?? 'Не назначен'}</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase mb-1">Создана</div>
                <div>{selected.createdAt ? new Date(selected.createdAt).toLocaleString() : '-'}</div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => deleteTask(selected.id)}
                className="px-4 py-2 text-xs uppercase tracking-wider text-red-500 hover:text-red-700 flex items-center gap-1"
              >
                <Trash size={14} /> Удалить
              </button>
              <button onClick={() => setSelected(null)} className="px-5 py-2 bg-dorren-dark text-white text-xs uppercase tracking-wider hover:bg-black">
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksKanban;
