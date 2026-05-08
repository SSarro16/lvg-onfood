import React from "react";
import LvgIcon from "./LvgIcon";

type LvgBadgeProps = {
  children: React.ReactNode;
  icon?: "check" | "clock" | "x" | "alert" | "chef";
  tone?: "success" | "warn" | "danger" | "dark";
  className?: string;
};

export default function LvgBadge({
  children,
  icon,
  tone = "dark",
  className = "",
}: LvgBadgeProps) {
  return (
    <span className={`lvg-badge lvg-badge--${tone} ${className}`.trim()}>
      {icon && <LvgIcon name={icon} />}
      {children}
    </span>
  );
}
