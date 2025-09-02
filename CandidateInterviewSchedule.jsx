import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const CandidateInterviewSchedule = () => {
  const { id: encodedCandidateId } = useParams();
  const candidateId = encodedCandidateId ? atob(encodedCandidateId) : null;
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!candidateId) {
      setError("Candidate ID missing or invalid");
      setLoading(false);
      return;
    }

    const fetchInterviews = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          `http://localhost:5000/api/candidate/${candidateId}/interview-schedule`
        );
        if (res.data.success) {
          setInterviews(res.data.interviews);
        } else {
          setError("Failed to fetch interview schedules");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching interview schedules");
      }
      setLoading(false);
    };

    fetchInterviews();
  }, [candidateId]);

  if (loading) {
    return (
      <div className="text-white p-6 flex items-center justify-center min-h-screen bg-[#16161c]">
        Loading interview schedules...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-6 flex items-center justify-center min-h-screen bg-[#16161c] font-semibold">
        {error}
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <div className="text-gray-400 p-6 flex items-center justify-center min-h-screen bg-[#16161c] text-lg">
        No scheduled interviews found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#16161c] p-6 max-w-full mx-auto font-sans text-white">
      {/* Back Button */}
      <button
        className="mb-6 flex items-center gap-2 text-pink-400 hover:text-pink-500 focus:outline-none"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={20} />
        
      </button>

      <h2 className="text-2xl font-bold mb-4">My Interview Schedule</h2>

      <div className="space-y-4">
        {interviews.map((interview) => {
          const interviewDate = new Date(interview.interview_date);
          return (
            <div
              key={interview.id}
              className="p-4 bg-[#232129] rounded-lg shadow border border-[#353241]"
            >
              <h3 className="text-lg font-semibold">{interview.interview_title}</h3>
              <p className="text-sm text-[#B9BAC3] mb-1">
                <span className="font-medium">Date: </span>{" "}
                {interviewDate.toLocaleDateString(undefined, {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm text-[#B9BAC3] mb-1">
                <span className="font-medium">Time: </span>{" "}
                {interview.interview_time.from} - {interview.interview_time.to}
              </p>
              <p className="text-sm text-[#B9BAC3] mb-1">
                <span className="font-medium">Job: </span> {interview.job_title}
              </p>
              <p className="text-sm text-[#B9BAC3]">
                <span className="font-medium">Recruiter: </span> {interview.recruiter_name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CandidateInterviewSchedule;
