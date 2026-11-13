import React from "react";
import LvgIcon from "./LvgIcon";

type LvgQuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
};

export default function LvgQuantityStepper({
  value,
  onChange,
  min = 0,
  max,
  label = "Quantita",
}: LvgQuantityStepperProps) {
  const clamp = (nextValue: number) =>
    Math.max(min, max === undefined ? nextValue : Math.min(max, nextValue));

  return (
    <div className="lvg-stepper" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        aria-label="Diminuisci quantita"
      >
        <LvgIcon name="minus" />
      </button>
      <strong>{value}</strong>
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        aria-label="Aumenta quantita"
      >
        <LvgIcon name="plus" />
      </button>
    </div>
  );
}
