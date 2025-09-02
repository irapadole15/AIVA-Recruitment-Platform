// import React, { useState, useEffect } from 'react';
// import { Bell, User, Search } from 'lucide-react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';

// const CandidateHeader = () => {
//   const { id } = useParams(); // Encrypted with btoa (e.g., MQ==)
//   const [candidate, setCandidate] = useState({ name: '', email: '' });
//   const [error, setError] = useState('');
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [jobs, setJobs] = useState([]);

//   useEffect(() => {
//     const fetchCandidateDetails = async () => {
//       try {
//         const decodedId = atob(id);
//         const response = await axios.get(
//           `http://localhost:5000/api/candidate/candidate-details/${decodedId}`
//         );
//         setCandidate({
//           name: response.data.candidate.candidate_name,
//           email: response.data.candidate.candidate_email,
//         });
//       } catch (err) {
//         setError(
//           err.response?.data?.message || 'Failed to fetch candidate details'
//         );
//         setCandidate({ name: 'Unknown', email: 'N/A' });
//       }
//     };
//     if (id) fetchCandidateDetails();
//   }, [id]);

//   // Notification - fetch new jobs when notification bell is clicked
//   const handleBellClick = async () => {
//     setShowNotifications((prev) => !prev);
//     if (jobs.length === 0) {
//       try {
//         const resp = await axios.get('http://localhost:5000/api/candidate/jobs');
//         setJobs(resp.data.jobs.slice(0, 5)); // show 5 most recent
//       } catch (err) {
//         // just ignore for now
//       }
//     }
//   };

//   return (
//     <div className="w-[80%] bg-[#16161c] text-white p-4 sm:p-6 fixed top-0 z-10 box-border border-b border-[#353241] shadow-md">
//       <div className="flex items-center justify-between flex-wrap gap-4 max-w-7xl mx-auto">
//         {/* Left: Title */}
//         <div className="min-w-0">
//           <h2 className="text-lg sm:text-2xl font-bold text-white truncate">Candidate Dashboard</h2>
//           <p className="text-xs sm:text-sm text-[#B9BAC3] truncate">
//             Discover new jobs and manage your profile
//           </p>
//         </div>
//         {/* Right: search + notification + user */}
//         <div className="flex items-center space-x-2 sm:space-x-4 flex-1 justify-end min-w-0">
//           {/* Search Input */}
//           <div className="relative w-32 sm:w-40 lg:w-64 max-w-full">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Search className="h-4 w-4 sm:h-5 sm:w-5 text-[#B9BAC3]" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search..."
//               className="w-full bg-[#232129] text-white placeholder-[#B9BAC3] rounded-lg py-2 pl-10 pr-4 border border-[#353241] focus:outline-none focus:ring-2 focus:ring-pink-400 text-xs sm:text-sm transition-all"
//             />
//           </div>
//           {/* Notification Bell */}
//           <div className="relative">
//             <button
//               className="p-2 rounded-full hover:bg-[#232129] transition-all"
//               onClick={handleBellClick}
//               type="button"
//               aria-label="Show new job notifications"
//             >
//               <Bell className="text-[#B9BAC3] w-5 h-5" />
//             </button>
//             {showNotifications && (
//               <div className="absolute right-0 mt-2 w-72 bg-[#232129] shadow-lg rounded-lg z-50 border border-[#353241] px-3 py-2">
//                 <h4 className="mb-2 text-pink-400 text-sm font-medium">New Jobs</h4>
//                 <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
//                   {jobs.length === 0 ? (
//                     <p className="text-sm text-[#B9BAC3]">No new jobs</p>
//                   ) : (
//                     jobs.map((job) => (
//                       <div
//                         key={job.id}
//                         className="bg-[#16161c] border border-[#353241] rounded p-2"
//                       >
//                         <div className="font-medium text-white text-sm">
//                           {job.job_title}
//                         </div>
//                         <div className="text-xs text-[#B9BAC3]">
//                           {job.job_location || 'Location Flexible'}
//                         </div>
//                         <div className="text-xs text-[#B9BAC3]">
//                           Salary: {job.salary_range || 'N/A'}
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//           {/* Candidate User Info */}
//           <div className="hidden sm:flex items-center space-x-2 min-w-0">
//             <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0">
//               <User size={14} className="text-white sm:size-16" />
//             </div>
//             <div className="min-w-0">
//               <p className="text-xs sm:text-sm font-medium text-white truncate">
//                 {candidate.name}
//               </p>
//               <p className="text-xs text-[#B9BAC3] truncate">
//                 {candidate.email}
//               </p>
//               {error && <p className="text-red-400 text-xs truncate">{error}</p>}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CandidateHeader;









import React, { useState, useEffect, useRef } from 'react';
import { Bell, User, Search, Download, Maximize2, X } from 'lucide-react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CandidateHeader = () => {
  const { id } = useParams(); // Encrypted with btoa (e.g., MQ==)
  const [candidate, setCandidate] = useState({ 
    name: '', 
    email: '',
    resume: ''
  });
  const [error, setError] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef(null);
console.log(error);

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        const decodedId = atob(id);
        const response = await axios.get(
          `http://localhost:5000/api/candidate/candidate-details/${decodedId}`
        );
        setCandidate({
          name: response.data.candidate.candidate_name,
          email: response.data.candidate.candidate_email,
          resume: response.data.candidate.candidate_resume
        });
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to fetch candidate details'
        );
        setCandidate({ name: 'Unknown', email: 'N/A', resume: '' });
      }
    };
    if (id) fetchCandidateDetails();
  }, [id]);

  // Close profile menu if click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuOpen]);

  const handleBellClick = async () => {
    setShowNotifications((prev) => !prev);
    if (jobs.length === 0) {
      try {
        const resp = await axios.get('http://localhost:5000/api/candidate/jobs');
        setJobs(resp.data.jobs.slice(0, 5)); // show 5 most recent
      } catch (err) {
        // just ignore for now
        console.log(err);
        
      }
    }
  };

  const handleProfileClick = () => {
    setProfileMenuOpen((open) => !open);
  };

  const handleViewResumeClick = () => {
    setShowResumeModal(true);
    setProfileMenuOpen(false);
  };

  const handleDownloadResume = () => {
    window.open(`http://localhost:5000${candidate.resume}`, '_blank');
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const closeModal = () => {
    setShowResumeModal(false);
    setIsFullScreen(false);
  };

  return (
    <div className="w-[80%] bg-[#16161c] text-white p-4 sm:p-6 fixed top-0 z-10 box-border border-b border-[#353241] shadow-md">
      <div className="flex items-center justify-between flex-wrap gap-4 max-w-7xl mx-auto">
        {/* Left: Title */}
        <div className="min-w-0">
          <h2 className="text-lg sm:text-2xl font-bold text-white truncate">Candidate Dashboard</h2>
          <p className="text-xs sm:text-sm text-[#B9BAC3] truncate">
            Discover new jobs and manage your profile
          </p>
        </div>
        {/* Right: search + notification + user */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-1 justify-end min-w-0">
          {/* Search Input */}
          <div className="relative w-32 sm:w-40 lg:w-64 max-w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-[#B9BAC3]" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-[#232129] text-white placeholder-[#B9BAC3] rounded-lg py-2 pl-10 pr-4 border border-[#353241] focus:outline-none focus:ring-2 focus:ring-pink-400 text-xs sm:text-sm transition-all"
            />
          </div>
          {/* Notification Bell */}
          <div className="relative">
            <button
              className="p-2 rounded-full hover:bg-[#232129] transition-all"
              onClick={handleBellClick}
              type="button"
              aria-label="Show new job notifications"
            >
              <Bell className="text-[#B9BAC3] w-5 h-5" />
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-[#232129] shadow-lg rounded-lg z-50 border border-[#353241] px-3 py-2">
                <h4 className="mb-2 text-pink-400 text-sm font-medium">New Jobs</h4>
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                  {jobs.length === 0 ? (
                    <p className="text-sm text-[#B9BAC3]">No new jobs</p>
                  ) : (
                    jobs.map((job) => (
                      <div
                        key={job.id}
                        className="bg-[#16161c] border border-[#353241] rounded p-2"
                      >
                        <div className="font-medium text-white text-sm">
                          {job.job_title}
                        </div>
                        <div className="text-xs text-[#B9BAC3]">
                          {job.job_location || 'Location Flexible'}
                        </div>
                        <div className="text-xs text-[#B9BAC3]">
                          Salary: {job.salary_range || 'N/A'}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Candidate User Info */}
          <div className="relative hidden sm:flex items-center space-x-2 min-w-0" ref={menuRef}>
            <div 
              className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={handleProfileClick}
            >
              <User size={14} className="text-white sm:size-16" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-white truncate">
                {candidate.name}
              </p>
              <p className="text-xs text-[#B9BAC3] truncate">
                {candidate.email}
              </p>
            </div>
            {profileMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-44 bg-[#232129] rounded-lg border border-[#353241] shadow-lg z-30">
                <button
                  onClick={handleViewResumeClick}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-[#353241] rounded-t-lg"
                >
                  View Your Resume
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resume Modal */}
      {showResumeModal && (
        <div className="fixed inset-0 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className={`bg-[#232129] rounded-lg shadow-xl border border-[#353241] ${isFullScreen ? 'w-full h-full' : 'max-w-4xl w-full max-h-[90vh]'}`}>
            <div className="flex justify-between items-center p-4 border-b border-[#353241]">
              <h3 className="text-lg font-medium text-white">Resume Preview</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={handleDownloadResume}
                  className="p-2 text-[#B9BAC3] hover:text-white hover:bg-[#353241] rounded"
                  title="Download Resume"
                >
                  <Download size={18} />
                </button>
                <button 
                  onClick={toggleFullScreen}
                  className="p-2 text-[#B9BAC3] hover:text-white hover:bg-[#353241] rounded"
                  title={isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
                >
                  <Maximize2 size={18} />
                </button>
                <button 
                  onClick={closeModal}
                  className="p-2 text-[#B9BAC3] hover:text-white hover:bg-[#353241] rounded"
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className={`${isFullScreen ? 'h-[calc(100vh-60px)]' : 'h-[80vh]'} p-4 overflow-auto`}>
              <iframe 
                src={`http://localhost:5000${candidate.resume}`} 
                className="w-full h-full border border-[#353241] rounded"
                title="Resume Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateHeader;
