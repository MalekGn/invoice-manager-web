import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { updateProfileAction } from "@/lib/actions";
import { getUserByEmail } from "@/lib/services/user.service";
import { getTranslations } from "next-intl/server";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    const t = await getTranslations("Auth");

    if (!session?.user) {
        redirect("/login");
    }

    const user = await getUserByEmail((session.user as any).email);
    if (!user) {
        redirect("/login");
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-card rounded-lg border shadow-sm p-6">
                <h1 className="text-2xl font-semibold text-foreground mb-6">Profile Settings</h1>

                <form action={updateProfileAction} className="space-y-6">
                    {/* Read-only fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-border">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">
                                Username (Read-only)
                            </label>
                            <div className="px-3 py-2 bg-muted rounded-md text-sm text-foreground">
                                {user.username}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">
                                Role (Read-only)
                            </label>
                            <div className="px-3 py-2 bg-muted rounded-md text-sm text-foreground">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'GLOBAL_ADMIN' ? 'bg-purple-100 text-purple-800' :
                                        user.role === 'COMPANY_ADMIN' ? 'bg-blue-100 text-blue-800' :
                                            'bg-green-100 text-green-800'
                                    }`}>
                                    {user.role}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Editable fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                defaultValue={user.name || ''}
                                className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={user.email}
                                className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-foreground mb-1">
                            Bio
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            rows={3}
                            defaultValue={user.bio || ''}
                            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Tell us about yourself..."
                        />
                    </div>

                    <div>
                        <label htmlFor="avatar" className="block text-sm font-medium text-foreground mb-1">
                            Avatar URL
                        </label>
                        <input
                            id="avatar"
                            name="avatar"
                            type="url"
                            defaultValue={user.avatar || ''}
                            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="https://example.com/avatar.jpg"
                        />
                    </div>

                    {/* Password change section */}
                    <div className="pt-6 border-t border-border">
                        <h2 className="text-lg font-medium text-foreground mb-4">Change Password</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="currentPassword" className="block text-sm font-medium text-foreground mb-1">
                                    Current Password
                                </label>
                                <input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type="password"
                                    className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="••••••••"
                                />
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Required if changing password
                                </p>
                            </div>

                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-foreground mb-1">
                                    New Password
                                </label>
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="••••••••"
                                />
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Leave blank to keep current password
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            Update Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
