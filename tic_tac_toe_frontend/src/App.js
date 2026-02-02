import React, { useMemo, useState } from "react";
import "./App.css";

const WINNING_LINES = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Cols
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * Returns game outcome based on board state.
 * @param {Array<"X"|"O"|null>} squares 9-length array
 * @returns {{winner: ("X"|"O"|null), winningLine: number[]|null, isDraw: boolean}}
 */
function evaluateGame(squares) {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningLine: line, isDraw: false };
    }
  }

  const isDraw = squares.every((v) => v !== null);
  return { winner: null, winningLine: null, isDraw };
}

// PUBLIC_INTERFACE
function App() {
  /** Board squares (null | "X" | "O") */
  const [squares, setSquares] = useState(Array(9).fill(null));
  /** True => X's turn, False => O's turn */
  const [xIsNext, setXIsNext] = useState(true);

  const outcome = useMemo(() => evaluateGame(squares), [squares]);
  const currentPlayer = xIsNext ? "X" : "O";
  const isLocked = Boolean(outcome.winner) || outcome.isDraw;

  // PUBLIC_INTERFACE
  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  // PUBLIC_INTERFACE
  const handleSquareClick = (index) => {
    if (isLocked) return;
    if (squares[index] !== null) return;

    setSquares((prev) => {
      const next = [...prev];
      next[index] = currentPlayer;
      return next;
    });
    setXIsNext((prev) => !prev);
  };

  const statusText = (() => {
    if (outcome.winner) return `Winner: ${outcome.winner}`;
    if (outcome.isDraw) return "Draw game!";
    return `Turn: ${currentPlayer}`;
  })();

  return (
    <div className="App">
      <main className="ttt-shell">
        <header className="ttt-header">
          <div className="ttt-badge" aria-hidden="true">
            Retro
          </div>
          <h1 className="ttt-title">Tic Tac Toe</h1>
          <p className="ttt-subtitle">Two players, one keyboard, zero mercy.</p>
        </header>

        <section className="ttt-card" aria-label="Tic Tac Toe game">
          <div className="ttt-status" role="status" aria-live="polite">
            {statusText}
          </div>

          <div className="ttt-board" role="grid" aria-label="3 by 3 board">
            {squares.map((value, idx) => {
              const isWinningSquare =
                outcome.winningLine?.includes(idx) ?? false;

              return (
                <button
                  key={idx}
                  type="button"
                  className={[
                    "ttt-square",
                    value ? "ttt-square--filled" : "",
                    isWinningSquare ? "ttt-square--win" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => handleSquareClick(idx)}
                  role="gridcell"
                  aria-label={`Square ${idx + 1}${
                    value ? `, ${value}` : ""
                  }`}
                  disabled={isLocked || value !== null}
                >
                  <span className="ttt-mark" aria-hidden="true">
                    {value ?? ""}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="ttt-actions">
            <button type="button" className="ttt-btn" onClick={resetGame}>
              Reset
            </button>
          </div>

          <footer className="ttt-footer">
            <div className="ttt-hint">
              Tip: Click a square to place your mark.
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
