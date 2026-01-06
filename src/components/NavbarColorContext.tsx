"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

export type NavbarColor = string;

interface NavbarColorContextType {
    navbarColor: NavbarColor;
    setNavbarColor: (color: NavbarColor) => void;
}

const NavbarColorContext = createContext<NavbarColorContextType | undefined>(undefined);

export function NavbarColorProvider({ children }: { children: React.ReactNode }) {
    const [navbarColor, setNavbarColorState] = useState<NavbarColor>('#f97316'); // Default orange-500
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const savedColor = localStorage.getItem('navbarColor');
        if (savedColor) {
            setNavbarColorState(savedColor);
        }
        setMounted(true);
    }, []);

    const setNavbarColor = (color: NavbarColor) => {
        setNavbarColorState(color);
        localStorage.setItem('navbarColor', color);
    };

    return (
        <NavbarColorContext.Provider value={{ navbarColor, setNavbarColor }}>
            {children}
        </NavbarColorContext.Provider>
    );
}

export function useNavbarColor() {
    const context = useContext(NavbarColorContext);
    if (context === undefined) {
        throw new Error('useNavbarColor must be used within a NavbarColorProvider');
    }
    return context;
}
