import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUsers } from "@/lib/services/user.service";
import { createCompanyUserAction } from "@/lib/actions";
import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export default async function UserManagementPage() {
    const session = await getServerSession(authOptions);
    const t = await getTranslations("Auth");

    if (!session?.user || !['COMPANY_ADMIN', 'GLOBAL_ADMIN'].includes((session.user as any).role)) {
        redirect("/");
    }

    const users = await getUsers();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-foreground">User Management</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Manage users within your organization.
                    </p>
                </div>
            </div>

            <div className="mt-8 flex flex-col lg:flex-row gap-8">
                {/* User List */}
                <div className="flex-1 overflow-x-auto ring-1 ring-border rounded-lg shadow sm:rounded-lg bg-card">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Username</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-card">
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{user.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'COMPANY_ADMIN' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Add User Form */}
                <div className="w-full lg:w-80 bg-card p-6 rounded-lg border shadow-sm h-fit">
                    <h2 className="text-lg font-medium text-foreground mb-4">Add New User</h2>
                    <form action={createCompanyUserAction} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground">Name</label>
                            <input name="name" type="text" required className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Full Name" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground">Username</label>
                            <input name="username" type="text" required className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="username" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground">Email</label>
                            <input name="email" type="email" required className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="email@example.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground">Password</label>
                            <input name="password" type="password" required className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="••••••••" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground">Role</label>
                            <select name="role" className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                <option value="USER">Standard User</option>
                                <option value="COMPANY_ADMIN">Company Admin</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90">
                            Create User
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
