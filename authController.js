const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs').promises;

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

exports.login = async (req, res) => {
  const { email, password, userType } = req.body;

  try {
    let table, emailField, passwordField, idField;
    if (userType === 'recruiter') {
      table = 'recruiters';
      emailField = 'recruiter_email';
      passwordField = 'recruiter_password';
      idField = 'id';
    } else if (userType === 'candidate') {
      table = 'candidates';
      emailField = 'candidate_email';
      passwordField = 'candidate_password';
      idField = 'id';
    } else {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    const [rows] = await db.query(`SELECT ${idField}, ${passwordField} FROM ${table} WHERE ${emailField} = ?`, [email]);

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user[passwordField]);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Generate JWT token valid for 1 day
    const token = jwt.sign(
      { id: user[idField], userType },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ success: true, message: 'Login successful', userId: user[idField], userType, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.register = async (req, res) => {
  const { name, email, password, designation, userType } = req.body;
  const resume = req.file;

  try {
    // Check if email already exists in either table
    const [recruiterExists] = await db.query(`SELECT recruiter_email FROM recruiters WHERE recruiter_email = ?`, [email]);
    const [candidateExists] = await db.query(`SELECT candidate_email FROM candidates WHERE candidate_email = ?`, [email]);

    if (recruiterExists.length > 0 || candidateExists.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle resume upload for candidates
    let resumePath = null;
    if (userType === 'candidate' && resume) {
      const resumeDir = path.join(__dirname, '../public/resumes');
      await fs.mkdir(resumeDir, { recursive: true });
      const fileName = `${Date.now()}_${resume.originalname}`;
      resumePath = `/resumes/${fileName}`;
      await fs.writeFile(path.join(resumeDir, fileName), resume.buffer);
    }

    // Insert user and get inserted ID
    let insertedId;
    if (userType === 'recruiter') {
      const [result] = await db.query(
        `INSERT INTO recruiters (recruiter_name, recruiter_email, recruiter_password, recruiter_designation) VALUES (?, ?, ?, ?)`,
        [name, email, hashedPassword, designation || null]
      );
      insertedId = result.insertId;
    } else if (userType === 'candidate') {
      const [result] = await db.query(
        `INSERT INTO candidates (candidate_name, candidate_email, candidate_password, candidate_resume) VALUES (?, ?, ?, ?)`,
        [name, email, hashedPassword, resumePath]
      );
      insertedId = result.insertId;
    } else {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    res.json({ success: true, message: 'Registration successful', userId: insertedId, userType });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.logout = async (req, res) => {
  try {
    // Typically, token invalidation is handled client-side by deleting the token.
    // Server-side token blacklisting could be implemented if needed.
    res.json({ success: true, message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
