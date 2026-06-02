import { useTranslations } from 'next-intl';
import InfoPage from '@/frontend/components/InfoPage';

export default function HowItWorksPage() {
  const t = useTranslations('howItWorksPage');
  
  return (
    <InfoPage 
      title={t('title')} 
      description={t('description')}
    >
      <div className="prose max-w-none dark:prose-invert">
        <h2 className="text-2xl font-bold mt-8 mb-4">{t('forClients.title')}</h2>
        <p className="text-gray-600 mb-6">{t('forClients.desc')}</p>

        <h2 className="text-2xl font-bold mt-8 mb-4">{t('forProviders.title')}</h2>
        <p className="text-gray-600 mb-6">{t('forProviders.desc')}</p>
      </div>
    </InfoPage>
  );
}
