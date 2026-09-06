import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Clock,
  DollarSign,
  Layers,
  Printer,
  TrendingUp,
  Users,
} from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const { orders, formatPrice } = useApp();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="space-y-2 border-b border-brand-border pb-6">
        <span className="text-[10px] font-mono uppercase tracking-widest text-brand-red font-bold">
          Business Intelligence
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display uppercase tracking-tight text-white">
          Additive Studio Analytics & Metrics
        </h1>
        <p className="text-xs text-brand-textDim">
          Financial performance, filament extrusion metrics, customer cohort activity, and printer fleet efficiency.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-brand-card border border-brand-border space-y-1">
          <span className="text-[10px] font-mono text-brand-textDim uppercase">Gross Revenue (MTD)</span>
          <div className="text-2xl font-bold font-mono text-brand-redBright">
            {formatPrice(totalRevenue)}
          </div>
          <span className="text-[10px] font-mono text-emerald-400">▲ 24% vs Last Month</span>
        </div>

        <div className="p-5 rounded-2xl bg-brand-card border border-brand-border space-y-1">
          <span className="text-[10px] font-mono text-brand-textDim uppercase">Print Machine Runtime</span>
          <div className="text-2xl font-bold font-mono text-white">342.5 hrs</div>
          <span className="text-[10px] font-mono text-brand-textDim">98.2% Fleet Uptime</span>
        </div>

        <div className="p-5 rounded-2xl bg-brand-card border border-brand-border space-y-1">
          <span className="text-[10px] font-mono text-brand-textDim uppercase">Thermopolymer Extruded</span>
          <div className="text-2xl font-bold font-mono text-white">14.8 kg</div>
          <span className="text-[10px] font-mono text-brand-textDim">PLA, PETG, ABS, TPU</span>
        </div>

        <div className="p-5 rounded-2xl bg-brand-card border border-brand-border space-y-1">
          <span className="text-[10px] font-mono text-brand-textDim uppercase">First-Time QC Pass</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">99.4%</div>
          <span className="text-[10px] font-mono text-brand-textDim">Tolerance ±0.05mm</span>
        </div>
      </div>

      {/* Analytics Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 rounded-3xl bg-brand-card border border-brand-border space-y-4 shadow-xl text-xs font-mono">
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white border-b border-brand-border pb-3">
            Revenue By Fulfillment Category
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-brand-textMuted pb-1">
                <span>Custom STL Instant Quotations:</span>
                <span className="text-white font-bold">68% ({formatPrice(totalRevenue * 0.68)})</span>
              </div>
              <div className="w-full bg-brand-surface rounded-full h-2 overflow-hidden">
                <div className="bg-brand-red h-full rounded-full w-[68%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-brand-textMuted pb-1">
                <span>Marketplace Pre-Designed Products:</span>
                <span className="text-white font-bold">24% ({formatPrice(totalRevenue * 0.24)})</span>
              </div>
              <div className="w-full bg-brand-surface rounded-full h-2 overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full w-[24%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-brand-textMuted pb-1">
                <span>Priority 24h Express Rush Surcharges:</span>
                <span className="text-white font-bold">8% ({formatPrice(totalRevenue * 0.08)})</span>
              </div>
              <div className="w-full bg-brand-surface rounded-full h-2 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full w-[8%]" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-brand-card border border-brand-border space-y-4 shadow-xl text-xs font-mono">
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white border-b border-brand-border pb-3">
            Studio Efficiency Telemetry
          </h3>
          <div className="space-y-2.5 text-brand-textDim">
            <div className="flex justify-between">
              <span>Avg Slicing & Quote Duration:</span>
              <span className="text-white">1.8 seconds (Automated)</span>
            </div>
            <div className="flex justify-between">
              <span>Avg Print Queue Lead Time:</span>
              <span className="text-white">6.4 hours</span>
            </div>
            <div className="flex justify-between">
              <span>Courier Delivery Completion (Accra):</span>
              <span className="text-white">2.8 hours</span>
            </div>
            <div className="flex justify-between">
              <span>Customer Re-Order Rate:</span>
              <span className="text-emerald-400 font-bold">42.5%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
