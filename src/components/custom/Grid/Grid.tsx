"use client";

import { Component, useEffect, useRef, useState } from "react";
import styles from "./Grid.module.scss";
import {
  motion,
  MotionValue,
  useAnimation,
  useScroll,
  useSpring,
} from "framer-motion";
import {
  TetrisBlockI,
  TetrisBlockIHorizontal,
  TetrisBlockL,
  TetrisBlockLHorizontal,
  TetrisBlockO,
  TetrisBlockT,
  TetrisBlockTHorizontal,
  TetrisBlockZ,
  TetrisBlockZHorizontal,
} from "../TetrisBlocks/TetrisBlocks";

export default function Grid() {
  const { scrollYProgress } = useScroll();
  const gridRef = useRef<HTMLDivElement | null>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const gridSize = 30;

  useEffect(() => {
    const updateGridRect = () => {
      if (gridRef.current)
        rectRef.current = gridRef.current.getBoundingClientRect();
    };

    updateGridRect();
    window.addEventListener("resize", updateGridRect);

    return () => window.removeEventListener("resize", updateGridRect);
  }, []);

  return (
    <>
      <motion.div className={styles.grid} ref={gridRef}>
        <SquareTrail rectRef={rectRef} gridSize={gridSize} />
        <TetrisFall />
      </motion.div>
      <LightSabers scaleY={scaleY} />
    </>
  );
}

function TetrisFall() {
  const [activeBlocks, setActiveBlocks] = useState<
    { id: string; Component: React.FC<any>; left: string; transform: string }[]
  >([]);

  const tetrisBlocks = [
    { Component: TetrisBlockI, width: 1 },
    { Component: TetrisBlockIHorizontal, width: 4 },
    { Component: TetrisBlockO, width: 2 },
    { Component: TetrisBlockT, width: 3 },
    { Component: TetrisBlockTHorizontal, width: 2 },
    { Component: TetrisBlockL, width: 2 },
    { Component: TetrisBlockLHorizontal, width: 3 },
    { Component: TetrisBlockZ, width: 3 },
    { Component: TetrisBlockZHorizontal, width: 2 },
  ];

  const getRandomMirrorX = () =>
    Math.random() > 0.5 ? "scaleX(-1)" : "scaleX(1)";

  const getRandomMirrorY = () =>
    Math.random() > 0.5 ? "scaleY(-1)" : "scaleY(1)";

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBlocks((prevBlocks) => {
        const randomBlockData =
          Object.values(tetrisBlocks)[
            Math.floor(Math.random() * Object.values(tetrisBlocks).length)
          ];
        const randomBlock = randomBlockData.Component;
        const randomWidth = randomBlockData.width;

        const newBlock = {
          id: `${Date.now()}`,
          Component: randomBlock,
          left: `${
            (Math.floor(Math.random() * (48 - randomWidth)) + 1) * 30
          }px`,
          transform: `${getRandomMirrorY()} ${getRandomMirrorX()}`,
        };

        return [...prevBlocks.slice(-1), newBlock];
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {activeBlocks.map(({ id, Component, left, transform }) => (
        <Component key={id} style={{ left, transform }} />
      ))}
    </>
  );
}

function LightSabers({ scaleY }: { scaleY: MotionValue<number> }) {
  const controls = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      await controls.start({
        transition: { duration: 1, ease: "easeInOut" },
      });

      controls.start({
        boxShadow: [
          "0 0 15px rgba(21, 174, 0, 1)",
          "0 0 15px rgba(21, 174, 0, 0.5)",
          "0 0 15px rgba(21, 174, 0, 1)",
        ],
        filter: [
          "drop-shadow(0 0 15px rgba(21, 174, 0, 1))",
          "drop-shadow(0 0 15px rgba(21, 174, 0, 0.5))",
          "drop-shadow(0 0 15px rgba(21, 174, 0, 1))",
        ],
        transition: {
          duration: 4,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        },
      });
    };

    sequence();
  }, [controls]);
  return (
    <>
      <div className={styles.gridMask}>
        <motion.div
          className={styles.movingBarSide}
          animate={controls}
          style={{
            top: "100px",
            left: "-3px",
            scaleY,
            maxHeight: "calc(100% - 102px)",
            transformOrigin: "top",
            borderRadius: "0 0 0.5rem 0.5rem",
          }}
        />
        <motion.div
          className={styles.movingBarSide}
          animate={controls}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            delay: 1,
          }}
          style={{
            bottom: "100px",
            right: "-3px",
            scaleY,
            maxHeight: "calc(100% - 102px)",
            transformOrigin: "bottom",
          }}
        />
        <div className={styles.hilt}>
          <div className={styles.button}></div>
        </div>
        <div
          className={styles.hilt}
          style={{
            right: 0,
            left: "-6px",
            rotate: "180deg",
            top: 0,
          }}
        >
          <div className={styles.button}></div>
        </div>
      </div>
    </>
  );
}

function SquareTrail({
  rectRef,
  gridSize,
}: {
  rectRef: React.RefObject<DOMRect | null>;
  gridSize: number;
}) {
  const [trail, setTrail] = useState<
    { col: number; row: number; id: string }[]
  >([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const maxTrailLength = 10;
  let animationFrameId: number | null = null;

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      if (!rectRef.current) return;

      const clientX = event.clientX;
      const clientY = event.clientY;

      setPosition({ x: clientX, y: clientY });

      const relativeX = clientX - rectRef.current.left;
      const relativeY = clientY - rectRef.current.top;
      const newCol = Math.floor(relativeX / gridSize);
      const newRow = Math.floor(relativeY / gridSize);

      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      animationFrameId = requestAnimationFrame(() => {
        setTrail((prevTrail) => {
          if (prevTrail.length > 0) {
            const lastPos = prevTrail[prevTrail.length - 1];

            const colDiff = Math.abs(newCol - lastPos.col);
            const rowDiff = Math.abs(newRow - lastPos.row);

            if (colDiff > 1 || rowDiff > 1) {
              const interpolatedTrail = [];
              const colStep = newCol > lastPos.col ? 1 : -1;
              const rowStep = newRow > lastPos.row ? 1 : -1;

              let interpolatedCol = lastPos.col;
              let interpolatedRow = lastPos.row;

              while (interpolatedCol !== newCol || interpolatedRow !== newRow) {
                if (interpolatedCol !== newCol) interpolatedCol += colStep;
                if (interpolatedRow !== newRow) interpolatedRow += rowStep;

                interpolatedTrail.push({
                  col: interpolatedCol,
                  row: interpolatedRow,
                  id: `${interpolatedCol}-${interpolatedRow}-${Date.now()}`,
                });
              }

              return [...prevTrail, ...interpolatedTrail].slice(
                -maxTrailLength
              );
            }
          }

          const newTrail = [
            ...prevTrail,
            {
              col: newCol,
              row: newRow,
              id: `${newCol}-${newRow}-${Date.now()}`,
            },
          ];
          if (newTrail.length > maxTrailLength) newTrail.shift();

          return newTrail;
        });
      });
    };

    window.addEventListener("mousemove", handleMove);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {trail.map(({ col, row, id }, index) => (
        <motion.div
          key={id + index}
          className={styles.lightSquare}
          style={{
            left: `${col * gridSize}px`,
            top: `${row * gridSize}px`,
          }}
          initial={{ opacity: 1 }}
          animate={index === trail.length - 1 ? { opacity: 1 } : { opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: {
              duration: 0.2,
              ease: "easeOut",
            },
          }}
        />
      ))}
    </>
  );
}
