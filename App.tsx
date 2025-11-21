import React, { useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MerchStore from './components/MerchStore';
import LMS from './components/LMS';
import TasksKanban from './components/TasksKanban';
import News from './components/News';
import Docs from './components/Docs';
import AdminPanel from './components/AdminPanel';
import { Search, Bell, Menu } from 'lucide-react';
import { initialCourses, initialDocs, initialNews } from './data';
import { Course, DocumentItem, NewsItem } from './types';

const pageTitles: Record<string, string> = {
  '/': 'Главная панель',
  '/news': 'Новости компании',
  '/tasks': 'Задачи',
  '/lms': 'Обучение',
  '/store': 'Мерч',
  '/docs': 'Документы',
  '/admin': 'Админ-панель',
};

const Layout: React.FC = () => {
  const location = useLocation();
  const [adminMode, setAdminMode] = useState(false);
  const [newsItems, setNewsItems] = useState<NewsItem[]>(initialNews);
  const [docs, setDocs] = useState<DocumentItem[]>(initialDocs);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const title = pageTitles[location.pathname] ?? 'Portal';

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-dorren-black font-sans flex">
      <div className="hidden lg:block">
        <Sidebar onNavigate={() => undefined} adminMode={adminMode} />
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-dorren-dark">
            <Sidebar onNavigate={() => setIsMobileMenuOpen(false)} adminMode={adminMode} />
          </div>
        </div>
      )}

      <main className="flex-1 lg:ml-72 min-h-screen flex flex-col transition-all duration-300">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center">
            <button
              className="mr-4 lg:hidden text-gray-500"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu />
            </button>
            <h2 className="text-sm font-bold uppercase tracking-brand text-gray-500 hidden md:block">
              {title}
            </h2>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative hidden md:block w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Поиск контактов, документов..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-dorren-blue transition-colors"
              />
            </div>
            <button className="relative text-gray-500 hover:text-dorren-dark">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <button
              onClick={() => setAdminMode(!adminMode)}
              className={`px-3 py-2 text-xs uppercase tracking-wider border ${adminMode ? 'bg-dorren-dark text-white border-dorren-dark' : 'border-dorren-dark text-dorren-dark hover:bg-dorren-dark hover:text-white'} transition-colors`}
            >
              {adminMode ? 'Админ ON' : 'Админ OFF'}
            </button>
          </div>
        </header>

        <div className="p-6 md:p-10 flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/news" element={<News items={newsItems} />} />
            <Route path="/tasks" element={<TasksKanban />} />
            <Route path="/lms" element={<LMS courses={courses} />} />
            <Route path="/store" element={<MerchStore />} />
            <Route path="/docs" element={<Docs docs={docs} />} />
            <Route
              path="/admin"
              element={
                <AdminPanel
                  news={newsItems}
                  docs={docs}
                  courses={courses}
                  onNewsChange={setNewsItems}
                  onDocsChange={setDocs}
                  onCoursesChange={setCourses}
                  adminEnabled={adminMode}
                />
              }
            />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => (
  <HashRouter>
    <Layout />
  </HashRouter>
);

export default App;
