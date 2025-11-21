import React from 'react';
import { ArrowRight, Bookmark, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NewsItem } from '../types';

interface NewsProps {
  items: NewsItem[];
}

const News: React.FC<NewsProps> = ({ items }) => {
  if (!items.length) return <div className="text-sm text-gray-500">Нет новостей</div>;
  const [first, ...rest] = items;

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-light text-dorren-black uppercase tracking-widest mb-2">Новости компании</h2>
          <p className="text-gray-500 font-light text-sm">Релизы, обновления и важные объявления.</p>
        </div>
        <span className="text-xs uppercase tracking-wider text-dorren-dark flex items-center">
          Архив <ArrowRight size={14} className="ml-1" />
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Link to={`/news/${first.slug ?? first.id}`} className="lg:col-span-2 relative overflow-hidden bg-black group cursor-pointer">
          <img
            src={first.image}
            alt={first.title}
            className="w-full h-80 object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent p-8 flex flex-col justify-end">
            <span className="text-dorren-blue text-xs uppercase tracking-widest mb-2 inline-flex items-center gap-2">
              <Bookmark size={14} /> {first.category}
            </span>
            <h3 className="text-white text-2xl font-light leading-tight mb-2">{first.title}</h3>
            <p className="text-gray-300 text-sm font-light line-clamp-2">{first.excerpt}</p>
          </div>
        </Link>

        {rest.map((item) => (
          <article key={item.id} className="bg-white border border-gray-100 hover:shadow-md transition-shadow">
            <Link to={`/news/${item.slug ?? item.id}`}>
              <div className="h-44 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-dorren-blue uppercase tracking-wider font-semibold">{item.category}</span>
                  <span className="text-[10px] text-gray-400">{item.date}</span>
                </div>
                <h4 className="text-lg text-dorren-black font-medium leading-snug">{item.title}</h4>
                <p className="text-sm text-gray-500 line-clamp-2">{item.excerpt}</p>
                <span className="text-xs uppercase tracking-wider text-dorren-dark hover:text-dorren-blue flex items-center">
                  Читать <ArrowRight size={14} className="ml-1" />
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>

      <section className="bg-white border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-brand text-dorren-black">Быстрые обновления</h3>
          <span className="text-xs text-gray-400 flex items-center">
            <Clock size={14} className="mr-1" /> Последние 7 дней
          </span>
        </div>
        <div className="space-y-3">
          {items.slice(0, 4).map((text) => (
            <Link key={text.id} to={`/news/${text.slug ?? text.id}`} className="flex justify-between items-center border-b border-gray-50 pb-3 hover:text-dorren-blue">
              <p className="text-sm text-dorren-black">{text.title}</p>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">{text.category}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default News;
