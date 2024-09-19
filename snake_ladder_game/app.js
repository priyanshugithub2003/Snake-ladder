// Board mapping: Map board square numbers to (x, y) pixel coordinates.
// Assuming each square is 60x60 pixels, starting from bottom-left.
const squareSize = 60;
const boardSize = 10; // 10x10 grid

const boardMap = {};

for (let i = 0; i < 10; i++) { // Row loop
    for (let j = 0; j < 10; j++) { // Column loop
        const squareNum = i % 2 === 0 ? i * boardSize + j + 1 : i * boardSize + (10 - j);
        const top = 540 - (i * squareSize); // Adjust '540' based on your board image height.
        const left = j * squareSize + 40;  // Adjust '40' based on your board image width.
        boardMap[squareNum] = { top: top, left: left };
    }
}

console.log(boardMap);


// Initialize player positions
let player1Position = 0;
let player2Position = 0;
let currentPlayer = 1;  // Track whose turn it is
let gameOver = false;   // Track if the game is over

// Snakes and Ladders configuration
const snakesLadders = {
    17: 7,   // Snake from 17 to 7
    54:34,
    62:19,
    64:60,
    87:36,
    93:73,
    95:75,
    98:79,
    1: 38,   // Ladder from 1 to 38
    4: 14,  // Ladder from 4 to 14
    9:31,
    21:42,
    28:84,
    51:67,
    72:91,
    80:99
};

// Roll the dice
function rollDice() {
    if (gameOver) return; // Prevent dice rolling if the game is over

    const diceValue = Math.floor(Math.random() * 6) + 1;
    document.getElementById('dice').innerText = "Dice: " + diceValue;

    if (currentPlayer === 1) {
        movePlayer(1, diceValue);
    } else {
        movePlayer(2, diceValue);
    }
}

// Move the player
function movePlayer(player, diceValue) {
    let currentPosition, newPosition;

    if (player === 1) {
        currentPosition = player1Position;
    } else {
        currentPosition = player2Position;
    }

    newPosition = currentPosition + diceValue;
    
    // Check if the move exceeds 100
    if (newPosition > 100) {
        // Pass the turn to the other player
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        return; // Exit function without moving
    }

    // Handle the snake/ladder logic and animate the move
    if (player === 1) {
        player1Position = newPosition;
    } else {
        player2Position = newPosition;
    }
    
    animateStepByStep(player, currentPosition, newPosition);
}

// Animate step-by-step movement
function animateStepByStep(player, startPosition, endPosition) {
    const playerToken = document.getElementById(`player${player}`);
    let currentPos = startPosition;

    function moveNext() {
        if (currentPos === endPosition) {
            // Apply snake or ladder logic
            const finalPosition = snakesLadders[currentPos] || currentPos;
            playerToken.style.top = boardMap[finalPosition].top + 'px';
            playerToken.style.left = boardMap[finalPosition].left + 'px';
            
            if (player === 1) {
                player1Position = finalPosition;
            } else {
                player2Position = finalPosition;
            }
            
            checkWinner(player, finalPosition);
            currentPlayer = currentPlayer === 1 ? 2 : 1;  // Switch turns
            return;
        }

        // Move to next position
        currentPos++;
        playerToken.style.transition = 'top 0.3s, left 0.3s';
        playerToken.style.top = boardMap[currentPos].top + 'px';
        playerToken.style.left = boardMap[currentPos].left + 'px';

        setTimeout(moveNext, 500);  // Move every 500ms
    }

    moveNext();
}

// Check if a player wins by reaching square 100
function checkWinner(player, position) {
    if (position === 100) {
        document.getElementById('winnerMessage').innerText = `Player ${player} wins! 🎉`;
        document.getElementById('rollDiceBtn').disabled = true; // Disable the dice button
        gameOver = true;  // Set game over to true to prevent further moves
    }
}

// Event listener for dice roll
document.getElementById('rollDiceBtn').addEventListener('click', rollDice);