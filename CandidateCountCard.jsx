// import React, { useEffect, useState } from 'react';
// import { Briefcase, FileCheck, Calendar, Clock } from 'lucide-react';
// import axios from 'axios';

// const CandidateCountCard = ({ candidateId = 7 }) => {
//   const [counts, setCounts] = useState({
//     totalJobs: 0,
//     totalApplied: 0,
//     interviewsToday: 0,
//     upcomingInterviews: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         // Fetch all data in parallel
//         const [jobsCountRes, appliedCountRes, todayInterviewsRes, upcomingInterviewsRes] = await Promise.all([
//           axios.get('http://localhost:5000/api/candidate/jobs-count'),
//           axios.get(`http://localhost:5000/api/candidate/${candidateId}/applied-job-count`),
//           axios.get(`http://localhost:5000/api/candidate/${candidateId}/interviews/today/count`),
//           axios.get(`http://localhost:5000/api/candidate/${candidateId}/interviews/upcoming/count`)
//         ]);

//         setCounts({
//           totalJobs: jobsCountRes.data.totalJobs,
//           totalApplied: appliedCountRes.data.totalApplied,
//           interviewsToday: todayInterviewsRes.data.count,
//           upcomingInterviews: upcomingInterviewsRes.data.count,
//         });
//       } catch (err) {
//         setError(err.message || 'Failed to fetch data');
//         console.error('Error fetching counts:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [candidateId]);

//   const cards = [
//     { title: 'Total Jobs', count: counts.totalJobs, icon: Briefcase, bg: 'bg-pink-600', text: 'text-pink-400' },
//     { title: 'Applied Jobs', count: counts.totalApplied, icon: FileCheck, bg: 'bg-purple-600', text: 'text-purple-400' },
//     { title: 'Interviews Today', count: counts.interviewsToday, icon: Calendar, bg: 'bg-cyan-600', text: 'text-cyan-400' },
//     { title: 'Upcoming Interviews', count: counts.upcomingInterviews, icon: Clock, bg: 'bg-green-600', text: 'text-green-400' },
//   ];

//   if (loading) {
//     return (
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//         {cards.map(({ title, icon: Icon, bg }) => (
//           <div
//             key={title}
//             className="w-full h-40 sm:h-44 bg-gray-800 border border-gray-700 rounded-lg flex flex-col items-center justify-center p-4 sm:p-6 text-white shadow-lg"
//           >
//             <div className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center mb-3`}>
//               <Icon color="white" size={26} />
//             </div>
//             <div className="h-8 w-16 bg-gray-700 rounded animate-pulse"></div>
//             <div className="text-base text-gray-400 text-center">{title}</div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-900/20 border border-red-700 text-red-400 p-4 rounded-lg mb-8">
//         Error: {error}
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//       {cards.map(({ title, count, icon: Icon, bg, text }) => (
//         <div
//           key={title}
//           className="w-full h-40 sm:h-44 bg-gray-800 border border-gray-700 rounded-lg flex flex-col items-center justify-center p-4 sm:p-6 text-white shadow-lg hover:border-pink-300 transition-all"
//         >
//           <div className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center mb-3`}>
//             <Icon color="white" size={26} />
//           </div>
//           <div className={`text-3xl font-bold ${text} mb-2`}>{count}</div>
//           <div className="text-base text-gray-400 text-center">{title}</div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default CandidateCountCard;






import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Briefcase, FileCheck, Calendar, Clock } from 'lucide-react';
import axios from 'axios';

const CandidateCountCard = () => {
  const { id: encodedId } = useParams(); // Get the encoded ID from URL params
  const [candidateId, setCandidateId] = useState(null);
  const [counts, setCounts] = useState({
    totalJobs: 0,
    totalApplied: 0,
    interviewsToday: 0,
    upcomingInterviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Decode the base64 encoded ID when component mounts
    if (encodedId) {
      try {
        const decodedId = atob(encodedId);
        setCandidateId(parseInt(decodedId, 10));
      } catch (err) {
        setError('Invalid candidate ID');
        setLoading(false);
      }
    }
  }, [encodedId]);

  useEffect(() => {
    const fetchData = async () => {
      if (!candidateId) return; // Don't fetch if candidateId isn't set yet

      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [jobsCountRes, appliedCountRes, todayInterviewsRes, upcomingInterviewsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/candidate/jobs-count'),
          axios.get(`http://localhost:5000/api/candidate/${candidateId}/applied-job-count`),
          axios.get(`http://localhost:5000/api/candidate/${candidateId}/interviews/today/count`),
          axios.get(`http://localhost:5000/api/candidate/${candidateId}/interviews/upcoming/count`)
        ]);

        setCounts({
          totalJobs: jobsCountRes.data.totalJobs,
          totalApplied: appliedCountRes.data.totalApplied,
          interviewsToday: todayInterviewsRes.data.count,
          upcomingInterviews: upcomingInterviewsRes.data.count,
        });
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
        console.error('Error fetching counts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [candidateId]); // Now depends on candidateId instead of the prop

  const cards = [
    { title: 'Total Jobs', count: counts.totalJobs, icon: Briefcase, bg: 'bg-pink-600', text: 'text-pink-400' },
    { title: 'Applied Jobs', count: counts.totalApplied, icon: FileCheck, bg: 'bg-purple-600', text: 'text-purple-400' },
    { title: 'Interviews Today', count: counts.interviewsToday, icon: Calendar, bg: 'bg-cyan-600', text: 'text-cyan-400' },
    { title: 'Upcoming Interviews', count: counts.upcomingInterviews, icon: Clock, bg: 'bg-green-600', text: 'text-green-400' },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ title, icon: Icon, bg }) => (
          <div
            key={title}
            className="w-full h-40 sm:h-44 bg-gray-800 border border-gray-700 rounded-lg flex flex-col items-center justify-center p-4 sm:p-6 text-white shadow-lg"
          >
            <div className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center mb-3`}>
              <Icon color="white" size={26} />
            </div>
            <div className="h-8 w-16 bg-gray-700 rounded animate-pulse"></div>
            <div className="text-base text-gray-400 text-center">{title}</div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-700 text-red-400 p-4 rounded-lg mb-8">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map(({ title, count, icon: Icon, bg, text }) => (
        <div
          key={title}
          className="w-full h-40 sm:h-44 bg-gray-800 border border-gray-700 rounded-lg flex flex-col items-center justify-center p-4 sm:p-6 text-white shadow-lg hover:border-pink-300 transition-all"
        >
          <div className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center mb-3`}>
            <Icon color="white" size={26} />
          </div>
          <div className={`text-3xl font-bold ${text} mb-2`}>{count}</div>
          <div className="text-base text-gray-400 text-center">{title}</div>
        </div>
      ))}
    </div>
  );
};

export default CandidateCountCard;

