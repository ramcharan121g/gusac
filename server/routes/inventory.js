import express from 'express';
import { db } from '../db.js';
import { authenticateToken, requireAuth } from '../middleware.js';
import { logAuditEvent, sanitizeInput } from '../security.js';

const router = express.Router();

// Get full hardware component catalog
router.get('/', (req, res) => {
  res.json({ inventory: db.inventory });
});

// Request component checkout for project
router.post('/request', authenticateToken, requireAuth, (req, res) => {
  try {
    const { inventoryId, projectName, returnDue } = req.body;
    const item = db.inventory.find((i) => i.id === inventoryId);
    
    if (!item) {
      return res.status(404).json({ error: 'Component item not found' });
    }

    if (item.availableQty <= 0) {
      return res.status(400).json({ error: 'Component currently fully checked out by other teams.' });
    }

    item.availableQty -= 1;
    if (item.availableQty === 0) item.status = 'Out of Stock';

    const checkoutReq = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      inventoryId: item.id,
      itemName: item.name,
      userId: req.user.id,
      userName: req.user.name,
      userEmail: req.user.email,
      projectName: sanitizeInput(projectName) || 'General R&D Prototyping',
      requestedAt: new Date().toISOString(),
      status: 'Issued',
      returnDue: returnDue || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    db.inventoryRequests.unshift(checkoutReq);

    logAuditEvent({
      actor: req.user.email,
      actorRole: req.user.role,
      action: 'HARDWARE_COMPONENT_CHECKOUT',
      ip: req.ip,
      status: 'SUCCESS',
      details: `${req.user.name} checked out '${item.name}' for project '${checkoutReq.projectName}'.`,
      securityLevel: 'LOW'
    });

    res.status(201).json({
      message: `Checkout approved for ${item.name}! Collect from ${item.location}.`,
      request: checkoutReq
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process hardware request' });
  }
});

// Get user's active checkouts
router.get('/my-requests', authenticateToken, requireAuth, (req, res) => {
  const requests = db.inventoryRequests.filter((r) => r.userId === req.user.id);
  res.json({ requests });
});

export default router;
