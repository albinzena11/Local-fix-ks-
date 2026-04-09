import InfoPage from "@/components/InfoPage";
import { useTranslations } from "next-intl";

export default function FAQPage() {
    const t = useTranslations('faqPage');
    const faqs = [
        {
            q: t('q1'),
            a: t('a1')
        },
        {
            q: t('q2'),
            a: t('a2')
        },
        {
            q: t('q3'),
            a: t('a3')
        },
        {
            q: t('q4'),
            a: t('a4')
        }
    ];

    return (
        <InfoPage title={t('title')} description={t('description')}>
            <div className="space-y-6 mt-8">
                {faqs.map((faq, i) => (
                    <div key={i} className="bg-white border rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.q}</h3>
                        <p className="text-gray-600">{faq.a}</p>
                    </div>
                ))}
            </div>
        </InfoPage>
    );
}
