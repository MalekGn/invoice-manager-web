"use client";

import { useTranslations } from "next-intl";
import { Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useNavbarColor, NavbarColor } from "@/components/NavbarColorContext";

const navbarColors: { id: string, nameKey: string, hex: string }[] = [
    { id: 'orange', nameKey: 'orange', hex: '#f97316' },
    { id: 'charcoal', nameKey: 'charcoalGray', hex: '#1e293b' },
    { id: 'emerald', nameKey: 'emerald', hex: '#059669' },
    { id: 'violet', nameKey: 'violet', hex: '#7c3aed' },
    { id: 'indigo', nameKey: 'indigo', hex: '#4f46e5' },
];

export default function SettingsPage() {
    const t = useTranslations("Settings");
    const { theme, setTheme } = useTheme();
    const { navbarColor, setNavbarColor } = useNavbarColor();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-foreground">{t('title')}</h1>

            <div className="space-y-6">
                <div className="bg-card text-card-foreground border shadow-sm rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-6">{t('appearance')}</h2>

                    <div className="space-y-10">
                        <div>
                            <label className="text-sm font-medium mb-4 block">{t('displayMode')}</label>
                            <div className="grid grid-cols-3 gap-4 max-w-md">
                                <button
                                    onClick={() => setTheme("light")}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-transparent hover:bg-muted'}`}
                                >
                                    <Sun className="w-6 h-6" />
                                    <span className="text-sm font-medium">{t('light')}</span>
                                </button>
                                <button
                                    onClick={() => setTheme("dark")}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-transparent hover:bg-muted'}`}
                                >
                                    <Moon className="w-6 h-6" />
                                    <span className="text-sm font-medium">{t('dark')}</span>
                                </button>
                                <button
                                    onClick={() => setTheme("system")}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${theme === 'system' ? 'border-primary bg-primary/5' : 'border-transparent hover:bg-muted'}`}
                                >
                                    <Monitor className="w-6 h-6" />
                                    <span className="text-sm font-medium">{t('system')}</span>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-sm font-medium mb-4 block">{t('navbarColor')}</label>

                                {/* Row 1: Custom Color (Prominent) */}
                                <div className="mb-8">
                                    <div className={`group relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all max-w-sm ${!navbarColors.some(c => c.hex === navbarColor) ? 'border-primary bg-primary/5 shadow-sm' : 'border-dashed border-muted-foreground/30 hover:bg-muted'}`}>
                                        <div className="relative w-16 h-16 shrink-0">
                                            <input
                                                type="color"
                                                value={navbarColor}
                                                onChange={(e) => setNavbarColor(e.target.value)}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div
                                                style={{ backgroundColor: navbarColor }}
                                                className="w-full h-full rounded-xl shadow-inner border border-black/10 flex items-center justify-center transition-transform group-hover:scale-105"
                                            >
                                                {!navbarColors.some(c => c.hex === navbarColor) && (
                                                    <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold">{t('customColor')}</span>
                                            <span className="text-xs text-muted-foreground font-mono uppercase">{navbarColor}</span>
                                        </div>
                                        {!navbarColors.some(c => c.hex === navbarColor) && (
                                            <div className="absolute top-3 right-3 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-md">
                                                <div className="w-2 h-2 bg-white rounded-full" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Row 2: Predefined Palette */}
                                <div className="space-y-3">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('presets')}</span>
                                    <div className="flex flex-wrap gap-3">
                                        {navbarColors.map((color) => (
                                            <button
                                                key={color.id}
                                                onClick={() => setNavbarColor(color.hex)}
                                                className={`group relative flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all ${navbarColor === color.hex ? 'border-primary bg-primary/5' : 'border-transparent hover:bg-muted'}`}
                                            >
                                                <div
                                                    style={{ backgroundColor: color.hex }}
                                                    className="w-10 h-10 rounded-lg shadow-sm border border-black/5 group-hover:scale-110 transition-transform"
                                                />
                                                <span className="text-[9px] font-bold uppercase tracking-wider text-center max-w-[60px] truncate">{t(color.nameKey)}</span>
                                                {navbarColor === color.hex && (
                                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-md">
                                                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
