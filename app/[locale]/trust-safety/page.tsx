import { useTranslations } from 'next-intl';
import InfoPage from '@/frontend/components/InfoPage';

export default function TrustSafetyPage() {
  const t = useTranslations('trustSafety');
  
  return (
    <InfoPage 
      title={t('title')} 
      description={t('description')}
    >
      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <h3 className="text-xl font-bold mb-3">{t('verified.title')}</h3>
          <p className="text-slate-600 dark:text-slate-400">{t('verified.desc')}</p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <h3 className="text-xl font-bold mb-3">{t('payment.title')}</h3>
          <p className="text-slate-600 dark:text-slate-400">{t('payment.desc')}</p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <h3 className="text-xl font-bold mb-3">{t('secure.title')}</h3>
          <p className="text-slate-600 dark:text-slate-400">{t('secure.desc')}</p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <h3 className="text-xl font-bold mb-3">{t('standards.title')}</h3>
          <p className="text-slate-600 dark:text-slate-400">{t('standards.desc')}</p>
        </div>
      </div>
    </InfoPage>
  );
}
