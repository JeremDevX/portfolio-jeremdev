"use client";

import { useState } from "react";
import styles from "./GithubContributions.module.scss";

interface ContributionDayProps {
  date: string;
  count: number;
  locale: string;
}

export default function ContributionDay({
  date,
  count,
  locale,
}: ContributionDayProps) {
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX + 12, y: e.clientY - 30 });
  };

  const formattedDate = new Date(date).toLocaleDateString(
    locale === "en" ? "en-US" : "fr-FR",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  const contributionText =
    locale === "en"
      ? `${count} contribution${count !== 1 ? "s" : ""}`
      : `${count} contribution${count > 1 ? "s" : ""}`;

  return (
    <>
      <div
        className={`${styles.contributions__day} ${
          count > 0 ? "bg-[var(--accent)]" : "bg-zinc-900"
        }`}
        style={{
          opacity: count > 0 ? (count * 0.1 > 0.25 ? count * 0.1 : 0.25) : "",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      />
      {showTooltip && (
        <span
          className={styles.contributions__tooltip}
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
        >
          <strong>{formattedDate}</strong>
          <span>{contributionText}</span>
        </span>
      )}
    </>
  );
}
