import { useTranslations } from 'next-intl';
import InfoPage from '@/frontend/components/InfoPage';

export default function CareersPage() {
  const t = useTranslations('careers');
  
  return (
    <InfoPage 
      title={t('title')} 
      description={t('description')}
    >
      <div className="prose max-w-none dark:prose-invert">
        <h2 className="text-4xl font-black mt-8 mb-4 text-blue-600">{t('hiring')}</h2>
        <p className="text-slate-500 text-xl font-bold mb-12 leading-relaxed max-w-2xl">{t('hiringDesc')}</p>
        
        <div className="mt-12 p-12 bg-slate-900 rounded-[3.5rem] text-white text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
            <h3 className="text-3xl font-black mb-4 relative z-10">{t('viewPositions')}</h3>
            <p className="mb-10 text-slate-400 font-bold relative z-10 uppercase tracking-widest">{t('activePositions')}</p>
            <button className="bg-white text-slate-900 px-12 py-5 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all hover:scale-105 active:scale-95 shadow-xl relative z-10">
               {t('apply')}
            </button>
        </div>
      </div>
    </InfoPage>
  );
}
