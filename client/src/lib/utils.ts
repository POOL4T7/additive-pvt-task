import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MAX_WIDTH = 500;
export const MAX_HEIGHT = 500;
export const MAX_SIZE_MB = 1;
export const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
