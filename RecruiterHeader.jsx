import React, { useState, useEffect } from 'react';
import { User, Menu, Search } from 'lucide-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const RecruiterHeader = ({ setMobileOpen, onPostNewJob }) => {
  const { id } = useParams(); // Encoded recruiter id from URL
  const [recruiter, setRecruiter] = useState({ name: '', designation: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecruiterDetails = async () => {
      try {
        // Call backend with recruiter id param (decode if needed)
        // If id is base64 encoded, decode before sending to backend
        const decodedId = atob(id);

        const response = await axios.get(`http://localhost:5000/api/recruiter/recruiter-details/${decodedId}`);

        setRecruiter({
          name: response.data.recruiter.recruiter_name,
          designation: response.data.recruiter.recruiter_designation || 'Recruiter',
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch recruiter details');
        setRecruiter({ name: 'Unknown User', designation: 'Recruiter' }); // fallback
      }
    };
    if (id) {
      fetchRecruiterDetails();
    }
  }, [id]);

  return (
    <div className="w-[80%] bg-[#16161c] text-white p-4 sm:p-6 fixed top-0 z-10 box-border border-b border-[#353241] shadow-md">
      <div className="flex items-center justify-between flex-wrap gap-4 max-w-7xl mx-auto">
        {/* Left Section: Title and Subtitle */}
        <div className="min-w-0">
          <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white truncate">Recruiter Dashboard</h2>
          <p className="text-xs sm:text-sm text-[#B9BAC3] truncate">
            Welcome back, manage your recruitment pipeline
          </p>
        </div>

        {/* Right Section: Search, Button, User Info, Menu */}
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

          {/* Post New Job Button */}
          <button
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg py-2 px-3 sm:px-4 text-xs sm:text-sm font-semibold hover:from-pink-600 hover:to-purple-600 transition-all whitespace-nowrap"
            onClick={onPostNewJob}
            type="button"
          >
            + Post New Job
          </button>

          {/* User Info */}
          <div className="hidden sm:flex items-center space-x-2 min-w-0">
            <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0">
              <User size={14} className="text-white sm:size-16" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-white truncate">{recruiter.name}</p>
              <p className="text-xs text-[#B9BAC3] truncate">{recruiter.designation}</p>
              {error && <p className="text-red-400 text-xs truncate">{error}</p>}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#B9BAC3] hover:text-white ml-2 flex-shrink-0"
            onClick={() => setMobileOpen && setMobileOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecruiterHeader;