let currentMoleTile;
let currentPlantTile;
let playerScore = 0;
let isGameOver = false;
let timer = 30; 
let timerInterval;
let moleInterval;
let plantInterval;

window.onload = function() {
    document.getElementById('play-button').addEventListener('click', startGame);
    document.getElementById('restartBtn').addEventListener('click', restartGame);
}

function startGame() {
    document.getElementById('intro').style.display = 'none'; 
    document.getElementById('game').style.display = 'block'; 
    initializeGame(); 
    startTimer(); 
}

function initializeGame() {
    // Clear previous board if any
    document.getElementById("board").innerHTML = '';

    for (let i = 0; i < 9; i++) {
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", handleTileClick);
        document.getElementById("board").appendChild(tile);
    }

    // Clear existing intervals before starting new ones
    clearInterval(moleInterval);
    clearInterval(plantInterval);

    moleInterval = setInterval(showMole, 1000);
    plantInterval = setInterval(showPlant, 2000);
}

function getRandomTile() {
    let randomIndex = Math.floor(Math.random() * 9);
    return randomIndex.toString();
}

function showMole() {
    if (isGameOver) return;
    if (currentMoleTile) currentMoleTile.innerHTML = "";
    let moleImg = document.createElement("img");
    moleImg.src = "images/monty-mole.png";
    moleImg.classList.add("mole");
    let randomTile = getRandomTile();
    if (currentPlantTile && currentPlantTile.id === randomTile) return;
    currentMoleTile = document.getElementById(randomTile);
    currentMoleTile.appendChild(moleImg);
}

function showPlant() {
    if (isGameOver) return;
    if (currentPlantTile) currentPlantTile.innerHTML = "";
    let plantImg = document.createElement("img");
    plantImg.src = "images/piranha-plant.png";
    plantImg.classList.add("plant");
    let randomTile = getRandomTile();
    if (currentMoleTile && currentMoleTile.id === randomTile) return;
    currentPlantTile = document.getElementById(randomTile);
    currentPlantTile.appendChild(plantImg);
}

function handleTileClick() {
    if (isGameOver) return;

    if (this === currentMoleTile) {
        // Add the clicked animation to the mole
        const moleImg = currentMoleTile.querySelector('.mole');
        if (moleImg) {
            moleImg.classList.add('clicked');
            // Remove the 'clicked' class after the animation is done
            setTimeout(() => {
                moleImg.classList.remove('clicked');
            }, 200); // Match this duration with the CSS animation
        }

        playerScore += 10;
        document.getElementById("score").innerText = playerScore.toString();
    } else if (this === currentPlantTile) {
        isGameOver = true;
        endGame();
    }
}

function startTimer() {
    // Clear any existing timer intervals
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    timer = 30; 
    document.getElementById('timer').innerText = `Time Left: ${timer}s`;
    timerInterval = setInterval(updateTimer, 1000); 
}

function updateTimer() {
    if (isGameOver) return;

    timer--; 
    document.getElementById('timer').innerText = `Time Left: ${timer}s`;

    if (timer <= 0) {
        clearInterval(timerInterval);
        isGameOver = true;
        endGame(); 
    }
}

function endGame() {
    // Get the highest score from local storage
    let highestScore = localStorage.getItem('highestScore') || 0;

    // Update the highest score if the current score is higher
    if (playerScore > highestScore) {
        highestScore = playerScore;
        localStorage.setItem('highestScore', highestScore);
    }

    showGameOverPopup(playerScore, highestScore);
}

function showGameOverPopup(score, highestScore) {
    document.getElementById('finalScore').innerText = score;
    document.getElementById('highestScore').innerText = highestScore; 
    document.getElementById('gameOverModal').style.display = 'flex';
}

function resetGame() {
    playerScore = 0;
    isGameOver = false;
    timer = 30; 
    document.getElementById("score").innerText = "0";
    document.getElementById('timer').innerText = `Time Left: ${timer}s`;
    
    // Clear the board
    document.getElementById("board").innerHTML = "";

    // Clear existing intervals before starting new ones
    clearInterval(moleInterval);
    clearInterval(plantInterval);

    // Restart the game
    initializeGame();
}

function restartGame() {
    // Hide the modal
    document.getElementById('gameOverModal').style.display = 'none';
    
    // Reset game variables
    resetGame();
    startTimer(); 
}
