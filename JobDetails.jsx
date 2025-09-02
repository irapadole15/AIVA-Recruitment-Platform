import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  Users,
  DollarSign,
  CalendarDays,
  MapPin,
  ArrowLeft,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const JobDetails = () => {
  const { id: recruiterId, jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState('');
  const [loadingJob, setLoadingJob] = useState(true);
  const [loadingCandidates, setLoadingCandidates] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const decodedJobId = atob(jobId);
        const decodedRecruiterId = atob(recruiterId);
        const response = await axios.get(
          `http://localhost:5000/api/recruiter/jobs/${decodedJobId}`,
          {
            headers: {
              'x-recruiter-id': decodedRecruiterId,
            },
          }
        );
        if (response.data.success) {
          setJob(response.data.job);
          setError('');
        } else {
          setError('Failed to load job details');
        }
      } catch (err) {
        setError('Error fetching job details');
        console.error(err);
      } finally {
        setLoadingJob(false);
      }
    };

    const fetchCandidates = async () => {
      try {
        const decodedJobId = atob(jobId);
        const response = await axios.get(
          `http://localhost:5000/api/recruiter/job-applicants/${decodedJobId}`
        );
        if (response.data.success) {
          setCandidates(response.data.candidates);
        } else {
          setError('Failed to load candidates');
        }
      } catch (err) {
        setError('Error fetching candidates');
        console.error(err);
      } finally {
        setLoadingCandidates(false);
      }
    };

    if (jobId && recruiterId) {
      fetchJobDetails();
      fetchCandidates();
    }
  }, [jobId, recruiterId]);

  if (loadingJob)
    return <div className="text-white p-4">Loading job details...</div>;

  if (error)
    return (
      <div className="text-red-400 p-4">
        {error}
      </div>
    );

  if (!job) return null;

  const postedDate = job.created_at
    ? new Date(job.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'N/A';

  return (
    <div className="min-h-screen bg-[#16161c] flex flex-col items-center py-20 px-4 relative text-white">
      {/* Left arrow fixed top-left */}
      <button
        className="absolute top-5 left-5 text-white hover:text-pink-400 transition-colors"
        onClick={() => navigate(-1)}
        aria-label="Go back"
      >
        <ArrowLeft size={28} />
      </button>

      {/* Header icon */}
      <div className="mb-6 flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-md">
          <Briefcase className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-4 text-center">{job.job_title}</h1>

      {/* Coming soon removed */}

      {/* Job info card */}
      <div className="w-full max-w-2xl bg-[#232129] rounded-2xl border border-[#353241] shadow-[0_3px_20px_rgba(32,24,40,0.1)] px-6 py-7 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <div className="text-sm text-[#B9BAC3] mb-2">
            <span className="font-semibold">Department: </span>
            {job.dept_name || 'N/A'}
          </div>
          <div className="flex items-center gap-4 mb-2">
            <MapPin className="w-4 h-4 text-pink-400" />
            <span className="text-sm text-[#B9BAC3]">{job.job_location || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-4">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-sm text-[#B9BAC3]">{job.salary_range || 'N/A'}</span>
          </div>
        </div>

        <div className="flex flex-row gap-8 items-center">
          <div className="flex flex-col items-center">
            <Users className="w-5 h-5 text-purple-400 mb-1" />
            <span className="font-bold text-pink-300 text-lg">{candidates.length}</span>
            <span className="text-xs text-[#B9BAC3]">Applicants</span>
          </div>
          <div className="flex flex-col items-center">
            <CalendarDays className="w-5 h-5 text-cyan-400 mb-1" />
            <span className="font-bold text-purple-200 text-lg">{postedDate}</span>
            <span className="text-xs text-[#B9BAC3]">Posted</span>
          </div>
        </div>
      </div>

      {/* Job description */}
      <div className="max-w-2xl text-gray-300 whitespace-pre-wrap mb-10 text-center md:text-left">
        {job.job_description || 'No description provided.'}
      </div>

      {/* Candidates List */}
      <div className="w-full max-w-4xl bg-[#232129] rounded-xl border border-[#353241] shadow-lg p-6">
        <h2 className="text-xl font-semibold text-pink-300 mb-4">Candidates Applied</h2>
        {loadingCandidates ? (
          <p className="text-[#B9BAC3]">Loading candidates...</p>
        ) : candidates.length === 0 ? (
          <p className="text-[#B9BAC3]">No candidates have applied yet.</p>
        ) : (
          <ul className="space-y-4 max-h-96 overflow-y-auto">
            {candidates.map((cand) => (
              <li
                key={cand.id}
                className="bg-[#16161c] rounded-md p-4 flex items-center justify-between border border-[#353241] hover:border-pink-400 transition"
              >
                <div>
                  <p className="text-white font-semibold">{cand.candidate_name}</p>
                  <p className="text-[#B9BAC3] text-sm">{cand.candidate_email}</p>
                </div>
                <div className="text-sm text-[#B9BAC3]">
                  Applied on {new Date(cand.applied_at).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
