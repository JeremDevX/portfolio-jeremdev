"use client";

import { JSX } from "react";
import styles from "./TetrisBlocks.module.scss";
import { HTMLMotionProps, motion } from "framer-motion";

interface TetrisBlockProps extends HTMLMotionProps<"div"> {
  className: string;
}

function BaseTetrisBlock({ className, ...props }: TetrisBlockProps) {
  return (
    <motion.div
      {...props}
      className={className}
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

const blocks = {
  I: "tetrisBlockI",
  IHorizontal: "tetrisBlockIHorizontal",
  O: "tetrisBlockO",
  T: "tetrisBlockT",
  THorizontal: "tetrisBlockTHorizontal",
  L: "tetrisBlockL",
  LHorizontal: "tetrisBlockLHorizontal",
  Z: "tetrisBlockZ",
  ZHorizontal: "tetrisBlockZHorizontal",
} as const;

type TetrisBlockKeys = keyof typeof blocks;

export const TetrisBlocks = Object.fromEntries(
  Object.entries(blocks).map(([key, className]) => [
    key,
    (props: HTMLMotionProps<"div">) => (
      <BaseTetrisBlock
        className={styles[className as keyof typeof styles]}
        {...props}
      />
    ),
  ])
) as Record<TetrisBlockKeys, (props: HTMLMotionProps<"div">) => JSX.Element>;
