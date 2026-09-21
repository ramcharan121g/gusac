import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET /api/site-content - Public endpoint to retrieve current dynamic website content
router.get('/', (req, res) => {
  res.json({
    siteContent: db.siteContent,
    lastUpdated: new Date().toISOString()
  });
});

export default router;
