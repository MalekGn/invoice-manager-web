'use server';

import { revalidatePath } from 'next/cache';
import { addInvoice, deleteInvoice, updateInvoice } from './services/invoice.service';
import { addClient, updateClient, deleteClient } from './services/client.service';
import { addProduct, updateProduct, deleteProduct } from './services/product.service';
import { addUser, getUserByEmail } from './services/user.service';
import { Invoice, Client, Product, Role } from './types';
import { v4 as uuidv4 } from 'uuid';
import { read, utils } from 'xlsx';
import bcrypt from 'bcryptjs';

import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { basePrisma } from './prisma';
import prisma from './prisma';
import { cookies } from 'next/headers';

/**
 * Switches the active company context for Global Admins.
 * Uses a cookie to store the active company ID.
 */
export async function switchCompanyAction(companyId: string | null) {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'GLOBAL_ADMIN') {
        throw new Error('Unauthorized');
    }

    const cookieStore = await cookies();
    if (companyId) {
        cookieStore.set('active_company_id', companyId, { path: '/' });
    } else {
        cookieStore.delete('active_company_id');
    }

    revalidatePath('/');
}

/**
 * Fetches all companies (Global Admin only).
 */
export async function getCompaniesAction() {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'GLOBAL_ADMIN') {
        throw new Error('Unauthorized');
    }
    return (basePrisma as any).company.findMany({
        orderBy: { name: 'asc' }
    });
}

/**
 * Server Action to import invoices from an uploaded Excel/spreadsheet file.
 */
export async function importInvoicesAction(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error('Unauthorized');
    const companyId = (session.user as any).activeCompanyId || (session.user as any).companyId;

    const file = formData.get('file') as File;
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const workbook = read(buffer);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = utils.sheet_to_json<any>(worksheet);

    for (const row of rows) {
        // ... (existing getValue helper)
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
            currency: 'USD',
            date: dateVal ? new Date(dateVal).toISOString() : new Date().toISOString(),
            dueDate: dueDateVal ? new Date(dueDateVal).toISOString() : new Date().toISOString(),
            status: (statusVal?.toString().toLowerCase() as any) || 'draft',
            items: [],
            companyId
        };
        await addInvoice(invoice);
    }
    revalidatePath('/');
}

/**
 * Server Action to create a new invoice from form data.
 */
export async function createInvoiceAction(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error('Unauthorized');
    const companyId = (session.user as any).activeCompanyId || (session.user as any).companyId;

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
        items,
        companyId
    };

    await addInvoice(invoice);
    revalidatePath('/');
}

/**
 * Server Action to update an existing invoice.
 */
export async function updateInvoiceAction(id: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error('Unauthorized');
    const companyId = (session.user as any).activeCompanyId || (session.user as any).companyId;

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
        items,
        companyId
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

/**
 * Server Action to create a new client.
 */
export async function createClientAction(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error('Unauthorized');
    const companyId = (session.user as any).activeCompanyId || (session.user as any).companyId;

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const address = formData.get('address') as string;
    const vatNumber = formData.get('vatNumber') as string;

    const client: Client = {
        id: uuidv4(),
        name,
        email,
        address,
        vatNumber,
        companyId
    };

    await addClient(client);
    revalidatePath('/clients');
}

export async function updateClientAction(id: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error('Unauthorized');
    const companyId = (session.user as any).activeCompanyId || (session.user as any).companyId;

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const address = formData.get('address') as string;
    const vatNumber = formData.get('vatNumber') as string;

    const client: Client = {
        id,
        name,
        email,
        address,
        vatNumber,
        companyId
    };

    await updateClient(client);
    revalidatePath('/clients');
}

export async function deleteClientAction(id: string) {
    await deleteClient(id);
    revalidatePath('/clients');
}


// Product Actions

/**
 * Server Action to create a new product.
 */
export async function createProductAction(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error('Unauthorized');
    const companyId = (session.user as any).activeCompanyId || (session.user as any).companyId;

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
        category,
        companyId
    };

    await addProduct(product);
    revalidatePath('/products');
    revalidatePath('/');
}

export async function updateProductAction(id: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error('Unauthorized');
    const companyId = (session.user as any).activeCompanyId || (session.user as any).companyId;

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
        category,
        companyId
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



/**
 * Registers a new organization, creating both a Company and a COMPANY_ADMIN user.
 */
export async function registerOrganization(data: {
    companyName: string;
    name: string;
    email: string;
    password: string;
    username: string
}) {
    // 1. Validation
    const existingCompany = await (basePrisma as any).company.findUnique({ where: { name: data.companyName } });
    if (existingCompany) throw new Error('Company name already exists');

    const existingUser = await getUserByEmail(data.email);
    if (existingUser) throw new Error('Email already exists');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const companyId = uuidv4();

    // 2. Atomic creation
    await (basePrisma as any).$transaction(async (tx: any) => {
        await tx.company.create({
            data: {
                id: companyId,
                name: data.companyName,
            }
        });

        await tx.user.create({
            data: {
                id: uuidv4(),
                name: data.name,
                email: data.email,
                username: data.username,
                password: hashedPassword,
                role: 'COMPANY_ADMIN' as any,
                companyId: companyId
            }
        });
    });
}

/**
 * Registers a new user with a hashed password.
 * @param userData Object containing name, email, username, and plain text password.
 */
export async function registerUser(userData: { name: string; email: string; password: string; username: string }) {
    const existingUser = await getUserByEmail(userData.email);
    if (existingUser) {
        throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = {
        id: uuidv4(),
        name: userData.name,
        email: userData.email,
        username: userData.username,
        password: hashedPassword,
        role: 'USER' as any,
    };

    await addUser(user);
}

/**
 * Server Action for Company Admins to create a new user within their company.
 */
export async function createCompanyUserAction(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user || !['COMPANY_ADMIN', 'GLOBAL_ADMIN'].includes((session.user as any).role)) {
        throw new Error('Unauthorized');
    }
    const companyId = (session.user as any).activeCompanyId || (session.user as any).companyId;

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as any || 'USER';

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
        id: uuidv4(),
        name,
        email,
        username,
        password: hashedPassword,
        role,
        companyId
    };

    await addUser(user);
    revalidatePath('/settings/users');
}

/**
 * Server Action for users to update their own profile.
 * Username and role cannot be changed.
 */
export async function updateProfileAction(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error('Unauthorized');

    const userId = (session.user as any).id;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const bio = formData.get('bio') as string || '';
    const avatar = formData.get('avatar') as string || '';
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;

    // Get current user data
    const currentUser = await getUserByEmail((session.user as any).email);
    if (!currentUser) throw new Error('User not found');

    // If changing password, verify current password
    if (newPassword) {
        if (!currentPassword) {
            throw new Error('Current password required to change password');
        }
        const isValid = await bcrypt.compare(currentPassword, currentUser.password || '');
        if (!isValid) {
            throw new Error('Invalid current password');
        }
    }

    // Prepare update data
    const updateData: any = {
        name,
        email,
        bio,
        avatar,
    };

    // Add hashed new password if provided
    if (newPassword) {
        updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // Update user using prisma directly (not through service to avoid RLS issues)
    await prisma.user.update({
        where: { id: userId },
        data: updateData
    });

    revalidatePath('/profile');
}
