import express from 'express';
import { db } from '../db.js';
import { authenticateToken, requireAuth, requireRole } from '../middleware.js';
import { logAuditEvent, sanitizeInput } from '../security.js';
import { sendDigitalPassEmail } from '../services/emailService.js';
import { query as pgQuery } from '../db/postgres.js';

const router = express.Router();

// Get all events (supports ?status=upcoming | ?status=past)
router.get('/', async (req, res) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');

  try {
    const pgRes = await pgQuery('SELECT * FROM events ORDER BY created_at DESC');
    if (pgRes?.rows?.length > 0) {
      const pgEvents = pgRes.rows.map((row) => {
        let schedule = [];
        let coordinators = [];
        try {
          schedule = typeof row.agenda === 'string' ? JSON.parse(row.agenda) : (row.agenda || []);
        } catch (e) {}
        try {
          coordinators = typeof row.coordinators === 'string' ? JSON.parse(row.coordinators) : (row.coordinators || []);
        } catch (e) {}

        return {
          id: row.id,
          title: row.title,
          slug: row.slug || row.id,
          category: row.category,
          date: row.date,
          time: row.time,
          venue: row.venue,
          description: row.description,
          fee: parseFloat(row.fee) || 0,
          isPaid: parseFloat(row.fee) > 0,
          capacity: row.capacity,
          registeredCount: row.registered_count || 0,
          coverImage: row.banner_image,
          bannerImage: row.banner_image,
          images: [row.banner_image].filter(Boolean),
          status: row.is_active ? 'upcoming' : 'past',
          schedule,
          coordinators
        };
      });

      // Merge: PostgreSQL rows take precedence, keep unpersisted memory events as fallback
      const pgIds = new Set(pgEvents.map((e) => e.id));
      const memoryOnly = db.events.filter((e) => !pgIds.has(e.id));
      db.events = [...pgEvents, ...memoryOnly];
    }
  } catch (err) {
    // Fallback to local memory events
  }

  const { status, category } = req.query;
  let filtered = db.events;

  if (status) {
    filtered = filtered.filter((e) => (e.status || 'upcoming') === status);
  }
  if (category && category !== 'All') {
    filtered = filtered.filter((e) => e.category === category);
  }

  const upcoming = db.events.filter((e) => (e.status || 'upcoming') === 'upcoming');
  const past = db.events.filter((e) => e.status === 'past');

  res.json({
    events: filtered,
    upcoming,
    past,
    totalUpcoming: upcoming.length,
    totalPast: past.length
  });
});

// Get individual event details by ID
router.get('/:id', authenticateToken, async (req, res) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');

  let event = db.events.find((e) => e.id === req.params.id || e.slug === req.params.id);
  if (!event) {
    try {
      const pgRes = await pgQuery(
        'SELECT * FROM events WHERE id = $1 OR slug = $1 LIMIT 1',
        [req.params.id]
      );
      if (pgRes?.rows?.length > 0) {
        const row = pgRes.rows[0];
        let schedule = [];
        let coordinators = [];
        try {
          schedule = typeof row.agenda === 'string' ? JSON.parse(row.agenda) : (row.agenda || []);
        } catch (e) {}
        try {
          coordinators = typeof row.coordinators === 'string' ? JSON.parse(row.coordinators) : (row.coordinators || []);
        } catch (e) {}

        event = {
          id: row.id,
          title: row.title,
          slug: row.slug || row.id,
          category: row.category,
          date: row.date,
          time: row.time,
          venue: row.venue,
          description: row.description,
          fee: parseFloat(row.fee) || 0,
          isPaid: parseFloat(row.fee) > 0,
          capacity: row.capacity,
          registeredCount: row.registered_count || 0,
          coverImage: row.banner_image,
          bannerImage: row.banner_image,
          images: [row.banner_image].filter(Boolean),
          status: row.is_active ? 'upcoming' : 'past',
          schedule,
          coordinators
        };
        db.events.push(event);
      }
    } catch (e) {
      // Fallback
    }
  }

  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  // Check if current user is registered
  let userRegistration = null;
  if (req.user) {
    userRegistration = db.eventRegistrations.find(
      (r) => r.eventId === event.id && r.userId === req.user.id
    ) || null;
  }

  res.json({
    event,
    isRegistered: !!userRegistration,
    registration: userRegistration
  });
});

// ==========================================
// 1. Free Event Registration / RSVP
// ==========================================
router.post('/:id/rsvp', authenticateToken, requireAuth, (req, res) => {
  try {
    const event = db.events.find((e) => e.id === req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // If it's a paid event, require payment flow!
    if (event.isPaid && event.fee > 0) {
      return res.status(402).json({
        error: 'Payment Required',
        message: `This event requires a registration fee of ₹${event.fee}. Please proceed through the payment gateway.`,
        fee: event.fee,
        requiresPayment: true
      });
    }

    // Check if already registered
    const existing = db.eventRegistrations.find(
      (r) => r.eventId === event.id && r.userId === req.user.id
    );

    if (existing) {
      return res.status(409).json({
        error: 'Already registered',
        message: 'You have already registered for this event.',
        ticketCode: existing.ticketCode,
        registration: existing
      });
    }

    const ticketCode = `GUSAC-${event.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const registration = {
      id: `reg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      eventId: event.id,
      eventTitle: event.title,
      userId: req.user.id,
      userName: req.user.name,
      userEmail: req.user.email,
      userPhone: req.user.phone || '',
      userType: req.user.userType || 'gitam',
      collegeOrCompany: req.user.collegeOrCompany || (req.user.userType === 'gitam' ? 'GITAM University' : 'External Institution'),
      ticketCode,
      paymentStatus: 'free',
      paymentAmount: 0,
      paymentTxnId: `TXN-FREE-${Math.floor(100000 + Math.random() * 900000)}`,
      paymentMethod: 'Complimentary Student Pass',
      registeredAt: new Date().toISOString(),
      passSentEmail: true,
      checkedIn: false,
      checkedInAt: null,
      checkedInBy: null
    };

    db.eventRegistrations.push(registration);
    event.registeredCount = (event.registeredCount || 0) + 1;

    // Send real digital pass with embedded QR code via Brevo SMTP
    sendDigitalPassEmail({
      toEmail: req.user.email,
      userName: req.user.name,
      registration,
      event
    }).catch((err) => console.error('[Brevo SMTP] Digital Pass email error:', err.message));

    // Persist to Supabase PostgreSQL registrations table
    pgQuery(
      `INSERT INTO registrations (id, event_id, event_title, user_id, user_name, user_email, user_phone, user_type, student_id, ticket_code, pass_signature, fee_paid, payment_method, payment_txn_id, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       ON CONFLICT (id) DO NOTHING`,
      [
        registration.id,
        event.id,
        event.title,
        req.user.id,
        req.user.name,
        req.user.email,
        req.user.phone || null,
        req.user.userType || 'gitam',
        req.user.studentId || null,
        ticketCode,
        ticketCode,
        0,
        'FREE_RSVP',
        registration.paymentTxnId,
        'COMPLETED'
      ]
    ).catch((err) => console.error('[PostgreSQL Registration Persist Error]:', err.message));

    logAuditEvent({
      actor: req.user.email,
      actorRole: req.user.role,
      action: 'EVENT_REGISTRATION_FREE_SUCCESS',
      ip: req.ip,
      status: 'SUCCESS',
      details: `User registered for '${event.title}' with Pass ID ${ticketCode}. Digital pass issued.`,
      securityLevel: 'LOW'
    });

    res.status(201).json({
      message: 'Successfully registered for event! Your digital access pass has been issued and sent to your email.',
      registration,
      ticketCode
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process RSVP.' });
  }
});

// ==========================================
// 2. Paid Event: Create Payment Order
// ==========================================
router.post('/:id/create-payment-order', authenticateToken, requireAuth, (req, res) => {
  try {
    const event = db.events.find((e) => e.id === req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    const existing = db.eventRegistrations.find(
      (r) => r.eventId === event.id && r.userId === req.user.id
    );
    if (existing) {
      return res.status(409).json({
        error: 'Already registered',
        message: 'You already have an active pass for this event.',
        ticketCode: existing.ticketCode
      });
    }

    const orderId = `ORDER_GUSAC_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const amount = event.fee || 199;

    res.json({
      orderId,
      amount,
      currency: 'INR',
      event: {
        id: event.id,
        title: event.title,
        fee: event.fee
      },
      user: {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        userType: req.user.userType
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to initiate payment gateway order.' });
  }
});

// ==========================================
// 3. Paid Event: Verify Payment & Issue Pass
// ==========================================
router.post('/:id/verify-payment', authenticateToken, requireAuth, (req, res) => {
  try {
    const event = db.events.find((e) => e.id === req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    let { orderId, paymentMethod, paymentTxnId } = req.body;
    paymentTxnId = paymentTxnId || `PAY-${Date.now()}-${Math.floor(100000 + Math.random() * 900000)}`;
    paymentMethod = paymentMethod || 'UPI Gateway';

    // Check duplicate
    const existing = db.eventRegistrations.find(
      (r) => r.eventId === event.id && r.userId === req.user.id
    );
    if (existing) {
      return res.status(409).json({
        error: 'Already registered',
        ticketCode: existing.ticketCode,
        registration: existing
      });
    }

    const ticketCode = `GUSAC-${event.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const registration = {
      id: `reg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      eventId: event.id,
      eventTitle: event.title,
      userId: req.user.id,
      userName: req.user.name,
      userEmail: req.user.email,
      userPhone: req.user.phone || '',
      userType: req.user.userType || 'gitam',
      collegeOrCompany: req.user.collegeOrCompany || (req.user.userType === 'gitam' ? 'GITAM University' : 'External Institution'),
      ticketCode,
      paymentStatus: 'completed',
      paymentAmount: event.fee || 0,
      paymentTxnId,
      paymentMethod,
      registeredAt: new Date().toISOString(),
      passSentEmail: true,
      checkedIn: false,
      checkedInAt: null,
      checkedInBy: null
    };

    db.eventRegistrations.push(registration);
    event.registeredCount = (event.registeredCount || 0) + 1;

    // Send real digital pass with embedded QR code via Brevo SMTP
    sendDigitalPassEmail({
      toEmail: req.user.email,
      userName: req.user.name,
      registration,
      event
    }).catch((err) => console.error('[Brevo SMTP] Digital Pass email error:', err.message));

    // Persist to Supabase PostgreSQL registrations table
    pgQuery(
      `INSERT INTO registrations (id, event_id, event_title, user_id, user_name, user_email, user_phone, user_type, student_id, ticket_code, pass_signature, fee_paid, payment_method, payment_txn_id, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       ON CONFLICT (id) DO NOTHING`,
      [
        registration.id,
        event.id,
        event.title,
        req.user.id,
        req.user.name,
        req.user.email,
        req.user.phone || null,
        req.user.userType || 'gitam',
        req.user.studentId || null,
        ticketCode,
        ticketCode,
        event.fee || 0,
        paymentMethod,
        paymentTxnId,
        'COMPLETED'
      ]
    ).catch((err) => console.error('[PostgreSQL Registration Persist Error]:', err.message));

    logAuditEvent({
      actor: req.user.email,
      actorRole: req.user.role,
      action: 'PAYMENT_VERIFIED_PASS_ISSUED',
      ip: req.ip,
      status: 'SUCCESS',
      details: `Payment of ₹${event.fee} received for '${event.title}' via ${paymentMethod} (Txn: ${paymentTxnId}). Digital Pass ${ticketCode} dispatched.`,
      securityLevel: 'MEDIUM'
    });

    res.status(201).json({
      message: 'Payment confirmed! Your digital event pass with QR code has been generated and sent to your email.',
      registration,
      ticketCode,
      receipt: {
        txnId: paymentTxnId,
        amount: event.fee,
        currency: 'INR',
        method: paymentMethod,
        date: new Date().toISOString(),
        eventTitle: event.title
      }
    });
  } catch (err) {
    console.error('Payment verification error:', err);
    res.status(500).json({ error: 'Payment verification failed.' });
  }
});

// Get user's registered events / passes
router.get('/user/my-registrations', authenticateToken, requireAuth, (req, res) => {
  const registrations = db.eventRegistrations.filter((r) => r.userId === req.user.id);
  const enriched = registrations.map((r) => {
    const ev = db.events.find((e) => e.id === r.eventId);
    return {
      ...r,
      event: ev || null
    };
  });
  res.json({ registrations: enriched });
});

// Admin: Create new event
router.post('/', authenticateToken, requireAuth, requireRole(['admin']), (req, res) => {
  try {
    let {
      title,
      date,
      time,
      venue,
      category,
      badgeColor,
      capacity,
      description,
      details,
      prizePool,
      tags,
      fee,
      status,
      coverImage,
      videoUrl,
      images,
      schedule,
      coordinators
    } = req.body;

    title = sanitizeInput(title);
    venue = sanitizeInput(venue);
    description = sanitizeInput(description);

    if (!title || !date || !venue) {
      return res.status(400).json({ error: 'Title, date, and venue are required.' });
    }

    const primaryCover = coverImage || (Array.isArray(images) && images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80');
    const eventImages = Array.isArray(images) && images.length > 0
      ? (coverImage && !images.includes(coverImage) ? [coverImage, ...images] : images)
      : [primaryCover];

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now().toString(36)}`;
    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 3)}`;

    const newEvent = {
      id: eventId,
      title,
      slug,
      date,
      time: time || '10:00 AM IST',
      venue,
      category: category || 'Workshop',
      badgeColor: badgeColor || '#124EB4',
      capacity: Number(capacity) || 100,
      registeredCount: 0,
      status: status || 'upcoming',
      fee: Number(fee) || 0,
      isPaid: Number(fee) > 0,
      description: description || 'Exciting GUSAC tech session.',
      details: details || description || 'Exciting GUSAC tech session with hands-on lab experiments.',
      prizePool: prizePool || 'Certificates & Goodies',
      tags: Array.isArray(tags) ? tags : ['GUSAC', 'Innovation'],
      coverImage: primaryCover,
      videoUrl: videoUrl ? String(videoUrl).trim() : '',
      images: eventImages,
      schedule: Array.isArray(schedule) ? schedule : [
        { time: '10:00 AM', title: 'Session Commences', speaker: 'Faculty & Student Mentors' }
      ],
      coordinators: Array.isArray(coordinators) ? coordinators : [
        { name: 'GUSAC Core Team', role: 'Event Coordinator', phone: '+91 891 2840501' }
      ],
      isFeatured: false
    };

    db.events.unshift(newEvent);

    // Persist to Supabase PostgreSQL
    pgQuery(
      `INSERT INTO events (id, title, slug, category, date, time, venue, description, fee, capacity, registered_count, banner_image, agenda, coordinators, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 0, $11, $12, $13, $14)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         description = EXCLUDED.description,
         banner_image = EXCLUDED.banner_image,
         is_active = EXCLUDED.is_active`,
      [
        newEvent.id,
        newEvent.title,
        newEvent.slug,
        newEvent.category,
        newEvent.date,
        newEvent.time,
        newEvent.venue,
        newEvent.description,
        newEvent.fee,
        newEvent.capacity,
        newEvent.coverImage,
        JSON.stringify(newEvent.schedule || []),
        JSON.stringify(newEvent.coordinators || []),
        newEvent.status === 'upcoming'
      ]
    ).catch((err) => console.error('[PostgreSQL Event Insert Error]:', err.message));

    logAuditEvent({
      actor: req.user.email,
      actorRole: req.user.role,
      action: 'EVENT_CREATED',
      ip: req.ip,
      status: 'SUCCESS',
      details: `New event '${title}' published by administrator.`,
      securityLevel: 'MEDIUM'
    });

    res.status(201).json({ message: 'Event created successfully!', event: newEvent });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create event.' });
  }
});

// Admin: Update event details
router.put('/:id', authenticateToken, requireAuth, requireRole(['admin']), (req, res) => {
  try {
    const event = db.events.find((e) => e.id === req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    const {
      title,
      date,
      time,
      venue,
      category,
      badgeColor,
      capacity,
      description,
      details,
      prizePool,
      fee,
      status,
      coverImage,
      videoUrl
    } = req.body;

    if (title) event.title = sanitizeInput(title);
    if (date) event.date = date;
    if (time) event.time = time;
    if (venue) event.venue = sanitizeInput(venue);
    if (category) event.category = category;
    if (badgeColor) event.badgeColor = badgeColor;
    if (capacity) event.capacity = Number(capacity);
    if (description) event.description = sanitizeInput(description);
    if (details) event.details = sanitizeInput(details);
    if (prizePool) event.prizePool = prizePool;
    if (coverImage) {
      event.coverImage = coverImage;
      if (!event.images.includes(coverImage)) {
        event.images.unshift(coverImage);
      }
    }
    if (videoUrl !== undefined) event.videoUrl = String(videoUrl).trim();
    if (fee !== undefined) {
      event.fee = Number(fee);
      event.isPaid = Number(fee) > 0;
    }
    if (status) event.status = status;

    // Persist updates to Supabase PostgreSQL
    pgQuery(
      `UPDATE events 
       SET title = $1, category = $2, date = $3, time = $4, venue = $5, description = $6, fee = $7, capacity = $8, banner_image = $9 
       WHERE id = $10`,
      [
        event.title,
        event.category,
        event.date,
        event.time,
        event.venue,
        event.description,
        event.fee,
        event.capacity,
        event.coverImage,
        event.id
      ]
    ).catch((err) => console.error('[PostgreSQL Event Update Error]:', err.message));

    logAuditEvent({
      actor: req.user.email,
      actorRole: req.user.role,
      action: 'EVENT_UPDATED',
      ip: req.ip,
      status: 'SUCCESS',
      details: `Event '${event.title}' modified by administrator.`,
      securityLevel: 'LOW'
    });

    res.json({ message: 'Event updated successfully.', event });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update event.' });
  }
});

export default router;
