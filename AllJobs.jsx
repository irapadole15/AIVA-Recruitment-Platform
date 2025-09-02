import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeft, Filter } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [search, setSearch] = useState('');
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());

  const navigate = useNavigate();
  const { id: encodedCandidateId } = useParams();

  // Decode candidate ID from base64
  const candidate_id = encodedCandidateId ? atob(encodedCandidateId) : null;

  // Fetch jobs & applied ids
  const fetchJobs = async (filters = {}) => {
    setError('');
    try {
      const res = await axios.get('http://localhost:5000/api/recruiter/jobs');
      let filtered = res.data.jobs || [];

      if (filters.department) {
        filtered = filtered.filter(j => (j.dept_id + '') === filters.department);
      }
      if (filters.location) {
        filtered = filtered.filter(j =>
          j.job_location?.toLowerCase().includes(filters.location.toLowerCase())
        );
      }
      if (filters.search) {
        filtered = filtered.filter(j =>
          j.job_title.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      setJobs(filtered);

      if (candidate_id) {
        const appliedRes = await axios.get(`http://localhost:5000/api/candidate/applied-job-ids/${candidate_id}`);
        if (appliedRes.data.success) {
          setAppliedJobIds(new Set(appliedRes.data.appliedJobIds));
        }
      }
    } catch {
      setError('Failed to load jobs');
    }
  };

  // Fetch departments for filter options
  const fetchDepartments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/recruiter/job-departments');
      setDepartments(res.data.departments || []);
    } catch {
      setDepartments([]);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchDepartments();
  }, []);

  const onApplyFilters = (e) => {
    e?.preventDefault();
    fetchJobs({ department, location, search });
  };

  const onClearFilters = () => {
    setDepartment('');
    setLocation('');
    setSearch('');
    fetchJobs({});
  };

  const handleApply = async (jobId) => {
    if (!candidate_id) {
      return Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Candidate ID is missing or invalid',
        background: '#1A1A23',
        color: 'white',
        confirmButtonColor: '#D53F8C',
      });
    }

    const result = await Swal.fire({
      title: 'Apply for this job?',
      icon: 'question',
      background: '#1A1A23',
      color: 'white',
      showCancelButton: true,
      confirmButtonText: 'Yes, apply',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#D53F8C',
      cancelButtonColor: '#6B7280',
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.post('http://localhost:5000/api/candidate/apply-job', {
          candidate_id,
          job_id: jobId,
        });
        if (res.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Applied!',
            text: res.data.message,
            background: '#1A1A23',
            color: 'white',
            confirmButtonColor: '#D53F8C',
          });
          setAppliedJobIds((prev) => new Set(prev).add(jobId));
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: res.data.message || 'Failed to apply',
            background: '#1A1A23',
            color: 'white',
            confirmButtonColor: '#D53F8C',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Server error',
          background: '#1A1A23',
          color: 'white',
          confirmButtonColor: '#D53F8C',
        });
      }
    }
  };

  const handleViewAppliedJobs = () => {
    navigate(`/candidate/${encodedCandidateId}/applied-jobs`);
  };

  return (
    <div className="relative min-h-screen bg-[#16161c] p-4 sm:p-8">
      {/* Back Arrow */}
      <button
        className="absolute top-4 left-4 flex items-center gap-2 text-pink-400 hover:text-pink-500 transition z-10 bg-[#232129] bg-opacity-70 p-2 rounded-full"
        onClick={() => navigate(-1)}
        aria-label="Back"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Filter Button and Title Bar */}
      <div className="flex items-center justify-between mb-4 ml-14">
        <h2 className="text-2xl font-bold text-white">All Jobs</h2>
        <button
          className={`flex items-center gap-2 text-pink-400 hover:text-pink-500 transition p-2 rounded-lg
          ${filtersOpen ? 'bg-[#232129] border border-pink-500' : ''}`}
          onClick={() => setFiltersOpen((f) => !f)}
          type="button"
        >
          <Filter className="w-5 h-5" />
          <span className="hidden sm:inline">Filter</span>
        </button>
      </div>

      {/* Filter Section */}
      {filtersOpen && (
        <form
          onSubmit={onApplyFilters}
          className="mb-6 mx-0 sm:mx-14 rounded-lg bg-[#232129] border border-[#353241] p-4 space-y-2 animate-fade-in-down"
        >
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="flex flex-col w-full sm:w-auto">
              <label className="text-xs text-[#B9BAC3] mb-1">Department</label>
              <select
                className="bg-[#16161c] text-white border border-[#353241] rounded-lg px-3 py-2 outline-none"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="">All</option>
                {departments.map((d) => (
                  <option key={d.dept_id} value={d.dept_id}>
                    {d.dept_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col w-full sm:w-auto">
              <label className="text-xs text-[#B9BAC3] mb-1">Location</label>
              <input
                className="bg-[#16161c] text-white border border-[#353241] rounded-lg px-3 py-2 outline-none"
                type="text"
                placeholder="Type location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full sm:w-auto">
              <label className="text-xs text-[#B9BAC3] mb-1">Job Title</label>
              <input
                className="bg-[#16161c] text-white border border-[#353241] rounded-lg px-3 py-2 outline-none"
                type="text"
                placeholder="e.g. Frontend"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 mt-2 sm:mt-7">
              <button
                type="submit"
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-lg hover:from-pink-600 hover:to-purple-600 transition"
              >
                Apply
              </button>
              <button
                type="button"
                className="bg-[#232129] text-[#B9BAC3] py-2 px-4 rounded-lg border border-[#353241] hover:text-white hover:border-pink-500 transition"
                onClick={onClearFilters}
              >
                Clear
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Error */}
      {error && <div className="text-red-400 font-medium mb-4">{error}</div>}

      {/* Jobs grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {jobs.length === 0 && !error && (
          <div className="text-[#B9BAC3] col-span-full text-center py-10 text-lg">No jobs found.</div>
        )}

        {jobs.map((job) => {
          const isApplied = appliedJobIds.has(job.id);
          return (
            <div
              key={job.id}
              className="bg-[#232129] border border-[#353241] rounded-lg p-6 transition hover:shadow-lg hover:border-pink-500 flex flex-col h-full"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-pink-300 px-2 py-1 rounded bg-pink-900 bg-opacity-20">
                  {job.dept_name}
                </span>
                <span className="text-xs text-[#B9BAC3]">
                  {new Date(job.created_at).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-bold text-lg text-white mb-1">{job.job_title}</h3>
              <p className="text-[#B9BAC3] text-sm mb-4 line-clamp-3">{job.job_description}</p>
              <div className="mt-auto space-y-3">
                <div className="flex items-center text-xs text-[#B9BAC3]">
                  <span className="font-medium w-20">Location:</span>
                  <span>{job.job_location}</span>
                </div>
                <div className="flex items-center text-xs text-[#B9BAC3]">
                  <span className="font-medium w-20">Salary:</span>
                  <span>{job.salary_range}</span>
                </div>
                <div className="flex items-center text-xs text-[#B9BAC3]">
                  <span className="font-medium w-20">Posted by:</span>
                  <span>{job.created_by_name}</span>
                </div>

                {/* Buttons row */}
                <div className="flex gap-2 mt-4">
                  <button
                    disabled={isApplied}
                    onClick={() => handleApply(job.id)}
                    className={`flex-1 bg-gradient-to-r text-white py-2 rounded-lg font-semibold transition ${
                      isApplied
                        ? 'from-gray-600 to-gray-600 cursor-not-allowed'
                        : 'from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
                    }`}
                    type="button"
                  >
                    {isApplied ? 'Applied' : 'Apply'}
                  </button>

                  {isApplied && (
                    <button
                      onClick={handleViewAppliedJobs}
                      className="flex-1 bg-[#353241] text-white py-2 rounded-lg font-semibold hover:bg-[#4B1E66] transition"
                      type="button"
                    >
                      View
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllJobs;
