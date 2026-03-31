// --- CONFIGURATION INITIALE ---
let board = Array(9).fill(0); // 0: vide, 1: X, -1: O
let gameActive = false;
let gameMode = "";
let currentPlayer = 1; // Utile pour le mode Humain vs Humain (PvP)

const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const modal = document.getElementById('modalOverlay');

const turnX = document.getElementById('turnX');
const turnO = document.getElementById('turnO');

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Lignes
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colonnes
    [0, 4, 8], [2, 4, 6]             // Diagonales
];

// --- GESTION DU MODAL ---
window.onload = () => {
    modal.style.display = 'flex';
    modal.classList.add('active');
};

function startGame(mode) {
    gameMode = mode;
    board.fill(0);
    gameActive = true;
    currentPlayer = 1; // X commence toujours
    
    // Fermeture du modal
    modal.classList.remove('active');
    setTimeout(() => { modal.style.display = 'none'; }, 300);
    
    document.getElementById('gameModeDisplay').textContent = "MODE: " + mode.toUpperCase();
    statusText.textContent = "À TON TOUR (X)";
    
    // Reset visuel
    cells.forEach(cell => {
        cell.classList.remove('winning-cell', 'x', 'o');
        cell.textContent = "";
    });
    
    updateMLAnalytics();
    updateUIAnalytics(1); 
}

// --- RENDU ET MOUVEMENTS ---
function renderBoard() {
    cells.forEach((cell, i) => {
        cell.textContent = board[i] === 1 ? "X" : (board[i] === -1 ? "O" : "");
        cell.className = "cell"; 
        if (board[i] === 1) cell.classList.add('x');
        if (board[i] === -1) cell.classList.add('o');
    });
}

cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const index = cell.dataset.index;
        
        // On vérifie si la case est vide et si le jeu est actif
        if (board[index] === 0 && gameActive) {
            
            if (gameMode === 'h-vs-h') {
                // LOGIQUE HUMAIN VS HUMAIN
                makeMove(index, currentPlayer);
                
                if (gameActive) {
                    currentPlayer = (currentPlayer === 1) ? -1 : 1;
                    statusText.textContent = `À TON TOUR (${currentPlayer === 1 ? 'X' : 'O'})`;
                }
            } else {
                // LOGIQUE CONTRE IA (ML ou Minimax)
                makeMove(index, 1); // Joueur joue X
                
                if (gameActive) {
                    statusText.textContent = "L'IA RÉFLÉCHIT...";
                    setTimeout(aiMove, 500);
                }
            }
        }
    });
});

function makeMove(index, player) {
    board[index] = player;
    renderBoard();
    checkGameOver();
    updateMLAnalytics();
    
    if (gameActive) {
        const nextPlayer = (player === 1) ? -1 : 1;
        updateUIAnalytics(nextPlayer);
    }
}

// --- LOGIQUE VISUELLE DU TOUR ---
function updateUIAnalytics(activePlayer) {
    if (activePlayer === 1) {
        turnX.classList.remove('opacity-30', 'grayscale');
        turnX.classList.add('border-blue-200', 'bg-blue-50');
        turnO.classList.add('opacity-30', 'grayscale');
        turnO.classList.remove('border-red-200', 'bg-red-50');
    } else {
        turnO.classList.remove('opacity-30', 'grayscale');
        turnO.classList.add('border-red-200', 'bg-red-50');
        turnX.classList.add('opacity-30', 'grayscale');
        turnX.classList.remove('border-blue-200', 'bg-blue-50');
    }
}

// --- LOGIQUE DE FIN DE JEU ---
function checkGameOver() {
    let roundWon = false;
    let winner = null;

    for (let i = 0; i < winPatterns.length; i++) {
        const [a, b, c] = winPatterns[i];
        if (board[a] !== 0 && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            winner = board[a];
            [a, b, c].forEach(idx => cells[idx].classList.add('winning-cell'));
            break;
        }
    }

    if (roundWon) {
        gameActive = false;
        if (gameMode === 'h-vs-h') {
            statusText.textContent = winner === 1 ? "VICTOIRE DE X !" : "VICTOIRE DE O !";
        } else {
            statusText.textContent = winner === 1 ? "VICTOIRE DE X !" : "L'IA (O) A GAGNÉ !";
        }
        return;
    }

    if (!board.includes(0)) {
        gameActive = false;
        statusText.textContent = "MATCH NUL !";
    }
}

// --- INTELLIGENCE ARTIFICIELLE ---
function aiMove() {
    if (!gameActive) return;
    let move = getBestMove();
    if (move !== null) makeMove(move, -1);
    if (gameActive) statusText.textContent = "À TON TOUR (X)";
}

function getBestMove() {
    const avail = board.map((v, i) => v === 0 ? i : null).filter(v => v !== null);
    
    // 1. Gagner si possible
    for(let i of avail) {
        board[i] = -1;
        if(isWinning(-1)) { board[i] = 0; return i; }
        board[i] = 0;
    }
    // 2. Bloquer l'adversaire
    for(let i of avail) {
        board[i] = 1;
        if(isWinning(1)) { board[i] = 0; return i; }
        board[i] = 0;
    }
    // 3. Prendre le centre
    if(board[4] === 0) return 4;
    // 4. Aléatoire
    return avail.length > 0 ? avail[Math.floor(Math.random() * avail.length)] : null;
}

function isWinning(player) {
    return winPatterns.some(p => board[p[0]] === player && board[p[1]] === player && board[p[2]] === player);
}

// --- ANALYTICS MACHINE LEARNING (FLASK) ---
async function updateMLAnalytics() {
    let vector = [];
    board.forEach(val => {
        vector.push(val === 1 ? 1 : 0);
        vector.push(val === -1 ? 1 : 0);
    });

    const logDiv = document.getElementById('datasetLog');
    if(logDiv) logDiv.innerHTML = `<div class="p-2 bg-gray-100 rounded">VECTEUR : [${vector.join(",")}]</div>`;

    try {
        const response = await fetch('http://localhost:5000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vector: vector })
        });
        const data = await response.json();
        
        const pX = (data.prob_win * 100).toFixed(1);
        const pD = (data.prob_draw * 100).toFixed(1);

        document.getElementById('probXBar').style.width = pX + "%";
        document.getElementById('probXText').textContent = pX + "%";
        document.getElementById('probDrawBar').style.width = pD + "%";
        document.getElementById('probDrawText').textContent = pD + "%";
    } catch (err) {
        console.warn("Serveur ML déconnecté.");
    }
}

document.getElementById('resetBtn').onclick = () => {
    modal.style.display = 'flex';
    modal.classList.add('active');
};