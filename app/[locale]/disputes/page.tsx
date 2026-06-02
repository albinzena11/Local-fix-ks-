import InfoPage from "@/components/InfoPage";
import { useTranslations } from "next-intl";

export default function DisputesPage() {
    const t = useTranslations('disputes');

    return (
        <InfoPage title={t('title')} description={t('description')}>
            <div className="prose max-w-none dark:prose-invert">
                <h2 className="text-2xl font-black mb-4">{t('process.title')}</h2>
                <p className="text-slate-600 dark:text-slate-400 font-medium mb-8">{t('process.desc')}</p>

                <h2 className="text-2xl font-black mb-4">{t('mediation.title')}</h2>
                <p className="text-slate-600 dark:text-slate-400 font-medium mb-8">{t('mediation.desc')}</p>
            </div>
        </InfoPage>
    );
}
