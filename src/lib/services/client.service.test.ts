import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as clientService from './client.service';
import prisma from '../prisma';

vi.mock('../prisma', () => ({
    default: {
        client: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        }
    }
}));

describe('Client Service', () => {
    const mockClients = [
        { id: '1', name: 'Client A', email: 'a@example.com', address: '123 St', vatNumber: 'VAT1' },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should get all clients', async () => {
        vi.mocked(prisma.client.findMany).mockResolvedValue(mockClients as any);
        const clients = await clientService.getClients();
        expect(clients).toEqual(mockClients);
    });

    it('should add a new client', async () => {
        const newClient = { id: '2', name: 'Client B', email: 'b@example.com', address: '456 St', vatNumber: 'VAT2' };
        await clientService.addClient(newClient);
        expect(prisma.client.create).toHaveBeenCalledWith({ data: newClient });
    });
});
