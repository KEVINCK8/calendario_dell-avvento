// Genera le caselle del calendario
document.addEventListener("DOMContentLoaded", function () {
    const calendarRow = document.querySelector(".calendar-grid .row");
    const today = new Date();
    const year = 2025; // Cambia l'anno se necessario
    const month = 11; // Dicembre (0-based, quindi 11)
    const totalDays = 24;

    for (let day = 1; day <= totalDays; day++) {
        // Data di sblocco: 1 dicembre = day 1, 2 dicembre = day 2, ecc.
        const unlockDate = new Date(year, month, day);
        const isUnlocked =
            today.getFullYear() > year ||
            (today.getFullYear() === year &&
                (today.getMonth() > month ||
                    (today.getMonth() === month && today.getDate() >= day)));

        // Crea colonna Bootstrap
        const col = document.createElement("div");
        col.className = "col-4 col-md-3 col-lg-2";

        // Crea casella
        const dayBox = document.createElement("div");
        dayBox.className = "calendar-day mb-2";

        // Numero del giorno
        const dayNum = document.createElement("div");
        dayNum.className = "day-number";
        dayNum.textContent = day;

        // Bottone per aprire la casella
        const btn = document.createElement("button");
        btn.className = "open-btn";
        btn.textContent = isUnlocked ? "Apri" : "Bloccato";
        btn.disabled = !isUnlocked;
        btn.onclick = function () {
            window.location.href = `/${day}/${day}.html`;
        };

        dayBox.appendChild(dayNum);
        dayBox.appendChild(btn);
        col.appendChild(dayBox);
        calendarRow.appendChild(col);
    }
});
