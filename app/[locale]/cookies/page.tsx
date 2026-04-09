import InfoPage from "@/components/InfoPage";
import { useTranslations } from "next-intl";

export default function CookiesPage() {
    const t = useTranslations('cookiesPage');

    return (
        <InfoPage title={t('title')} lastUpdated="20 Janar 2026">
            <p>{t('intro')}</p>

            <h2>{t('whatAreCookies.title')}</h2>
            <p>{t('whatAreCookies.content')}</p>

            <h2>{t('types.title')}</h2>
            <ul>
                <li><strong>{t('types.necessary')}</strong></li>
                <li><strong>{t('types.analytical')}</strong></li>
                <li><strong>{t('types.marketing')}</strong></li>
            </ul>

            <p>{t('control')}</p>
        </InfoPage>
    );
}
