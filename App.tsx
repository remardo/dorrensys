import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MerchStore from './components/MerchStore';
import LMS from './components/LMS';
import TasksKanban from './components/TasksKanban';
import News from './components/News';
import NewsDetail from './components/NewsDetail';
import Docs from './components/Docs';
import AdminPanel from './components/AdminPanel';
import Company from './components/Company';
import { Search, Bell, Menu } from 'lucide-react';
import { initialCourses, initialDocs, initialNews, initialHome } from './data';
import { Course, DocumentItem, NewsItem, HomeConfig } from './types';
import { fetchNewsFromConvex, pushNewsToConvex } from './convexClient';
import AuthWidget from './components/AuthWidget';

const pageTitles: Record<string, string> = {
  '/': 'Главная панель',
  '/news': 'Новости компании',
  '/tasks': 'Задачи',
  '/lms': 'Обучение',
  '/store': 'Мерч',
  '/docs': 'Документы',
  '/admin': 'Админ-панель',
  '/company': 'Компания',
};

const Layout: React.FC = () => {
  const location = useLocation();
  const [adminMode, setAdminMode] = useState(false);
  const [newsItems, setNewsItems] = useState<NewsItem[]>(initialNews);
  const [docs, setDocs] = useState<DocumentItem[]>(initialDocs);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [home, setHome] = useState<HomeConfig>(initialHome);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('convex_token'));
  const [authEmail, setAuthEmail] = useState<string | null>(() => localStorage.getItem('convex_email'));
  const title = pageTitles[location.pathname] ?? 'Portal';

  // Подтягиваем новости из Convex, если настроен VITE_CONVEX_URL.
  useEffect(() => {
    fetchNewsFromConvex().then((items) => {
      if (items && items.length) {
        setNewsItems(items);
      }
    });
  }, []);

  const handleNewsChange = async (items: NewsItem[]) => {
    setNewsItems(items);
    await pushNewsToConvex(items, authToken);
  };

  const handleAuth = (token: string, email: string) => {
    setAuthToken(token);
    setAuthEmail(email);
    localStorage.setItem('convex_token', token);
    localStorage.setItem('convex_email', email);
  };

  const handleLogout = () => {
    setAuthToken(null);
    setAuthEmail(null);
    localStorage.removeItem('convex_token');
    localStorage.removeItem('convex_email');
  };

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
            <button className="mr-4 lg:hidden text-gray-500" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu />
            </button>
            <h2 className="text-sm font-bold uppercase tracking-brand text-gray-500 hidden md:block">{title}</h2>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative hidden md:block w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Поиск документов, контактов..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-dorren-blue transition-colors"
              />
            </div>
            <AuthWidget token={authToken} email={authEmail} onAuth={handleAuth} onLogout={handleLogout} />
            <button className="relative text-gray-500 hover:text-dorren-dark">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <button
              onClick={() => {
                if (!authToken) {
                  alert('Войдите по email, чтобы редактировать контент');
                  return;
                }
                setAdminMode(!adminMode);
              }}
              className={`px-3 py-2 text-xs uppercase tracking-wider border ${adminMode ? 'bg-dorren-dark text-white border-dorren-dark' : 'border-dorren-dark text-dorren-dark hover:bg-dorren-dark hover:text-white'} transition-colors`}
            >
              {adminMode ? 'Режим ON' : 'Режим OFF'}
            </button>
          </div>
        </header>

        <div className="p-6 md:p-10 flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard home={home} />} />
            <Route path="/news" element={<News items={newsItems} />} />
            <Route path="/news/:slugOrId" element={<NewsDetail items={newsItems} />} />
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
                  home={home}
                  onNewsChange={handleNewsChange}
                  onDocsChange={setDocs}
                  onCoursesChange={setCourses}
                  onHomeChange={setHome}
                  adminEnabled={adminMode}
                />
              }
            />
            <Route path="/company" element={<Company />} />
            <Route path="*" element={<Dashboard home={home} />} />
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

