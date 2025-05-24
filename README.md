# Interactive Sudoku Solver

A modern, interactive web-based Sudoku puzzle solver that uses the backtracking algorithm to find solutions for any valid Sudoku puzzle. This application features an elegant UI with animations, keyboard navigation, visual feedback, and a clean, responsive design.

## Features

- **Interactive 9x9 Grid**: Enter your Sudoku puzzle values directly into the grid with keyboard navigation
- **Backtracking Algorithm**: Efficiently solves even the most complex Sudoku puzzles
- **Input Validation**: Ensures only valid numbers (1-9) are entered and validates the puzzle before solving
- **Enhanced Visual Feedback**: 
  - Animations for solving, clearing, and loading puzzles
  - Distinct styling for original inputs and solved values
  - Visual cues for invalid inputs and successful solutions
  - Subtle animations for filled cells and grid interactions
- **Keyboard Navigation**: Use arrow keys to move between cells for faster input
- **Responsive Design**: Works well on desktop, tablet, and mobile devices
- **User-Friendly Controls**:
  - Solve Puzzle: Finds the solution with visual loading feedback
  - Reset Grid: Clears the grid with animation effects
  - Try Example: Loads a sample puzzle with staggered cell filling animation

## How to Use

1. **Enter Known Values**: Fill in the cells where you already know the values (1-9)
2. **Navigate with Keyboard**: Use arrow keys to move between cells for faster input
3. **Leave Empty Cells**: Cells where you want the solver to find values should be left empty
4. **Solve the Puzzle**: Click the "Solve Puzzle" button to find the complete solution with visual feedback
5. **Start Over**: Use the "Reset Grid" button to clear the grid with animation effects
6. **Try an Example**: Click "Try Example" to see a sample puzzle load with animations

## Implementation Details

### Technologies Used

- **HTML5**: For structure and grid layout
- **CSS3**: For styling, animations, transitions, and responsive design
- **JavaScript**: For grid generation, input handling, keyboard navigation, and the solving algorithm with visual feedback

### Algorithm

The solver uses a backtracking algorithm, which is a type of recursive algorithm that tries different values until it finds a solution:

1. Find an empty cell in the grid
2. Try placing numbers 1-9 in the cell
3. Check if the number is valid in that position (row, column, and 3x3 box)
4. If valid, recursively try to fill the rest of the grid
5. If the recursive call returns true, the puzzle is solved
6. If the recursive call returns false, backtrack and try a different number

## Running the Application

This is a client-side application that runs entirely in the browser. To use it:

1. Clone or download the repository
2. Open `index.html` in your web browser
3. Alternatively, you can use a local server to serve the files

## Future Enhancements

Possible future improvements include:

- Adding a difficulty selector for generated puzzles
- Implementing a step-by-step solution viewer with animation
- Adding a timer and scoring system for solving puzzles manually
- Implementing puzzle generation functionality with different difficulty levels
- Adding dark mode support with smooth transitions
- Saving and loading puzzles from local storage
- Adding hint system for manual solving assistance
- Implementing undo/redo functionality for input changes

## License

This project is open source and available for personal and educational use.

---

Created with ❤️ using modern web technologies and the backtracking algorithm for an elegant Sudoku solving experience.
