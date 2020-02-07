/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
class Game {
  constructor(WIDTH, HEIGHT, ...players) {
      this.WIDTH = WIDTH;
      this.HEIGHT = HEIGHT;
      this.players = [...players]
      this.currPlayer = this.players[0]
      this.gameOver = true;
      this.makeBoard();
      this.makeHtmlBoard();
      this.toggleStartScreen();
  }

  toggleStartScreen() {
      console.log(this.players)
      const startScreen = document.querySelector('#start-form')
      startScreen.classList.toggle('hidden')
  }

  makeBoard() {
      this.board = [];
      for (let y = 0; y < this.HEIGHT; y++) {
          this.board.push(Array.from({
              length: this.WIDTH
          }));
      }
  }

  makeHtmlBoard() {

      const board = document.getElementById('board');
      board.innerHTML = ""
      // make column tops (clickable area for adding a piece to that column)
      const top = document.createElement('tr');
      top.setAttribute('id', 'column-top');

      top.addEventListener("click", this.handleClick.bind(this));

      for (let x = 0; x < this.WIDTH; x++) {
          const headCell = document.createElement('td');
          headCell.setAttribute('id', x);
          top.append(headCell);
      }

      board.append(top);

      // make main part of board
      for (let y = 0; y < this.HEIGHT; y++) {
          const row = document.createElement('tr');

          for (let x = 0; x < this.WIDTH; x++) {
              const cell = document.createElement('td');
              cell.setAttribute('id', `${y}-${x}`);
              row.append(cell);
          }

          board.append(row);
      }
  }

  findSpotForCol(x) {
      for (let y = this.HEIGHT - 1; y >= 0; y--) {
          if (!this.board[y][x]) {
              return y;
          }
      }
      return null;
  }

  placeInTable(y, x) {
      const piece = document.createElement('div');
      piece.classList.add('piece');
      piece.style.backgroundColor = `${this.currPlayer.color}`
      piece.style.top = -50 * (y + 2);

      const spot = document.getElementById(`${y}-${x}`);
      spot.append(piece);
  }

  endGame(msg) {
      this.gameOver = false;
      setTimeout(() => {
          alert(msg);
          this.toggleStartScreen();
          board.innerHTML = ""
      }, 800)
  }

  handleClick(evt) {

      // get x from ID of clicked cell
      if (this.gameOver) {
          const x = +evt.target.id;

          // get next spot in column (if none, ignore click)
          const y = this.findSpotForCol(x);
          if (y === null) {
              return;
          }

          // place piece in board and add to HTML table
          this.board[y][x] = this.currPlayer;
          this.placeInTable(y, x);

          // check for win
          if (this.checkForWin()) {
              this.endGame(`Player ${this.currPlayer.number} won!`);
          }

          // check for tie
          if (this.board.every(row => row.every(cell => cell))) {
              return this.endGame('Tie!');
          }

          // switch players
          if (!this.checkForWin()) {
              for (let i = 0; i < this.players.length; i++) {
                  if (this.currPlayer.number === this.players.length) {
                      this.currPlayer = this.players[0]
                      break;
                  } else if (this.currPlayer === this.players[i]) {
                      this.currPlayer = this.players[i + 1]
                      break;
                  }
              }
          }
      }
  }

  checkForWin() {

      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      // all four values in each array must match the current player to return true
      const _win = cells => {
          return cells.every(
              ([y, x]) =>
              y >= 0 &&
              y < this.HEIGHT &&
              x >= 0 &&
              x < this.WIDTH &&
              this.board[y][x] === this.currPlayer
          )
      };



      for (let y = 0; y < this.HEIGHT; y++) {
          for (let x = 0; x < this.WIDTH; x++) {
              // get "check list" of 4 cells (starting here) for each of the different
              // ways to win
              const horiz = [
                  [y, x],
                  [y, x + 1],
                  [y, x + 2],
                  [y, x + 3]
              ];
              const vert = [
                  [y, x],
                  [y + 1, x],
                  [y + 2, x],
                  [y + 3, x]
              ];
              const diagDR = [
                  [y, x],
                  [y + 1, x + 1],
                  [y + 2, x + 2],
                  [y + 3, x + 3]
              ];
              const diagDL = [
                  [y, x],
                  [y + 1, x - 1],
                  [y + 2, x - 2],
                  [y + 3, x - 3]
              ];

              // find winner (only checking each win-possibility as needed)
              if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                  return true;
              }
          }
      }
  }
}

class Player {
  constructor(color, number) {
      this.color = color
      this.number = number
  }
}


const form = document.querySelector('#start-form')
form.addEventListener('click', e => {
  let p1color = document.querySelector('#p1color').value
  let p2color = document.querySelector('#p2color').value
  if (e.target.id === 'start') {
      let p1 = new Player(p1color, 1)
      let p2 = new Player(p2color, 2)
      if (document.body.contains(document.querySelector('#p3color'))) {
          let p3color = document.querySelector('#p3color').value
          let p3 = new Player(p3color, 3)
          new Game(7, 6, p1, p2, p3)
      } else {
          new Game(7, 6, p1, p2)
      }
  }
  if (e.target.id === 'three-players') {
      document.querySelector('#three-players').remove()
      let label3 = document.createElement('label')
      label3.setAttribute('for', 'p3color')
      label3.innerText = 'Player 3'
      let input3 = document.createElement('input')
      input3.id = 'p3color'
      input3.setAttribute('placeholder', 'Enter favorite color')
      let button = document.querySelector('#break')
      form.insertBefore(label3, button)
      form.insertBefore(input3, button)
  }
})


/*
Right now, the players are just numbers, and we have hard-coded player numbers and colors
in the CSS.

Make it so that there is a Player class. It should have a constructor that takes a string
color name (eg, “orange” or “#ff3366”) and store that on the player instance.

The Game should keep track of the current player object, not the current player 
number.

Update the code so that the player pieces are the right color for them, rather than 
being hardcoded in CSS as red or blue.

Add a small form to the HTML that lets you enter the colors for the players, so that
when you start a new game, it uses these player colors.
*/
// active player: 1 or 2
// array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
*   board = array of rows, each row is array of cells  (board[y][x])
*/


/** makeHtmlBoard: make HTML table and row of column tops. */



/** findSpotForCol: given column x, return top empty y (null if filled) */



/** placeInTable: update DOM to place piece into HTML table of board */

/** endGame: announce game end */


/** handleClick: handle click of column top to play piece */



/** checkForWin: check board cell-by-cell for "does a win start here?" */