"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Grid.module.scss";
import { motion, useScroll, useSpring } from "framer-motion";
import { SquareTrail } from "./SquareTrail/SquareTrail";
import { TetrisFall } from "./TetrisFall/TetrisFall";
import { LightSabers } from "./LightSabers/LightSabers";

const GRID_SIZE = 30;
const MAX_WIDTH = 1440;

export default function Grid() {
  const { scrollYProgress } = useScroll();
  const [windowWidth, setWindowWidth] = useState<number>(MAX_WIDTH);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Observe document height changes for scroll recalculation
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, []);

  // Update grid rect and window width on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (gridRef.current) {
        rectRef.current = gridRef.current.getBoundingClientRect();
      }
      setWindowWidth(window.innerWidth);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <>
      <motion.div className={styles.grid} ref={gridRef}>
        <SquareTrail rectRef={rectRef} gridSize={GRID_SIZE} />
        <TetrisFall windowWidth={windowWidth} gridSize={GRID_SIZE} />
      </motion.div>
      <LightSabers scaleY={scaleY} />
    </>
  );
}
