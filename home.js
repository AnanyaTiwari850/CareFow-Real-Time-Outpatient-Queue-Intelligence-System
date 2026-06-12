function goTo(page) {
    window.location.href = page;
    }

    function filterSpecializations() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.spec-card');
    cards.forEach(card => {
        const name = card.querySelector('span').textContent.toLowerCase();
        card.style.display = name.includes(query) ? 'flex' : 'none';
    });
    }