import express from 'express';
import { db } from '../db.js';
import { authenticateToken, requireAuth } from '../middleware.js';
import { logAuditEvent, sanitizeInput } from '../security.js';

const router = express.Router();

// Get all approved projects (or all projects if admin)
router.get('/', authenticateToken, (req, res) => {
  const { wing, search } = req.query;
  let list = db.projects;

  // Non-admins only see Approved projects (plus their own pending projects)
  if (req.user?.role !== 'admin') {
    list = list.filter((p) => p.status === 'Approved' || (req.user && p.authorId === req.user.id));
  }

  if (wing) {
    list = list.filter((p) => p.wing.toLowerCase().includes(wing.toLowerCase()));
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  res.json({ projects: list });
});

router.get('/:id', (req, res) => {
  const project = db.projects.find((p) => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json({ project });
});

// Submit a new project (Requires Auth)
router.post('/', authenticateToken, requireAuth, (req, res) => {
  try {
    let { title, wing, summary, fullDescription, githubUrl, liveDemo, tags } = req.body;

    title = sanitizeInput(title);
    summary = sanitizeInput(summary);
    fullDescription = sanitizeInput(fullDescription);
    githubUrl = sanitizeInput(githubUrl);
    liveDemo = sanitizeInput(liveDemo);

    if (!title || !wing || !summary) {
      return res.status(400).json({ error: 'Title, wing, and summary are required.' });
    }

    const processedTags = Array.isArray(tags)
      ? tags.map((t) => sanitizeInput(t))
      : typeof tags === 'string'
      ? tags.split(',').map((t) => sanitizeInput(t.trim())).filter(Boolean)
      : ['Innovation', 'GUSAC'];

    const newProject = {
      id: `prj_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title,
      wing,
      author: req.user.name,
      authorId: req.user.id,
      status: req.user.role === 'admin' ? 'Approved' : 'Pending',
      rating: 5.0,
      tags: processedTags,
      summary,
      fullDescription: fullDescription || summary,
      githubUrl: githubUrl || '',
      liveDemo: liveDemo || '',
      stars: 1,
      createdAt: new Date().toISOString()
    };

    db.projects.unshift(newProject);

    logAuditEvent({
      actor: req.user.email,
      actorRole: req.user.role,
      action: 'PROJECT_SUBMITTED',
      ip: req.ip,
      status: 'SUCCESS',
      details: `Project '${title}' submitted by ${req.user.name} (Status: ${newProject.status}).`,
      securityLevel: 'LOW'
    });

    res.status(201).json({
      message: 'Project submitted successfully! It will appear in the showcase upon moderator approval.',
      project: newProject
    });
  } catch (err) {
    console.error('Project submission error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Star/Vote on a project (Requires Auth & Single Vote per User)
router.post('/:id/star', authenticateToken, requireAuth, (req, res) => {
  const project = db.projects.find((p) => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  project.starredBy = project.starredBy || [];
  const alreadyStarred = project.starredBy.includes(req.user.id);

  if (alreadyStarred) {
    project.starredBy = project.starredBy.filter((uid) => uid !== req.user.id);
    project.stars = Math.max(0, (project.stars || 1) - 1);
    return res.json({ stars: project.stars, starred: false, message: 'Removed star from project.' });
  } else {
    project.starredBy.push(req.user.id);
    project.stars = (project.stars || 0) + 1;
    return res.json({ stars: project.stars, starred: true, message: 'Starred project successfully!' });
  }
});

export default router;
