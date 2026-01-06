"use client";

import { importInvoicesAction } from "@/lib/actions";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

export default function ImportForm() {
    const t = useTranslations("Index");
    const tImport = useTranslations("Import");
    const ref = useRef<HTMLFormElement>(null);
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(false);

    async function action(formData: FormData) {
        setLoading(true);
        await importInvoicesAction(formData);
        setLoading(false);
        setFileName("");
        ref.current?.reset();
    }

    return (
        <form ref={ref} action={action} className="flex items-center gap-2">
            <label className="cursor-pointer bg-violet-50 text-violet-700 hover:bg-violet-100 dark:bg-violet-900 dark:text-violet-200 px-4 py-2 rounded-full text-sm font-semibold transition-colors">
                {tImport('chooseFile')}
                <input
                    type="file"
                    name="file"
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                    required
                    onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                            setFileName(e.target.files[0].name);
                        } else {
                            setFileName("");
                        }
                    }}
                    title={tImport('hint')}
                />
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400 max-w-[150px] truncate">
                {fileName || tImport('noFileChosen')}
            </span>
            <button
                type="submit"
                disabled={loading || !fileName}
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
            >
                {loading ? tImport('importing') : t('import')}
            </button>
        </form>
    );
}
