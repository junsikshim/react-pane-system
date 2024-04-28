import type { Component } from 'react';
import type { PaneSystemComponentType } from './PaneSystem';

// Convert size to pixels.
export const sizeToPixels = (size: string | number, relativeTo?: number) => {
  if (typeof size === 'number') return size;

  const [number, unit] = size.split(/(\d+\.?\d*)/).filter(Boolean);

  // If there's no unit, return the number as is.
  if (!unit) return +number;

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

// Check if the given value is a valid Pane System component.
export const isPaneSystemComponent =
  (type: PaneSystemComponentType) =>
  // `any` is fine here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (value: any): value is Component & { displayName: typeof type } => {
    return (
      value &&
      typeof value === 'object' &&
      value.type &&
      value.type.displayName === type
    );
  };

// Create an unique ID.
export const createId = () => {
  return Math.random().toString(36).substring(2, 9);
};

// Check if the given values are approximately equal.
export const isEqual = (a: number, b: number, epsilon = 1) => {
  return Math.abs(a - b) < epsilon;
};
