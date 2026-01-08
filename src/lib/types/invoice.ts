export type InvoiceStatus = 'draft' | 'pending' | 'paid';

export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    price: number;
    vatRate?: number; // Optional VAT rate for the item
}

export interface Invoice {
    id: string;
    customerName: string;
    amount: number;
    vatAmount?: number; // Total VAT for the invoice
    currency: string;
    date: string;
    dueDate?: string;
    status: InvoiceStatus;
    type?: 'sale' | 'purchase'; // Optional for backward compatibility, defaults to 'sale'
    items?: InvoiceItem[];
    clientId?: string;
    companyId: string;
    // New fields for professional layout
    poNumber?: string;
    jobNo?: string;
    representative?: string;
    project?: string;
    shipTo?: string;
    notes?: string;
    terms?: string;
}
