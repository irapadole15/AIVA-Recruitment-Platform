const db = require("../config/db");

exports.postJob = async (req, res) => {
  const { job_title, dept_id, job_description, job_location, salary_range } =
    req.body;
  const created_by = req.headers["x-recruiter-id"]; // recruiter ID passed in header, expected to be decoded already

  try {
    if (!job_title || !dept_id) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Job title and department are required",
        });
    }

    // Verify dept_id exists
    const [deptExists] = await db.query(
      "SELECT dept_id FROM job_department WHERE dept_id = ?",
      [dept_id]
    );
    if (deptExists.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid department ID" });
    }

    // Verify recruiter exists
    const [recruiterExists] = await db.query(
      "SELECT id FROM recruiters WHERE id = ?",
      [created_by]
    );
    if (recruiterExists.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid recruiter ID" });
    }

    // Insert job
    await db.query(
      `INSERT INTO jobs (job_title, dept_id, job_description, job_location, salary_range, created_by) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        job_title,
        dept_id,
        job_description || null,
        job_location || null,
        salary_range || null,
        created_by,
      ]
    );

    res.json({ success: true, message: "Job posted successfully" });
  } catch (error) {
    console.error("Error posting job:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getRecruiterDetails = async (req, res) => {
  const recruiterId = req.params.id; // get recruiter id from URL

  try {
    const [recruiters] = await db.query(
      `SELECT recruiter_name, recruiter_email, recruiter_designation 
       FROM recruiters WHERE id = ?`,
      [recruiterId]
    );

    if (recruiters.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Recruiter not found" });
    }

    res.json({ success: true, recruiter: recruiters[0] });
  } catch (error) {
    console.error("Error fetching recruiter details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getJobDepartments = async (req, res) => {
  try {
    const [departments] = await db.query(
      `SELECT dept_id, dept_name FROM job_department ORDER BY dept_name ASC`
    );
    res.json({ success: true, departments });
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const [jobs] = await db.query(
      `SELECT 
         j.id,
         j.job_title,
         j.job_description,
         j.job_location,
         j.salary_range,
         j.created_at,
         j.created_by,
         jd.dept_id,
         jd.dept_name,
         r.recruiter_name AS created_by_name
       FROM jobs j
       LEFT JOIN job_department jd ON j.dept_id = jd.dept_id
       LEFT JOIN recruiters r ON j.created_by = r.id
       ORDER BY j.created_at DESC`
    );

    res.json({ success: true, jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getJobById = async (req, res) => {
  const { jobId } = req.params;
  // Optional: you can pass recruiter ID in header to validate ownership, adjust as needed
  const recruiterId = req.headers["x-recruiter-id"]; // If you want to restrict access

  try {
    // Query job details with department and recruiter info
    const [jobs] = await db.query(
      `SELECT 
         j.id,
         j.job_title,
         j.job_description,
         j.job_location,
         j.salary_range,
         j.created_at,
         j.created_by,
         jd.dept_id,
         jd.dept_name,
         r.recruiter_name AS created_by_name
       FROM jobs j
       LEFT JOIN job_department jd ON j.dept_id = jd.dept_id
       LEFT JOIN recruiters r ON j.created_by = r.id
       WHERE j.id = ?
       ${recruiterId ? "AND j.created_by = ?" : ""}`,
      recruiterId ? [jobId, recruiterId] : [jobId]
    );

    if (jobs.length === 0) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.json({ success: true, job: jobs[0] });
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.countJobs = async (req, res) => {
  try {
    const [result] = await db.query(`SELECT COUNT(*) as total FROM jobs`);
    const totalJobs = result[0]?.total || 0;
    res.json({ success: true, totalJobs });
  } catch (error) {
    console.error("Error counting jobs:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.candidateCounts = async (req, res) => {
  try {
    const [result] = await db.query(
      "SELECT COUNT(*) AS total_candidates FROM candidates"
    );
    const total = result[0]?.total_candidates || 0;
    res.json({ success: true, totalCandidates: total });
  } catch (error) {
    console.error("Error fetching candidate count:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getJobApplicants = async (req, res) => {
  const jobId = req.params.jobId;

  try {
    const [rows] = await db.query(
      `SELECT 
          c.id,
          c.candidate_name,
          c.candidate_email,
          aj.created_at as applied_at
        FROM apply_jobs aj
        JOIN candidates c ON aj.candidate_id = c.id
        WHERE aj.job_id = ?
        ORDER BY aj.created_at DESC`,
      [jobId]
    );

    res.json({ success: true, candidates: rows });
  } catch (error) {
    console.error("Error fetching job applicants:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Fetch all candidates
exports.getAllCandidates = async (req, res) => {
  try {
    const [candidates] = await db.query(
      "SELECT id, candidate_name, candidate_email,candidate_resume , created_at FROM candidates ORDER BY candidate_name ASC"
    );
    res.json({ success: true, candidates });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.scheduleInterview = async (req, res) => {
  const {
    recruiter_id,
    candidate_id,
    job_id,
    interview_title,
    interview_date,
    interview_time,
  } = req.body;

  // Validation
  if (
    !recruiter_id ||
    !candidate_id ||
    !job_id ||
    !interview_title ||
    !interview_date ||
    !interview_time
  ) {
    return res.status(400).json({
      success: false,
      message:
        "All fields are required: recruiter_id, candidate_id, job_id, interview_title, interview_date, interview_time",
    });
  }

  if (!interview_time.from || !interview_time.to) {
    return res.status(400).json({
      success: false,
      message: "interview_time must contain both 'from' and 'to' properties",
    });
  }

  // Validate date format YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(interview_date)) {
    return res.status(400).json({
      success: false,
      message: "Invalid date format. Use YYYY-MM-DD",
    });
  }

  // Validate time format HH:mm (24-hour)
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (
    !timeRegex.test(interview_time.from) ||
    !timeRegex.test(interview_time.to)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid time format. Use HH:mm in 24-hour format",
    });
  }

  // Check that 'from' time precedes 'to' time
  const [fromHour, fromMinute] = interview_time.from.split(":").map(Number);
  const [toHour, toMinute] = interview_time.to.split(":").map(Number);
  if (fromHour > toHour || (fromHour === toHour && fromMinute >= toMinute)) {
    return res.status(400).json({
      success: false,
      message: "'to' time must be later than 'from' time",
    });
  }

  try {
    // Verify recruiter exists
    const [recruiterRows] = await db.query(
      "SELECT id FROM recruiters WHERE id = ?",
      [recruiter_id]
    );
    if (recruiterRows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid recruiter_id",
      });
    }

    // Verify candidate exists
    const [candidateRows] = await db.query(
      "SELECT id FROM candidates WHERE id = ?",
      [candidate_id]
    );
    if (candidateRows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid candidate_id",
      });
    }

    // Verify job exists
    const [jobRows] = await db.query("SELECT id FROM jobs WHERE id = ?", [
      job_id,
    ]);
    if (jobRows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid job_id",
      });
    }

    // Store interview_time as JSON string
    const interviewTimeStr = JSON.stringify(interview_time);

    // Insert interview record
    const [result] = await db.query(
      `INSERT INTO interview_schedule
      (recruiter_id, candidate_id, job_id, interview_title, interview_date, interview_time)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        recruiter_id,
        candidate_id,
        job_id,
        interview_title,
        interview_date,
        interviewTimeStr,
      ]
    );

    return res.json({
      success: true,
      message: "Interview scheduled successfully",
      interviewId: result.insertId,
    });
  } catch (error) {
    console.error("scheduleInterview error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getInterviews = async (req, res) => {
  try {
    const [interviews] = await db.query(
      `SELECT 
        i.id, i.interview_title, i.interview_date, i.interview_time, 
        i.recruiter_id, i.candidate_id, i.job_id, 
        r.recruiter_name, 
        j.job_title
      FROM interview_schedule i
      JOIN recruiters r ON i.recruiter_id = r.id
      JOIN jobs j ON i.job_id = j.id
      ORDER BY i.interview_date ASC, JSON_UNQUOTE(i.interview_time->"$.from") ASC`
    );
    res.json({ success: true, interviews });
  } catch (error) {
    console.error("Error fetching interviews:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getCandidatePipelineDetails = async (req, res) => {
  const recruiterId = req.headers["x-recruiter-id"];

  if (!recruiterId) {
    return res
      .status(400)
      .json({ success: false, message: "Recruiter ID is missing in headers" });
  }
  const parsedRecruiterId = parseInt(recruiterId, 10);
  if (isNaN(parsedRecruiterId) || parsedRecruiterId <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid recruiter ID" });
  }

  try {
    const [recruiterExists] = await db.query(
      "SELECT id FROM recruiters WHERE id = ?",
      [parsedRecruiterId]
    );
    if (recruiterExists.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid recruiter ID" });
    }

    const [data] = await db.query(
      `
      SELECT
        c.id AS candidate_id,
        c.candidate_name,
        c.candidate_email,
        c.candidate_resume,
        j.id AS job_id,
        j.job_title,
        j.job_description,
        j.job_location,
        j.salary_range,
        cp.id AS pipeline_id,
        cp.recruitment_stage_id,
        rs.stage
      FROM apply_jobs aj
      JOIN candidates c ON aj.candidate_id = c.id
      JOIN jobs j ON aj.job_id = j.id
      LEFT JOIN candidate_pipeline cp ON cp.candidate_id = c.id AND cp.job_id = j.id AND cp.recruiter_id = ?
      LEFT JOIN recruitment_stage rs ON rs.id = cp.recruitment_stage_id
      ORDER BY c.candidate_name, j.job_title
    `,
      [parsedRecruiterId]
    );

    const pipelineMap = new Map();
    data.forEach((row) => {
      if (!pipelineMap.has(row.candidate_id)) {
        pipelineMap.set(row.candidate_id, {
          candidate_id: row.candidate_id,
          candidate_name: row.candidate_name,
          candidate_email: row.candidate_email,
          candidate_resume: row.candidate_resume,
          jobs: [],
        });
      }
      pipelineMap.get(row.candidate_id).jobs.push({
        job_id: row.job_id,
        job_title: row.job_title,
        job_description: row.job_description,
        job_location: row.job_location,
        salary_range: row.salary_range,
        pipeline_id: row.pipeline_id,
        recruitment_stage_id: row.recruitment_stage_id,
        stage: row.stage || null,
      });
    });

    res.json({ success: true, pipeline: Array.from(pipelineMap.values()) });
  } catch (err) {
    console.error("Error fetching candidate pipeline:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getRecruitmentStages = async (req, res) => {
  try {
    const [stages] = await db.query(
      "SELECT id, stage FROM recruitment_stage ORDER BY id"
    );
    res.json({ success: true, stages });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch recruitment stages" });
  }
};
exports.updateCandidatePipelineStage = async (req, res) => {
  const { recruiter_id, candidate_id, job_id, recruitment_stage_id } = req.body;

  // Validate inputs
  if (!recruiter_id || !candidate_id || !job_id || !recruitment_stage_id) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }
  const parsedRecruiterId = parseInt(recruiter_id, 10);
  if (isNaN(parsedRecruiterId) || parsedRecruiterId <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid recruiter ID" });
  }

  try {
    // Verify recruiter exists
    const [recruiterExists] = await db.query(
      "SELECT id FROM recruiters WHERE id = ?",
      [parsedRecruiterId]
    );
    if (recruiterExists.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid recruiter ID" });
    }

    const [existing] = await db.query(
      `SELECT id FROM candidate_pipeline WHERE candidate_id = ? AND job_id = ? AND recruiter_id = ?`,
      [candidate_id, job_id, parsedRecruiterId]
    );
    if (existing.length > 0) {
      await db.query(
        `UPDATE candidate_pipeline SET recruitment_stage_id = ? WHERE id = ?`,
        [recruitment_stage_id, existing[0].id]
      );
    } else {
      await db.query(
        `INSERT INTO candidate_pipeline (candidate_id, job_id, recruiter_id, recruitment_stage_id) VALUES (?, ?, ?, ?)`,
        [candidate_id, job_id, parsedRecruiterId, recruitment_stage_id]
      );
    }
    res.json({ success: true, message: "Pipeline updated successfully" });
  } catch (err) {
    console.error("Error updating pipeline:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to update pipeline" });
  }
};




exports.getTodayInterviewCount = async (req, res) => {
  const recruiterId = req.params.recruiterId;

  // Get today's date in YYYY-MM-DD format (server local time)
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  try {
    const [rows] = await db.query(
      `SELECT COUNT(*) AS count FROM interview_schedule
       WHERE recruiter_id = ? AND interview_date = ?`,
      [recruiterId, todayStr]
    );
    res.json({ success: true, count: rows[0]?.count || 0 });
  } catch (err) {
    console.error('Error counting today interviews:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.getHiredCount = async (req, res) => {
  const recruiterId = req.params.recruiterId;

  try {
    const [rows] = await db.query(
      `SELECT COUNT(*) AS count 
       FROM candidate_pipeline 
       WHERE recruiter_id = ? AND recruitment_stage_id = 5`,
      [recruiterId]
    );

    res.json({ success: true, count: rows[0].count || 0 });
  } catch (error) {
    console.error('Error fetching hired count:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



// recruiterController.js

exports.getCandidatePipelineStats = async (req, res) => {
  const recruiterId = req.params.recruiterId;

  try {
    // Fetch counts grouped by job and recruitment stage
    const [rows] = await db.query(
      `SELECT
          cp.job_id,
          j.job_title,
          cp.recruitment_stage_id,
          rs.stage,
          COUNT(DISTINCT cp.candidate_id) AS candidate_count
      FROM candidate_pipeline cp
      INNER JOIN jobs j ON cp.job_id = j.id
      INNER JOIN recruitment_stage rs ON cp.recruitment_stage_id = rs.id
      WHERE cp.recruiter_id = ?
      GROUP BY cp.job_id, cp.recruitment_stage_id`,
      [recruiterId]
    );

    // Fetch all jobs for dropdown/filter
    const [jobs] = await db.query(
      `SELECT DISTINCT j.id, j.job_title FROM jobs j
        INNER JOIN candidate_pipeline cp ON cp.job_id = j.id
        WHERE cp.recruiter_id = ?`,
      [recruiterId]
    );

    res.json({
      success: true,
      data: rows,
      jobs
    });
  } catch (error) {
    console.error('Error fetching candidate pipeline stats:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};




// recruiterController.js

exports.getRecruiterKPIStats = async (req, res) => {
  const recruiterId = req.params.recruiterId;
  if (!recruiterId) {
    return res.status(400).json({ success: false, message: 'Missing recruiterId' });
  }

  try {
    // 1. Time to Hire: Average days between interview_date and today for hired candidates (stage=5)
    const [[{ avg_time_to_hire = null }]] = await db.query(
      `SELECT AVG(DATEDIFF(CURDATE(), interview_date)) as avg_time_to_hire
       FROM interview_schedule i
       JOIN candidate_pipeline cp ON cp.candidate_id = i.candidate_id AND cp.job_id = i.job_id
       WHERE cp.recruiter_id = ? AND cp.recruitment_stage_id = 5`,
      [recruiterId]
    );

    // 2. Interview Rate: % of candidates who have interviews from candidates who applied (by the recruiter)
    const [[{ total_applications = 0 }]] = await db.query(
      `SELECT COUNT(DISTINCT candidate_id) AS total_applications
       FROM apply_jobs aj
       JOIN jobs j ON j.id = aj.job_id 
       WHERE j.created_by = ?`, // assuming created_by is recruiter_id
      [recruiterId]
    );

    const [[{ total_interviews = 0 }]] = await db.query(
      `SELECT COUNT(DISTINCT candidate_id) AS total_interviews
       FROM interview_schedule
       WHERE recruiter_id = ?`,
      [recruiterId]
    );

    const interviewRate =
      total_applications > 0 ? (total_interviews / total_applications) * 100 : 0;

    // 3. Success Rate: % of hired candidates (candidate_pipeline stage 5) among offers (stage 4)
    const [[{ total_offers = 0 }]] = await db.query(
      `SELECT COUNT(*) AS total_offers FROM candidate_pipeline WHERE recruiter_id = ? AND recruitment_stage_id = 4`,
      [recruiterId]
    );

    const [[{ total_hires = 0 }]] = await db.query(
      `SELECT COUNT(*) AS total_hires FROM candidate_pipeline WHERE recruiter_id = ? AND recruitment_stage_id = 5`,
      [recruiterId]
    );

    const successRate = total_offers > 0 ? (total_hires / total_offers) * 100 : 0;

    res.json({
      success: true,
      stats: {
        timeToHire: avg_time_to_hire ? Number(avg_time_to_hire.toFixed(1)) : 'N/A',
        interviewRate: Number(interviewRate.toFixed(1)),
        successRate: Number(successRate.toFixed(1)),
      },
    });
  } catch (error) {
    console.error('Error fetching KPI stats:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



// controllers/RecruiterAnalytics.js

exports.getAnalyticsData = async (req, res) => {
  const recruiterId = req.params.recruiterId;
  const { startDate, endDate, departmentId } = req.query;

  const filters = [];
  const params = [recruiterId];

  if (startDate) {
    filters.push('j.created_at >= ?');
    params.push(startDate);
  }
  if (endDate) {
    filters.push('j.created_at <= ?');
    params.push(endDate);
  }
  if (departmentId && departmentId !== 'all') {
    filters.push('j.dept_id = ?');
    params.push(departmentId);
  }

  const whereClause = filters.length ? 'AND ' + filters.join(' AND ') : '';

  try {
    // 1) Jobs posted per month
    const [jobsPerMonth] = await db.query(
      `SELECT DATE_FORMAT(j.created_at, '%b') AS month, COUNT(*) AS count
       FROM jobs j 
       WHERE j.created_by = ? ${whereClause}
       GROUP BY month
       ORDER BY MIN(j.created_at)`,
      params
    );

    // 2) Candidates per department
    const [candidatesPerDept] = await db.query(
      `SELECT d.dept_name AS department, COUNT(DISTINCT aj.candidate_id) AS count
       FROM apply_jobs aj
       JOIN jobs j ON aj.job_id = j.id
       JOIN job_department d ON j.dept_id = d.dept_id
       WHERE j.created_by = ? ${whereClause}
       GROUP BY d.dept_name`,
      params
    );

    // 3) Applications status distribution using recruitment_stage_id from candidate_pipeline
    const [applicationsStatus] = await db.query(
      `SELECT rs.stage AS status, COUNT(*) AS count
       FROM candidate_pipeline cp
       JOIN recruitment_stage rs ON cp.recruitment_stage_id = rs.id
       WHERE cp.recruiter_id = ?
       GROUP BY cp.recruitment_stage_id`,
      [recruiterId]
    );

    res.json({
      success: true,
      jobsPerMonth,
      candidatesPerDept,
      applicationsStatus,
    });
  } catch (err) {
    console.error('Error fetching analytics data:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.addDepartment = async (req, res) => {
  const { dept_name } = req.body;

  try {
    // Validate input
    if (!dept_name || typeof dept_name !== 'string' || dept_name.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Department name is required and must be a non-empty string" });
    }
    if (dept_name.length > 100) {
      return res.status(400).json({ success: false, message: "Department name must not exceed 100 characters" });
    }

    // Check if department name already exists
    const [existingDept] = await db.query(
      "SELECT dept_id FROM job_department WHERE dept_name = ?",
      [dept_name.trim()]
    );
    if (existingDept.length > 0) {
      return res.status(400).json({ success: false, message: "Department name already exists" });
    }

    // Insert new department
    const [result] = await db.query(
      "INSERT INTO job_department (dept_name) VALUES (?)",
      [dept_name.trim()]
    );

    res.json({
      success: true,
      message: "Department added successfully",
      dept_id: result.insertId,
      dept_name: dept_name.trim()
    });
  } catch (error) {
    console.error("Error adding department:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

