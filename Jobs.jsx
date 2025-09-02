import React, { useEffect, useState } from "react";
import {
  Briefcase,
  Zap,
  ArrowLeft,
  ChevronRight,
  User,
  Eye 
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Jobs = () => {
  const navigate = useNavigate();
  const { id: recruiterId } = useParams(); // Encoded recruiter ID param
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        if (!recruiterId) {
          setError("Recruiter ID not found");
          setLoading(false);
          return;
        }

        const decodedId = atob(recruiterId);

        const response = await axios.get("http://localhost:5000/api/recruiter/jobs", {
          headers: { "x-recruiter-id": decodedId },
        });

        if (response.data.success && response.data.jobs) {
          setJobs(response.data.jobs);
          setError("");
        } else {
          setJobs([]);
          setError("Failed to load jobs");
        }
      } catch (e) {
        console.error(e);
        setError("Error fetching jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [recruiterId]);

  // Navigate to job detail page with base64 encoded job id
  const goToJobDetails = (jobId) => {
    const encodedJobId = btoa(jobId.toString());
    navigate(`/recruiter/${recruiterId}/job-details/${encodedJobId}`);
  };

  // Back button click
  const handleBack = () => {
    navigate(-1);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading jobs...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-[#16161c] px-4 py-20 flex flex-col items-center">
      {/* Back Arrow Top Left */}
      <div className="self-start mb-8 ml-4 cursor-pointer" onClick={handleBack}>
        <ArrowLeft size={28} className="text-white hover:text-pink-400 transition-colors" />
      </div>

      {/* Header Icon */}
      <div className="mb-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-md">
          <Briefcase size={32} className="text-white" />
        </div>
      </div>

      <h1 className="text-4xl font-bold text-white mb-2 text-center">Jobs Hub</h1>

{/* 
      <p className="text-[#B9BAC3] max-w-xl text-center mb-10">
        The future of job management is being crafted. This portal will transform how you create,
        manage, and track job postings with AI-powered insights and seamless workflows.
      </p> */}

      {/* Jobs grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl w-full">
        {jobs.length === 0 && (
          <p className="text-center text-gray-400 col-span-full">No jobs available.</p>
        )}

        {jobs.map((job) => {
          const postedDate = job.created_at
            ? new Date(job.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "N/A";

          return (
            <div
              key={job.id}
              className="bg-[#232129] rounded-xl p-6 flex flex-col justify-between shadow-md border border-[#353241] hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => goToJobDetails(job.id)}
            >
              <div>
                <h2 className="text-xl font-semibold text-white mb-2 truncate">{job.job_title}</h2>
                <p className="text-sm text-[#B9BAC3] mb-1 truncate">{job.dept_name || "N/A"}</p>
                <p className="text-sm text-[#B9BAC3] mb-1 truncate">{job.job_location || "N/A"}</p>
                <p className="text-sm text-[#B9BAC3] mb-1 truncate">{job.salary_range || "N/A"}</p>
                <p className="text-xs text-gray-400">
                  Posted on: {postedDate}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent triggering card click
                  goToJobDetails(job.id);
                }}
                className="mt-4 inline-flex items-center gap-2 text-white bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-pink-600 transition"
              >
                <Eye size={16} /> View Details
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Jobs;
