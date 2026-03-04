"use client";

import { useId, useState } from "react";
import styles from "./GithubContributions.module.scss";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("Github.contributions");
  const tooltipId = useId();
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
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

  const contributionText = t("dayTooltipCount", { count });
  const dayAriaLabel = t("dayAriaLabel", { count, date: formattedDate });

  return (
    <>
      <button
        type="button"
        className={`${styles.contributions__day} ${
          count > 0 ? "bg-[var(--accent)]" : "bg-zinc-900"
        }`}
        style={{
          opacity: count > 0 ? (count * 0.1 > 0.25 ? count * 0.1 : 0.25) : "",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          setTooltipPos({
            x: rect.left + rect.width / 2,
            y: rect.top - 10,
          });
          setShowTooltip(true);
        }}
        onBlur={() => setShowTooltip(false)}
        aria-label={dayAriaLabel}
        aria-describedby={showTooltip ? tooltipId : undefined}
      />
      {showTooltip && (
        <span
          id={tooltipId}
          role="tooltip"
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
