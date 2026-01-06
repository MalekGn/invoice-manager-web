"use client";

import { Printer } from "lucide-react";
import { useTranslations } from "next-intl";

export default function PrintButton() {
    const t = useTranslations("Invoice");
    return (
        <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded hover:bg-muted transition-colors"
        >
            <Printer className="w-4 h-4" />
            {t('print')}
        </button>
    );
}
