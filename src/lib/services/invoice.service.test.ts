import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as invoiceService from './invoice.service';
import prisma from '../prisma';
import { Invoice } from '../types';

vi.mock('../prisma', () => ({
    default: {
        invoice: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        },
        invoiceItem: {
            deleteMany: vi.fn(),
        },
        $transaction: vi.fn((cb) => cb),
    }
}));

describe('Invoice Service', () => {
    const mockDbInvoices = [
        {
            id: '1',
            customerName: 'Client A',
            amount: 100,
            currency: 'USD',
            date: new Date('2026-01-01'),
            dueDate: new Date('2026-01-15'),
            status: 'paid',
            type: 'sale',
            items: []
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should get all invoices', async () => {
        vi.mocked(prisma.invoice.findMany).mockResolvedValue(mockDbInvoices as any);
        const invoices = await invoiceService.getInvoices();
        expect(invoices[0].id).toBe('1');
        expect(invoices[0].date).toBe(mockDbInvoices[0].date.toISOString());
    });

    it('should get invoice by id', async () => {
        vi.mocked(prisma.invoice.findUnique).mockResolvedValue(mockDbInvoices[0] as any);
        const invoice = await invoiceService.getInvoiceById('1');
        expect(invoice?.id).toBe('1');
    });

    it('should add a new invoice', async () => {
        const newInvoice: Invoice = {
            id: '2',
            customerName: 'Client B',
            amount: 200,
            currency: 'USD',
            date: '2026-01-02',
            dueDate: '2026-01-16',
            status: 'draft',
            items: []
        };

        await invoiceService.addInvoice(newInvoice);

        expect(prisma.invoice.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                id: '2',
                customerName: 'Client B'
            })
        });
    });

    it('should delete an invoice', async () => {
        await invoiceService.deleteInvoice('1');
        expect(prisma.invoice.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
});
