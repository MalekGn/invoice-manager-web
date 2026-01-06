"use client";

import { useTranslations } from "next-intl";
import { Product } from "@/lib/types";
import { createProductAction, updateProductAction } from "@/lib/actions";
import { useState } from "react";

export default function ProductForm({ initialData, onComplete }: { initialData?: Product, onComplete?: () => void }) {
    const t = useTranslations("Products");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        try {
            if (initialData) {
                await updateProductAction(initialData.id, formData);
            } else {
                await createProductAction(formData);
            }
            if (onComplete) onComplete();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-4 mb-8 bg-card p-6 rounded-lg border shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">{t('name')}</label>
                    <input
                        name="name"
                        defaultValue={initialData?.name}
                        required
                        className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">{t('category')}</label>
                    <input
                        name="category"
                        defaultValue={initialData?.category}
                        className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">{t('purchasePrice')}</label>
                    <input
                        name="purchasePrice"
                        type="number"
                        step="0.01"
                        defaultValue={initialData?.purchasePrice}
                        required
                        className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">{t('sellPrice')}</label>
                    <input
                        name="sellPrice"
                        type="number"
                        step="0.01"
                        defaultValue={initialData?.sellPrice}
                        required
                        className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">{t('vatRate')}</label>
                    <input
                        name="vatRate"
                        type="number"
                        step="0.1"
                        defaultValue={initialData?.vatRate}
                        required
                        className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">{t('stock')}</label>
                    <input
                        name="stockQuantity"
                        type="number"
                        defaultValue={initialData?.stockQuantity}
                        required
                        className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">{t('description')}</label>
                <textarea
                    name="description"
                    defaultValue={initialData?.description}
                    className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                />
            </div>
            <div className="flex justify-end gap-2">
                {onComplete && (
                    <button
                        type="button"
                        onClick={onComplete}
                        className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800"
                    >
                        {useTranslations('Dashboard')('cancel')}
                    </button>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:opacity-90 transition disabled:opacity-50"
                >
                    {loading ? useTranslations('Import')('importing') : t('save')}
                </button>
            </div>
        </form>
    );
}
