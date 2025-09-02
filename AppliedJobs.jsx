import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const AppliedJobs = () => {
  const { id: encodedCandidateId } = useParams();
  const candidateId = encodedCandidateId ? atob(encodedCandidateId) : null;
  const navigate = useNavigate();

  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!candidateId) {
      setError('Candidate ID missing or invalid');
      setLoading(false);
      return;
    }

    const fetchAppliedJobs = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(
          `http://localhost:5000/api/candidate/applied-jobs/${candidateId}`
        );
        if (res.data.success) {
          setAppliedJobs(res.data.appliedJobs);
        } else {
          setError('Failed to fetch applied jobs');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching applied jobs');
      }
      setLoading(false);
    };

    fetchAppliedJobs();
  }, [candidateId]);

  if (loading) {
    return (
      <div className="text-white p-4 sm:p-8 text-center bg-[#16161c] min-h-screen">
        Loading applied jobs...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 p-4 sm:p-8 text-center bg-[#16161c] min-h-screen font-medium">
        {error}
      </div>
    );
  }

  if (appliedJobs.length === 0) {
    return (
      <div className="text-[#B9BAC3] p-4 sm:p-8 text-center bg-[#16161c] min-h-screen text-lg">
        You have not applied to any jobs yet.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#16161c] p-4 sm:p-8">
      {/* Back Arrow */}
      <button
        className="absolute top-4 left-4 flex items-center gap-2 text-pink-400 hover:text-pink-500 transition z-10 bg-[#232129] bg-opacity-70 p-2 rounded-full"
        onClick={() => navigate(-1)}
        aria-label="Go back"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Title */}
      <div className="flex items-center justify-between mb-4 ml-14">
        <h2 className="text-2xl font-bold text-white">Applied Jobs</h2>
      </div>

      {/* Jobs Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {appliedJobs.map((job) => (
          <div
            key={job.application_id}
            className="bg-[#232129] border border-[#353241] rounded-lg p-6 transition hover:shadow-lg hover:border-pink-500 flex flex-col h-full"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-pink-300 px-2 py-1 rounded bg-pink-900 bg-opacity-20">
                {job.dept_name || '-'}
              </span>
              <span className="text-xs text-[#B9BAC3]">
                Applied on {new Date(job.applied_at).toLocaleDateString()}
              </span>
            </div>
            <h3 className="font-bold text-lg text-white mb-1">{job.job_title}</h3>
            <p className="text-[#B9BAC3] text-sm mb-4 line-clamp-3">
              {job.job_description || '-'}
            </p>
            <div className="mt-auto space-y-3">
              <div className="flex items-center text-xs text-[#B9BAC3]">
                <span className="font-medium w-20">Location:</span>
                <span>{job.job_location || '-'}</span>
              </div>
              <div className="flex items-center text-xs text-[#B9BAC3]">
                <span className="font-medium w-20">Salary:</span>
                <span>{job.salary_range || '-'}</span>
              </div>
              <div className="flex items-center text-xs text-[#B9BAC3]">
                <span className="font-medium w-20">Recruiter:</span>
                <span>{job.recruiter_name || '-'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppliedJobs;



