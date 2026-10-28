import React, { useEffect, useState } from "react";
import { getCityRisk, CityRisk } from "../services/risk";
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
import {
  getCommunityReportAnalytics,
  type DailyCommunityReportCount,
} from "../services/analytics";




const riskColors = ['#10b981', '#f59e0b', '#ef4444'];





export default function SwaShaktiAnalyticsView() {
  const [cityRisk, setCityRisk] = useState<CityRisk[]>([]);
  const [loadingRisk, setLoadingRisk] = useState(true);
  const [riskError, setRiskError] = useState<string | null>(null);

  const [communityReports, setCommunityReports] = useState<
  DailyCommunityReportCount[]
>([]);
const [loadingReports, setLoadingReports] = useState(true);
const [reportsError, setReportsError] = useState<string | null>(null);


  useEffect(() => {
    async function loadCityRisk() {
      try {
        setLoadingRisk(true);
        setRiskError(null);

        const data = await getCityRisk();
        setCityRisk(data);
      } catch (error) {
        console.error("Failed to load city risk:", error);
        setRiskError("Unable to load city risk data");
      } finally {
        setLoadingRisk(false);
      }
    }

    loadCityRisk();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadCommunityReports() {
      try {
        setLoadingReports(true);
        setReportsError(null);

        const data = await getCommunityReportAnalytics();

        if (!cancelled) {
          setCommunityReports(data);
        }
      } catch (error) {
        console.error("Failed to load community report analytics:", error);

        if (!cancelled) {
          setReportsError("Unable to load community report analytics");
        }
      } finally {
        if (!cancelled) {
          setLoadingReports(false);
        }
      }
    }

    loadCommunityReports();

    return () => {
      cancelled = true;
    };
  }, []);



    const riskLevelData = [
    {
      name: "Low",
      value: cityRisk.filter((city) => city.riskLevel === "LOW").length,
    },
    {
      name: "Medium",
      value: cityRisk.filter((city) => city.riskLevel === "MEDIUM").length,
    },
    {
      name: "High",
      value: cityRisk.filter((city) => city.riskLevel === "HIGH").length,
    },
  ];

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



      {/* City Risk Overview */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm border-t-4 border-[#6C3EFF]">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h4 className="font-display font-extrabold text-sm text-slate-800">
              City Risk Overview
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Combined public-reference data and submitted community reports
            </p>
          </div>

          {!loadingRisk && !riskError && (
            <span className="text-xs font-bold text-slate-500">
              {cityRisk.length} cities
            </span>
          )}
        </div>

        {loadingRisk && (
          <div className="py-10 text-center text-sm text-slate-500">
            Loading city risk data...
          </div>
        )}

        {riskError && (
          <div className="py-10 text-center text-sm text-red-500">
            {riskError}
          </div>
        )}

        {!loadingRisk && !riskError && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="py-3 px-3 font-bold text-slate-500">
                    City
                  </th>
                  <th className="py-3 px-3 font-bold text-slate-500">
                    Incidents
                  </th>
                  <th className="py-3 px-3 font-bold text-slate-500">
                    Risk Score
                  </th>
                  <th className="py-3 px-3 font-bold text-slate-500">
                    Risk Level
                  </th>
                </tr>
              </thead>

              <tbody>
                {cityRisk.map((city) => (
                  <tr
                    key={city.city}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="py-3 px-3 font-bold text-slate-800">
                      {city.city}
                    </td>

                    <td className="py-3 px-3 text-slate-600">
                      {city.incidentCount.toLocaleString()}
                    </td>

                    <td className="py-3 px-3 font-bold text-slate-800">
                      {city.riskScore}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          city.riskLevel === "HIGH"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : city.riskLevel === "MEDIUM"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {city.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 1. LineChart — Community Reports */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4 border-t-4 border-[#6C3EFF]">
          <div className="flex items-center gap-2">
            <Compass className="h-4.5 w-4.5 text-[#6C3EFF]" />
            <h4 className="font-display font-extrabold text-sm text-slate-800">
              Community Reports (Last 7 Days)
            </h4>
          </div>

          {loadingReports ? (
            <div className="h-[200px] flex items-center justify-center text-sm text-slate-500">
              Loading community reports...
            </div>
          ) : reportsError ? (
            <div className="h-[200px] flex items-center justify-center text-sm text-red-500">
              {reportsError}
            </div>
          ) : (
            <div className="h-[200px] w-full font-mono text-[10px] font-bold">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={communityReports.map((item) => ({
                    name: new Date(`${item.date}T12:00:00`).toLocaleDateString(
                      "en-IN",
                      { day: "2-digit", month: "short" }
                    ),
                    Reports: item.count,
                  }))}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis allowDecimals={false} stroke="#94a3b8" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="Reports"
                    stroke="#6C3EFF"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>



{/* 2. City Risk Distribution — Coming Soon */}
<div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4 border-t-4 border-[#6C3EFF]">
  <div className="flex items-center gap-2">
    <AlertTriangle className="h-4.5 w-4.5 text-rose-500" />
    <div>
      <h4 className="font-display font-extrabold text-sm text-slate-800">
        City Risk Distribution
      </h4>
      <p className="text-xs text-slate-500 mt-1">
        City-level risk distribution is being validated.
      </p>
    </div>
  </div>

  <div className="h-[200px] flex flex-col items-center justify-center text-center gap-2">
    <AlertTriangle className="h-8 w-8 text-slate-300" />
    <p className="text-sm font-bold text-slate-600">Coming Soon</p>
    <p className="text-xs text-slate-400 max-w-xs">
      This visualization will be available after city-level data
      quality and risk classifications have been validated.
    </p>
  </div>
</div>


        {/* 3. AI Accuracy — Coming Soon */}
<div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4 border-t-4 border-emerald-500">
  <div className="flex items-center gap-2">
    <Sparkles className="h-4.5 w-4.5 text-emerald-500" />
    <h4 className="font-display font-extrabold text-sm text-slate-800">
      AI Accuracy Over Time
    </h4>
  </div>

  <div className="h-[200px] flex flex-col items-center justify-center text-center gap-2">
    <Sparkles className="h-8 w-8 text-slate-300" />
    <p className="text-sm font-bold text-slate-600">Coming Soon</p>
    <p className="text-xs text-slate-400 max-w-xs">
      Accuracy tracking will be available when AI predictions can be
      evaluated against verified outcomes.
    </p>
  </div>
</div>

        {/* 4. Guardian Mode Activations — Coming Soon */}
<div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4 border-t-4 border-[#6C3EFF]">
  <div className="flex items-center gap-2">
    <Activity className="h-4.5 w-4.5 text-[#6C3EFF]" />
    <h4 className="font-display font-extrabold text-sm text-slate-800">
      Guardian Mode Activations (This Week)
    </h4>
  </div>

  <div className="h-[200px] flex flex-col items-center justify-center text-center gap-2">
    <Activity className="h-8 w-8 text-slate-300" />
    <p className="text-sm font-bold text-slate-600">Coming Soon</p>
    <p className="text-xs text-slate-400 max-w-xs">
      Activation analytics will be available when real Guardian Mode
      events are recorded.
    </p>
  </div>
           </div>
      </div>
    </div>
  );
}
