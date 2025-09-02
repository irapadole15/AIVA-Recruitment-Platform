const express = require("express");
const router = express.Router();
const {
  postJob,
  getRecruiterDetails,
  getJobDepartments,
  getJobs,
  getJobById,
  countJobs,
  candidateCounts,
  getAllCandidates,
  getJobApplicants,
  getInterviews,
  scheduleInterview,
getCandidatePipelineDetails,
  getRecruitmentStages,
  updateCandidatePipelineStage,
  getTodayInterviewCount,
  getHiredCount,
  getCandidatePipelineStats,
  getRecruiterKPIStats,
  getAnalyticsData,
  addDepartment
} = require("../controllers/recruiterController");

router.post("/post-job", postJob);
router.get("/job-departments", getJobDepartments);

router.get("/recruiter-details/:id", getRecruiterDetails);
router.get("/jobs", getJobs);
router.get("/jobs/:jobId", getJobById);
router.get("/jobs-count", countJobs);
router.get("/candidate-counts", candidateCounts);
router.get("/candidates", getAllCandidates);
router.get("/job-applicants/:jobId", getJobApplicants);
router.get("/candidates", getAllCandidates);
router.get("/interviews", getInterviews);
router.post("/schedule-interview", scheduleInterview);


router.get("/candidate-pipeline", getCandidatePipelineDetails);
router.get("/recruitment-stages", getRecruitmentStages);
router.put("/candidate-pipeline", updateCandidatePipelineStage);
router.get('/:recruiterId/interviews-today-count', getTodayInterviewCount);
router.get('/:recruiterId/hired-count', getHiredCount);
router.get('/:recruiterId/pipeline-stats', getCandidatePipelineStats);
router.get('/:recruiterId/kpi-stats', getRecruiterKPIStats);
router.get('/:recruiterId/analytics', getAnalyticsData);
router.post("/add-department", addDepartment);

module.exports = router;
