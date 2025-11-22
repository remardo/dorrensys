import React, { useEffect, useState } from 'react';
import { fetchUsersFromConvex, pushUsersToConvex, updateUserRole } from '../convexClient';
import { User } from '../types';

interface UsersAdminProps {
  token: string | null;
}

const mockUsers = (): User[] =>
  Array.from({ length: 10 }).map((_, idx) => ({
    id: `mock-${idx}`,
    name: `Сотрудник ${idx + 1}`,
    email: `user${idx + 1}@dorren.ru`,
    role: idx === 0 ? 'admin' : idx < 4 ? 'content' : 'employee',
    department: idx < 3 ? 'prod' : idx < 6 ? 'mgmt' : 'sales',
    avatar: `https://placehold.co/100/183141/FFFFFF?text=${idx + 1}`,
    coins: Math.floor(Math.random() * 200),
  }));

const UsersAdmin: React.FC<UsersAdminProps> = ({ token }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<Partial<User>>({ role: 'employee', department: 'mgmt', avatar: 'https://placehold.co/100' });

  useEffect(() => {
    if (!token) return;
    fetchUsersFromConvex()
      .then((list) => setUsers(list ?? []))
      .catch((e) => setMessage(e?.message ?? 'Ошибка загрузки пользователей'));
  }, [token]);

  const handleSaveAll = async () => {
    setLoading(true);
    try {
      await pushUsersToConvex(users, token);
      setMessage('Сохранено в БД');
    } catch (e: any) {
      setMessage(e?.message ?? 'Не удалось сохранить');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMock = () => {
    setUsers(mockUsers());
    setMessage('Сгенерированы 10 сотрудников, сохраните в БД');
  };

  const handleAddOne = () => {
    if (!draft.name || !draft.email) {
      setMessage('Укажите имя и email');
      return;
    }
    setUsers((prev) => [
      {
        id: draft.email!,
        name: draft.name!,
        email: draft.email!,
        role: draft.role ?? 'employee',
        department: draft.department ?? 'mgmt',
        avatar: draft.avatar ?? 'https://placehold.co/100',
        coins: draft.coins ?? 0,
      },
      ...prev,
    ]);
    setDraft({ role: 'employee', department: 'mgmt', avatar: 'https://placehold.co/100' });
    setMessage('');
  };

  const handleRoleChange = async (email: string, role: string) => {
    setUsers((prev) => prev.map((u) => (u.email === email ? { ...u, role } : u)));
    try {
      await updateUserRole(email, role, token);
    } catch (e: any) {
      setMessage(e?.message ?? 'Ошибка смены роли');
    }
  };

  if (!token) return <div className="text-sm text-gray-500">Нужен логин, чтобы управлять пользователями.</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-dorren-black uppercase tracking-brand">Пользователи</h3>
        {message && <span className="text-xs text-gray-500">{message}</span>}
      </div>

      <div className="bg-gray-50 border border-dashed border-gray-200 p-3 space-y-2 text-sm">
        <div className="grid md:grid-cols-6 gap-2 items-center">
          <input className="border border-gray-200 px-3 py-2 text-sm" placeholder="Имя" value={draft.name ?? ''} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          <input className="border border-gray-200 px-3 py-2 text-sm" placeholder="Email" value={draft.email ?? ''} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
          <select className="border border-gray-200 px-3 py-2 text-sm" value={draft.role ?? 'employee'} onChange={(e) => setDraft({ ...draft, role: e.target.value })}>
            <option value="admin">admin</option>
            <option value="content">content</option>
            <option value="employee">employee</option>
          </select>
          <select className="border border-gray-200 px-3 py-2 text-sm" value={draft.department ?? 'mgmt'} onChange={(e) => setDraft({ ...draft, department: e.target.value })}>
            <option value="prod">Продакшн</option>
            <option value="mgmt">УК</option>
            <option value="sales">Констракшн</option>
          </select>
          <input className="border border-gray-200 px-3 py-2 text-sm" placeholder="Avatar URL" value={draft.avatar ?? ''} onChange={(e) => setDraft({ ...draft, avatar: e.target.value })} />
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-dorren-dark text-white text-xs uppercase tracking-wider" onClick={handleAddOne}>
              Добавить
            </button>
            <button className="px-3 py-2 border text-xs uppercase tracking-wider" onClick={handleAddMock}>
              10 мок
            </button>
          </div>
        </div>
        <div className="text-xs text-gray-500">После добавления нажмите "Сохранить в БД".</div>
      </div>

      <div className="border border-gray-200 divide-y">
        <div className="grid grid-cols-5 text-xs uppercase tracking-wider text-gray-500 bg-gray-50 px-3 py-2">
          <span>Email</span>
          <span>Имя</span>
          <span>Роль</span>
          <span>Отдел</span>
          <span>Действия</span>
        </div>
        {users.map((u) => (
          <div key={u.email} className="grid grid-cols-5 items-center px-3 py-2 text-sm">
            <span className="truncate">{u.email}</span>
            <span className="text-gray-700">{u.name}</span>
            <select className="border border-gray-200 px-2 py-1 text-sm" value={u.role ?? 'employee'} onChange={(e) => handleRoleChange(u.email ?? '', e.target.value)}>
              <option value="admin">admin</option>
              <option value="content">content</option>
              <option value="employee">employee</option>
            </select>
            <select
              className="border border-gray-200 px-2 py-1 text-sm"
              value={(u as any).department ?? 'mgmt'}
              onChange={(e) => setUsers((prev) => prev.map((item) => (item.email === u.email ? { ...item, department: e.target.value } : item)))}
            >
              <option value="prod">Продакшн</option>
              <option value="mgmt">УК</option>
              <option value="sales">Констракшн</option>
            </select>
            <div className="space-x-2">
              <button className="text-xs px-2 py-1 border border-gray-300 hover:border-dorren-blue hover:text-dorren-blue" onClick={() => setUsers((prev) => prev.filter((item) => item.email !== u.email))}>
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button onClick={handleSaveAll} disabled={loading} className="px-5 py-2 bg-dorren-dark text-white text-xs uppercase tracking-wider hover:bg-black transition-colors">
          {loading ? 'Сохранение...' : 'Сохранить в БД'}
        </button>
      </div>
    </div>
  );
};

export default UsersAdmin;
