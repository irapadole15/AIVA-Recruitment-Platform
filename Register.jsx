import React, { useState } from 'react';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [userType, setUserType] = useState('candidate');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [designation, setDesignation] = useState('');
  const [resume, setResume] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    if (userType === 'recruiter') {
      formData.append('designation', designation);
    } else {
      if (resume) formData.append('resume', resume);
    }
    formData.append('userType', userType);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        // Store userType and userId in localStorage
        localStorage.setItem('userType', response.data.userType);
        localStorage.setItem('userId', response.data.userId);
        // Navigate to encoded URL
        const encodedId = btoa(response.data.userId);
        navigate(userType === 'recruiter' ? `/recruiter/${encodedId}` : `/candidate/${encodedId}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#16161c] flex flex-col items-center justify-center py-20 px-4">
      {/* Icon */}
      <div className="mb-6 flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-md">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-4xl font-bold text-white mb-4 tracking-tight text-center">Join Us</h1>

      {/* User Type Toggle */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setUserType('candidate')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm ${
            userType === 'candidate'
              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
              : 'bg-[#232129] text-[#B9BAC3] border border-[#353241]'
          }`}
        >
          Candidate
        </button>
        <button
          onClick={() => setUserType('recruiter')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm ${
            userType === 'recruiter'
              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
              : 'bg-[#232129] text-[#B9BAC3] border border-[#353241]'
          }`}
        >
          Recruiter
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleRegister} className="w-full max-w-md bg-[#232129] rounded-xl p-8 border border-[#353241] shadow-[0_4px_24px_0_rgba(32,24,40,0.08)]">
        <div className="mb-4">
          <label className="text-[#B9BAC3] text-sm font-medium mb-2 block">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#16161c] border border-[#353241] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-[#B9BAC3] text-sm font-medium mb-2 block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#16161c] border border-[#353241] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-[#B9BAC3] text-sm font-medium mb-2 block">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#16161c] border border-[#353241] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Enter your password"
            required
          />
        </div>
        {userType === 'recruiter' && (
          <div className="mb-4">
            <label className="text-[#B9BAC3] text-sm font-medium mb-2 block">Designation</label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-full bg-[#16161c] border border-[#353241] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Enter your designation"
            />
          </div>
        )}
        {userType === 'candidate' && (
          <div className="mb-4">
            <label className="text-[#B9BAC3] text-sm font-medium mb-2 block">Upload Resume</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResume(e.target.files[0])}
              className="w-full bg-[#16161c] border border-[#353241] rounded-lg px-4 py-3 text-white text-sm file:bg-gradient-to-r file:from-pink-500 file:to-purple-500 file:text-white file:font-semibold file:rounded-lg file:border-0 file:px-4 file:py-2"
            />
          </div>
        )}
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 rounded-lg hover:from-pink-400 hover:to-purple-400 transition"
        >
          Register
        </button>
      </form>

      {/* Login Link */}
      <button
        onClick={() => navigate('/')}
        className="mt-6 flex items-center gap-2 px-6 py-3 rounded-lg bg-[#232129] text-[#B9BAC3] font-bold text-base border border-[#353241] hover:text-white hover:shadow-[0_8px_32px_0_rgba(255,115,174,0.1)] transition"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Login
      </button>
    </div>
  );
};

export default Register;