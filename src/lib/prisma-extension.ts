import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { cookies } from 'next/headers';

/**
 * Prisma extension to automatically handle multi-tenancy.
 * Injects `companyId` into queries for isolated models.
 */
export const multiTenantExtension = (prisma: PrismaClient) => {
    return prisma.$extends({
        query: {
            $allModels: {
                async $allOperations({ model, operation, args, query }) {
                    // Models that require strict data isolation
                    const isolatedModels = ['Client', 'Supplier', 'Product', 'Invoice', 'User'];

                    if (!isolatedModels.includes(model)) {
                        return query(args);
                    }

                    const session = await getServerSession(authOptions);
                    if (!session?.user) {
                        return query(args);
                    }

                    const user = session.user as any;
                    const role = user.role;

                    let companyId = user.companyId;

                    if (role === 'GLOBAL_ADMIN') {
                        const cookieStore = await cookies();
                        const activeCompanyId = cookieStore.get('active_company_id')?.value;
                        if (activeCompanyId) {
                            companyId = activeCompanyId;
                        } else {
                            // If Global Admin and NOT impersonating a company, don't filter
                            return query(args);
                        }
                    }

                    if (!companyId) {
                        return query(args);
                    }

                    const a = args as any;

                    // Apply filter based on operation
                    if (['findMany', 'findFirst', 'findUnique', 'count', 'aggregate', 'groupBy'].includes(operation)) {
                        a.where = { ...a.where, companyId };
                    } else if (operation === 'create' || operation === 'createMany') {
                        if (Array.isArray(a.data)) {
                            a.data = a.data.map((item: any) => ({ ...item, companyId }));
                        } else {
                            a.data = { ...a.data, companyId };
                        }
                    } else if (['update', 'updateMany', 'upsert', 'delete', 'deleteMany'].includes(operation)) {
                        a.where = { ...a.where, companyId };
                        if (operation === 'upsert') {
                            a.create = { ...a.create, companyId };
                            a.update = { ...a.update, companyId };
                        }
                    }

                    return query(a);
                }
            }
        }
    });
};
