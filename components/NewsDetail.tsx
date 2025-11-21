import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Link as LinkIcon } from 'lucide-react';
import { NewsItem } from '../types';

interface NewsDetailProps {
  items: NewsItem[];
}

const NewsDetail: React.FC<NewsDetailProps> = ({ items }) => {
  const { slugOrId } = useParams();
  const item = items.find((n) => n.slug === slugOrId) || items.find((n) => n.id.toString() === slugOrId);

  if (!item) {
    return (
      <div className="p-6 bg-white border border-gray-100">
        <p className="text-sm text-gray-500">Новость не найдена.</p>
        <Link to="/news" className="text-dorren-blue text-sm flex items-center mt-2">
          <ArrowLeft size={14} className="mr-1" /> К списку новостей
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <Link to="/news" className="text-dorren-blue text-sm flex items-center">
        <ArrowLeft size={14} className="mr-1" /> Ко всем новостям
      </Link>

      <article className="bg-white border border-gray-100 shadow-sm">
        <img src={item.image} alt={item.title} className="w-full max-h-[360px] object-cover" />
        <div className="p-6 space-y-4">
          <div className="text-xs uppercase tracking-wider text-dorren-blue">{item.category}</div>
          <h1 className="text-3xl font-light text-dorren-black leading-tight">{item.title}</h1>
          <p className="text-sm text-gray-400">{item.date}</p>
          <p className="text-base text-gray-700">{item.excerpt}</p>
          <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
            {(item.body ?? []).map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-dorren-blue">
            <LinkIcon size={14} /> Делитесь ссылкой: {window.location.href}
          </div>
        </div>
      </article>
    </div>
  );
};

export default NewsDetail;
