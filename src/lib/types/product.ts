export interface Product {
    id: string;
    name: string;
    description?: string;
    purchasePrice: number;
    sellPrice: number;
    vatRate: number;
    stockQuantity: number;
    category?: string;
    companyId: string;
}
