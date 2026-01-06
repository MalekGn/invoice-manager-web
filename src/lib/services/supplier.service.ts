import prisma from '../prisma';
import { Supplier } from '../types';

export async function getSupplierInfo(): Promise<Supplier> {
    const supplier = await prisma.supplier.findFirst();

    if (supplier) return supplier;

    // Fallback or default
    return {
        name: "Antigravity Invoicing Solutions",
        id: "REG-2026-001",
        vatNumber: "FR 12 345678901",
        address: "123 Innovation Way, 75001 Paris, France",
        email: "contact@antigravity-dev.com"
    };
}
