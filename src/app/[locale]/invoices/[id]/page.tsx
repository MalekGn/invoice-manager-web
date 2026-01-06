import { getInvoiceById } from "@/lib/services/invoice.service";
import { getClientById } from "@/lib/services/client.service";
import { getSupplierInfo } from "@/lib/services/supplier.service";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Printer, Download, Edit } from "lucide-react";
import DownloadPDFButton from "@/components/DownloadPDFButton";
import PrintButton from "@/components/PrintButton";

export default async function InvoiceDetailsPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
    const { id, locale } = await params;
    const invoice = await getInvoiceById(id);
    const supplier = await getSupplierInfo();
    const tIdx = await getTranslations("Index");
    const tForm = await getTranslations("Form");
    const tInv = await getTranslations("Invoice");

    if (!invoice) {
        notFound();
    }

    const client = invoice.clientId ? await getClientById(invoice.clientId) : undefined;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-6 flex justify-between items-center print:hidden">
                <Link
                    href={`/${locale}/invoices`}
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {tInv('backToInvoices')}
                </Link>
                <div className="flex gap-2">
                    <Link
                        href={`/${locale}/invoices/${id}/edit`}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded hover:bg-muted transition-colors"
                    >
                        <Edit className="w-4 h-4" />
                        {tInv('edit')}
                    </Link>
                    <PrintButton />
                    <DownloadPDFButton />
                </div>
            </div>

            <div className="bg-card text-card-foreground border-2 border-zinc-200 shadow-xl rounded-none p-12 print:shadow-none print:border-none print:p-0">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-10 border-b-4 border-primary pb-8">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-black text-primary uppercase tracking-tighter">{supplier.name}</h2>
                        <div className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                            <p>{supplier.address}</p>
                            <p>{supplier.email}</p>
                            <p className="font-semibold text-foreground pt-1">{tForm('vatNumber')}: {supplier.vatNumber}</p>
                        </div>
                    </div>

                    <div className="text-right space-y-4">
                        <h1 className="text-5xl font-black text-zinc-300 uppercase italic leading-none">{invoice.type === 'purchase' ? tInv('purchaseTitle') : tInv('title')}</h1>

                        <div className="inline-grid grid-cols-2 gap-x-6 gap-y-2 border-2 border-zinc-200 p-4 bg-muted/30">
                            <span className="text-xs font-bold uppercase text-zinc-500 text-left">{tInv('invoiceNo')}</span>
                            <span className="text-sm font-mono font-bold text-right">#{invoice.id.split('-')[0].toUpperCase()}</span>

                            <span className="text-xs font-bold uppercase text-zinc-500 text-left">{tInv('issueDate')}</span>
                            <span className="text-sm font-bold text-right">{formatDate(invoice.date)}</span>

                            {invoice.poNumber && (
                                <>
                                    <span className="text-xs font-bold uppercase text-zinc-500 text-left">{tInv('poNumber')}</span>
                                    <span className="text-sm font-bold text-right">{invoice.poNumber}</span>
                                </>
                            )}

                            {invoice.jobNo && (
                                <>
                                    <span className="text-xs font-bold uppercase text-zinc-500 text-left">{tInv('jobNo')}</span>
                                    <span className="text-sm font-bold text-right">{invoice.jobNo}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Billing & Shipping Section */}
                <div className="grid grid-cols-2 gap-10 mb-10">
                    <div className="border border-zinc-200 rounded-sm">
                        <div className="bg-zinc-100 p-2 border-b border-zinc-200">
                            <h3 className="text-xs font-black uppercase tracking-widest">{tInv('billTo')}</h3>
                        </div>
                        <div className="p-4 space-y-1">
                            <p className="font-black text-lg text-primary">{invoice.customerName}</p>
                            {client && (
                                <div className="text-sm text-zinc-600 leading-snug">
                                    {client.address && <p>{client.address}</p>}
                                    {client.email && <p>{client.email}</p>}
                                    {client.vatNumber && <p className="pt-1 font-bold text-zinc-800">{tForm('vatNumber')}: {client.vatNumber}</p>}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="border border-zinc-200 rounded-sm">
                        <div className="bg-zinc-100 p-2 border-b border-zinc-200">
                            <h3 className="text-xs font-black uppercase tracking-widest">{tInv('shipTo')}</h3>
                        </div>
                        <div className="p-4">
                            {invoice.shipTo ? (
                                <p className="text-sm text-zinc-600 whitespace-pre-line">{invoice.shipTo}</p>
                            ) : (
                                <p className="font-black text-lg text-primary">{invoice.customerName}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Professional Info Bar */}
                {(invoice.terms || invoice.representative || invoice.project) && (
                    <div className="grid grid-cols-3 border-x border-t border-zinc-200 mb-0 bg-muted/10">
                        <div className="p-3 border-r border-zinc-200">
                            <span className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">{tInv('terms')}</span>
                            <span className="text-sm font-bold">Due on Receipt</span>
                        </div>
                        <div className="p-3 border-r border-zinc-200">
                            <span className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">{tInv('representative')}</span>
                            <span className="text-sm font-bold">{invoice.representative || '-'}</span>
                        </div>
                        <div className="p-3">
                            <span className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">{tInv('project')}</span>
                            <span className="text-sm font-bold">{invoice.project || '-'}</span>
                        </div>
                    </div>
                )}

                {/* Line Items Table */}
                <div className="border border-zinc-200 overflow-hidden mb-10">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-primary text-primary-foreground">
                                <th className="p-3 text-left font-black uppercase tracking-wider w-20 border-r border-primary-foreground/20">{tForm('quantity')}</th>
                                <th className="p-3 text-left font-black uppercase tracking-wider border-r border-primary-foreground/20">{tForm('description')}</th>
                                <th className="p-3 text-right font-black uppercase tracking-wider w-32 border-r border-primary-foreground/20">{tForm('price')}</th>
                                <th className="p-3 text-right font-black uppercase tracking-wider w-32">{tInv('total')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200">
                            {invoice.items && invoice.items.length > 0 ? (
                                invoice.items.map((item, idx) => (
                                    <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-zinc-50'}>
                                        <td className="p-4 tabular-nums border-r border-zinc-200">{item.quantity}</td>
                                        <td className="p-4 border-r border-zinc-200">
                                            <div className="font-bold text-zinc-800">{item.description}</div>
                                            {item.vatRate && <div className="text-[10px] text-zinc-400">VAT: {item.vatRate}%</div>}
                                        </td>
                                        <td className="p-4 text-right tabular-nums border-r border-zinc-200">
                                            {new Intl.NumberFormat(locale, { style: 'currency', currency: invoice.currency }).format(item.price)}
                                        </td>
                                        <td className="p-4 text-right font-black tabular-nums">
                                            {new Intl.NumberFormat(locale, { style: 'currency', currency: invoice.currency }).format(item.quantity * item.price)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-10 text-center text-zinc-400 italic font-medium">
                                        {tInv('legacyMessage')}
                                    </td>
                                </tr>
                            )}
                            {/* Fill whitespace for print look */}
                            {[...Array(Math.max(0, 5 - (invoice.items?.length || 0)))].map((_, i) => (
                                <tr key={`empty-${i}`} className="h-10">
                                    <td className="border-r border-zinc-200"></td>
                                    <td className="border-r border-zinc-200"></td>
                                    <td className="border-r border-zinc-200"></td>
                                    <td></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer and Totals */}
                <div className="flex justify-between items-start gap-10">
                    <div className="flex-1 space-y-6">
                        {invoice.notes && (
                            <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-sm">
                                <h4 className="text-[10px] font-black uppercase text-zinc-400 mb-2 tracking-widest">{tInv('notes')}</h4>
                                <p className="text-xs text-zinc-600 leading-relaxed whitespace-pre-line">{invoice.notes}</p>
                            </div>
                        )}
                        <div className="text-center pt-8">
                            <p className="text-lg font-black italic text-zinc-300 uppercase tracking-[0.2em]">{tInv('thanks')}</p>
                        </div>
                    </div>

                    <div className="w-72">
                        <div className="border border-zinc-200 overflow-hidden divide-y divide-zinc-200">
                            <div className="grid grid-cols-2 p-3 bg-zinc-50">
                                <span className="text-xs font-bold uppercase text-zinc-500">{tInv('subtotal')}</span>
                                <span className="text-right font-bold tabular-nums">
                                    {new Intl.NumberFormat(locale, { style: 'currency', currency: invoice.currency }).format(invoice.items?.reduce((sum, i) => sum + (i.quantity * i.price), 0) || invoice.amount)}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 p-3">
                                <span className="text-xs font-bold uppercase text-zinc-500">Sales Tax (VAT)</span>
                                <span className="text-right font-bold tabular-nums">
                                    {new Intl.NumberFormat(locale, { style: 'currency', currency: invoice.currency }).format(invoice.vatAmount || 0)}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 p-4 bg-primary text-primary-foreground">
                                <span className="text-sm font-black uppercase tracking-widest">{tInv('total')}</span>
                                <span className="text-right font-black text-xl tabular-nums">
                                    {new Intl.NumberFormat(locale, { style: 'currency', currency: invoice.currency }).format(invoice.amount)}
                                </span>
                            </div>
                        </div>
                        {invoice.dueDate && (
                            <div className="mt-4 p-3 border-2 border-dashed border-zinc-200 text-center">
                                <span className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">{tInv('dueDate')}</span>
                                <span className="font-black text-red-600 tabular-nums">{formatDate(invoice.dueDate)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Fine Print Footer */}
                <div className="mt-20 pt-8 border-t border-zinc-100 text-[10px] text-zinc-400 uppercase tracking-widest flex justify-between">
                    <p>{supplier.name} • {supplier.address}</p>
                    <p>#{invoice.id.toUpperCase()}</p>
                </div>
            </div>
        </div>
    );
}
