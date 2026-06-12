// ============================================================
//  CAREFLOW DATABASE LAYER — db.js  (mini_db / Local Edition)
//  All data lives in-memory (seeded) + localStorage for
//  bookings, users and the logged-in session.
//  No internet connection required.
// ============================================================

(function () {

  // ── SEED DATA ─────────────────────────────────────────────

  const SEED_DOCTORS = [
    { id: 1, name: 'Dr. Rahul Sharma',  emoji: '👨‍⚕️', username: 'rahul',  password: '123', degree: 'MBBS, MD (Cardiology)',   clinic: 'City Heart Clinic, Civil Lines',    fee: 600, patients: 4, avg_time: 15, spec: 'Cardiology',  about: 'Dr. Rahul Sharma is a renowned Cardiologist with over 10 years of experience in diagnosing and treating heart-related conditions.', services: ['Angiography','Heart Failure Treatment','Preventive Cardiology','ECG & ECHO'] },
    { id: 2, name: 'Dr. Neha Verma',    emoji: '👩‍⚕️', username: 'neha',   password: '123', degree: 'MBBS, MD (Cardiology)',   clinic: 'HealthPlus Clinic, Shubh Enclave',  fee: 500, patients: 2, avg_time: 15, spec: 'Cardiology',  about: 'Dr. Neha Verma has 7 years of experience in clinical cardiology and cardiac rehabilitation.', services: ['ECG & ECHO','Stress Test','Cardiac Rehabilitation','Hypertension Management'] },
    { id: 3, name: 'Dr. Amit Kumar',    emoji: '👨‍⚕️', username: 'amit',   password: '123', degree: 'MBBS, DM (Cardiology)',   clinic: 'Lifeline Hospital, Sector 9',       fee: 700, patients: 3, avg_time: 15, spec: 'Cardiology',  about: 'Dr. Amit Kumar is a DM-qualified cardiologist with expertise in complex cardiac interventions.', services: ['Coronary Angioplasty','Pacemaker Implantation','Heart Failure Clinic','Preventive Cardiology'] },
    { id: 4, name: 'Dr. Priya Singh',   emoji: '👩‍⚕️', username: 'priya',  password: '123', degree: 'MBBS, MS (Orthopedics)',  clinic: 'Bone & Joint Clinic, MG Road',      fee: 550, patients: 2, avg_time: 15, spec: 'Orthopedics', about: 'Dr. Priya Singh specializes in joint replacement and sports injuries with 8 years of experience.', services: ['Joint Replacement','Sports Injury','Spine Treatment','Fracture Care'] },
    { id: 5, name: 'Dr. Suresh Patel',  emoji: '👨‍⚕️', username: 'suresh', password: '123', degree: 'MBBS, MD (Neurology)',    clinic: 'Neuro Care, Civil Lines',           fee: 800, patients: 3, avg_time: 15, spec: 'Neurology',   about: 'Dr. Suresh Patel is a senior neurologist with expertise in epilepsy, stroke management, and movement disorders.', services: ['EEG','Stroke Management','Epilepsy Treatment','Migraine Clinic'] },
    { id: 6, name: 'Dr. Anjali Mehta',  emoji: '👩‍⚕️', username: 'anjali', password: '123', degree: 'MBBS, MD (Dermatology)', clinic: 'Skin Studio, Hazratganj',            fee: 400, patients: 1, avg_time: 15, spec: 'Dermatology', about: 'Dr. Anjali Mehta is a cosmetic and clinical dermatologist focused on skin conditions, laser therapy, and hair loss.', services: ['Acne Treatment','Laser Therapy','Hair Loss','Skin Allergy'] },
  ];

  const SEED_BOOKINGS = [
    { id: 'CF-B101', doctor_id: 1, patient_name: 'Aarav Mehta',      patient_phone: '9876543210', patient_age: 45, patient_gender: 'Male',   date: 'Today', time_slot: '10:00 AM', fee: 600, status: 'Completed', token: 1 },
    { id: 'CF-B102', doctor_id: 1, patient_name: 'Ishita Roy',        patient_phone: '9823456789', patient_age: 32, patient_gender: 'Female', date: 'Today', time_slot: '10:30 AM', fee: 600, status: 'Completed', token: 2 },
    { id: 'CF-B103', doctor_id: 1, patient_name: 'Karan Johar',       patient_phone: '9123456780', patient_age: 50, patient_gender: 'Male',   date: 'Today', time_slot: '11:00 AM', fee: 600, status: 'Serving',   token: 3 },
    { id: 'CF-B104', doctor_id: 1, patient_name: 'Meera Sen',         patient_phone: '9988776655', patient_age: 28, patient_gender: 'Female', date: 'Today', time_slot: '11:30 AM', fee: 600, status: 'Waiting',   token: 4 },
    { id: 'CF-B105', doctor_id: 1, patient_name: 'Rohan Das',         patient_phone: '9834561290', patient_age: 19, patient_gender: 'Male',   date: 'Today', time_slot: '12:00 PM', fee: 600, status: 'Waiting',   token: 5 },
    { id: 'CF-B201', doctor_id: 2, patient_name: 'Priyanka Roy',      patient_phone: '9876541122', patient_age: 29, patient_gender: 'Female', date: 'Today', time_slot: '10:00 AM', fee: 500, status: 'Completed', token: 1 },
    { id: 'CF-B202', doctor_id: 2, patient_name: 'Abhishek Pal',      patient_phone: '9922883344', patient_age: 35, patient_gender: 'Male',   date: 'Today', time_slot: '10:30 AM', fee: 500, status: 'Serving',   token: 2 },
    { id: 'CF-B203', doctor_id: 2, patient_name: 'Ananya Panday',     patient_phone: '9123450987', patient_age: 24, patient_gender: 'Female', date: 'Today', time_slot: '11:00 AM', fee: 500, status: 'Waiting',   token: 3 },
    { id: 'CF-B301', doctor_id: 3, patient_name: 'Sanjay Dutt',       patient_phone: '9898989898', patient_age: 61, patient_gender: 'Male',   date: 'Today', time_slot: '10:00 AM', fee: 700, status: 'Completed', token: 1 },
    { id: 'CF-B302', doctor_id: 3, patient_name: 'Alia Bhat',         patient_phone: '9786543210', patient_age: 29, patient_gender: 'Female', date: 'Today', time_slot: '10:30 AM', fee: 700, status: 'Serving',   token: 2 },
    { id: 'CF-B303', doctor_id: 3, patient_name: 'Ranbir Kapoor',     patient_phone: '9112233445', patient_age: 39, patient_gender: 'Male',   date: 'Today', time_slot: '11:00 AM', fee: 700, status: 'Waiting',   token: 3 },
    { id: 'CF-B401', doctor_id: 4, patient_name: 'Rahul Dravid',      patient_phone: '9876543201', patient_age: 49, patient_gender: 'Male',   date: 'Today', time_slot: '10:00 AM', fee: 550, status: 'Serving',   token: 1 },
    { id: 'CF-B402', doctor_id: 4, patient_name: 'Saina Nehwal',      patient_phone: '9823450912', patient_age: 32, patient_gender: 'Female', date: 'Today', time_slot: '10:30 AM', fee: 550, status: 'Waiting',   token: 2 },
    { id: 'CF-B501', doctor_id: 5, patient_name: 'Sachin Tendulkar',  patient_phone: '9898009898', patient_age: 49, patient_gender: 'Male',   date: 'Today', time_slot: '10:00 AM', fee: 800, status: 'Completed', token: 1 },
    { id: 'CF-B502', doctor_id: 5, patient_name: 'M.S. Dhoni',        patient_phone: '9777777777', patient_age: 40, patient_gender: 'Male',   date: 'Today', time_slot: '10:30 AM', fee: 800, status: 'Serving',   token: 2 },
    { id: 'CF-B503', doctor_id: 5, patient_name: 'Kapil Dev',         patient_phone: '9102938475', patient_age: 63, patient_gender: 'Male',   date: 'Today', time_slot: '11:00 AM', fee: 800, status: 'Waiting',   token: 3 },
    { id: 'CF-B601', doctor_id: 6, patient_name: 'Katrina Kaif',      patient_phone: '9988775544', patient_age: 38, patient_gender: 'Female', date: 'Today', time_slot: '10:00 AM', fee: 400, status: 'Serving',   token: 1 },
    { id: 'CF-B602', doctor_id: 6, patient_name: 'Vicky Kaushal',     patient_phone: '9878654312', patient_age: 34, patient_gender: 'Male',   date: 'Today', time_slot: '10:30 AM', fee: 400, status: 'Waiting',   token: 2 },
  ];

  // ── In-memory state (loaded once, mutated in RAM + localStorage) ──

  // Doctors: always start from seed (runtime mutations stay in RAM)
  const _doctors = SEED_DOCTORS.map(d => Object.assign({}, d));

  // Bookings: persist across page refreshes via localStorage
  function _loadBookings() {
    try {
      const stored = localStorage.getItem('cf_bookings');
      return stored ? JSON.parse(stored) : SEED_BOOKINGS.map(b => Object.assign({}, b));
    } catch { return SEED_BOOKINGS.map(b => Object.assign({}, b)); }
  }
  function _saveBookings(bookings) {
    try { localStorage.setItem('cf_bookings', JSON.stringify(bookings)); } catch {}
  }

  // Users: persist via localStorage
  function _loadUsers() {
    try {
      const stored = localStorage.getItem('cf_users');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  }
  function _saveUsers(users) {
    try { localStorage.setItem('cf_users', JSON.stringify(users)); } catch {}
  }

  // ── Helpers ─────────────────────────────────────────────────

  function _findDoctor(id) {
    return _doctors.find(d => d.id === parseInt(id)) || null;
  }

  function _mapBooking(b) {
    if (!b) return null;
    return {
      id:            b.id,
      doctorId:      b.doctor_id,
      patientName:   b.patient_name,
      patientPhone:  b.patient_phone,
      patientAge:    b.patient_age,
      patientGender: b.patient_gender,
      date:          b.date,
      timeSlot:      b.time_slot,
      fee:           b.fee,
      status:        b.status,
      token:         b.token
    };
  }

  // Wrap all methods to return resolved Promises so call-sites
  // can use await just like before (API-compatible with Supabase version).

  const db = {

    // ── DOCTORS ───────────────────────────────────────────────

    getDoctors: async function () {
      return _doctors.slice().sort((a, b) => a.id - b.id);
    },

    getDoctor: async function (id) {
      return _findDoctor(id);
    },

    updateDoctorQueue: async function (doctorId, count, avgTime) {
      const doc = _findDoctor(doctorId);
      if (!doc) return null;
      doc.patients = Math.max(0, parseInt(count));
      if (avgTime !== undefined) doc.avg_time = Math.max(1, parseInt(avgTime));
      return Object.assign({}, doc);
    },

    // ── BOOKINGS ──────────────────────────────────────────────

    getBookings: async function () {
      return _loadBookings().sort((a, b) => a.token - b.token).map(_mapBooking);
    },

    getBookingsByDoctor: async function (doctorId) {
      const bookings = _loadBookings();
      return bookings
        .filter(b => b.doctor_id === parseInt(doctorId))
        .sort((a, b) => a.token - b.token)
        .map(_mapBooking);
    },

    addBooking: async function (bookingData) {
      const doc = _findDoctor(bookingData.doctorId);
      if (!doc) throw new Error('Doctor not found');

      const bookings = _loadBookings();
      const doctorBookings = bookings.filter(b => b.doctor_id === parseInt(bookingData.doctorId));
      const newToken = doctorBookings.length + 1;
      const newId = 'CF-B' + Date.now();

      const row = {
        id:             newId,
        doctor_id:      parseInt(bookingData.doctorId),
        patient_name:   bookingData.patientName,
        patient_phone:  bookingData.patientPhone,
        patient_age:    parseInt(bookingData.patientAge),
        patient_gender: bookingData.patientGender,
        date:           bookingData.date,
        time_slot:      bookingData.timeSlot,
        fee:            doc.fee,
        status:         'Waiting',
        token:          newToken
      };

      bookings.push(row);
      _saveBookings(bookings);

      // Update doctor patient count in RAM
      doc.patients = Math.max(0, doc.patients) + 1;

      return _mapBooking(row);
    },

    updateBookingStatus: async function (bookingId, newStatus) {
      const bookings = _loadBookings();
      const idx = bookings.findIndex(b => b.id === bookingId);
      if (idx === -1) return null;

      const oldStatus = bookings[idx].status;
      bookings[idx].status = newStatus;
      _saveBookings(bookings);

      // Adjust doctor patient count in RAM
      const isActive = s => s === 'Waiting' || s === 'Serving';
      const isClosed = s => s === 'Completed' || s === 'Cancelled';
      const doc = _findDoctor(bookings[idx].doctor_id);
      if (doc) {
        if (isActive(oldStatus) && isClosed(newStatus)) doc.patients = Math.max(0, doc.patients - 1);
        if (isClosed(oldStatus) && isActive(newStatus)) doc.patients = doc.patients + 1;
      }

      return _mapBooking(bookings[idx]);
    },

    // ── DOCTOR AUTH ───────────────────────────────────────────

    loginDoctor: async function (username, password) {
      const doc = _doctors.find(
        d => d.username === username.trim().toLowerCase() && d.password === password
      );
      if (!doc) return null;
      localStorage.setItem('cf_logged_in_doctor_id', doc.id);
      return Object.assign({}, doc);
    },

    getLoggedInDoctor: async function () {
      const id = localStorage.getItem('cf_logged_in_doctor_id');
      if (!id) return null;
      return _findDoctor(id);
    },

    logoutDoctor: function () {
      localStorage.removeItem('cf_logged_in_doctor_id');
    },

    // ── PATIENT / USER AUTH ───────────────────────────────────

    signupUser: async function (userData) {
      const users = _loadUsers();

      if (users.find(u => u.username === userData.username)) {
        return { success: false, error: 'Username already taken. Please choose another.' };
      }
      if (users.find(u => u.email === userData.email)) {
        return { success: false, error: 'An account with this email already exists.' };
      }

      const newUser = Object.assign({ id: Date.now(), created_at: new Date().toISOString() }, userData);
      users.push(newUser);
      _saveUsers(users);
      return { success: true, user: newUser };
    },

    loginUser: async function (username, password) {
      const users = _loadUsers();
      const user = users.find(
        u => u.username === username.trim().toLowerCase() && u.password === password
      );
      if (!user) return null;
      localStorage.setItem('cf_logged_in_user_id', user.id);
      return Object.assign({}, user);
    },

    getLoggedInUser: async function () {
      const id = localStorage.getItem('cf_logged_in_user_id');
      if (!id) return null;
      const users = _loadUsers();
      return users.find(u => String(u.id) === String(id)) || null;
    },

    logoutUser: function () {
      localStorage.removeItem('cf_logged_in_user_id');
    }
  };

  // Export globally
  window.db = db;
})();
