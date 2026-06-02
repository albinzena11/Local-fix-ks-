import InfoPage from "@/components/InfoPage";
import { useTranslations } from "next-intl";

export default function TermsPage() {
    const t = useTranslations('terms');

    return (
        <InfoPage title={t('title')} description={t('description')}>
            <div className="prose max-w-none dark:prose-invert">
                <h2 className="text-2xl font-black mb-4">{t('acceptance.title')}</h2>
                <p className="text-slate-600 dark:text-slate-400 font-medium mb-8">{t('acceptance.desc')}</p>

                <h2 className="text-2xl font-black mb-4">{t('userConduct.title')}</h2>
                <p className="text-slate-600 dark:text-slate-400 font-medium mb-8">{t('userConduct.desc')}</p>

                <h2 className="text-2xl font-black mb-4">{t('payments.title')}</h2>
                <p className="text-slate-600 dark:text-slate-400 font-medium mb-8">{t('payments.desc')}</p>

                <h2 className="text-2xl font-black mb-4">{t('termination.title')}</h2>
                <p className="text-slate-600 dark:text-slate-400 font-medium mb-8">{t('termination.desc')}</p>
            </div>
        </InfoPage>
    );
}
