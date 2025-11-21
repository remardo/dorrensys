import React, { useMemo, useState } from 'react';
import { Mail, Phone, Users, Building2, Plus, Trash, Pencil } from 'lucide-react';

type Person = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar?: string;
};

type Block = {
  id: string;
  title: string;
  description: string;
  people: Person[];
};

const seed = (): Block[] => {
  const makePerson = (idx: number, role: string, block: string): Person => ({
    id: `${block}-${idx}`,
    name: `Сотрудник ${idx}`,
    role,
    email: `person${idx}@dorren.ru`,
    phone: `+7 999 ${10000 + idx}`.replace(/(\+7 \d{3})(\d{3})(\d{2})(\d{2})/, '$1 $2-$3-$4'),
    avatar: `https://placehold.co/100/183141/FFFFFF?text=${idx}`,
  });

  const production: Person[] = [];
  for (let i = 1; i <= 20; i++) production.push(makePerson(i, i <= 5 ? 'Инженер' : i <= 10 ? 'Разработчик' : 'Производство', 'prod'));

  const management: Person[] = [];
  for (let i = 21; i <= 35; i++) management.push(makePerson(i, i <= 23 ? 'Финансы' : i <= 26 ? 'HR' : 'Операции', 'mgmt'));

  const sales: Person[] = [];
  for (let i = 36; i <= 50; i++) sales.push(makePerson(i, i <= 40 ? 'Продажи' : 'Аккаунт', 'sales'));

  return [
    { id: 'prod', title: 'Доррен Продакшн', description: 'Производственный блок: разработка, инженерия, производство.', people: production },
    { id: 'mgmt', title: 'Доррен (Управляющая компания)', description: 'Финансы, HR, юридическая и операционная поддержка.', people: management },
    { id: 'sales', title: 'Доррен Констракшн', description: 'Продажи и работа с клиентами.', people: sales },
  ];
};

const Company: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>(seed());
  const [activeBlockId, setActiveBlockId] = useState<string>('prod');
  const [editPerson, setEditPerson] = useState<Person | null>(null);

  const activeBlock = useMemo(() => blocks.find((b) => b.id === activeBlockId) ?? blocks[0], [blocks, activeBlockId]);

  const handleSavePerson = () => {
    if (!editPerson || !activeBlock) return;
    if (!editPerson.name.trim()) return;
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === activeBlock.id
          ? {
              ...b,
              people: b.people.some((p) => p.id === editPerson.id)
                ? b.people.map((p) => (p.id === editPerson.id ? editPerson : p))
                : [{ ...editPerson, id: `${activeBlock.id}-${Date.now()}` }, ...b.people],
            }
          : b,
      ),
    );
    setEditPerson(null);
  };

  const handleDeletePerson = (personId: string) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === activeBlockId ? { ...b, people: b.people.filter((p) => p.id !== personId) } : b,
      ),
    );
    if (editPerson?.id === personId) setEditPerson(null);
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-light text-dorren-black uppercase tracking-widest mb-2">Компания</h2>
          <p className="text-gray-500 font-light text-sm">Оргструктура, команды и контакты (≈50 сотрудников).</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Building2 size={18} />
          <span>Обновлено: январь 2025</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[320px_auto] gap-6">
        <div className="bg-white border border-gray-100 p-4 space-y-3 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-brand text-dorren-black mb-2">Блоки</h3>
          <div className="space-y-2">
            {blocks.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  setActiveBlockId(b.id);
                  setEditPerson(null);
                }}
                className={`w-full text-left border p-3 ${b.id === activeBlockId ? 'border-dorren-blue bg-dorren-blue/5' : 'border-gray-200 hover:border-dorren-blue'}`}
              >
                <p className="text-sm font-semibold text-dorren-black">{b.title}</p>
                <p className="text-xs text-gray-500">{b.description}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">{b.people.length} человек</p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {activeBlock && (
            <>
              <div className="bg-white border border-gray-100 shadow-sm p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold uppercase tracking-brand text-dorren-black">{activeBlock.title}</h3>
                  <button
                    className="text-xs uppercase tracking-wider text-dorren-dark hover:text-dorren-blue flex items-center gap-1"
                    onClick={() =>
                      setEditPerson({
                        id: '',
                        name: '',
                        role: '',
                        email: '',
                        phone: '',
                        avatar: 'https://placehold.co/100',
                      })
                    }
                  >
                    <Plus size={14} /> Добавить сотрудника
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">{activeBlock.description}</p>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {activeBlock.people.map((p) => (
                    <div key={p.id} className="border border-gray-200 p-3 bg-white shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <img src={p.avatar ?? 'https://placehold.co/100'} alt={p.name} className="w-10 h-10 rounded-full object-cover border border-white shadow" />
                        <div>
                          <p className="text-sm font-semibold text-dorren-black">{p.name}</p>
                          <p className="text-xs text-gray-500">{p.role}</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1 mb-3">
                        <a href={`mailto:${p.email}`} className="flex items-center gap-2 hover:text-dorren-blue">
                          <Mail size={14} /> {p.email}
                        </a>
                        <a href={`tel:${p.phone}`} className="flex items-center gap-2 hover:text-dorren-blue">
                          <Phone size={14} /> {p.phone}
                        </a>
                      </div>
                      <div className="flex justify-end gap-2 text-xs text-gray-500">
                        <button onClick={() => setEditPerson(p)} className="flex items-center gap-1 hover:text-dorren-blue">
                          <Pencil size={12} /> Править
                        </button>
                        <button onClick={() => handleDeletePerson(p.id)} className="flex items-center gap-1 text-red-500 hover:text-red-700">
                          <Trash size={12} /> Удалить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {editPerson && (
                <div className="bg-white border border-gray-100 shadow-sm p-4 space-y-3">
                  <h4 className="text-sm font-bold uppercase tracking-brand text-dorren-black mb-2">
                    {editPerson.id ? 'Редактирование' : 'Новый сотрудник'} — {activeBlock.title}
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs uppercase text-gray-500 mb-1">Имя</label>
                      <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={editPerson.name} onChange={(e) => setEditPerson({ ...editPerson, name: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-gray-500 mb-1">Роль</label>
                      <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={editPerson.role} onChange={(e) => setEditPerson({ ...editPerson, role: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-gray-500 mb-1">Email</label>
                      <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={editPerson.email} onChange={(e) => setEditPerson({ ...editPerson, email: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-gray-500 mb-1">Телефон</label>
                      <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={editPerson.phone} onChange={(e) => setEditPerson({ ...editPerson, phone: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-gray-500 mb-1">Аватар (URL)</label>
                      <input className="w-full border border-gray-200 px-3 py-2 text-sm" value={editPerson.avatar ?? ''} onChange={(e) => setEditPerson({ ...editPerson, avatar: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button className="px-4 py-2 text-xs uppercase tracking-wider text-gray-500 hover:text-dorren-black" onClick={() => setEditPerson(null)}>
                      Отмена
                    </button>
                    <button className="px-5 py-2 bg-dorren-dark text-white text-xs uppercase tracking-wider hover:bg-black transition-colors" onClick={handleSavePerson}>
                      Сохранить
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Company;
