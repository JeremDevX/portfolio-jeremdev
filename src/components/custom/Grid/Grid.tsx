"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Grid.module.scss";
import {
  motion,
  MotionValue,
  useAnimation,
  useScroll,
  useSpring,
} from "framer-motion";
import { TetrisBlocks } from "../TetrisBlocks/TetrisBlocks";

export default function Grid() {
  const { scrollYProgress } = useScroll();
  const [windowWidth, setWindowWidth] = useState<number>(1440);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const gridSize = 30;

  useEffect(() => {
    const updateGridRectAndWindowWidth = () => {
      if (gridRef.current) {
        rectRef.current = gridRef.current.getBoundingClientRect();
      }
      setWindowWidth(window.innerWidth);
    };

    updateGridRectAndWindowWidth();
    window.addEventListener("resize", updateGridRectAndWindowWidth);

    return () =>
      window.removeEventListener("resize", updateGridRectAndWindowWidth);
  }, [gridRef]);

  return (
    <>
      <motion.div className={styles.grid} ref={gridRef}>
        <SquareTrail rectRef={rectRef} gridSize={gridSize} />
        <TetrisFall windowWidth={windowWidth} gridSize={gridSize} />
      </motion.div>
      <LightSabers scaleY={scaleY} />
    </>
  );
}

function TetrisFall({
  windowWidth,
  gridSize,
}: {
  windowWidth: number;
  gridSize: number;
}) {
  const [activeBlocks, setActiveBlocks] = useState<
    { id: string; Component: React.FC<any>; left: string; transform: string }[]
  >([]);

  const tetrisBlocks = [
    { Component: TetrisBlocks.I, width: 1 },
    { Component: TetrisBlocks.IHorizontal, width: 4 },
    { Component: TetrisBlocks.O, width: 2 },
    { Component: TetrisBlocks.T, width: 3 },
    { Component: TetrisBlocks.THorizontal, width: 2 },
    { Component: TetrisBlocks.L, width: 2 },
    { Component: TetrisBlocks.LHorizontal, width: 3 },
    { Component: TetrisBlocks.Z, width: 3 },
    { Component: TetrisBlocks.ZHorizontal, width: 2 },
  ];

  const getRandomMirrorX = () =>
    Math.random() > 0.5 ? "scaleX(-1)" : "scaleX(1)";

  const getRandomMirrorY = () =>
    Math.random() > 0.5 ? "scaleY(-1)" : "scaleY(1)";

  const colsNumber = Math.floor(Math.min(windowWidth, 1440) / gridSize);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBlocks((prevBlocks) => {
        const randomBlockData =
          Object.values(tetrisBlocks)[
            Math.floor(Math.random() * Object.values(tetrisBlocks).length)
          ];
        const randomBlock = randomBlockData.Component;
        const randomBlockWidth = randomBlockData.width;

        const newBlock = {
          id: `${Date.now()}`,
          Component: randomBlock,
          left: `${
            (Math.floor(Math.random() * (colsNumber - randomBlockWidth)) + 1) *
            gridSize
          }px`,
          transform: `${getRandomMirrorY()} ${getRandomMirrorX()}`,
        };

        return [...prevBlocks.slice(-1), newBlock];
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [colsNumber, tetrisBlocks, gridSize]);

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
          "drop-shadow(0 0 25px rgba(21, 174, 0, 1))",
          "drop-shadow(0 0 25px rgba(21, 174, 0, 0.5))",
          "drop-shadow(0 0 25px rgba(21, 174, 0, 1))",
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
            top: "0%",
            left: "-2px",
            scaleY,
            transformOrigin: "top",
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
            bottom: "0%",
            right: "-2px",
            scaleY,
            transformOrigin: "bottom",
          }}
        />
        {/* <div className={styles.hilt}>
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
        </div> */}
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
  const maxTrailLength = 10;
  let animationFrameId: number | null = null;

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      if (!rectRef.current) return;

      const clientX = event.clientX;
      const clientY = event.clientY;

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
  }, [rectRef, gridSize]);

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
