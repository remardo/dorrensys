import React, { useEffect, useMemo, useState } from 'react';
import { fetchUsersFromConvex, pushUsersToConvex, updateUserRole, deleteUserFromConvex, uploadFileToConvex } from '../convexClient';
import { User } from '../types';

interface UsersAdminProps {
  token: string | null;
}

type UserRow = User & { convexId?: string };

const mockUsers = (): UserRow[] =>
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
  const [users, setUsers] = useState<UserRow[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<Partial<UserRow>>({ role: 'employee', department: 'mgmt', avatar: 'https://placehold.co/100', coins: 0 });
  const [uploading, setUploading] = useState(false);

  const loadUsers = () => {
    fetchUsersFromConvex()
      .then((list) =>
        setUsers(
          (list ?? []).map((u: any) => ({
            ...u,
            convexId: u._id ?? u.id ?? u.email,
          })),
        ),
      )
      .catch((e) => setMessage(e?.message ?? 'Ошибка загрузки пользователей'));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSaveAll = async () => {
    setLoading(true);
    try {
      // Сохраняем только необходимые поля, Convex сам выставит createdAt
      const prepared = users.map((u) => ({
        email: u.email ?? '',
        name: u.name ?? '',
        role: u.role ?? 'employee',
        avatar: u.avatar ?? 'https://placehold.co/100',
        coins: Number.isFinite(u.coins) ? Number(u.coins) : 0,
        department: (u as any).department ?? 'mgmt',
        learningProgress: (u as any).learningProgress ?? [],
        tasks: (u as any).tasks ?? [],
      }));
      await pushUsersToConvex(prepared as any, token);
      setMessage('Сохранено в Convex');
    } catch (e: any) {
      setMessage(e?.message ?? 'Не удалось сохранить');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (file: File, cb: (url: string) => void) => {
    setUploading(true);
    try {
      const { url } = await uploadFileToConvex(file);
      cb(url);
      setMessage('Аватар загружен');
    } catch (e: any) {
      setMessage(e?.message ?? 'Не удалось загрузить аватар');
    } finally {
      setUploading(false);
    }
  };

  const handleAddMock = () => {
    setUsers(mockUsers());
    setMessage('Добавлены 10 моковых пользователей, не забывайте сохранить в Convex');
  };

  const handleAddOne = () => {
    if (!draft.name || !draft.email) {
      setMessage('Укажите имя и email');
      return;
    }
    setUsers((prev) => [
      {
        id: draft.email!,
        convexId: draft.email!,
        name: draft.name!,
        email: draft.email!,
        role: draft.role ?? 'employee',
        department: draft.department ?? 'mgmt',
        avatar: draft.avatar ?? 'https://placehold.co/100',
        coins: draft.coins ?? 0,
      },
      ...prev,
    ]);
    setDraft({ role: 'employee', department: 'mgmt', avatar: 'https://placehold.co/100', coins: 0 });
    setMessage('');
  };

  const handleRoleChange = async (email: string, role: string) => {
    setUsers((prev) => prev.map((u) => (u.email === email ? { ...u, role } : u)));
    try {
      await updateUserRole(email, role, token);
    } catch (e: any) {
      setMessage(e?.message ?? 'Не удалось обновить роль');
    }
  };

  const handleDelete = async (user: UserRow) => {
    setUsers((prev) => prev.filter((u) => u.email !== user.email));
    if (!user.convexId) return;
    try {
      await deleteUserFromConvex(user.convexId, token);
      setMessage('Удалено');
    } catch (e: any) {
      setMessage(e?.message ?? 'Не удалось удалить (нужен вход админа)');
    }
  };

  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => u.role === 'admin').length;
    return { total, admins };
  }, [users]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-dorren-black uppercase tracking-brand">Пользователи</h3>
          <button className="text-xs px-3 py-1 border border-gray-200 hover:border-dorren-blue hover:text-dorren-blue" onClick={loadUsers}>
            Обновить
          </button>
          <span className="text-xs text-gray-500">
            Всего: {stats.total}, админов: {stats.admins}
          </span>
        </div>
        {message && <span className="text-xs text-gray-500">{message}</span>}
      </div>

      <div className="bg-gray-50 border border-dashed border-gray-200 p-3 space-y-2 text-sm">
        <div className="grid md:grid-cols-7 gap-2 items-center">
          <input className="border border-gray-200 px-3 py-2 text-sm" placeholder="Имя" value={draft.name ?? ''} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          <input className="border border-gray-200 px-3 py-2 text-sm" placeholder="Email" value={draft.email ?? ''} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
          <select className="border border-gray-200 px-3 py-2 text-sm" value={draft.role ?? 'employee'} onChange={(e) => setDraft({ ...draft, role: e.target.value })}>
            <option value="admin">admin</option>
            <option value="content">content</option>
            <option value="employee">employee</option>
          </select>
          <select className="border border-gray-200 px-3 py-2 text-sm" value={draft.department ?? 'mgmt'} onChange={(e) => setDraft({ ...draft, department: e.target.value })}>
            <option value="prod">Производство</option>
            <option value="mgmt">Менеджмент</option>
            <option value="sales">Продажи</option>
          </select>
          <input className="border border-gray-200 px-3 py-2 text-sm" placeholder="Avatar URL" value={draft.avatar ?? ''} onChange={(e) => setDraft({ ...draft, avatar: e.target.value })} />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              handleAvatarUpload(file, (url) => setDraft((prev) => ({ ...prev, avatar: url })));
            }}
          />
          <input className="border border-gray-200 px-3 py-2 text-sm" placeholder="Coins" type="number" value={draft.coins ?? 0} onChange={(e) => setDraft({ ...draft, coins: Number(e.target.value) })} />
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-dorren-dark text-white text-xs uppercase tracking-wider" onClick={handleAddOne}>
              Добавить
            </button>
            <button className="px-3 py-2 border text-xs uppercase tracking-wider" onClick={handleAddMock}>
              10 моков
            </button>
          </div>
        </div>
        <div className="text-xs text-gray-500">После правок нажмите «Сохранить в Convex». Удаление требует входа (админ).</div>
      </div>

      <div className="border border-gray-200 divide-y">
        <div className="grid grid-cols-[1.5fr_1.2fr_1fr_1fr_0.8fr_1.2fr_0.8fr] text-xs uppercase tracking-wider text-gray-500 bg-gray-50 px-3 py-2">
          <span>Email</span>
          <span>Имя</span>
          <span>Роль</span>
          <span>Департамент</span>
          <span>Coins</span>
          <span>Avatar</span>
          <span></span>
        </div>
        {users.map((u) => (
          <div key={u.email} className="grid grid-cols-[1.5fr_1.2fr_1fr_1fr_0.8fr_1.2fr_0.8fr] items-center px-3 py-2 text-sm">
            <span className="truncate">{u.email}</span>
            <input className="border border-gray-200 px-2 py-1 text-sm" value={u.name} onChange={(e) => setUsers((prev) => prev.map((item) => (item.email === u.email ? { ...item, name: e.target.value } : item)))} />
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
              <option value="prod">Производство</option>
              <option value="mgmt">Менеджмент</option>
              <option value="sales">Продажи</option>
            </select>
            <input
              type="number"
              className="border border-gray-200 px-2 py-1 text-sm"
              value={u.coins}
              onChange={(e) => setUsers((prev) => prev.map((item) => (item.email === u.email ? { ...item, coins: Number(e.target.value) } : item)))}
            />
            <input
              className="border border-gray-200 px-2 py-1 text-sm"
              value={u.avatar}
              onChange={(e) => setUsers((prev) => prev.map((item) => (item.email === u.email ? { ...item, avatar: e.target.value } : item)))}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                handleAvatarUpload(file, (url) =>
                  setUsers((prev) => prev.map((item) => (item.email === u.email ? { ...item, avatar: url } : item))),
                );
              }}
            />
            <div className="space-x-2 text-right">
              <button className="text-xs px-2 py-1 border border-gray-300 hover:border-dorren-blue hover:text-dorren-blue" onClick={() => handleDelete(u)}>
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button onClick={handleSaveAll} disabled={loading} className="px-5 py-2 bg-dorren-dark text-white text-xs uppercase tracking-wider hover:bg-black transition-colors">
          {loading ? 'Сохраняю...' : 'Сохранить в Convex'}
        </button>
      </div>
    </div>
  );
};

export default UsersAdmin;
