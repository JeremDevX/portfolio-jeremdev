"use client";

import { useEffect, useState } from "react";
import { motion, MotionValue, useAnimation } from "framer-motion";
import styles from "../Grid.module.scss";

interface LightSabersProps {
  scaleY: MotionValue<number>;
}

const GLOW_ANIMATION = {
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
};

const GLOW_TRANSITION = {
  duration: 4,
  ease: "easeInOut" as const,
  repeat: Infinity,
  repeatType: "loop" as const,
};

const SCROLL_TRIGGER_THRESHOLD = 0.05;

export function LightSabers({ scaleY }: LightSabersProps) {
  const controls = useAnimation();
  const [hasTriggered, setHasTriggered] = useState(false);

  // Trigger animation when scroll passes threshold
  useEffect(() => {
    const unsubscribe = scaleY.on("change", (value) => {
      if (value > SCROLL_TRIGGER_THRESHOLD && !hasTriggered) {
        setHasTriggered(true);
      }
    });

    return () => unsubscribe();
  }, [scaleY, hasTriggered]);

  // Start glow animation sequence
  useEffect(() => {
    if (!hasTriggered) return;

    const startSequence = async () => {
      await controls.start({ transition: { duration: 1, ease: "easeInOut" } });
      controls.start({
        ...GLOW_ANIMATION,
        transition: GLOW_TRANSITION,
      });
    };

    startSequence();
  }, [controls, hasTriggered]);

  return (
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
  );
}
