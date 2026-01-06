'use server';

import { revalidatePath } from 'next/cache';
import { addInvoice, deleteInvoice, updateInvoice } from './services/invoice.service';
import { Invoice } from './types';
import { v4 as uuidv4 } from 'uuid';
import { read, utils } from 'xlsx';

/**
 * Server Action to import invoices from an uploaded Excel/spreadsheet file.
 * Parses the file, maps columns to invoice fields, and saves them to the database.
 * @param formData FormData containing the 'file' field.
 */
export async function importInvoicesAction(formData: FormData) {
    const file = formData.get('file') as File;
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const workbook = read(buffer);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = utils.sheet_to_json<any>(worksheet);

    for (const row of rows) {
        // Helper to find value by multiple possible keys
        const getValue = (keys: string[]) => {
            for (const key of keys) {
                if (row[key] !== undefined) return row[key];
            }
            return undefined;
        };

        const customerName = getValue(['Customer', 'Customer Name', 'Client', 'Nom du client', 'Cliente', 'Nombre del cliente', 'العميل', 'اسم العميل']) || 'Unknown';
        const amountVal = getValue(['Amount', 'Montant', 'Cantidad', 'المبلغ']);
        const dateVal = getValue(['Date', 'Fecha', 'التاريخ']);
        const dueDateVal = getValue(['Due Date', 'Echéance', 'Fecha de vencimiento', 'تاريخ الاستحقاق']);
        const statusVal = getValue(['Status', 'Statut', 'Estado', 'الحالة']);

        const invoice: Invoice = {
            id: uuidv4(),
            customerName,
            amount: typeof amountVal === 'string' ? parseFloat(amountVal) : (amountVal as number) || 0,
            currency: 'USD', // Default currency for imports for now
            date: dateVal ? new Date(dateVal).toISOString() : new Date().toISOString(),
            dueDate: dueDateVal ? new Date(dueDateVal).toISOString() : new Date().toISOString(),
            status: (statusVal?.toString().toLowerCase() as any) || 'draft',
            items: []
        };
        await addInvoice(invoice);
    }
    revalidatePath('/');
}

/**
 * Server Action to create a new invoice from form data.
 * @param formData FormData containing invoice details and items.
 */
export async function createInvoiceAction(formData: FormData) {
    const customerName = formData.get('customerName') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const currency = (formData.get('currency') as string) || 'USD';
    const date = formData.get('date') as string;
    const dueDate = formData.get('dueDate') as string;
    const status = formData.get('status') as any;

    const itemsJson = formData.get('items') as string;
    const items = itemsJson ? JSON.parse(itemsJson) : [];
    const clientId = formData.get('clientId') as string;

    const invoice: Invoice = {
        id: uuidv4(),
        clientId,
        customerName,
        amount,
        currency,
        date,
        dueDate,
        status,
        items
    };

    await addInvoice(invoice);
    revalidatePath('/');
}

/**
 * Server Action to update an existing invoice.
 * @param id The ID of the invoice to update.
 * @param formData FormData containing updated invoice details.
 */
export async function updateInvoiceAction(id: string, formData: FormData) {
    const customerName = formData.get('customerName') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const currency = (formData.get('currency') as string) || 'USD';
    const date = formData.get('date') as string;
    const dueDate = formData.get('dueDate') as string;
    const status = formData.get('status') as any;

    const itemsJson = formData.get('items') as string;
    const items = itemsJson ? JSON.parse(itemsJson) : [];
    const clientId = formData.get('clientId') as string;

    const invoice: Invoice = {
        id,
        clientId,
        customerName,
        amount,
        currency,
        date,
        dueDate,
        status,
        items
    };

    await updateInvoice(invoice);
    revalidatePath('/invoices');
    revalidatePath(`/invoices/${id}`);
    revalidatePath('/');
}

export async function deleteInvoiceAction(id: string) {
    await deleteInvoice(id);
    revalidatePath('/');
}

// Client Actions

import { addClient, updateClient, deleteClient } from './services/client.service';
import { Client } from './types';

/**
 * Server Action to create a new client.
 * @param formData FormData containing client details.
 */
export async function createClientAction(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const address = formData.get('address') as string;
    const vatNumber = formData.get('vatNumber') as string;

    const client: Client = {
        id: uuidv4(),
        name,
        email,
        address,
        vatNumber
    };

    await addClient(client);
    revalidatePath('/clients');
}

export async function updateClientAction(id: string, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const address = formData.get('address') as string;
    const vatNumber = formData.get('vatNumber') as string;

    const client: Client = {
        id,
        name,
        email,
        address,
        vatNumber
    };

    await updateClient(client);
    revalidatePath('/clients');
}

export async function deleteClientAction(id: string) {
    await deleteClient(id);
    revalidatePath('/clients');
}

// Product Actions

import { addProduct, updateProduct, deleteProduct } from './services/product.service';
import { Product } from './types';

/**
 * Server Action to create a new product.
 * @param formData FormData containing product details.
 */
export async function createProductAction(formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const purchasePrice = parseFloat(formData.get('purchasePrice') as string) || 0;
    const sellPrice = parseFloat(formData.get('sellPrice') as string) || 0;
    const vatRate = parseFloat(formData.get('vatRate') as string) || 0;
    const stockQuantity = parseInt(formData.get('stockQuantity') as string) || 0;
    const category = formData.get('category') as string;

    const product: Product = {
        id: uuidv4(),
        name,
        description,
        purchasePrice,
        sellPrice,
        vatRate,
        stockQuantity,
        category
    };

    await addProduct(product);
    revalidatePath('/products');
    revalidatePath('/');
}

export async function updateProductAction(id: string, formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const purchasePrice = parseFloat(formData.get('purchasePrice') as string) || 0;
    const sellPrice = parseFloat(formData.get('sellPrice') as string) || 0;
    const vatRate = parseFloat(formData.get('vatRate') as string) || 0;
    const stockQuantity = parseInt(formData.get('stockQuantity') as string) || 0;
    const category = formData.get('category') as string;

    const product: Product = {
        id,
        name,
        description,
        purchasePrice,
        sellPrice,
        vatRate,
        stockQuantity,
        category
    };

    await updateProduct(product);
    revalidatePath('/products');
    revalidatePath('/');
}

export async function deleteProductAction(id: string) {
    await deleteProduct(id);
    revalidatePath('/products');
    revalidatePath('/');
}

import bcrypt from 'bcryptjs';
import { addUser, getUserByEmail } from './services/user.service';

/**
 * Registers a new user with a hashed password.
 * @param userData Object containing name, email, and plain text password.
 */
export async function registerUser(userData: { name: string; email: string; password: string }) {
    const existingUser = await getUserByEmail(userData.email);
    if (existingUser) {
        throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = {
        id: uuidv4(),
        name: userData.name,
        email: userData.email,
        password: hashedPassword, // Using 'password' as per types.ts update
    };

    await addUser(user);
}
