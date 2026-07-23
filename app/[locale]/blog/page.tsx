import { useTranslations } from 'next-intl';
import InfoPage from '@/components/InfoPage';

export default function BlogPage() {
  const t = useTranslations('blog');
  
  return (
    <InfoPage 
      title={t('title')} 
      description={t('description')}
    >
      <div className="flex flex-col items-center justify-center p-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
        <div className="text-6xl mb-8">📰</div>
        <h2 className="text-2xl font-black text-slate-900 mb-4">{t('noPosts')}</h2>
        <p className="text-slate-400 font-bold max-w-sm mx-auto">{t('subscribe')}</p>
      </div>

      <div className="grid gap-12 mt-20 opacity-30 grayscale pointer-events-none">
        <article className="group">
          <div className="aspect-[16/9] bg-slate-200 rounded-[2.5rem] overflow-hidden mb-8"></div>
          <div className="flex items-center gap-4 text-sm font-black text-slate-400 mb-2 uppercase tracking-widest">
            <span>April 10, 2026</span>
            <span>•</span>
            <span className="text-blue-600">{t('featured')}</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">{t('featured')}</h2>
        </article>
      </div>
    </InfoPage>
  );
}
