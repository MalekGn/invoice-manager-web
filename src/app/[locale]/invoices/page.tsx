import { getInvoices } from "@/lib/services/invoice.service";
import { getClients } from "@/lib/services/client.service";
import { getProducts } from "@/lib/services/product.service";
import InvoiceForm from "@/components/InvoiceForm";
import InvoiceList from "@/components/InvoiceList";
import ImportForm from "@/components/ImportForm";
import { getTranslations } from "next-intl/server";

export default async function InvoicesPage() {
    const invoices = await getInvoices();
    const clients = await getClients();
    const products = await getProducts();
    const t = await getTranslations("Index");

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-8 text-foreground">{t('title')}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h2 className="text-xl font-semibold mb-4">{t('createNewInvoice')}</h2>
                        <InvoiceForm clients={clients} products={products} />
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">{t('allInvoices')}</h2>
                        <InvoiceList invoices={invoices} />
                    </section>
                </div>

                <div className="lg:col-span-1">
                    <section className="bg-card p-6 rounded-lg border sticky top-8">
                        <h2 className="text-xl font-semibold mb-4">{t('importData')}</h2>
                        <ImportForm />
                    </section>
                </div>
            </div>
        </div>
    );
}
