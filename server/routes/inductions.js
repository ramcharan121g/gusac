import express from 'express';
import { db } from '../db.js';
import { logAuditEvent, sanitizeInput } from '../security.js';

const router = express.Router();

// Get active induction status
router.get('/status', (req, res) => {
  res.json({
    isOpen: true,
    batch: 'Spring 2026 Batch Inductions',
    deadline: 'March 20, 2026',
    rounds: [
      { round: 1, name: 'Online Application & Portfolio Review', status: 'ACTIVE' },
      { round: 2, name: 'Hands-on Technical Task & Mini Hack', status: 'UPCOMING' },
      { round: 3, name: 'Core Council Personal Interview & Domain Fit', status: 'UPCOMING' }
    ],
    totalApplicants: db.inductions.length + 142
  });
});

// Submit induction application
router.post('/apply', (req, res) => {
  try {
    let { name, email, studentId, year, wing, branch, cgpa, skills, github, reason } = req.body;

    name = sanitizeInput(name);
    email = sanitizeInput(email?.toLowerCase());
    studentId = sanitizeInput(studentId);
    skills = sanitizeInput(skills);
    reason = sanitizeInput(reason);

    if (!name || !email || !wing) {
      return res.status(400).json({ error: 'Name, email, and preferred wing are required.' });
    }

    const application = {
      id: `ind_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name,
      email,
      studentId: studentId || 'N/A',
      year: year || '1st Year',
      branch: branch || 'CSE / ECE / Aero',
      wing,
      cgpa: cgpa || '8.5',
      skills: skills || 'C++, Python, CAD',
      github: github || '',
      reason: reason || 'Passionate about student innovation and multidisciplinary engineering.',
      appliedAt: new Date().toISOString(),
      status: 'Application Under Review'
    };

    db.inductions.unshift(application);

    logAuditEvent({
      actor: email,
      action: 'STUDENT_INDUCTION_APPLIED',
      ip: req.ip,
      status: 'SUCCESS',
      details: `${name} applied for GUSAC Inductions 2026 (${wing}).`,
      securityLevel: 'LOW'
    });

    res.status(201).json({
      message: 'Induction application submitted successfully! Check your email for Round 1 screening updates.',
      applicationId: application.id
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit induction application' });
  }
});

// Submit Leadership / Wing Lead application
router.post('/apply-lead', async (req, res) => {
  try {
    let { userId, name, email, studentId, requestedRole, targetWing, statementOfPurpose } = req.body;

    name = sanitizeInput(name);
    email = sanitizeInput(email?.toLowerCase());
    studentId = sanitizeInput(studentId);
    requestedRole = sanitizeInput(requestedRole || 'coordinator');
    targetWing = sanitizeInput(targetWing);
    statementOfPurpose = sanitizeInput(statementOfPurpose);

    if (!name || !email || !targetWing) {
      return res.status(400).json({ error: 'Name, email, and target wing are required.' });
    }

    const appId = `app_lead_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

    // Persist to Supabase PostgreSQL leadership_applications table
    const { query: pgQuery } = await import('../db/postgres.js');
    await pgQuery(
      `INSERT INTO leadership_applications 
       (id, user_id, name, email, student_id, requested_role, target_wing, statement_of_purpose, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PENDING')`,
      [appId, userId || null, name, email, studentId || null, requestedRole, targetWing, statementOfPurpose || '']
    );

    logAuditEvent({
      actor: email,
      action: 'LEADERSHIP_APPLICATION_SUBMITTED',
      ip: req.ip,
      status: 'SUCCESS',
      details: `${name} (${email}) submitted leadership application for ${requestedRole} of ${targetWing}.`,
      securityLevel: 'LOW'
    });

    res.status(201).json({
      message: 'Leadership application submitted successfully! It has been routed to the Main Heads & Faculty Approval Queue.',
      applicationId: appId
    });
  } catch (err) {
    console.error('Leadership apply error:', err);
    res.status(500).json({ error: 'Failed to submit leadership application.' });
  }
});

export default router;
