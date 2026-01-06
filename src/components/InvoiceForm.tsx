"use client";

import { createInvoiceAction, updateInvoiceAction } from "@/lib/actions";
import { useTranslations, useLocale } from "next-intl";
import { useRef, useState, useEffect } from "react";
import { Trash2, Plus } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/navigation";

import { Client, Invoice, Product, InvoiceItem } from "@/lib/types";

export default function InvoiceForm({
    clients = [],
    products = [],
    initialData
}: {
    clients?: Client[],
    products?: Product[],
    initialData?: Invoice
}) {
    const t = useTranslations("Index");
    const tForm = useTranslations("Form");
    const tProducts = useTranslations("Products");
    const tDash = useTranslations("Dashboard");
    const tAuth = useTranslations("Auth");
    const tInv = useTranslations("Invoice");
    const locale = useLocale();
    const ref = useRef<HTMLFormElement>(null);
    const router = useRouter();

    const [selectedClientId, setSelectedClientId] = useState<string>(initialData?.clientId || "");
    const [customerName, setCustomerName] = useState<string>(initialData?.customerName || "");
    const [invoiceType, setInvoiceType] = useState<'sale' | 'purchase'>(initialData?.type || 'sale');
    const [date, setDate] = useState<string>(initialData?.date ? new Date(initialData.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
    const [dueDate, setDueDate] = useState<string>(initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
    const [status, setStatus] = useState<string>(initialData?.status || "draft");
    const [currency, setCurrency] = useState(initialData?.currency || "USD");

    const [items, setItems] = useState<Array<InvoiceItem>>(
        initialData?.items && initialData.items.length > 0
            ? initialData.items
            : [{ id: uuidv4(), description: '', quantity: 1, price: 0, vatRate: 0 }]
    );

    const isEdit = !!initialData;

    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const totalVAT = items.reduce((sum, item) => sum + (item.quantity * item.price * (item.vatRate || 0) / 100), 0);
    const total = subtotal + totalVAT;

    const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const clientId = e.target.value;
        setSelectedClientId(clientId);
        const client = clients.find(c => c.id === clientId);
        if (client) {
            setCustomerName(client.name);
        }
    };

    const handleProductSelect = (itemId: string, productId: string) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            setItems(items.map(item => {
                if (item.id === itemId) {
                    return {
                        ...item,
                        description: product.name,
                        price: product.sellPrice,
                        vatRate: product.vatRate
                    };
                }
                return item;
            }));
        }
    };

    async function action(formData: FormData) {
        formData.set('items', JSON.stringify(items));
        formData.set('amount', total.toString());
        formData.set('vatAmount', totalVAT.toString());
        formData.set('currency', currency);
        formData.set('type', invoiceType);

        if (selectedClientId && invoiceType === 'sale') {
            formData.set('clientId', selectedClientId);
        }
        formData.set('customerName', customerName);

        // New fields
        formData.set('poNumber', (formData.get('poNumber') as string) || '');
        formData.set('jobNo', (formData.get('jobNo') as string) || '');
        formData.set('representative', (formData.get('representative') as string) || '');
        formData.set('project', (formData.get('project') as string) || '');
        formData.set('shipTo', (formData.get('shipTo') as string) || '');
        formData.set('notes', (formData.get('notes') as string) || '');
        formData.set('terms', (formData.get('terms') as string) || '');

        if (isEdit) {
            await updateInvoiceAction(initialData!.id, formData);
            router.push(`/invoices/${initialData!.id}`);
        } else {
            await createInvoiceAction(formData);
            ref.current?.reset();
            setItems([{ id: uuidv4(), description: '', quantity: 1, price: 0, vatRate: 0 }]);
            setSelectedClientId("");
            setCustomerName("");
            setInvoiceType('sale');
        }
    }

    const addItem = () => {
        setItems([...items, { id: uuidv4(), description: '', quantity: 1, price: 0, vatRate: 0 }]);
    };

    const removeItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter(i => i.id !== id));
        }
    };

    const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
        setItems(items.map(item => {
            if (item.id === id) {
                return { ...item, [field]: value };
            }
            return item;
        }));
    };

    return (
        <form ref={ref} action={action} className="bg-card text-card-foreground p-6 rounded-lg border shadow-sm mb-8 space-y-6">
            <div className="flex items-center gap-4 border-b pb-4">
                <div className="flex bg-muted p-1 rounded-md">
                    <button
                        type="button"
                        onClick={() => setInvoiceType('sale')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-sm transition-colors ${invoiceType === 'sale' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        {tAuth('sale')}
                    </button>
                    <button
                        type="button"
                        onClick={() => setInvoiceType('purchase')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-sm transition-colors ${invoiceType === 'purchase' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        {tAuth('purchase')}
                    </button>
                </div>
                <div className="h-4 w-px bg-border mx-2" />
                <span className="text-xs text-muted-foreground italic">
                    {invoiceType === 'sale' ? tForm('saleDesc') : tForm('purchaseDesc')}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        {invoiceType === 'sale' ? tForm('customerNamePlaceholder') : tAuth('supplier')}
                    </label>
                    <div className="flex gap-2">
                        {clients.length > 0 && invoiceType === 'sale' && (
                            <select
                                value={selectedClientId}
                                onChange={handleClientChange}
                                className="flex h-10 w-1/3 rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="">{tForm('selectClient')}</option>
                                {clients.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        )}
                        <input
                            name="customerName"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            required={!selectedClientId || invoiceType === 'purchase'}
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder={invoiceType === 'sale' ? "Customer Name" : "Supplier Name"}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">{tForm('date')}</label>
                        <input
                            name="date"
                            type="date"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">{tForm('status')}</label>
                        <select
                            name="status"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="draft">{tForm('draft')}</option>
                            <option value="pending">{tForm('pending')}</option>
                            <option value="paid">{tForm('paid')}</option>
                        </select>
                    </div>
                </div>

                {/* Reference Details */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 border-t">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">{tInv('poNumber')}</label>
                        <input
                            name="poNumber"
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                            defaultValue={initialData?.poNumber}
                            placeholder="PO-123"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">{tInv('jobNo')}</label>
                        <input
                            name="jobNo"
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                            defaultValue={initialData?.jobNo}
                            placeholder="JOB-456"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">{tInv('project')}</label>
                        <input
                            name="project"
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                            defaultValue={initialData?.project}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">{tInv('representative')}</label>
                        <input
                            name="representative"
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                            defaultValue={initialData?.representative}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">{tInv('terms')}</label>
                        <input
                            name="terms"
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                            defaultValue={initialData?.terms}
                            placeholder="e.g. Net 30"
                        />
                    </div>
                </div>

                {/* Ship To & Notes */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">{tInv('shipTo')}</label>
                        <textarea
                            name="shipTo"
                            rows={2}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                            defaultValue={initialData?.shipTo}
                            placeholder="Shipping address if different"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">{tInv('notes')}</label>
                        <textarea
                            name="notes"
                            rows={2}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                            defaultValue={initialData?.notes}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{tForm('items')}</h3>
                    <select
                        name="currency"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm bg-muted"
                    >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="JPY">JPY</option>
                        <option value="CAD">CAD</option>
                        <option value="AUD">AUD</option>
                        <option value="AED">AED</option>
                    </select>
                </div>

                <div className="border rounded-md overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-muted">
                            <tr className="text-left">
                                <th className="p-3">{tForm('description')}</th>
                                <th className="p-3 w-24">{tForm('quantity')}</th>
                                <th className="p-3 w-32">{tForm('price')}</th>
                                <th className="p-3 w-24">{tProducts('vat')}</th>
                                <th className="p-3 w-24 text-right">{tDash('totalAmount')}</th>
                                <th className="p-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {items.map((item) => (
                                <tr key={item.id} className="group hover:bg-muted/50">
                                    <td className="p-2 space-y-2">
                                        {products.length > 0 && (
                                            <select
                                                onChange={(e) => handleProductSelect(item.id, e.target.value)}
                                                className="w-full text-xs font-mono bg-transparent border-b border-muted hover:border-primary transition p-1"
                                                defaultValue=""
                                            >
                                                <option value="" disabled>{tForm('useProduct')}</option>
                                                {products.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name} (${p.sellPrice})</option>
                                                ))}
                                            </select>
                                        )}
                                        <input
                                            value={item.description}
                                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                            className="w-full bg-transparent border-none focus:outline-none placeholder:text-muted-foreground/50"
                                            placeholder={tForm('itemDescriptionPlaceholder')}
                                            required
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                            className="w-full bg-transparent border-none focus:outline-none"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={item.price}
                                            onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                                            className="w-full bg-transparent border-none focus:outline-none"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <div className="flex items-center gap-1">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="0.1"
                                                value={item.vatRate}
                                                onChange={(e) => updateItem(item.id, 'vatRate', parseFloat(e.target.value) || 0)}
                                                className="w-12 bg-transparent border-none focus:outline-none text-right"
                                            />
                                            <span className="text-muted-foreground">%</span>
                                        </div>
                                    </td>
                                    <td className="p-2 text-right font-mono text-muted-foreground">
                                        {new Intl.NumberFormat(locale, { style: 'currency', currency }).format(item.quantity * item.price * (1 + (item.vatRate || 0) / 100))}
                                    </td>
                                    <td className="p-2 text-center">
                                        <button
                                            type="button"
                                            onClick={() => removeItem(item.id)}
                                            className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                            disabled={items.length === 1}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-muted/50 font-medium space-y-1">
                            <tr>
                                <td colSpan={4} className="p-2 text-right text-muted-foreground">{tDash('subtotal')}</td>
                                <td className="p-2 text-right font-mono">
                                    {new Intl.NumberFormat(locale, { style: 'currency', currency }).format(subtotal)}
                                </td>
                                <td></td>
                            </tr>
                            <tr>
                                <td colSpan={4} className="p-2 text-right text-muted-foreground">{tProducts('vat')}</td>
                                <td className="p-2 text-right font-mono">
                                    {new Intl.NumberFormat(locale, { style: 'currency', currency }).format(totalVAT)}
                                </td>
                                <td></td>
                            </tr>
                            <tr className="bg-primary/5">
                                <td colSpan={4} className="p-3 text-right font-bold text-lg">{tDash('totalAmount')}</td>
                                <td className="p-3 text-right font-bold text-lg text-primary">
                                    {new Intl.NumberFormat(locale, { style: 'currency', currency }).format(total)}
                                </td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                    <Plus className="w-4 h-4" />
                    {tForm('addItem')}
                </button>
            </div>

            <div className="flex justify-end pt-4 border-t gap-4">
                {isEdit && (
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-8 py-2.5 rounded-md font-medium border hover:bg-muted transition-colors"
                    >
                        {tDash('cancel')}
                    </button>
                )}
                <button
                    type="submit"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-2.5 rounded-md font-medium shadow-sm transition-colors"
                >
                    {isEdit ? tForm('updateInvoice') : t('createInvoice')}
                </button>
            </div>
        </form>
    );
}
