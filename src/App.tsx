import { useState, useEffect } from 'react';
import Homepage from './components/Homepage';
import SetupScreen from './components/SetupScreen';
import Dashboard from './components/Dashboard';
import { UserProfile } from './types';
import { requestNotificationPermission } from "./utils/fcm";
import LoginScreen from "./components/LoginScreen";

const API_URL = import.meta.env.VITE_API_URL;

const normalizePhoneNumber = (phone: string) => {
  const cleaned = phone.trim().replace(/[\s()-]/g, "");

  if (cleaned.startsWith("+")) {
    return cleaned;
  }

  if (cleaned.startsWith("91") && cleaned.length === 12) {
    return `+${cleaned}`;
  }

  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }

  return cleaned;
};

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
      riskScore: 0,
      isSosActive: false,
      aiConfidence: 0,
      responseTime: 0,
      currentRoute: ''
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

    evidenceVault: [],
    policeAlerts: [],
    activeAlertCount: 0,
    communityHazards: [],
    systemLogs: [],
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
      phone: normalizePhoneNumber(userProfile.contact1.phone),
      relation: "Primary Guardian",
    },
    {
      name: userProfile.contact2.name,
      phone: normalizePhoneNumber(userProfile.contact2.phone),
      relation: "Secondary Guardian",
    },
  ],
}),
  });

  const result = await response.json();

console.log("🔴 REGISTER RESPONSE:", response.status, result);

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
          fullName: globalState.userProfile.name || '',
          phoneNumber: globalState.userProfile.phone || '',
          bloodGroup: globalState.userProfile.bloodGroup || '',
          city: globalState.userProfile.city || '',
            contact1: {
              name: globalState.emergencyContacts[0]?.name || '',
              phone: globalState.emergencyContacts[0]?.phone || '',
              language: globalState.emergencyContacts[0]?.language || ''
            },
            contact2: {
              name: globalState.emergencyContacts[1]?.name || '',
              phone: globalState.emergencyContacts[1]?.phone || '',
              language: globalState.emergencyContacts[1]?.language || ''
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
