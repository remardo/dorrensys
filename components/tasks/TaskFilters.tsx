import React from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import { User } from '../../types';

interface FiltersState {
  assignee: string;
  priority: string;
  status: string;
}

interface Props {
  filters: FiltersState;
  onChange: (next: FiltersState) => void;
  users: User[];
}

const TaskFilters: React.FC<Props> = ({ filters, onChange, users }) => {
  const update = (key: keyof FiltersState, value: string) => onChange({ ...filters, [key]: value });

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6 bg-white p-3 border border-gray-100 shadow-sm">
      <div className="flex items-center text-xs text-gray-400 mr-2 font-medium uppercase tracking-wider">
        <Filter size={14} className="mr-2" />
        Фильтры:
      </div>
      <div className="relative">
        <select
          value={filters.assignee}
          onChange={(e) => update('assignee', e.target.value)}
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
          onChange={(e) => update('priority', e.target.value)}
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
          onChange={(e) => update('status', e.target.value)}
          className="appearance-none bg-gray-50 border border-gray-200 text-xs uppercase tracking-wider px-3 py-2 pr-8 rounded-sm focus:outline-none focus:border-dorren-blue text-dorren-black cursor-pointer hover:bg-gray-100 transition-colors"
        >
          <option value="all">Все статусы</option>
          <option value="todo">В очереди</option>
          <option value="in-progress">В работе</option>
          <option value="done">Готово</option>
        </select>
        <ChevronDown size={12} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};

export default TaskFilters;
