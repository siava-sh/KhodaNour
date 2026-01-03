// Memorial Scrolling Subtitle Timer
const deathDate = new Date('2022-10-02T00:00:00');

function updateMemorialTicker() {
  const now = new Date();
  const diffMs = now - deathDate;

  const seconds = Math.floor(diffMs / 1000) % 60;
  const minutes = Math.floor(diffMs / (1000 * 60)) % 60;
  const hours = Math.floor(diffMs / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Calculate years and months
  let years = now.getFullYear() - deathDate.getFullYear();
  let months = now.getMonth() - deathDate.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }
  // Adjust days more accurately
  const dayDiff = now.getDate() - deathDate.getDate();
  if (dayDiff < 0) {
    months--;
    if (months < 0) {
      years--;
      months += 12;
    }
  }

  const text = `In Memory of KhodaNour - Died: October 2, 2022 • Time passed: ${years} years, ${months} months, ${days} days, ` +
               `${hours.toString().padStart(2, '0')} hours, ${minutes.toString().padStart(2, '0')} minutes, ` +
               `${seconds.toString().padStart(2, '0')} seconds`;

  const tickerText = document.getElementById('ticker-text');
  const tickerDupe = document.getElementById('ticker-text-dupe');
  if (tickerText && tickerDupe) {
    tickerText.textContent = text + "     •     ";
    tickerDupe.textContent = text + "     •     "; // Duplicate for seamless loop
  }
}

// Update immediately and every second
updateMemorialTicker();
setInterval(updateMemorialTicker, 1000);