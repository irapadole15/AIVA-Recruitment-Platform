// controllers/candidateController.js

const db = require('../config/db');

// Fetch candidate details by ID
exports.getCandidateDetailsById = async (req, res) => {
  const candidateId = req.params.id;
  try {
    const [candidates] = await db.query(
      `SELECT id, candidate_name, candidate_email,candidate_resume FROM candidates WHERE id = ?`,
      [candidateId]
    );
    if (candidates.length === 0) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }
    res.json({ success: true, candidate: candidates[0] });
  } catch (error) {
    console.error('Error fetching candidate details:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Fetch jobs (same as recruiterController, but tailored for candidates if needed)
exports.getJobs = async (req, res) => {
  try {
    const [jobs] = await db.query(
      `SELECT 
         j.id,
         j.job_title,
         j.job_description,
         j.job_location,
         j.salary_range,
         j.created_at
       FROM jobs j
       ORDER BY j.created_at DESC`
    );
    res.json({ success: true, jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



exports.applyJob = async (req, res) => {
  try {
    const { candidate_id, job_id } = req.body;

    if (!candidate_id || !job_id) {
      return res.status(400).json({ success: false, message: 'Candidate ID and Job ID are required' });
    }

    // Check if candidate exists
    const [candidateRows] = await db.query('SELECT id FROM candidates WHERE id = ?', [candidate_id]);
    if (candidateRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    // Check if job exists
    const [jobRows] = await db.query('SELECT id FROM jobs WHERE id = ?', [job_id]);
    if (jobRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check for duplicate application
    const [existingApply] = await db.query(
      'SELECT id FROM apply_jobs WHERE candidate_id = ? AND job_id = ?',
      [candidate_id, job_id]
    );
    if (existingApply.length > 0) {
      return res.status(409).json({ success: false, message: 'You have already applied for this job' });
    }

    // Insert application
    await db.query(
      'INSERT INTO apply_jobs (candidate_id, job_id) VALUES (?, ?)',
      [candidate_id, job_id]
    );

    res.json({ success: true, message: 'Applied to job successfully' });
  } catch (error) {
    console.error('Error applying to job:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get applied job IDs for a candidate
exports.getAppliedJobIds = async (req, res) => {
  const candidateId = req.params.candidateId;
  try {
    const [rows] = await db.query('SELECT job_id FROM apply_jobs WHERE candidate_id = ?', [candidateId]);
    const appliedJobIds = rows.map(row => row.job_id);
    res.json({ success: true, appliedJobIds });
  } catch (error) {
    console.error('Error fetching applied job IDs:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// In candidateController.js
exports.getAppliedJobs = async (req, res) => {
  const candidateId = req.params.candidateId;
  try {
    const [rows] = await db.query(
      `SELECT 
         aj.id as application_id,
         j.id as job_id,
         j.job_title,
         jd.dept_name,
         j.job_location,
         j.salary_range,
         aj.created_at as applied_at,
         r.recruiter_name
       FROM apply_jobs aj
       JOIN jobs j ON aj.job_id = j.id
       LEFT JOIN job_department jd ON j.dept_id = jd.dept_id
       LEFT JOIN recruiters r ON j.created_by = r.id
       WHERE aj.candidate_id = ?
       ORDER BY aj.created_at DESC`,
      [candidateId]
    );
    res.json({ success: true, appliedJobs: rows });
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



exports.interviewScheduleForCandidates = async (req, res) => {
  const { candidateId } = req.params;
  try {
    const [interviews] = await db.query(
      `SELECT 
         i.id, 
         i.interview_title, 
         i.interview_date, 
         i.interview_time,
         i.job_id,
         r.recruiter_name, 
         j.job_title
       FROM interview_schedule i
       JOIN recruiters r ON i.recruiter_id = r.id
       JOIN jobs j ON i.job_id = j.id
       WHERE i.candidate_id = ?
       ORDER BY i.interview_date DESC`,
      [candidateId]
    );

    res.json({ success: true, interviews });
  } catch (error) {
    console.error('Error fetching interview schedules for candidate:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};





// Get count of today's interviews for a candidate
exports.getTodayInterviewsCount = async (req, res) => {
  const { candidateId } = req.params;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const [result] = await db.query(
      `SELECT COUNT(*) AS count FROM interview_schedule
       WHERE candidate_id = ? 
       AND interview_date >= ? AND interview_date < ?`,
      [candidateId, today.toISOString().split('T')[0], tomorrow.toISOString().split('T')[0]]
    );
    res.json({ success: true, count: result[0].count });
  } catch (error) {
    console.error('Error fetching today interviews count:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};




// Get count of upcoming interviews (after today) for a candidate
exports.getUpcomingInterviewsCount = async (req, res) => {
  const { candidateId } = req.params;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [result] = await db.query(
      `SELECT COUNT(*) AS count FROM interview_schedule
       WHERE candidate_id = ? 
       AND interview_date > ?`,
      [candidateId, today.toISOString().split('T')[0]]
    );
    res.json({ success: true, count: result[0].count });
  } catch (error) {
    console.error('Error fetching upcoming interviews count:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


// recruiterController.js

exports.countJobs = async (req, res) => {
  try {
    const [result] = await db.query('SELECT COUNT(*) as total FROM jobs');
    const totalJobs = result[0]?.total || 0;
    res.json({ success: true, totalJobs });
  } catch (error) {
    console.error('Error counting jobs:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// candidateController.js

exports.appliedJobCountByCandidateId = async (req, res) => {
  const { candidateId } = req.params;

  try {
    const [result] = await db.query(
      `SELECT COUNT(*) AS totalApplied FROM apply_jobs WHERE candidate_id = ?`,
      [candidateId]
    );
    const totalApplied = result[0]?.totalApplied || 0;
    res.json({ success: true, totalApplied });
  } catch (error) {
    console.error('Error fetching applied job count:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
