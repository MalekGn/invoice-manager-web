"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Moon, Sun, FileText, Users, Activity, Settings, LayoutDashboard } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useNavbarColor } from "./NavbarColorContext";

/**
 * Determines if a hex color is light or dark.
 */
function isLightColor(color: string) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
}

/**
 * Darkens a hex color by a percentage.
 */
function darkenColor(color: string, percent: number) {
    const num = parseInt(color.replace("#", ""), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) - amt,
        G = (num >> 8 & 0x00FF) - amt,
        B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R < 255 ? R < 0 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 0 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 0 ? 0 : B : 255)).toString(16).slice(1);
}

/**
 * Main application navigation bar.
 * Includes logo, navigation links (dashboard, invoices, etc.), 
 * language switcher, theme toggle, and authentication actions.
 */
export default function Navbar() {
    const t = useTranslations("Index");
    const { theme, setTheme } = useTheme();
    const pathname = usePathname();
    // Extract current locale from pathname (e.g., /en/dashboard -> en)
    const currentLocale = pathname.split('/')[1] || 'en';
    const { data: session } = useSession();
    const { navbarColor } = useNavbarColor();
    const isLight = isLightColor(navbarColor);
    const borderColor = darkenColor(navbarColor, 10);
    const activeLinkTextColor = isLight ? 'text-gray-900' : 'text-gray-900'; // Active link on white bg
    const iconColor = isLight ? 'text-gray-900' : 'text-white';
    const textColor = isLight ? 'text-gray-900' : 'text-white';

    // Navigation links configuration
    const links = [
        { href: `/${currentLocale}`, label: t('dashboard'), icon: LayoutDashboard },
        { href: `/${currentLocale}/invoices`, label: t('invoices'), icon: FileText },
        { href: `/${currentLocale}/products`, label: t('products'), icon: Activity },
        { href: `/${currentLocale}/clients`, label: t('clients'), icon: Users },
        { href: `/${currentLocale}/settings`, label: t('settings'), icon: Settings },
    ];

    return (
        <nav
            style={{ backgroundColor: navbarColor, borderColor: borderColor }}
            className={`${textColor} border-b sticky top-0 z-50 print:hidden shadow-lg transition-colors`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-10">
                        <Link href={`/${currentLocale}`} className="group flex items-center gap-2">
                            <div
                                style={{ color: navbarColor }}
                                className={`w-8 h-8 bg-white rounded-lg flex items-center justify-center font-black shadow-lg shadow-black/10 group-hover:scale-105 transition-all`}
                            >
                                I
                            </div>
                            <span className={`text-xl font-black tracking-tighter ${textColor} mr-4`}>
                                INVOICELY
                            </span>
                        </Link>
                        {session && (
                            <div className="hidden lg:flex items-center gap-1">
                                {links.map((link) => {
                                    const Icon = link.icon;
                                    const isActive = pathname === link.href || (pathname === '/' + currentLocale && link.href === '/' + currentLocale);
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all ${isActive
                                                ? `bg-white text-gray-900 shadow-md`
                                                : `hover:bg-white/10 ${isLight ? 'text-gray-800' : 'text-white/80'} hover:text-white`
                                                }`}
                                        >
                                            <Icon className="w-3.5 h-3.5" />
                                            {link.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="hidden sm:block">
                            <LanguageSwitcher />
                        </div>
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                            className={`p-2.5 rounded-full ${textColor} transition-all border border-white/20`}
                            aria-label="Toggle theme"
                        >
                            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        </button>

                        {session && (
                            <button
                                onClick={() => signOut()}
                                style={{ color: navbarColor }}
                                className={`text-xs font-bold uppercase tracking-widest bg-white px-5 py-2.5 rounded-full hover:bg-gray-50 transition-all ml-1 shadow-md border border-white hover:border-gray-100`}
                            >
                                {t('signOut')}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
