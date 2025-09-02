// import React, { useEffect, useRef, useState } from "react";
// import { X } from "lucide-react";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// const RecruiterPostNewJob = ({ open, onClose }) => {
//   const formRef = useRef(null);
//   const { id } = useParams(); // encoded recruiter id in url

//   const [departments, setDepartments] = useState([]);
//   const [formData, setFormData] = useState({
//     job_title: "",
//     dept_id: "", // reset to empty, set after fetch
//     job_description: "",
//     job_location: "",
//     salary_range: "",
//   });
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // Trap focus and manage body overflow
//   useEffect(() => {
//     if (open && formRef.current) {
//       formRef.current.focus();
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [open]);

//   // Fetch departments on mount
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/recruiter/job-departments");
//         setDepartments(response.data.departments || []);
//         // Set default dept_id to first department if available
//         if (response.data.departments.length > 0) {
//           setFormData((prev) => ({
//             ...prev,
//             dept_id: response.data.departments[0].dept_id.toString(), // string for select value control
//           }));
//         }
//       } catch (error) {
//         console.log(error);
        
//         setError("Failed to load departments");
//       }
//     };
//     fetchDepartments();
//   }, []);

//   // Handle form input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Form submit handler
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     try {
//       // Decode recruiter id from URL param (base64)
//       const decodedRecruiterId = atob(id);

//       // post data with dept_id as number and created_by as header
//       const response = await axios.post(
//         "http://localhost:5000/api/recruiter/post-job",
//         {
//           job_title: formData.job_title,
//           dept_id: Number(formData.dept_id), // numeric dept_id
//           job_description: formData.job_description,
//           job_location: formData.job_location,
//           salary_range: formData.salary_range,
//         },
//         {
//           headers: {
//             "X-Recruiter-ID": decodedRecruiterId,
//           },
//         }
//       );

//       setSuccess(response.data.message);
//       setFormData({
//         job_title: "",
//         dept_id: departments.length > 0 ? departments[0].dept_id.toString() : "",
//         job_description: "",
//         job_location: "",
//         salary_range: "",
//       });

//       setTimeout(() => {
//         onClose();
//       }, 1500);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to post job");
//       setSuccess("");
//     }
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed z-50 inset-0 flex items-center justify-center">
//       {/* BG Blur Overlay */}
//       <div
//         className="absolute inset-0 bg-black/60 backdrop-blur-[4px] transition-opacity duration-300"
//         onClick={onClose}
//         aria-label="Close Modal"
//       />
//       {/* Sliding Modal */}
//       <div
//         className="relative z-10 w-[92vw] max-w-lg bg-[#16161c] rounded-2xl shadow-2xl p-6 sm:p-8 animate-slide-in-modal"
//         tabIndex={-1}
//         ref={formRef}
//       >
//         {/* Close Button */}
//         <button
//           className="absolute top-4 right-4 text-[#B9BAC3] hover:text-pink-400 transition"
//           onClick={onClose}
//           aria-label="Close"
//           type="button"
//         >
//           <X size={24} />
//         </button>

//         {/* Modal Form Content */}
//         <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-white mb-2">
//           <span className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg p-2">
//             <svg
//               viewBox="0 0 24 24"
//               className="w-5 h-5 text-white"
//               fill="none"
//               stroke="currentColor"
//             >
//               <rect x="6" y="7" width="12" height="10" rx="2" strokeWidth="1.5" />
//               <path d="M9 7V5a3 3 0 0 1 6 0v2" strokeWidth="1.5" />
//             </svg>
//           </span>
//           Post New Job
//         </h2>

//         <form className="space-y-5 mt-3" onSubmit={handleSubmit}>
//           {/* Job Title */}
//           <div>
//             <label className="block text-sm text-[#B9BAC3] mb-1 font-medium">Job Title</label>
//             <input
//               type="text"
//               name="job_title"
//               value={formData.job_title}
//               onChange={handleChange}
//               placeholder="e.g., Senior Frontend Developer"
//               className="w-full bg-[#232129] border border-[#353241] rounded-lg px-3 py-2 text-white placeholder-[#B9BAC3] focus:ring-2 focus:ring-pink-500 outline-none text-sm sm:text-base"
//               required
//             />
//           </div>

//           {/* Department */}
//           <div>
//             <label className="block text-sm text-[#B9BAC3] mb-1 font-medium">Department</label>
//             <select
//               name="dept_id"
//               value={formData.dept_id}
//               onChange={handleChange}
//               className="w-full bg-[#232129] border border-[#353241] rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-pink-500 outline-none text-sm sm:text-base"
//               required
//             >
//               {departments.map((dept) => (
//                 <option key={dept.dept_id} value={dept.dept_id.toString()}>
//                   {dept.dept_name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Job Description */}
//           <div>
//             <label className="block text-sm text-[#B9BAC3] mb-1 font-medium">Job Description</label>
//             <textarea
//               name="job_description"
//               value={formData.job_description}
//               onChange={handleChange}
//               rows={3}
//               placeholder="Describe the role and responsibilities..."
//               className="w-full bg-[#232129] border border-[#353241] rounded-lg px-3 py-2 text-white placeholder-[#B9BAC3] resize-none focus:ring-2 focus:ring-pink-500 outline-none text-sm sm:text-base"
//             />
//           </div>

//           <div className="flex flex-col sm:flex-row gap-3">
//             {/* Location */}
//             <div className="flex-1">
//               <label className="block text-sm text-[#B9BAC3] mb-1 font-medium">Location</label>
//               <input
//                 type="text"
//                 name="job_location"
//                 value={formData.job_location}
//                 onChange={handleChange}
//                 placeholder="e.g., Remote / San Francisco"
//                 className="w-full bg-[#232129] border border-[#353241] rounded-lg px-3 py-2 text-white placeholder-[#B9BAC3] focus:ring-2 focus:ring-pink-500 outline-none text-sm sm:text-base"
//               />
//             </div>

//             {/* Salary */}
//             <div className="flex-1">
//               <label className="block text-sm text-[#B9BAC3] mb-1 font-medium">Salary Range</label>
//               <input
//                 type="text"
//                 name="salary_range"
//                 value={formData.salary_range}
//                 onChange={handleChange}
//                 placeholder="e.g., $120K - $160K"
//                 className="w-full bg-[#232129] border border-[#353241] rounded-lg px-3 py-2 text-white placeholder-[#B9BAC3] focus:ring-2 focus:ring-pink-500 outline-none text-sm sm:text-base"
//               />
//             </div>
//           </div>

//           {/* Error/Success Messages */}
//           {error && <p className="text-red-400 text-sm">{error}</p>}
//           {success && <p className="text-green-400 text-sm">{success}</p>}

//           {/* Buttons */}
//           <div className="flex justify-end gap-2 pt-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="rounded-lg px-4 py-2 bg-[#232129] text-[#B9BAC3] hover:text-white border border-[#353241] transition font-semibold text-sm sm:text-base"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="rounded-lg px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold shadow-md hover:from-pink-400 hover:to-purple-400 transition text-sm sm:text-base"
//             >
//               Post Job
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Slide-in animation keyframes */}
//       <style>{`
//         .animate-slide-in-modal {
//           animation: slideInModal .4s cubic-bezier(.25,.75,.4,1.04);
//         }
//         @keyframes slideInModal {
//           from {
//             transform: translateX(60vw);
//             opacity: 0;
//           }
//           to {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default RecruiterPostNewJob;












import React, { useEffect, useRef, useState } from "react";
import { X, Plus, Save } from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";

const RecruiterPostNewJob = ({ open, onClose }) => {
  const formRef = useRef(null);
  const { id } = useParams(); // encoded recruiter id in url
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    job_title: "",
    dept_id: "",
    job_description: "",
    job_location: "",
    salary_range: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDeptPopupOpen, setIsDeptPopupOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");
  const [deptError, setDeptError] = useState("");

  // Trap focus and manage body overflow
  useEffect(() => {
    if (open && formRef.current) {
      formRef.current.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Fetch departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/recruiter/job-departments");
        setDepartments(response.data.departments || []);
        if (response.data.departments.length > 0) {
          setFormData((prev) => ({
            ...prev,
            dept_id: response.data.departments[0].dept_id.toString(),
          }));
        }
      } catch (error) {
        console.log(error);
        setError("Failed to load departments");
      }
    };
    fetchDepartments();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle new department input change
  const handleNewDeptChange = (e) => {
    setNewDeptName(e.target.value);
    setDeptError("");
  };

  // Handle add new department
  const handleAddDepartment = async () => {
    if (!newDeptName.trim()) {
      setDeptError("Department name is required");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/api/recruiter/add-department", {
        dept_name: newDeptName.trim(),
      });
      const newDept = { dept_id: response.data.dept_id, dept_name: response.data.dept_name };
      setDepartments((prev) => [...prev, newDept].sort((a, b) => a.dept_name.localeCompare(b.dept_name)));
      setFormData((prev) => ({ ...prev, dept_id: newDept.dept_id.toString() }));
      setNewDeptName("");
      setIsDeptPopupOpen(false);
      setSuccess("Department added successfully");
      setTimeout(() => setSuccess(""), 1500);
    } catch (error) {
      setDeptError(error.response?.data?.message || "Failed to add department");
    }
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const decodedRecruiterId = atob(id);
      const response = await axios.post(
        "http://localhost:5000/api/recruiter/post-job",
        {
          job_title: formData.job_title,
          dept_id: Number(formData.dept_id),
          job_description: formData.job_description,
          job_location: formData.job_location,
          salary_range: formData.salary_range,
        },
        {
          headers: {
            "X-Recruiter-ID": decodedRecruiterId,
          },
        }
      );
      setSuccess(response.data.message);
      setFormData({
        job_title: "",
        dept_id: departments.length > 0 ? departments[0].dept_id.toString() : "",
        job_description: "",
        job_location: "",
        salary_range: "",
      });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post job");
      setSuccess("");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center">
      {/* BG Blur Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[4px] transition-opacity duration-300"
        onClick={onClose}
        aria-label="Close Modal"
      />
      {/* Sliding Modal */}
      <div
        className="relative z-10 w-[92vw] max-w-lg bg-[#16161c] rounded-2xl shadow-2xl p-6 sm:p-8 animate-slide-in-modal"
        tabIndex={-1}
        ref={formRef}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-[#B9BAC3] hover:text-pink-400 transition"
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          <X size={24} />
        </button>

        {/* Modal Form Content */}
        <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-white mb-2">
          <span className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg p-2">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
            >
              <rect x="6" y="7" width="12" height="10" rx="2" strokeWidth="1.5" />
              <path d="M9 7V5a3 3 0 0 1 6 0v2" strokeWidth="1.5" />
            </svg>
          </span>
          Post New Job
        </h2>

        <form className="space-y-5 mt-3" onSubmit={handleSubmit}>
          {/* Job Title */}
          <div>
            <label className="block text-sm text-[#B9BAC3] mb-1 font-medium">Job Title</label>
            <input
              type="text"
              name="job_title"
              value={formData.job_title}
              onChange={handleChange}
              placeholder="e.g., Senior Frontend Developer"
              className="w-full bg-[#232129] border border-[#353241] rounded-lg px-3 py-2 text-white placeholder-[#B9BAC3] focus:ring-2 focus:ring-pink-500 outline-none text-sm sm:text-base"
              required
            />
          </div>

          {/* Department */}
          <div className="relative">
            <label className="block text-sm text-[#B9BAC3] mb-1 font-medium">Department</label>
            <div className="flex items-center gap-2">
              <select
                name="dept_id"
                value={formData.dept_id}
                onChange={handleChange}
                className="w-full bg-[#232129] border border-[#353241] rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-pink-500 outline-none text-sm sm:text-base"
                required
              >
                {departments.map((dept) => (
                  <option key={dept.dept_id} value={dept.dept_id.toString()}>
                    {dept.dept_name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setIsDeptPopupOpen(true)}
                className="p-2 text-[#B9BAC3] hover:text-pink-400 transition"
                aria-label="Add new department"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* New Department Popup */}
          {isDeptPopupOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-[4px]"
                onClick={() => setIsDeptPopupOpen(false)}
              />
              <div className="relative bg-[#16161c] rounded-2xl p-6 w-[90vw] max-w-md">
                <h3 className="text-lg font-bold text-white mb-4">Add New Department</h3>
                <input
                  type="text"
                  value={newDeptName}
                  onChange={handleNewDeptChange}
                  placeholder="Enter department name"
                  className="w-full bg-[#232129] border border-[#353241] rounded-lg px-3 py-2 text-white placeholder-[#B9BAC3] focus:ring-2 focus:ring-pink-500 outline-none text-sm sm:text-base"
                />
                {deptError && <p className="text-red-400 text-sm mt-2">{deptError}</p>}
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsDeptPopupOpen(false)}
                    className="p-2 text-[#B9BAC3] hover:text-pink-400 transition"
                    aria-label="Cancel"
                  >
                    <X size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={handleAddDepartment}
                    className="p-2 text-[#B9BAC3] hover:text-green-400 transition"
                    aria-label="Save"
                  >
                    <Save size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Job Description */}
          <div>
            <label className="block text-sm text-[#B9BAC3] mb-1 font-medium">Job Description</label>
            <textarea
              name="job_description"
              value={formData.job_description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe the role and responsibilities..."
              className="w-full bg-[#232129] border border-[#353241] rounded-lg px-3 py-2 text-white placeholder-[#B9BAC3] resize-none focus:ring-2 focus:ring-pink-500 outline-none text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Location */}
            <div className="flex-1">
              <label className="block text-sm text-[#B9BAC3] mb-1 font-medium">Location</label>
              <input
                type="text"
                name="job_location"
                value={formData.job_location}
                onChange={handleChange}
                placeholder="e.g., Remote / San Francisco"
                className="w-full bg-[#232129] border border-[#353241] rounded-lg px-3 py-2 text-white placeholder-[#B9BAC3] focus:ring-2 focus:ring-pink-500 outline-none text-sm sm:text-base"
              />
            </div>

            {/* Salary */}
            <div className="flex-1">
              <label className="block text-sm text-[#B9BAC3] mb-1 font-medium">Salary Range</label>
              <input
                type="text"
                name="salary_range"
                value={formData.salary_range}
                onChange={handleChange}
                placeholder="e.g., $120K - $160K"
                className="w-full bg-[#232129] border border-[#353241] rounded-lg px-3 py-2 text-white placeholder-[#B9BAC3] focus:ring-2 focus:ring-pink-500 outline-none text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">{success}</p>}

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 bg-[#232129] text-[#B9BAC3] hover:text-white border border-[#353241] transition font-semibold text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold shadow-md hover:from-pink-400 hover:to-purple-400 transition text-sm sm:text-base"
            >
              Post Job
            </button>
          </div>
        </form>
      </div>

      {/* Slide-in animation keyframes */}
      <style>{`
        .animate-slide-in-modal {
          animation: slideInModal .4s cubic-bezier(.25,.75,.4,1.04);
        }
        @keyframes slideInModal {
          from {
            transform: translateX(60vw);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default RecruiterPostNewJob;