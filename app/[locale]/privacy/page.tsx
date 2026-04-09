import InfoPage from "@/components/InfoPage";
import { useTranslations } from "next-intl";

export default function PrivacyPage() {
    const t = useTranslations('privacy');

    return (
        <InfoPage title={t('title')} lastUpdated="20 Janar 2026">
            <h2>{t('section1.title')}</h2>
            <p>{t('section1.content')}</p>

            <h2>{t('section2.title')}</h2>
            <p>{t('section2.content')}</p>

            <h2>{t('section3.title')}</h2>
            <p>{t('section3.content')}</p>

            <h2>{t('section4.title')}</h2>
            <p>{t('section4.content')}</p>
        </InfoPage>
    );
}
