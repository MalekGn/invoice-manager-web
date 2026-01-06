"use client";

import { Client } from "@/lib/types";
import { deleteClientAction } from "@/lib/actions";
import { useTranslations } from "next-intl";
import { Pencil, Trash2, Mail, MapPin, Building2 } from "lucide-react";
import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function ClientList({ clients }: { clients: Client[] }) {
    const t = useTranslations("Table");
    const tClients = useTranslations("Clients");
    const locale = useLocale();

    if (clients.length === 0) {
        return <div className="text-center py-10 text-muted-foreground">{t('noClientsFound')}</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
                <div key={client.id} className="bg-card text-card-foreground border shadow-sm rounded-lg p-6 relative group">
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            className="p-2 text-muted-foreground hover:text-primary transition-colors"
                            title={t('edit')}
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                        <button
                            onClick={async () => {
                                if (confirm(t('deleteConfirm', { item: tClients('name').toLowerCase() }))) {
                                    await deleteClientAction(client.id);
                                }
                            }}
                            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                            title={t('delete')}
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="mb-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mb-3 uppercase">
                            {client.name.substring(0, 2)}
                        </div>
                        <h3 className="font-semibold text-lg">{client.name}</h3>
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                        {client.email && (
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span>{client.email}</span>
                            </div>
                        )}
                        {client.address && (
                            <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 mt-0.5" />
                                <span>{client.address}</span>
                            </div>
                        )}
                        {client.vatNumber && (
                            <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4" />
                                <span>{client.vatNumber}</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
