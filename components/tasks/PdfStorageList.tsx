import React, { useMemo, useState } from 'react';
import { Download, FileText, Link as LinkIcon, X } from 'lucide-react';
import { DocumentItem } from '../../types';

const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;
const pdfViewerUrl = (link: string) => `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(link)}`;

interface Props {
  docs: DocumentItem[];
}

const PdfStorageList: React.FC<Props> = ({ docs }) => {
  const [preview, setPreview] = useState<DocumentItem | null>(null);

  const pdfFiles = useMemo(() => {
    return docs.filter((doc) => {
      const isPdf = (doc.type ?? '').toLowerCase().includes('pdf');
      const isStorageLink = doc.link?.includes('/api/storage/');
      const matchesConvex = convexUrl ? doc.link?.includes(convexUrl) : false;
      return isPdf && (isStorageLink || matchesConvex);
    });
  }, [docs]);

  return (
    <div className="mt-8 bg-white border border-gray-100 shadow-sm p-4">
      <div className="flex justify-between items-center mb-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400">Convex Storage</p>
          <h3 className="text-lg font-semibold text-dorren-black">PDF-файлы загруженные в Convex</h3>
          <p className="text-xs text-gray-500">Файлы доступны для предпросмотра через PDF.js.</p>
        </div>
        <span className="text-xs text-gray-500">#{pdfFiles.length} файлов</span>
      </div>
      {pdfFiles.length === 0 ? (
        <div className="text-sm text-gray-500 border border-dashed border-gray-200 p-3">Пока нет PDF в Convex Storage.</div>
      ) : (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-3">
          {pdfFiles.map((doc) => (
            <div key={doc.id} className="border border-gray-100 p-3 flex flex-col gap-2 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-dorren-dark/10 flex items-center justify-center text-dorren-dark">
                  <FileText size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 line-clamp-1">{doc.category}</p>
                  <p className="text-sm font-semibold text-dorren-black line-clamp-1">{doc.title}</p>
                </div>
              </div>
              <div className="text-xs text-gray-500 flex justify-between">
                <span>{doc.size || '-'}</span>
                <span>{doc.updated}</span>
              </div>
              <div className="flex gap-2">
                <button
                  className="flex-1 px-3 py-2 border border-gray-200 text-xs uppercase tracking-wider hover:border-dorren-blue hover:text-dorren-blue flex items-center gap-2 justify-center"
                  onClick={() => setPreview(doc)}
                >
                  <LinkIcon size={14} /> Открыть
                </button>
                <a
                  href={doc.link}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 border border-gray-200 text-xs uppercase tracking-wider hover:border-dorren-blue hover:text-dorren-blue flex items-center gap-2"
                >
                  <Download size={14} /> Скачать
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-[110] bg-black/70 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="bg-white w-full max-w-[90vw] h-[90vh] shadow-2xl relative flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">{preview.category}</p>
                <h3 className="text-lg font-semibold text-dorren-black">{preview.title}</h3>
                <p className="text-xs text-gray-500">
                  {preview.type} • {preview.size} • {preview.updated}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={preview.link}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 border border-gray-200 text-xs uppercase tracking-wider hover:border-dorren-blue hover:text-dorren-blue"
                >
                  Открыть в новой вкладке
                </a>
                <button className="text-gray-400 hover:text-dorren-black" onClick={() => setPreview(null)}>
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-gray-50">
              <iframe title={preview.title} src={pdfViewerUrl(preview.link)} className="w-full h-full border-0" sandbox="allow-same-origin allow-scripts allow-forms allow-popups" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfStorageList;
