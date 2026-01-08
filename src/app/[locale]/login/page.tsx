"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { registerUser, registerOrganization } from "@/lib/actions";

export default function AuthPage() {
    const router = useRouter();
    const t = useTranslations("Auth");

    const [isLogin, setIsLogin] = useState(true);
    const [isOrg, setIsOrg] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form States
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [username, setUsername] = useState("");

    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError(t('invalidCredentials'));
            setLoading(false);
        } else {
            router.refresh();
            router.push("/");
            // Keep loading true while redirecting
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (isOrg) {
                await registerOrganization({ companyName, name, email, password, username });
            } else {
                await registerUser({ name, email, password, username });
            }
            // On success, switch to login or auto-login
            // For simplicity, switch to Login view and pre-fill
            setIsLogin(true);
            setError("");
            alert(t('accountCreated'));
        } catch (err: any) {
            setError(err.message || t('registrationFailed'));
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError("");
        setIsOrg(false);
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl border shadow-sm">
                <div>
                    <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">
                        {isLogin ? t('signInTitle') : (isOrg ? t('createOrganization') : t('signUpTitle'))}
                    </h2>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                        {isLogin ? t('loginWelcome') : (isOrg ? t('organizationWelcome') : t('signUpWelcome'))}
                    </p>
                </div>

                {!isLogin && (
                    <div className="flex justify-center space-x-2 p-1 bg-muted rounded-lg">
                        <button
                            onClick={() => setIsOrg(false)}
                            className={`flex-1 py-1 text-xs font-medium rounded ${!isOrg ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
                        >
                            {t('individual')}
                        </button>
                        <button
                            onClick={() => setIsOrg(true)}
                            className={`flex-1 py-1 text-xs font-medium rounded ${isOrg ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
                        >
                            {t('organization')}
                        </button>
                    </div>
                )}

                <form className="mt-4 space-y-4" onSubmit={isLogin ? handleLogin : handleRegister}>
                    <div className="space-y-4">
                        {!isLogin && isOrg && (
                            <div>
                                <label htmlFor="companyName" className="block text-sm font-medium text-foreground">
                                    {t('companyName')}
                                </label>
                                <input
                                    id="companyName"
                                    name="companyName"
                                    type="text"
                                    required={isOrg}
                                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    placeholder="Acme Corp"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                />
                            </div>
                        )}

                        {!isLogin && (
                            <>
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-foreground">
                                        {t('fullName')}
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required={!isLogin}
                                        className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-foreground">
                                        {t('username')}
                                    </label>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required={!isLogin}
                                        className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        placeholder="johndoe"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground">
                                {t('emailAddress')}
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground">
                                {t('password')}
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? t('loading') : (isLogin ? t('signIn') : t('signUp'))}
                    </button>
                </form>

                <div className="text-center">
                    <button
                        onClick={toggleMode}
                        className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                        {isLogin ? t('dontHaveAccount') : t('alreadyHaveAccount')}
                    </button>
                </div>
            </div>
        </div>
    );
}
