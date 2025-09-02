import React, { useState } from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [userType, setUserType] = useState('candidate');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
        userType,
      });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userType', response.data.userType);
        localStorage.setItem('userId', response.data.userId);
        const encodedId = btoa(response.data.userId.toString());
        navigate(
          userType === 'recruiter' ? `/recruiter/${encodedId}` : `/candidate/${encodedId}`
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#16161c] flex flex-col items-center justify-center py-20 px-4">
      <div className="mb-6 flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-md">
          <Lock className="w-8 h-8 text-white" />
        </div>
      </div>

      <h1 className="text-4xl font-bold text-white mb-4 tracking-tight text-center">Welcome Back</h1>

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

      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-[#232129] rounded-xl p-8 border border-[#353241] shadow-[0_4px_24px_0_rgba(32,24,40,0.08)]"
      >
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

        <div className="mb-6">
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

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 rounded-lg hover:from-pink-400 hover:to-purple-400 transition"
        >
          Log In
        </button>
      </form>

      <button
        onClick={() => navigate('/register')}
        className="mt-6 flex items-center gap-2 px-6 py-3 rounded-lg bg-[#232129] text-[#B9BAC3] font-bold text-base border border-[#353241] hover:text-white hover:shadow-[0_8px_32px_0_rgba(255,115,174,0.1)] transition"
      >
        <ArrowLeft className="w-5 h-5" />
        Register Now
      </button>
    </div>
  );
};

export default Login;
