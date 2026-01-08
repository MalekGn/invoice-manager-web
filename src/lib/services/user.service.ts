import prisma from '../prisma';
import { User, Role } from '../types';

export async function getUsers(): Promise<User[]> {
    const users = await prisma.user.findMany();
    return users.map((user: any) => ({
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name ?? undefined,
        password: user.password ?? undefined,
        role: user.role as Role,
        companyId: user.companyId ?? undefined
    }));
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
    const user = await prisma.user.findUnique({
        where: { email }
    });
    if (!user) return undefined;
    const u = user as any;
    return {
        id: u.id,
        email: u.email,
        username: u.username,
        name: u.name ?? undefined,
        password: u.password ?? undefined,
        role: u.role as Role,
        companyId: u.companyId ?? undefined
    };
}

export async function addUser(user: User): Promise<void> {
    await prisma.user.create({
        data: {
            id: user.id,
            email: user.email,
            username: user.username,
            password: user.password,
            name: user.name,
            role: user.role,
            companyId: user.companyId
        } as any
    });
}
