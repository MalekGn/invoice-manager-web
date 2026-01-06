import prisma from '../prisma';
import { User } from '../types';

export async function getUsers(): Promise<User[]> {
    const users = await prisma.user.findMany();
    return users.map(user => ({
        ...user,
        password: user.password ?? undefined,
        name: user.name ?? undefined
    }));
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
    const user = await prisma.user.findUnique({
        where: { email }
    });
    if (!user) return undefined;
    return {
        ...user,
        password: user.password ?? undefined,
        name: user.name ?? undefined
    };
}

export async function addUser(user: User): Promise<void> {
    await prisma.user.create({
        data: {
            ...user
        }
    });
}
