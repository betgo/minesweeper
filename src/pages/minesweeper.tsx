// pages/minesweeper.tsx

import { map } from "@trpc/server/observable";
import React, { useState, useEffect } from "react";

const ROWS = 10;
const COLS = 10;
const MINES = 10;

type CellValue = number | "X";

interface Cell {
  value: CellValue;
  revealed: boolean;
}

const generateBoard = (): Cell[][] => {
  let board: Cell[][] = [];
  for (let i = 0; i < ROWS; i++) {
    board.push(
      new Array(COLS).fill(0).map((_) => ({ value: 0, revealed: false })),
    );
  }
  let mines = 0;
  while (mines < MINES) {
    const row = Math.floor(Math.random() * ROWS);
    const col = Math.floor(Math.random() * COLS);
    if (!board[row]![col]!.value || board[row]![col]!.value !== "X") {
      board[row]![col]!.value = "X";
      mines++;
    }
  }
  return board;
};


const Minesweeper: React.FC = () => {
  const [board, setBoard] = useState<Cell[][]>(generateBoard());

  useEffect(() => {
    // Logic for game initialization
  }, []);

  const revealCell = (row: number, col: number) => {
    const updatedBoard = [...board];
    if (!updatedBoard[row]?.[col]?.revealed) {
      updatedBoard[row]![col]!.revealed = true;
      if (updatedBoard[row]?.[col]?.value === "X") {
        // Handle logic when clicking a mine
        console.log("You clicked a mine! Game over.");
        // You can add game over logic here
      } else {
        // Handle logic when clicking a number cell
        // For example, reveal the number of adjacent mines
        const adjacentMines = countAdjacentMines(row, col);
        updatedBoard[row]![col]!.value = adjacentMines;
      }
      setBoard(updatedBoard);
    }
  };

  const countAdjacentMines = (row: number, col: number): number => {
    let count = 0;
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      /*[0, 0],*/ [0, 1], // Uncomment [0, 0] to count the cell itself
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (const [dx, dy] of directions) {
      const newRow = row + dx!;
      const newCol = col + dy!;

      if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS) {
        if (board[newRow]![newCol]!.value === "X") {
          count++;
        }
      }
    }

    return count;
  };

  const renderBoard = () => {
    return (
      <div className="board overflow-hidden rounded-md border border-gray-400">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`cell flex h-8 w-8 items-center justify-center border border-gray-200 ${
                  cell.revealed ? "bg-gray-300" : "bg-gray-100"
                }`}
              >
                {/* Check if cell is revealed before accessing its value */}
                {cell.revealed ? (
                  cell.value === "X" ? (
                    <span>X</span>
                  ) : (
                    <span>{cell.value}</span>
                  )
                ) : (
                  <button
                    className="h-full w-full focus:outline-none"
                    onClick={() => revealCell(rowIndex, colIndex)}
                  >
                    {/* Add your reveal cell logic here */}
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="minesweeper flex h-screen items-center justify-center">
      <div className="minesweeper bg-gray-200 p-4">
        <h1 className="mb-4 text-3xl font-bold">Minesweeper</h1>
        {renderBoard()}
        {/* Additional UI elements and game logic */}
      </div>
    </div>
  );
};

export default Minesweeper;
