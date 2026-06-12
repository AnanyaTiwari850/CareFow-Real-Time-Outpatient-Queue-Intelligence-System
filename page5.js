// ============================================================
//  PAGE 5 JAVASCRIPT — page5.js  (Supabase Edition)
//  Doctor Dashboard — reads live data from Supabase
// ============================================================

(function () {

  let _doc = null;
  let tempWaitingCount = 0;

  // ── INIT ────────────────────────────────────────────────────
  async function init() {
    // Auth guard — get logged-in doctor from Supabase
    _doc = await window.db.getLoggedInDoctor();

    if (!_doc) {
      window.location.href = "login.html";
      return;
    }

    tempWaitingCount = _doc.patients;

    // Populate header & sidebar
    document.getElementById('doctorNameTop').textContent = _doc.name;
    document.getElementById('queueCounter').textContent  = tempWaitingCount;

    const avgTimeSelect = document.getElementById('avgTimeSelect');
    if (avgTimeSelect) avgTimeSelect.value = _doc.avg_time.toString();

    // Profile section
    document.getElementById('profileName').textContent   = _doc.name;
    document.getElementById('profileDegree').textContent = _doc.degree;
    document.getElementById('profileClinic').textContent = '📍 ' + _doc.clinic;

    const profileCard = document.querySelector('.profile-card');
    if (profileCard) {
      const avatarDiv = profileCard.querySelector('.profile-big-avatar');
      if (avatarDiv) avatarDiv.textContent = _doc.emoji;

      const statsDiv = profileCard.querySelector('.profile-stats');
      if (statsDiv) {
        statsDiv.innerHTML = `
          <div class="pstat"><div class="pstat-num">4.8 ⭐</div><div class="pstat-label">Rating</div></div>
          <div class="pstat"><div class="pstat-num">10+ Years</div><div class="pstat-label">Exp.</div></div>
          <div class="pstat"><div class="pstat-num">₹${_doc.fee}</div><div class="pstat-label">Fee</div></div>
        `;
      }
    }

    await refreshData();
  }

  // ── TAB NAVIGATION ──────────────────────────────────────────
  window.showSection = function (sectionId) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

    const targetSection = document.getElementById(`section-${sectionId}`);
    if (targetSection) targetSection.classList.remove('hidden');

    const targetNav = document.getElementById(`nav-${sectionId}`);
    if (targetNav) targetNav.classList.add('active');

    const titleMap = {
      'dashboard':    'Dashboard',
      'queue':        "Today's Queue",
      'appointments': "Appointments",
      'profile':      "Profile"
    };
    document.getElementById('sectionTitle').textContent = titleMap[sectionId] || 'Dashboard';

    refreshData();
  };

  // ── QUEUE COUNTER CONTROLS ───────────────────────────────────
  window.increaseQueue = function () {
    tempWaitingCount++;
    document.getElementById('queueCounter').textContent = tempWaitingCount;
  };

  window.decreaseQueue = function () {
    if (tempWaitingCount > 0) {
      tempWaitingCount--;
      document.getElementById('queueCounter').textContent = tempWaitingCount;
    }
  };

  window.saveQueue = async function () {
    const avgTimeVal = parseInt(document.getElementById('avgTimeSelect').value);
    await window.db.updateDoctorQueue(_doc.id, tempWaitingCount, avgTimeVal);

    // Refresh local doctor state
    _doc = await window.db.getDoctor(_doc.id);
    tempWaitingCount = _doc.patients;

    alert("Queue updated successfully!");
    await refreshData();
  };

  // ── RENDER DATA ──────────────────────────────────────────────
  async function refreshData() {
    const freshDoc = await window.db.getDoctor(_doc.id);
    const bookings = await window.db.getBookingsByDoctor(_doc.id);

    // Dashboard stat cards
    const completedBookings = bookings.filter(b => b.status === "Completed");
    document.getElementById('totalPatients').textContent = bookings.length;
    document.getElementById('dashWaiting').textContent   = freshDoc.patients;
    document.getElementById('dashCompleted').textContent = completedBookings.length;
    document.getElementById('dashAvgTime').textContent   = freshDoc.avg_time + " mins";
    document.getElementById('queueCounter').textContent  = tempWaitingCount;

    // Active queue table (Dashboard)
    const activeList   = bookings.filter(b => b.status === "Waiting" || b.status === "Serving");
    const queueTBody   = document.getElementById('queueTableBody');

    if (activeList.length === 0) {
      queueTBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#888;">No active patients in queue.</td></tr>`;
    } else {
      // Ensure Actions header exists
      const tableHead = document.querySelector('.queue-table thead tr');
      if (tableHead && tableHead.children.length === 5) {
        const th = document.createElement('th');
        th.textContent   = 'Actions';
        th.style.textAlign = 'right';
        tableHead.appendChild(th);
      }

      queueTBody.innerHTML = activeList.map((b, index) => {
        const estWait     = index * freshDoc.avg_time;
        const statusClass = b.status === "Serving" ? "status-progress" : "status-waiting";
        const statusText  = b.status === "Serving" ? "Serving" : "Waiting";

        let actionsHTML = '';
        if (b.status === "Waiting") {
          actionsHTML = `<button onclick="changeStatus('${b.id}','Serving')" style="background:#1565c0;color:#fff;border:none;padding:4px 8px;border-radius:4px;font-size:11px;cursor:pointer;margin-right:4px;">🩺 Serve</button>`;
        } else if (b.status === "Serving") {
          actionsHTML = `<button onclick="changeStatus('${b.id}','Completed')" style="background:#00b894;color:#fff;border:none;padding:4px 8px;border-radius:4px;font-size:11px;cursor:pointer;margin-right:4px;">✅ Complete</button>`;
        }
        actionsHTML += `<button onclick="changeStatus('${b.id}','Cancelled')" style="background:#ff8a80;color:#fff;border:none;padding:4px 8px;border-radius:4px;font-size:11px;cursor:pointer;">❌ Cancel</button>`;

        return `
          <tr>
            <td>${index + 1}</td>
            <td><strong>${b.patientName}</strong> (${b.patientAge} yrs, ${b.patientGender})</td>
            <td>Token #${b.token}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>${b.status === "Serving" ? "Now" : estWait + " mins"}</td>
            <td style="text-align:right;">${actionsHTML}</td>
          </tr>
        `;
      }).join('');
    }

    // Full queue table (Today's Queue section)
    const fullQueueBody = document.getElementById('fullQueueBody');
    if (fullQueueBody) {
      if (bookings.length === 0) {
        fullQueueBody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#888;">No appointments scheduled for today.</td></tr>`;
      } else {
        fullQueueBody.innerHTML = bookings.map((b, index) => {
          let statusClass = "status-waiting";
          if (b.status === "Serving")   statusClass = "status-progress";
          if (b.status === "Completed") statusClass = "status-completed";
          if (b.status === "Cancelled") statusClass = "status-completed";
          return `
            <tr>
              <td>${index + 1}</td>
              <td><strong>${b.patientName}</strong> (${b.patientAge} yrs, ${b.patientGender})</td>
              <td>Token #${b.token}</td>
              <td>${b.timeSlot}</td>
              <td><span class="status-badge ${statusClass}">${b.status}</span></td>
            </tr>
          `;
        }).join('');
      }
    }

    // Appointments section
    const apptList = document.getElementById('apptList');
    if (apptList) {
      if (bookings.length === 0) {
        apptList.innerHTML = `<div style="text-align:center;padding:20px;color:#888;">No appointments found.</div>`;
      } else {
        apptList.innerHTML = bookings.map(b => {
          const sc = b.status === 'Serving'   ? 'status-progress'  :
                     b.status === 'Completed' ? 'status-completed' : 'status-waiting';
          return `
            <div class="appt-item">
              <div class="appt-time">${b.timeSlot}</div>
              <div class="appt-name">${b.patientName}
                <span style="font-weight:normal;color:#666;font-size:12px;">
                  (${b.patientAge} yrs, ${b.patientGender}) — Phone: ${b.patientPhone}
                </span>
              </div>
              <div class="appt-type"><span class="status-badge ${sc}">${b.status}</span></div>
            </div>
          `;
        }).join('');
      }
    }
  }

  // ── CHANGE STATUS ────────────────────────────────────────────
  window.changeStatus = async function (bookingId, status) {
    if (confirm(`Are you sure you want to change patient status to "${status}"?`)) {
      await window.db.updateBookingStatus(bookingId, status);

      // Sync local waiting count
      const freshDoc = await window.db.getDoctor(_doc.id);
      tempWaitingCount = freshDoc.patients;

      await refreshData();
    }
  };

  // ── LOGOUT ───────────────────────────────────────────────────
  window.logout = function () {
    if (confirm("Are you sure you want to logout?")) {
      window.db.logoutDoctor();
      window.location.href = "login.html";
    }
  };

  // ── START ────────────────────────────────────────────────────
  init();

})();
