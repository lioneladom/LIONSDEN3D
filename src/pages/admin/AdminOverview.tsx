import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  ArrowUpRight,
  Box,
  CheckCircle2,
  Clock,
  Cpu,
  DollarSign,
  Flame,
  Layers,
  Package,
  Printer,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';

export const AdminOverview: React.FC = () => {
  const { orders, printers, inventory, formatPrice, setAdminTab, setSelectedOrderId } = useApp();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) =>
    ['PENDING', 'CONFIRMED', 'PREPARING'].includes(o.status)
  ).length;
  const activePrintJobs = printers.filter((p) => p.status === 'PRINTING').length;
  const completedOrders = orders.filter((o) => ['SHIPPED', 'COMPLETED'].includes(o.status)).length;
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand-red font-bold">
            Executive Telemetry
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display uppercase tracking-tight text-white">
            Studio Operations Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-600/40 px-3 py-1.5 rounded-full">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>Fleet Production Optimal</span>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-brand-card border border-brand-border space-y-1">
          <span className="text-[10px] font-mono uppercase text-brand-textDim">Total Revenue</span>
          <div className="text-xl font-bold font-mono text-brand-redBright">
            {formatPrice(totalRevenue)}
          </div>
          <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +18.4% this month
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-brand-card border border-brand-border space-y-1">
          <span className="text-[10px] font-mono uppercase text-brand-textDim">Active Jobs</span>
          <div className="text-xl font-bold font-mono text-white">{activePrintJobs} Printing</div>
          <div className="text-[10px] font-mono text-brand-textMuted">Across 6 machines</div>
        </div>

        <div className="p-4 rounded-2xl bg-brand-card border border-brand-border space-y-1">
          <span className="text-[10px] font-mono uppercase text-brand-textDim">Pending Queue</span>
          <div className="text-xl font-bold font-mono text-amber-400">{pendingOrders} Orders</div>
          <div className="text-[10px] font-mono text-brand-textDim">Awaiting bed slot</div>
        </div>

        <div className="p-4 rounded-2xl bg-brand-card border border-brand-border space-y-1">
          <span className="text-[10px] font-mono uppercase text-brand-textDim">Completed</span>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {completedOrders} Delivered
          </div>
          <div className="text-[10px] font-mono text-brand-textDim">100% QC Pass Rate</div>
        </div>

        <div className="p-4 rounded-2xl bg-brand-card border border-brand-border space-y-1">
          <span className="text-[10px] font-mono uppercase text-brand-textDim">Avg Order Value</span>
          <div className="text-xl font-bold font-mono text-white">{formatPrice(avgOrderValue)}</div>
          <div className="text-[10px] font-mono text-brand-textDim">Thermopolymer + Store</div>
        </div>

        <div className="p-4 rounded-2xl bg-brand-card border border-brand-border space-y-1">
          <span className="text-[10px] font-mono uppercase text-brand-textDim">Filament Stock</span>
          <div className="text-xl font-bold font-mono text-white">8.6 kg</div>
          <div className="text-[10px] font-mono text-brand-textDim">In Studio Inventory</div>
        </div>
      </div>

      {/* Real-time 3D Printer Fleet Monitor (Section 29) */}
      <div className="p-6 rounded-3xl bg-brand-card border border-brand-border space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-brand-border pb-3">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-brand-red" />
            <h3 className="text-base font-bold font-display uppercase tracking-wider text-white">
              Live Additive Printer Fleet Telemetry
            </h3>
          </div>
          <span className="text-xs font-mono text-brand-textDim">6 Production Nodes Online</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {printers.map((prt) => {
            const isPrinting = prt.status === 'PRINTING';
            return (
              <div
                key={prt.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  isPrinting
                    ? 'bg-brand-surface border-brand-red/40 shadow-red-glow'
                    : 'bg-brand-surface/40 border-brand-border'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">{prt.name}</span>
                    <span className="text-[10px] font-mono text-brand-textDim">{prt.model}</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                      isPrinting
                        ? 'bg-brand-red/20 text-brand-red border border-brand-red/30'
                        : prt.status === 'IDLE'
                        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-600/40'
                        : 'bg-amber-950/40 text-amber-400 border border-amber-600/40'
                    }`}
                  >
                    {prt.status}
                  </span>
                </div>

                {isPrinting ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-white truncate max-w-[160px]">
                        Job: {prt.currentJobName}
                      </span>
                      <span className="text-brand-redBright font-bold">{prt.progressPercent}%</span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-brand-card rounded-full h-1.5 overflow-hidden border border-brand-border">
                      <div
                        className="bg-brand-red h-full rounded-full transition-all duration-300"
                        style={{ width: `${prt.progressPercent}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] font-mono text-brand-textDim pt-1">
                      <span>{prt.timeRemainingMins}m remaining</span>
                      <span>{prt.materialLoaded}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs font-mono text-brand-textDim py-2">
                    Ready for job assignment • Spool: {prt.materialLoaded}
                  </div>
                )}

                {/* Thermal stats */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-brand-border/40 text-[10px] font-mono text-brand-textDim">
                  <div className="flex items-center gap-1">
                    <Flame className="w-3 h-3 text-brand-red" />
                    <span>Nozzle: {prt.nozzleTemp}°C</span>
                  </div>
                  <div>
                    <span>Bed: {prt.bedTemp}°C</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue & Material Popularity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Monthly Revenue Chart (SVG rendered) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-brand-card border border-brand-border space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">
              Revenue & Print Job Volume (2026)
            </h3>
            <span className="text-xs font-mono text-brand-textDim">Monthly Metric</span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2 font-mono text-[10px]">
            {[
              { month: 'Apr', revenue: 4200, height: '40%' },
              { month: 'May', revenue: 5800, height: '55%' },
              { month: 'Jun', revenue: 7100, height: '68%' },
              { month: 'Jul', revenue: 8900, height: '82%' },
              { month: 'Aug', revenue: 10400, height: '94%' },
              { month: 'Sep', revenue: 11200, height: '100%', current: true },
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[9px] text-brand-textDim">GHS {(bar.revenue / 1000).toFixed(1)}k</span>
                <div
                  className={`w-full max-w-[48px] rounded-t-lg transition-all ${
                    bar.current ? 'bg-brand-red shadow-red-glow' : 'bg-brand-surface hover:bg-brand-red/50'
                  }`}
                  style={{ height: bar.height }}
                />
                <span className={`text-[10px] ${bar.current ? 'text-white font-bold' : 'text-brand-textDim'}`}>
                  {bar.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Material Share Breakdown */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-brand-card border border-brand-border space-y-4 shadow-xl text-xs font-mono">
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white border-b border-brand-border pb-3">
            Material Extrusion Share
          </h3>

          <div className="space-y-3">
            {[
              { name: 'PLA (Polylactic Acid)', share: '48%', color: 'bg-brand-red' },
              { name: 'PETG (Engineering Tough)', share: '26%', color: 'bg-blue-500' },
              { name: 'ABS (Heat-Resistant)', share: '14%', color: 'bg-amber-500' },
              { name: 'TPU 95A (Flexible Rubber)', share: '8%', color: 'bg-emerald-500' },
              { name: 'Carbon-Fiber PLA', share: '4%', color: 'bg-purple-500' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-white">{item.name}</span>
                  <span className="text-brand-textDim font-bold">{item.share}</span>
                </div>
                <div className="w-full bg-brand-surface rounded-full h-1.5 overflow-hidden">
                  <div className={`${item.color} h-full rounded-full`} style={{ width: item.share }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
