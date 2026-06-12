// ============================================================
//  DOCTORS.JS — (Supabase Edition)
//  Loads doctors from Supabase, filters by specialization,
//  renders cards with live queue data.
// ============================================================

async function initDoctorsPage() {
  // Read specialization from URL
  const params = new URLSearchParams(window.location.search);
  const spec = params.get('spec') || 'Cardiology';
  document.getElementById('specLabel').textContent = spec;
  document.getElementById('pageTitle').textContent = spec + ' Doctors near you';

  // Show loading state
  document.getElementById('cardsContainer').innerHTML =
    '<div style="text-align:center;padding:40px;color:#10b981;font-size:16px;">⏳ Loading doctors...</div>';

  // Fetch from Supabase
  const doctors = await window.db.getDoctors();

  // Filter by spec (fallback: show all)
  let filtered = doctors.filter(d => d.spec === spec);
  if (filtered.length === 0) filtered = doctors;

  renderCards(filtered);

  // Make sortDoctors work globally
  window._filteredDoctors = filtered;
}

function waitTime(d) { return d.patients * d.avg_time; }

function waitColor(mins) {
  if (mins <= 15) return '#00b894';
  if (mins <= 35) return '#f39c12';
  return '#e74c3c';
}
function waitPct(mins) { return Math.min(100, (mins / 60) * 100); }

function renderCards(list) {
  const container = document.getElementById('cardsContainer');
  if (list.length === 0) {
    container.innerHTML = '<div class="no-results">No doctors found for this specialization.</div>';
    return;
  }
  container.innerHTML = list.map(d => {
    const wait  = waitTime(d);
    const color = waitColor(wait);
    const pct   = waitPct(wait);
    return `
      <div class="doctor-card">
        <div class="avatar">${d.emoji}</div>
        <div class="doc-info">
          <div class="doc-name">${d.name} <span class="verified">✔</span></div>
          <div class="doc-degree">${d.degree}</div>
          <div class="doc-location">📍 ${d.clinic}</div>
          <div class="doc-fee">₹${d.fee} <span>Consultation Fee</span></div>
          <div class="wait-bar-wrap">
            <div class="wait-bar-label">Queue load</div>
            <div class="wait-bar-bg"><div class="wait-bar-fill" style="width:${pct}%;background:${color}"></div></div>
          </div>
        </div>
        <div class="queue-info">
          <div class="badge patients">👥 ${d.patients} Waiting</div>
          <div class="badge wait">⏱ ${wait} mins Est.</div>
        </div>
        <a class="btn-view" href="page3.html?id=${d.id}">View Profile</a>
      </div>
    `;
  }).join('');
}

function sortDoctors(by) {
  const sorted = [...(window._filteredDoctors || [])];
  if (by === 'wait')     sorted.sort((a,b) => waitTime(a) - waitTime(b));
  if (by === 'fee')      sorted.sort((a,b) => a.fee - b.fee);
  if (by === 'patients') sorted.sort((a,b) => a.patients - b.patients);
  renderCards(sorted);
}

// Start
initDoctorsPage();