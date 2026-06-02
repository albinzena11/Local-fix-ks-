import InfoPage from "@/components/InfoPage";
import { useTranslations } from "next-intl";

export default function LicensesPage() {
    const t = useTranslations('licenses');

    return (
        <InfoPage title={t('title')} description={t('description')}>
            <div className="prose max-w-none dark:prose-invert">
                <h2 className="text-2xl font-black mb-4">{t('software.title')}</h2>
                <p className="text-slate-600 dark:text-slate-400 font-medium mb-8">{t('software.desc')}</p>

                <h2 className="text-2xl font-black mb-4">{t('professional.title')}</h2>
                <p className="text-slate-600 dark:text-slate-400 font-medium mb-8">{t('professional.desc')}</p>
            </div>
        </InfoPage>
    );
}
