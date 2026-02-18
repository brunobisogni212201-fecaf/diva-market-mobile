
import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import clsx from 'clsx';

interface KpiCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    trend?: {
        value: string;
        positive: boolean; // true for up, false for down
        label: string; // e.g. "vs last month"
    };
    className?: string;
}

export default function KpiCard({ title, value, icon: Icon, trend, className }: KpiCardProps) {
    return (
        <div className={clsx("bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all hover:shadow-md", className)}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
                </div>
                <div className="p-2 bg-pink-50 rounded-lg">
                    <Icon className="w-5 h-5 text-pink-500" />
                </div>
            </div>

            <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-gray-900">{value}</span>

                {trend && (
                    <div className={clsx(
                        "flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full",
                        trend.positive ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"
                    )}>
                        {trend.positive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {trend.value}
                    </div>
                )}
            </div>
            {trend && (
                <p className="mt-2 text-xs text-gray-400">
                    <span className={trend.positive ? "text-green-600" : "text-red-600"}>
                        {trend.positive ? '+' : ''}{trend.value}
                    </span>{' '}
                    {trend.label}
                </p>
            )}
        </div>
    );
}
