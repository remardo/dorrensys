import React from 'react';
import { Download, FileText, Link as LinkIcon, Shield } from 'lucide-react';
import { DocumentItem } from '../types';

interface DocsProps {
  docs: DocumentItem[];
}

const Docs: React.FC<DocsProps> = ({ docs }) => {
  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between flex-wrap gap-3 items-end">
        <div>
          <h2 className="text-3xl font-light text-dorren-black uppercase tracking-widest mb-2">Документы</h2>
          <p className="text-gray-500 font-light text-sm">Политики, шаблоны и инструкции в одном месте.</p>
        </div>
        <button className="px-6 py-2 bg-dorren-dark text-white hover:bg-black transition-colors text-xs uppercase tracking-wider font-bold shadow-sm flex items-center gap-2">
          <Download size={16} /> Скачать всё (zip)
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {docs.map((doc) => (
          <div key={doc.id} className="border border-gray-100 bg-white p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-dorren-dark/10 flex items-center justify-center text-dorren-dark">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">{doc.category}</p>
                  <h3 className="text-sm font-semibold text-dorren-black">{doc.title}</h3>
                </div>
              </div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">{doc.type}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{doc.size}</span>
              <span>Обновлено: {doc.updated}</span>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-xs uppercase tracking-wider hover:border-dorren-blue hover:text-dorren-blue transition-colors">
                <Download size={14} /> Скачать
              </button>
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-xs uppercase tracking-wider hover:border-dorren-blue hover:text-dorren-blue transition-colors">
                <LinkIcon size={14} /> Открыть
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-dorren-dark text-white p-6 flex items-center gap-3">
        <Shield />
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider">Контроль доступа</p>
          <p className="text-sm text-white/80">Конфиденциальные документы открываются только сотрудникам с подтверждёнными ролями.</p>
        </div>
      </div>
    </div>
  );
};

export default Docs;
