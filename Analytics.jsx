// import React from "react";
// import { BarChart2, Clock, TrendingUp, ListChecks, Zap, ArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const features = [
//   {
//     icon: <TrendingUp className="w-5 h-5 text-pink-400" />,
//     title: "Performance Metrics",
//     desc: "Track hiring KPIs and trends"
//   },
//   {
//     icon: <ListChecks className="w-5 h-5 text-purple-400" />,
//     title: "Source Analytics",
//     desc: "Optimize recruitment channels"
//   },
//   {
//     icon: <Zap className="w-5 h-5 text-cyan-400" />,
//     title: "Real-time Insights",
//     desc: "Live recruitment dashboard"
//   }
// ];

// const Analytics = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-[#16161c] flex flex-col items-center py-20 px-4">
//       {/* Top Icon */}
//       <div className="mb-6 flex items-center justify-center">
//         <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-md">
//           {/* Analytics Bar Chart Icon */}
//           <BarChart2 className="w-8 h-8 text-white" />
//         </div>
//       </div>

//       {/* Heading and coming soon */}
//       <h1 className="text-4xl font-bold text-white mb-1 tracking-tight text-center">Analytics Hub</h1>
//       <div className="flex items-center gap-2 mb-4">
//         <Clock className="w-4 h-4 text-pink-400 animate-pulse" />
//         <span className="text-pink-300 font-medium text-base">Coming Soon</span>
//         <Clock className="w-4 h-4 text-purple-400 animate-pulse" />
//       </div>

//       {/* Description */}
//       <div className="text-[#B9BAC3] mb-10 max-w-xl text-center text-sm sm:text-base">
//         Unlock the power of data-driven recruitment. Our advanced analytics dashboard will provide deep insights into hiring performance, candidate trends, and recruitment ROI to optimize your strategies.
//       </div>

//       {/* Features */}
//       <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//         {features.map((f, i) => (
//           <div
//             key={i}
//             className="bg-[#232129] rounded-xl p-6 flex flex-col items-start shadow-[0_4px_24px_0_rgba(32,24,40,0.08)] border border-[#353241] min-h-[120px] hover:shadow-[0_8px_32px_0_rgba(255,115,174,0.10)] transition-shadow"
//           >
//             <div className="mb-3">{f.icon}</div>
//             <div className="text-lg font-semibold text-pink-200 mb-1">{f.title}</div>
//             <div className="text-xs text-[#B9BAC3]">{f.desc}</div>
//           </div>
//         ))}
//       </div>

//       {/* Back to Dashboard Button */}
//       <button
//         onClick={() => navigate("/")}
//         className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-base shadow-md hover:from-pink-400 hover:to-purple-400 transition disabled:opacity-50"
//       >
//         <ArrowLeft className="w-5 h-5 text-white" />
//         Back to Dashboard
//       </button>
//     </div>
//   );
// };

// export default Analytics;



import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ArrowLeft, BarChart as BarChartIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const COLORS = ["#D53F8C", "#9125E7", "#2DD4BF", "#FBBF24", "#F472B6", "#A855F7"];

const Analytics = ({ recruiterId }) => {
  const navigate = useNavigate();

  const [jobsPerMonth, setJobsPerMonth] = useState([]);
  const [candidatesPerDept, setCandidatesPerDept] = useState([]);
  const [applicationsStatus, setApplicationsStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(`http://localhost:5000/api/recruiter/${recruiterId}/analytics`);
        if (data.success) {
          // Map API data to expected recharts format
          setJobsPerMonth(
            data.jobsPerMonth.map(({ month, count }) => ({ month, count }))
          );
          setCandidatesPerDept(
            data.candidatesPerDept.map(({ department, count }) => ({
              department,
              count,
            }))
          );
          setApplicationsStatus(
            data.applicationsStatus.map(({ status, count }) => ({
              status,
              count,
            }))
          );
        } else {
          setError("Failed to load analytics data");
        }
      } catch {
        setError("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [recruiterId]);

  if (loading) {
    return (
      <div className="text-white p-6 text-center min-h-screen">
        Loading analytics data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-6 text-center min-h-screen">{error}</div>
    );
  }

  return (
    <div className="min-h-screen bg-[#16161c] flex flex-col items-center py-20 px-4 relative">
      {/* Left arrow - top left */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute top-5 left-5 text-white hover:text-pink-400 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft size={28} />
      </button>

      {/* Top Icon */}
      <div className="mb-6 flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-md">
          <BarChartIcon width={40} height={40} className="text-white" />
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-4xl font-bold text-white mb-2 tracking-tight text-center">
        Analytics Hub
      </h1>

      {/* Charts container */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Jobs Posted Per Month - Bar Chart */}
        <div className="bg-[#232129] p-6 rounded-xl border border-[#353241] shadow-sm">
          <h2 className="text-xl font-semibold text-pink-200 mb-4">
            Jobs Posted Per Month
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={jobsPerMonth}
              margin={{ top: 10, right: 20, bottom: 5, left: 0 }}
            >
              <XAxis dataKey="month" stroke="#B9BAC3" />
              <YAxis stroke="#B9BAC3" />
              <Tooltip
                contentStyle={{ backgroundColor: "#16161c", borderColor: "#d53f8c" }}
                itemStyle={{ color: "#f7a8b8" }}
              />
              <Bar dataKey="count" fill="#D53F8C" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Candidates Per Department - Pie Chart */}
        <div className="bg-[#232129] p-6 rounded-xl border border-[#353241] shadow-sm">
          <h2 className="text-xl font-semibold text-pink-200 mb-4">
            Candidates per Department
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={candidatesPerDept}
                dataKey="count"
                nameKey="department"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#9125E7"
                label={({ department, percent }) =>
                  `${department} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {candidatesPerDept.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Applications Status Distribution - Doughnut Chart */}
        <div className="bg-[#232129] p-6 rounded-xl border border-[#353241] shadow-sm md:col-span-2">
          <h2 className="text-xl font-semibold text-pink-200 mb-4">
            Applications Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={applicationsStatus}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                fill="#FBBF24"
                label={({ status, percent }) =>
                  `${status}: ${(percent * 100).toFixed(1)}%`
                }
              >
                {applicationsStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
