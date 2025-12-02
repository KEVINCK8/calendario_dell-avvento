const today = new Date();
if (!(today.getMonth() === 10 && today.getDate() >= 4)) { // Dicembre (0-based) e giorno >= 3
    window.location.href = "../index.html";
}
// Quiz data
const quiz = [
    {
        letter: "R",
        question: "Qual'è il nostro primo viaggio insieme?",
        answers: [
            "Milano",
            "Firenze", // corretta
            "Gardaland",
            "Caorle"
        ],
        correct: 1
    },
    {
        letter: "E",
        question: "Qual'è Il primo regalo che ti ho fatto?",
        answers: [
            "Cioccolatini & una rosa", // corretta
            "Un paio di airforce",
            "un anello",
            "Un Libro"
        ],
        correct: 0
    },
    {
        letter: "D",
        question: "Quanto ti amo?",
        answers: [
            "TANTISSIMISSIMO",
            "COME I PATATINI",
            "INFINITO",
            "TUTTE LE PRECEDENTI" // corretta
        ],
        correct: 3
    },
    {
        letter: "BU",
        question: "Qual'è il mio cibo preferito?",
        answers: [
            "Salmone e Avocado",
            "Le patatine fritte",
            "La pizza",
            "La pasta in bianco" // corretta
        ],
        correct: 3
    },
    {
        letter: "LL",
        question: "Cosa farei nel mio giorno perfetto?",
        answers: [
            "starei con te, calcio, san siro, gardaland", // corretta
            "starei con te, programmerei, palestra, mcdonald",
            "starei con te, calcio, san siro, palestra",
            "starei con te, san siro, gardaland palestra"
        ],
        correct: 0
    }
];

let current = 0;

function updateTitle() {
    const letters = ["R", "E", "D", "BU", "LL"];
    for (let i = 0; i < letters.length; i++) {
        const el = document.getElementById("letter-" + letters[i]);
        if (i <= current - 1) {
            el.style.color = "#e74c3c";
            el.textContent = letters[i];
            el.style.transform = "scale(1.2)";
        } else {
            el.style.color = "#d3d3d3";
            el.textContent = letters[i] === "BU" || letters[i] === "LL" ? "__" : "_";
            el.style.transform = "scale(1)";
        }
    }
}

function showQuestion() {
    updateTitle();
    document.getElementById("warning-msg").style.display = "block";
    const q = quiz[current];
    const quizArea = document.getElementById("quiz-area");
    quizArea.innerHTML = `
        <div class="question">${q.question}</div>
        <div class="answers">
            ${q.answers.map((ans, idx) => `<button class="answer-btn" data-idx="${idx}">${ans}</button>`).join("")}
        </div>
    `;
    document.querySelectorAll(".answer-btn").forEach(btn => {
        btn.onclick = function() {
            if (parseInt(btn.dataset.idx) === q.correct) {
                current++;
                if (current < quiz.length) {
                    quizArea.classList.remove("quizFadeIn");
                    void quizArea.offsetWidth; // trigger reflow for animation
                    quizArea.classList.add("quizFadeIn");
                    showQuestion();
                } else {
                    showFinal();
                }
            } else {
                btn.classList.add("wrong");
                setTimeout(() => {
                    current = 0;
                    showQuestion();
                }, 900);
            }
        };
    });
}

function showFinal() {
    updateTitle();
    document.getElementById("quiz-area").style.display = "none";
    document.getElementById("final-area").style.display = "block";
    document.getElementById("warning-msg").style.display = "none";
    document.getElementById("show-hint").onclick = function() {
        document.getElementById("hint").style.display = "block";
        this.style.display = "none";
    };
}

// Avvio quiz solo al click
document.getElementById("start-quiz").onclick = function() {
    document.getElementById("start-quiz").style.display = "none";
    document.getElementById("quiz-area").style.display = "block";
    showQuestion();
};