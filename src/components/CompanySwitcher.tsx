"use client";

import { useState, useEffect } from "react";
import { getCompaniesAction, switchCompanyAction } from "@/lib/actions";

export default function CompanySwitcher() {
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentCompanyId, setCurrentCompanyId] = useState("");

    useEffect(() => {
        getCompaniesAction().then(setCompanies).catch(console.error);

        // Simple way to get cookie on client
        const cookies = document.cookie.split(';');
        const activeCookie = cookies.find(c => c.trim().startsWith('active_company_id='));
        if (activeCookie) {
            setCurrentCompanyId(activeCookie.split('=')[1]);
        }
    }, []);

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLoading(true);
        const val = e.target.value;
        await switchCompanyAction(val || null);
        setCurrentCompanyId(val);
        setLoading(false);
        window.location.reload();
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-tighter opacity-70">Context:</span>
            <select
                value={currentCompanyId}
                onChange={handleChange}
                disabled={loading}
                className="text-[10px] font-bold bg-white/10 border border-white/20 text-white rounded-md px-2 py-1 outline-none hover:bg-white/20 transition-all cursor-pointer"
            >
                <option value="" className="text-gray-900">Global (All)</option>
                {companies.map(c => (
                    <option key={c.id} value={c.id} className="text-gray-900">{c.name}</option>
                ))}
            </select>
        </div>
    );
}
