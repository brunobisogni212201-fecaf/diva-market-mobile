
'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import KpiCard from '@/components/dashboard/KpiCard';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';

// Types based on the view definition
interface DashboardData {
  gmv_total: number;
  total_orders: number;
  avg_ticket: number;
  sales_history: {
    sale_date: string;
    daily_orders: number;
    daily_revenue: number;
  }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as DashboardData['sales_history'][0]; // Assert type for payload
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg">
        <p className="text-sm font-medium text-gray-900">{new Date(label).toLocaleDateString('pt-BR')}</p>
        <p className="text-sm text-pink-600">
          R$ {payload[0].value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-gray-500">
          {data.daily_orders} pedidos
        </p>
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const supabase = createClient();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch from the view
        const { data: viewData, error } = await supabase
          .from('view_dashboard_admin')
          .select('*')
          .single();

        if (error) {
          console.error('Error fetching dashboard data:', error);
          // Mock data for development if view doesn't exist yet or is empty
          setData({
            gmv_total: 15420.50,
            total_orders: 142,
            avg_ticket: 108.59,
            sales_history: Array.from({ length: 7 }).map((_, i) => ({
              sale_date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
              daily_orders: Math.floor(Math.random() * 10) + 1,
              daily_revenue: Math.floor(Math.random() * 1000) + 100,
            })).reverse()
          });
        } else {
          setData(viewData);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-gray-200 rounded-xl"></div>
          <div className="h-32 bg-gray-200 rounded-xl"></div>
          <div className="h-32 bg-gray-200 rounded-xl"></div>
        </div>
        <div className="h-64 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  if (!data) return null;

  // Sort history for chart (oldest to newest)
  const chartData = [...(data.sales_history || [])].sort((a, b) =>
    new Date(a.sale_date).getTime() - new Date(b.sale_date).getTime()
  );

  return (
    <div className="p-6 space-y-8 pb-24 md:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Visão Geral</h1>
        <p className="text-gray-500 text-sm">Acompanhe o desempenho do Diva Market.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          title="GMV Total"
          value={data.gmv_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          icon={DollarSign}
          trend={{ value: "12%", positive: true, label: "vs mês anterior" }}
        />
        <KpiCard
          title="Total de Pedidos"
          value={data.total_orders.toString()}
          icon={ShoppingBag}
          trend={{ value: "5%", positive: true, label: "vs mês anterior" }}
        />
        <KpiCard
          title="Ticket Médio"
          value={data.avg_ticket.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          icon={TrendingUp}
          trend={{ value: "2%", positive: false, label: "vs mês anterior" }}
        />
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Vendas por Dia</h2>
          {/* Could add date range filter here */}
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis
                dataKey="sale_date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickFormatter={(value) => `R$${value}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#FDF2F8' }} />
              <Bar
                dataKey="daily_revenue"
                fill="#EC4899"
                radius={[4, 4, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
