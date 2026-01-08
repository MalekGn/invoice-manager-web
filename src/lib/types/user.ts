export type Role = 'GLOBAL_ADMIN' | 'COMPANY_ADMIN' | 'USER';

export interface User {
    id: string;
    email: string;
    username: string;
    password?: string;
    name?: string;
    role: Role;
    companyId?: string;
}
