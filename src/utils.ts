// Convert size to pixels.
export const sizeToPixels = (size: string | number, relativeTo?: number) => {
  if (typeof size === 'number') return size;

  const [number, unit] = size.split(/(\d+)/).filter(Boolean);

  const parsedNumber = parseFloat(number);
  const parsedUnit = unit.trim();

  if (Number.isNaN(parsedNumber)) return 0;

  switch (parsedUnit) {
    case 'px':
      return parsedNumber;
    case '%':
      return (relativeTo ?? 0) * (parsedNumber / 100);
    default:
      return 0;
  }
};

// Limit the given number to the given range.
export const limit = (number: number, min: number, max: number) => {
  return Math.min(Math.max(number, min), max);
};
