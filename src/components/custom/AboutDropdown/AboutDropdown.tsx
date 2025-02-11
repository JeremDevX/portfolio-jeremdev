"use client";

import { useRef, useState } from "react";
import styles from "./AboutDropdown.module.scss";
import { FaChevronDown } from "react-icons/fa6";
import { motion, useInView } from "framer-motion";

interface AboutDropdownProps {
  title: string;
  content: string;
  index: number;
}

export default function AboutDropdown({
  title,
  content,
  index,
}: AboutDropdownProps) {
  const [open, setOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(dropdownRef, {
    once: true,
    amount: 0.9,
  });

  return (
    <motion.div
      className={styles.dropdown}
      ref={dropdownRef}
      initial={{ opacity: 0, x: "25vw" }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: "10vw" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className={styles.container} onClick={() => setOpen(!open)}>
        <h3 className={styles.title}>{title}</h3>
        <FaChevronDown
          className={`${styles.icon} ${open && styles.icon__open}`}
        />
        <div
          className={styles.test}
          style={{
            transition: open ? "all 1.3s ease" : "all 0.7s ease",
            backgroundColor: open ? "var(--accent)" : "",
            opacity: open ? 0.7 : 0.25,
          }}
        />
        <div
          className={styles.test}
          style={{
            transition: "all 1s ease",
            backgroundColor: open ? "var(--accent)" : "",
            opacity: open ? 0.7 : 0.25,
            right: "4.5rem",
          }}
        />
        <div
          className={styles.test}
          style={{
            transition: open ? "all 0.7s ease" : "all 1.3s ease",
            backgroundColor: open ? "var(--accent)" : "",
            opacity: open ? 0.7 : 0.25,
            right: "5.5rem",
          }}
        />
      </div>
      <motion.div
        className={styles.content}
        initial={{ height: 0, opacity: 0, display: "none" }}
        animate={
          open
            ? {
                height: "auto",
                opacity: 1,
                display: "block",
                transition: {
                  default: { type: "tween" },
                },
              }
            : {
                height: 0,
                opacity: 0,
                display: "none",
                transition: {
                  default: { type: "tween" },
                },
              }
        }
      >
        <p>{content}</p>
      </motion.div>
    </motion.div>
  );
}
