// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Login from './components/Auth/Login';
// import Register from './components/Auth/Register';
// import RecruiterDashboard from './components/RecruiterDashboard/RecruiterDashboard';
// import CandidateDashboard from './components/CandidateDashboard/CandidateDashboard';
// import Jobs from './components/RecruiterDashboard/Jobs';
// import Candidates from './components/RecruiterDashboard/Candidates';
// import Calendar from './components/RecruiterDashboard/Calendar';
// import Analytics from './components/RecruiterDashboard/Analytics';
// import Settings from './components/RecruiterDashboard/Settings';
// import JobDetails from './components/RecruiterDashboard/JobDetails';
// import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         {/* Public */}
//         <Route path="/" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/logout" element={<div>Logout Page</div>} />

//         {/* Recruiter Protected Routes */}
//         <Route path="/recruiter/:id/*" element={<ProtectedRoute allowedUserType="recruiter" />}>
//           <Route index element={<RecruiterDashboard />} />
//           <Route path="jobs" element={<Jobs />} />
//           <Route path="candidates" element={<Candidates />} />
//           <Route path="calendar" element={<Calendar />} />
//           <Route path="analytics" element={<Analytics />} />
//           <Route path="settings" element={<Settings />} />

//           {/* Updated job details route with jobId param */}
//           <Route path="job-details/:jobId" element={<JobDetails />} />
//         </Route>

//         {/* Candidate Protected Routes */}
//         <Route path="/candidate/:id/*" element={<ProtectedRoute allowedUserType="candidate" />}>
//           <Route index element={<CandidateDashboard />} />
//           {/* Additional candidate nested routes */}
//         </Route>
//       </Routes>
//     </Router>
//   );
// };

// export default App;
















import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import RecruiterDashboard from './components/RecruiterDashboard/RecruiterDashboard';
import CandidateDashboard from './components/CandidateDashboard/CandidateDashboard';
import Jobs from './components/RecruiterDashboard/Jobs';
import Candidates from './components/RecruiterDashboard/Candidates';
import Calendar from './components/RecruiterDashboard/Calendar';
import Analytics from './components/RecruiterDashboard/Analytics';
import Settings from './components/RecruiterDashboard/Settings';
import JobDetails from './components/RecruiterDashboard/JobDetails';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// ➜ Import these 3 candidate modules!
import AllJobs from './components/CandidateDashboard/AllJobs';
import AppliedJobs from './components/CandidateDashboard/AppliedJobs';
import CandidateProfile from './components/CandidateDashboard/CandidateProfile';
import CandidateInterviewSchedule from './components/CandidateDashboard/CandidateInterviewSchedule';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<div>Logout Page</div>} />

        {/* Recruiter Protected Routes */}
        <Route path="/recruiter/:id/*" element={<ProtectedRoute allowedUserType="recruiter" />}>
          <Route index element={<RecruiterDashboard />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="candidates" element={<Candidates />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="job-details/:jobId" element={<JobDetails />} />
        </Route>

        {/* Candidate Protected Routes */}
        <Route path="/candidate/:id/*" element={<ProtectedRoute allowedUserType="candidate" />}>
          <Route index element={<CandidateDashboard />} />
          <Route path="jobs" element={<AllJobs />} />
          <Route path="applied-jobs" element={<AppliedJobs />} />
            <Route path="interview-schedules" element={<CandidateInterviewSchedule />} />{/* NEW */}
          <Route path="profile" element={<CandidateProfile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
