"use client";

import { createClientAction } from "@/lib/actions";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { User, Mail, MapPin, Building2 } from "lucide-react";

export default function ClientForm() {
    const t = useTranslations("Clients");
    const ref = useRef<HTMLFormElement>(null);

    async function action(formData: FormData) {
        await createClientAction(formData);
        ref.current?.reset();
    }

    return (
        <form ref={ref} action={action} className="bg-card text-card-foreground p-6 rounded-lg border shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-6">{t('add')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {t('name')}
                    </label>
                    <input
                        name="name"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder={t('placeholderName')}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {t('email')}
                    </label>
                    <input
                        name="email"
                        type="email"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder={t('placeholderEmail')}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        {t('vat')}
                    </label>
                    <input
                        name="vatNumber"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder={t('placeholderVat')}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {t('address')}
                    </label>
                    <input
                        name="address"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder={t('placeholderAddress')}
                    />
                </div>
            </div>

            <div className="flex justify-end pt-6 mt-6 border-t">
                <button
                    type="submit"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-2.5 rounded-md font-medium shadow-sm transition-colors"
                >
                    {t('save')}
                </button>
            </div>
        </form>
    );
}
