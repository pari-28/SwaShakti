import React, { useState } from 'react';
import { Shield, MapPin, Check, ArrowLeft, Sparkles, AlertCircle, PhoneCall } from 'lucide-react';
import { UserProfile } from '../types';

interface SetupScreenProps {
  onBack: () => void;
  onSubmit: (profile: UserProfile) => void;
}

export default function SetupScreen({ onBack, onSubmit }: SetupScreenProps) {
  // Local form states
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [city, setCity] = useState('');

  // Contact 1
  const [c1Name, setC1Name] = useState('');
  const [c1Phone, setC1Phone] = useState('');
  const [c1Lang, setC1Lang] = useState('Hindi');

  // Contact 2
  const [c2Name, setC2Name] = useState('');
  const [c2Phone, setC2Phone] = useState('');
  const [c2Lang, setC2Lang] = useState('English');

  // Error state
  const [error, setError] = useState('');

  // Calculate current active step based on form progression
  const isProfileComplete = fullName.trim() !== '' && phoneNumber.trim() !== '' && city.trim() !== '';
  const isContactsComplete = isProfileComplete && c1Name.trim() !== '' && c1Phone.trim() !== '' && c2Name.trim() !== '' && c2Phone.trim() !== '';
  
  let currentStep = 1; // Profile
  if (isContactsComplete) {
    currentStep = 3; // Launch
  } else if (isProfileComplete) {
    currentStep = 2; // Contacts
  }

  // Quick fill function for testing
  const fillDemoData = () => {
    setFullName('Priya Sharma');
    setPhoneNumber('9876543210');
    setBloodGroup('O+');
    setCity('Mumbai');
    
    setC1Name('Aarav Sharma (Father)');
    setC1Phone('9812345678');
    setC1Lang('Hindi');

    setC2Name('Kriti Verma (Best Friend)');
    setC2Phone('9898765432');
    setC2Lang('English');

    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Validation
    if (!fullName.trim() || !phoneNumber.trim() || !city.trim() || !c1Name.trim() || !c1Phone.trim() || !c2Name.trim() || !c2Phone.trim()) {
      setError('Please fill in all safety profiles and both emergency contacts.');
      return;
    }

    if (phoneNumber.length < 10 || c1Phone.length < 10 || c2Phone.length < 10) {
      setError('Phone numbers must be at least 10 digits long.');
      return;
    }

    setError('');

    // Compile profile
    const profile: UserProfile = {
      fullName,
      phoneNumber,
      bloodGroup,
      city,
      contact1: {
        name: c1Name,
        phone: c1Phone,
        language: c1Lang
      },
      contact2: {
        name: c2Name,
        phone: c2Phone,
        language: c2Lang
      }
    };

    onSubmit(profile);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-800 flex flex-col justify-between py-10 px-4 font-sans relative animate-slide-in">
      <style>{`
        @keyframes slide-in-right {
          0% {
            opacity: 0;
            transform: translateX(30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in-right 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      
      {/* Header bar back button */}
      <div className="max-w-4xl mx-auto w-full mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-500 hover:text-[#6C3EFF] transition-colors font-medium text-sm cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Main Card Container */}
      <div className="max-w-[680px] w-full mx-auto bg-white rounded-3xl shadow-[0_10px_40px_rgba(108,62,255,0.06)] border border-slate-100 overflow-hidden flex-grow flex flex-col md:flex-row">
        
        {/* LEFT PANEL */}
        <div className="md:w-[42%] bg-[#12122b] text-white p-8 flex flex-col justify-between relative overflow-hidden">
          
          {/* Subtle grid pattern behind */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:16px_16px]" />
          
          <div className="relative z-10 flex flex-col space-y-6">
            {/* SwaShakti Logo */}
            <div className="flex items-center space-x-2">
              <div className="bg-[#6C3EFF] p-2 rounded-xl text-white">
                <Shield className="h-5 w-5" />
              </div>
              <div className="bg-purple-500/20 p-1.5 rounded-lg text-purple-300">
                <MapPin className="h-4 w-4" />
              </div>
              <span className="font-display font-extrabold text-lg tracking-tight">SwaShakti</span>
            </div>

            {/* Typography */}
            <div className="mt-4">
              <h2 className="font-display font-extrabold text-2xl leading-tight text-white mb-2">
                Set Up Your Safety Profile
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed font-light">
                This takes 60 seconds. It could save your life.
              </p>
            </div>

            {/* Checklist steps */}
            <div className="space-y-4 mt-8">
              <div className="flex items-start space-x-3">
                <div className="mt-0.5 bg-emerald-500/20 text-emerald-400 p-1 rounded-full border border-emerald-500/30">
                  <Check className="h-3 w-3" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">Personal Details</h4>
                  <p className="text-[11px] text-slate-400">Specify blood group and location city</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="mt-0.5 bg-emerald-500/20 text-emerald-400 p-1 rounded-full border border-emerald-500/30">
                  <Check className="h-3 w-3" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">Emergency Guardians</h4>
                  <p className="text-[11px] text-slate-400">Two contacts alerted in danger</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="mt-0.5 bg-emerald-500/20 text-emerald-400 p-1 rounded-full border border-emerald-500/30">
                  <Check className="h-3 w-3" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">SOS Trigger Phrase</h4>
                  <p className="text-[11px] text-slate-400">Voice-activated multi-lingual shield</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10 mt-10">
            <div className="flex items-center space-x-2 text-purple-300 text-xs">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>Secured with AES-256 local shield</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - FORM */}
        <div className="flex-1 p-8 flex flex-col justify-between">
          <div>
            {/* Step Indicators (3 dots: Profile -> Contacts -> Launch) */}
            <div className="mb-6 flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2.5 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Progression</span>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-extrabold transition-all duration-300 ${currentStep >= 1 ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-200 text-slate-500'}`}>
                    1
                  </div>
                  <span className={`text-[10px] font-black tracking-wide ${currentStep === 1 ? 'text-purple-700' : 'text-slate-400'}`}>Profile</span>
                </div>
                <span className="text-slate-300 text-xs font-light">→</span>
                <div className="flex items-center space-x-1">
                  <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-extrabold transition-all duration-300 ${currentStep >= 2 ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-200 text-slate-500'}`}>
                    2
                  </div>
                  <span className={`text-[10px] font-black tracking-wide ${currentStep === 2 ? 'text-purple-700' : 'text-slate-400'}`}>Contacts</span>
                </div>
                <span className="text-slate-300 text-xs font-light">→</span>
                <div className="flex items-center space-x-1">
                  <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-extrabold transition-all duration-300 ${currentStep >= 3 ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-200 text-slate-500'}`}>
                    3
                  </div>
                  <span className={`text-[10px] font-black tracking-wide ${currentStep === 3 ? 'text-purple-700' : 'text-slate-400'}`}>Launch</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6C3EFF]">Safety Registration</span>
              <button
                type="button"
                onClick={fillDemoData}
                className="text-xs font-medium text-[#6C3EFF] hover:text-[#5B30E5] bg-[#6C3EFF]/5 hover:bg-[#6C3EFF]/10 border border-[#6C3EFF]/10 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                ⚡ Fill Demo Data
              </button>
            </div>

            {error && (
              <div className="mb-5 bg-rose-50 border border-rose-100 text-rose-600 p-3.5 rounded-xl text-xs flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Profile Identity section */}
              <div className="space-y-3.5">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-1.5">
                  1. Profile Identity
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Full Name</label>
                    <input
                      id="input-fullname"
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C3EFF]/20 focus:border-[#6C3EFF] focus:bg-white transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Phone Number</label>
                    <input
                      id="input-phone"
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C3EFF]/20 focus:border-[#6C3EFF] focus:bg-white transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Blood Group</label>
                    <select
                      id="select-bloodgroup"
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C3EFF]/20 focus:border-[#6C3EFF] focus:bg-white transition-all cursor-pointer"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Home / Current City</label>
                    <input
                      id="input-city"
                      type="text"
                      required
                      placeholder="e.g. Mumbai, Maharashtra"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C3EFF]/20 focus:border-[#6C3EFF] focus:bg-white transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact 1 */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                  <PhoneCall className="h-3 w-3 text-purple-500" />
                  2. Primary Guardian (Contact 1)
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Guardian Name</label>
                    <input
                      id="input-c1name"
                      type="text"
                      required
                      placeholder="Father, mother, spouse, friend"
                      value={c1Name}
                      onChange={(e) => setC1Name(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C3EFF]/20 focus:border-[#6C3EFF] focus:bg-white transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Mobile Number</label>
                    <input
                      id="input-c1phone"
                      type="tel"
                      required
                      placeholder="e.g. 9812345678"
                      value={c1Phone}
                      onChange={(e) => setC1Phone(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C3EFF]/20 focus:border-[#6C3EFF] focus:bg-white transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Alert Language</label>
                    <select
                      id="select-c1lang"
                      value={c1Lang}
                      onChange={(e) => setC1Lang(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C3EFF]/20 focus:border-[#6C3EFF] focus:bg-white transition-all cursor-pointer"
                    >
                      {['Hindi', 'English', 'Tamil', 'Telugu', 'Bengali', 'Marathi'].map((lang) => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Emergency Contact 2 */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                  <PhoneCall className="h-3 w-3 text-purple-500" />
                  3. Backup Guardian (Contact 2)
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Guardian Name</label>
                    <input
                      id="input-c2name"
                      type="text"
                      required
                      placeholder="Friend, family, local mentor"
                      value={c2Name}
                      onChange={(e) => setC2Name(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C3EFF]/20 focus:border-[#6C3EFF] focus:bg-white transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Mobile Number</label>
                    <input
                      id="input-c2phone"
                      type="tel"
                      required
                      placeholder="e.g. 9898765432"
                      value={c2Phone}
                      onChange={(e) => setC2Phone(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C3EFF]/20 focus:border-[#6C3EFF] focus:bg-white transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Alert Language</label>
                    <select
                      id="select-c2lang"
                      value={c2Lang}
                      onChange={(e) => setC2Lang(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C3EFF]/20 focus:border-[#6C3EFF] focus:bg-white transition-all cursor-pointer"
                    >
                      {['Hindi', 'English', 'Tamil', 'Telugu', 'Bengali', 'Marathi'].map((lang) => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  id="btn-submit-setup"
                  type="submit"
                  className="w-full bg-[#6C3EFF] hover:bg-[#5B30E5] text-white font-semibold py-3.5 px-4 rounded-xl shadow-[0_4px_20px_rgba(108,62,255,0.3)] hover:shadow-[0_4px_25px_rgba(108,62,255,0.45)] transition-all cursor-pointer text-sm text-center flex items-center justify-center space-x-2"
                >
                  <Shield className="h-4 w-4" />
                  <span>Activate Shield & Launch Dashboard</span>
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center text-slate-400 text-xs mt-6">
        SwaShakti utilizes standard local encryption. Your contacts and information are never shared.
      </footer>
    </div>
  );
}
