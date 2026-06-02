import InfoPage from "@/components/InfoPage";
import { useTranslations } from "next-intl";

export default function AccessibilityPage() {
    const t = useTranslations('accessibility');

    return (
        <InfoPage title={t('title')} description={t('description')}>
            <div className="prose max-w-none dark:prose-invert">
                <h2 className="text-2xl font-black mb-4">{t('commitment.title')}</h2>
                <p className="text-slate-600 dark:text-slate-400 font-medium mb-8">{t('commitment.desc')}</p>

                <h2 className="text-2xl font-black mb-4">{t('standards.title')}</h2>
                <p className="text-slate-600 dark:text-slate-400 font-medium mb-8">{t('standards.desc')}</p>

                <div className="mt-12 p-8 bg-blue-50 dark:bg-blue-900/20 rounded-[2.5rem] border-2 border-blue-100 dark:border-blue-800">
                    <p className="text-blue-900 dark:text-blue-100 font-black text-center">{t('feedback')}</p>
                </div>
            </div>
        </InfoPage>
    );
}
