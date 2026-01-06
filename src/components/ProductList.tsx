"use client";

import { Product } from "@/lib/types";
import { deleteProductAction } from "@/lib/actions";
import { useTranslations } from "next-intl";
import { useState } from "react";
import ProductForm from "./ProductForm";

export default function ProductList({ products }: { products: Product[] }) {
    const t = useTranslations("Products");
    const tTable = useTranslations("Table");
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    if (products.length === 0) {
        return <div className="text-center py-10 text-gray-500">{t('noProductsFound')}</div>;
    }

    return (
        <div className="space-y-6">
            {editingProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{t('editProduct')}</h2>
                            <button onClick={() => setEditingProduct(null)} className="text-gray-500 hover:text-gray-700">&times;</button>
                        </div>
                        <ProductForm initialData={editingProduct} onComplete={() => setEditingProduct(null)} />
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b dark:border-zinc-700 text-gray-600 dark:text-gray-400">
                            <th className="p-3">{t('name')}</th>
                            <th className="p-3">{t('category')}</th>
                            <th className="p-3">{t('purchasePrice')}</th>
                            <th className="p-3">{t('sellPrice')}</th>
                            <th className="p-3">{t('stock')}</th>
                            <th className="p-3">{t('vat')}</th>
                            <th className="p-3 text-right">{tTable('action')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id} className="border-b dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
                                <td className="p-3 font-medium dark:text-gray-200">{product.name}</td>
                                <td className="p-3 text-sm text-gray-500 dark:text-gray-400">{product.category || '-'}</td>
                                <td className="p-3 font-mono dark:text-gray-200">${product.purchasePrice.toFixed(2)}</td>
                                <td className="p-3 font-mono dark:text-gray-200">${product.sellPrice.toFixed(2)}</td>
                                <td className="p-3 dark:text-gray-200">
                                    <span className={product.stockQuantity < 10 ? "text-red-500 font-bold" : ""}>
                                        {product.stockQuantity}
                                    </span>
                                </td>
                                <td className="p-3 text-sm text-gray-500 dark:text-gray-400">{product.vatRate}%</td>
                                <td className="p-3 text-right">
                                    <button
                                        onClick={() => setEditingProduct(product)}
                                        className="text-blue-600 hover:text-blue-800 text-sm mx-2"
                                    >
                                        {tTable('edit')}
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (confirm(t('deleteConfirm'))) {
                                                await deleteProductAction(product.id);
                                            }
                                        }}
                                        className="text-red-500 hover:text-red-700 text-sm"
                                    >
                                        {tTable('delete')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
