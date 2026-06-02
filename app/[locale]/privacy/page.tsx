import InfoPage from "@/components/InfoPage";
import { useTranslations } from "next-intl";

export default function PrivacyPage() {
    const t = useTranslations('privacy');

    return (
        <InfoPage title={t('title')} description={t('description')}>
            <div className="prose max-w-none dark:prose-invert">
                <h2 className="text-2xl font-black mb-4">{t('collection.title')}</h2>
                <p className="text-slate-600 dark:text-slate-400 font-medium mb-8">{t('collection.desc')}</p>

                <h2 className="text-2xl font-black mb-4">{t('usage.title')}</h2>
                <p className="text-slate-600 dark:text-slate-400 font-medium mb-8">{t('usage.desc')}</p>

                <h2 className="text-2xl font-black mb-4">{t('sharing.title')}</h2>
                <p className="text-slate-600 dark:text-slate-400 font-medium mb-8">{t('sharing.desc')}</p>
            </div>
        </InfoPage>
    );
}
