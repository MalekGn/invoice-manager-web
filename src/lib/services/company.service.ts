import { basePrisma } from '../prisma';
import { Company } from '../types';

export async function getCompanies(): Promise<Company[]> {
    const companies = await (basePrisma as any).company.findMany();
    return companies.map((company: any) => ({
        ...company,
        createdAt: company.createdAt.toISOString()
    }));
}

export async function getCompanyById(id: string): Promise<Company | undefined> {
    const company = await (basePrisma as any).company.findUnique({
        where: { id }
    });
    if (!company) return undefined;
    const c = company as any;
    return {
        ...c,
        createdAt: c.createdAt.toISOString()
    };
}

export async function addCompany(company: { id: string; name: string }): Promise<Company> {
    const created = await (basePrisma as any).company.create({
        data: {
            ...company
        }
    });
    const c = created as any;
    return {
        ...c,
        createdAt: c.createdAt.toISOString()
    };
}
