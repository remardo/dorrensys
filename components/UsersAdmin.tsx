import React, { useEffect, useState } from 'react';
import { fetchUsers, setUserRole } from '../authClient';

interface UsersAdminProps {
  token: string | null;
}

const UsersAdmin: React.FC<UsersAdminProps> = ({ token }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) return;
    fetchUsers(token).then(setUsers).catch((e) => setMessage(e?.message ?? 'Ошибка загрузки пользователей'));
  }, [token]);

  const updateRole = async (email: string, role: string) => {
    if (!token) {
      setMessage('Нужен вход как админ');
      return;
    }
    await setUserRole(token, email, role);
    const next = users.map((u) => (u.email === email ? { ...u, role } : u));
    setUsers(next);
    setMessage('Роль обновлена');
  };

  if (!token) return <div className="text-sm text-gray-500">Войдите как админ, чтобы управлять пользователями.</div>;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-dorren-black uppercase tracking-brand">Пользователи</h3>
        {message && <span className="text-xs text-gray-500">{message}</span>}
      </div>
      <div className="border border-gray-200 divide-y">
        <div className="grid grid-cols-3 text-xs uppercase tracking-wider text-gray-500 bg-gray-50 px-3 py-2">
          <span>Email</span>
          <span>Роль</span>
          <span>Действия</span>
        </div>
        {users.map((u) => (
          <div key={u.email} className="grid grid-cols-3 items-center px-3 py-2 text-sm">
            <span>{u.email}</span>
            <span className="text-gray-700">{u.role}</span>
            <div className="space-x-2">
              <button
                className="text-xs px-2 py-1 border border-gray-300 hover:border-dorren-blue hover:text-dorren-blue"
                onClick={() => updateRole(u.email, 'user')}
              >
                User
              </button>
              <button
                className="text-xs px-2 py-1 border border-gray-300 hover:border-dorren-blue hover:text-dorren-blue"
                onClick={() => updateRole(u.email, 'admin')}
              >
                Admin
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersAdmin;

