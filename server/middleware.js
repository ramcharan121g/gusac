import { db } from './db.js';
import { logAuditEvent, verifyPassword, verifyTotp } from './security.js';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.cookies?.gusac_session;

  if (!token) {
    req.user = null;
    return next();
  }

  const session = db.sessions.get(token);
  if (!session) {
    req.user = null;
    return next();
  }

  if (new Date() > new Date(session.expiresAt)) {
    db.sessions.delete(token);
    req.user = null;
    return next();
  }

  const user = db.users.find((u) => u.id === session.userId);
  if (!user) {
    db.sessions.delete(token);
    req.user = null;
    return next();
  }

  req.user = {
    id: user.id,
    firstName: user.firstName || user.name?.split(' ')[0] || '',
    lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
    name: user.name,
    email: user.email,
    userType: user.userType || (
      user.email?.endsWith('@gitam.in') ||
      user.email?.endsWith('@gitam.edu') ||
      user.email?.endsWith('.gitam.edu') ||
      user.email?.includes('@student.gitam.edu')
        ? 'gitam'
        : 'external'
    ),
    fromAddress: user.fromAddress || '',
    role: user.role,
    mfaEnabled: user.mfaEnabled,
    studentId: user.studentId,
    wing: user.wing,
    year: user.year,
    bio: user.bio,
    isVerified: user.isVerified
  };
  req.session = session;
  req.sessionToken = token;
  next();
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication is required to access this resource.'
    });
  }
  next();
}

export function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      logAuditEvent({
        actor: 'anonymous',
        actorRole: 'unauthenticated',
        action: 'UNAUTHORIZED_ACCESS_ATTEMPT',
        ip: req.ip,
        status: 'DENIED',
        details: `Access denied to protected route: ${req.originalUrl}. No auth token provided.`,
        securityLevel: 'HIGH'
      });
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'You must be logged in to perform this action.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logAuditEvent({
        actor: req.user.email,
        actorRole: req.user.role,
        action: 'RBAC_ACCESS_FORBIDDEN',
        ip: req.ip,
        status: '403_FORBIDDEN',
        details: `User with role '${req.user.role}' attempted to access restricted endpoint '${req.originalUrl}' requiring roles: [${allowedRoles.join(', ')}].`,
        securityLevel: 'CRITICAL'
      });
      return res.status(403).json({
        error: 'Forbidden',
        message: `RBAC Violation: Role '${req.user.role}' does not have sufficient permissions for this operation.`
      });
    }

    next();
  };
}

export function requireAdminMfa(req, res, next) {
  if (req.user?.role === 'admin' && req.user?.mfaEnabled && !req.session?.mfaVerified) {
    return res.status(403).json({
      error: 'MFA_REQUIRED',
      message: 'Multi-Factor Authentication is required for administrator access.'
    });
  }
  next();
}

export function requireReAuth(req, res, next) {
  // Check for sensitive action re-auth payload in headers or body
  const reauthCode = req.headers['x-reauth-mfa'] || req.body?.reauthCode;
  const reauthPassword = req.headers['x-reauth-password'] || req.body?.reauthPassword;

  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  let verified = false;
  let method = '';

  if (reauthPassword) {
    verified = verifyPassword(reauthPassword, user.passwordHash, user.salt);
    method = 'PASSWORD';
  } else if (reauthCode && user.mfaSecret) {
    verified = verifyTotp(reauthCode, user.mfaSecret);
    method = 'MFA_TOTP';
  }

  if (!verified) {
    logAuditEvent({
      actor: req.user.email,
      actorRole: req.user.role,
      action: 'SENSITIVE_ACTION_REAUTH_FAILED',
      ip: req.ip,
      status: 'BLOCKED',
      details: `Re-authentication challenge failed for sensitive action on '${req.originalUrl}'.`,
      securityLevel: 'CRITICAL'
    });

    return res.status(428).json({
      error: 'PRECONDITION_REQUIRED',
      message: 'Sensitive Action Re-Authentication Required. Please confirm your password or 6-digit MFA code.'
    });
  }

  logAuditEvent({
    actor: req.user.email,
    actorRole: req.user.role,
    action: 'SENSITIVE_ACTION_REAUTH_VERIFIED',
    ip: req.ip,
    status: 'VERIFIED',
    details: `Re-authentication succeeded via ${method} for action on '${req.originalUrl}'.`,
    securityLevel: 'HIGH'
  });

  next();
}
