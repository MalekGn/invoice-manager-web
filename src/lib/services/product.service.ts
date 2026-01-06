import prisma from '../prisma';
import { Product } from '../types';

export async function getProducts(): Promise<Product[]> {
    return prisma.product.findMany({
        orderBy: { name: 'asc' }
    }) as any;
}

export async function saveProducts(products: Product[]): Promise<void> {
    for (const product of products) {
        await addProduct(product);
    }
}

export async function addProduct(product: Product): Promise<void> {
    await prisma.product.create({
        data: {
            ...product
        }
    });
}

export async function updateProduct(product: Product): Promise<void> {
    await prisma.product.update({
        where: { id: product.id },
        data: {
            ...product
        }
    });
}

export async function deleteProduct(id: string): Promise<void> {
    await prisma.product.delete({
        where: { id }
    });
}
