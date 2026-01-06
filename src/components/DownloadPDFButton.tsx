"use client";

import { Download } from "lucide-react";
import { useTranslations } from "next-intl";

export default function DownloadPDFButton() {
    const t = useTranslations("Invoice");
    const handleDownload = () => {
        window.print();
    };

    return (
        <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
        >
            <Download className="w-4 h-4" />
            {t('downloadPdf')}
        </button>
    );
}
