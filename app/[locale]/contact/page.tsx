import InfoPage from "@/components/InfoPage";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { useTranslations } from "next-intl";

export default function ContactPage() {
    const t = useTranslations('contactPage');

    return (
        <InfoPage title={t('title')} description={t('description')}>
            <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <h3>{t('form.title')}</h3>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('form.name')}</label>
                            <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('form.email')}</label>
                            <input type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('form.message')}</label>
                            <textarea rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border"></textarea>
                        </div>
                        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                            {t('form.submit')}
                        </button>
                    </form>
                </div>

                <div className="space-y-8">
                    <div>
                        <h3 className="flex items-center text-xl font-bold mb-4">
                            <FiMail className="mr-3 text-blue-600" /> {t('info.email')}
                        </h3>
                        <p className="text-gray-600">info@localfix.com</p>
                        <p className="text-gray-600">support@localfix.com</p>
                    </div>

                    <div>
                        <h3 className="flex items-center text-xl font-bold mb-4">
                            <FiPhone className="mr-3 text-blue-600" /> {t('info.phone')}
                        </h3>
                        <p className="text-gray-600">+355 4X XXX XXX</p>
                        <p className="text-gray-500 text-sm">{t('info.workingHours')}</p>
                    </div>

                    <div>
                        <h3 className="flex items-center text-xl font-bold mb-4">
                            <FiMapPin className="mr-3 text-blue-600" />  {t('info.offices')}
                        </h3>
                        <p className="text-gray-600">
                            {t('info.address')}
                        </p>
                    </div>
                </div>
            </div>
        </InfoPage>
    );
}
