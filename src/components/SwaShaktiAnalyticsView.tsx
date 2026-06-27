import React from 'react';
import { Compass, AlertTriangle, Sparkles, Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';

const communityReportsData = [
  { name: 'Mon', Reports: 8 },
  { name: 'Tue', Reports: 14 },
  { name: 'Wed', Reports: 11 },
  { name: 'Thu', Reports: 19 },
  { name: 'Fri', Reports: 9 },
  { name: 'Sat', Reports: 23 },
  { name: 'Sun', Reports: 17 }
];

const riskLevelData = [
  { name: 'Low', value: 62 },
  { name: 'Medium', value: 27 },
  { name: 'High', value: 11 }
];

const riskColors = ['#10b981', '#f59e0b', '#ef4444'];

const accuracyData = [
  { name: '1h', Accuracy: 88 },
  { name: '2h', Accuracy: 89 },
  { name: '3h', Accuracy: 91 },
  { name: '4h', Accuracy: 91 },
  { name: '5h', Accuracy: 93 },
  { name: '6h', Accuracy: 94 },
  { name: '7h', Accuracy: 95 },
  { name: '8h', Accuracy: 96 }
];

const guardianActivationsData = [
  { name: 'Mon', Activations: 5 },
  { name: 'Tue', Activations: 8 },
  { name: 'Wed', Activations: 6 },
  { name: 'Thu', Activations: 12 },
  { name: 'Fri', Activations: 9 },
  { name: 'Sat', Activations: 14 },
  { name: 'Sun', Activations: 7 }
];

interface SwaShaktiAnalyticsViewProps {
  aiConfidence?: number;
}

export default function SwaShaktiAnalyticsView({ aiConfidence = 96 }: SwaShaktiAnalyticsViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2.5">
        <div className="bg-[#6C3EFF]/10 p-2 rounded-xl text-[#6C3EFF]">
          <Activity className="h-5 w-5 animate-pulse" />
        </div>
        <div>
          <h3 className="font-display font-extrabold text-lg text-slate-900">Platform Intelligence — Live Analytics</h3>
          <p className="text-xs text-slate-500">Real-time model optimization and safety audit dashboards</p>
        </div>
      </div>

      {/* PART F: SwaShakti AI Engine Confidence Indicator */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm border-t-4 border-[#6C3EFF] flex flex-col items-center justify-center text-center space-y-4 max-w-xl mx-auto">
        <div className="space-y-1">
          <h4 className="font-display font-black text-slate-900 text-sm tracking-tight uppercase">
            SwaShakti AI Engine Confidence Indicator
          </h4>
          <p className="text-[10px] text-slate-500 font-medium">Real-time composite score of multi-lingual NLP + crowd density parameters</p>
        </div>

        {/* Circular Gauge */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* Outer circle track */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#f1f5f9"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Dynamic gauge fill */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#6C3EFF"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * aiConfidence) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Centered value */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-slate-800">{aiConfidence}%</span>
            <div className="flex items-center gap-1.5 mt-1 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] uppercase font-bold text-emerald-700 tracking-wider font-mono">Active Sync</span>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 font-semibold italic flex items-center justify-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-2xl">
          <span>Active Telemetry Status:</span>
          <span className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${aiConfidence > 90 ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`} />
            {aiConfidence > 90 ? 'EXCELLENT' : 'OPTIMAL'} (v2.1 Engine)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. LineChart — Community Reports */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4 border-t-4 border-[#6C3EFF]">
          <div className="flex items-center gap-2">
            <Compass className="h-4.5 w-4.5 text-[#6C3EFF]" />
            <h4 className="font-display font-extrabold text-sm text-slate-800">Community Reports (Last 7 Days)</h4>
          </div>
          <div className="h-[200px] w-full font-mono text-[10px] font-bold">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={communityReportsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="Reports" stroke="#6C3EFF" strokeWidth={3} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. PieChart — Risk Level Distribution */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4 border-t-4 border-[#6C3EFF]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4.5 w-4.5 text-rose-500" />
            <h4 className="font-display font-extrabold text-sm text-slate-800">Risk Level Distribution</h4>
          </div>
          <div className="h-[200px] w-full font-mono text-[10px] font-bold flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskLevelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {riskLevelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={riskColors[index % riskColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={24} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. AreaChart — AI Accuracy Over Time */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4 border-t-4 border-[#6C3EFF]">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-emerald-500" />
            <h4 className="font-display font-extrabold text-sm text-slate-800">AI Accuracy Over Time (Hours)</h4>
          </div>
          <div className="h-[200px] w-full font-mono text-[10px] font-bold">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={accuracyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[80, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="Accuracy" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAccuracy)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. BarChart — Guardian Mode Activations */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4 border-t-4 border-[#6C3EFF]">
          <div className="flex items-center gap-2">
            <Activity className="h-4.5 w-4.5 text-indigo-500" />
            <h4 className="font-display font-extrabold text-sm text-slate-800">Guardian Mode Activations (This Week)</h4>
          </div>
          <div className="h-[200px] w-full font-mono text-[10px] font-bold">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={guardianActivationsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="Activations" fill="#6C3EFF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
