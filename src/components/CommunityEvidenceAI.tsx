import React from 'react';
import { Shield, Compass, AlertTriangle } from 'lucide-react';

export interface EvidenceItem {
  id: string;
  name?: string;
  file?: string;
  status: string;
  transcript: string;
  confidence: string;
}

interface CommunityEvidenceAIProps {
  reportsCount: number;
  heatmap: string[];
  onReportUnsafeZone: () => void;
  evidenceItems?: EvidenceItem[];
  communityHazards?: any[];
}

export default function CommunityEvidenceAI({
  reportsCount,
  heatmap,
  onReportUnsafeZone,
  evidenceItems = [],
  communityHazards = [],
}: CommunityEvidenceAIProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT COLUMN: EVIDENCE VAULT TABLE (col-span-7) */}
      <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 border-t-4 border-[#6C3EFF]">
        <div className="flex items-center space-x-2.5">
          <div className="bg-[#6C3EFF]/10 p-2 rounded-xl text-[#6C3EFF]">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-lg text-slate-900">Secure Evidence Vault</h3>
            <p className="text-xs text-slate-500">Auto-Uploaded on SOS Trigger</p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs text-slate-600 border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-2">File</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">AI Transcript</th>
                <th className="py-3 px-2 text-right">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {evidenceItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors bg-purple-50/10">
                  <td className="py-3.5 px-2 font-semibold text-slate-800">{item.name || item.file}</td>
                  <td className={`py-3.5 px-2 font-bold ${item.status.includes('Uploading') ? 'text-purple-600 animate-pulse' : 'text-rose-600'}`}>
                    {item.status}
                  </td>
                  <td className="py-3.5 px-2 text-slate-500 italic">{item.transcript}</td>
                  <td className="py-3.5 px-2 text-right text-emerald-600 font-bold">{item.confidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT COLUMN: COMMUNITY INTELLIGENCE & HEATMAP GRID (col-span-5) */}
      <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5 border-t-4 border-[#6C3EFF]">
        <div className="flex items-center space-x-2.5">
          <div className="bg-purple-100 p-2 rounded-xl text-purple-600">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-lg text-slate-900">Community Intelligence</h3>
            <p className="text-xs text-slate-500">Crowdsourced safety reporting & analysis</p>
          </div>
        </div>

        {/* Reports Analysed Stat Block */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-slate-400 font-bold text-[9px] uppercase tracking-wider block">Reports Analyzed Today</span>
            <span className="text-2xl font-black text-slate-800">{reportsCount} reports</span>
          </div>
          <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            ● Live Active
          </span>
        </div>

        {/* Prediction Banner - PART F Requirement */}
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 shadow-sm">
          <span className="text-purple-700 font-black text-[10px] uppercase tracking-wider block mb-1">AI Prediction Insight</span>
          <p className="text-xs text-purple-950 font-semibold leading-relaxed">
            Proactive Warning: Avoid MP Nagar after 9 PM. Reasoning: Historic lighting decay vectors + 3 crowd-sourced reports in the last 2 hours. Confidence: 94%
          </p>
        </div>

        {/* Heatmap Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-extrabold text-slate-800">Bhopal Community Risk Heatmap — Live</span>
            <span className="text-[10px] text-slate-400 font-mono">8x6 Sector Grid</span>
          </div>

          {/* Heatmap Grid */}
          <div className="grid grid-cols-8 gap-1.5 bg-slate-950 p-3 rounded-2xl border border-slate-800 justify-items-center">
            {heatmap.map((status, idx) => {
              let colorClass = 'bg-emerald-500 shadow-emerald-500/20';
              if (status === 'yellow') colorClass = 'bg-amber-400 shadow-amber-400/20';
              if (status === 'red') colorClass = 'bg-red-500 shadow-red-500/30 animate-pulse';
              return (
                <div 
                  key={idx} 
                  className={`w-full aspect-square rounded-md transition-all duration-300 ${colorClass}`}
                  title={`Sector ${idx + 1}: ${status.toUpperCase()}`}
                />
              );
            })}
          </div>

          {/* Map Legend */}
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold px-1">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Safe</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Moderate</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> High Risk</span>
          </div>
        </div>

        {/* Active Hazard Cards - PART E Requirement */}
        <div className="space-y-2">
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-wider block">Active Tracked Community Hazards</span>
          <div className="grid grid-cols-3 gap-2">
            {communityHazards.map((hazard) => {
              const cardColor = hazard.risk === 'danger' ? 'bg-rose-50 border-rose-100 text-rose-800'
                              : hazard.risk === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-800'
                              : 'bg-emerald-50 border-emerald-100 text-emerald-800';
              const indicatorColor = hazard.risk === 'danger' ? 'bg-red-500 shadow-red-500/45 animate-pulse'
                                   : hazard.risk === 'warning' ? 'bg-amber-500'
                                   : 'bg-emerald-500';
              return (
                <div key={hazard.id} className={`p-2 rounded-xl border flex flex-col items-center text-center justify-center gap-1.5 shadow-sm text-[10px] font-bold ${cardColor}`}>
                  <span className={`w-2 h-2 rounded-full ${indicatorColor}`} />
                  <span className="truncate max-w-full font-extrabold">{hazard.label}</span>
                  <span className="text-[8px] opacity-75 font-mono uppercase tracking-wider">{hazard.risk}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Report Unsafe Zone Button */}
        <button
          onClick={onReportUnsafeZone}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Report Unsafe Zone</span>
        </button>
      </div>
    </div>
  );
}
