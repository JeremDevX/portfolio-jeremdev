"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  const [_, setPageHeight] = useState<null | number>(null);
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
    const observer = new ResizeObserver(() => {
      setPageHeight(document.documentElement.scrollHeight);
      window.dispatchEvent(new Event("scroll"));
    });

    observer.observe(document.documentElement);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateGridRectAndWindowWidth = () => {
      if (gridRef.current) {
        rectRef.current = gridRef.current.getBoundingClientRect();
      }
      setWindowWidth(window.innerWidth);
    };

    updateGridRectAndWindowWidth();
    window.addEventListener("resize", updateGridRectAndWindowWidth);

    return () => {
      window.removeEventListener("resize", updateGridRectAndWindowWidth);
    };
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

const TetrisFall = React.memo(
  ({ windowWidth, gridSize }: { windowWidth: number; gridSize: number }) => {
    const [activeBlocks, setActiveBlocks] = useState<
      {
        id: string;
        Component: React.FC<any>;
        left: string;
        transform: string;
      }[]
    >([]);

    const tetrisBlocks = useMemo(
      () => [
        { Component: TetrisBlocks.I, width: 1 },
        { Component: TetrisBlocks.IHorizontal, width: 4 },
        { Component: TetrisBlocks.O, width: 2 },
        { Component: TetrisBlocks.T, width: 3 },
        { Component: TetrisBlocks.THorizontal, width: 2 },
        { Component: TetrisBlocks.L, width: 2 },
        { Component: TetrisBlocks.LHorizontal, width: 3 },
        { Component: TetrisBlocks.Z, width: 3 },
        { Component: TetrisBlocks.ZHorizontal, width: 2 },
      ],
      []
    );

    const getRandomMirrorX = () =>
      Math.random() > 0.5 ? "scaleX(-1)" : "scaleX(1)";

    const getRandomMirrorY = () =>
      Math.random() > 0.5 ? "scaleY(-1)" : "scaleY(1)";

    const colsNumber = Math.floor(Math.min(windowWidth, 1440) / gridSize);

    useEffect(() => {
      const interval = setInterval(() => {
        setActiveBlocks((prevBlocks) => {
          const randomBlockData =
            tetrisBlocks[Math.floor(Math.random() * tetrisBlocks.length)];
          const randomBlock = randomBlockData.Component;
          const randomBlockWidth = randomBlockData.width;

          const newBlock = {
            id: `${Date.now()}`,
            Component: randomBlock,
            left: `${
              (Math.floor(Math.random() * (colsNumber - randomBlockWidth)) +
                1) *
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
);

TetrisFall.displayName = "TetrisFall";

function LightSabers({ scaleY }: { scaleY: MotionValue<number> }) {
  const controls = useAnimation();

  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const unsubscribe = scaleY.on("change", (value) => {
      if (value > 0.05 && !hasTriggered) {
        setHasTriggered(true);
      }
    });

    return () => unsubscribe();
  }, [scaleY, hasTriggered]);

  useEffect(() => {
    if (!hasTriggered) return;
    const sequence = async () => {
      await controls.start({ transition: { duration: 1, ease: "easeInOut" } });

      controls.start({
        boxShadow: [
          "0 0 15px rgba(21, 174, 0, 0.25)",
          "0 0 15px rgba(21, 174, 0, 0.75)",
          "0 0 15px rgba(21, 174, 0, 0.25)",
        ],
        filter: [
          "drop-shadow(0 0 15px rgba(21, 174, 0, 0.25))",
          "drop-shadow(0 0 15px rgba(21, 174, 0, 0.75))",
          "drop-shadow(0 0 15px rgba(21, 174, 0, 0.25))",
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
  }, [controls, hasTriggered]);

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
  const lastPosition = useRef<{ col: number; row: number } | null>(null);
  const maxTrailLength = 5;

  const handleMove = useCallback(
    (event: MouseEvent) => {
      if (!rectRef.current) return;

      const clientX = event.clientX;
      const clientY = event.clientY;

      const relativeX = clientX - rectRef.current.left;
      const relativeY = clientY - rectRef.current.top;
      const newCol = Math.floor(relativeX / gridSize);
      const newRow = Math.floor(relativeY / gridSize);

      if (
        lastPosition.current &&
        lastPosition.current.col === newCol &&
        lastPosition.current.row === newRow
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

        if (newTrail.length > maxTrailLength) {
          newTrail.shift();
        }

        return newTrail;
      });
    },
    [gridSize, rectRef]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
    };
  }, [handleMove]);

  return (
    <>
      {trail.map(({ col, row, id }, index) => (
        <motion.div
          key={id}
          className={styles.lightSquare}
          style={{
            left: `${col * gridSize}px`,
            top: `${row * gridSize}px`,
          }}
          initial={{ opacity: 1 }}
          animate={index === trail.length - 1 ? {} : { opacity: 0 }}
          transition={
            index === trail.length - 1 ? {} : { duration: 1, ease: "easeOut" }
          }
        />
      ))}
    </>
  );
}
