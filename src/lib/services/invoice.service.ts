import prisma from '../prisma';
import { Invoice, InvoiceItem } from '../types';

/**
 * Fetches all invoices from the database, including their line items.
 * @returns A promise that resolves to an array of Invoice objects with items.
 */
export async function getInvoices(): Promise<Invoice[]> {
    const invoices = await prisma.invoice.findMany({
        include: { items: true },
        orderBy: { date: 'desc' }
    });

    return invoices.map(inv => ({
        ...inv,
        date: inv.date.toISOString(),
        dueDate: inv.dueDate?.toISOString(),
        status: inv.status as any,
        type: inv.type as any,
        items: inv.items.map(item => ({
            ...item,
            vatRate: item.vatRate ?? undefined
        }))
    }));
}

/**
 * Fetches a single invoice by its ID, including its line items.
 * @param id The ID of the invoice to fetch.
 * @returns A promise that resolves to the Invoice or undefined if not found.
 */
export async function getInvoiceById(id: string): Promise<Invoice | undefined> {
    const inv = await prisma.invoice.findUnique({
        where: { id },
        include: { items: true }
    });

    if (!inv) return undefined;

    return {
        ...inv,
        date: inv.date.toISOString(),
        dueDate: inv.dueDate?.toISOString(),
        status: inv.status as any,
        type: inv.type as any,
        items: inv.items.map(item => ({
            ...item,
            vatRate: item.vatRate ?? undefined
        }))
    };
}

/**
 * Saves multiple invoices by adding them one by one.
 * @param invoices Array of Invoice objects to be saved.
 */
export async function saveInvoices(invoices: Invoice[]): Promise<void> {
    for (const invoice of invoices) {
        await addInvoice(invoice);
    }
}

/**
 * Creates a new invoice and its associated line items in the database.
 * @param invoice The Invoice object to add.
 */
export async function addInvoice(invoice: Invoice): Promise<void> {
    const { items, ...invoiceData } = invoice;

    await prisma.invoice.create({
        data: {
            ...invoiceData,
            id: invoice.id, // Keep the UUID if provided, or Prisma handles it
            date: new Date(invoice.date),
            dueDate: invoice.dueDate ? new Date(invoice.dueDate) : null,
            items: {
                create: items?.map(item => ({
                    description: item.description,
                    quantity: item.quantity,
                    price: item.price,
                    vatRate: item.vatRate
                }))
            }
        }
    });
}

/**
 * Updates an existing invoice and its line items.
 * Currently uses a simple "delete and recreate" strategy for items.
 * @param invoice The Invoice object with updated information.
 */
export async function updateInvoice(invoice: Invoice): Promise<void> {
    const { items, ...invoiceData } = invoice;

    // Simplest way is to delete and recreate items for updates in this context
    await prisma.$transaction([
        prisma.invoiceItem.deleteMany({ where: { invoiceId: invoice.id } }),
        prisma.invoice.update({
            where: { id: invoice.id },
            data: {
                ...invoiceData,
                date: new Date(invoice.date),
                dueDate: invoice.dueDate ? new Date(invoice.dueDate) : null,
                items: {
                    create: items?.map(item => ({
                        description: item.description,
                        quantity: item.quantity,
                        price: item.price,
                        vatRate: item.vatRate
                    }))
                }
            }
        })
    ]);
}

/**
 * Deletes an invoice and all its associated line items from the database.
 * @param id The ID of the invoice to delete.
 */
export async function deleteInvoice(id: string): Promise<void> {
    await prisma.$transaction([
        prisma.invoiceItem.deleteMany({ where: { invoiceId: id } }),
        prisma.invoice.delete({ where: { id } })
    ]);
}
