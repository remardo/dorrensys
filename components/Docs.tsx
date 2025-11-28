import React, { useEffect, useMemo, useState } from 'react';
import { Download, FileText, Link as LinkIcon, Shield, Search, X } from 'lucide-react';
import { DocumentItem } from '../types';
import { getStorageUrl } from '../convexClient';

interface DocsProps {
  docs: DocumentItem[];
}

const normalizeLink = (link: string) => (link.startsWith('//') ? `https:${link}` : link);
const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;

const officeViewerUrl = (link: string) => `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(link)}`;

const Docs: React.FC<DocsProps> = ({ docs }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [selected, setSelected] = useState<DocumentItem | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const categories = useMemo(() => ['all', ...Array.from(new Set(docs.map((d) => d.category)))], [docs]);

  const filtered = useMemo(() => {
    return docs.filter((d) => {
      const byCat = category === 'all' || d.category === category;
      const q = query.trim().toLowerCase();
      const byQuery = !q || d.title.toLowerCase().includes(q) || d.type.toLowerCase().includes(q);
      return byCat && byQuery;
    });
  }, [docs, query, category]);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    const resolveLink = async (link: string) => {
      const normalized = normalizeLink(link);
      const looksLikeStorageId = /^[a-z0-9]{10,}$/i.test(normalized) && !/^https?:/i.test(normalized);
      if (looksLikeStorageId) {
        const url = await getStorageUrl(normalized);
        if (url) return url;
        if (convexUrl) return `${convexUrl}/api/storage/${normalized}`;
      }
      if (!/^https?:/i.test(normalized) && convexUrl) {
        return `${convexUrl}/${normalized.replace(/^\//, '')}`;
      }
      return normalized;
    };

    const resetPreview = () => {
      setPdfPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setPdfError(null);
      setPdfLoading(false);
    };

    if (!selected || (selected.type ?? '').toLowerCase() !== 'pdf') {
      resetPreview();
      return;
    }

    const load = async () => {
      const resolved = await resolveLink(selected.link);
      if (cancelled) return;

      setPdfLoading(true);
      setPdfError(null);
      setPdfPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });

      fetch(resolved)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.blob();
        })
        .then((blob) => {
          if (cancelled) return;
          objectUrl = URL.createObjectURL(blob);
          setPdfPreviewUrl(objectUrl);
        })
        .catch(() => {
          if (!cancelled) setPdfError('Не удалось загрузить PDF для предпросмотра. Откройте в новой вкладке или скачайте файл.');
        })
        .finally(() => {
          if (!cancelled) setPdfLoading(false);
        });
    };

    load();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [selected]);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between flex-wrap gap-3 items-center">
        <div>
          <h2 className="text-3xl font-light text-dorren-black uppercase tracking-widest mb-1">Документы</h2>
          <p className="text-gray-500 font-light text-sm">Облачное хранилище: PDF, DOC/DOCX и презентации прямо в браузере.</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="pl-7 pr-3 py-2 border border-gray-200 text-sm w-60"
              placeholder="Искать по названию..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-200 text-sm px-3 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'all' ? 'Все категории' : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="border border-gray-100 bg-white p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelected(doc)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-dorren-dark/10 flex items-center justify-center text-dorren-dark">
                  <FileText size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">{doc.category}</p>
                  <h3 className="text-sm font-semibold text-dorren-black line-clamp-2">{doc.title}</h3>
                </div>
              </div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">{doc.type}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{doc.size}</span>
              <span>Обновлено: {doc.updated}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <a
                href={doc.link}
                download
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-xs uppercase tracking-wider hover:border-dorren-blue hover:text-dorren-blue transition-colors"
              >
                <Download size={14} /> Скачать
              </a>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(doc);
                }}
                className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-xs uppercase tracking-wider hover:border-dorren-blue hover:text-dorren-blue transition-colors"
              >
                <LinkIcon size={14} /> Открыть
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="col-span-full text-sm text-gray-500 border border-dashed border-gray-200 p-4">Ничего не найдено по фильтрам.</div>}
      </div>

      <div className="bg-dorren-dark text-white p-6 flex items-center gap-3">
        <Shield />
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider">Корпоративное хранилище</p>
          <p className="text-sm text-white/80">Документы доступны только сотрудникам, ссылки защищены.</p>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white w-full max-w-[92vw] h-[90vh] min-h-[80vh] shadow-2xl relative flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">{selected.category}</p>
                <h3 className="text-lg font-semibold text-dorren-black">{selected.title}</h3>
                <p className="text-xs text-gray-500">
                  {selected.type} • {selected.size} • {selected.updated}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <a
                  href={selected.link}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 border border-gray-200 text-xs uppercase tracking-wider hover:border-dorren-blue hover:text-dorren-blue"
                >
                  Открыть в новой вкладке
                </a>
                <a
                  href={selected.link}
                  download
                  className="px-3 py-2 border border-gray-200 text-xs uppercase tracking-wider hover:border-dorren-blue hover:text-dorren-blue flex items-center gap-1"
                >
                  <Download size={14} /> Скачать
                </a>
                <button className="text-gray-400 hover:text-dorren-black" onClick={() => setSelected(null)}>
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-gray-50">
              {(() => {
                const ext = (selected.type ?? '').toLowerCase();
                const normalized = normalizeLink(selected.link);

                if (ext === 'pdf') {
                  if (pdfLoading && !pdfPreviewUrl) {
                    return <div className="h-full flex items-center justify-center text-sm text-gray-600">Загружаем PDF для предпросмотра...</div>;
                  }

                  if (pdfError && !pdfPreviewUrl) {
                    return (
                      <div className="h-full flex items-center justify-center text-sm text-gray-600 px-6 text-center space-y-2">
                        <div>{pdfError}</div>
                        <div className="flex gap-2 justify-center">
                          <a
                            href={normalized}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 border border-gray-300 text-xs uppercase tracking-wider hover:border-dorren-blue hover:text-dorren-blue"
                          >
                            Открыть в новой вкладке
                          </a>
                          <a
                            href={normalized}
                            download
                            className="px-4 py-2 border border-gray-300 text-xs uppercase tracking-wider hover:border-dorren-blue hover:text-dorren-blue"
                          >
                            Скачать
                          </a>
                        </div>
                      </div>
                    );
                  }

                  if (!pdfPreviewUrl) {
                    return <div className="h-full flex items-center justify-center text-sm text-gray-600">Готовим предпросмотр...</div>;
                  }

                  return (
                    <iframe
                      title={selected.title}
                      src={pdfPreviewUrl}
                      className="w-full h-full border-0"
                      sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                    />
                  );
                }

                return (
                  <iframe
                    title={selected.title}
                    src={officeViewerUrl(normalized)}
                    className="w-full h-full border-0"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                  />
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Docs;
