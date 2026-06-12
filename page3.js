// ============================================================
//  PAGE 3 JAVASCRIPT — page3.js  (Supabase Edition)
//  Loads doctor detail from Supabase and populates the page.
// ============================================================

let isFavourited = false;

async function initPage() {
  const params = new URLSearchParams(window.location.search);
  const selectedId = parseInt(params.get('id')) || 1;

  // Fetch doctor from Supabase
  let safeDoc = await window.db.getDoctor(selectedId);
  if (!safeDoc) {
    const docs = await window.db.getDoctors();
    safeDoc = docs[0];
  }
  if (!safeDoc) return;

  // Save for booking page
  localStorage.setItem('selectedDoctor', JSON.stringify({ id: safeDoc.id }));

  // Calculated wait time
  const estimatedWait = safeDoc.patients * safeDoc.avg_time;

  // Populate DOM
  document.getElementById('docEmoji').textContent   = safeDoc.emoji;
  document.getElementById('docName').innerHTML      = safeDoc.name + ' <span class="verified">✔</span>';
  document.getElementById('docDegree').textContent  = safeDoc.degree;
  document.getElementById('docClinic').textContent  = safeDoc.clinic;
  document.getElementById('docSpec').textContent    = safeDoc.spec;
  document.getElementById('docAbout').textContent   = safeDoc.about;
  document.getElementById('docFee').textContent     = '₹' + safeDoc.fee;
  document.getElementById('waitTime').textContent   = estimatedWait + ' mins';
  document.getElementById('patientsWaiting').textContent = safeDoc.patients;
  document.getElementById('avgConsult').textContent = safeDoc.avg_time + ' mins';
  document.getElementById('breadName').textContent  = safeDoc.name;

  // Services list
  const servicesHTML = (safeDoc.services || []).map(s => '<li>' + s + '</li>').join('');
  document.getElementById('servicesList').innerHTML = servicesHTML || '<li>No services listed.</li>';
}

function toggleFav() {
  isFavourited = !isFavourited;
  const favButton = document.getElementById('favBtn');
  if (isFavourited) {
    favButton.textContent = '❤️ Added to Favourites';
    favButton.style.background = '#fce4ec';
  } else {
    favButton.textContent = '🤍 Add to Favourites';
    favButton.style.background = '#ffffff';
  }
}

// Run on load
initPage();
