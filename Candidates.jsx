// import React, { useEffect, useState, useRef } from 'react';
// import { User2, ArrowLeft, FileText, Maximize, Download, X } from 'lucide-react';
// import axios from 'axios';

// const Candidates = () => {
//   const [candidates, setCandidates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
  
//   // Modal state
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);
//   const modalRef = useRef(null);
  
//   // Fetch candidates on mount
//   useEffect(() => {
//     const fetchCandidates = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/recruiter/candidates');
//         if (response.data.success) {
//           setCandidates(response.data.candidates);
//           setError('');
//         } else {
//           setError('Failed to fetch candidates');
//         }
//       } catch (err) {
//         setError('Error fetching candidates');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCandidates();
//   }, []);

//   // Close modal on click outside modal content
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (modalOpen && modalRef.current && !modalRef.current.contains(event.target)) {
//         closeModal();
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [modalOpen]);

//   const openModal = (candidate) => {
//     setSelectedCandidate(candidate);
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setSelectedCandidate(null);
//   };

//   // Format date helper
//   const formatDate = (dateStr) => {
//     if (!dateStr) return 'N/A';
//     const d = new Date(dateStr);
//     return d.toLocaleDateString(undefined, {
//       year: 'numeric', month: 'short', day: 'numeric'
//     });
//   };

//   // Download resume with proper filename
//   const downloadResume = () => {
//     if (!selectedCandidate?.candidate_resume) return;
//     const url = selectedCandidate.candidate_resume.startsWith('http')
//       ? selectedCandidate.candidate_resume
//       : `http://localhost:5000${selectedCandidate.candidate_resume}`;

//     // Create anchor element programmatically
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `${selectedCandidate.candidate_name.replace(/\s+/g, '_')}_resume.pdf`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Open resume fullscreen in new tab
//   const viewResumeFullscreen = () => {
//     if (!selectedCandidate?.candidate_resume) return;
//     const url = selectedCandidate.candidate_resume.startsWith('http')
//       ? selectedCandidate.candidate_resume
//       : `http://localhost:5000${selectedCandidate.candidate_resume}`;
//     window.open(url, '_blank', 'noopener,noreferrer');
//   };

//   // Navigate back function (history back)
//   const goBack = () => window.history.back();

//   return (
//     <div className="min-h-screen bg-[#16161c] flex flex-col items-center py-20 px-4 relative">
//       {/* Left arrow top-left */}
//       <button
//         onClick={goBack}
//         className="absolute top-5 left-5 text-white hover:text-pink-400 transition-colors"
//         aria-label="Go back"
//         type="button"
//       >
//         <ArrowLeft size={28} />
//       </button>

//       {/* Header icon */}
//       <div className="mb-6 flex items-center justify-center">
//         <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-md">
//           <User2 className="w-8 h-8 text-white" />
//         </div>
//       </div>

//       {/* Heading */}
//       <h1 className="text-4xl font-bold text-white mb-1 tracking-tight text-center">Candidates Hub</h1>


//       {/* Description */}
//       <div className="text-[#B9BAC3] mb-10 max-w-xl text-center text-sm sm:text-base">
//         Supercharge your talent acquisition process! Seamlessly manage all your candidates, unlock actionable insights, and make smarter hiring decisions—all from one intelligent hub.
//       </div>

//       {/* Loading/Error */}
//       {loading && <p className="text-white">Loading candidates...</p>}
//       {error && <p className="text-red-400">{error}</p>}

//       {/* Candidates grid */}
//       <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
//         {candidates.map(candidate => (
//           <div
//             key={candidate.id}
//             className="bg-[#232129] rounded-xl p-6 shadow-[0_4px_24px_rgba(32,24,40,0.08)] border border-[#353241] cursor-pointer hover:shadow-[0_8px_32px_rgba(255,115,174,0.1)] transition"
//           >
//             <div className="flex items-center mb-4">
//               <User2 size={24} className="text-pink-400 mr-3" />
//               <div className="truncate">
//                 <h3 className="text-white text-lg font-semibold truncate">{candidate.candidate_name}</h3>
//                 <p className="text-xs text-[#B9BAC3] truncate">{candidate.candidate_email}</p>
//                 <p className="text-xs text-gray-500">
//                   Registered: {formatDate(candidate.created_at)}
//                 </p>
//               </div>
//             </div>

//             {/* Resume button */}
//             <button
//               onClick={() => openModal(candidate)}
//               className="flex items-center gap-2 text-pink-400 hover:text-pink-300 font-semibold text-sm"
//               type="button"
//               aria-label={`View resume of ${candidate.candidate_name}`}
//             >
//               <FileText size={18} />
//               View Resume
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Modal */}
//       {modalOpen && selectedCandidate && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//           role="dialog"
//           aria-modal="true"
//           aria-labelledby="modal-title"
//           onClick={closeModal}
//         >
//           <div
//             className="relative max-w-4xl w-full bg-[#16161c] rounded-2xl shadow-2xl overflow-hidden"
//             ref={modalRef}
//             onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
//           >
//             {/* Modal header */}
//             <div className="flex justify-between items-center p-4 border-b border-[#353241]">
//               <h2 id="modal-title" className="text-white font-bold text-lg truncate max-w-[80%]">
//                 {selectedCandidate.candidate_name}'s Resume
//               </h2>
//               <button
//                 onClick={closeModal}
//                 className="text-[#B9BAC3] hover:text-pink-400"
//                 aria-label="Close resume modal"
//                 type="button"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             {/* Modal toolbar */}
//             <div className="flex gap-4 p-4 border-b border-[#353241]">
//               <button
//                 onClick={viewResumeFullscreen}
//                 className="flex items-center gap-2 text-pink-400 hover:text-pink-300 font-semibold"
//                 title="Open resume in new tab"
//                 type="button"
//               >
//                 <Maximize size={20} />
//                 Full Screen
//               </button>
//               <button
//                 onClick={downloadResume}
//                 className="flex items-center gap-2 text-pink-400 hover:text-pink-300 font-semibold"
//                 title="Download resume"
//                 type="button"
//               >
//                 <Download size={20} />
//                 Download
//               </button>
//             </div>

//             {/* Resume content */}
//             <iframe
//               title={`${selectedCandidate.candidate_name} Resume`}
//               src={
//                 selectedCandidate.candidate_resume.startsWith('http')
//                   ? selectedCandidate.candidate_resume
//                   : `http://localhost:5000${selectedCandidate.candidate_resume}`
//               }
//               className="w-full h-[80vh] bg-[#232129]"
//               frameBorder="0"
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Candidates;
















import React, { useEffect, useState, useRef } from 'react';
import { User2, ArrowLeft, FileText, Maximize, Download, X, Edit, Save, Trash2, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Candidates = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [decodedid, setDecodedid] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [editingStage, setEditingStage] = useState(null); // { candidateId, jobId }
  const modalRef = useRef(null);

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
      if (isNaN(parsedId)) {
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

  // Fetch candidates, their jobs, and stages
  useEffect(() => {
    if (!decodedid) return;

    const fetchData = async () => {
      try {
        const [candidatesRes, pipelineRes, stagesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/recruiter/candidates'),
          axios.get('http://localhost:5000/api/recruiter/candidate-pipeline', {
            headers: { 'x-recruiter-id': decodedid }
          }),
          axios.get('http://localhost:5000/api/recruiter/recruitment-stages'),
        ]);

        if (candidatesRes.data.success) {
          const candidatesData = candidatesRes.data.candidates;
          const pipelineData = pipelineRes.data.success ? pipelineRes.data.pipeline : [];
          setCandidates(candidatesData.map(candidate => ({
            ...candidate,
            jobs: pipelineData
              .filter(p => p.candidate_id === candidate.id)
              .flatMap(p => p.jobs)
              .map(job => ({
                ...job,
                originalStage: job.recruitment_stage_id // Store original stage for cancel
              }))
          })));
        } else {
          setError('Failed to fetch candidates');
        }

        if (stagesRes.data.success) {
          setStages(stagesRes.data.stages);
        } else {
          setError('Failed to fetch recruitment stages');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Error fetching data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [decodedid]);

  // Close modal on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalOpen && modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [modalOpen]);

  const openModal = (candidate) => {
    setSelectedCandidate(candidate);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCandidate(null);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    }).replace(/ /g, ' ');
  };

  const downloadResume = () => {
    if (!selectedCandidate?.candidate_resume) return;
    const url = selectedCandidate.candidate_resume.startsWith('http')
      ? selectedCandidate.candidate_resume
      : `http://localhost:5000${selectedCandidate.candidate_resume}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedCandidate.candidate_name.replace(/\s+/g, '_')}_resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const viewResumeFullscreen = () => {
    if (!selectedCandidate?.candidate_resume) return;
    const url = selectedCandidate.candidate_resume.startsWith('http')
      ? selectedCandidate.candidate_resume
      : `http://localhost:5000${selectedCandidate.candidate_resume}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const goBack = () => navigate(-1);

  const startEditing = (candidateId, jobId) => {
    setEditingStage({ candidateId, jobId });
  };

  const cancelEditing = (candidateId, jobId) => {
    setCandidates(prev =>
      prev.map(candidate =>
        candidate.id === candidateId
          ? {
              ...candidate,
              jobs: candidate.jobs.map(job =>
                job.job_id === jobId
                  ? { ...job, recruitment_stage_id: job.originalStage }
                  : job
              )
            }
          : candidate
      )
    );
    setEditingStage(null);
  };

  const handleStageChange = (candidateId, jobId, newStageId) => {
    setCandidates(prev =>
      prev.map(candidate =>
        candidate.id === candidateId
          ? {
              ...candidate,
              jobs: candidate.jobs.map(job =>
                job.job_id === jobId
                  ? { ...job, recruitment_stage_id: newStageId ? Number(newStageId) : null }
                  : job
              )
            }
          : candidate
      )
    );
  };

  const saveChanges = async (candidateId, jobId) => {
    if (!decodedid) {
      alert('Invalid recruiter ID');
      return;
    }

    setSaving(true);
    try {
      const candidate = candidates.find(c => c.id === candidateId);
      const job = candidate.jobs.find(j => j.job_id === jobId);
      
      if (job.recruitment_stage_id !== null && job.recruitment_stage_id !== undefined) {
        await axios.put('http://localhost:5000/api/recruiter/candidate-pipeline', {
          recruiter_id: decodedid,
          candidate_id: candidateId,
          job_id: jobId,
          recruitment_stage_id: job.recruitment_stage_id,
        });
        
        // Update original stage after successful save
        setCandidates(prev =>
          prev.map(candidate =>
            candidate.id === candidateId
              ? {
                  ...candidate,
                  jobs: candidate.jobs.map(job =>
                    job.job_id === jobId
                      ? { ...job, originalStage: job.recruitment_stage_id }
                      : job
                  )
                }
              : candidate
          )
        );
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to update stage: ' + err.message);
    } finally {
      setSaving(false);
      setEditingStage(null);
    }
  };

  const getStageName = (stageId) => {
    const stage = stages.find(s => s.id === stageId);
    return stage ? stage.stage : 'Not Set';
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center py-8 px-4 relative">
      <div className="w-full max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>
          
          <h1 className="text-2xl font-bold text-gray-800">Candidates Management</h1>
          
          <div className="w-28"></div> {/* For balance */}
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate Details</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resume</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Jobs</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {candidates.map((candidate, index) => (
                    <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white">
                            <User2 size={18} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{candidate.candidate_name}</div>
                            <div className="text-sm text-gray-500">{candidate.candidate_email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => openModal(candidate)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          View Resume
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          {candidate.jobs && candidate.jobs.length > 0 ? (
                            candidate.jobs.map((job) => (
                              <div key={job.job_id} className="flex items-center gap-3">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{job.job_title}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {editingStage?.candidateId === candidate.id && editingStage?.jobId === job.job_id ? (
                                    <>
                                      <select
                                        value={job.recruitment_stage_id || ''}
                                        onChange={(e) => handleStageChange(candidate.id, job.job_id, e.target.value)}
                                        className="block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
                                      >
                                        <option value="">Select Stage</option>
                                        {stages.map((stage) => (
                                          <option key={stage.id} value={stage.id} className="capitalize">
                                            {stage.stage}
                                          </option>
                                        ))}
                                      </select>
                                      <button
                                        onClick={() => saveChanges(candidate.id, job.job_id)}
                                        disabled={saving}
                                        className="text-green-600 hover:text-green-800 p-1"
                                        title="Save"
                                      >
                                        <Save size={18} />
                                      </button>
                                      <button
                                        onClick={() => cancelEditing(candidate.id, job.job_id)}
                                        className="text-red-600 hover:text-red-800 p-1"
                                        title="Cancel"
                                      >
                                        <X size={18} />
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                        {getStageName(job.recruitment_stage_id)}
                                      </span>
                                      <button
                                        onClick={() => startEditing(candidate.id, job.job_id)}
                                        className="text-gray-500 hover:text-pink-600 p-1"
                                        title="Edit stage"
                                      >
                                        <Edit size={18} />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">No jobs applied</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(candidate.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {modalOpen && selectedCandidate && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={closeModal}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
              <h2 id="modal-title" className="text-lg font-bold text-gray-900 truncate max-w-[80%]">
                {selectedCandidate.candidate_name}'s Resume
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={viewResumeFullscreen}
                  className="p-2 text-gray-600 hover:text-pink-600 rounded-full hover:bg-gray-100"
                  title="Open resume in new tab"
                >
                  <Maximize size={20} />
                </button>
                <button
                  onClick={downloadResume}
                  className="p-2 text-gray-600 hover:text-pink-600 rounded-full hover:bg-gray-100"
                  title="Download resume"
                >
                  <Download size={20} />
                </button>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-600 hover:text-pink-600 rounded-full hover:bg-gray-100"
                  title="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="h-[80vh]">
              <iframe
                title={`${selectedCandidate.candidate_name} Resume`}
                src={
                  selectedCandidate.candidate_resume.startsWith('http')
                    ? selectedCandidate.candidate_resume
                    : `http://localhost:5000${selectedCandidate.candidate_resume}`
                }
                className="w-full h-full bg-gray-100"
                frameBorder="0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidates;