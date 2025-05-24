document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const sudokuGrid = document.getElementById('sudoku-grid');
    const solveBtn = document.getElementById('solve-btn');
    const clearBtn = document.getElementById('clear-btn');
    const exampleBtn = document.getElementById('example-btn');
    const errorDiv = document.getElementById('error');
    
    // Track the currently focused cell for keyboard navigation
    let currentFocusRow = 0;
    let currentFocusCol = 0;
    
    // Create the 9x9 grid
    createGrid();
    
    // Add event listeners
    solveBtn.addEventListener('click', solveSudoku);
    clearBtn.addEventListener('click', clearGrid);
    exampleBtn.addEventListener('click', loadExample);
    
    // Create the Sudoku grid
    function createGrid() {
        sudokuGrid.innerHTML = '';
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                
                // Add thicker borders for 3x3 boxes
                if (row % 3 === 0 && row !== 0) {
                    cell.style.borderTop = '2px solid var(--grid-border)';
                }
                if (col % 3 === 0 && col !== 0) {
                    cell.style.borderLeft = '2px solid var(--grid-border)';
                }
                
                const input = document.createElement('input');
                input.type = 'number';
                input.min = '1';
                input.max = '9';
                input.dataset.row = row;
                input.dataset.col = col;
                
                // Add animation delay for grid appearance
                cell.style.animation = `fadeIn 0.3s ease-out ${(row + col) * 0.02}s both`;
                
                // Add input validation
                input.addEventListener('input', (e) => {
                    const value = e.target.value;
                    if (value && (value < 1 || value > 9)) {
                        e.target.value = '';
                        // Visual feedback for invalid input
                        cell.classList.add('shake-cell');
                        setTimeout(() => cell.classList.remove('shake-cell'), 500);
                    }
                    // Limit to single digit
                    if (value.length > 1) {
                        e.target.value = value.slice(0, 1);
                    }
                    
                    // Add visual feedback
                    if (value) {
                        cell.classList.add('filled');
                        // Add subtle animation for filled cells
                        cell.style.animation = 'pulse 0.5s ease-out';
                    } else {
                        cell.classList.remove('filled');
                        cell.style.animation = '';
                    }
                });
                
                // Enhanced keyboard navigation
                input.addEventListener('keydown', (e) => {
                    // Update current focus position
                    currentFocusRow = parseInt(e.target.dataset.row);
                    currentFocusCol = parseInt(e.target.dataset.col);
                    
                    // Handle arrow keys for navigation
                    if (e.key === 'ArrowUp' && currentFocusRow > 0) {
                        e.preventDefault();
                        document.querySelector(`input[data-row="${currentFocusRow-1}"][data-col="${currentFocusCol}"]`).focus();
                    } else if (e.key === 'ArrowDown' && currentFocusRow < 8) {
                        e.preventDefault();
                        document.querySelector(`input[data-row="${currentFocusRow+1}"][data-col="${currentFocusCol}"]`).focus();
                    } else if (e.key === 'ArrowLeft' && currentFocusCol > 0) {
                        e.preventDefault();
                        document.querySelector(`input[data-row="${currentFocusRow}"][data-col="${currentFocusCol-1}"]`).focus();
                    } else if (e.key === 'ArrowRight' && currentFocusCol < 8) {
                        e.preventDefault();
                        document.querySelector(`input[data-row="${currentFocusRow}"][data-col="${currentFocusCol+1}"]`).focus();
                    }
                });
                
                // Move to next cell on input
                input.addEventListener('keyup', (e) => {
                    if (e.target.value && !['Backspace', 'Delete', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                        const nextCell = findNextCell(row, col);
                        if (nextCell) {
                            nextCell.focus();
                        }
                    }
                });
                
                cell.appendChild(input);
                sudokuGrid.appendChild(cell);
            }
        }
    }
    
    // Find the next cell to focus on
    function findNextCell(row, col) {
        let nextRow = row;
        let nextCol = col + 1;
        
        if (nextCol > 8) {
            nextRow++;
            nextCol = 0;
        }
        
        if (nextRow > 8) {
            return null;
        }
        
        return document.querySelector(`input[data-row="${nextRow}"][data-col="${nextCol}"]`);
    }
    
    // Get the current grid values
    function getGridValues() {
        const grid = Array(9).fill().map(() => Array(9).fill(0));
        
        const inputs = document.querySelectorAll('.cell input');
        inputs.forEach(input => {
            const row = parseInt(input.dataset.row);
            const col = parseInt(input.dataset.col);
            const value = input.value.trim();
            
            grid[row][col] = value ? parseInt(value) : 0;
        });
        
        return grid;
    }
    
    // Set the grid values
    function setGridValues(grid) {
        const inputs = document.querySelectorAll('.cell input');
        inputs.forEach(input => {
            const row = parseInt(input.dataset.row);
            const col = parseInt(input.dataset.col);
            
            if (grid[row][col] !== 0) {
                input.value = grid[row][col];
                if (input.classList.contains('original')) {
                    input.classList.add('original');
                } else {
                    input.classList.add('solved');
                    // Add staggered animation delay for solved numbers
                    const cell = input.parentElement;
                    cell.style.animation = `popIn 0.4s ease-out ${(row + col) * 0.03}s both`;
                }
            } else {
                input.value = '';
            }
        });
    }
    
    // Mark original inputs
    function markOriginalInputs() {
        const inputs = document.querySelectorAll('.cell input');
        inputs.forEach(input => {
            if (input.value) {
                input.classList.add('original');
                input.readOnly = true;
                input.parentElement.classList.add('original-cell');
            }
        });
    }
    
    // Clear the grid with enhanced animation
    function clearGrid() {
        // Add shake animation to the grid
        sudokuGrid.classList.add('shake-grid');
        
        // Show feedback message
        errorDiv.textContent = 'Grid cleared!';
        errorDiv.style.color = 'var(--primary-color)';
        
        // Staggered clearing of cells for visual effect
        const inputs = document.querySelectorAll('.cell input');
        inputs.forEach((input, index) => {
            setTimeout(() => {
                input.value = '';
                input.classList.remove('original', 'solved');
                input.readOnly = false;
                input.parentElement.classList.remove('original-cell', 'filled');
                input.parentElement.style.animation = 'fadeIn 0.3s ease-out';
            }, index * 5); // Very slight delay between cells
        });
        
        // Remove the animation class and message after it completes
        setTimeout(() => {
            sudokuGrid.classList.remove('shake-grid');
            errorDiv.textContent = '';
            // Focus on the first cell after clearing
            document.querySelector('input[data-row="0"][data-col="0"]').focus();
        }, 800);
    }
    
    // Load an example Sudoku puzzle with enhanced animation
    function loadExample() {
        clearGrid();
        
        // Show loading message
        errorDiv.textContent = 'Loading example puzzle...';
        errorDiv.style.color = 'var(--primary-color)';
        
        // Example puzzle (0 represents empty cells)
        const exampleGrid = [
            [5, 3, 0, 0, 7, 0, 0, 0, 0],
            [6, 0, 0, 1, 9, 5, 0, 0, 0],
            [0, 9, 8, 0, 0, 0, 0, 6, 0],
            [8, 0, 0, 0, 6, 0, 0, 0, 3],
            [4, 0, 0, 8, 0, 3, 0, 0, 1],
            [7, 0, 0, 0, 2, 0, 0, 0, 6],
            [0, 6, 0, 0, 0, 0, 2, 8, 0],
            [0, 0, 0, 4, 1, 9, 0, 0, 5],
            [0, 0, 0, 0, 8, 0, 0, 7, 9]
        ];
        
        // Add a slight delay for visual effect
        setTimeout(() => {
            // Fill in cells with staggered animation
            const cells = document.querySelectorAll('.cell');
            let cellIndex = 0;
            
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (exampleGrid[row][col] !== 0) {
                        setTimeout(() => {
                            const input = document.querySelector(`input[data-row="${row}"][data-col="${col}"]`);
                            input.value = exampleGrid[row][col];
                            input.parentElement.classList.add('filled');
                            input.parentElement.style.animation = 'popIn 0.4s ease-out';
                        }, cellIndex * 30);
                        cellIndex++;
                    }
                }
            }
            
            setTimeout(() => {
                markOriginalInputs();
                errorDiv.textContent = 'Example loaded! Try solving it.';
                setTimeout(() => {
                    errorDiv.textContent = '';
                }, 2000);
            }, cellIndex * 30 + 100);
        }, 300);
    }
    
    // Solve the Sudoku puzzle with enhanced feedback
    function solveSudoku() {
        errorDiv.textContent = '';
        
        // Add loading effect to solve button
        solveBtn.classList.add('loading');
        solveBtn.textContent = 'Solving...';
        
        // Add glow effect to the grid during solving
        sudokuGrid.style.animation = 'glow 1.5s infinite';
        
        // Get the current grid values
        const grid = getGridValues();
        
        // Mark original inputs
        markOriginalInputs();
        
        // Delay to show loading effect
        setTimeout(() => {
            // Check if the initial grid is valid
            if (!isValidGrid(grid)) {
                errorDiv.textContent = 'Invalid puzzle! Please check your inputs.';
                errorDiv.style.color = 'var(--error-color)';
                sudokuGrid.classList.add('shake-grid');
                setTimeout(() => sudokuGrid.classList.remove('shake-grid'), 500);
                solveBtn.classList.remove('loading');
                solveBtn.textContent = 'Solve Puzzle';
                sudokuGrid.style.animation = '';
                return;
            }
            
            // Solve the puzzle
            if (solve(grid)) {
                // Show success message with animation
                errorDiv.textContent = 'Puzzle solved successfully!';
                errorDiv.style.color = 'var(--success-color)';
                errorDiv.style.animation = 'fadeIn 0.5s ease-out';
                
                // Set grid values with enhanced animation
                setGridValues(grid);
                
                // Add celebration effect
                sudokuGrid.style.boxShadow = '0 0 20px var(--success-color)';
                setTimeout(() => {
                    sudokuGrid.style.boxShadow = '';
                }, 1500);
            } else {
                errorDiv.textContent = 'No solution exists for this puzzle!';
                errorDiv.style.color = 'var(--error-color)';
                errorDiv.style.animation = 'shake 0.5s ease-in-out';
            }
            
            // Reset button and animations
            solveBtn.classList.remove('loading');
            solveBtn.textContent = 'Solve Puzzle';
            sudokuGrid.style.animation = '';
        }, 800);
    }
    
    // Check if the grid is valid
    function isValidGrid(grid) {
        // Check rows
        for (let row = 0; row < 9; row++) {
            const seen = new Set();
            for (let col = 0; col < 9; col++) {
                const value = grid[row][col];
                if (value !== 0) {
                    if (seen.has(value)) {
                        return false;
                    }
                    seen.add(value);
                }
            }
        }
        
        // Check columns
        for (let col = 0; col < 9; col++) {
            const seen = new Set();
            for (let row = 0; row < 9; row++) {
                const value = grid[row][col];
                if (value !== 0) {
                    if (seen.has(value)) {
                        return false;
                    }
                    seen.add(value);
                }
            }
        }
        
        // Check 3x3 boxes
        for (let boxRow = 0; boxRow < 3; boxRow++) {
            for (let boxCol = 0; boxCol < 3; boxCol++) {
                const seen = new Set();
                for (let row = boxRow * 3; row < boxRow * 3 + 3; row++) {
                    for (let col = boxCol * 3; col < boxCol * 3 + 3; col++) {
                        const value = grid[row][col];
                        if (value !== 0) {
                            if (seen.has(value)) {
                                return false;
                            }
                            seen.add(value);
                        }
                    }
                }
            }
        }
        
        return true;
    }
    
    // Check if a number can be placed in a cell
    function isValid(grid, row, col, num) {
        // Check row
        for (let x = 0; x < 9; x++) {
            if (grid[row][x] === num) {
                return false;
            }
        }
        
        // Check column
        for (let x = 0; x < 9; x++) {
            if (grid[x][col] === num) {
                return false;
            }
        }
        
        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        
        for (let r = boxRow; r < boxRow + 3; r++) {
            for (let c = boxCol; c < boxCol + 3; c++) {
                if (grid[r][c] === num) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    // Solve the Sudoku puzzle using backtracking algorithm
    function solve(grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                // Find an empty cell
                if (grid[row][col] === 0) {
                    // Try placing numbers 1-9
                    for (let num = 1; num <= 9; num++) {
                        // Check if placing the number is valid
                        if (isValid(grid, row, col, num)) {
                            // Place the number
                            grid[row][col] = num;
                            
                            // Recursively try to solve the rest of the puzzle
                            if (solve(grid)) {
                                return true;
                            }
                            
                            // If placing the number doesn't lead to a solution, backtrack
                            grid[row][col] = 0;
                        }
                    }
                    
                    // If no number can be placed, backtrack
                    return false;
                }
            }
        }
        
        // If all cells are filled, the puzzle is solved
        return true;
    }
});