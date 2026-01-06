import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as userService from './user.service';
import prisma from '../prisma';

vi.mock('../prisma', () => ({
    default: {
        user: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
            create: vi.fn(),
        }
    }
}));

describe('User Service', () => {
    const mockUsers = [
        { id: '1', name: 'User A', email: 'a@example.com', password: 'hashed_password' },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should get all users', async () => {
        vi.mocked(prisma.user.findMany).mockResolvedValue(mockUsers as any);
        const users = await userService.getUsers();
        expect(users).toEqual(mockUsers);
    });

    it('should get user by email', async () => {
        vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUsers[0] as any);
        const user = await userService.getUserByEmail('a@example.com');
        expect(user).toEqual(mockUsers[0]);
    });
});
