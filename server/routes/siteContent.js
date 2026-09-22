import express from 'express';
import { db, getDefaultSiteContent, savePersistentSiteContent } from '../db.js';
import { query as pgQuery } from '../db/postgres.js';

const router = express.Router();

// GET /api/site-content - Public endpoint to retrieve current dynamic website content directly from PostgreSQL & disk
router.get('/', async (req, res) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');

  try {
    const pgRes = await pgQuery(
      "SELECT value, updated_at FROM site_settings WHERE key = 'site_content' LIMIT 1"
    );
    if (pgRes?.rows?.length > 0 && pgRes.rows[0].value) {
      const dbContent = typeof pgRes.rows[0].value === 'string'
        ? JSON.parse(pgRes.rows[0].value)
        : pgRes.rows[0].value;

      db.siteContent = {
        ...getDefaultSiteContent(),
        ...dbContent
      };
      savePersistentSiteContent(db.siteContent);

      return res.json({
        siteContent: db.siteContent,
        lastUpdated: pgRes.rows[0].updated_at || new Date().toISOString()
      });
    }
  } catch (err) {
    // Database fallback to memory / persistent JSON file
  }

  res.json({
    siteContent: db.siteContent,
    lastUpdated: new Date().toISOString()
  });
});

export default router;
