"use client";

import React, { useEffect, useMemo, useState } from "react";
import { TetrisBlocks } from "../../TetrisBlocks/TetrisBlocks";

interface TetrisFallProps {
  windowWidth: number;
  gridSize: number;
}

interface ActiveBlock {
  id: string;
  Component: React.FC<React.ComponentProps<typeof TetrisBlocks.I>>;
  left: string;
  transform: string;
}

const TETRIS_BLOCKS = [
  { Component: TetrisBlocks.I, width: 1 },
  { Component: TetrisBlocks.IHorizontal, width: 4 },
  { Component: TetrisBlocks.O, width: 2 },
  { Component: TetrisBlocks.T, width: 3 },
  { Component: TetrisBlocks.THorizontal, width: 2 },
  { Component: TetrisBlocks.L, width: 2 },
  { Component: TetrisBlocks.LHorizontal, width: 3 },
  { Component: TetrisBlocks.Z, width: 3 },
  { Component: TetrisBlocks.ZHorizontal, width: 2 },
] as const;

const SPAWN_INTERVAL = 2500;
const MAX_VISIBLE_BLOCKS = 2;

const getRandomMirror = (axis: "X" | "Y") =>
  Math.random() > 0.5 ? `scale${axis}(-1)` : `scale${axis}(1)`;

export const TetrisFall = React.memo(function TetrisFall({
  windowWidth,
  gridSize,
}: TetrisFallProps) {
  const [activeBlocks, setActiveBlocks] = useState<ActiveBlock[]>([]);

  const colsNumber = useMemo(
    () => Math.floor(Math.min(windowWidth, 1440) / gridSize),
    [windowWidth, gridSize]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBlocks((prevBlocks) => {
        const randomBlockData =
          TETRIS_BLOCKS[Math.floor(Math.random() * TETRIS_BLOCKS.length)];

        const newBlock: ActiveBlock = {
          id: `${Date.now()}`,
          Component: randomBlockData.Component,
          left: `${
            (Math.floor(Math.random() * (colsNumber - randomBlockData.width)) +
              1) *
            gridSize
          }px`,
          transform: `${getRandomMirror("Y")} ${getRandomMirror("X")}`,
        };

        // Keep only the last blocks to prevent memory buildup
        return [...prevBlocks.slice(-(MAX_VISIBLE_BLOCKS - 1)), newBlock];
      });
    }, SPAWN_INTERVAL);

    return () => clearInterval(interval);
  }, [colsNumber, gridSize]);

  return (
    <>
      {activeBlocks.map(({ id, Component, left, transform }) => (
        <Component key={id} style={{ left, transform }} />
      ))}
    </>
  );
});
