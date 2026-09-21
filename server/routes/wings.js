import express from 'express';
import { db } from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ wings: db.wings });
});

router.get('/:id', (req, res) => {
  const wing = db.wings.find((w) => w.id === req.params.id);
  if (!wing) {
    return res.status(404).json({ error: 'Wing not found' });
  }
  const wingProjects = db.projects.filter((p) => p.wing === wing.title);
  res.json({ wing, projects: wingProjects });
});

export default router;
