import { useState } from 'react';
import { api, authHeaders } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const AdminExportPage = () => {
  const { token } = useAuth();
  const { t, isRTL } = useLanguage();
  const alignClass = isRTL ? 'text-right' : 'text-left';
  const dir = isRTL ? 'rtl' : 'ltr';
  const [loading, setLoading] = useState(null);

  const handleExport = async (type, format) => {
    const key = `${type}-${format}`;
    setLoading(key);
    try {
      const endpoint = format === 'csv' ? `/export/csv/${type}` : `/export/excel/${type}`;
      const res = await api.get(endpoint, {
        ...authHeaders(token),
        responseType: 'blob',
      });

      const ext = format === 'csv' ? 'csv' : 'xlsx';
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setLoading(null);
    }
  };

  const exportCards = [
    {
      titleKey: 'admin.sectionWorkers',
      descKey: 'admin.exportWorkersDesc',
      descFallback: isRTL ? 'تصدير جميع بيانات العمال المسجلين' : 'Exporter toutes les données des travailleurs inscrits.',
      type: 'workers',
      color: 'sky',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="7" r="3" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      titleKey: 'admin.sectionRequests',
      descKey: 'admin.exportRequestsDesc',
      descFallback: isRTL ? 'تصدير جميع طلبات الفلاحين' : 'Exporter toutes les demandes des agriculteurs.',
      type: 'requests',
      color: 'amber',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round" />
          <line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round" />
          <polyline points="10 9 9 9 8 9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  const colorMap = {
    sky: {
      bg: 'bg-sky-50',
      text: 'text-sky-600',
      border: 'border-sky-200',
      btnCsv: 'bg-sky-600 hover:bg-sky-700 text-white',
      btnExcel: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-200',
      btnCsv: 'bg-amber-600 hover:bg-amber-700 text-white',
      btnExcel: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    },
  };

  return (
    <div dir={dir} className={alignClass}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="7 10 12 15 17 10" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{t('admin.exportTitle')}</h1>
            <p className="text-sm text-gray-500">{t('admin.exportHint')}</p>
          </div>
        </div>
      </div>

      {/* Export Cards */}
      <div className="grid gap-6 sm:grid-cols-2">
        {exportCards.map((card) => {
          const colors = colorMap[card.color];
          return (
            <div
              key={card.type}
              className={`rounded-2xl border ${colors.border} bg-white p-6 shadow-sm transition hover:shadow-md`}
            >
              {/* Card Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors.bg} ${colors.text}`}>
                  {card.icon}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{t(card.titleKey)}</h2>
                  <p className="text-xs text-gray-500">{t(card.descKey) || card.descFallback}</p>
                </div>
              </div>

              {/* Export Buttons */}
              <div className="flex flex-col gap-3">
                {/* CSV */}
                <button
                  onClick={() => handleExport(card.type, 'csv')}
                  disabled={loading === `${card.type}-csv`}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-sm transition disabled:opacity-50 ${colors.btnCsv}`}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {loading === `${card.type}-csv`
                    ? (isRTL ? 'جارٍ التحميل...' : 'Téléchargement...')
                    : (card.type === 'workers' ? t('admin.exportWorkersCSV') : t('admin.exportRequestsCSV'))}
                </button>

                {/* Excel */}
                <button
                  onClick={() => handleExport(card.type, 'excel')}
                  disabled={loading === `${card.type}-excel`}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-sm transition disabled:opacity-50 ${colors.btnExcel}`}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="3" y1="15" x2="21" y2="15" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                    <line x1="15" y1="3" x2="15" y2="21" />
                  </svg>
                  {loading === `${card.type}-excel`
                    ? (isRTL ? 'جارٍ التحميل...' : 'Téléchargement...')
                    : (card.type === 'workers' ? t('admin.exportWorkersExcel') : t('admin.exportRequestsExcel'))}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info hint */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-start gap-3">
          <svg className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <div>
            <p className="text-sm font-medium text-gray-700">
              {isRTL ? 'ملاحظة' : 'Note'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {isRTL
                ? 'ملفات CSV يمكن فتحها في أي محرر نصوص أو جدول بيانات. ملفات Excel (.xlsx) تُفتح مباشرة في Microsoft Excel أو Google Sheets.'
                : 'Les fichiers CSV peuvent être ouverts dans n\'importe quel éditeur de texte ou tableur. Les fichiers Excel (.xlsx) s\'ouvrent directement dans Microsoft Excel ou Google Sheets.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminExportPage;
