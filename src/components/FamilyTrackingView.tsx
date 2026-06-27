import React from 'react';
import { Radio, Shield, Phone, MessageSquare, ShieldAlert } from 'lucide-react';
import { UserProfile } from '../types';

interface FamilyTrackingViewProps {
  profile: UserProfile;
  onFamilyCallUser: () => void;
  onFamilySendMessage: () => void;
  onFamilyEscalate: () => void;
  timeStr?: string;
  riskScore?: number;
}

export default function FamilyTrackingView({
  profile,
  onFamilyCallUser,
  onFamilySendMessage,
  onFamilyEscalate,
  timeStr,
  riskScore = 14,
}: FamilyTrackingViewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT PANEL: SVG MAP (col-span-8) */}
      <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 border-t-4 border-[#6C3EFF]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="bg-[#6C3EFF]/10 p-2 rounded-xl text-[#6C3EFF]">
              <Radio className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-lg text-slate-900">Family Guardian — Live Tracking Panel</h3>
              <p className="text-xs text-slate-500">Continuous telemetry mapping of your secure transit</p>
            </div>
          </div>
        </div>

        {/* SVG Map Container */}
        <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100 h-[280px]">
          <svg viewBox="0 0 800 280" className="w-full h-full bg-[#f8fafc] text-slate-800 select-none">
            {/* Grid streets */}
            <g stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" opacity="0.4">
              <line x1="50" y1="140" x2="750" y2="140" />
              <line x1="200" y1="20" x2="200" y2="260" />
              <line x1="400" y1="20" x2="400" y2="260" />
              <line x1="600" y1="20" x2="600" y2="260" />
              <path d="M 50,220 L 750,60" fill="none" />
            </g>
            
            {/* Overlay route lines */}
            <path d="M 100,140 L 400,140 L 600,140 L 700,140" fill="none" stroke="#6C3EFF" strokeWidth="4" strokeLinecap="round" />

            {/* Moving blue dot with animate tag */}
            <circle cx="100" cy="140" r="10" fill="#3b82f6" opacity="0.3" className="animate-pulse-dot">
              <animate attributeName="cx" values="100; 250; 400; 550; 700; 550; 400; 250; 100" dur="20s" repeatCount="indefinite" />
            </circle>
            <circle cx="100" cy="140" r="5" fill="#3b82f6">
              <animate attributeName="cx" values="100; 250; 400; 550; 700; 550; 400; 250; 100" dur="20s" repeatCount="indefinite" />
            </circle>

            {/* Fixed checkpoints */}
            <g transform="translate(100, 140)">
              <circle cx="0" cy="0" r="4" fill="#10b981" />
              <text x="-30" y="-12" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill="#64748b">Pickup</text>
            </g>
            <g transform="translate(700, 140)">
              <circle cx="0" cy="0" r="4" fill="#ef4444" />
              <text x="-35" y="-12" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill="#64748b">Destination</text>
            </g>

            <text x="220" y="50" fontSize="10" fontWeight="extrabold" fill="#475569">MP Nagar Link Rd</text>
            <text x="420" y="240" fontSize="10" fontWeight="extrabold" fill="#475569">VIT Bhopal Highway</text>
          </svg>

          {/* Last Updated badge */}
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-sm text-[10px] font-mono text-slate-400 font-bold tracking-tight">
            Last Updated: {timeStr || new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Status bar badges below map */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-semibold">
          <span className="text-slate-500">System Telemetry:</span>
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-[11px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Status: Live
          </span>
          <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-[11px]">
            Moving
          </span>
          <span className="bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-full text-[11px]">
            Guardian Mode: ON
          </span>
          
          {riskScore > 60 ? (
            <span className="bg-rose-100 text-rose-700 border border-rose-300 px-3 py-1 rounded-full text-[11px] font-extrabold animate-pulse flex items-center gap-1">
              <span>⚠ Risk: HIGH (Trajectory Anomaly Detected)</span>
            </span>
          ) : (
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-[11px]">
              Risk: Low
            </span>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: USER PROFILE & ACTIONS (col-span-4) */}
      <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5 border-t-4 border-[#6C3EFF]">
        <div className="flex items-center space-x-2.5">
          <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-base text-slate-900">Guardian Hub</h3>
            <p className="text-xs text-slate-500">Quick emergency override console</p>
          </div>
        </div>

        {/* User Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-3.5">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-purple-600 text-white rounded-full flex items-center justify-center font-extrabold text-sm border-2 border-white shadow-md">
              {profile.fullName ? profile.fullName.charAt(0) : 'U'}
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">{profile.fullName}</h4>
              <span className="text-[9px] text-purple-600 font-extrabold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">Subject Tracked</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-slate-200/60 text-xs font-semibold text-slate-700">
            <div>
              <span className="text-slate-400 text-[9px] uppercase tracking-wider block font-bold">Phone</span>
              <span className="truncate">{profile.phoneNumber || '+91 98765 43210'}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[9px] uppercase tracking-wider block font-bold">Blood Group</span>
              <span>{profile.bloodGroup || 'A+'}</span>
            </div>
          </div>
        </div>

        {/* 3 Action buttons stacked */}
        <div className="space-y-3">
          <span className="text-slate-400 font-bold text-[9px] uppercase tracking-wider block px-1">Emergency Actions</span>
          
          <button
            onClick={onFamilyCallUser}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Phone className="h-4 w-4" />
            <span>Call User</span>
          </button>

          <button
            onClick={onFamilySendMessage}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Send Message</span>
          </button>

          <button
            onClick={onFamilyEscalate}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldAlert className="h-4 w-4" />
            <span>Escalate to Police</span>
          </button>
        </div>
      </div>
    </div>
  );
}
