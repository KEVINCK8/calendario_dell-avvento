
// Lista delle parole e domande
const crosswordData = [
    { word: "RONALDO", question: "Il mio giocatore preferito?" },
    { word: "PARIGI", question: "Capitale della Francia?" },
    { word: "SCARPE", question: "Indumento preferito da Kevin?" },
    { word: "JURASSICPARK", question: "Il mio film preferito?(DINOSAURI)" },
    { word: "REDBULL", question: "La mia bibita preferita?" },
    { word: "VERONICA", question: "Il nome della mia fidanzata?" },
    { word: "FOOTBALL", question: "Calcio in inglese?" }
];

let answers = Array(crosswordData.length).fill("");
let selectedWordIdx = null;

// Render lista di parole
function renderWords() {
    const area = document.getElementById("words-list");
    area.innerHTML = "";
    crosswordData.forEach((item, idx) => {
        const row = document.createElement("div");
        row.className = "word-row";
        for (let i = 0; i < item.word.length; i++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            if (answers[idx]) {
                cell.textContent = answers[idx][i];
                cell.classList.add("filled");
            } else {
                cell.textContent = "";
                cell.onclick = () => selectWord(idx);
            }
            if (selectedWordIdx === idx) cell.classList.add("active");
            row.appendChild(cell);
        }
        area.appendChild(row);
    });
}

// Seleziona parola e mostra domanda
function selectWord(idx) {
    selectedWordIdx = idx;
    document.getElementById("question-text").textContent = crosswordData[idx].question;
    document.getElementById("input-area").style.display = "flex";
    document.getElementById("answer-input").value = "";
    document.getElementById("answer-input").focus();
    renderWords();
}

// Gestione invio risposta
document.getElementById("submit-answer").onclick = submitAnswer;
document.getElementById("answer-input").addEventListener("keydown", function(e) {
    if (e.key === "Enter") submitAnswer();
});

function submitAnswer() {
    if (selectedWordIdx === null) return;
    const input = document.getElementById("answer-input").value.trim().toUpperCase();
    const solution = crosswordData[selectedWordIdx].word.toUpperCase();
    if (input === solution) {
        answers[selectedWordIdx] = solution;
        document.getElementById("input-area").style.display = "none";
        document.getElementById("question-text").textContent = "Brava! Parola completata!";
        setTimeout(() => {
            document.getElementById("question-text").textContent = "Clicca su una parola per continuare!";
        }, 1200);
        selectedWordIdx = null;
        // Check fine gioco
        if (answers.every((ans, i) => ans === crosswordData[i].word.toUpperCase())) {
            setTimeout(showFinalPopup, 1500);
        }
    } else {
        document.getElementById("answer-input").value = "";
        document.getElementById("answer-input").placeholder = "Riprova!";
        document.getElementById("question-text").textContent = "Ops! Risposta sbagliata!";
    }
    renderWords();
}

// Popup finale
function showFinalPopup() {
    document.getElementById("popup-final").style.display = "flex";
}

// Avvio con popup iniziale
window.onload = function() {
    document.getElementById("popup-initial").style.display = "flex";
    document.getElementById("question-area").style.display = "none";
    document.getElementById("words-list").style.display = "none";
};

document.getElementById("start-crossword").onclick = function() {
    document.getElementById("popup-initial").style.display = "none";
    document.getElementById("question-area").style.display = "block";
    document.getElementById("words-list").style.display = "flex";
    renderWords();
};