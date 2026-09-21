import crypto from 'crypto';
import { db } from './db.js';

// ==========================================
// 1. Password Hashing (Argon2 / Scrypt standard)
// ==========================================
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  // High-cost key derivation (64 bytes derived key, scrypt memory/time hardness)
  const derivedKey = crypto.scryptSync(password, salt, 64);
  const hash = derivedKey.toString('hex');
  return {
    salt,
    passwordHash: `${salt}:${hash}`
  };
}

export function verifyPassword(password, storedPasswordHash, salt) {
  try {
    const parts = storedPasswordHash.split(':');
    const actualSalt = parts.length > 1 ? parts[0] : salt;
    const actualHash = parts.length > 1 ? parts[1] : parts[0];

    const derivedKey = crypto.scryptSync(password, actualSalt, 64);
    const keyBuffer = Buffer.from(derivedKey.toString('hex'), 'hex');
    const storedBuffer = Buffer.from(actualHash, 'hex');

    if (keyBuffer.length !== storedBuffer.length) {
      return false;
    }
    // Constant-time comparison prevents timing analysis side-channels
    return crypto.timingSafeEqual(keyBuffer, storedBuffer);
  } catch (err) {
    console.error('Password verification error:', err);
    return false;
  }
}

// ==========================================
// 2. Cryptographic Token Hashing (Anti-Enumeration)
// ==========================================
export function generateCryptographicToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// ==========================================
// 3. RFC 6238 TOTP Multi-Factor Authentication
// ==========================================
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function generateMfaSecret() {
  const bytes = crypto.randomBytes(20);
  let secret = '';
  for (let i = 0; i < bytes.length; i++) {
    secret += BASE32_ALPHABET[bytes[i] % BASE32_ALPHABET.length];
  }
  return secret;
}

function base32Decode(base32) {
  const clean = base32.replace(/=+$/, '').toUpperCase();
  let bits = '';
  for (let i = 0; i < clean.length; i++) {
    const val = BASE32_ALPHABET.indexOf(clean[i]);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, '0');
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.substring(i, i + 8), 2));
  }
  return Buffer.from(bytes);
}

export function generateTotp(secret, timeStep = 30) {
  const epochSeconds = Math.floor(Date.now() / 1000);
  const counter = Math.floor(epochSeconds / timeStep);
  const buffer = Buffer.alloc(8);
  buffer.writeBigInt64BE(BigInt(counter));

  const key = base32Decode(secret);
  const hmac = crypto.createHmac('sha1', key).update(buffer).digest();

  const offset = hmac[hmac.length - 1] & 0xf;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  return (code % 1000000).toString().padStart(6, '0');
}

export function verifyTotp(token, secret, window = 1) {
  if (!token || !secret) return false;
  const cleanToken = token.trim();
  const epochSeconds = Math.floor(Date.now() / 1000);
  const currentStep = Math.floor(epochSeconds / 30);

  const key = base32Decode(secret);

  // Check +/- window to account for network latency or slight clock drift
  for (let errorStep = -window; errorStep <= window; errorStep++) {
    const counter = currentStep + errorStep;
    const buffer = Buffer.alloc(8);
    buffer.writeBigInt64BE(BigInt(counter));

    const hmac = crypto.createHmac('sha1', key).update(buffer).digest();
    const offset = hmac[hmac.length - 1] & 0xf;
    const code =
      ((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff);

    const generated = (code % 1000000).toString().padStart(6, '0');
    if (generated === cleanToken) {
      return true;
    }
  }

  return false;
}

// ==========================================
// 4. HMAC SHA-256 Pass & QR Code Signing
// ==========================================
const HMAC_SECRET = process.env.HMAC_PASS_SECRET || 'gusac-visakhapatnam-tamperproof-pass-key-2026';

export function signPassPayload(data) {
  const serialized = typeof data === 'string' ? data : JSON.stringify(data);
  const signature = crypto.createHmac('sha256', HMAC_SECRET).update(serialized).digest('hex');
  return {
    data,
    signature,
    signedAt: new Date().toISOString()
  };
}

export function verifyPassPayload(data, signature) {
  if (!data || !signature) return false;
  try {
    const serialized = typeof data === 'string' ? data : JSON.stringify(data);
    const expectedSig = crypto.createHmac('sha256', HMAC_SECRET).update(serialized).digest('hex');
    const a = Buffer.from(signature, 'hex');
    const b = Buffer.from(expectedSig, 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch (e) {
    return false;
  }
}

// ==========================================
// 5. Immutable Audit Logger
// ==========================================
export function logAuditEvent({ actor, actorRole, action, ip, status, details, securityLevel = 'MEDIUM' }) {
  const logEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    timestamp: new Date().toISOString(),
    actor: actor || 'anonymous',
    actorRole: actorRole || 'unauthenticated',
    action,
    ip: ip || '127.0.0.1',
    status,
    details,
    securityLevel // 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  };

  db.auditLogs.unshift(logEntry);
  if (db.auditLogs.length > 500) {
    db.auditLogs.pop();
  }
  return logEntry;
}

// ==========================================
// 5. Input Sanitizer & Validation
// ==========================================
export function sanitizeInput(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/[<>]/g, '') // remove direct tag injectors
    .trim();
}

export function validatePasswordStrength(password) {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long.' };
  }
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const score = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  if (score < 3) {
    return {
      valid: false,
      message: 'Password must contain at least 3 of: uppercase, lowercase, numbers, and special characters.'
    };
  }
  return { valid: true };
}
