"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import styles from "../Grid.module.scss";

interface SquareTrailProps {
  rectRef: React.RefObject<DOMRect | null>;
  gridSize: number;
}

interface TrailSquare {
  col: number;
  row: number;
  id: string;
}

const MAX_TRAIL_LENGTH = 5;

export function SquareTrail({ rectRef, gridSize }: SquareTrailProps) {
  const [trail, setTrail] = useState<TrailSquare[]>([]);
  const lastPosition = useRef<{ col: number; row: number } | null>(null);

  const handleMove = useCallback(
    (event: MouseEvent) => {
      if (!rectRef.current) return;

      const relativeX = event.clientX - rectRef.current.left;
      const relativeY = event.clientY - rectRef.current.top;
      const newCol = Math.floor(relativeX / gridSize);
      const newRow = Math.floor(relativeY / gridSize);

      // Skip if position hasn't changed
      if (
        lastPosition.current?.col === newCol &&
        lastPosition.current?.row === newRow
      ) {
        return;
      }

      lastPosition.current = { col: newCol, row: newRow };

      setTrail((prevTrail) => {
        const newTrail = [
          ...prevTrail,
          {
            col: newCol,
            row: newRow,
            id: `${newCol}-${newRow}-${Date.now()}`,
          },
        ];

        // Limit trail length
        if (newTrail.length > MAX_TRAIL_LENGTH) {
          newTrail.shift();
        }

        return newTrail;
      });
    },
    [gridSize, rectRef]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [handleMove]);

  return (
    <>
      {trail.map(({ col, row, id }, index) => {
        const isLast = index === trail.length - 1;
        return (
          <motion.div
            key={id}
            className={styles.lightSquare}
            style={{
              left: `${col * gridSize}px`,
              top: `${row * gridSize}px`,
            }}
            initial={{ opacity: 1 }}
            animate={isLast ? {} : { opacity: 0 }}
            transition={isLast ? {} : { duration: 1, ease: "easeOut" }}
          />
        );
      })}
    </>
  );
}
