import { getClients } from "@/lib/services/client.service";
import ClientList from "@/components/ClientList";
import ClientForm from "@/components/ClientForm";
import { getTranslations } from "next-intl/server";

export default async function ClientsPage() {
    const clients = await getClients();
    const t = await getTranslations("Index");

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-8 text-foreground">{t('clients')}</h1>

            <ClientForm />

            <div className="bg-card text-card-foreground border shadow-sm rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">{t('yourClients')}</h2>
                <ClientList clients={clients} />
            </div>
        </div>
    );
}
