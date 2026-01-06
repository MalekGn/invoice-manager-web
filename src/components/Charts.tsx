"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Invoice } from '@/lib/types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function StatusPieChart({ invoices, labels }: { invoices: Invoice[], labels: Record<string, string> }) {
    const data = [
        { name: labels.paid || 'Paid', value: invoices.filter(i => i.status === 'paid').length },
        { name: labels.pending || 'Pending', value: invoices.filter(i => i.status === 'pending').length },
        { name: labels.draft || 'Draft', value: invoices.filter(i => i.status === 'draft').length },
    ].filter(i => i.value > 0);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}

export function StatusAmountChart({ invoices, labels, amountLabel }: { invoices: Invoice[], labels: Record<string, string>, amountLabel: string }) {
    const data = [
        { name: labels.paid || 'Paid', value: invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.amount, 0) },
        { name: labels.pending || 'Pending', value: invoices.filter(i => i.status === 'pending').reduce((acc, i) => acc + i.amount, 0) },
        { name: labels.draft || 'Draft', value: invoices.filter(i => i.status === 'draft').reduce((acc, i) => acc + i.amount, 0) },
    ];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" name={amountLabel} />
            </BarChart>
        </ResponsiveContainer>
    );
}

export function ProductStatsChart({ invoices }: { invoices: Invoice[] }) {
    // Flatten items and count occurrences
    const productCounts: Record<string, number> = {};
    invoices.forEach(inv => {
        inv.items?.forEach(item => {
            productCounts[item.description] = (productCounts[item.description] || 0) + item.quantity;
        });
    });

    const data = Object.entries(productCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // Top 5

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}

export function CustomerStatsChart({ invoices, countLabel }: { invoices: Invoice[], countLabel: string }) {
    const customerCounts: Record<string, number> = {};
    invoices.forEach(inv => {
        customerCounts[inv.customerName] = (customerCounts[inv.customerName] || 0) + 1;
    });

    const data = Object.entries(customerCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#ffc658" name={countLabel} />
            </BarChart>
        </ResponsiveContainer>
    );
}

export function ProductPopularityChart({ invoices }: { invoices: Invoice[] }) {
    // Products by number of unique customers
    const productCustomers: Record<string, Set<string>> = {};
    invoices.forEach(inv => {
        inv.items?.forEach(item => {
            if (!productCustomers[item.description]) {
                productCustomers[item.description] = new Set();
            }
            productCustomers[item.description].add(inv.customerName);
        });
    });

    const data = Object.entries(productCustomers)
        .map(([name, customers]) => ({ name, value: customers.size }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#82ca9d"
                    dataKey="value"
                    label
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}
