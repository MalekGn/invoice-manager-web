import { getInvoices } from "@/lib/services/invoice.service";
import { getTranslations } from "next-intl/server";
import { DollarSign, FileText, Users, Activity } from "lucide-react";
import Link from "next/link";
import { Invoice } from "@/lib/types";
import { StatusPieChart, StatusAmountChart, ProductStatsChart, CustomerStatsChart, ProductPopularityChart } from "@/components/Charts";

function Card({ title, value, icon: Icon, description }: { title: string, value: string, icon: any, description: string }) {
  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg border shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="p-2 bg-primary/10 rounded-full text-primary">
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const invoices = await getInvoices();
  const tIdx = await getTranslations("Index");
  const tDash = await getTranslations("Dashboard");
  const tForm = await getTranslations("Form");
  const tTable = await getTranslations("Table");
  const tAuth = await getTranslations("Auth");

  const sales = invoices.filter(i => i.type !== 'purchase');
  const purchases = invoices.filter(i => i.type === 'purchase');

  const totalRevenue = sales
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount, 0);

  const totalExpenses = purchases
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount, 0);

  const pendingRevenue = sales
    .filter(i => i.status === 'pending')
    .reduce((sum, i) => sum + i.amount, 0);

  const totalInvoices = invoices.length;

  // Format currency (assuming generic USD for aggregate, or just number)
  const formatMoney = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const statusLabels = {
    paid: tForm('paid'),
    pending: tForm('pending'),
    draft: tForm('draft')
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-foreground">{tIdx('dashboard')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card
          title={tDash('totalAmount')}
          value={formatMoney(totalRevenue)}
          icon={DollarSign}
          description={tForm('paid') + " (" + tAuth('sale') + ")"}
        />
        <Card
          title={tAuth('purchase')}
          value={formatMoney(totalExpenses)}
          icon={Activity}
          description={tForm('paid')}
        />
        <Card
          title={tDash('pendingAmount')}
          value={formatMoney(pendingRevenue)}
          icon={Activity}
          description={tForm('pending')}
        />
        <Card
          title={tDash('totalInvoices')}
          value={totalInvoices.toString()}
          icon={FileText}
          description={tIdx('invoices')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">{tDash('invoiceStatus')}</h3>
          <StatusPieChart invoices={invoices} labels={statusLabels} />
        </div>
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">{tDash('totalAmount')}</h3>
          <StatusAmountChart invoices={invoices} labels={statusLabels} amountLabel={tTable('amount')} />
        </div>
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">{tDash('topProducts')}</h3>
          <ProductStatsChart invoices={invoices} />
        </div>
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">{tDash('topCustomers')}</h3>
          <CustomerStatsChart invoices={invoices} countLabel={tDash('totalInvoices')} />
        </div>
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">{tDash('productReach')}</h3>
          <ProductPopularityChart invoices={invoices} />
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{tDash('recentInvoices')}</h2>
          <Link href={`/${locale}/invoices`} className="text-sm text-primary hover:underline">
            {tIdx('invoices')}
          </Link>
        </div>
        {invoices.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">{tDash('noInvoices')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3">{tTable('customer')}</th>
                  <th className="px-4 py-3">{tTable('date')}</th>
                  <th className="px-4 py-3">{tTable('amount')}</th>
                  <th className="px-4 py-3">{tTable('status')}</th>
                </tr>
              </thead>
              <tbody>
                {invoices.slice(0, 5).map((invoice) => (
                  <tr key={invoice.id} className="border-b">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{invoice.customerName}</span>
                        <span className={`text-[9px] uppercase font-bold ${invoice.type === 'purchase' ? 'text-purple-500' : 'text-blue-500'}`}>
                          {invoice.type === 'purchase' ? tAuth('purchase') : tAuth('sale')}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{new Date(invoice.date).toLocaleDateString()}</td>
                    <td className={`px-4 py-3 font-mono ${invoice.type === 'purchase' ? 'text-red-600 dark:text-red-400' : ''}`}>
                      {invoice.type === 'purchase' ? '-' : ''}{new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency || 'USD' }).format(invoice.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                        {tForm(invoice.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
