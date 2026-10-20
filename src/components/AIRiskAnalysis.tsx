import { useEffect, useState } from "react";
import { CommunityAreaRisk } from "../services/risk";
import {
  Brain,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Database,
} from "lucide-react";
import {
  getAIRiskAnalysis,
  AIRiskAnalysis as AIRiskAnalysisData,
} from "../services/ai";

interface AIRiskAnalysisProps {
  riskData: CommunityAreaRisk;
}

export default function AIRiskAnalysis({
  riskData,
}: AIRiskAnalysisProps) {
  const [data, setData] = useState<AIRiskAnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadAnalysis() {
  if (!riskData) return;

  try {
    setLoading(true);
    setError(null);

    const result = await getAIRiskAnalysis(riskData);

    setData(result);
  } catch (err) {
    console.error("Failed to load AI risk analysis:", err);

    setError(
      "AI risk analysis is currently unavailable for this area."
    );
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
  loadAnalysis();
}, [riskData]);

  const getRiskStyles = () => {
    if (data?.riskLevel === "HIGH") {
      return {
        badge: "bg-red-50 text-red-700 border-red-200",
        icon: "bg-red-100 text-red-600",
      };
    }

    if (data?.riskLevel === "MEDIUM") {
      return {
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        icon: "bg-amber-100 text-amber-600",
      };
    }

    return {
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: "bg-emerald-100 text-emerald-600",
    };
  };

  const riskStyles = getRiskStyles();

  return (
    <div className="mt-6 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-t-4 border-[#6C3EFF] p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#6C3EFF]/10 p-3 rounded-xl text-[#6C3EFF]">
              <Brain className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-display font-extrabold text-lg text-slate-900">
                AI Risk Analysis
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                AI explanation based on SwaShakti risk intelligence
              </p>
            </div>
          </div>

          {data && (
            <span
              className={`px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${riskStyles.badge}`}
            >
              {data.riskLevel} RISK
            </span>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-6 flex items-center gap-3 bg-slate-50 rounded-2xl p-5">
            <Loader2 className="h-5 w-5 text-[#6C3EFF] animate-spin" />

            <div>
              <p className="text-sm font-bold text-slate-800">
                Generating AI analysis...
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Gemini is analyzing the available SwaShakti risk data.
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-6 flex gap-3 bg-red-50 border border-red-100 rounded-2xl p-4">
            <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />

            <div>
              <p className="text-sm font-bold text-red-800">
                Analysis unavailable
              </p>

              <p className="text-xs text-red-600 mt-1">
                {error}
              </p>

              <button
                onClick={loadAnalysis}
                className="mt-3 text-xs font-bold text-red-700 hover:underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Result */}
        {!loading && !error && data && (
          <div className="mt-6 space-y-5">

            {/* Risk overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <span className="text-[9px] uppercase tracking-wider font-black text-slate-400">
                  Risk Score
                </span>

                <p className="text-2xl font-black text-slate-900 mt-1">
                  {data.riskScore}
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <span className="text-[9px] uppercase tracking-wider font-black text-slate-400">
                  Total Incidents
                </span>

                <p className="text-2xl font-black text-slate-900 mt-1">
                  {data.incidentCount}
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <span className="text-[9px] uppercase tracking-wider font-black text-slate-400">
                  Community
                </span>

                <p className="text-2xl font-black text-[#6C3EFF] mt-1">
                  {data.communityReportCount}
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <span className="text-[9px] uppercase tracking-wider font-black text-slate-400">
                  Public Data
                </span>

                <p className="text-2xl font-black text-slate-900 mt-1">
                  {data.publicReferenceIncidentCount}
                </p>
              </div>
            </div>

            {/* Categories */}
            {data.categories.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Database className="h-4 w-4 text-slate-500" />

                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Reported Categories
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {data.categories.map((item) => (
                    <span
                      key={item.category}
                      className="px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold"
                    >
                      {item.category}: {item.count}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* AI explanation */}
            <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-[#6C3EFF] p-1.5 rounded-lg text-white">
                  <Brain className="h-4 w-4" />
                </div>

                <span className="text-sm font-extrabold text-purple-950">
                  Gemini Safety Insight
                </span>
              </div>

              <div className="text-sm text-slate-700 leading-7 whitespace-pre-line">
                {data.analysis}
              </div>
            </div>

            {/* Data source note */}
            <div className="flex items-start gap-2 text-[10px] text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 mt-0.5" />

              <span>
                AI analysis is grounded in the existing SwaShakti
                risk data. It does not independently determine the
                risk score.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}