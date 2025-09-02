import React, { useEffect, useState } from 'react';
import { Briefcase, ChevronRight, Eye } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ActiveJobs = () => {
  const navigate = useNavigate();
  const { id: recruiterId } = useParams(); // Encoded recruiter ID from URL params

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch jobs from API on mount or recruiterId change
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const decodedRecruiterId = recruiterId ? atob(recruiterId) : null;

        const response = await axios.get('http://localhost:5000/api/recruiter/jobs', {
          headers: {
            'x-recruiter-id': decodedRecruiterId,
          },
        });

        if (response.data.success && response.data.jobs) {
          setJobs(response.data.jobs);
        } else {
          setError('Failed to load jobs.');
        }
      } catch (err) {
        setError('Error fetching jobs.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (recruiterId) {
      fetchJobs();
    } else {
      setError('Recruiter ID not found in URL.');
      setLoading(false);
    }
  }, [recruiterId]);

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-4 sm:p-6 text-gray-300">Loading jobs...</div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 rounded-lg p-4 sm:p-6 text-red-400">{error}</div>
    );
  }

  // Navigate to job details page with jobId base64 encoded
  const handleViewJob = (jobId) => {
    const encodedJobId = btoa(String(jobId));
    navigate(`/recruiter/${recruiterId}/job-details/${encodedJobId}`);
  };

  // Navigate to full Jobs page
  const handleViewAllJobs = () => {
    navigate(`/recruiter/${recruiterId}/jobs`);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-300">Active Jobs</h3>
        <div className="text-pink-400">
          <Briefcase size={20} />
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-4">Recently posted positions</p>
      {jobs.length === 0 && (
        <p className="text-gray-400 text-sm">No active jobs found.</p>
      )}
      {jobs.slice(0, 3).map((job) => (
        <div
          key={job.id}
          className="bg-gray-800 rounded-lg p-3 mb-3 last:mb-4 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-white">{job.job_title}</h4>
              <p className="text-xs text-gray-400">
                {job.dept_name || 'Unknown Department'} &approx;{' '}
                {job.applicant_count !== undefined
                  ? `${job.applicant_count} applicant${job.applicant_count !== 1 ? 's' : ''}`
                  : 'No applicants'}
              </p>
              <p className="text-xs text-gray-500">
                {job.created_at
                  ? new Date(job.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : ''}
              </p>
            </div>
            <button
              onClick={() => handleViewJob(job.id)}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg py-1 px-2 text-xs hover:from-purple-700 hover:to-pink-600 transition-all flex items-center"
            >
              <Eye size={14} className="mr-1" /> View
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-end mt-2">
        <button
          onClick={handleViewAllJobs}
          className="text-pink-400 hover:text-pink-300 text-sm flex items-center"
          type="button"
        >
          View All Jobs <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default ActiveJobs;
