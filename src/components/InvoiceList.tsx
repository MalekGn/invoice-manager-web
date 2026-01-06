"use client";

import { Invoice } from "@/lib/types";
import { deleteInvoiceAction } from "@/lib/actions";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

export default function InvoiceList({ invoices }: { invoices: Invoice[] }) {
    const tTable = useTranslations("Table");
    const tForm = useTranslations("Form");
    const locale = useLocale();

    if (invoices.length === 0) {
        return <div className="text-center py-10 text-gray-500">{tTable('noInvoicesFound')}</div>;
    }

    return (
        <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b dark:border-zinc-700 text-gray-600 dark:text-gray-400">
                        <th className="p-3">{tTable('customer')} / {useTranslations('Auth')('supplier')}</th>
                        <th className="p-3">{useTranslations('Auth')('type')}</th>
                        <th className="p-3">{tTable('date')}</th>
                        <th className="p-3">{tTable('amount')}</th>
                        <th className="p-3">{tTable('status')}</th>
                        <th className="p-3">{tTable('action')}</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
                            <td className="p-3 font-medium dark:text-gray-200">
                                <Link href={`/${locale}/invoices/${invoice.id}`} className="hover:underline text-blue-600 dark:text-blue-400">
                                    {invoice.customerName}
                                </Link>
                            </td>
                            <td className="p-3">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase border ${invoice.type === 'purchase' ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800' : 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'}`}>
                                    {invoice.type === 'purchase' ? useTranslations('Auth')('purchase').split(' ')[0] : useTranslations('Auth')('sale').split(' ')[0]}
                                </span>
                            </td>
                            <td className="p-3 text-sm text-gray-500 dark:text-gray-400">
                                {new Date(invoice.date).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-GB')}
                            </td>
                            <td className="p-3 font-mono dark:text-gray-200">
                                {new Intl.NumberFormat(locale, { style: 'currency', currency: invoice.currency || 'USD' }).format(invoice.amount)}
                            </td>
                            <td className="p-3">
                                <span
                                    className={`px-2 py-1 rounded text-xs font-semibold
                    ${invoice.status === "paid" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" :
                                            invoice.status === "pending" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" :
                                                "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}
                                >
                                    {tForm(invoice.status)}
                                </span>
                            </td>
                            <td className="p-3">
                                <Link
                                    href={`/${locale}/invoices/${invoice.id}/edit`}
                                    className="text-blue-600 hover:text-blue-800 text-sm mx-2"
                                >
                                    {tTable('edit')}
                                </Link>
                                <button
                                    onClick={async () => await deleteInvoiceAction(invoice.id)}
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
    );
}
