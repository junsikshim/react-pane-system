import type { Component } from 'react';
import type { PaneSystemComponentType } from './PaneSystem';

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

// Convert size to pixels
export const sizeToPixels = (size: string | number, relativeTo: number) => {
  if (typeof size === 'number') return size;

  // Remove 'calc(' and ')'
  const exp = size.replace(/calc\(|\)/g, '').trim();
  const parts = exp.split(/([+\-*/])/).map((p) => p.trim());

  let r = 0;
  let op = '+';

  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];

    if (!p) continue;

    // If it's an operator, store it
    if (['+', '-', '*', '/'].includes(p)) {
      op = p;
      continue;
    }

    let v = 0;

    // Handle each units
    if (p.includes('%')) {
      const percent = parseFloat(p);
      v = (percent / 100) * relativeTo;
    } else if (p.includes('px')) {
      v = parseFloat(p);
    } else {
      v = parseFloat(p);
    }

    // Apply the operator
    switch (op) {
      case '+':
        r += v;
        break;

      case '-':
        r -= v;
        break;

      case '*':
        r *= v;
        break;

      case '/':
        r /= v;
        break;
    }
  }

  return r;
};
