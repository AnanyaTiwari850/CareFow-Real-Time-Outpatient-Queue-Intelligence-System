-- ============================================================
--  CAREFLOW — Supabase Database Schema
--  Run this entire file in the Supabase SQL Editor
-- ============================================================

-- ── 1. DOCTORS TABLE ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS doctors (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  emoji       TEXT DEFAULT '👨‍⚕️',
  username    TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  degree      TEXT,
  clinic      TEXT,
  fee         INTEGER DEFAULT 0,
  patients    INTEGER DEFAULT 0,
  avg_time    INTEGER DEFAULT 15,
  spec        TEXT,
  about       TEXT,
  services    TEXT[] DEFAULT '{}'
);

-- ── 2. BOOKINGS TABLE ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id              TEXT PRIMARY KEY,
  doctor_id       INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
  patient_name    TEXT NOT NULL,
  patient_phone   TEXT,
  patient_age     INTEGER,
  patient_gender  TEXT,
  date            TEXT,
  time_slot       TEXT,
  fee             INTEGER DEFAULT 0,
  status          TEXT DEFAULT 'Waiting',
  token           INTEGER DEFAULT 1,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. INDEXES for faster queries ───────────────────────────
CREATE INDEX IF NOT EXISTS idx_bookings_doctor_id ON bookings(doctor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- ── 4. ROW LEVEL SECURITY (RLS) ─────────────────────────────
-- Allow public read/write for now (you can restrict later)
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first to avoid duplicate errors
DROP POLICY IF EXISTS "Allow all on doctors" ON doctors;
DROP POLICY IF EXISTS "Allow all on bookings" ON bookings;

CREATE POLICY "Allow all on doctors" ON doctors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on bookings" ON bookings FOR ALL USING (true) WITH CHECK (true);

-- ── 5. SEED INITIAL DOCTOR DATA ─────────────────────────────
INSERT INTO doctors (id, name, emoji, username, password, degree, clinic, fee, patients, avg_time, spec, about, services)
VALUES
  (1, 'Dr. Rahul Sharma',  '👨‍⚕️', 'rahul',  '123', 'MBBS, MD (Cardiology)',   'City Heart Clinic, Civil Lines',    600, 4, 15, 'Cardiology',    'Dr. Rahul Sharma is a renowned Cardiologist with over 10 years of experience in diagnosing and treating heart-related conditions. Specializes in preventive cardiology and interventional procedures.', ARRAY['Angiography','Heart Failure Treatment','Preventive Cardiology','ECG & ECHO']),
  (2, 'Dr. Neha Verma',    '👩‍⚕️', 'neha',   '123', 'MBBS, MD (Cardiology)',   'HealthPlus Clinic, Shubh Enclave',  500, 2, 15, 'Cardiology',    'Dr. Neha Verma has 7 years of experience in clinical cardiology and cardiac rehabilitation. Known for her empathetic consultations and accurate diagnostics.', ARRAY['ECG & ECHO','Stress Test','Cardiac Rehabilitation','Hypertension Management']),
  (3, 'Dr. Amit Kumar',    '👨‍⚕️', 'amit',   '123', 'MBBS, DM (Cardiology)',   'Lifeline Hospital, Sector 9',       700, 3, 15, 'Cardiology',    'Dr. Amit Kumar is a DM-qualified cardiologist with expertise in complex cardiac interventions. Over 15 years of experience in both government and private hospitals.', ARRAY['Coronary Angioplasty','Pacemaker Implantation','Heart Failure Clinic','Preventive Cardiology']),
  (4, 'Dr. Priya Singh',   '👩‍⚕️', 'priya',  '123', 'MBBS, MS (Orthopedics)',  'Bone & Joint Clinic, MG Road',      550, 2, 15, 'Orthopedics',   'Dr. Priya Singh specializes in joint replacement and sports injuries with 8 years of orthopedic expertise.', ARRAY['Joint Replacement','Sports Injury','Spine Treatment','Fracture Care']),
  (5, 'Dr. Suresh Patel',  '👨‍⚕️', 'suresh', '123', 'MBBS, MD (Neurology)',    'Neuro Care, Civil Lines',           800, 3, 15, 'Neurology',     'Dr. Suresh Patel is a senior neurologist with expertise in epilepsy, stroke management, and movement disorders.', ARRAY['EEG','Stroke Management','Epilepsy Treatment','Migraine Clinic']),
  (6, 'Dr. Anjali Mehta',  '👩‍⚕️', 'anjali', '123', 'MBBS, MD (Dermatology)', 'Skin Studio, Hazratganj',            400, 1, 15, 'Dermatology',   'Dr. Anjali Mehta is a cosmetic and clinical dermatologist with a focus on skin conditions, laser therapy, and hair loss treatments.', ARRAY['Acne Treatment','Laser Therapy','Hair Loss','Skin Allergy'])
ON CONFLICT (id) DO NOTHING;

-- Reset serial sequence after manual ID inserts
SELECT setval('doctors_id_seq', (SELECT MAX(id) FROM doctors));

-- ── 6. SEED INITIAL BOOKINGS DATA ───────────────────────────
INSERT INTO bookings (id, doctor_id, patient_name, patient_phone, patient_age, patient_gender, date, time_slot, fee, status, token)
VALUES
  -- Dr. Rahul Sharma
  ('CF-B101', 1, 'Aarav Mehta',       '9876543210', 45, 'Male',   'Today', '10:00 AM', 600, 'Completed', 1),
  ('CF-B102', 1, 'Ishita Roy',        '9823456789', 32, 'Female', 'Today', '10:30 AM', 600, 'Completed', 2),
  ('CF-B103', 1, 'Karan Johar',       '9123456780', 50, 'Male',   'Today', '11:00 AM', 600, 'Serving',   3),
  ('CF-B104', 1, 'Meera Sen',         '9988776655', 28, 'Female', 'Today', '11:30 AM', 600, 'Waiting',   4),
  ('CF-B105', 1, 'Rohan Das',         '9834561290', 19, 'Male',   'Today', '12:00 PM', 600, 'Waiting',   5),
  ('CF-B106', 1, 'Sanjana Roy',       '9001122334', 62, 'Female', 'Today', '12:30 PM', 600, 'Waiting',   6),
  ('CF-B107', 1, 'Vikram Seth',       '8899001122', 38, 'Male',   'Today', '01:00 PM', 600, 'Waiting',   7),
  -- Dr. Neha Verma
  ('CF-B201', 2, 'Priyanka Roy',      '9876541122', 29, 'Female', 'Today', '10:00 AM', 500, 'Completed', 1),
  ('CF-B202', 2, 'Abhishek Pal',      '9922883344', 35, 'Male',   'Today', '10:30 AM', 500, 'Serving',   2),
  ('CF-B203', 2, 'Ananya Panday',     '9123450987', 24, 'Female', 'Today', '11:00 AM', 500, 'Waiting',   3),
  ('CF-B204', 2, 'Kabir Singh',       '9878901234', 31, 'Male',   'Today', '11:30 AM', 500, 'Waiting',   4),
  -- Dr. Amit Kumar
  ('CF-B301', 3, 'Sanjay Dutt',       '9898989898', 61, 'Male',   'Today', '10:00 AM', 700, 'Completed', 1),
  ('CF-B302', 3, 'Alia Bhat',         '9786543210', 29, 'Female', 'Today', '10:30 AM', 700, 'Serving',   2),
  ('CF-B303', 3, 'Ranbir Kapoor',     '9112233445', 39, 'Male',   'Today', '11:00 AM', 700, 'Waiting',   3),
  ('CF-B304', 3, 'Deepika Padukone',  '9998887776', 36, 'Female', 'Today', '11:30 AM', 700, 'Waiting',   4),
  ('CF-B305', 3, 'Ranveer Singh',     '9665544332', 37, 'Male',   'Today', '12:00 PM', 700, 'Waiting',   5),
  -- Dr. Priya Singh
  ('CF-B401', 4, 'Rahul Dravid',      '9876543201', 49, 'Male',   'Today', '10:00 AM', 550, 'Serving',   1),
  ('CF-B402', 4, 'Saina Nehwal',      '9823450912', 32, 'Female', 'Today', '10:30 AM', 550, 'Waiting',   2),
  ('CF-B403', 4, 'Virat Kohli',       '9182736450', 33, 'Male',   'Today', '11:00 AM', 550, 'Waiting',   3),
  -- Dr. Suresh Patel
  ('CF-B501', 5, 'Sachin Tendulkar',  '9898009898', 49, 'Male',   'Today', '10:00 AM', 800, 'Completed', 1),
  ('CF-B502', 5, 'M.S. Dhoni',        '9777777777', 40, 'Male',   'Today', '10:30 AM', 800, 'Serving',   2),
  ('CF-B503', 5, 'Kapil Dev',         '9102938475', 63, 'Male',   'Today', '11:00 AM', 800, 'Waiting',   3),
  ('CF-B504', 5, 'Mithali Raj',       '9900990099', 39, 'Female', 'Today', '11:30 AM', 800, 'Waiting',   4),
  ('CF-B505', 5, 'Sunil Gavaskar',    '8887776665', 72, 'Male',   'Today', '12:00 PM', 800, 'Waiting',   5),
  -- Dr. Anjali Mehta
  ('CF-B601', 6, 'Katrina Kaif',      '9988775544', 38, 'Female', 'Today', '10:00 AM', 400, 'Serving',   1),
  ('CF-B602', 6, 'Vicky Kaushal',     '9878654312', 34, 'Male',   'Today', '10:30 AM', 400, 'Waiting',   2)
ON CONFLICT (id) DO NOTHING;

-- ── 7. PATIENT USERS TABLE ──────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  full_name   TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  phone       TEXT,
  age         INTEGER,
  gender      TEXT,
  blood_group TEXT,
  city        TEXT,
  username    TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast username / email lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email    ON users(email);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all on users" ON users;
CREATE POLICY "Allow all on users" ON users FOR ALL USING (true) WITH CHECK (true);

