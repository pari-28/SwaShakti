import { useState, useEffect } from 'react';
import Homepage from './components/Homepage';
import SetupScreen from './components/SetupScreen';
import Dashboard from './components/Dashboard';
import { UserProfile } from './types';
import { requestNotificationPermission } from "./utils/fcm";
import LoginScreen from "./components/LoginScreen";

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [globalState, setGlobalState] = useState<any>({
    appState: 'landing',           // landing | login | setup | dashboard
    activeView: 'user',            // 'user' | 'community' | 'family' | 'police' | 'analytics'
    userProfile: { name: '', phone: '', bloodGroup: '', city: '' },
    emergencyContacts: [
      { name: '', phone: '', language: 'Hindi' },
      { name: '', phone: '', language: 'English' }
    ],
    systemStatus: {
      riskScore: 14,
      isSosActive: false,
      aiConfidence: 96,
      responseTime: 0.8,
      currentRoute: 'A'
    },
    cabSimulation: {
      isDeviating: false,
      countdown: 15,
      warningActive: false,
      completed: false
    },
    audioMonitor: {
  status: 'listening',
  detectedIntent: '',
  confidence: 0,
  waveformAlert: false
},

liveLocation: {
  latitude: 0,
  longitude: 0,
},

evidenceVault: [
      { id: '1', file: 'SOS_Audio_01.mp3', status: 'Encrypted', transcript: 'Please leave me alone', confidence: '98%' },
      { id: '2', file: 'Video_Clip_02.mp4', status: 'Encrypted', transcript: 'Motion detected, 2 persons', confidence: '94%' },
      { id: '3', file: 'Location_Log_03.json', status: 'Encrypted', transcript: 'Route deviation: 520m', confidence: '99%' }
    ],
    policeAlerts: [
      { id: '1', message: 'EMERGENCY: Female in distress — MP Nagar', status: 'active', timestamp: '20:47:03' },
      { id: '2', message: 'Community Report: Unsafe zone flagged — TT Nagar', status: 'acknowledged', timestamp: '20:31:17' },
      { id: '3', message: 'Guardian Alert: Cab deviation, DB Mall Road', status: 'acknowledged', timestamp: '20:12:44' }
    ],
    activeAlertCount: 3,
    communityHazards: [
      { id: 1, label: 'MP Nagar', risk: 'danger' },
      { id: 2, label: 'TT Nagar', risk: 'warning' },
      { id: 3, label: 'Arera Colony', risk: 'safe' }
    ],
    systemLogs: [
      { time: '20:47:00', message: 'SwaShakti Core initialized. Secure handshake completed.' },
      { time: '20:47:01', message: 'Guardian AI activated. Monitoring GPS signal.' },
      { time: '20:47:02', message: 'Calculating local Safety Score from crowd + lighting data.' }
    ],
    isTerminalOpen: false,
    workspaceTint: false
  });


  const updateState = (patch: any) => setGlobalState((prev: any) => ({ ...prev, ...patch }));
  const updateNested = (key: string, patch: any) => setGlobalState((prev: any) => ({ 
    ...prev, [key]: { ...prev[key], ...patch } 
  }));
  const pushLog = (message: string) => setGlobalState((prev: any) => ({
    ...prev,
    systemLogs: [...prev.systemLogs, {
      time: new Date().toTimeString().slice(0,8),
      message
    }].slice(-80)  // keep last 80 logs max
  }));

  // PART D: LIVE MICRO-FLUCTUATION ENGINE
  useEffect(() => {
    let tickCount = 0;
    const interval = setInterval(() => {
      tickCount += 1;
      
      setGlobalState((prev: any) => {
        const isSosActive = prev.systemStatus.isSosActive;
        const currentRisk = prev.systemStatus.riskScore;

        // 1. Drift aiConfidence between 94 and 97
        const newConfidence = Math.floor(Math.random() * 4) + 94;

        // 2. Drift responseTime between 0.7 and 1.2 (not during SOS)
        let newResponseTime = prev.systemStatus.responseTime;
        if (!isSosActive) {
          newResponseTime = parseFloat((Math.random() * (1.2 - 0.7) + 0.7).toFixed(1));
        }

        // 3. If isSosActive is false and riskScore < 20: randomly nudge riskScore +-1 (floor: 10, ceiling: 20)
        let newRiskScore = currentRisk;
        if (!isSosActive && currentRisk < 20) {
          const nudge = Math.random() > 0.5 ? 1 : -1;
          newRiskScore = Math.min(20, Math.max(10, currentRisk + nudge));
        }

        const nextStatus = {
          ...prev.systemStatus,
          aiConfidence: newConfidence,
          responseTime: newResponseTime,
          riskScore: newRiskScore
        };

        let nextLogs = prev.systemLogs;
        // 4. Randomly push one of the ambient logs every 8 seconds (every 2 ticks)
        if (tickCount % 2 === 0) {
          const ambientLogTemplates = [
            "[GUARDIAN] GPS signal stable. No anomalies.",
            "[LIGHTING] Street illumination index: 89/100.",
            "[CROWD] Density factor updated: 0.84 (Route A).",
            "[BHASHINI] Language engine: 4 active listeners.",
            "[ROUTE AI] Safety score recalculated. Route A: 92/100."
          ];
          const randomTemplate = ambientLogTemplates[Math.floor(Math.random() * ambientLogTemplates.length)];
          const time = new Date().toTimeString().slice(0, 8);
          nextLogs = [...prev.systemLogs, { time, message: randomTemplate }].slice(-80);
        }

        return {
          ...prev,
          systemStatus: nextStatus,
          systemLogs: nextLogs
        };
      });

    }, 4000);

    return () => clearInterval(interval);
  }, []);



  // Handle successful safety registration
  const handleRegisterProfile = async (userProfile: UserProfile) => {
    try {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
  fullName: userProfile.fullName,
  email: userProfile.email,
  password: userProfile.password,
  phone: userProfile.phoneNumber,

  emergencyContacts: [
    {
      name: userProfile.contact1.name,
      phone: userProfile.contact1.phone,
      relation: "Primary Guardian",
    },
    {
      name: userProfile.contact2.name,
      phone: userProfile.contact2.phone,
      relation: "Secondary Guardian",
    },
  ],
}),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    alert(result.message || "Registration failed");
    return;
  }
  const jwtToken = result.data.token;

localStorage.setItem("token", jwtToken);

localStorage.setItem(
  "user",
  JSON.stringify(result.data.user)
);

const fcmToken = await requestNotificationPermission();

if (fcmToken) {
  const saveTokenResponse = await fetch(`${API_URL}/api/auth/fcm-token`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
  },
  body: JSON.stringify({
    token: fcmToken,
  }),
});

  if (!saveTokenResponse.ok) {
    console.error("Failed to save FCM token");
  }
}

    updateState({
      appState: 'dashboard',
      userProfile: {
        name: userProfile.fullName,
        phone: userProfile.phoneNumber,
        bloodGroup: userProfile.bloodGroup,
        city: userProfile.city
      },
      emergencyContacts: [
        {
          name: userProfile.contact1.name,
          phone: userProfile.contact1.phone,
          language: userProfile.contact1.language
        },
        {
          name: userProfile.contact2.name,
          phone: userProfile.contact2.phone,
          language: userProfile.contact2.language
        }
      ]
    });
    } catch (error) {
  console.error(error);
  alert("Something went wrong while registering.");
}
  };

  const handleLogin = async (
  email: string,
  password: string
) => {
  try {
    const response = await fetch(
      `${API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type":"application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      alert(result.message);
      return;
    }

    const jwtToken = result.data.token;

    localStorage.setItem(
      "token",
      jwtToken
    );

    localStorage.setItem(
      "user",
      JSON.stringify(result.data.user)
    );

    updateState({
      appState:"dashboard",

      userProfile:{
        name:result.data.user.fullName,
        phone:result.data.user.phone,
      }
    });

  } catch(err){

    console.error(err);

    alert("Login failed.");

  }
};

useEffect(() => {
  const checkLogin = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const response = await fetch(
        `${API_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return;
      }

      updateState({
        appState: "dashboard",
        userProfile: {
          name: result.data.fullName,
          phone: result.data.phone,
          bloodGroup: result.data.bloodGroup || "",
          city: result.data.city || "",
        },
      });

    } catch (err) {
      console.error(err);
    }
  };

  checkLogin();

}, []);

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  updateState({
    appState: "login",
    userProfile: {
      name: "",
      phone: "",
      bloodGroup: "",
      city: "",
    },
  });
};

  // If we launch straight to dashboard or need standard demo data populated
  useEffect(() => {
    if (globalState.appState === 'dashboard' && !globalState.userProfile.name) {
      updateState({
        userProfile: {
          name: 'Priya Sharma',
          phone: '9876543210',
          bloodGroup: 'O+',
          city: 'Mumbai'
        },
        emergencyContacts: [
          {
            name: 'Aarav Sharma (Father)',
            phone: '9812345678',
            language: 'Hindi'
          },
          {
            name: 'Kriti Verma (Best Friend)',
            phone: '9898765432',
            language: 'English'
          }
        ]
      });
    }
  }, [globalState.appState]);

  return (
    <div className="min-h-screen">
      {globalState.appState === 'landing' && (
        <Homepage
    onGetStarted={() =>
        updateState({
            appState:"login"
        })
    }
/>
      )}

      {globalState.appState === 'setup' && (
        <SetupScreen 
          onBack={() => updateState({ appState: 'landing' })} 
          onSubmit={handleRegisterProfile} 
        />
      )}
      {globalState.appState === "login" && (
  <LoginScreen
    onLogin={handleLogin}
    onRegister={() =>
      updateState({
        appState: "setup",
      })
    }
  />
)}

      {globalState.appState === 'dashboard' && (
        <Dashboard 
          globalState={globalState}
          updateState={updateState}
          updateNested={updateNested}
          pushLog={pushLog}
          profile={{
            fullName: globalState.userProfile.name || 'Priya Sharma',
            phoneNumber: globalState.userProfile.phone || '9876543210',
            bloodGroup: globalState.userProfile.bloodGroup || 'O+',
            city: globalState.userProfile.city || 'Mumbai',
            contact1: {
              name: globalState.emergencyContacts[0]?.name || 'Aarav Sharma (Father)',
              phone: globalState.emergencyContacts[0]?.phone || '9812345678',
              language: globalState.emergencyContacts[0]?.language || 'Hindi'
            },
            contact2: {
              name: globalState.emergencyContacts[1]?.name || 'Kriti Verma (Best Friend)',
              phone: globalState.emergencyContacts[1]?.phone || '9898765432',
              language: globalState.emergencyContacts[1]?.language || 'English'
            }
          }}
          onReset={() => updateState({ appState: 'setup' })}
          onGoHome={() => updateState({ appState: 'landing' })}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
