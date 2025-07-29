function updateClock() {
    const now = new Date();
    let h = now.getHours();
    let m = String(now.getMinutes()).padStart(2, '0'); // add 0 if less than 10
    let ampm = h >= 12 ? 'P<br>M' : 'A<br>M';
    h = h % 12; // convert to 12-hour format
    if (h === 0) h = 12; // show 12 instead of 0
    h = String(h).padStart(2, '0');
    let formatted = `${h}:${m}`;
    document.getElementById('clock').innerHTML = `<h1> ${formatted} </h1> <p> ${ampm} </p>`;
}
setInterval(updateClock, 1000);
updateClock();