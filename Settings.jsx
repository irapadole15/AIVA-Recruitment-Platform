import React from "react";
import { Lock, Bell, Sliders, ArrowLeft, Settings as Cog } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: <Lock className="w-6 h-6 text-pink-400" />,
    title: "Security & Privacy",
    desc: "Manage access and permissions"
  },
  {
    icon: <Bell className="w-6 h-6 text-purple-400" />,
    title: "Notifications",
    desc: "Configure alerts and updates"
  },
  {
    icon: <Sliders className="w-6 h-6 text-cyan-400" />,
    title: "Customization",
    desc: "Personalize your experience"
  }
];

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#16161c] flex flex-col items-center py-20 px-4">
      {/* Top Icon */}
      <div className="mb-6 flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-md">
          <Cog className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Heading */}
      <h1
        className="text-4xl font-bold text-[#E6A2FF] mb-2 text-center"
        style={{ letterSpacing: "-0.04em" }}
      >
        Settings Center
      </h1>

      {/* Coming Soon */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse" />
        <span className="text-pink-300 font-semibold text-base">Coming Soon</span>
        <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
      </div>

      {/* Subtitle/Description */}
      <div className="text-[#B9BAC3] mb-10 max-w-xl text-center text-sm sm:text-base">
        Customize your recruitment experience to perfection. Our comprehensive settings panel will allow you to configure preferences, manage integrations, and personalize your dashboard workflow.
      </div>

      {/* Feature Cards */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-[#232129] rounded-xl p-6 flex flex-col items-start shadow-[0_4px_24px_0_rgba(32,24,40,0.08)] border border-[#353241] min-h-[140px] hover:shadow-[0_8px_32px_0_rgba(186,162,255,0.10)] transition-shadow"
          >
            <div className="mb-4">{f.icon}</div>
            <div className="text-lg font-semibold text-pink-200 mb-1">{f.title}</div>
            <div className="text-xs text-[#B9BAC3]">{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)} // Go back to previous page
        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-base shadow-md hover:from-pink-400 hover:to-purple-400 transition"
      >
        <ArrowLeft className="w-5 h-5 text-white" />
        Back to Dashboard
      </button>
    </div>
  );
};

export default Settings;



