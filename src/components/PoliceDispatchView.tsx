import React from 'react';
import { Bell, Sparkles, Shield, ShieldAlert } from 'lucide-react';

interface PoliceAlert {
  id: string | number;
  message: string;
  status: 'active' | 'acknowledged';
  timestamp: string;
}

interface PoliceDispatchViewProps {
  onDispatchUnit: () => void;
  activeAlertsCount: number;
  policeAlerts: PoliceAlert[];
  onAcknowledgeAlert: (id: string | number) => void;
}

export default function PoliceDispatchView({
  onDispatchUnit,
  activeAlertsCount,
  policeAlerts,
  onAcknowledgeAlert,
}: PoliceDispatchViewProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 shadow-2xl space-y-6">
      <div className="flex items-start justify-between border-b border-slate-800 pb-4 flex-col sm:flex-row gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-red-950 p-2 rounded-xl text-red-500 border border-red-900 animate-pulse">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold tracking-tight">
              Police Dispatch Command Center — SwaShakti AI
            </h2>
            <p className="text-xs text-slate-400">High priority tactical intercept & coordinate mapping</p>
          </div>
        </div>

        {/* Live alert counter - PART E Requirement */}
        <div className="flex items-center space-x-2 bg-red-950/40 border border-red-500/30 px-3.5 py-2 rounded-2xl shrink-0 self-start sm:self-center">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="text-red-400 font-mono font-extrabold text-xs tracking-wider">
            {activeAlertsCount} Active Alerts
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: ACTIVE ALERTS QUEUE (col-span-6) */}
        <div className="lg:col-span-6 bg-slate-850 border border-slate-800 rounded-3xl p-6 space-y-5">
          <div className="flex items-center space-x-2.5">
            <div className="bg-red-950 p-2 rounded-xl text-red-500 border border-red-900">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base text-white">Active Emergency Alerts</h3>
              <p className="text-xs text-slate-400">Live incoming distress beacons</p>
            </div>
          </div>

          {/* Dynamic Incoming alerts queue - PART E Requirement */}
          <div className="space-y-3">
            {policeAlerts.map((alert) => {
              const isActive = alert.status === 'active';
              return (
                <div 
                  key={alert.id} 
                  className={`p-4 rounded-2xl border transition-all duration-500 ${
                    isActive 
                      ? 'bg-red-950/70 border-red-500 text-white animate-pulse' 
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[8px] uppercase font-black tracking-widest px-1.5 py-0.5 rounded ${
                          isActive ? 'bg-red-800 text-red-100' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {isActive ? 'Distress' : 'Acknowledged'}
                        </span>
                        <span className="text-[9px] font-mono opacity-60">{alert.timestamp}</span>
                      </div>
                      <p className="font-extrabold text-xs leading-normal">{alert.message}</p>
                    </div>
                    
                    {isActive ? (
                      <button
                        onClick={() => onAcknowledgeAlert(alert.id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                      >
                        Acknowledge
                      </button>
                    ) : (
                      <span className="text-emerald-400 font-bold text-[10px] uppercase bg-emerald-950/40 px-2 py-1 rounded-md border border-emerald-500/30 shrink-0">
                        Acknowledge ✓
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Static resolved alerts */}
          <div className="space-y-3 pt-2">
            <span className="text-slate-400 font-bold text-[9px] uppercase tracking-wider block">Recent Resolved Alerts (Today)</span>
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 flex items-center justify-between">
              <span>Incident #10842 • MP Nagar</span>
              <span className="text-emerald-400 text-[10px] font-bold">Resolved ✓</span>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 flex items-center justify-between">
              <span>Incident #10841 • VIT Bypass</span>
              <span className="text-emerald-400 text-[10px] font-bold">Resolved ✓</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI LANDMARK TRANSLATION & EVIDENCE (col-span-6) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Landmark Translation Box */}
          <div className="bg-slate-850 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="bg-[#6C3EFF]/20 p-2 rounded-xl text-[#6C3EFF] border border-[#6C3EFF]/30">
                <Sparkles className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base text-white">AI Landmark Translation</h3>
                <p className="text-xs text-slate-400">Translating raw coordinates to human context</p>
              </div>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-850 font-mono">
                <span className="text-slate-500 text-[9px] uppercase tracking-wider block mb-1">Raw GPS Coordinates</span>
                <span className="text-amber-400 font-bold">23.2599° N, 77.4126° E</span>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-850">
                <span className="text-slate-500 text-[9px] uppercase tracking-wider block mb-1">AI Context Mapping</span>
                <p className="font-semibold text-slate-200">
                  Approaching VIT Bhopal Main Gate, approximately 200 meters from the main highway.
                </p>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-850">
                <span className="text-slate-500 text-[9px] uppercase tracking-wider block mb-1">Recommended Unit Dispatch</span>
                <p className="font-semibold text-slate-200">
                  MP Nagar Police Station (3.2 km away)
                </p>
              </div>
            </div>

            <button
              onClick={onDispatchUnit}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ShieldAlert className="h-4 w-4" />
              <span>Dispatch Unit</span>
            </button>
          </div>

          {/* Evidence Summary Box */}
          <div className="bg-slate-850 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="bg-blue-950 p-2 rounded-xl text-blue-400 border border-blue-900">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base text-white">Live Evidence Summary</h3>
                <p className="text-xs text-slate-400">SOS Incident Data Capture</p>
              </div>
            </div>

            <div className="space-y-2.5 pt-1 text-xs">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-300 font-semibold">SOS Audio Upload</span>
                <span className="text-green-400 font-bold text-[10px] uppercase">Active Stream</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-300 font-semibold">Location Logs Sync</span>
                <span className="text-green-400 font-bold text-[10px] uppercase">5/5 Connected</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-300 font-semibold">Bhashini Translation API</span>
                <span className="text-emerald-400 font-bold text-[10px]">Dual-Lingual (Hi/En)</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
