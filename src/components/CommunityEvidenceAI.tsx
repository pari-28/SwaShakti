import React from 'react';
import { Shield, Compass, AlertTriangle } from 'lucide-react';
import CommunityReportForm from "./CommunityReportForm";

export interface EvidenceItem {
  id: string;
  name?: string;
  file?: string;
  status: string;
  transcript: string;
  confidence: string;
}

export default function CommunityEvidenceAI({
  reportsCount,
  heatmap,
  onReportUnsafeZone,
  evidenceItems = [],
  communityHazards = [],
  fetchEvidence,
}: CommunityEvidenceAIProps) {

  const API_URL = import.meta.env.VITE_API_URL;



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
           <p className="mb-2 font-bold">
    Total Evidence: {evidenceItems.length}
  </p>
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
                 <td className="py-3.5 px-2 font-semibold text-slate-800">
  {item.file ? (
    <a
      href={item.file}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#6C3EFF] hover:underline"
    >
      {item.name}
    </a>
  ) : (
    item.name
  )}
</td>
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
      <div className="lg:col-span-5 relative overflow-hidden bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5 border-t-4 border-[#6C3EFF]">
        <div className="flex items-center space-x-2.5">
          <div className="bg-purple-100 p-2 rounded-xl text-purple-600">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-lg text-slate-900">Community Intelligence</h3>
            <p className="text-xs text-slate-500">Crowdsourced safety reporting & analysis</p>
          </div>
        </div>


        {/* Community Intelligence Analytics — Coming Soon */}
        <div className="relative overflow-hidden rounded-2xl border border-violet-200 bg-slate-50 min-h-[420px]">
          {/* Preview of the upcoming analytics */}
          <div className="space-y-5 p-5 opacity-40 blur-[2px] pointer-events-none select-none">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <span className="text-xs font-bold text-slate-500">
                Community Reports
              </span>
              <div className="mt-2 h-7 w-24 rounded bg-slate-200" />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <span className="text-xs font-bold text-slate-500">
                Community Risk Heatmap
              </span>
              <div className="mt-3 grid grid-cols-8 gap-1.5">
                {Array.from({ length: 48 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="aspect-square rounded bg-slate-300"
                  />
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <span className="text-xs font-bold text-slate-500">
                Tracked Community Hazards
              </span>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-12 rounded-lg bg-slate-200"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Coming Soon overlay */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/75 p-6 text-center backdrop-blur-[2px]">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100">
              <Compass className="h-7 w-7 text-violet-600" />
            </div>

            <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-violet-700">
              Coming Soon
            </span>

            <h4 className="mt-4 text-lg font-black text-slate-900">
              Community Intelligence
            </h4>

            <p className="mt-2 max-w-xs text-sm leading-6 text-slate-600">
              Community risk analytics and heatmap insights are under development.
              Continue reporting incidents to help build the community safety dataset.
            </p>
          </div>
        </div>



                {/* Community Incident Report */}
        <div className="mt-6">
          <CommunityReportForm onReportSubmitted={fetchEvidence} />
        </div>


      </div>
    </div>
  );
}
