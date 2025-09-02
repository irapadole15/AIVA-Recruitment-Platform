// import React from 'react';
// import { AlarmClock, Users, CheckCircle2, ArrowDown, ArrowUp } from 'lucide-react';

// const ratings = [
//   { label: "Time to Hire", value: 18.5, subText: "Average days", change: -2.3, icon: AlarmClock },
//   { label: "Interview Rate", value: "67%", subText: "Application to Interview", change: 5, icon: Users },
//   { label: "Success Rate", value: "24%", subText: "Offer to hire conversion", change: 3, icon: CheckCircle2 },
// ];

// const accentColors = {
//   "Time to Hire": "text-pink-500",
//   "Interview Rate": "text-blue-500",
//   "Success Rate": "text-green-500",
// };

// const SingleRateCard = ({ label, value, subText, change, icon: Icon }) => {
//   const isDecrease = change < 0;
//   const changeColor = isDecrease ? "text-red-500" : "text-green-500";

//   return (
//     <div className="w-full bg-[#1A1A23] border border-[#353241] rounded-xl shadow-[0_4px_18px_0_rgba(32,24,40,0.10)] p-5">
//       <div className="flex items-center justify-between mb-2">
//         <h3 className="text-sm font-bold text-white">{label}</h3>
//         <Icon size={20} className="text-gray-400" />
//       </div>
//       <div className={`text-2xl font-bold mb-1 ${accentColors[label]}`}>{value}</div>
//       <div className="text-xs text-gray-500 mb-2">{subText}</div>
//       <div className="flex items-center text-xs">
//         {isDecrease ? <ArrowDown size={12} className={changeColor} /> : <ArrowUp size={12} className={changeColor} />}
//         <span className={changeColor}>{Math.abs(change)}% from last month</span>
//       </div>
//     </div>
//   );
// };

// const RateCardGrid = () => (
//   <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
//     {ratings.map((r, i) => (
//       <SingleRateCard key={i} {...r} />
//     ))}
//   </div>
// );

// export default RateCardGrid;

import React, { useEffect, useState } from 'react';
import { AlarmClock, Users, CheckCircle2, ArrowDown, ArrowUp } from 'lucide-react';
import axios from 'axios';

const accentColors = {
  "Time to Hire": "text-pink-500",
  "Interview Rate": "text-blue-500",
  "Success Rate": "text-green-500",
};

const SingleRateCard = ({ label, value, subText, change, icon: Icon }) => {
  const isDecrease = change < 0;
  const changeColor = isDecrease ? "text-red-500" : "text-green-500";

  return (
    <div className="w-full bg-[#1a1a24] border border-[#353241] rounded-xl shadow p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-white">{label}</h3>
        <Icon size={20} className="text-gray-400" />
      </div>
      <div className={`text-2xl font-bold mb-1 ${accentColors[label]}`}>{value}</div>
      <div className="text-xs text-gray-400 mb-2">{subText}</div>
      <div className="flex items-center text-xs">
        {isDecrease ? <ArrowDown size={12} className={changeColor} /> : <ArrowUp size={12} className={changeColor} />}
        <span className={changeColor}>{Math.abs(change)}% from last month</span>
      </div>
    </div>
  );
};

const RateCardGrid = ({ recruiterId }) => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Temporary static change data:
  const changes = {
    timeToHire: -2.3,
    interviewRate: 5,
    successRate: 3,
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/recruiter/${recruiterId}/kpi-stats`);
        if (data.success) {
          setStats(data.stats);
          setError(null);
        } else {
          setError('Failed to fetch KPI stats');
        }
      } catch {
        setError('Failed to fetch KPI stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [recruiterId]);

  if (loading) {
    return <div className="text-white p-4 text-center">Loading stats...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4 text-center">{error}</div>;
  }

  const ratings = [
    {
      label: "Time to Hire",
      value: stats ? `${stats.timeToHire} days` : "N/A",
      subText: "Average days",
      change: changes.timeToHire,
      icon: AlarmClock,
    },
    {
      label: "Interview Rate",
      value: stats ? `${stats.interviewRate}%` : "N/A",
      subText: "Application to Interview",
      change: changes.interviewRate,
      icon: Users,
    },
    {
      label: "Success Rate",
      value: stats ? `${stats.successRate}%` : "N/A",
      subText: "Offer to hire conversion",
      change: changes.successRate,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {ratings.map((r, i) => (
        <SingleRateCard key={i} {...r} />
      ))}
    </div>
  );
};

export default RateCardGrid;
