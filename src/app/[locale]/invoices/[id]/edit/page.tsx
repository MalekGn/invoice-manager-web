import { getInvoiceById } from "@/lib/services/invoice.service";
import { getClients } from "@/lib/services/client.service";
import { getProducts } from "@/lib/services/product.service";
import InvoiceForm from "@/components/InvoiceForm";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditInvoicePage({
    params
}: {
    params: Promise<{ id: string, locale: string }>
}) {
    const { id, locale } = await params;
    const invoice = await getInvoiceById(id);
    const clients = await getClients();
    const products = await getProducts();
    const t = await getTranslations("Index");

    if (!invoice) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-6">
                <Link
                    href={`/${locale}/invoices/${id}`}
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Invoice Details
                </Link>
            </div>

            <h1 className="text-3xl font-bold mb-8 text-foreground font-geist-sans">Edit Invoice</h1>

            <div className="bg-card text-card-foreground">
                <InvoiceForm clients={clients} products={products} initialData={invoice} />
            </div>
        </div>
    );
}
