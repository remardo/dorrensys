import React, { useEffect, useState } from 'react';
import { X, Flag } from 'lucide-react';
import { Task, User } from '../../types';

interface Props {
  users: User[];
  onClose: () => void;
  onSave: (task: Task) => void;
}

const NewTaskModal: React.FC<Props> = ({ users, onClose, onSave }) => {
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
                <option value="todo">В очереди</option>
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
            <Flag size={14} /> Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewTaskModal;
