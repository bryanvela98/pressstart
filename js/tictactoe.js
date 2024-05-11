document.addEventListener('DOMContentLoaded', function() {
    const cells = document.querySelectorAll('.cell');
    const resetButton = document.getElementById('resetButton');

    let currentPlayer = 'X';
    let gameEnded = false;

    function checkWinner() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (cells[a].textContent && cells[a].textContent === cells[b].textContent && cells[a].textContent === cells[c].textContent) {
                cells[a].style.backgroundColor = 'red';
                cells[b].style.backgroundColor = 'red';
                cells[c].style.backgroundColor = 'red';
                gameEnded = true;
                return true;
            }
        }

        if (!Array.from(cells).some(cell => cell.textContent === '')) {
            gameEnded = true; // Tie
            return true;
        }

        return false;
    }

    function resetGame() {
        cells.forEach(cell => {
            cell.textContent = '';
            cell.style.backgroundColor = '#ffff00';
        });
        currentPlayer = 'X';
        gameEnded = false;
    }

    cells.forEach(cell => {
        cell.addEventListener('click', function() {
            if (!cell.textContent && !gameEnded) {
                cell.textContent = currentPlayer;
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

                if (checkWinner()) {
                    setTimeout(resetGame, 1000);
                }
            }
        });
    });

    resetButton.addEventListener('click', resetGame);
});
