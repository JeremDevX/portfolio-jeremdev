"use client";

import styles from "./TetrisBlocks.module.scss";
import { motion } from "framer-motion";

export function TetrisBlockI({ ...props }) {
  return (
    <motion.div
      {...props}
      className={styles.tetrisBlockI}
      initial={{ bottom: "100%" }}
      animate={{ bottom: "0%" }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

export function TetrisBlockIHorizontal({ ...props }) {
  return (
    <motion.div
      {...props}
      className={styles.tetrisBlockIHorizontal}
      initial={{ bottom: "100%" }}
      animate={{ bottom: "0%" }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

export function TetrisBlockO({ ...props }) {
  return (
    <motion.div
      {...props}
      className={styles.tetrisBlockO}
      initial={{ bottom: "100%" }}
      animate={{ bottom: "0%" }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

export function TetrisBlockT({ ...props }) {
  return (
    <motion.div
      {...props}
      className={styles.tetrisBlockT}
      initial={{ bottom: "100%" }}
      animate={{ bottom: "0%" }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

export function TetrisBlockTHorizontal({ ...props }) {
  return (
    <motion.div
      {...props}
      className={styles.TetrisBlockTHorizontal}
      initial={{ bottom: "100%" }}
      animate={{ bottom: "0%" }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

export function TetrisBlockL({ ...props }) {
  return (
    <motion.div
      {...props}
      className={styles.tetrisBlockL}
      initial={{ bottom: "100%" }}
      animate={{ bottom: "0%" }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

export function TetrisBlockLHorizontal({ ...props }) {
  return (
    <motion.div
      {...props}
      className={styles.TetrisBlockLHorizontal}
      initial={{ bottom: "100%" }}
      animate={{ bottom: "0%" }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

export function TetrisBlockZ({ ...props }) {
  return (
    <motion.div
      {...props}
      className={styles.tetrisBlockZ}
      initial={{ bottom: "100%" }}
      animate={{ bottom: "0%" }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

export function TetrisBlockZHorizontal({ ...props }) {
  return (
    <motion.div
      {...props}
      className={styles.TetrisBlockZHorizontal}
      initial={{ bottom: "100%" }}
      animate={{ bottom: "0%" }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}
