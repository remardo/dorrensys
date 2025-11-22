import React, { useEffect, useMemo, useState } from 'react';
import { fetchUsersFromConvex, updateUserRole } from '../convexClient';
import { User } from '../types';

interface UsersAdminProps {
  token: string | null;
}

const UsersAdmin: React.FC<UsersAdminProps> = ({ token }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);

  const roles = useMemo(() => ['admin', 'content', 'employee'], []);

  useEffect(() => {
    if (!token) return;
    fetchUsersFromConvex()
      .then((list) => setUsers(list?.map((u: any) => ({ ...u, id: u._id ?? u.id ?? u.email })) ?? []))
      .catch((e) => setMessage(e?.message ?? 'Ошибка загрузки пользователей'));
  }, [token]);

  const changeRole = async (email: string, role: string) => {
    if (!token) {
      setMessage('Нужна авторизация');
      return;
    }
    setSaving(email);
    try {
      await updateUserRole(email, role, token);
      setUsers((prev) => prev.map((u) => (u.email === email ? { ...u, role } : u)));
      setMessage('Роль обновлена');
    } catch (e: any) {
      setMessage(e?.message ?? 'Не удалось обновить роль');
    } finally {
      setSaving(null);
    }
  };

  if (!token)
    return (
      <div className="text-sm text-gray-500">
        Для управления пользователями нужно войти (email-код). Сейчас роли не изменить.
      </div>
    );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-dorren-black uppercase tracking-brand">Пользователи</h3>
        {message && <span className="text-xs text-gray-500">{message}</span>}
      </div>
      <div className="border border-gray-200 divide-y">
        <div className="grid grid-cols-4 text-xs uppercase tracking-wider text-gray-500 bg-gray-50 px-3 py-2">
          <span>Email</span>
          <span>Имя</span>
          <span>Роль</span>
          <span>Действия</span>
        </div>
        {users.map((u) => (
          <div key={u.id} className="grid grid-cols-4 items-center px-3 py-2 text-sm">
            <span className="truncate">{u.email}</span>
            <span className="text-gray-700 truncate">{u.name}</span>
            <select
              className="border border-gray-300 text-sm px-2 py-1"
              value={u.role ?? 'employee'}
              onChange={(e) => changeRole(u.email ?? '', e.target.value)}
              disabled={saving === u.email}
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <div className="text-xs text-gray-500">
              {saving === u.email ? 'Сохранение...' : ' '}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersAdmin;
