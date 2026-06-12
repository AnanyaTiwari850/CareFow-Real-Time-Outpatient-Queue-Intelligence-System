// ============================================================
//  PAGE 4 JAVASCRIPT — page4.js  (Supabase Edition)
//  1. Load doctor from Supabase using id saved in localStorage
//  2. Build date picker and time slot buttons
//  3. Validate and confirm booking → saves to Supabase
// ============================================================

const dayNames   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

let selectedDate = null;
let selectedTime = null;
let _doc = null;   // doctor object loaded from Supabase

// ── STEP 1: Load doctor from Supabase ───────────────────────
async function initPage() {
  // Read doctor id saved by page3
  const savedDoctor = localStorage.getItem('selectedDoctor');
  let docId = 1;
  if (savedDoctor) {
    try { docId = JSON.parse(savedDoctor).id; } catch(e) {}
  }

  _doc = await window.db.getDoctor(docId);
  if (!_doc) {
    const docs = await window.db.getDoctors();
    _doc = docs[0];
  }
  if (!_doc) return;

  const estimatedWait = _doc.patients * _doc.avg_time;

  // ── STEP 2: Fill doctor strip at top ──────────────────────
  document.getElementById('stripEmoji').textContent    = _doc.emoji;
  document.getElementById('stripName').textContent     = _doc.name;
  document.getElementById('stripDegree').textContent   = _doc.degree;
  document.getElementById('stripClinic').textContent   = '📍 ' + _doc.clinic;
  document.getElementById('stripWait').textContent     = estimatedWait + ' mins';
  document.getElementById('stripPatients').textContent = _doc.patients;

  // Fill summary card static parts
  document.getElementById('sumDoctor').textContent = _doc.name;
  document.getElementById('sumSpec').textContent   = _doc.spec;
  document.getElementById('sumWait').textContent   = estimatedWait + ' mins';
  document.getElementById('sumFee').textContent    = '₹' + _doc.fee;

  // ── STEP 3: Build date picker ──────────────────────────────
  const dateRow = document.getElementById('dateRow');
  for (let i = 0; i < 5; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dayName  = dayNames[d.getDay()];
    const dateNum  = d.getDate();
    const month    = monthNames[d.getMonth()];
    const fullDate = dayName + ', ' + dateNum + ' ' + month;

    const btn = document.createElement('div');
    btn.className = 'date-btn';
    btn.innerHTML = `
      <span class="date-day">${dayName}</span>
      <span class="date-num">${dateNum}</span>
      <span class="date-month">${month}</span>
    `;

    if (i === 0) {
      btn.classList.add('selected');
      selectedDate = fullDate;
      document.getElementById('sumDate').textContent = fullDate;
    }

    btn.onclick = function () {
      document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedDate = fullDate;
      document.getElementById('sumDate').textContent = fullDate;
    };
    dateRow.appendChild(btn);
  }

  // ── STEP 4: Build time slot buttons ───────────────────────
  const morningTimes  = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];
  const eveningTimes  = ['05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM'];
  const unavailableSlots = ['11:30 AM'];

  function buildSlots(containerID, timesArray) {
    const container = document.getElementById(containerID);
    timesArray.forEach(function (time) {
      const btn = document.createElement('button');
      btn.className   = 'slot-btn';
      btn.textContent = time;
      if (unavailableSlots.includes(time)) {
        btn.classList.add('unavailable');
        btn.disabled = true;
      } else {
        btn.onclick = function () {
          document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          selectedTime = time;
          document.getElementById('sumTime').textContent = time;
        };
      }
      container.appendChild(btn);
    });
  }

  buildSlots('morningSlots', morningTimes);
  buildSlots('eveningSlots', eveningTimes);
}

// ── STEP 5: Confirm Booking ──────────────────────────────────
async function confirmBooking() {
  const name   = document.getElementById('patientName').value.trim();
  const phone  = document.getElementById('patientPhone').value.trim();
  const age    = document.getElementById('patientAge').value.trim();
  const gender = document.getElementById('patientGender').value;

  if (!name)                        { alert('Please enter your full name.');              return; }
  if (!/^\d{10}$/.test(phone))      { alert('Please enter a valid 10-digit phone number.'); return; }
  if (!age)                         { alert('Please enter your age.');                    return; }
  if (!gender)                      { alert('Please select your gender.');                return; }
  if (!selectedTime)                { alert('Please select a time slot.');                return; }

  const confirmBtn = document.querySelector('.btn-confirm');
  confirmBtn.textContent = '⏳ Saving...';
  confirmBtn.disabled    = true;

  try {
    const newBooking = await window.db.addBooking({
      doctorId:      _doc.id,
      patientName:   name,
      patientPhone:  phone,
      patientAge:    age,
      patientGender: gender,
      date:          selectedDate,
      timeSlot:      selectedTime
    });

    document.getElementById('popupMsg').innerHTML =
      '👤 <strong>' + name + '</strong><br>' +
      '🩺 ' + _doc.name + '<br>' +
      '📅 ' + selectedDate + ' at ' + selectedTime + '<br>' +
      '🎫 <strong>Token No: ' + newBooking.token + '</strong><br>' +
      '💰 Fee: ₹' + _doc.fee + '<br><br>' +
      '<span style="color:#00b894; font-weight:700;">See you at the clinic! ✔</span>';

    document.getElementById('popupOverlay').style.display = 'flex';
  } catch (e) {
    alert('Error saving booking: ' + e.message);
    confirmBtn.textContent = '✅ Confirm Booking';
    confirmBtn.disabled    = false;
  }
}

// Start
initPage();
