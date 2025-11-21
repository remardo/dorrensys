import React from 'react';
import {
  LayoutDashboard,
  Newspaper,
  GraduationCap,
  ShoppingBag,
  Users,
  CheckSquare,
  FileText,
  Settings,
  Award,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { NavItem } from '../types';

interface SidebarProps {
  onNavigate?: () => void;
  adminMode?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, adminMode }) => {
  const navItems: NavItem[] = [
    { label: 'Главная', icon: LayoutDashboard, path: '/' },
    { label: 'Новости', icon: Newspaper, path: '/news' },
  { label: 'Задачи', icon: CheckSquare, path: '/tasks' },
  { label: 'Обучение', icon: GraduationCap, path: '/lms' },
  { label: 'Мерч', icon: ShoppingBag, path: '/store' },
  { label: 'Документы', icon: FileText, path: '/docs' },
  { label: 'Компания', icon: Users, path: '/company' },
  ...(adminMode ? [{ label: 'Админ', icon: Award, path: '/admin' }] : []),
];

  return (
    <aside className="w-72 bg-dorren-dark text-white flex flex-col h-screen fixed left-0 top-0 border-r border-gray-800 z-50">
      <div className="p-8 border-b border-gray-700">
        <h1 className="text-2xl font-light tracking-logo text-white uppercase">Dorren</h1>
        <p className="text-[10px] tracking-widest text-dorren-blue mt-2 opacity-80 uppercase">
          Корпоративный портал
        </p>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={({ isActive }) =>
                `w-full flex items-center px-4 py-3 text-sm tracking-wide transition-all duration-200 group ${
                  isActive
                    ? 'bg-white/5 text-dorren-blue border-r-2 border-dorren-blue'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon
                size={18}
                className="mr-4 group-hover:text-white text-gray-500"
              />
              <span className="font-light uppercase text-xs">{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 px-4">
          <h3 className="text-[10px] uppercase tracking-widest text-gray-500 mb-4">Аккаунт</h3>
          <button className="w-full flex items-center px-4 py-2 text-gray-400 hover:text-white transition-colors">
            <Users size={18} className="mr-4" />
            <span className="text-xs uppercase font-light">Контакты</span>
          </button>
          <button className="w-full flex items-center px-4 py-2 text-gray-400 hover:text-white transition-colors">
            <Settings size={18} className="mr-4" />
            <span className="text-xs uppercase font-light">Настройки</span>
          </button>
        </div>
      </div>

      <div className="p-6 border-t border-gray-700 bg-black/20">
        <div className="flex items-center">
          <img
            src="https://placehold.co/100/100"
            alt="User"
            className="w-10 h-10 rounded-full border border-gray-600 object-cover"
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Смирнов А.</p>
            <p className="text-xs text-gray-500">Project Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
