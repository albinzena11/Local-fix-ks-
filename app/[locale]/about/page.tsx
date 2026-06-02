import InfoPage from "@/components/InfoPage";
import { useTranslations } from "next-intl";

export default function AboutPage() {
    const t = useTranslations('about');

    return (
        <InfoPage title={t('title')} description={t('description')}>
            <div className="prose max-w-none dark:prose-invert">
                <h2 className="text-2xl font-black mb-4">{t('mission.title')}</h2>
                <p className="text-slate-600 dark:text-slate-400 font-medium mb-8">
                    {t('mission.desc')}
                </p>

                <h2 className="text-2xl font-black mb-4">{t('vision.title')}</h2>
                <p className="text-slate-600 dark:text-slate-400 font-medium mb-8">
                    {t('vision.desc')}
                </p>

                <div className="mt-12 p-8 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 text-center">{t('team')}</h3>
                </div>
            </div>
        </InfoPage>
    );
}
