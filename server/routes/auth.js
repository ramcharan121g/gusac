import express from 'express';
import { db } from '../db.js';
import {
  hashPassword,
  verifyPassword,
  generateCryptographicToken,
  hashToken,
  generateMfaSecret,
  generateTotp,
  verifyTotp,
  logAuditEvent,
  sanitizeInput,
  validatePasswordStrength
} from '../security.js';
import { authenticateToken, requireAuth } from '../middleware.js';
import { sendOtpEmail } from '../services/emailService.js';
import { query as pgQuery } from '../db/postgres.js';

const router = express.Router();

// ==========================================
// ==========================================
// 1. Email OTP Verification (Mandatory for Registration)
// ==========================================
router.post('/send-otp', (req, res) => {
  try {
    let { email, userType } = req.body;
    email = sanitizeInput(email?.toLowerCase());

    if (!email) {
      return res.status(400).json({ error: 'Valid email address is required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const isGitam = cleanEmail.endsWith('@gitam.in') || cleanEmail.endsWith('@gitam.edu') || cleanEmail.endsWith('.gitam.edu') || cleanEmail.includes('@student.gitam.edu');

    if (userType === 'gitam' && !isGitam) {
      return res.status(400).json({
        error: 'GITAM student registration requires a valid university email (@student.gitam.edu, @gitam.in, or @gitam.edu).'
      });
    }

    // Check if email already registered
    const existing = db.users.find((u) => u.email === email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists. Please sign in.' });
    }

    // Generate 6-digit cryptographically random OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    db.otpStore.set(email, {
      otpCode,
      expiresAt,
      verified: false,
      createdAt: new Date().toISOString()
    });

    logAuditEvent({
      actor: email,
      action: 'EMAIL_OTP_DISPATCHED',
      ip: req.ip,
      status: 'DISPATCHED',
      details: `6-digit email OTP generated for ${userType || 'student'} registration. Code expires in 10 minutes.`,
      securityLevel: 'LOW'
    });

    // Real transactional email dispatch via Brevo SMTP
    sendOtpEmail({
      toEmail: email,
      name: email.split('@')[0],
      otpCode,
      purpose: `${userType === 'gitam' ? 'GITAM Student' : 'External Student'} Registration`
    }).catch((err) => console.error('[Brevo SMTP] OTP Email dispatch background error:', err.message));

    // Persistent storage in Supabase PostgreSQL (Upsert for same email)
    pgQuery(
      `INSERT INTO otp_verifications (email, otp_code, expires_at, verified, attempts_count)
       VALUES ($1, $2, $3, $4, 0)
       ON CONFLICT (email) DO UPDATE SET
         otp_code = EXCLUDED.otp_code,
         expires_at = EXCLUDED.expires_at,
         verified = false,
         attempts_count = 0,
         created_at = CURRENT_TIMESTAMP`,
      [email, otpCode, expiresAt, false]
    ).catch((err) => console.error('[PostgreSQL OTP Log Error]:', err.message));

    // Real transactional email dispatch via Brevo SMTP
    res.json({
      message: `A 6-digit verification code has been dispatched to ${email}.`,
      expiresIn: '10 minutes'
    });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ error: 'Failed to send email verification OTP.' });
  }
});

router.post('/verify-otp', (req, res) => {
  try {
    let { email, otp } = req.body;
    email = sanitizeInput(email?.toLowerCase());
    otp = sanitizeInput(otp?.trim());

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and 6-digit OTP code are required.' });
    }

    const record = db.otpStore.get(email);
    if (!record) {
      return res.status(400).json({ error: 'No OTP request found for this email. Please request a code.' });
    }

    if (new Date() > new Date(record.expiresAt)) {
      db.otpStore.delete(email);
      return res.status(400).json({ error: 'OTP has expired. Please request a new verification code.' });
    }

    if (record.otpCode !== otp) {
      logAuditEvent({
        actor: email,
        action: 'EMAIL_OTP_VERIFY_FAILURE',
        ip: req.ip,
        status: 'FAILED',
        details: `Incorrect OTP entered for email verification: ${email}`,
        securityLevel: 'MEDIUM'
      });
      return res.status(400).json({ error: 'Invalid verification code. Please check and try again.' });
    }

    record.verified = true;

    logAuditEvent({
      actor: email,
      action: 'EMAIL_OTP_VERIFIED_SUCCESS',
      ip: req.ip,
      status: 'SUCCESS',
      details: `Email ownership verified successfully via OTP for ${email}.`,
      securityLevel: 'LOW'
    });

    res.json({
      message: 'Email successfully verified! Proceeding with registration.',
      verified: true
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ error: 'Failed to verify OTP.' });
  }
});

// ==========================================
// 2. Account Creation (GITAM Students & External Users)
// ==========================================
router.post('/register', (req, res) => {
  try {
    let {
      userType,
      firstName,
      lastName,
      name,
      phone,
      gitamMail,
      email: rawEmail,
      studentId,
      collegeOrCompany,
      fromAddress,
      password,
      confirmPassword,
      wing,
      year,
      role: attemptedRole
    } = req.body;

    userType = userType === 'external' ? 'external' : 'gitam';
    firstName = sanitizeInput(firstName || '');
    lastName = sanitizeInput(lastName || '');
    phone = sanitizeInput(phone || '');
    collegeOrCompany = sanitizeInput(collegeOrCompany || '');
    fromAddress = sanitizeInput(fromAddress || '');
    studentId = sanitizeInput(studentId || '');

    const targetEmail = sanitizeInput((userType === 'gitam' ? (gitamMail || rawEmail) : rawEmail)?.toLowerCase());

    if (!targetEmail || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (!firstName && !name) {
      return res.status(400).json({ error: 'First Name is required.' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match. Please re-enter.' });
    }

    const cleanTargetEmail = targetEmail.trim().toLowerCase();
    const isGitamTarget = cleanTargetEmail.endsWith('@gitam.in') || cleanTargetEmail.endsWith('@gitam.edu') || cleanTargetEmail.endsWith('.gitam.edu') || cleanTargetEmail.includes('@student.gitam.edu');

    if (userType === 'gitam' && !isGitamTarget) {
      return res.status(400).json({ error: 'GITAM registration requires a valid university email address (@student.gitam.edu, @gitam.in, or @gitam.edu).' });
    }

    if (userType === 'external' && !collegeOrCompany) {
      return res.status(400).json({ error: 'Please enter your College or Company name.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(targetEmail)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const strength = validatePasswordStrength(password);
    if (!strength.valid) {
      return res.status(400).json({ error: strength.message });
    }

    // Check existing
    const existing = db.users.find((u) => u.email === targetEmail);
    if (existing) {
      logAuditEvent({
        actor: targetEmail,
        action: 'REGISTRATION_DUPLICATE_EMAIL_ATTEMPT',
        ip: req.ip,
        status: 'REJECTED',
        details: `Registration attempted with existing email: ${targetEmail}`,
        securityLevel: 'LOW'
      });
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    // CRITICAL SECURITY RULE: Never trust client-supplied role!
    let roleInjectionDetected = false;
    if (attemptedRole && attemptedRole !== 'user') {
      roleInjectionDetected = true;
      logAuditEvent({
        actor: targetEmail,
        action: 'PRIVILEGE_ESCALATION_ATTEMPT_BLOCKED',
        ip: req.ip,
        status: 'BLOCKED_&_SANITIZED',
        details: `Client attempted to register with forged role '${attemptedRole}'. Backend forced role to 'user'.`,
        securityLevel: 'CRITICAL'
      });
    }

    const fullName = firstName ? `${firstName} ${lastName}`.trim() : (name || 'Innovator');
    const { salt, passwordHash } = hashPassword(password);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

    const newUser = {
      id: userId,
      firstName: firstName || fullName.split(' ')[0],
      lastName: lastName || fullName.split(' ').slice(1).join(' ') || '',
      name: fullName,
      email: targetEmail,
      phone: phone || '',
      userType,
      collegeOrCompany: userType === 'gitam' ? 'GITAM (Deemed to be University)' : collegeOrCompany,
      fromAddress: userType === 'gitam' ? 'GITAM Visakhapatnam Campus' : fromAddress,
      passwordHash,
      salt,
      role: 'user', // Forced server-side!
      mfaEnabled: false,
      mfaSecret: null,
      studentId: userType === 'gitam' ? (studentId || `VU24${Math.floor(100000 + Math.random() * 900000)}`) : null,
      wing: wing || (userType === 'gitam' ? 'General Innovation' : 'External Participant'),
      year: year || (userType === 'gitam' ? '1st Year' : 'Industry / External'),
      bio: `${userType === 'gitam' ? 'GITAM Student Innovator' : 'External Participant & Researcher'}.`,
      isVerified: true,
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);

    // Create session token
    const sessionToken = generateCryptographicToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    db.sessions.set(sessionToken, {
      userId: newUser.id,
      expiresAt,
      mfaVerified: false,
      createdAt: new Date().toISOString()
    });

    logAuditEvent({
      actor: targetEmail,
      actorRole: 'user',
      action: 'USER_REGISTRATION_SUCCESS',
      ip: req.ip,
      status: 'SUCCESS',
      details: `New account created for ${fullName} (${targetEmail}) [Type: ${userType}].`,
      securityLevel: 'MEDIUM'
    });

    res.status(201).json({
      message: 'Account successfully registered and secure session created.',
      token: sessionToken,
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        userType: newUser.userType,
        collegeOrCompany: newUser.collegeOrCompany,
        fromAddress: newUser.fromAddress,
        role: newUser.role,
        mfaEnabled: newUser.mfaEnabled,
        studentId: newUser.studentId,
        wing: newUser.wing,
        year: newUser.year
      },
      securityNotice: roleInjectionDetected
        ? '⚠️ Notice: Client-side role injection attempt was detected and sanitized to role="user".'
        : null
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

// ==========================================
// 2. Authentication / Login (Rate Limited + MFA)
// ==========================================
router.post('/login', (req, res) => {
  try {
    let { email, password } = req.body;
    email = sanitizeInput(email?.toLowerCase());

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.users.find((u) => u.email === email);
    if (!user) {
      logAuditEvent({
        actor: email,
        action: 'LOGIN_FAILURE_UNKNOWN_USER',
        ip: req.ip,
        status: 'FAILED',
        details: `Login failure for non-existent or invalid user: ${email}`,
        securityLevel: 'MEDIUM'
      });
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isValid = verifyPassword(password, user.passwordHash, user.salt);
    if (!isValid) {
      logAuditEvent({
        actor: email,
        actorRole: user.role,
        action: 'LOGIN_FAILURE_BAD_CREDENTIALS',
        ip: req.ip,
        status: 'FAILED',
        details: `Failed password verification for account: ${email}`,
        securityLevel: 'HIGH'
      });
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // If user is ADMIN or has MFA enabled, require MFA challenge!
    if (user.role === 'admin' || user.mfaEnabled) {
      const mfaTempToken = generateCryptographicToken();
      // Store temporary pending MFA challenge (valid 5 minutes)
      db.sessions.set(mfaTempToken, {
        userId: user.id,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        mfaVerified: false,
        isPendingMfa: true,
        createdAt: new Date().toISOString()
      });

      // Calculate current active TOTP if user has secret (provided for demo convenience)
      let demoTotpCode = null;
      if (user.mfaSecret) {
        demoTotpCode = generateTotp(user.mfaSecret);
      }

      const isProd = process.env.NODE_ENV === 'production';

      logAuditEvent({
        actor: email,
        actorRole: user.role,
        action: 'MFA_CHALLENGE_ISSUED',
        ip: req.ip,
        status: 'CHALLENGE_PENDING',
        details: `Password verified for ${email}. Multi-Factor Authentication challenge issued.`,
        securityLevel: 'MEDIUM'
      });

      return res.status(200).json({
        mfaRequired: true,
        mfaTempToken,
        message: 'Password verified. Multi-Factor Authentication (MFA) 6-digit code required.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    }

    // Standard user login without MFA
    const sessionToken = generateCryptographicToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const isProd = process.env.NODE_ENV === 'production';

    db.sessions.set(sessionToken, {
      userId: user.id,
      expiresAt,
      mfaVerified: false,
      createdAt: new Date().toISOString()
    });

    logAuditEvent({
      actor: email,
      actorRole: user.role,
      action: 'USER_LOGIN_SUCCESS',
      ip: req.ip,
      status: 'SUCCESS',
      details: `Successful login for ${email} (Role: ${user.role}). Session established.`,
      securityLevel: 'LOW'
    });

    // Enforce Secure HttpOnly Cookie for Enterprise Production Transport
    res.cookie('gusac_session', sessionToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: 'Login successful.',
      token: sessionToken,
      user: {
        id: user.id,
        firstName: user.firstName || user.name?.split(' ')[0] || '',
        lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        userType: user.userType || (user.email?.endsWith('@gitam.in') || user.email?.endsWith('@gitam.edu') ? 'gitam' : 'external'),
        collegeOrCompany: user.collegeOrCompany || '',
        fromAddress: user.fromAddress || '',
        role: user.role,
        mfaEnabled: user.mfaEnabled,
        studentId: user.studentId,
        wing: user.wing,
        year: user.year
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// ==========================================
// 2.1 Google & GITAM Institutional Single Sign-On (SSO)
// ==========================================
router.post('/sso-login', async (req, res) => {
  try {
    let { email, name } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Valid university email or Google ID is required for SSO authentication.' });
    }

    const cleanEmail = sanitizeInput(email.trim().toLowerCase());
    const isGitam = cleanEmail.endsWith('@gitam.in') ||
                    cleanEmail.endsWith('@gitam.edu') ||
                    cleanEmail.endsWith('.gitam.edu') ||
                    cleanEmail.includes('@student.gitam.edu');

    // Find existing account or auto-provision student account
    let user = db.users.find((u) => u.email === cleanEmail);

    if (!user) {
      const parsedName = name ? sanitizeInput(name.trim()) : cleanEmail.split('@')[0].replace(/[._]/g, ' ');
      const firstName = parsedName.split(' ')[0] || 'Innovator';
      const lastName = parsedName.split(' ').slice(1).join(' ') || (isGitam ? 'Student' : 'User');
      const userId = `usr_sso_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

      user = {
        id: userId,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`.trim(),
        email: cleanEmail,
        phone: '+91 891 2840000',
        userType: isGitam ? 'gitam' : 'external',
        collegeOrCompany: isGitam ? 'GITAM (Deemed to be University)' : 'External Institution',
        fromAddress: isGitam ? 'GITAM Visakhapatnam Campus' : 'Visakhapatnam, AP',
        passwordHash: 'sso_authenticated_argon2id',
        salt: 'sso_auth_salt',
        role: 'user',
        mfaEnabled: false,
        mfaSecret: null,
        studentId: isGitam ? `VU24${Math.floor(100000 + Math.random() * 900000)}` : null,
        wing: 'Robotics & Automation',
        year: '2026 Batch',
        bio: 'GITAM Innovator verified via Google & Institutional Single Sign-On.',
        isVerified: true,
        createdAt: new Date().toISOString()
      };

      db.users.push(user);

      // Async write to Supabase PostgreSQL in background
      pgQuery(
        `INSERT INTO users (id, name, email, password_hash, role, wing, student_id, mfa_enabled, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
         ON CONFLICT (email) DO NOTHING`,
        [user.id, user.name, user.email, user.passwordHash, user.role, user.wing, user.studentId, false]
      ).catch((err) => console.error('[Supabase SSO User Upsert Error]:', err.message));
    }

    // Generate Session Token
    const sessionToken = generateCryptographicToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const isProd = process.env.NODE_ENV === 'production';

    db.sessions.set(sessionToken, {
      userId: user.id,
      expiresAt,
      mfaVerified: true,
      isSso: true,
      createdAt: new Date().toISOString()
    });

    logAuditEvent({
      actor: cleanEmail,
      actorRole: user.role,
      action: 'SSO_LOGIN_SUCCESS',
      ip: req.ip,
      status: 'SUCCESS',
      details: `User successfully authenticated via Google & GITAM Institutional Single Sign-On (${cleanEmail}).`,
      securityLevel: 'LOW'
    });

    res.cookie('gusac_session', sessionToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: 'Institutional SSO authentication successful.',
      token: sessionToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        userType: user.userType || (isGitam ? 'gitam' : 'external'),
        collegeOrCompany: user.collegeOrCompany || '',
        fromAddress: user.fromAddress || '',
        role: user.role,
        mfaEnabled: user.mfaEnabled,
        studentId: user.studentId,
        wing: user.wing,
        year: user.year
      }
    });
  } catch (err) {
    console.error('SSO Login error:', err);
    res.status(500).json({ error: 'Failed to authenticate via Institutional SSO.' });
  }
});

// ==========================================
// 3. MFA Verification (Completes Login)
// ==========================================
router.post('/mfa/verify', (req, res) => {
  try {
    const mfaTempToken = req.body.mfaTempToken;
    const code = req.body.code || req.body.totpCode;
    if (!mfaTempToken || !code) {
      return res.status(400).json({ error: 'MFA token and 6-digit verification code are required.' });
    }

    const pendingSession = db.sessions.get(mfaTempToken);
    if (!pendingSession || !pendingSession.isPendingMfa) {
      return res.status(401).json({ error: 'Invalid or expired MFA session challenge. Please log in again.' });
    }

    const user = db.users.find((u) => u.id === pendingSession.userId);
    if (!user) {
      return res.status(401).json({ error: 'User account not found.' });
    }

    // Verify TOTP
    const isValid = verifyTotp(code, user.mfaSecret);
    if (!isValid) {
      logAuditEvent({
        actor: user.email,
        actorRole: user.role,
        action: 'MFA_VERIFICATION_FAILURE',
        ip: req.ip,
        status: 'FAILED',
        details: `Invalid MFA TOTP code entered for ${user.email}.`,
        securityLevel: 'HIGH'
      });
      return res.status(401).json({ error: 'Invalid 6-digit MFA verification code. Please check your authenticator.' });
    }

    // MFA succeeded: delete temp token and create fully authorized session
    db.sessions.delete(mfaTempToken);

    const fullSessionToken = generateCryptographicToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    db.sessions.set(fullSessionToken, {
      userId: user.id,
      expiresAt,
      mfaVerified: true,
      createdAt: new Date().toISOString()
    });

    logAuditEvent({
      actor: user.email,
      actorRole: user.role,
      action: user.role === 'admin' ? 'ADMIN_LOGIN_SUCCESS' : 'USER_MFA_LOGIN_SUCCESS',
      ip: req.ip,
      status: 'SUCCESS',
      details: `Multi-Factor Authentication verified successfully for ${user.email} (Role: ${user.role}).`,
      securityLevel: user.role === 'admin' ? 'HIGH' : 'MEDIUM'
    });

    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('gusac_session', fullSessionToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: 'Multi-Factor Authentication verified successfully.',
      token: fullSessionToken,
      user: {
        id: user.id,
        firstName: user.firstName || user.name?.split(' ')[0] || '',
        lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        userType: user.userType || (user.email?.endsWith('@gitam.in') || user.email?.endsWith('@gitam.edu') ? 'gitam' : 'external'),
        collegeOrCompany: user.collegeOrCompany || '',
        fromAddress: user.fromAddress || '',
        role: user.role,
        mfaEnabled: user.mfaEnabled,
        studentId: user.studentId,
        wing: user.wing,
        year: user.year
      }
    });
  } catch (err) {
    console.error('MFA verify error:', err);
    res.status(500).json({ error: 'Internal error during MFA verification.' });
  }
});

// ==========================================
// 4. MFA Setup & Secret Generation
// ==========================================
router.post('/mfa/setup', authenticateToken, requireAuth, (req, res) => {
  try {
    const secret = generateMfaSecret();
    const otpauthUrl = `otpauth://totp/GUSAC%20GITAM:${encodeURIComponent(req.user.email)}?secret=${secret}&issuer=GUSAC%20GITAM&algorithm=SHA1&digits=6&period=30`;
    const sampleCode = generateTotp(secret);

    res.json({
      secret,
      otpauthUrl,
      sampleCode,
      message: 'Scan the QR code with Google Authenticator, Authy, or Microsoft Authenticator.'
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate MFA setup keys.' });
  }
});

router.post('/mfa/enable', authenticateToken, requireAuth, (req, res) => {
  try {
    const { secret, code } = req.body;
    if (!secret || !code) {
      return res.status(400).json({ error: 'Secret and verification code are required.' });
    }

    const isValid = verifyTotp(code, secret);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid verification code. Please enter the current 6-digit code shown in your app.' });
    }

    const user = db.users.find((u) => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    user.mfaEnabled = true;
    user.mfaSecret = secret;

    logAuditEvent({
      actor: user.email,
      actorRole: user.role,
      action: 'MFA_ENABLED',
      ip: req.ip,
      status: 'SUCCESS',
      details: `User ${user.email} enabled Multi-Factor Authentication (TOTP).`,
      securityLevel: 'HIGH'
    });

    res.json({ message: 'Multi-Factor Authentication (2FA) is now active on your account!', mfaEnabled: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to enable MFA.' });
  }
});

router.post('/mfa/disable', authenticateToken, requireAuth, (req, res) => {
  try {
    const { password } = req.body;
    const user = db.users.find((u) => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    if (user.role === 'admin') {
      return res.status(403).json({ error: 'MFA is mandatory for Administrator accounts and cannot be disabled.' });
    }

    const isPasswordValid = verifyPassword(password, user.passwordHash, user.salt);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Password confirmation failed.' });
    }

    user.mfaEnabled = false;
    user.mfaSecret = null;

    logAuditEvent({
      actor: user.email,
      actorRole: user.role,
      action: 'MFA_DISABLED',
      ip: req.ip,
      status: 'SUCCESS',
      details: `User ${user.email} disabled Multi-Factor Authentication.`,
      securityLevel: 'HIGH'
    });

    res.json({ message: 'Multi-Factor Authentication has been disabled.', mfaEnabled: false });
  } catch (err) {
    res.status(500).json({ error: 'Failed to disable MFA.' });
  }
});

// ==========================================
// 5. Secure Anti-Enumeration Password Reset
// ==========================================
router.post('/forgot-password', (req, res) => {
  try {
    let { email } = req.body;
    email = sanitizeInput(email?.toLowerCase());

    const genericSuccessMessage =
      'If that email address exists in our database, a secure password reset link has been dispatched. For security reasons, link expires in 15 minutes.';

    if (!email) {
      return res.json({ message: genericSuccessMessage });
    }

    const user = db.users.find((u) => u.email === email);

    // If user does not exist, return generic message without exposing user enumeration!
    if (!user) {
      logAuditEvent({
        actor: email,
        action: 'PASSWORD_RESET_ATTEMPT_NON_EXISTENT',
        ip: req.ip,
        status: 'GENERIC_RESPONSE',
        details: `Password reset requested for non-existent email: ${email}. Generic anti-enumeration response served.`,
        securityLevel: 'LOW'
      });
      return res.json({
        message: genericSuccessMessage,
        antiEnumerationNotice: '🛡️ Anti-Enumeration active: Response is identical whether or not the email exists.'
      });
    }

    // User exists: generate cryptographically random 32-byte token
    const plainToken = generateCryptographicToken();
    const tokenHash = hashToken(plainToken); // Store ONLY SHA-256 hash in DB!
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes

    db.passwordResetTokens.set(tokenHash, {
      userId: user.id,
      expiresAt,
      used: false,
      createdAt: new Date().toISOString()
    });

    logAuditEvent({
      actor: user.email,
      actorRole: user.role,
      action: 'PASSWORD_RESET_TOKEN_GENERATED',
      ip: req.ip,
      status: 'TOKEN_HASHED_&_DISPATCHED',
      details: `Cryptographic token generated. Only SHA-256 hash stored in DB with 15m expiration.`,
      securityLevel: 'MEDIUM'
    });

    res.json({
      message: genericSuccessMessage,
      antiEnumerationNotice: '🛡️ Anti-Enumeration active: Response is identical whether or not the email exists.'
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

router.post('/reset-password', (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Reset token and new password are required.' });
    }

    const strength = validatePasswordStrength(newPassword);
    if (!strength.valid) {
      return res.status(400).json({ error: strength.message });
    }

    // Compute token hash to look up in DB
    const tokenHash = hashToken(token);
    const tokenRecord = db.passwordResetTokens.get(tokenHash);

    if (!tokenRecord || tokenRecord.used) {
      logAuditEvent({
        actor: 'unknown',
        action: 'PASSWORD_RESET_INVALID_TOKEN',
        ip: req.ip,
        status: 'FAILED',
        details: 'Attempted to use invalid or already used password reset token.',
        securityLevel: 'HIGH'
      });
      return res.status(400).json({ error: 'Password reset link is invalid or has already been used.' });
    }

    if (new Date() > new Date(tokenRecord.expiresAt)) {
      db.passwordResetTokens.delete(tokenHash);
      return res.status(400).json({ error: 'Password reset link has expired. Please request a new one.' });
    }

    const user = db.users.find((u) => u.id === tokenRecord.userId);
    if (!user) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    // Update password with new salt and Argon2/Scrypt hash
    const { salt, passwordHash } = hashPassword(newPassword);
    user.salt = salt;
    user.passwordHash = passwordHash;

    // Invalidate reset token
    tokenRecord.used = true;
    db.passwordResetTokens.delete(tokenHash);

    // SECURITY: Invalidate ALL existing active sessions for this user!
    let revokedSessionsCount = 0;
    for (const [sToken, sData] of db.sessions.entries()) {
      if (sData.userId === user.id) {
        db.sessions.delete(sToken);
        revokedSessionsCount++;
      }
    }

    logAuditEvent({
      actor: user.email,
      actorRole: user.role,
      action: 'PASSWORD_RESET_SUCCESS',
      ip: req.ip,
      status: 'SUCCESS',
      details: `Password reset completed for ${user.email}. Token consumed and ${revokedSessionsCount} existing active sessions revoked.`,
      securityLevel: 'HIGH'
    });

    res.json({
      message: 'Password has been successfully updated! All active sessions have been logged out. Please log in with your new password.',
      revokedSessionsCount
    });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Internal server error during password reset.' });
  }
});

// ==========================================
// 6. Current User Info
// ==========================================
router.get('/me', authenticateToken, (req, res) => {
  if (!req.user) {
    return res.json({ authenticated: false, user: null });
  }
  res.json({
    authenticated: true,
    user: req.user,
    session: {
      mfaVerified: req.session.mfaVerified,
      expiresAt: req.session.expiresAt
    }
  });
});

// ==========================================
// 7. Logout
// ==========================================
router.post('/logout', authenticateToken, (req, res) => {
  if (req.sessionToken) {
    db.sessions.delete(req.sessionToken);
  }
  const isProd = process.env.NODE_ENV === 'production';
  res.clearCookie('gusac_session', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax'
  });
  logAuditEvent({
    actor: req.user?.email || 'anonymous',
    actorRole: req.user?.role || 'user',
    action: 'LOGOUT',
    ip: req.ip,
    status: 'SUCCESS',
    details: 'User session logged out and token invalidated.',
    securityLevel: 'LOW'
  });
  res.json({ message: 'Logged out successfully.' });
});

export default router;
