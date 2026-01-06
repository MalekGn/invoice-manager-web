import { getProducts } from "@/lib/services/product.service";
import ProductList from "@/components/ProductList";
import ProductForm from "@/components/ProductForm";
import { getTranslations } from "next-intl/server";

export default async function ProductsPage() {
    const products = await getProducts();
    const t = await getTranslations("Products");

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-8 text-foreground">{t('title')}</h1>

            <div className="mb-12">
                <h2 className="text-xl font-semibold mb-4">{t('addProduct')}</h2>
                <ProductForm />
            </div>

            <div className="bg-card text-card-foreground border shadow-sm rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Inventory</h2>
                <ProductList products={products} />
            </div>
        </div>
    );
}
