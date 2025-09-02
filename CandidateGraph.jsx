import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { useParams } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CandidateGraph = () => {
  const { id } = useParams();
  const [decodedid, setDecodedid] = useState(null);
  const [stageData, setStageData] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Recruitment stages from the table
  const stages = [
    { id: 1, stage: 'sourced' },
    { id: 2, stage: 'screening' },
    { id: 3, stage: 'interview' },
    { id: 4, stage: 'offer' },
    { id: 5, stage: 'hired' },
  ];

  // Decode id
  useEffect(() => {
    if (!id) {
      setError('Recruiter ID is missing');
      setLoading(false);
      return;
    }

    const isValidBase64 = /^[A-Za-z0-9+/=]+$/.test(id);
    if (!isValidBase64) {
      setError('Invalid recruiter ID format');
      setLoading(false);
      return;
    }

    try {
      const decoded = atob(id);
      const parsedId = parseInt(decoded, 10);
      if (isNaN(parsedId) || parsedId <= 0) {
        setError('Invalid recruiter ID: not a valid number');
        setLoading(false);
        return;
      }
      setDecodedid(parsedId);
    } catch (err) {
      console.error('Error decoding id:', err);
      setError('Failed to decode recruiter ID: ' + err.message);
      setLoading(false);
    }
  }, [id]);

  // Fetch pipeline stats
  useEffect(() => {
    if (!decodedid) return;

    const fetchPipelineStats = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/recruiter/${decodedid}/pipeline-stats`);
        if (response.data.success) {
          setStageData(response.data.data || []);
          setJobs(response.data.jobs || []);
          setError('');
        } else {
          setError('Failed to fetch pipeline stats');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Error fetching pipeline stats: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPipelineStats();
  }, [decodedid]);

  // Prepare chart data
  const getChartData = () => {
    const counts = stages.map(stage => {
      const filteredData = selectedJob === 'all'
        ? stageData
        : stageData.filter(item => item.job_id === parseInt(selectedJob, 10));
      const stageItem = filteredData.find(item => item.recruitment_stage_id === stage.id);
      return stageItem ? stageItem.candidate_count : 0;
    });

    return {
      labels: stages.map(stage => stage.stage.charAt(0).toUpperCase() + stage.stage.slice(1)),
      datasets: [{
        label: 'Candidates',
        data: counts,
        backgroundColor: [
          'rgba(219, 39, 119, 0.9)',  // Pink for Sourced
          'rgba(147, 51, 234, 0.9)',  // Purple for Screening
          'rgba(255, 99, 132, 0.9)',  // Red for Interview
          'rgba(54, 162, 235, 0.9)',  // Blue for Offer
          'rgba(75, 192, 192, 0.9)',  // Teal for Hired
        ],
        borderColor: [
          'rgba(219, 39, 119, 1)',
          'rgba(147, 51, 234, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
        barThickness: 40,
      }],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: 'rgba(255, 255, 255, 0.5)' },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          stepSize: 1,
          callback: (value) => Number.isInteger(value) ? value : null,
        },
      },
    },
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 sm:p-6 h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-300">Candidate Pipeline</h3>
          <p className="text-sm text-gray-500">Track candidates through recruitment stages</p>
        </div>
        <select
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
          className="bg-gray-800 text-white rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        >
          <option value="all">All Jobs</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>{job.job_title}</option>
          ))}
        </select>
      </div>
      {loading && <p className="text-white">Loading pipeline stats...</p>}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && !error && (
        <div className="h-64 sm:h-80">
          <Bar data={getChartData()} options={options} />
        </div>
      )}
    </div>
  );
};

export default CandidateGraph;