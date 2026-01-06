"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { ChangeEvent, useTransition } from "react";

export default function LanguageSwitcher() {
    const t = useTranslations("Index");
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
        const nextLocale = event.target.value;
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    }

    return (
        <label className="flex items-center gap-2">
            <p className="sr-only">{t("language")}</p>
            <select
                defaultValue={locale}
                className="bg-orange-600/50 text-white text-xs font-bold py-2 px-4 rounded-full hover:bg-orange-700/50 focus:outline-none cursor-pointer transition-all border border-white/30"
                onChange={onSelectChange}
                disabled={isPending}
            >
                <option value="en" className="bg-white text-slate-900">English</option>
                <option value="fr" className="bg-white text-slate-900">Français</option>
                <option value="es" className="bg-white text-slate-900">Español</option>
                <option value="ar" className="bg-white text-slate-900 text-right">العربية</option>
            </select>
        </label>
    );
}
