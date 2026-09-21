import nodemailer from 'nodemailer';
import QRCode from 'qrcode';

// Transporter configuration with fallback
let transporter = null;

export function getTransporter() {
  if (!transporter) {
    const host = process.env.SMTP_HOST || 'smtp-relay.brevo.com';
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
      console.warn('⚠️ SMTP credentials not configured. Please ensure SMTP_USER and SMTP_PASS are set.');
      return null;
    }

    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });
  }
  return transporter;
}

const EMAIL_SENDER = process.env.EMAIL_FROM || '"GUSAC Visakhapatnam Main Campus" <noreply@gusac.gitam.edu>';

/**
 * Send 6-digit OTP verification email
 */
export async function sendOtpEmail({ toEmail, name, otpCode, purpose = 'Account Verification' }) {
  const mailer = getTransporter();

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { margin: 0; padding: 0; background-color: #0b1120; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .container { max-width: 600px; margin: 40px auto; background: #0f172a; border-radius: 16px; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
        .header { background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); padding: 32px 24px; text-align: center; }
        .brand { color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: 1px; margin: 0; }
        .subbrand { color: #bae6fd; font-size: 13px; font-weight: 500; margin: 6px 0 0 0; text-transform: uppercase; letter-spacing: 2px; }
        .content { padding: 36px 32px; color: #f1f5f9; }
        .greeting { font-size: 20px; font-weight: 600; margin: 0 0 16px 0; color: #f8fafc; }
        .intro { font-size: 15px; color: #94a3b8; line-height: 1.6; margin-bottom: 28px; }
        .otp-box { background: #1e293b; border: 2px dashed #0284c7; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
        .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 800; letter-spacing: 12px; color: #38bdf8; margin: 0; }
        .otp-sub { font-size: 13px; color: #64748b; margin-top: 8px; }
        .warning { background: rgba(245, 158, 11, 0.1); border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 6px; font-size: 13px; color: #fcd34d; margin-top: 24px; }
        .footer { background: #080d1a; padding: 24px; text-align: center; border-top: 1px solid #1e293b; }
        .footer p { margin: 0; font-size: 12px; color: #475569; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="brand">GUSAC</h1>
          <p class="subbrand">GITAM University Science & Activity Center • Visakhapatnam Campus</p>
        </div>
        <div class="content">
          <p class="greeting">Hello ${name || 'Student'},</p>
          <p class="intro">You requested a one-time verification code for <strong>${purpose}</strong> on the GUSAC platform.</p>
          
          <div class="otp-box">
            <h2 class="otp-code">${otpCode}</h2>
            <p class="otp-sub">Valid for the next 10 minutes</p>
          </div>

          <div class="warning">
            ⚠️ Never share this security OTP with anyone. GUSAC staff will never ask for your code.
          </div>
        </div>
        <div class="footer">
          <p>© 2026 GUSAC Visakhapatnam. All rights reserved.</p>
          <p style="margin-top: 4px;">GITAM Deemed to be University, Gandhinagar, Rushikonda, Visakhapatnam, AP 530045</p>
        </div>
      </div>
    </body>
    </html>
  `;

  if (!mailer) {
    console.log(`[MOCK EMAIL] OTP for ${toEmail}: ${otpCode}`);
    return { success: true, mocked: true };
  }

  const result = await mailer.sendMail({
    from: EMAIL_SENDER,
    to: toEmail,
    subject: `${otpCode} is your GUSAC Verification Code`,
    text: `Your GUSAC verification code is: ${otpCode}. Valid for 10 minutes.`,
    html,
  });

  return { success: true, messageId: result.messageId };
}

/**
 * Send Digital Event Pass with embedded QR Code email
 */
export async function sendDigitalPassEmail({ toEmail, userName, registration, event }) {
  const mailer = getTransporter();

  // Generate QR Code data URL
  const qrPayload = JSON.stringify({
    regId: registration.id || registration.reg_id,
    eventId: event.id,
    rollNumber: registration.roll_number || registration.rollNumber || 'N/A',
    sig: registration.signature || registration.id,
  });

  const qrDataUrl = await QRCode.toDataURL(qrPayload, {
    errorCorrectionLevel: 'H',
    width: 280,
    margin: 2,
    color: {
      dark: '#0284c7',
      light: '#ffffff',
    },
  });

  const eventDate = event.date ? new Date(event.date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : 'Scheduled Date';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { margin: 0; padding: 0; background-color: #0b1120; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .container { max-width: 600px; margin: 30px auto; background: #0f172a; border-radius: 16px; border: 1px solid #1e293b; overflow: hidden; }
        .header { background: linear-gradient(135deg, #0284c7 0%, #1e40af 100%); padding: 28px 24px; text-align: center; }
        .brand { color: #ffffff; font-size: 24px; font-weight: 800; margin: 0; }
        .subbrand { color: #93c5fd; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; }
        .pass-card { margin: 24px; background: #1e293b; border-radius: 12px; border: 1px solid #334155; padding: 24px; }
        .event-title { font-size: 22px; font-weight: bold; color: #f8fafc; margin: 0 0 8px 0; }
        .event-category { display: inline-block; background: #0284c7; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
        .meta-grid { margin: 20px 0; border-top: 1px solid #334155; border-bottom: 1px solid #334155; padding: 16px 0; }
        .meta-row { display: flex; justify-content: space-between; margin: 8px 0; font-size: 14px; }
        .meta-label { color: #94a3b8; }
        .meta-value { color: #f1f5f9; font-weight: 600; text-align: right; }
        .qr-section { text-align: center; margin: 24px 0 12px 0; padding: 16px; background: #0f172a; border-radius: 8px; }
        .qr-img { border-radius: 8px; display: inline-block; }
        .qr-caption { font-size: 13px; color: #38bdf8; font-weight: bold; margin-top: 8px; }
        .footer { background: #080d1a; padding: 20px; text-align: center; font-size: 12px; color: #475569; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="brand">GUSAC Visakhapatnam</h1>
          <p class="subbrand">Official Digital Event Pass</p>
        </div>
        <div class="pass-card">
          <span class="event-category">${event.category || 'Tech Event'}</span>
          <h2 class="event-title" style="margin-top: 10px;">${event.title}</h2>
          
          <div class="meta-grid">
            <div class="meta-row">
              <span class="meta-label">Pass Holder:</span>
              <span class="meta-value">${userName}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Registration ID:</span>
              <span class="meta-value">${registration.id || registration.reg_id}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Date & Time:</span>
              <span class="meta-value">${eventDate} • ${event.time || '10:00 AM'}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Campus Venue:</span>
              <span class="meta-value">${event.venue || 'GUSAC Centre, Visakhapatnam'}</span>
            </div>
          </div>

          <div class="qr-section">
            <img class="qr-img" src="${qrDataUrl}" width="200" height="200" alt="Ticket QR Code" />
            <p class="qr-caption">Scan at Entrance for Fast-Track Check-in</p>
          </div>
        </div>
        <div class="footer">
          <p>Please present this digital pass or save it to your phone for gate admission.</p>
          <p>© 2026 GITAM University Science & Activity Center • Visakhapatnam Campus</p>
        </div>
      </div>
    </body>
    </html>
  `;

  if (!mailer) {
    console.log(`[MOCK EMAIL] Digital Pass sent to ${toEmail} for event ${event.title}`);
    return { success: true, mocked: true };
  }

  const result = await mailer.sendMail({
    from: EMAIL_SENDER,
    to: toEmail,
    subject: `🎟️ Pass Confirmed: ${event.title} - GUSAC Visakhapatnam`,
    text: `Your registration for ${event.title} is confirmed! Registration ID: ${registration.id || registration.reg_id}. Venue: ${event.venue || 'GUSAC Centre, Visakhapatnam'}.`,
    html,
  });

  return { success: true, messageId: result.messageId };
}

/**
 * Send Leadership Application Decision Email (Approval / Rejection)
 */
export async function sendLeadershipDecisionEmail({ toEmail, name, requestedRole, targetWing, status, remarks }) {
  const mailer = getTransporter();
  const isApproved = status === 'APPROVED';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { margin: 0; padding: 0; background-color: #0b1120; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .container { max-width: 600px; margin: 30px auto; background: #0f172a; border-radius: 16px; border: 1px solid #1e293b; overflow: hidden; }
        .header { background: ${isApproved ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : 'linear-gradient(135deg, #475569 0%, #334155 100%)'}; padding: 28px 24px; text-align: center; }
        .brand { color: #ffffff; font-size: 24px; font-weight: 800; margin: 0; }
        .subbrand { color: ${isApproved ? '#a7f3d0' : '#cbd5e1'}; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; }
        .content { padding: 32px 28px; color: #f1f5f9; }
        .badge { display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 700; text-transform: uppercase; background: ${isApproved ? '#065f46' : '#374151'}; color: ${isApproved ? '#6ee7b7' : '#9ca3af'}; margin-bottom: 16px; }
        .highlight-box { background: #1e293b; border-left: 4px solid ${isApproved ? '#10b981' : '#64748b'}; padding: 18px 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background: #080d1a; padding: 20px; text-align: center; font-size: 12px; color: #475569; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="brand">GUSAC Visakhapatnam</h1>
          <p class="subbrand">Core Leadership & Governance Board</p>
        </div>
        <div class="content">
          <span class="badge">${isApproved ? '✓ Application Approved' : 'Decision Notice'}</span>
          <h2 style="margin: 0 0 16px 0; color: #f8fafc;">Hello ${name},</h2>
          
          ${isApproved ? `
            <p style="color: #cbd5e1; line-height: 1.6;">
              Congratulations! Following evaluation by the GUSAC Faculty & Executive Committee, your application for <strong>${requestedRole.toUpperCase()}</strong> of the <strong>${targetWing}</strong> wing has been <strong>OFFICIALLY APPROVED</strong>.
            </p>
            <div class="highlight-box">
              <p style="margin: 0; color: #34d399; font-weight: bold;">Role Assigned: ${requestedRole.toUpperCase()}</p>
              <p style="margin: 6px 0 0; color: #94a3b8;">Wing: ${targetWing}</p>
              <p style="margin: 6px 0 0; color: #94a3b8;">Privilege Level: Leadership & Event Management</p>
              ${remarks ? `<p style="margin: 10px 0 0; color: #e2e8f0; font-style: italic;">“${remarks}”</p>` : ''}
            </div>
            <p style="color: #94a3b8; font-size: 14px;">
              You can now sign in to your GUSAC account to access your wing's management tools and project rosters.
            </p>
          ` : `
            <p style="color: #cbd5e1; line-height: 1.6;">
              Thank you for applying for the <strong>${requestedRole}</strong> position in <strong>${targetWing}</strong>. At this time, the leadership committee has moved forward with another candidate for this cycle.
            </p>
            ${remarks ? `
              <div class="highlight-box">
                <p style="margin: 0; color: #94a3b8; font-size: 14px;">Review Remarks:</p>
                <p style="margin: 6px 0 0; color: #e2e8f0; font-style: italic;">“${remarks}”</p>
              </div>
            ` : ''}
            <p style="color: #94a3b8; font-size: 14px;">
              We strongly encourage you to continue actively collaborating on projects and events within GUSAC.
            </p>
          `}
        </div>
        <div class="footer">
          <p>© 2026 GUSAC Visakhapatnam • GITAM Deemed to be University</p>
        </div>
      </div>
    </body>
    </html>
  `;

  if (!mailer) {
    console.log(`[MOCK EMAIL] Leadership Decision for ${toEmail}: ${status}`);
    return { success: true, mocked: true };
  }

  const subject = isApproved
    ? `🎉 Congratulations! Your GUSAC Leadership Application is Approved`
    : `Notice regarding your GUSAC Leadership Application`;

  const result = await mailer.sendMail({
    from: EMAIL_SENDER,
    to: toEmail,
    subject,
    text: `Your GUSAC leadership application for ${requestedRole} in ${targetWing} has been ${status}.`,
    html,
  });

  return { success: true, messageId: result.messageId };
}

