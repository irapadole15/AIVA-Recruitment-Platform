// import React, { useState, useEffect } from "react";
// import { Calendar, Users2, Video, ArrowLeft, Clock, ChevronDown, Plus, Phone } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { Calendar as BigCalendar, dateFnsLocalizer, Views } from "react-big-calendar";
// import format from "date-fns/format";
// import parse from "date-fns/parse";
// import startOfWeek from "date-fns/startOfWeek";
// import getDay from "date-fns/getDay";
// import enUS from "date-fns/locale/en-US";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import { Popover, Transition } from "@headlessui/react";

// // Define locales
// const locales = {
//   "en-US": enUS,
// };

// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek,
//   getDay,
//   locales,
// });

// // Initial mock data
// const initialCandidates = [
//   { id: 1, name: "John Doe", email: "john@example.com" },
//   { id: 2, name: "Jane Smith", email: "jane@example.com" },
//   { id: 3, name: "Robert Johnson", email: "robert@example.com" },
//   { id: 4, name: "Emily Davis", email: "emily@example.com" },
// ];

// const initialInterviews = [
//   {
//     id: 1,
//     title: "Interview with John Doe",
//     start: new Date(2025, 7, 15, 10, 0),
//     end: new Date(2025, 7, 15, 11, 0),
//     candidateId: 1,
//     status: "scheduled",
//   },
//   {
//     id: 2,
//     title: "Technical Round - Jane Smith",
//     start: new Date(2025, 7, 16, 14, 0),
//     end: new Date(2025, 7, 16, 15, 0),
//     candidateId: 2,
//     status: "scheduled",
//   },
// ];

// const CalendarPage = () => {
//   const navigate = useNavigate();
//   const [view, setView] = useState(Views.MONTH);
//   const [date, setDate] = useState(new Date());
//   const [showScheduleModal, setShowScheduleModal] = useState(false);
//   const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);
//   const [interviewTitle, setInterviewTitle] = useState("");
//   const [newCandidateName, setNewCandidateName] = useState("");
//   const [newCandidateEmail, setNewCandidateEmail] = useState("");
//   const [interviews, setInterviews] = useState(() => {
//     const saved = localStorage.getItem("interviews");
//     return saved
//       ? JSON.parse(saved, (key, value) => (key === "start" || key === "end" ? new Date(value) : value))
//       : initialInterviews;
//   });
//   const [candidates, setCandidates] = useState(() => {
//     const saved = localStorage.getItem("candidates");
//     return saved ? JSON.parse(saved) : initialCandidates;
//   });

//   // Save to localStorage whenever interviews or candidates change
//   useEffect(() => {
//     localStorage.setItem("interviews", JSON.stringify(interviews));
//   }, [interviews]);

//   useEffect(() => {
//     localStorage.setItem("candidates", JSON.stringify(candidates));
//   }, [candidates]);

//   const handleSelectSlot = (slotInfo) => {
//     setSelectedSlot(slotInfo);
//     setShowScheduleModal(true);
//   };

//   const handleScheduleInterview = () => {
//     if (!selectedCandidate || !selectedSlot) return;

//     const newInterview = {
//       id: interviews.length + 1,
//       title: interviewTitle || `Interview with ${selectedCandidate.name}`,
//       start: selectedSlot.start,
//       end: selectedSlot.end,
//       candidateId: selectedCandidate.id,
//       status: "scheduled",
//     };

//     setInterviews([...interviews, newInterview]);
//     setShowScheduleModal(false);
//     setSelectedCandidate(null);
//     setInterviewTitle("");
//   };

//   const handleAddCandidate = () => {
//     if (!newCandidateName || !newCandidateEmail) return;

//     const newCandidate = {
//       id: candidates.length + 1,
//       name: newCandidateName,
//       email: newCandidateEmail,
//     };

//     setCandidates([...candidates, newCandidate]);
//     setShowAddCandidateModal(false);
//     setNewCandidateName("");
//     setNewCandidateEmail("");
//   };

//   const handleStartVideoCall = (interview) => {
//     alert(`Initiating video call with ${interview.title}`);
//   };

//   const eventStyleGetter = (event) => {
//     let backgroundColor = "#10B981"; // Emerald for scheduled
//     if (event.status === "completed") backgroundColor = "#6B7280"; // Gray for completed
//     if (event.status === "cancelled") backgroundColor = "#F87171"; // Red for cancelled

//     return {
//       style: {
//         backgroundColor,
//         borderRadius: "6px",
//         border: "none",
//         color: "#FFFFFF",
//         padding: "4px 8px",
//         fontSize: "0.9rem",
//         fontWeight: 500,
//         boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
//       },
//     };
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-900 font-inter">
//       <div className="container mx-auto px-4 py-10">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate(-1)}
//               className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-100 transition shadow-sm"
//             >
//               <ArrowLeft className="w-5 h-5" />
//               Back
//             </button>
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-indigo-500 flex items-center justify-center">
//                 <Calendar className="w-5 h-5 text-white" />
//               </div>
//               <h1 className="text-2xl font-bold text-gray-800">Smart Calendar</h1>
//             </div>
//           </div>
//           <div className="flex gap-3">
//             <Popover className="relative">
//               {({ open }) => (
//                 <>
//                   <Popover.Button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100 transition shadow-sm">
//                     <span className="font-medium">
//                       {view === Views.DAY ? "Day" : view === Views.WEEK ? "Week" : "Month"}
//                     </span>
//                     <ChevronDown
//                       className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}
//                     />
//                   </Popover.Button>
//                   <Transition
//                     enter="transition duration-150 ease-out"
//                     enterFrom="transform scale-95 opacity-0"
//                     enterTo="transform scale-100 opacity-100"
//                     leave="transition duration-100 ease-out"
//                     leaveFrom="transform scale-100 opacity-100"
//                     leaveTo="transform scale-95 opacity-0"
//                   >
//                     <Popover.Panel className="absolute z-10 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-200">
//                       <div className="p-2">
//                         <button
//                           onClick={() => setView(Views.DAY)}
//                           className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700"
//                         >
//                           Day View
//                         </button>
//                         <button
//                           onClick={() => setView(Views.WEEK)}
//                           className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700"
//                         >
//                           Week View
//                         </button>
//                         <button
//                           onClick={() => setView(Views.MONTH)}
//                           className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700"
//                         >
//                           Month View
//                         </button>
//                       </div>
//                     </Popover.Panel>
//                   </Transition>
//                 </>
//               )}
//             </Popover>
//             <button
//               onClick={() => {
//                 setView(Views.DAY);
//                 setDate(new Date());
//               }}
//               className="px-4 py-2 bg-gradient-to-r from-emerald-400 to-indigo-500 text-white rounded-lg hover:from-emerald-500 hover:to-indigo-600 transition shadow-sm"
//             >
//               Today
//             </button>
//             <button
//               onClick={() => setShowAddCandidateModal(true)}
//               className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition shadow-sm"
//             >
//               <Plus className="w-5 h-5" />
//               Add Candidate
//             </button>
//           </div>
//         </div>

//         {/* Calendar */}
//         <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-lg mb-8">
//           <BigCalendar
//             localizer={localizer}
//             events={interviews}
//             startAccessor="start"
//             endAccessor="end"
//             style={{ height: 600 }}
//             view={view}
//             onView={setView}
//             date={date}
//             onNavigate={setDate}
//             selectable
//             onSelectSlot={handleSelectSlot}
//             eventPropGetter={eventStyleGetter}
//             components={{
//               event: ({ event }) => (
//                 <div className="py-2 px-3">
//                   <div className="font-semibold text-sm truncate">{event.title}</div>
//                   <div className="text-xs text-gray-600">
//                     {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
//                   </div>
//                 </div>
//               ),
//             }}
//           />
//         </div>

//         {/* Features Section */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-10 h-10 rounded-full bg-emerald-400 flex items-center justify-center">
//                 <Calendar className="w-5 h-5 text-white" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-800">Smart Scheduling</h3>
//             </div>
//             <p className="text-gray-600 text-sm leading-relaxed">
//               AI-driven scheduling optimizes time slots for all participants, ensuring efficiency.
//             </p>
//           </div>
//           <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
//                 <Users2 className="w-5 h-5 text-white" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-800">Team Coordination</h3>
//             </div>
//             <p className="text-gray-600 text-sm leading-relaxed">
//               Seamlessly sync with team calendars for perfect scheduling alignment.
//             </p>
//           </div>
//           <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-10 h-10 rounded-full bg-emerald-400 flex items-center justify-center">
//                 <Video className="w-5 h-5 text-white" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-800">Video Integration</h3>
//             </div>
//             <p className="text-gray-600 text-sm leading-relaxed">
//               One-click video call setup for effortless and professional interviews.
//             </p>
//           </div>
//         </div>

//         {/* Upcoming Interviews */}
//         <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
//             <Clock className="w-5 h-5 text-emerald-400" />
//             Upcoming Interviews
//           </h2>
//           <div className="space-y-4">
//             {interviews
//               .filter((int) => int.start > new Date())
//               .sort((a, b) => a.start - b.start)
//               .slice(0, 3)
//               .map((interview) => {
//                 const candidate = candidates.find((c) => c.id === interview.candidateId);
//                 return (
//                   <div
//                     key={interview.id}
//                     className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
//                   >
//                     <div>
//                       <div className="font-semibold text-sm text-gray-800">{interview.title}</div>
//                       <div className="text-xs text-gray-600">
//                         {candidate?.name} ({candidate?.email})
//                       </div>
//                       <div className="text-xs text-gray-500 mt-1">
//                         {format(interview.start, "MMM d, yyyy")} • {format(interview.start, "h:mm a")} -{" "}
//                         {format(interview.end, "h:mm a")}
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => handleStartVideoCall(interview)}
//                       className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-400 to-indigo-500 text-white rounded-lg hover:from-emerald-500 hover:to-indigo-600 transition shadow-sm"
//                     >
//                       <Phone className="w-5 h-5" />
//                       Start Call
//                     </button>
//                   </div>
//                 );
//               })}
//           </div>
//         </div>

//         {/* Schedule Interview Modal */}
//         {showScheduleModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-xl p-6 w-full max-w-md border border-gray-200 shadow-xl">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">Schedule Interview</h2>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//                   <input
//                     type="text"
//                     value={interviewTitle}
//                     onChange={(e) => setInterviewTitle(e.target.value)}
//                     placeholder="e.g., Technical Interview"
//                     className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
//                   <div className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-600">
//                     {format(selectedSlot.start, "MMM d, yyyy h:mm a")} -{" "}
//                     {format(selectedSlot.end, "h:mm a")}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Candidate</label>
//                   <select
//                     value={selectedCandidate?.id || ""}
//                     onChange={(e) => {
//                       const candidate = candidates.find((c) => c.id === parseInt(e.target.value));
//                       setSelectedCandidate(candidate);
//                     }}
//                     className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
//                   >
//                     <option value="">Select a candidate</option>
//                     {candidates.map((candidate) => (
//                       <option key={candidate.id} value={candidate.id}>
//                         {candidate.name} ({candidate.email})
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//               <div className="flex justify-end gap-3 mt-6">
//                 <button
//                   onClick={() => setShowScheduleModal(false)}
//                   className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleScheduleInterview}
//                   disabled={!selectedCandidate}
//                   className="px-4 py-2 bg-gradient-to-r from-emerald-400 to-indigo-500 text-white rounded-lg hover:from-emerald-500 hover:to-indigo-600 transition disabled:opacity-50"
//                 >
//                   Schedule
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Add Candidate Modal */}
//         {showAddCandidateModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-xl p-6 w-full max-w-md border border-gray-200 shadow-xl">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Candidate</h2>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//                   <input
//                     type="text"
//                     value={newCandidateName}
//                     onChange={(e) => setNewCandidateName(e.target.value)}
//                     placeholder="Enter candidate name"
//                     className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                   <input
//                     type="email"
//                     value={newCandidateEmail}
//                     onChange={(e) => setNewCandidateEmail(e.target.value)}
//                     placeholder="Enter candidate email"
//                     className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
//                   />
//                 </div>
//               </div>
//               <div className="flex justify-end gap-3 mt-6">
//                 <button
//                   onClick={() => setShowAddCandidateModal(false)}
//                   className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleAddCandidate}
//                   disabled={!newCandidateName || !newCandidateEmail}
//                   className="px-4 py-2 bg-gradient-to-r from-emerald-400 to-indigo-500 text-white rounded-lg hover:from-emerald-500 hover:to-indigo-600 transition disabled:opacity-50"
//                 >
//                   Add Candidate
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CalendarPage;






import React, { useState, useEffect } from "react";
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  Views,
  
} from "react-big-calendar";
import { ArrowLeft, ChevronDown, Plus } from "lucide-react";
import { Popover, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import format from "date-fns/format";
import enUS from "date-fns/locale/en-US";
import axios from "axios";

import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse: (str, formatString) => format(new Date(str), formatString),
  startOfWeek: (date) => {
    let day = date.getDay();
    return new Date(date.setDate(date.getDate() - day));
  },
  getDay: (date) => date.getDay(),
  locales,
});

const CalendarPage = () => {
  const navigate = useNavigate();
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());

  const [interviews, setInterviews] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);

  // Scheduling modal state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [interviewTitle, setInterviewTitle] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");

  const [hoveredDate, setHoveredDate] = useState(null);

  useEffect(() => {
    // Fetch candidates
    const fetchCandidates = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/recruiter/candidates");
        if (res.data.success) setCandidates(res.data.candidates);
      } catch (error) {
        console.error("Error fetching candidates", error);
      }
    };

    // Fetch jobs
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/recruiter/jobs");
        if (res.data.success) setJobs(res.data.jobs);
      } catch (error) {
        console.error("Error fetching jobs", error);
      }
    };

    // Fetch interviews
    const fetchInterviews = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/recruiter/interviews");
        if (res.data.success) {
          const events = res.data.interviews.map((intv) => {
            const d = new Date(intv.interview_date);
            const time = intv.interview_time;
            const [fromH, fromM] = time.from.split(":").map(Number);
            const [toH, toM] = time.to.split(":").map(Number);
            const start = new Date(d);
            start.setHours(fromH, fromM, 0, 0);
            const end = new Date(d);
            end.setHours(toH, toM, 0, 0);
            return {
              id: intv.id,
              title: intv.interview_title,
              start,
              end,
              candidateId: intv.candidate_id,
              jobId: intv.job_id,
              jobTitle: intv.job_title,
              recruiterName: intv.recruiter_name,
              interviewTime: time,
            };
          });
          setInterviews(events);
        }
      } catch (error) {
        console.error("Error fetching interviews", error);
      }
    };

    fetchCandidates();
    fetchJobs();
    fetchInterviews();
  }, []);

  const handleSelectSlot = ({ start }) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const s = new Date(start);
    s.setHours(0,0,0,0);
    if (s < today) {
      alert("Cannot schedule interview on past days");
      return;
    }
    setSelectedSlot({ start });
    setShowScheduleModal(true);
    setSelectedCandidate(null);
    setSelectedJob(null);
    setInterviewTitle("");
    setFromTime("");
    setToTime("");
  };

  const handleScheduleInterview = async () => {
    if (
      !selectedCandidate ||
      !selectedJob ||
      !interviewTitle ||
      !fromTime ||
      !toTime
    ) {
      alert("Please complete all fields.");
      return;
    }
    if (fromTime >= toTime) {
      alert("End time must be after start time.");
      return;
    }

    const payload = {
      recruiter_id: 1,  // Replace with dynamic recruiter ID when authenticated
      candidate_id: selectedCandidate.id,
      job_id: selectedJob.id,
      interview_title: interviewTitle,
      interview_date: format(selectedSlot.start, "yyyy-MM-dd"),
      interview_time: { from: fromTime, to: toTime },
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/recruiter/schedule-interview",
        payload
      );
      if (res.data.success) {
        // Add new interview to state for immediate calendar update
        const start = new Date(payload.interview_date);
        const end = new Date(payload.interview_date);
        const [fromH, fromM] = fromTime.split(":").map(Number);
        const [toH, toM] = toTime.split(":").map(Number);
        start.setHours(fromH, fromM);
        end.setHours(toH, toM);

        setInterviews((prev) => [
          ...prev,
          {
            id: res.data.interviewId,
            title: payload.interview_title,
            start,
            end,
            candidateId: payload.candidate_id,
            jobId: payload.job_id,
            jobTitle: selectedJob.job_title,
            recruiterName: null,
            interviewTime: payload.interview_time,
          },
        ]);

        setShowScheduleModal(false);
      } else {
        alert("Failed to schedule interview.");
      }
    } catch (error) {
      console.error(error);
      alert("Error scheduling interview.");
    }
  };

  const CustomDayWrapper = ({ value, children }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isPast = value < today;

    return (
      <div
        onMouseEnter={() => !isPast && setHoveredDate(value)}
        onMouseLeave={() => setHoveredDate(null)}
        className="relative"
        style={{ minHeight: '100px' }}  // Increase day cell min height for better spacing
      >
        {children}
        {!isPast && hoveredDate && hoveredDate.toDateString() === value.toDateString() && (
          <button
            onClick={() => handleSelectSlot({ start: value })}
            title="Schedule Interview"
            className="absolute top-2 right-2 z-10 bg-pink-500 text-white p-1 rounded-full shadow-md hover:bg-pink-600 transition"
          >
            <Plus size={16} />
          </button>
        )}
      </div>
    );
  };

const EventComponent = ({ event }) => {
  const candidate = candidates.find(c => c.id === event.candidateId);
  
  return (
    <div className="p-3 bg-green-50 rounded-md shadow-sm border border-green-100 text-gray-800">
      {/* Title row */}
      <div className="flex items-start">
        <strong className="text-sm font-medium text-gray-900 flex-grow">
          {event.title}
        </strong>
        {/* <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
          Scheduled
        </span> */}
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {/* Candidate */}
        <div className="flex items-center">
          <span className="text-gray-500 mr-1">Candidate:</span>
          <span className="font-medium">
            {candidate ? candidate.candidate_name : "Unknown"} 
          </span>
          {/* <p className="font-medium">
            {event.jobTitle || "N/A"}
          </p> */}
        </div>
        <br />

        {/* Job */}
        <div className="flex items-center">
          <span className="text-gray-500">Job:</span>
          <span className="font-medium">
            {event.jobTitle || "N/A"}
          </span>
        </div>

        {/* Date
        <div className="col-span-2 flex items-center">
          <span className="text-gray-500 mr-1">Date:</span>
          <span className="font-medium">
            {format(event.start, "eee, MMM d, yyyy")}
          </span>
        </div> */}

        {/* Time
        <div className="col-span-2 flex items-center">
          <span className="text-gray-500 mr-1">Time:</span>
          <span className="font-medium">
            {event.interviewTime.from} - {event.interviewTime.to}
          </span>
        </div> */}

        {/* Recruiter (if available) */}
        {event.recruiterName && (
          <div className="col-span-2 flex items-center">
            <span className="text-gray-500 mr-1">Recruiter:</span>
            <span className="font-medium">
              {event.recruiterName}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
  const eventStyleGetter = () => {
    return {
      style: {
        backgroundColor: "transparent",  // Transparent so event content background shows
        padding: 0,
        margin: 0,
        cursor: "default",
      },
    };
  };

  return (
    <div className="min-h-screen bg-white p-8 font-sans max-w-7xl mx-auto text-gray-900">
      {/* Header */}
      <div className="flex items-center mb-6 gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-md bg-gray-200 p-2 hover:bg-indigo-300"
          aria-label="Go Back"
        >
          <ArrowLeft />
          Back
        </button>
        <h1 className="text-3xl font-bold">Interview Schedule</h1>
      </div>

      {/* Calendar Controls */}
      <div className="flex items-center mb-4">
        <Popover>
          {({ open }) => (
            <>
              <Popover.Button className="flex items-center gap-2 rounded-md bg-gray-100 px-3 py-1">
                <span>{view}</span>
                <ChevronDown
                  className={`transition-transform ${open ? "rotate-180" : "rotate-0"}`}
                />
              </Popover.Button>
              <Transition
                show={open}
                enter="transition duration-150 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-100 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Popover.Panel className="absolute bg-white rounded-md p-2 shadow z-10">
                  <button onClick={() => setView(Views.DAY)} className="block px-4 py-1 hover:bg-indigo-100 rounded">Day</button>
                  <button onClick={() => setView(Views.WEEK)} className="block px-4 py-1 hover:bg-indigo-100 rounded">Week</button>
                  <button onClick={() => setView(Views.MONTH)} className="block px-4 py-1 hover:bg-indigo-100 rounded">Month</button>
                  <button onClick={() => setView(Agenda)} className="block px-4 py-1 hover:bg-indigo-100 rounded">Agenda</button>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>

        <button
          onClick={() => {
            setView(Views.DAY);
            setDate(new Date());
          }}
          className="ml-3 bg-indigo-600 px-4 py-1 rounded-md text-white hover:bg-indigo-700"
        >
          Today
        </button>
      </div>

      {/* Calendar */}
      <BigCalendar
        localizer={localizer}
        events={interviews}
        startAccessor="start"
        endAccessor="end"
        view={view}
        date={date}
        onNavigate={setDate}
        onView={setView}
        selectable
        onSelectSlot={handleSelectSlot}
        eventPropGetter={eventStyleGetter}
        components={{ event: EventComponent, dayWrapper: CustomDayWrapper }}
        style={{ height: 650, borderRadius: "8px", border: "1px solid #ddd" }}
      />

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-opacity-30 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg text-gray-900">
            <h2 className="text-xl font-semibold mb-4">Schedule Interview</h2>
            <label className="block mb-1">Interview Title</label>
            <input
              type="text"
              value={interviewTitle}
              onChange={(e) => setInterviewTitle(e.target.value)}
              placeholder="Interview title"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-1">Date</label>
            <input
              type="text"
              value={format(selectedSlot.start, "PPP")}
              disabled
              className="w-full p-2 border border-gray-200 rounded bg-gray-100 cursor-not-allowed mb-4"
            />
            <div className="flex mb-4 space-x-4">
              <div className="flex-1">
                <label>From Time</label>
                <input
                  type="time"
                  value={fromTime}
                  onChange={(e) => setFromTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex-1">
                <label>To Time</label>
                <input
                  type="time"
                  value={toTime}
                  onChange={(e) => setToTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
            <label className="block mb-1">Job</label>
            <select
              value={selectedJob ? selectedJob.id : ""}
              onChange={(e) =>
                setSelectedJob(jobs.find((j) => j.id === Number(e.target.value)))
              }
              className="w-full p-2 border border-gray-300 rounded mb-4"
            >
              <option value="">Select Job</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.job_title}
                </option>
              ))}
            </select>
            <label className="block mb-1">Candidate</label>
            <select
              value={selectedCandidate ? selectedCandidate.id : ""}
              onChange={(e) =>
                setSelectedCandidate(
                  candidates.find((c) => c.id === Number(e.target.value))
                )
              }
              className="w-full p-2 border border-gray-300 rounded mb-6"
            >
              <option value="">Select Candidate</option>
              {candidates.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.candidate_name}
                </option>
              ))}
            </select>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleInterview}
                disabled={
                  !selectedCandidate ||
                  !selectedJob ||
                  !interviewTitle ||
                  !fromTime ||
                  !toTime
                }
                className="px-5 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
