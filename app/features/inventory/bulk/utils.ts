import type { InputUnit } from "./bulk.model";

export function convertToQty(inputValue: number, unit: InputUnit) {
  if (!Number.isFinite(inputValue) || inputValue <= 0) return 0;

  switch (unit) {
    case "ML":
      return Math.floor(inputValue / 500);
    case "L":
      return Math.floor((inputValue * 1000) / 500);
    case "G":
      return Math.floor(inputValue / 100);
    case "Kg":
      return Math.floor(inputValue * 10);
    case "Cái":
      return Math.floor(inputValue);
    case "Lốc":
      return Math.floor(inputValue * 6);
    default:
      return 0;
  }
}
