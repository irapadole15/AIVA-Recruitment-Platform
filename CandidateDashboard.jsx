// import React, { useState } from 'react';
// import CandidateSidebar from './CandidateSidebar';
// import CandidateHeader from './CandidateHeader'; // Import your header here

// const CandidateDashboard = () => {
//   const [mobileOpen, setMobileOpen] = useState(false);

//   return (
//     <div className="flex min-h-screen bg-[#16161c] overflow-hidden">
//       {/* Sidebar */}
//       <CandidateSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

//       {/* Overlay for mobile sidebar */}
//       {mobileOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
//           onClick={() => setMobileOpen(false)}
//         />
//       )}

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col md:ml-[20%] lg:ml-[280px]">
//         {/* Header */}
//         <CandidateHeader setMobileOpen={setMobileOpen} />
//         {/* Main Dashboard Content */}
//         <div className="flex-1 pt-24 md:pt-24 overflow-y-auto">
//           <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
//             {/* Rest of your dashboard content here */}
//           </div>
//         </div>
//       </div>

//       {/* Floating Action Button for mobile menu toggle */}
//       <div className="md:hidden fixed bottom-6 right-6 z-30">
//         <button
//           onClick={() => setMobileOpen(!mobileOpen)}
//           className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full p-4 shadow-lg hover:from-pink-600 hover:to-purple-600 transition-all"
//         >
//           {/* Menu Icon */}
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
//     </div>
//   );
// };

// export default CandidateDashboard;











import React, { useState } from 'react';
import CandidateSidebar from './CandidateSidebar';
import CandidateHeader from './CandidateHeader';
import CandidateCountCard from './CandidateCountCard';  // Import the count card
import CandidateStatistics from './CandidateStatistics';

const CandidateDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#16161c] overflow-hidden">
      {/* Sidebar */}
      <CandidateSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Overlay for mobile sidebar */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-[20%] lg:ml-[280px]">
        {/* Header */}
        <CandidateHeader setMobileOpen={setMobileOpen} />
        {/* Main Dashboard Content */}
        <div className="flex-1 pt-24 md:pt-24 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Insert your count card here */}
            <CandidateCountCard />
              <CandidateStatistics />

            {/* You can add more dashboard panels/content below */}
          </div>
        </div>
      </div>

      {/* Floating Action Button for mobile menu toggle */}
      <div className="md:hidden fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full p-4 shadow-lg hover:from-pink-600 hover:to-purple-600 transition-all"
          aria-label="Toggle menu"
        >
          {/* Menu Icon */}
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
    </div>
  );
};

export default CandidateDashboard;
