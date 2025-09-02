// import React, { useState } from 'react';
// import { Route, Routes, Navigate } from 'react-router-dom';
// import ActiveJobs from './ActiveJobs';
// import CandidateGraph from './CandidateGraph';
// import CountCard from './CountCard';
// import RateCard from './RateCard';
// import RecruiterHeader from './RecruiterHeader';
// import RecruiterPostNewJob from './RecruiterPostNewJob';
// import RecruiterSidebar from './RecruiterSidebar';

// const RecruiterDashboard = () => {
//   const [jobModalOpen, setJobModalOpen] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);

//   return (
//     <div className="flex min-h-screen bg-[#16161c] overflow-hidden">
//       {/* Sidebar */}
//       <div
//         className={`fixed top-0 left-0 h-full w-64 z-30 transform transition-transform duration-300 ease-in-out ${
//           mobileOpen ? 'translate-x-0' : '-translate-x-full'
//         } md:translate-x-0 md:w-[20%] md:max-w-[280px] md:block bg-[#232129] border-r border-[#353241]`}
//       >
//         <RecruiterSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
//       </div>

//       {/* Overlay for mobile sidebar */}
//       {mobileOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
//           onClick={() => setMobileOpen(false)}
//         ></div>
//       )}

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col md:ml-[20%] lg:ml-[280px]">
//         {/* Header */}
//         <div className="fixed top-0 w-full md:w-[80%] lg:w-[calc(100%-280px)] right-0 z-10 bg-[#16161c] border-b border-[#353241]">
//           <RecruiterHeader
//             setMobileOpen={setMobileOpen}
//             onPostNewJob={() => setJobModalOpen(true)}
//           />
//         </div>

//         {/* Main Dashboard Content */}
//         <div className="flex-1 pt-16 md:pt-20 overflow-y-auto">
//           <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
//             {/* Count Cards */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
//               <CountCard title="Active Jobs" count={12} icon="briefcase" />
//               <CountCard title="New Candidates" count={84} period="(7d)" icon="users" />
//               <CountCard title="Interviews Today" count={5} icon="calendar" />
//               <CountCard title="Hired" count={8} period="(30d)" icon="check" />
//             </div>

//             {/* Graph and Active Jobs */}
//             <div className="flex flex-col lg:flex-row gap-6">
//               <div className="w-full lg:w-3/4">
//                 <CandidateGraph />
//               </div>
//               <div className="w-full lg:w-1/4">
//                 <ActiveJobs />
//               </div>
//             </div>

//             {/* Rate Card */}
//             <div className="mt-6">
//               <RateCard />
//             </div>
//           </div>

//           {/* Nested Routes */}
//           <Routes>
//             <Route path="/" element={<div />} />
//             <Route path="/post-new-job" element={<RecruiterPostNewJob open={jobModalOpen} onClose={() => setJobModalOpen(false)} />} />
//             <Route path="/candidate-graph" element={<CandidateGraph />} />
//             <Route path="/count-card" element={<CountCard />} />
//             <Route path="*" element={<Navigate to="/" />} />
//           </Routes>
//         </div>
//       </div>

//       {/* Mobile FAB */}
//       <div className="md:hidden fixed bottom-6 right-6 z-30">
//         <button
//           onClick={() => setMobileOpen(!mobileOpen)}
//           className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full p-4 shadow-lg hover:from-pink-600 hover:to-purple-600 transition-all"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
//             />
//           </svg>
//         </button>
//       </div>

//       {/* Modal at portal root */}
//       {jobModalOpen && (
//         <RecruiterPostNewJob open={jobModalOpen} onClose={() => setJobModalOpen(false)} />
//       )}

//       {/* Custom Scrollbar styles */}
//       <style jsx global>{`
//         ::-webkit-scrollbar {
//           width: 8px;
//           height: 8px;
//         }
//         ::-webkit-scrollbar-track {
//           background: rgba(17, 24, 39, 0.4);
//         }
//         ::-webkit-scrollbar-thumb {
//           background: linear-gradient(180deg, rgba(219, 39, 119, 0.8), rgba(147, 51, 234, 0.8));
//           border-radius: 4px;
//         }
//         ::-webkit-scrollbar-thumb:hover {
//           background: linear-gradient(180deg, rgba(219, 39, 119, 1), rgba(147, 51, 234, 1));
//         }
//         * {
//           scrollbar-width: thin;
//           scrollbar-color: rgba(219, 39, 119, 0.8) rgba(17, 24, 39, 0.4);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default RecruiterDashboard;



import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';

import ActiveJobs from './ActiveJobs';
import CandidateGraph from './CandidateGraph';
import CountCard from './CountCard';
import RateCard from './RateCard';
import RecruiterHeader from './RecruiterHeader';
import RecruiterPostNewJob from './RecruiterPostNewJob';
import RecruiterSidebar from './RecruiterSidebar';

const RecruiterDashboard = () => {
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [activeJobsCount, setActiveJobsCount] = useState(null);
  const [activeJobsLoading, setActiveJobsLoading] = useState(true);
  const [activeJobsError, setActiveJobsError] = useState('');

  const [candidateCount, setCandidateCount] = useState(null);
  const [candidatesLoading, setCandidatesLoading] = useState(true);
  const [candidatesError, setCandidatesError] = useState('');

  const [interviewsTodayCount, setInterviewsTodayCount] = useState(null);
  const [interviewsTodayLoading, setInterviewsTodayLoading] = useState(true);
  const [interviewsTodayError, setInterviewsTodayError] = useState('');

  const [hiredCount, setHiredCount] = useState(null);
  const [hiredLoading, setHiredLoading] = useState(true);
  const [hiredError, setHiredError] = useState('');

  // Fetch active jobs count
  useEffect(() => {
    const fetchActiveJobsCount = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/recruiter/jobs-count');
        if (response.data.success && (response.data.totalJobs || response.data.total_jobs !== undefined)) {
          setActiveJobsCount(response.data.totalJobs ?? response.data.total_jobs);
          setActiveJobsError('');
        } else {
          setActiveJobsError('Failed to load active jobs count');
        }
      } catch (err) {
        setActiveJobsError('Failed to load active jobs count');
        console.error(err);
      } finally {
        setActiveJobsLoading(false);
      }
    };

    fetchActiveJobsCount();
  }, []);

  // Fetch candidate count
  useEffect(() => {
    const fetchCandidateCount = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/recruiter/candidate-counts');
        if (response.data.success && (response.data.totalCandidates !== undefined)) {
          setCandidateCount(response.data.totalCandidates);
          setCandidatesError('');
        } else {
          setCandidatesError('Failed to load candidate count');
        }
      } catch (err) {
        setCandidatesError('Failed to load candidate count');
        console.error(err);
      } finally {
        setCandidatesLoading(false);
      }
    };

    fetchCandidateCount();
  }, []);

  // Fetch interviews today count
  useEffect(() => {
    const fetchInterviewsTodayCount = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/recruiter/1/interviews-today-count');
        if (response.data.success && response.data.count !== undefined) {
          setInterviewsTodayCount(response.data.count);
          setInterviewsTodayError('');
        } else {
          setInterviewsTodayError('Failed to load interviews count');
        }
      } catch (err) {
        setInterviewsTodayError('Failed to load interviews count');
        console.error(err);
      } finally {
        setInterviewsTodayLoading(false);
      }
    };

    fetchInterviewsTodayCount();
  }, []);

  // Fetch hired count
  useEffect(() => {
    const fetchHiredCount = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/recruiter/1/hired-count');
        if (response.data.success && response.data.count !== undefined) {
          setHiredCount(response.data.count);
          setHiredError('');
        } else {
          setHiredError('Failed to load hired count');
        }
      } catch (err) {
        setHiredError('Failed to load hired count');
        console.error(err);
      } finally {
        setHiredLoading(false);
      }
    };

    fetchHiredCount();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#16161c] overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 z-30 transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:w-[20%] md:max-w-[280px] md:block bg-[#232129] border-r border-[#353241]`}
      >
        <RecruiterSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      </div>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-[20%] lg:ml-[280px]">
        {/* Header */}
        <div className="fixed top-0 w-full md:w-[80%] lg:w-[calc(100%-280px)] right-0 z-10 bg-[#16161c] border-b border-[#353241]">
          <RecruiterHeader setMobileOpen={setMobileOpen} onPostNewJob={() => setJobModalOpen(true)} />
        </div>

        {/* Main Dashboard Content */}
        <div className="flex-1 pt-16 md:pt-20 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Count Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
              <CountCard
                title="Active Jobs"
                count={activeJobsLoading ? '...' : activeJobsError ? 'N/A' : activeJobsCount}
                icon="briefcase"
              />
              <CountCard
                title="New Candidates"
                count={candidatesLoading ? '...' : candidatesError ? 'N/A' : candidateCount}
                period="(7d)"
                icon="users"
              />
              <CountCard
                title="Interviews Today"
                count={interviewsTodayLoading ? '...' : interviewsTodayError ? 'N/A' : interviewsTodayCount}
                icon="calendar"
              />
              <CountCard
                title="Hired"
                count={hiredLoading ? '...' : hiredError ? 'N/A' : hiredCount}
                period="(30d)"
                icon="check"
              />
            </div>

            {/* Graph and Active Jobs */}
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-3/4">
                <CandidateGraph />
              </div>
              <div className="w-full lg:w-1/4">
                <ActiveJobs />
              </div>
            </div>

            {/* Rate Card */}
            <div className="mt-6">
              <RateCard />
            </div>
          </div>

          {/* Nested Routes */}
          <Routes>
            <Route path="/" element={<div />} />
            <Route path="/post-new-job" element={<RecruiterPostNewJob open={jobModalOpen} onClose={() => setJobModalOpen(false)} />} />
            <Route path="/candidate-graph" element={<CandidateGraph />} />
            <Route path="/count-card" element={<CountCard />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>

      {/* Mobile FAB */}
      <div className="md:hidden fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full p-4 shadow-lg hover:from-pink-600 hover:to-purple-600 transition-all"
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>

      {/* Modal at portal root */}
      {jobModalOpen && <RecruiterPostNewJob open={jobModalOpen} onClose={() => setJobModalOpen(false)} />}

      {/* Custom Scrollbar styles */}
      <style>{`
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(17, 24, 39, 0.4);
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(219, 39, 119, 0.8), rgba(147, 51, 234, 0.8));
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(219, 39, 119, 1), rgba(147, 51, 234, 1));
        }
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(219, 39, 119, 0.8) rgba(17, 24, 39, 0.4);
        }
      `}</style>
    </div>
  );
};

export default RecruiterDashboard;