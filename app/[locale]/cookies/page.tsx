import InfoPage from "@/components/InfoPage";
import { useTranslations } from "next-intl";

export default function CookiesPage() {
    const t = useTranslations('cookies');

    return (
        <InfoPage title={t('title')} description={t('description')}>
            <div className="prose max-w-none dark:prose-invert">
                <h2 className="text-2xl font-black mb-4">{t('what.title')}</h2>
                <p className="text-slate-600 dark:text-slate-400 font-medium mb-8">{t('what.desc')}</p>

                <h2 className="text-2xl font-black mb-4">{t('how.title')}</h2>
                <p className="text-slate-600 dark:text-slate-400 font-medium mb-8">{t('how.desc')}</p>

                <h2 className="text-2xl font-black mb-4">{t('types.title')}</h2>
                <ul className="list-disc pl-6 space-y-4 text-slate-600 dark:text-slate-400 font-bold">
                    <li>{t('types.essential')}</li>
                    <li>{t('types.analytics')}</li>
                    <li>{t('types.marketing')}</li>
                </ul>
            </div>
        </InfoPage>
    );
}
