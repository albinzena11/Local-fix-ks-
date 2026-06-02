import { useTranslations } from 'next-intl';
import InfoPage from '@/frontend/components/InfoPage';

export default function CommunityPage() {
  const t = useTranslations('community');
  
  return (
    <InfoPage 
      title={t('title')} 
      description={t('description')}
    >
      <div className="prose max-w-none dark:prose-invert">
        <h2 className="text-3xl font-black mt-8 mb-8 text-slate-900">{t('success')}</h2>

        <div className="mt-12 grid md:grid-cols-2 gap-8">
           <div className="p-10 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-[3rem] border-2 border-indigo-100 dark:border-indigo-800 group hover:bg-white hover:shadow-2xl transition-all duration-500 text-center">
              <h3 className="text-2xl font-black text-indigo-900 dark:text-indigo-100 mb-4">{t('forum.title')}</h3>
              <p className="text-indigo-800/60 dark:text-indigo-200 font-bold mb-8 leading-relaxed">{t('forum.desc')}</p>
              <button className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30">
                  {t('forum.cta')}
              </button>
           </div>
           <div className="p-10 bg-rose-50/50 dark:bg-rose-900/10 rounded-[3rem] border-2 border-rose-100 dark:border-rose-800 group hover:bg-white hover:shadow-2xl transition-all duration-500 text-center">
              <h3 className="text-2xl font-black text-rose-900 dark:text-rose-100 mb-4">{t('expert.title')}</h3>
              <p className="text-rose-800/60 dark:text-rose-200 font-bold mb-8 leading-relaxed">{t('expert.desc')}</p>
              <button className="bg-rose-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-rose-700 transition-all shadow-lg hover:shadow-rose-500/30">
                  {t('expert.cta')}
              </button>
           </div>
        </div>
      </div>
    </InfoPage>
  );
}
