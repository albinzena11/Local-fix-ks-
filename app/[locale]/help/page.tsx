import { useTranslations } from 'next-intl';
import InfoPage from '@/components/InfoPage';
import FAQ from '@/frontend/components/FAQ';

export default function HelpPage() {
  const t = useTranslations('faq');
  
  return (
    <InfoPage 
      title={t('title')} 
      description={t('subtitle')}
    >
      <FAQ />
      
      <div className="mt-12 p-12 bg-slate-900 rounded-[3rem] text-white text-center shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
         <h3 className="text-2xl font-black mb-4 relative z-10">{t('stillHaveQuestions')}</h3>
         <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
            <a href="mailto:support@localfix.com" className="bg-blue-600 px-10 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl hover:scale-105 active:scale-95">
               {t('emailSupport')}
            </a>
            <button className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black hover:bg-blue-50 transition-all shadow-xl hover:scale-105 active:scale-95">
               {t('contactUs')}
            </button>
         </div>
      </div>
    </InfoPage>
  );
}
