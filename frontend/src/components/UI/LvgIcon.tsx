import React from "react";

type LvgIconProps = {
  name:
    | "search"
    | "bag"
    | "clock"
    | "check"
    | "x"
    | "plus"
    | "minus"
    | "user"
    | "globe"
    | "chef"
    | "spark"
    | "trend"
    | "filter"
    | "leaf"
    | "euro"
    | "menu"
    | "edit"
    | "trash"
    | "alert"
    | "upload"
    | "refresh"
    | "heart";
  className?: string;
};

const primeIconByName: Record<LvgIconProps["name"], string> = {
  search: "pi pi-search",
  bag: "pi pi-shopping-bag",
  clock: "pi pi-clock",
  check: "pi pi-check",
  x: "pi pi-times",
  plus: "pi pi-plus",
  minus: "pi pi-minus",
  user: "pi pi-user",
  globe: "pi pi-globe",
  chef: "pi pi-star",
  spark: "pi pi-sparkles",
  trend: "pi pi-chart-line",
  filter: "pi pi-filter",
  leaf: "pi pi-sparkles",
  euro: "pi pi-euro",
  menu: "pi pi-bars",
  edit: "pi pi-pencil",
  trash: "pi pi-trash",
  alert: "pi pi-exclamation-triangle",
  upload: "pi pi-upload",
  refresh: "pi pi-refresh",
  heart: "pi pi-heart",
};

export default function LvgIcon({ name, className = "" }: LvgIconProps) {
  return (
    <i
      className={`${primeIconByName[name]} ${className}`.trim()}
      aria-hidden="true"
    />
  );
}
