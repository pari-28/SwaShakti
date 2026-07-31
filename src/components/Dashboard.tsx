import { socket } from "../services/socket";
import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  MapPin, 
  Phone, 
  PhoneOff,
  Heart, 
  Mic, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Compass, 
  Volume2, 
  Activity, 
  RefreshCw, 
  Send,
  MessageSquare,
  ShieldAlert,
  Settings,
  Map,
  Radio,
  Clock,
  Star,
  Car,
  Bell,
  Sparkles,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';
import CommunityEvidenceAI, { EvidenceItem } from './CommunityEvidenceAI';
import FamilyTrackingView from './FamilyTrackingView';
import PoliceDispatchView from './PoliceDispatchView';
import SwaShaktiAnalyticsView from './SwaShaktiAnalyticsView';
import { useLocation } from "../hooks/useLocation";
import LiveMap from "./LiveMap";
import SOSCountdown from "./SOSCountdown";
import EmergencyContacts from "./EmergencyContacts";


const API_URL = import.meta.env.VITE_API_URL;

interface DashboardProps {
  globalState: any;
  updateState: (patch: any) => void;
  updateNested: (key: string, patch: any) => void;
  pushLog: (message: string) => void;
  profile: any;
  onReset: () => void;
  onGoHome: () => void;
  onLogout: () => void;
}

export default function Dashboard({
  globalState,
  updateState,
  updateNested,
  pushLog,
  profile,
  onReset,
  onGoHome,
  onLogout
}: DashboardProps) {
  // Navigation active tab computed from global activeView
  const activeTab =
  globalState.activeView === "user"
    ? "User Safety Desk"
    : globalState.activeView === "community"
    ? "Community & Evidence AI"
    : globalState.activeView === "family"
    ? "Family Live Tracking"
    : globalState.activeView === "police"
    ? "Police Dispatch View"
    : globalState.activeView === "contacts"
    ? "Emergency Contacts"
    : "SwaShakti Analytics";

  const setActiveTab = (tabName: string) => {
    const viewMap: any = {
  "User Safety Desk": "user",
  "Community & Evidence AI": "community",
  "Family Live Tracking": "family",
  "Police Dispatch View": "police",
  "Emergency Contacts": "contacts",
  "SwaShakti Analytics": "analytics",
};
    updateState({ activeView: viewMap[tabName] || 'user' });
  };

  const tabs = [
  { name: "User Safety Desk", icon: Shield },
  { name: "Community & Evidence AI", icon: Compass },
  { name: "Family Live Tracking", icon: Radio },
  { name: "Police Dispatch View", icon: ShieldAlert },
  { name: "Emergency Contacts", icon: Phone },
  { name: "SwaShakti Analytics", icon: Activity },
];

  // Map state derived variables from globalState
  const reportsCount = globalState.communityHazards.length + 39;
  const panicActive = globalState.systemStatus.isSosActive;
  const activeAlertsCount = globalState.activeAlertCount;
 
  const responseTime = globalState.systemStatus.responseTime;

  // Local clock state
  const [timeStr, setTimeStr] = useState('00:00:00');

  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([]);

  // Interactive UI toggles
  const [safeHavenLocked, setSafeHavenLocked] = useState(false);
  const [showFakeCall, setShowFakeCall] = useState(false);
  const [fakeCallAnswered, setFakeCallAnswered] = useState(false);
  const [demoPanelExpanded, setDemoPanelExpanded] = useState(true);
  const [aiDecisionExpanded, setAiDecisionExpanded] = useState(false);
  const [showAddLanguageDropdown, setShowAddLanguageDropdown] = useState(false);

  const [showCountdown, setShowCountdown] = useState(false);

  const [showActiveSOSModal, setShowActiveSOSModal] = useState(false);
const [holdProgress, setHoldProgress] = useState(0);
const holdTimer = useRef<number | null>(null);

  // Local monitored languages (for speech UI demo)
  const [monitoredLanguages, setMonitoredLanguages] = useState([
    { name: 'Hindi', triggers: 'Bachao, Madad, Chhod Do', status: '🟢 Active' },
    { name: 'English', triggers: 'Help, Leave Me, Stop', status: '🟢 Active' },
    { name: 'Tamil', triggers: 'Udhavi, Vidungal', status: '🟡 Standby' },
    { name: 'Bengali', triggers: 'Bachao, Sahajjo Karo', status: '🟡 Standby' },
  ]);

  const deviationTimerRef = useRef<any>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const watchIdRef = useRef<number | null>(null);
  const activeSOSIdRef = useRef<string | null>(null);

  const { location, error } = useLocation();


  // Helper to format current time as HH:MM:SS
  const getFormattedTime = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  };

  // Live Digital Clock
  useEffect(() => {
    const updateTime = () => {
      setTimeStr(getFormattedTime());
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Scroll drawer terminal logs to bottom on open or update
  useEffect(() => {
    if (globalState.isTerminalOpen && terminalEndRef.current) {
      setTimeout(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    }
  }, [globalState.systemLogs, globalState.isTerminalOpen]);

  useEffect(() => {
  fetchEvidence();
}, []);

  // Clean up interval on unmount
  useEffect(() => {
  const savedSOS = localStorage.getItem("activeSOSId");

  if (savedSOS) {
    activeSOSIdRef.current = savedSOS;
  }
}, []);

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) return;

  socket.auth = { token };

  socket.connect();

  socket.off("connect");
socket.off("disconnect");
socket.off("connect_error");
socket.off("sos-created");
socket.off("sos-success");
socket.off("location-update");
socket.off("sos-resent");
socket.off("sos-resolved");
socket.off("sos-error");

  socket.on("connect", () => {
    console.log("🟢 Socket Connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket Disconnected");
  });

  socket.on("connect_error", (err) => {
  console.error("❌ Socket Error:", err.message);
});

  // Listen when backend broadcasts a new SOS
  socket.on("sos-created", (data) => {
  console.log("========== SOCKET PAYLOAD ==========");
console.log(JSON.stringify(data, null, 2));
console.log("===================================");

  pushLog(`[SOCKET] New SOS received: ${data.sos.id}`);

  updateState({
     activeSOS: data.sos,
  emergencyContacts: data.contacts,
});
});

  // Listen when backend acknowledges an SOS
  socket.on("sos-success", (data) => {
  console.log("✅ SOS Success:", data);

  updateNested("systemStatus", {
    isSosActive: true,
    riskScore: 95,
  });

  updateState({
  activeAlertCount: globalState.activeAlertCount + 1,
  policeAlerts: [
    {
      id: Date.now(),
      message: `🚨 MANUAL SOS TRIGGERED BY ${profile.fullName.toUpperCase()}`,
      status: "active",
      timestamp: getFormattedTime(),
    },
    ...globalState.policeAlerts,
  ],
});

  pushLog("[SOCKET] SOS successfully created.");
});

socket.on("location-update", (data) => {
  console.log("📍 Live Location:", data);

  updateState({
    liveLocation: {
      latitude: data.latitude,
      longitude: data.longitude,
    },
  });

  pushLog(
    `[GPS] Updated location: ${data.latitude}, ${data.longitude}`
  );
});


// 👇 ADD THIS
socket.on("sos-resent", (data) => {
  console.log("🚨 SOS Re-sent:", data);

  if (data.contacts) {
    updateState({
      emergencyContacts: data.contacts,
    });
  }

  pushLog("[SOCKET] Emergency alert re-sent.");
});

socket.on("sos-resolved", (data) => {
  console.log("✅ SOS Resolved:", data);

  updateNested("systemStatus", {
    isSosActive: false,
    riskScore: 14,
  });

  pushLog("[SOCKET] SOS resolved.");
});


  // Listen for socket errors
  socket.on("sos-error", (error) => {
    console.error("❌ SOS Error:", error);
  });

  return () => {
    socket.off("connect");
    socket.off("disconnect");
    socket.off("sos-created");
    socket.off("sos-success");
    socket.off("location-update");
    socket.off("sos-resent");
    socket.off("sos-resolved");
    socket.off("sos-error");
    socket.off("connect_error");

    socket.disconnect();
  };
}, []);

  // PART C: DEMO CONTROL ACTIONS

  // 1. TRIGGER CAB DEVIATION
  const handleDemoCabDeviation = () => {
    updateNested('cabSimulation', { isDeviating: true, warningActive: true, countdown: 15, completed: false });
    updateNested('systemStatus', { riskScore: 81 });
    
    const currentTime = getFormattedTime();
    const newAlert = {
      id: Date.now(),
      message: '🚨 TRAJECTORY ANOMALY — Vehicle routing deviation detected',
      status: 'active' as const,
      timestamp: currentTime
    };

    updateState({ 
      activeView: 'user', 
      workspaceTint: false,
      activeAlertCount: globalState.activeAlertCount + 1,
      policeAlerts: [newAlert, ...globalState.policeAlerts]
    });

    pushLog('[SIMULATION] Trajectory anomaly detected. System-wide state updated.');
    pushLog('[SIMULATION] Police dispatch queue updated with TRAJECTORY ANOMALY alert.');
    pushLog('[SIMULATION] Family tracking view: Risk badge → HIGH.');
    pushLog('[SIMULATION] Cab deviation countdown: 15 seconds to auto-SOS.');

    if (deviationTimerRef.current) {
  clearInterval(deviationTimerRef.current);
}

    let count = 15;
    deviationTimerRef.current = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        clearInterval(deviationTimerRef.current);
        updateNested('cabSimulation', { completed: true, isDeviating: false, countdown: 0 });
        updateNested('systemStatus', { isSosActive: true, riskScore: 95 });
        pushLog('[SIMULATION] Cab deviation countdown hit 0. SOS Auto-Triggered.');
      } else {
        updateNested('cabSimulation', { countdown: count });
        pushLog(`[SIMULATION] Cab deviation countdown: ${count} seconds to auto-SOS.`);
      }
    }, 1000);
  };

  // 2. TRIGGER DISTRESS VOICE
  const handleDemoDistressVoice = () => {
    updateNested('audioMonitor', { status: 'alert', detectedIntent: 'Bachao', confidence: 99, waveformAlert: true });
    updateState({ workspaceTint: true });

    setTimeout(() => {
      pushLog("[AUDIO AI] Acoustic pattern matched: Distress keyword 'Bachao'");
    }, 0);

    setTimeout(() => {
      pushLog("[BHASHINI] NLP translation pipeline active. Hindi → English: 'Please save me'");
    }, 600);

    setTimeout(() => {
      pushLog("[EMERGENCY NODE] Intent confirmed at 99%. Initiating SOS pre-check...");
    }, 1200);
  };

  // 3. GENERATE COMMUNITY HAZARD
  const handleDemoCommunityHazard = () => {
    const currentTime = getFormattedTime();
    const newHazard = { id: Date.now(), label: 'New Zone — ' + currentTime, risk: 'danger' as const };
    updateState({
      activeView: 'community',
      communityHazards: [...globalState.communityHazards, newHazard]
    });
    pushLog('[COMMUNITY AI] New hazard report received. Heatmap recalculated.');
    pushLog('[COMMUNITY AI] Updated prediction: 44 reports today. Risk index rising.');
  };

  // 4. SIMULATE FULL SOS CHAIN
  const handleDemoFullSOSChain = () => {
    updateState({ activeView: 'user' });
    updateNested('systemStatus', { isSosActive: true, riskScore: 95 });
    
    const timestamp = getFormattedTime();
    const activeAlertId = Date.now();
    const evidenceId = Date.now() + 1;
    
    const newAlert = {
      id: activeAlertId,
      message: '🚨 FULL EMERGENCY — User manual Panic SOS activated',
      status: 'active' as const,
      timestamp
    };

    const newEvidence = {
      id: evidenceId.toString(),
      name: 'SOS_Audio_' + timestamp + '.mp3',
      status: 'Uploading...',
      transcript: 'Processing...',
      confidence: '—'
    };

    updateState({
      activeAlertCount: globalState.activeAlertCount + 1,
      policeAlerts: [newAlert, ...globalState.policeAlerts],
      evidenceVault: [newEvidence, ...globalState.evidenceVault]
    });

    // Mutate evidence row after 2000ms
    setTimeout(() => {
      updateState({
        evidenceVault: globalState.evidenceVault.map((item: any) => {
          if (item.id === evidenceId.toString()) {
            return {
              ...item,
              status: '🔒 Encrypted',
              transcript: 'Distress audio captured',
              confidence: '99%'
            };
          }
          return item;
        })
      });
    }, 2000);

    // Staggered logs
    setTimeout(() => {
      pushLog('[SOS] Panic button activated by user.');
    }, 0);

    setTimeout(() => {
      pushLog('[GPS] Coordinates captured: 23.2599°N, 77.4126°E');
    }, 800);

    setTimeout(() => {
      pushLog('[BHASHINI] Translating SOS message... Hindi alert ready.');
    }, 1600);

    setTimeout(() => {
      pushLog('[TWILIO] SMS dispatched to Contact 1 (Hindi) and Contact 2 (English).');
    }, 2400);

    setTimeout(() => {
      pushLog('[VAULT] Audio stream encrypted and uploaded to secure evidence server.');
    }, 3200);
  };

  // Core Actions
  const handleFindSafeHaven = () => {
    setSafeHavenLocked(true);
    pushLog('AI mapping coordinates to nearest landmark.');
  };

  const handleSimulateDeviation = () => {
    handleDemoCabDeviation();
  };

  const handleTriggerFakeCall = () => {
    setShowFakeCall(true);
    setFakeCallAnswered(false);
    pushLog('Fake call triggered. Deterrent protocol activated.');
  };

  const handleTriggerPanicSos = async () => {
    console.log("🚨 handleTriggerPanicSos called", new Date().toISOString());

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    console.log("Current location:", location);

if (!location) {
  alert("Waiting for GPS...");
  return;
}

console.log("Latitude:", location.latitude);
console.log("Longitude:", location.longitude);

const response = await fetch(`${API_URL}/api/sos`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    latitude: location.latitude,
    longitude: location.longitude,
    message: "Need immediate help",
  }),
});

const result = await response.json();
console.log("FULL API RESULT:");
console.log(JSON.stringify(result, null, 2));
console.log("SOS API Response:", response.status, result);

if (response.status === 409) {
  try {
    const activeResponse = await fetch(`${API_URL}/api/sos/active`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const activeResult = await activeResponse.json();

    console.log("Active SOS:", activeResult);

    if (activeResponse.ok && activeResult.data?.id) {
      localStorage.setItem("activeSOSId", activeResult.data.id);
      activeSOSIdRef.current = activeResult.data.id;
    }

    setShowActiveSOSModal(true);
    return;
  } catch (err) {
    console.error("Failed to fetch active SOS:", err);
    alert("Unable to restore active SOS.");
    return;
  }
}

if (!response.ok) {
  alert(result.message);
  return;
}

const sosId = result.data.sos.id;

localStorage.setItem("activeSOSId", sosId);
console.log("Saved activeSOSId:", sosId);
activeSOSIdRef.current = sosId;
watchIdRef.current = navigator.geolocation.watchPosition(
  async (position) => {

    if (!activeSOSIdRef.current) {
        return;
    }

    const sosId = activeSOSIdRef.current;

    try {

        await fetch(
            `${API_URL}/api/sos/${sosId}/location`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
        }
      );
    } catch (err) {
      console.error("Location update failed:", err);
    }
  },
  (err) => {
    console.error("Watch Position Error:", err);
  },
  {
    enableHighAccuracy: true,
    maximumAge: 5000,
    timeout: 30000,
  }
);
       
  } catch (err) {
    console.error(err);
  }
};
const handleCountdownCancel = () => {
  setShowCountdown(false);
};

const handleCountdownComplete = async () => {
  setShowCountdown(false);
  await handleTriggerPanicSos();
};
const handleResendAlert = async () => {
  const token = localStorage.getItem("token");

  if (!token || !activeSOSIdRef.current) return;

  

  try {
    const response = await fetch(
  `${API_URL}/api/sos/${activeSOSIdRef.current}/resend`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);


const result = await response.json();

if (!response.ok) {
  alert(result.message || "Failed to resend emergency alert.");
  return;
}

pushLog("🚨 Emergency alert re-sent.");
setShowActiveSOSModal(false);
  } catch (err) {
    console.error(err);
  }
};
  const handleTriggerSilentPolice = () => {
  pushLog("[SOS] Silent Police alert dispatched.");
};
    



const startHoldResolve = async () => {
  let progress = 0;

  holdTimer.current = window.setInterval(async () => {
    progress += 5;

    setHoldProgress(progress);

    if (progress >= 100) {
  clearInterval(holdTimer.current!);

  const confirmResolve = window.confirm(
    "Are you sure you're safe? This will stop emergency tracking."
  );

  if (confirmResolve) {
    await handleResetPanic();
    setShowActiveSOSModal(false);
  }

  setHoldProgress(0);
}
  }, 150);
};

const cancelHoldResolve = () => {
  if (holdTimer.current) {
    clearInterval(holdTimer.current);
  }

  setHoldProgress(0);
};
  

  const handleResetPanic = async () => {
  try {
    const token = localStorage.getItem("token");
    const sosId = localStorage.getItem("activeSOSId");

    if (!token || !sosId) {
      alert("No active SOS found.");
      return;
    }

    const response = await fetch(`${API_URL}/api/sos/${sosId}/status`, {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    status: "RESOLVED",
  }),
});

    const result = await response.json();

    console.log("Resolve SOS:", result);

    if (!response.ok) {
      alert(result.message);
      return;
    }

    // Stop GPS tracking FIRST
if (watchIdRef.current !== null) {
  navigator.geolocation.clearWatch(watchIdRef.current);
  watchIdRef.current = null;

  pushLog("[GPS] Live tracking stopped.");
}

// THEN clear active SOS
localStorage.removeItem("activeSOSId");
activeSOSIdRef.current = null;

updateNested("systemStatus", {
  isSosActive: false,
  riskScore: 14,
});

updateNested("cabSimulation", {
  isDeviating: false,
  warningActive: false,
});

updateState({
  workspaceTint: false,
  activeAlertCount: Math.max(
    0,
    globalState.activeAlertCount - 1
  ),
});

pushLog("SOS resolved successfully.");

if (deviationTimerRef.current) {
  clearInterval(deviationTimerRef.current);
}

} catch (err) {
  console.error(err);
}
};
    const handleReportUnsafeZone = () => {
  const currentTime = getFormattedTime();

  const newHazard = {
    id: Date.now(),
    label: "Community Zone — " + currentTime,
    risk: "danger" as const,
  };

  updateState({
    communityHazards: [...globalState.communityHazards, newHazard],
  });

  pushLog(
    `[COMMUNITY AI] New crowdsourced unsafe zone reported at ${currentTime}.`
  );
};

  const handleFamilyCallUser = () => {
    pushLog(`[FAMILY CALL] Dialing secure, encrypted VoIP voice link to ${profile.fullName}...`);
  };

  const handleFamilySendMessage = () => {
    pushLog(`[FAMILY SMS] Secure SMS dispatched to ${profile.fullName}: "Are you safe? SwaShakti tracking you."`);
  };

  const handleFamilyEscalate = () => {
    pushLog(`[FAMILY ESCALATE] Escalating live tracking telemetry of ${profile.fullName} to Bhopal Police patrol.`);
  };

  const handleDispatchUnit = () => {
    pushLog(`[POLICE DISPATCH] Emergency Patrol Unit #14 dispatched from MP Nagar station.`);
  };

  const handleAcknowledgeAlert = (id: string | number) => {
    updateState({
      policeAlerts: globalState.policeAlerts.map((alert: any) => {
        if (alert.id === id) {
          return { ...alert, status: 'acknowledged' };
        }
        return alert;
      })
    });
    pushLog(`[POLICE DISPATCH] Alert #${id} acknowledged in command room.`);
  };

  const fetchEvidence = async () => {
  const token = localStorage.getItem("token");
  const sosId = localStorage.getItem("activeSOSId");

  console.log("Fetching evidence for SOS:", sosId);

  if (!sosId) return;

  const response = await fetch(
    `${API_URL}/api/evidence/${sosId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  console.log("Evidence API Response:", result);

  if (response.ok) {
    const formatted = result.data.map((item: any) => {
  const cleanName = item.fileName
    .normalize("NFKC")
    .replace(/\u202F/g, " ")
    .replace(/â¯/g, " ");

  return {
    id: item.id,
    name: cleanName,
    file: cleanName,
    status: "Uploaded",
    transcript: "Secure evidence stored",
    confidence: "100%",
  };
});

    console.log("Formatted Evidence:", formatted);

    setEvidenceItems(formatted);

    console.log("State being set:", formatted);
  }
};

  // Format logs for rendering in sliding drawer
  const logs = globalState.systemLogs.map((log: any) => `[${log.time}] ${log.message}`);

  // Heatmap sector grid cell compiler
  const heatmap = (() => {
    const arr = Array(48).fill('green');
    arr[4] = 'yellow';
    arr[12] = 'yellow';
    arr[19] = 'red';
    arr[27] = 'yellow';
    arr[34] = 'red';
    arr[41] = 'yellow';
    globalState.communityHazards.forEach((h: any, i: number) => {
      if (h.risk === 'danger') arr[(i * 7 + 3) % 48] = 'red';
      else if (h.risk === 'warning') arr[(i * 7 + 3) % 48] = 'yellow';
    });
    return arr;
  })();

  const alertAcknowledged = globalState.policeAlerts.length === 0 || globalState.policeAlerts[0]?.status === 'acknowledged';

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden transition-all duration-500 font-sans select-none relative ${
      globalState.workspaceTint 
        ? 'ring-8 ring-rose-600/30 shadow-[inset_0_0_80px_rgba(239,68,68,0.25)] border-4 border-rose-600' 
        : ''
    } ${
      globalState.activeView === 'police' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      
      {/* Dynamic Keyframes & Global Animations */}
      <style>{`
        @keyframes pulse-red {
          0% { transform: scale(0.95); opacity: 0.9; box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { transform: scale(1.05); opacity: 0.5; box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
          100% { transform: scale(0.95); opacity: 0.9; box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .animate-pulse-red {
          animation: pulse-red 2s infinite;
        }

        @keyframes wave-bounce {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        .wave-bar {
          animation: wave-bounce 1.2s ease-in-out infinite;
          transform-origin: bottom;
        }

        @keyframes pulse-dot {
          0% { transform: scale(0.85); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.6; }
          100% { transform: scale(0.85); opacity: 1; }
        }
        .animate-pulse-dot {
          animation: pulse-dot 1.5s infinite ease-in-out;
        }

        @keyframes view-fade-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-view-fade {
          animation: view-fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes sos-button-shadow-pulse {
          0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.6); }
          70% { box-shadow: 0 0 0 15px rgba(220, 38, 38, 0); }
          100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
        }
        .animate-sos-shadow-pulse {
          animation: sos-button-shadow-pulse 1.8s infinite;
        }
      `}</style>

      {/* GLOBAL AI STATUS BAR */}
      <div className="h-[36px] bg-slate-900 border-b border-slate-800 text-emerald-400 font-mono text-xs px-4 flex items-center justify-between shrink-0 z-40">
        <div className="flex items-center space-x-2 truncate">
          <span className="font-bold text-slate-400">SwaShakti Intelligence Core</span>
          <span className="text-slate-700">|</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            Status: <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" /> Online
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-300">Analyzing: GPS · Lighting · Crowd Density</span>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <div className="hidden md:flex items-center space-x-1">
            <span className="text-slate-500">Confidence:</span>
            <span className="font-bold text-emerald-400">{globalState.systemStatus.aiConfidence}%</span>
          </div>
          <span className="text-slate-700 hidden md:inline">|</span>
          <div className="flex items-center space-x-1">
            <span className="text-slate-500">Response:</span>
            <span className="font-bold text-emerald-400 tracking-wider text-right w-[36px] inline-block">
              [{responseTime}s]
            </span>
          </div>
        </div>
      </div>

      {/* Top Warning Banners */}
      {panicActive && (
        <div className="bg-red-600 text-white font-bold text-center py-2.5 px-4 text-xs sm:text-sm flex items-center justify-center gap-2 animate-pulse shrink-0 z-30 shadow-lg">
          <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
          <span>🚨 SOS ACTIVE — Contacts Notified — Location Shared</span>
          
        </div>
      )}

      {/* Outer Flex Container */}
      <div className="flex-grow flex overflow-hidden">
        
        {/* LEFT SIDEBAR (fixed 260px, bg-white, border-right) */}
        <aside className="w-[260px] bg-white border-r border-slate-200 flex flex-col justify-between text-slate-800 z-40 shrink-0 select-none">
          
          <div className="p-5 flex flex-col space-y-5">
            {/* SwaShakti Head Logo */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="bg-[#6C3EFF] p-1.5 rounded-xl text-white shadow-md">
                  <Shield className="h-4.5 w-4.5" />
                </div>
                <span className="font-display font-extrabold text-lg text-slate-900 tracking-tight">
                  SwaShakti
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-green-600">Active</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.name;
                return (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm font-semibold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-600 shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className={`h-4.5 w-4.5 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
                      <span>{tab.name}</span>
                    </div>
                    {isActive && (
                      <span className="text-[9px] bg-purple-600 text-white px-1.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">Live</span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Hardware Trigger Card */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 mt-2">
              <div className="flex items-start space-x-2.5">
                <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-800">Hardware Trigger: ARMED</h4>
                  <p className="text-[10px] text-amber-700 leading-relaxed mt-1">
                    Shake phone 3x to fire SOS without opening the app.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* User profile footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-col gap-2 select-none">
            <div className="flex items-center space-x-2.5">
              <div className="w-8.5 h-8.5 rounded-lg bg-[#6C3EFF]/10 border border-[#6C3EFF]/10 flex items-center justify-center text-[#6C3EFF] font-bold text-sm">
                {profile.fullName.charAt(0)}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate">{profile.fullName}</p>
                <p className="text-[10px] text-slate-400 truncate">{profile.city}</p>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-mono text-center border-t border-slate-200/50 pt-2 font-bold tracking-tight">
              Powered by Bhashini · Built for Bharat
            </div>

            <button
  onClick={onLogout}
  className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded-lg transition-colors"
>
  Logout
</button>
          </div>

        </aside>

        {/* MAIN SCROLLABLE CONTENT AREA */}
        <main className="flex-grow flex flex-col overflow-y-auto relative">
          
          {/* Greeting bar & clock header */}
          <div className="px-6 py-5 border-b border-slate-200 bg-white flex flex-col sm:flex-row justify-between sm:items-center gap-3 shrink-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 flex items-center gap-2">
                Good Evening, {profile.fullName} <span className="inline-block animate-bounce" style={{ animationDuration: '3s' }}>👋</span>
              </h1>
              <div className="flex items-center space-x-1.5 text-slate-500 text-xs mt-1">
                <MapPin className="h-3.5 w-3.5 text-[#6C3EFF]" />
                <span className="font-semibold text-slate-600">
    {location?.address ?? "Fetching current location..."}
</span>
              </div>
              {error && (
                  <p className="text-red-600 text-sm mt-2">
                    {error}
                  </p>
                )}

              
            </div>

            {/* Right-aligned Live Digital Clock */}
            <div className="flex items-center gap-3">
  <div className="flex items-center space-x-2.5 bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 text-slate-600 font-mono text-sm">
    <Clock className="h-4 w-4 text-[#6C3EFF] animate-pulse" />
    <span className="font-bold tracking-widest">{timeStr}</span>
  </div>

  <button
    onClick={onLogout}
    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold"
  >
    Logout
  </button>
</div>
          </div>

          {/* Content Views Workspace */}
          <div className="p-6 space-y-6 flex-grow">
            
            <AnimatePresence mode="wait">
              
              {/* VIEW 1: User Safety Desk */}
              {activeTab === 'User Safety Desk' && (
                <motion.div
                  key="User Safety Desk"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
                >
              
              {/* COLUMNS 1 & 2: SAFETY MAP PANEL (spans 8 rows in lg screen layout) */}
              <section className="lg:col-span-8 space-y-6">
                
                {/* AI Safety Map Panel */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 border-t-4 border-[#6C3EFF]">
                  
                  {/* PART E: Acoustic warning banner inside Map Panel */}
                  {globalState.workspaceTint && (
                    <div className="bg-rose-100 border-2 border-rose-400 rounded-2xl p-4 text-rose-900 flex items-center gap-3 animate-pulse shadow-md">
                      <ShieldAlert className="h-6 w-6 text-rose-600 shrink-0" />
                      <div>
                        <p className="font-black text-sm uppercase tracking-wider text-rose-900">⚠️ WARNING: High-Intensity Acoustic Anomaly</p>
                        <p className="text-xs font-semibold text-rose-700">Potential Distress Detected — Bhashini NLP translation pipeline synchronized.</p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="bg-[#6C3EFF]/10 p-2 rounded-xl text-[#6C3EFF]">
                        <Map className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-display font-extrabold text-lg text-slate-900">AI Safety Map</h3>
                        <p className="text-xs text-slate-500">Realtime navigation matches illumination & safety metrics</p>
                      </div>
                    </div>

                    {/* Find Nearest Safe Haven Button */}
                    <button
                      onClick={handleFindSafeHaven}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center space-x-1.5 self-start sm:self-center"
                    >
                      <Compass className="h-3.5 w-3.5" />
                      <span>Find Nearest Safe Haven</span>
                    </button>
                  </div>

                  {/* Safe Haven locked Info block */}
                  {safeHavenLocked && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-start space-x-2.5 animate-pulse">
                      <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-bold">Destination Locked: Nearest Police Booth</p>
                        <p className="text-[11px] mt-0.5 text-emerald-700">200 meters away. Estimated walk: 4 minutes.</p>
                      </div>
                      <button 
                        onClick={() => setSafeHavenLocked(false)}
                        className="ml-auto text-emerald-500 hover:text-emerald-800 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* Map and Explainable AI Insights Card layout */}
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    
                    {/* Live Map Container */}
                    <div className="xl:col-span-8">
                      {location && (
                        <LiveMap location={location} />
                      )}
                    </div>

                    {/* Explainable AI Insights Card */}
                    <div className="xl:col-span-4 bg-slate-50 border border-slate-200 rounded-2xl p-4.5 flex flex-col justify-between shadow-sm">
                      <div>
                        <div className="flex items-center space-x-2 text-[#6C3EFF] mb-3">
                          <Sparkles className="h-4 w-4 animate-pulse" />
                          <h4 className="font-display font-extrabold text-xs sm:text-sm tracking-tight text-slate-800">AI Reasoning</h4>
                        </div>
                        
                        <ul className="space-y-2.5 text-xs text-slate-600 font-semibold">
                          <li className="flex items-start gap-1.5">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span>High crowd density detected on Route A</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span>Well-lit roads confirmed via satellite lighting index</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span>Nearest safe haven: Police Booth (200m)</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span>Time: 8PM — historically safer in this zone</span>
                          </li>
                        </ul>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/60 space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-500">Confidence Score:</span>
                          <span className="font-extrabold text-[#6C3EFF]">{globalState.systemStatus.aiConfidence}%</span>
                        </div>

                        {/* Risk Prediction Meter */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className={`${globalState.systemStatus.riskScore > 60 ? 'text-red-600 animate-pulse' : 'text-emerald-600'}`}>
                              {globalState.systemStatus.riskScore > 60 
                                ? `Current Risk: 🔴 High (${globalState.systemStatus.riskScore}/100)` 
                                : `Current Risk: 🟢 Low (${globalState.systemStatus.riskScore}/100)`}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ease-out ${
                                globalState.systemStatus.riskScore > 60 ? 'bg-red-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${globalState.systemStatus.riskScore}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

                {/* EXPLAINABLE AI PANEL */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm border-t-4 border-[#6C3EFF] overflow-hidden">
                  <button
                    onClick={() => setAiDecisionExpanded(!aiDecisionExpanded)}
                    className="w-full flex items-center justify-between p-5 bg-slate-50/70 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="bg-[#6C3EFF]/10 p-2 rounded-xl text-[#6C3EFF]">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-display font-extrabold text-sm text-slate-900">How the AI Made This Decision</h4>
                        <p className="text-[10px] text-slate-500 font-medium">Explainable AI (XAI) routing timeline & safety heuristics</p>
                      </div>
                    </div>
                    {aiDecisionExpanded ? (
                      <ChevronUp className="h-4.5 w-4.5 text-slate-500" />
                    ) : (
                      <ChevronDown className="h-4.5 w-4.5 text-slate-500" />
                    )}
                  </button>

                  <AnimatePresence>
                    {aiDecisionExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="border-t border-slate-200/60"
                      >
                        <div className="p-5 space-y-4">
                          
                          {/* Part F: Live Pipeline Sequence display */}
                          {globalState.audioMonitor.status === 'alert' && (
                            <div className="bg-purple-50 border border-purple-200 p-3.5 rounded-2xl mb-4 text-xs font-bold text-[#6C3EFF] flex items-center gap-2 animate-pulse shadow-sm">
                              <Sparkles className="h-4 w-4 text-purple-600 shrink-0" />
                              <span>Live Sequence: Acoustic Intent Matching (99%) → Bhashini NLP Active → Emergency Node Initializing...</span>
                            </div>
                          )}

                          {/* Step-by-step reasoning timeline */}
                          <div className="relative border-l-2 border-slate-200 pl-6 ml-3 space-y-5">
                            {/* Step 1 */}
                            <div className="relative">
                              <span className="absolute -left-8 top-1 bg-white border-2 border-slate-300 w-3.5 h-3.5 rounded-full flex items-center justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                              </span>
                              <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-400">Step 1 — Raw Input</h5>
                              <p className="text-xs font-semibold text-slate-700 mt-0.5">GPS signal + current time (8:47 PM)</p>
                            </div>
                            {/* Step 2 */}
                            <div className="relative">
                              <span className="absolute -left-8 top-1 bg-white border-2 border-slate-300 w-3.5 h-3.5 rounded-full flex items-center justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                              </span>
                              <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-400">Step 2 — Crowd Density Model</h5>
                              <p className="text-xs font-semibold text-slate-700 mt-0.5">Route A density index = 0.84 (High)</p>
                            </div>
                            {/* Step 3 */}
                            <div className="relative">
                              <span className="absolute -left-8 top-1 bg-white border-2 border-slate-300 w-3.5 h-3.5 rounded-full flex items-center justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                              </span>
                              <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-400">Step 3 — Lighting Index API</h5>
                              <p className="text-xs font-semibold text-slate-700 mt-0.5">Route A illumination = 89/100</p>
                            </div>
                            {/* Step 4 */}
                            <div className="relative">
                              <span className="absolute -left-8 top-1 bg-white border-2 border-slate-300 w-3.5 h-3.5 rounded-full flex items-center justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                              </span>
                              <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-400">Step 4 — Historical Crime Data</h5>
                              <p className="text-xs font-semibold text-slate-700 mt-0.5">MP Nagar — 0 incidents in last 30 days</p>
                            </div>
                            {/* Step 5 */}
                            <div className="relative">
                              <span className="absolute -left-8 top-1 bg-white border-2 border-slate-300 w-3.5 h-3.5 rounded-full flex items-center justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                              </span>
                              <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-400">Step 5 — Safe Haven Lookup</h5>
                              <p className="text-xs font-semibold text-slate-700 mt-0.5">Police Booth at 200m (open 24/7)</p>
                            </div>
                            {/* Step 6 */}
                            <div className="relative">
                              <span className="absolute -left-8 top-1 bg-white border-2 border-[#6C3EFF] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                                <span className="w-2 h-2 rounded-full bg-[#6C3EFF]" />
                              </span>
                              <h5 className="text-[11px] font-black uppercase tracking-wider text-[#6C3EFF]">Step 6 — Final Safety Score</h5>
                              <p className="text-xs font-extrabold text-[#6C3EFF] mt-0.5 bg-purple-50 inline-block px-2 py-0.5 rounded-md">
                                92/100 → Recommended Route: A
                              </p>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[10px] font-mono text-slate-400 font-bold">
                            <span>SwaShakti Safety Score Engine v2.1</span>
                            <span>Bhashini NLP + OpenStreetMap</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* LIVE GUARDIAN TRANSIT CARD */}
                <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm border-t-4 border-[#6C3EFF]">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    
                    <div className="flex items-start space-x-3.5">
                      <div className="bg-[#6C3EFF]/10 p-2.5 rounded-2xl text-[#6C3EFF] mt-1 shrink-0">
                        <Car className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-display font-extrabold text-base text-slate-900 flex items-center gap-1.5">
                          Live Guardian Commute
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">Transit Shield</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Secure your transit logs before boarding a cab. We automatically check for abnormal route departures or stops.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleSimulateDeviation}
                      disabled={globalState.cabSimulation.isDeviating}
                      className={`font-bold text-xs px-5 py-3 rounded-2xl shadow-md transition-all cursor-pointer whitespace-nowrap self-start sm:self-center shrink-0 ${
                        globalState.cabSimulation.isDeviating
                          ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                          : 'bg-rose-600 hover:bg-rose-700 text-white hover:shadow-lg'
                      }`}
                    >
                      {globalState.cabSimulation.isDeviating ? 'Deviation Active...' : 'Simulate Cab Deviation'}
                    </button>

                  </div>

                  {/* Warning Alerts for Deviation */}
                  {globalState.cabSimulation.isDeviating && (
                    <div className="mt-4 bg-rose-50 border border-rose-100 rounded-2xl p-4 space-y-3 animate-view-fade">
                      <div className="flex items-start space-x-2.5 text-rose-800">
                        <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5 animate-pulse" />
                        <div>
                          <p className="font-bold text-xs">⚠ WARNING: Vehicle has deviated 500m from the safe route!</p>
                          <p className="text-[11px] text-rose-700 mt-0.5">Please confirm your safety immediately to prevent automated emergency dispatch.</p>
                        </div>
                      </div>

                      {/* Verification Countdown */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-rose-200/50">
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-rose-600 rounded-full animate-ping" />
                          <span className="text-xs font-mono font-bold text-rose-700">
                            {globalState.cabSimulation.completed ? (
                              <span className="text-rose-600 font-extrabold uppercase animate-pulse">
                                SOS Auto-Triggered: Contacts notified.
                              </span>
                            ) : (
                              `Verifying safety... ${globalState.cabSimulation.countdown}s remaining`
                            )}
                          </span>
                        </div>

                        {!globalState.cabSimulation.completed && (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => {
                                updateNested('cabSimulation', { isDeviating: false, warningActive: false });
                                updateNested('systemStatus', { riskScore: 14 });
                                pushLog('Transit deviation alert solved. Driver rejoined corridor.');
                                if (deviationTimerRef.current) clearInterval(deviationTimerRef.current);
                              }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                            >
                              I am Safe
                            </button>
                            <button
                              onClick={() => {
                                updateNested("cabSimulation", {
                                  completed: true,
                                  countdown: 0,
                                  isDeviating: false,
                                });

                                updateNested("systemStatus", {
                                  isSosActive: true,
                                  riskScore: 95,
                                });

                                setShowCountdown(true);
                              }}
                              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                            >
                              Trigger SOS Now
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>

              </section>

              {/* COLUMN 3: EMERGENCY PANEL (spans 4 rows on lg screen) */}
              <section className="lg:col-span-4 space-y-6">
                
                {/* 1. AUDIO MONITOR & FAKE CALL CARD */}
                <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-5 border-t-4 border-[#6C3EFF]">
                  
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="bg-pink-100 p-2 rounded-xl text-pink-600">
                        <Mic className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-display font-extrabold text-sm text-slate-900">Audio Threat Monitor</h4>
                        <span className="text-[10px] text-slate-500 block mt-0.5">Microphone Active</span>
                      </div>
                    </div>
                    <span className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                      Live
                    </span>
                  </div>

                  {/* Waveform Visualization */}
                  <div className={`border rounded-2xl p-4 flex flex-col items-center justify-center space-y-3 transition-colors duration-500 ${globalState.audioMonitor.status === 'alert' ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="flex items-end justify-center space-x-1.5 h-12 w-full max-w-[180px]">
                      {/* 10 waveform bars */}
                      {[1.2, 0.7, 1.5, 0.9, 1.3, 0.8, 1.6, 1.1, 1.4, 0.6].map((dur, i) => (
                        <div 
                          key={i} 
                          className={`w-1.5 rounded-full wave-bar transition-colors duration-300 ${globalState.audioMonitor.status === 'alert' ? 'bg-red-600 animate-pulse' : 'bg-pink-500'}`}
                          style={{ 
                            height: '100%',
                            animationDuration: `${dur}s`,
                            animationDelay: `${i * 0.1}s`
                          }}
                        />
                      ))}
                    </div>
                    <p className={`text-[10px] font-mono font-bold text-center uppercase tracking-wider ${globalState.audioMonitor.status === 'alert' ? 'text-red-600 animate-pulse' : 'text-slate-400'}`}>
                      {globalState.audioMonitor.status === 'alert' ? "🔴 INTENT DETECTED — 'Bachao' (Confidence: 99%)" : "Acoustic Monitor Calibration Wave"}
                    </p>
                  </div>

                  {/* BHASHINI LANGUAGE PANEL */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-[#6C3EFF]">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        <h4 className="font-display font-extrabold text-[12px] text-slate-800">Bhashini Language Panel</h4>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => setShowAddLanguageDropdown(!showAddLanguageDropdown)}
                          className="text-[9px] bg-[#6C3EFF] hover:bg-[#5b32e6] text-white font-black uppercase px-2 py-1 rounded transition-colors cursor-pointer"
                        >
                          + Add Language
                        </button>

                        {showAddLanguageDropdown && (
                          <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50 text-xs font-semibold text-slate-700 animate-fade-in space-y-1">
                            {['Telugu', 'Marathi', 'Kannada', 'Gujarati'].map((lang) => {
                              const isAlreadyMonitored = monitoredLanguages.some(l => l.name === lang);
                              return (
                                <button
                                  key={lang}
                                  disabled={isAlreadyMonitored}
                                  onClick={() => {
                                    const triggersMap: { [key: string]: string } = {
                                      'Telugu': 'Sahayam, Kapadandi',
                                      'Marathi': 'Madat kara, Sod dya',
                                      'Kannada': 'Sahaya, Bidi',
                                      'Gujarati': 'Madad karo, Chhodo mane',
                                    };
                                    setMonitoredLanguages(prev => [
                                      ...prev,
                                      { name: lang, triggers: triggersMap[lang] || 'Distress Call', status: '🟢 Active' }
                                    ]);
                                    setShowAddLanguageDropdown(false);
                                    pushLog(`Bhashini Language added: ${lang}. Acoustic recognition matrix synchronized.`);
                                  }}
                                  className={`w-full text-left px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors ${
                                    isAlreadyMonitored ? 'opacity-50 cursor-not-allowed text-slate-400' : 'cursor-pointer'
                                  }`}
                                >
                                  {lang}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[11px] text-slate-600 font-semibold border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 text-[9px] text-slate-400 uppercase font-bold">
                            <th className="pb-1 pr-2">Language</th>
                            <th className="pb-1 pr-2">Acoustic Triggers</th>
                            <th className="pb-1 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {monitoredLanguages.map((lang, idx) => (
                            <tr key={idx} className="hover:bg-slate-100/50 transition-colors">
                              <td className="py-1.5 pr-2 font-bold text-slate-800">{lang.name}</td>
                              <td className="py-1.5 pr-2 font-mono text-[9px] text-slate-500 italic">"{lang.triggers}"</td>
                              <td className="py-1.5 text-right">
                                <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold ${
                                  lang.status.includes('Active') ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                }`}>
                                  {lang.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 2. FAKE CALL MODULE */}
                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <button
                      onClick={handleTriggerFakeCall}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>Simulate Fake Call</span>
                    </button>

                    {showFakeCall && (
                      <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 space-y-4 animate-view-fade">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-[#6C3EFF] text-white flex items-center justify-center font-extrabold text-sm border-2 border-slate-800 shadow-md">
                            MA
                          </div>
                          <div>
                            <h5 className="font-bold text-xs text-slate-200">Maa (Family Member)</h5>
                            <span className="text-[10px] text-slate-400 block mt-0.5 animate-pulse">
                              {fakeCallAnswered ? 'Connected • Speaking' : 'Incoming Call — Deterrent'}
                            </span>
                          </div>
                        </div>

                        {fakeCallAnswered && (
                          <div className="bg-[#6C3EFF]/15 border border-[#6C3EFF]/20 rounded-xl p-3 text-xs text-purple-300 leading-normal font-medium">
                            <span className="font-bold text-[10px] uppercase text-purple-400 block mb-1">Deterrent Voice:</span>
                            "Caller: Main 2 minute mein pahunch raha hoon! (I am 2 minutes away!)"
                          </div>
                        )}

                        <div className="flex gap-2 justify-end pt-1">
                          {!fakeCallAnswered ? (
                            <>
                              <button
                                onClick={() => {
                                  setFakeCallAnswered(true);
                                  pushLog('Caller speech playback active: deterrent active.');
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-3.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                              >
                                <Phone className="h-3 w-3" />
                                <span>Answer</span>
                              </button>
                              <button
                                onClick={() => setShowFakeCall(false)}
                                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                              >
                                <PhoneOff className="h-3 w-3" />
                                <span>Decline</span>
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setShowFakeCall(false)}
                              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-1.5 rounded-lg transition-all cursor-pointer"
                            >
                              Hang Up Call
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* 3. PANIC SOS MASSIVE TRIGGER CARD */}
                <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm flex flex-col items-center justify-center text-center space-y-3.5 border-t-4 border-[#6C3EFF]">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400 font-mono">PANIC SOS</span>
                  
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <div className="absolute inset-0 bg-rose-600/20 rounded-full animate-pulse-red" />
                    <button
                      id="btn-panic-sos-trigger"
                      onClick={() => setShowCountdown(true)}
                      className="w-28 h-28 rounded-full bg-red-600 hover:bg-red-700 text-white font-black tracking-widest text-lg flex flex-col items-center justify-center shadow-lg transform active:scale-95 transition-all duration-300 cursor-pointer z-10 animate-sos-shadow-pulse"
                    >
                      <Shield className="h-7 w-7 text-white mb-1 animate-bounce" />
                      <span>SOS</span>
                      <span className="text-[8px] font-mono uppercase tracking-widest font-extrabold text-rose-200 mt-1">1-Tap Alert</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-normal max-w-[220px]">
                    Force continuous GPS coordinate beacon dispatch to all contacts and nearby patrolling booths.
                  </p>
                </div>

                {/* 4. SILENT POLICE ALERT BUTTON */}
                <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm border-t-4 border-[#6C3EFF]">
                  <button
                    onClick={handleTriggerSilentPolice}
                    className="w-full bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs py-3.5 px-4 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldAlert className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
                    <span>Silent Police Alert — Call 112</span>
                  </button>
                  <p className="text-[10px] text-slate-400 text-center mt-2 leading-relaxed">
                    Sends silently encrypted dispatch to city control station matching high priority landmarks.
                  </p>
                </div>

              </section>

                </motion.div>
              )}

              {/* VIEW 2: Community & Evidence AI */}
              {activeTab === 'Community & Evidence AI' && (
                <motion.div
                  key="Community & Evidence AI"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <CommunityEvidenceAI
  reportsCount={reportsCount}
  heatmap={heatmap}
  onReportUnsafeZone={handleReportUnsafeZone}
  evidenceItems={evidenceItems}
  communityHazards={globalState.communityHazards}
  fetchEvidence={fetchEvidence}
/>
                </motion.div>
              )}

              {/* VIEW 3: Family Live Tracking */}
              {activeTab === 'Family Live Tracking' && (
                <motion.div
                  key="Family Live Tracking"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                 <FamilyTrackingView
  profile={profile}
  liveLocation={globalState.liveLocation}
  emergencyContacts={globalState.emergencyContacts}
  onFamilyCallUser={handleFamilyCallUser}
  onFamilySendMessage={handleFamilySendMessage}
  onFamilyEscalate={handleFamilyEscalate}
  timeStr={timeStr}
  riskScore={globalState.systemStatus.riskScore}
/>
                </motion.div>
              )}

              {/* VIEW: Emergency Contacts */}
{activeTab === "Emergency Contacts" && (
  <motion.div
    key="Emergency Contacts"
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.3 }}
  >
    <EmergencyContacts />
  </motion.div>
)}

              {/* VIEW 4: Police Dispatch View */}
              {activeTab === 'Police Dispatch View' && (
                <motion.div
                  key="Police Dispatch View"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <PoliceDispatchView
  activeAlertsCount={activeAlertsCount}
  policeAlerts={globalState.policeAlerts}
  liveLocation={globalState.liveLocation}
  onAcknowledgeAlert={handleAcknowledgeAlert}
  onDispatchUnit={handleDispatchUnit}
/>
                </motion.div>
              )}

              {/* VIEW 5: SwaShakti Analytics */}
              {activeTab === 'SwaShakti Analytics' && (
                <motion.div
                  key="SwaShakti Analytics"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <SwaShaktiAnalyticsView aiConfidence={globalState.systemStatus.aiConfidence} />
                </motion.div>
              )}

            </AnimatePresence>

          </div>

          {/* Footer bar inside main scrollable content area */}
          <footer className="px-6 py-4 border-t border-slate-200 text-center text-slate-400 text-xs flex flex-col sm:flex-row justify-between items-center bg-white shrink-0">
            <p>© 2026 SwaShakti India. Crafted for absolute women safety and emergency deterrence.</p>
            <div className="flex space-x-3 text-[11px] font-mono text-[#6C3EFF] tracking-wider mt-1 sm:mt-0 uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Satellites Linked: 5 Active</span>
            </div>
          </footer>

{showActiveSOSModal && (
<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

<div className="bg-white rounded-3xl w-[420px] p-8 shadow-2xl">

<h2 className="text-2xl font-bold text-red-600">
🚨 Emergency Already Active
</h2>

<p className="mt-4 text-gray-600">
Your emergency is already active.
Your live location is still being shared.
</p>

<div className="mt-6 space-y-3">

<div className="bg-green-50 rounded-xl p-3">
📍 Live Tracking : ON
</div>

<div className="bg-green-50 rounded-xl p-3">
👮 Police Notified
</div>

<div className="bg-green-50 rounded-xl p-3">
👨‍👩‍👧 Family Notified
</div>

</div>

<button
  onClick={handleResendAlert}
  className="w-full mb-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
>
  🔔 Re-send Emergency Alert
</button>

<div className="mt-6">

<p className="text-center text-sm text-gray-500 mb-3">
Long press if you are safe
</p>

<button
onMouseDown={startHoldResolve}
onMouseUp={cancelHoldResolve}
onMouseLeave={cancelHoldResolve}
onTouchStart={startHoldResolve}
onTouchEnd={cancelHoldResolve}
className="w-full bg-green-600 text-white rounded-xl py-4 relative overflow-hidden"
>

<div
className="absolute left-0 top-0 bottom-0 bg-green-800 transition-all"
style={{
width: `${holdProgress}%`,
}}
/>

<span className="relative z-10">
Press & Hold to Resolve
</span>

</button>

</div>

</div>

</div>
)}
          {showCountdown && (
  <SOSCountdown
    onComplete={handleCountdownComplete}
    onCancel={handleCountdownCancel}
  />
)}

        </main>

      </div>

      {/* PART A: FIXED FLOATING TELEMETRY TOGGLE BUTTON */}
      <button
        onClick={() => updateState({ isTerminalOpen: !globalState.isTerminalOpen })}
        className="fixed bottom-6 left-6 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-full px-4 py-2.5 shadow-2xl text-xs font-mono font-bold z-50 flex items-center gap-2 border border-emerald-500/30 transition-all active:scale-95 cursor-pointer"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>⚙ AI Telemetry</span>
      </button>

      {/* PART A: THE SLIDE-OUT TELEMETRY DRAWER */}
      <div 
        className={`fixed left-0 top-0 h-full w-[420px] max-w-[100vw] bg-slate-950/95 border-r border-slate-800 z-50 shadow-2xl transition-transform duration-300 ease-in-out transform flex flex-col ${
          globalState.isTerminalOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <div>
            <h3 className="text-emerald-400 font-mono text-sm font-black uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              SwaShakti AI Telemetry
            </h3>
            <p className="text-slate-500 text-xs mt-0.5 font-mono">Live backend pipeline logs</p>
          </div>
          <button 
            onClick={() => updateState({ isTerminalOpen: false })}
            className="text-slate-400 hover:text-white bg-slate-800/80 p-1.5 rounded-lg border border-slate-700/50 transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Drawer Terminal Content */}
        <div className="flex-1 bg-slate-900 text-emerald-400 font-mono text-[11px] p-4 overflow-y-auto space-y-1.5">
          {logs.map((log: string, index: number) => {
            const isAlert = log.includes('🚨') || log.includes('WARNING') || log.includes('EMERGENCY') || log.includes('ANOMALY');
            const isTrigger = log.includes('🎙️') || log.includes('⏳') || log.includes('Fake') || log.includes('[SIMULATION]') || log.includes('[SOS]');
            const colorClass = isAlert ? 'text-rose-400 font-bold' : isTrigger ? 'text-amber-400' : 'text-emerald-400';
            return (
              <div key={index} className={`leading-relaxed ${colorClass}`}>
                {log}
              </div>
            );
          })}
          <div ref={terminalEndRef} />
        </div>
      </div>

      {/* Hackathon Demo Controls Panel */}
      <div id="demo-controls-panel" className="fixed bottom-6 right-6 z-40">
        {demoPanelExpanded ? (
          <div className="bg-white shadow-2xl rounded-3xl p-5 w-80 border-2 border-purple-200 animate-slide-in relative text-slate-800">
            <button 
              onClick={() => setDemoPanelExpanded(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1 rounded-full transition-colors cursor-pointer"
              title="Minimize panel"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-2.5">
              <div className="bg-purple-100 p-1.5 rounded-xl text-purple-600 animate-pulse">
                <Zap className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="font-display font-black text-sm text-purple-900 tracking-tight">Live AI Simulation Panel</h4>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Instantly simulate AI events for judges.</p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-purple-100">
              {/* Trigger Cab Deviation */}
              <button
                id="btn-demo-cab-deviation"
                onClick={handleDemoCabDeviation}
                className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 font-bold text-xs py-2.5 px-3 rounded-xl transition-all flex items-center justify-between group cursor-pointer text-left"
              >
                <span className="flex items-center gap-1.5">
                  <Car className="h-3.5 w-3.5 text-rose-500 group-hover:scale-110 transition-transform shrink-0" />
                  <span>Trigger Cab Deviation</span>
                </span>
                <span className="text-[9px] bg-rose-200 text-rose-700 px-1.5 py-0.5 rounded-md font-mono font-bold shrink-0">Spike Risk</span>
              </button>

              {/* Trigger Distress Voice */}
              <button
                id="btn-demo-distress-voice"
                onClick={handleDemoDistressVoice}
                className="w-full bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-800 border border-amber-200 font-bold text-xs py-2.5 px-3 rounded-xl transition-all flex items-center justify-between group cursor-pointer text-left"
              >
                <span className="flex items-center gap-1.5">
                  <Mic className="h-3.5 w-3.5 text-amber-500 group-hover:scale-110 transition-transform shrink-0" />
                  <span>Trigger Distress Voice</span>
                </span>
                <span className="text-[9px] bg-amber-200 text-amber-700 px-1.5 py-0.5 rounded-md font-mono font-bold shrink-0">Bachao</span>
              </button>

              {/* Generate Community Hazard */}
              <button
                id="btn-demo-community-hazard"
                onClick={handleDemoCommunityHazard}
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 border border-emerald-200 font-bold text-xs py-2.5 px-3 rounded-xl transition-all flex items-center justify-between group cursor-pointer text-left"
              >
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-emerald-500 group-hover:scale-110 transition-transform shrink-0" />
                  <span>Generate Community Hazard</span>
                </span>
                <span className="text-[9px] bg-emerald-200 text-emerald-700 px-1.5 py-0.5 rounded-md font-mono font-bold shrink-0">Heatmap</span>
              </button>

              {/* Simulate Full SOS Chain */}
              <button
                id="btn-demo-sos-chain"
                onClick={handleDemoFullSOSChain}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white border border-transparent font-bold text-xs py-2.5 px-3 rounded-xl transition-all flex items-center justify-between shadow-md hover:shadow-lg group cursor-pointer text-left"
              >
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5 text-purple-200 group-hover:animate-bounce shrink-0" />
                  <span>Simulate Full SOS Chain</span>
                </span>
                <span className="text-[9px] bg-purple-800 text-purple-100 px-1.5 py-0.5 rounded-md font-mono font-bold shrink-0">Sequence</span>
              </button>
            </div>
            
            <div className="mt-3 text-[9px] text-slate-400 font-mono text-center flex items-center justify-center gap-1.5 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
              SwaShakti Demo Utility v2.1
            </div>
          </div>
        ) : (
          <button 
            id="btn-expand-demo"
            onClick={() => setDemoPanelExpanded(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white shadow-2xl rounded-2xl p-3 border-2 border-white flex items-center space-x-2 animate-bounce cursor-pointer"
          >
            <Zap className="h-4 w-4" />
            <span className="text-xs font-bold font-display tracking-tight">Open Demo Panel</span>
          </button>
        )}
            </div>
              
         </div>
  );
}
