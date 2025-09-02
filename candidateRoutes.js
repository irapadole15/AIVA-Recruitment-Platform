// routes/candidateRoutes.js

const express = require('express');
const router = express.Router();
const {
  getCandidateDetailsById,
  getJobs,
  applyJob,
  getAppliedJobIds,
  getAppliedJobs,
  interviewScheduleForCandidates,
  getTodayInterviewsCount,
  getUpcomingInterviewsCount,
  countJobs,
  appliedJobCountByCandidateId
} = require('../controllers/candidateController');

// /api/candidate/candidate-details/:id
router.get('/candidate-details/:id', getCandidateDetailsById);

// /api/candidate/jobs
router.get('/jobs', getJobs);
router.post('/apply-job', applyJob);
router.get('/applied-job-ids/:candidateId', getAppliedJobIds);
router.get('/applied-jobs/:candidateId', getAppliedJobs);
router.get('/:candidateId/interview-schedule', interviewScheduleForCandidates);


router.get('/:candidateId/interviews/today/count', getTodayInterviewsCount);
router.get('/:candidateId/interviews/upcoming/count', getUpcomingInterviewsCount);
router.get('/jobs-count', countJobs);

router.get('/:candidateId/applied-job-count', appliedJobCountByCandidateId);


module.exports = router;
