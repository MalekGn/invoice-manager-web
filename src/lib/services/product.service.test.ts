import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as productService from './product.service';
import prisma from '../prisma';

vi.mock('../prisma', () => ({
    default: {
        product: {
            findMany: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        }
    }
}));

describe('Product Service', () => {
    const mockProducts = [
        { id: '1', name: 'Product A', description: 'Desc A', purchasePrice: 10, sellPrice: 20, vatRate: 0.2, stockQuantity: 100, category: 'Cat A' },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should get all products', async () => {
        vi.mocked(prisma.product.findMany).mockResolvedValue(mockProducts as any);
        const products = await productService.getProducts();
        expect(products).toEqual(mockProducts);
    });

    it('should add a new product', async () => {
        const newProduct = { id: '2', name: 'Product B', description: 'Desc B', purchasePrice: 15, sellPrice: 25, vatRate: 0.2, stockQuantity: 50, category: 'Cat B' };
        await productService.addProduct(newProduct);
        expect(prisma.product.create).toHaveBeenCalledWith({ data: newProduct });
    });
});
