import { PrismaClient } from '@prisma/client';
import { multiTenantExtension } from './prisma-extension';

const prismaClientSingleton = () => {
    return new PrismaClient();
};

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const basePrisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = basePrisma;

const prisma = multiTenantExtension(basePrisma);

export default prisma;
export { basePrisma };
