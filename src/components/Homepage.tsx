import { useEffect, useState } from "react";
import { Shield, Map, Mic, ChevronRight, Sparkles, Phone, Car, Lock, Bell } from 'lucide-react';

interface HomepageProps {
  onGetStarted: () => void;
}

interface HomeData {
  appName: string;
  version: string;
  status: string;
  features: string[];
}

export default function Homepage({ onGetStarted }: HomepageProps) {
  const [homeData, setHomeData] = useState<HomeData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
  const fetchHomeData = async () => {
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/home`;

      const response = await fetch(apiUrl);

      const data = await response.json();

      setHomeData(data);
    } catch (error) {
      console.error("Fetch Error:", error);
      setError("Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  fetchHomeData();
}, []);
if (loading) {
  return (
    <div className="min-h-screen flex justify-center items-center bg-[#0A0A1A] text-white text-xl">
      Loading SwaShakti...
    </div>
  );
}
if (error) {
  return (
    <div className="min-h-screen flex justify-center items-center bg-[#0A0A1A] text-red-500 text-xl">
      {error}
    </div>
  );
}
  return (
    <div className="relative min-h-screen bg-[#0A0A1A] text-white flex flex-col justify-between overflow-hidden font-sans select-none">
      
      {/* Styles for Custom Keyframes & CSS animations */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(0.85);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.4;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }

        @keyframes shine {
          to {
            background-position: 300% center;
          }
        }

        @keyframes float-slow-1 {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(30px, -50px) scale(1.1); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        @keyframes float-slow-2 {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-40px, 40px) scale(1.15); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        @keyframes float-slow-3 {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(45px, 25px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        .animate-pulse-ring-1 {
          position: relative;
        }
        .animate-pulse-ring-1::before {
          content: '';
          position: absolute;
          top: -15px;
          left: -15px;
          right: -15px;
          bottom: -15px;
          border-radius: 9999px;
          border: 2px solid rgba(108, 62, 255, 0.45);
          animation: pulse-ring 3s cubic-bezier(0.25, 0, 0.35, 1) infinite;
        }
        .animate-pulse-ring-1::after {
          content: '';
          position: absolute;
          top: -30px;
          left: -30px;
          right: -30px;
          bottom: -30px;
          border-radius: 9999px;
          border: 1px solid rgba(108, 62, 255, 0.2);
          animation: pulse-ring 3s cubic-bezier(0.25, 0, 0.35, 1) infinite;
          animation-delay: 1s;
        }

        .animate-gradient-text {
          background: linear-gradient(to right, #c084fc, #f472b6, #818cf8, #f472b6, #c084fc);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 10s linear infinite;
        }

        .blob-1 { animation: float-slow-1 20s ease-in-out infinite; }
        .blob-2 { animation: float-slow-2 24s ease-in-out infinite; }
        .blob-3 { animation: float-slow-3 18s ease-in-out infinite; }
        .blob-4 { animation: float-slow-1 28s ease-in-out infinite-reverse; }
        .blob-5 { animation: float-slow-2 22s ease-in-out infinite-reverse; }

        .fade-in-slide {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Floating Ambient Background Blobs (5 soft glowing divs) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="blob-1 absolute top-[10%] left-[5%] w-[320px] h-[320px] bg-purple-600/10 rounded-full blur-[90px]" />
        <div className="blob-2 absolute top-[35%] right-[5%] w-[380px] h-[380px] bg-indigo-600/10 rounded-full blur-[100px]" />
        <div className="blob-3 absolute bottom-[15%] left-[15%] w-[300px] h-[300px] bg-pink-600/10 rounded-full blur-[80px]" />
        <div className="blob-4 absolute bottom-[5%] right-[20%] w-[340px] h-[340px] bg-violet-600/10 rounded-full blur-[95px]" />
        <div className="blob-5 absolute top-[65%] left-[45%] w-[290px] h-[290px] bg-indigo-500/8 rounded-full blur-[85px]" />
      </div>

      {/* Header Bar */}
      <header className="relative z-10 px-6 py-5 max-w-7xl mx-auto w-full flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-[#6C3EFF]/20 border border-[#6C3EFF]/30 p-2 rounded-xl text-[#8F66FF]">
            <Shield className="h-6 w-6" />
          </div>
          <span className="font-display font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            {homeData?.appName}
          </span>
        </div>
        <div className="flex items-center space-x-1 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
          <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse mr-2" />
          <span className="text-xs font-mono tracking-widest text-slate-300 font-medium">{homeData?.status}</span>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto w-full pt-8 pb-12">
        
        {/* Animated Pulsing Shield Beacon */}
        <div className="mb-10 relative flex justify-center items-center">
          <div className="animate-pulse-ring-1 relative flex items-center justify-center bg-gradient-to-tr from-[#6C3EFF] to-[#a855f7] p-6 rounded-full shadow-[0_0_50px_rgba(108,62,255,0.4)]">
            <Shield className="h-[80px] w-[80px] text-white filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]" />
          </div>
        </div>

        {/* Hero Title */}
        <div className="fade-in-slide" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-5xl md:text-7xl font-extrabold font-display leading-[1.1] tracking-tight mb-6">
            <span className="animate-gradient-text block">Your Safety. Your Power.</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="fade-in-slide text-slate-300 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed font-sans" style={{ animationDelay: '0.3s' }}>
          SwaShakti uses AI to protect you in real time — smart routes, instant SOS, and a guardian that never sleeps.
        </p>

        {/* CTA Get Started Button */}
        <div className="fade-in-slide mb-10" style={{ animationDelay: '0.5s' }}>
          <button
            id="btn-get-started"
            onClick={onGetStarted}
            className="group relative inline-flex items-center justify-center bg-[#6C3EFF] hover:bg-[#5B30E5] text-white font-semibold text-lg px-8 py-4 rounded-2xl shadow-[0_4px_25px_rgba(108,62,255,0.45)] hover:shadow-[0_0_35px_rgba(108,62,255,0.7)] transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 cursor-pointer overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Get Started — It's Free
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </button>
        </div>

        {/* Scrolling Ticker Strip */}
        <div className="w-full overflow-hidden bg-white/5 border-y border-white/5 py-3.5 mb-14 backdrop-blur-sm">
          <div className="animate-marquee flex whitespace-nowrap gap-12 text-xs font-mono tracking-wider text-purple-300">
            <span>🛡 92% AI Accuracy · 🌐 8 Indian Languages Supported · 🚨 SOS in under 2 seconds · 📍 Real-time GPS Landmark AI · 👮 Integrated with Police Dispatch · 🔒 Evidence Auto-Encrypted</span>
            <span>🛡 92% AI Accuracy · 🌐 8 Indian Languages Supported · 🚨 SOS in under 2 seconds · 📍 Real-time GPS Landmark AI · 👮 Integrated with Police Dispatch · 🔒 Evidence Auto-Encrypted</span>
            <span>🛡 92% AI Accuracy · 🌐 8 Indian Languages Supported · 🚨 SOS in under 2 seconds · 📍 Real-time GPS Landmark AI · 👮 Integrated with Police Dispatch · 🔒 Evidence Auto-Encrypted</span>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="w-full max-w-4xl mx-auto mb-16 text-center space-y-10">
          <div className="space-y-2">
            <h2 className="font-display font-black text-2xl md:text-3xl tracking-tight text-white">How It Works</h2>
            <p className="text-slate-400 text-xs max-w-md mx-auto">SwaShakti operates continuously to ensure a seamless security envelope.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative flex flex-col justify-between hover:border-purple-500/30 transition-all text-left">
              <span className="font-display font-black text-5xl text-[#6C3EFF]/30 absolute top-4 right-6 select-none">1</span>
              <div className="mt-4">
                <h4 className="font-display font-extrabold text-base text-purple-200 mb-1.5">Configure</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Set up your profile & emergency contacts (60 seconds)
                </p>
              </div>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative flex flex-col justify-between hover:border-purple-500/30 transition-all text-left">
              <span className="font-display font-black text-5xl text-[#6C3EFF]/30 absolute top-4 right-6 select-none">2</span>
              <div className="mt-4">
                <h4 className="font-display font-extrabold text-base text-purple-200 mb-1.5">Monitor</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  AI monitors your route, audio & location in the background
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative flex flex-col justify-between hover:border-purple-500/30 transition-all text-left">
              <span className="font-display font-black text-5xl text-[#6C3EFF]/30 absolute top-4 right-6 select-none">3</span>
              <div className="mt-4">
                <h4 className="font-display font-extrabold text-base text-purple-200 mb-1.5">SOS Dispatch</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  One tap or voice trigger sends SOS to contacts + police
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Features Grid (3x2 Grid) */}
        <div className="w-full max-w-4xl mx-auto mb-16 text-center space-y-10">
          <div className="space-y-2">
            <h2 className="font-display font-black text-2xl md:text-3xl tracking-tight text-white">Core AI Safety Engine</h2>
            <p className="text-slate-400 text-xs max-w-md mx-auto">Intelligent features working in synergy to provide real-time deterrence.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* 1. AI Safe Routes */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all flex flex-col space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Map className="h-5 w-5" />
              </div>
              <h4 className="font-display font-bold text-sm text-white">AI Safe Routes</h4>
              <p className="text-slate-400 text-xs leading-relaxed">Computes dynamically illuminated pedestrian transit passages.</p>
            </div>

            {/* 2. Voice Trigger */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all flex flex-col space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Mic className="h-5 w-5" />
              </div>
              <h4 className="font-display font-bold text-sm text-white">Voice Trigger</h4>
              <p className="text-slate-400 text-xs leading-relaxed">Analyzes real-time microphone stream to identify regional stress signals.</p>
            </div>

            {/* 3. Fake Call */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all flex flex-col space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Phone className="h-5 w-5" />
              </div>
              <h4 className="font-display font-bold text-sm text-white">Fake Call</h4>
              <p className="text-slate-400 text-xs leading-relaxed">Fires incoming realistic maternal phone call script to deter immediate focus.</p>
            </div>

            {/* 4. Cab Guardian */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all flex flex-col space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Car className="h-5 w-5" />
              </div>
              <h4 className="font-display font-bold text-sm text-white">Cab Guardian</h4>
              <p className="text-slate-400 text-xs leading-relaxed">Warns with 15-second response timers upon deviation from known transit route corridors.</p>
            </div>

            {/* 5. Evidence Vault */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all flex flex-col space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Lock className="h-5 w-5" />
              </div>
              <h4 className="font-display font-bold text-sm text-white">Evidence Vault</h4>
              <p className="text-slate-400 text-xs leading-relaxed">Saves encrypted, multi-layered audio recordings straight into decentralized vaults.</p>
            </div>

            {/* 6. Police Dispatch AI */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all flex flex-col space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Bell className="h-5 w-5" />
              </div>
              <h4 className="font-display font-bold text-sm text-white">Police Dispatch AI</h4>
              <p className="text-slate-400 text-xs leading-relaxed">Interfaces dispatch consoles directly with nearest urban police patrol beats.</p>
            </div>
          </div>
        </div>

        {/* Feature Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl text-left">
          
          {/* Feature 1: Instant SOS */}
          <div id="feature-card-sos" className="fade-in-slide bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 rounded-2xl p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 group" style={{ animationDelay: '0.6s' }}>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:bg-[#6C3EFF]/20 group-hover:text-[#a855f7] transition-colors">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="font-display font-bold text-lg mb-2 text-white">Instant SOS</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              One tap sends your location to 3 emergency contacts.
            </p>
          </div>

          {/* Feature 2: AI Safe Routes */}
          <div id="feature-card-routes" className="fade-in-slide bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/30 rounded-2xl p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 group" style={{ animationDelay: '0.7s' }}>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:bg-[#6C3EFF]/20 group-hover:text-indigo-300 transition-colors">
              <Map className="h-6 w-6" />
            </div>
            <h3 className="font-display font-bold text-lg mb-2 text-white">AI Safe Routes</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Avoids dark, isolated streets automatically.
            </p>
          </div>

          {/* Feature 3: Voice Trigger */}
          <div id="feature-card-voice" className="fade-in-slide bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink-500/30 rounded-2xl p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 group" style={{ animationDelay: '0.8s' }}>
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-4 group-hover:bg-[#6C3EFF]/20 group-hover:text-pink-300 transition-colors">
              <Mic className="h-6 w-6" />
            </div>
            <h3 className="font-display font-bold text-lg mb-2 text-white">Voice Trigger</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Recognizes 'Bachao', 'Help', 'Madad' in 8 languages.
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-6 border-t border-white/5 text-center text-slate-500 text-xs flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto w-full">
        <p className="mb-2 sm:mb-0">  © 2026 {homeData?.appName} • v{homeData?.version}</p>
        <div className="flex space-x-4">
          <span className="flex items-center text-[#8F66FF]">
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            Empowering women nationwide
          </span>
        </div>
      </footer>
    </div>
  );
}
