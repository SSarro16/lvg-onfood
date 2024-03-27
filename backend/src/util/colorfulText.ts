
type Color = "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "reset";

type Colors = {
  [color in Color]: number;
};

const COLORS: Colors = {
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37,
  reset: 0
}



const colorfulText = (text: string, color: Color) => {
  const color_code = COLORS[color];

  if (typeof color_code !== "number") {
    return text;
  }
  return `\x1b[${color_code}m${text}\x1b[0m`;
}

export default colorfulText;