import InfoPage from "@/components/InfoPage";
import { useTranslations } from "next-intl";

export default function AboutPage() {
    const t = useTranslations('about');

    return (
        <InfoPage title={t('title')} description={t('description')}>
            <h2>{t('mission.title')}</h2>
            <p>
                {t('mission.desc')}
            </p>

            <h2>{t('history.title')}</h2>
            <p>
                {t('history.desc')}
            </p>

            <h2>{t('values.title')}</h2>
            <ul>
                <li><strong>{t('values.reliability')}</strong></li>
                <li><strong>{t('values.quality')}</strong></li>
                <li><strong>{t('values.transparency')}</strong></li>
            </ul>
        </InfoPage>
    );
}
