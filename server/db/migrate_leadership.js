import { query } from './postgres.js';

async function migrate() {
  console.log('Migrating leadership_applications & student users in Supabase PostgreSQL...');
  try {
    // 1. Seed student users if missing
    await query(`
      INSERT INTO users (id, email, first_name, last_name, name, phone, user_type, college_or_company, student_id, role, password_hash, salt, is_verified)
      VALUES 
      ('usr_student_01', 'aarav@gitam.in', 'Aarav', 'Sharma', 'Aarav Sharma', '+91 94401 23456', 'gitam', 'GITAM Institute of Technology, Visakhapatnam', 'VU22CSEN010042', 'student', 'de5eef9b3582f86f808f405cf4b1908d:e6746821f2fef01d6087b6c80c4b80d388aa9a2e613363fbb8e5145c2c5e25e60dd28c5e261f52141d65d92045b9c144b1604a9e2b5d74ff831ed41450868ce1', 'de5eef9b3582f86f808f405cf4b1908d', true),
      ('usr_student_02', 'sneha@gitam.in', 'Sneha', 'Reddy', 'Sneha Reddy', '+91 98480 54321', 'gitam', 'GITAM Institute of Technology, Visakhapatnam', 'VU22ECEN010098', 'student', 'de5eef9b3582f86f808f405cf4b1908d:e6746821f2fef01d6087b6c80c4b80d388aa9a2e613363fbb8e5145c2c5e25e60dd28c5e261f52141d65d92045b9c144b1604a9e2b5d74ff831ed41450868ce1', 'de5eef9b3582f86f808f405cf4b1908d', true)
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log('✅ Student users synced!');

    // 2. Insert leadership applications
    await query(`
      INSERT INTO leadership_applications 
      (id, user_id, name, email, student_id, requested_role, target_wing, statement_of_purpose, status)
      VALUES 
      ('app_lead_01', 'usr_student_01', 'Aarav Sharma', 'aarav@gitam.in', 'VU22CSEN010042', 'coordinator', 'Robotics & Automation', 'Active 3rd-year CSE student with 2 national robotics podiums. Seeking to lead the GUSAC Autonomous Systems wing and mentor juniors.', 'PENDING'),
      ('app_lead_02', 'usr_student_02', 'Sneha Reddy', 'sneha@gitam.in', 'VU22ECEN010098', 'coordinator', 'Internet of Things & Embedded', 'Organized 3 hackathons and deployed smart campus environmental sensors. Applying to coordinate the IoT hardware lab.', 'PENDING')
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log('✅ Seeded initial pending leadership applications!');

    const res = await query(`SELECT COUNT(*) as count FROM leadership_applications`);
    console.log(`✅ Total Leadership Applications in Supabase: ${res.rows[0].count}`);
  } catch (err) {
    console.error('Migration error:', err.message);
  }
}

migrate();
