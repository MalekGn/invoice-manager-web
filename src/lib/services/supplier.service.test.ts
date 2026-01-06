import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as supplierService from './supplier.service';
import prisma from '../prisma';

vi.mock('../prisma', () => ({
    default: {
        supplier: {
            findFirst: vi.fn(),
        }
    }
}));

describe('Supplier Service', () => {
    const mockSupplier = {
        name: "Test Supplier",
        id: "ID-1",
        vatNumber: "VAT-1",
        address: "Address 1",
        email: "supplier@example.com"
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should get supplier info', async () => {
        vi.mocked(prisma.supplier.findFirst).mockResolvedValue(mockSupplier as any);
        const supplier = await supplierService.getSupplierInfo();
        expect(supplier).toEqual(mockSupplier);
    });

    it('should return default if no supplier in DB', async () => {
        vi.mocked(prisma.supplier.findFirst).mockResolvedValue(null);
        const supplier = await supplierService.getSupplierInfo();
        expect(supplier.name).toBe("Antigravity Invoicing Solutions");
    });
});
