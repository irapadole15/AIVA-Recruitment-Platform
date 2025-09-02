import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CandidateStatistics = ({ candidateId = 1 }) => {
  const [data, setData] = useState([
    { label: 'Total Jobs', value: 0, color: '#ec4899' },           // pink
    { label: 'Applied Jobs', value: 0, color: '#7c3aed' },         // purple
    { label: 'Interviews Today', value: 0, color: '#22d3ee' },     // cyan
    { label: 'Upcoming Interviews', value: 0, color: '#10b981' },  // green
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [jobsCountRes, appliedCountRes, todayInterviewsRes, upcomingInterviewsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/candidate/jobs-count'),
          axios.get(`http://localhost:5000/api/candidate/${candidateId}/applied-job-count`),
          axios.get(`http://localhost:5000/api/candidate/${candidateId}/interviews/today/count`),
          axios.get(`http://localhost:5000/api/candidate/${candidateId}/interviews/upcoming/count`)
        ]);

        setData([
          { label: 'Total Jobs', value: jobsCountRes.data.totalJobs, color: '#ec4899' },
          { label: 'Applied Jobs', value: appliedCountRes.data.totalApplied, color: '#7c3aed' },
          { label: 'Interviews Today', value: todayInterviewsRes.data.count, color: '#22d3ee' },
          { label: 'Upcoming Interviews', value: upcomingInterviewsRes.data.count, color: '#10b981' },
        ]);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
        console.error('Error fetching statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [candidateId]);

  if (loading) {
    return (
      <div className="mt-8 w-full bg-[#232129] border border-[#353241] rounded-lg p-6 shadow-lg flex flex-col items-center">
        <h3 className="text-xl font-bold text-white mb-6 text-center">
          Candidate Statistics Overview
        </h3>
        <div className="w-full flex items-end justify-around h-64">
          {data.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center w-1/5">
              <div
                className="transition-all rounded-t-lg bg-gray-700 animate-pulse"
                style={{
                  height: '80px',
                  width: '48px',
                  marginBottom: '8px',
                }}
              />
              <div className="h-6 w-12 bg-gray-700 rounded animate-pulse mb-1"></div>
              <div className="h-4 w-16 bg-gray-700 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 w-full bg-[#232129] border border-[#353241] rounded-lg p-6 shadow-lg flex flex-col items-center">
        <h3 className="text-xl font-bold text-white mb-6 text-center">
          Candidate Statistics Overview
        </h3>
        <div className="text-red-400 p-4 text-center">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 w-full bg-[#232129] border border-[#353241] rounded-lg p-6 shadow-lg flex flex-col items-center">
      <h3 className="text-xl font-bold text-white mb-6 text-center">
        Candidate Statistics Overview
      </h3>
      <div className="w-full flex items-end justify-around h-64">
        {data.map((item) => (
          <div key={item.label} className="flex flex-col items-center w-1/5">
            <div
              className="transition-all rounded-t-lg hover:opacity-80"
              style={{
                background: item.color,
                height: `${Math.max(item.value * 2, 8)}px`,
                width: '48px',
                marginBottom: '8px',
                minHeight: '8px'
              }}
              title={item.label}
            />
            <span className="text-lg font-semibold text-white">{item.value}</span>
            <span className="mt-1 text-xs text-[#B9BAC3] text-center">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateStatistics;