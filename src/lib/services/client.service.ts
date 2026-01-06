import prisma from '../prisma';
import { Client } from '../types';

/**
 * Fetches all clients from the database, ordered by name ascending.
 * @returns A promise that resolves to an array of Client objects.
 */
export async function getClients(): Promise<Client[]> {
    const clients = await prisma.client.findMany({
        orderBy: { name: 'asc' }
    });
    // Map database fields to application Client type, handling null values
    return clients.map(client => ({
        ...client,
        email: client.email ?? undefined,
        address: client.address ?? undefined,
        vatNumber: client.vatNumber ?? undefined,
    }));
}

/**
 * Saves a list of clients by adding them one by one.
 * @param clients Array of Client objects to be saved.
 */
export async function saveClients(clients: Client[]): Promise<void> {
    for (const client of clients) {
        await addClient(client);
    }
}

/**
 * Fetches a single client by its unique ID.
 * @param id The ID of the client to fetch.
 * @returns A promise that resolves to the Client or undefined if not found.
 */
export async function getClientById(id: string): Promise<Client | undefined> {
    const client = await prisma.client.findUnique({
        where: { id }
    });
    if (!client) return undefined;
    return {
        ...client,
        email: client.email ?? undefined,
        address: client.address ?? undefined,
        vatNumber: client.vatNumber ?? undefined,
    };
}

/**
 * Adds a new client to the database.
 * @param client The Client object to add.
 */
export async function addClient(client: Client): Promise<void> {
    await prisma.client.create({
        data: {
            ...client
        }
    });
}

/**
 * Updates an existing client's information in the database.
 * @param client The Client object with updated information.
 */
export async function updateClient(client: Client): Promise<void> {
    await prisma.client.update({
        where: { id: client.id },
        data: {
            ...client
        }
    });
}

/**
 * Deletes a client from the database by its ID.
 * @param id The ID of the client to delete.
 */
export async function deleteClient(id: string): Promise<void> {
    await prisma.client.delete({
        where: { id }
    });
}
