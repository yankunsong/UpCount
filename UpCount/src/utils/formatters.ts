/**
 * Formatting utility functions
 */

/**
 * Format a date to a readable string
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format a number with appropriate units
 */
export const formatValue = (value: number, unit: string): string => {
  return `${value} ${unit}`;
};

/**
 * Calculate progress percentage
 */
export const calculateProgress = (current: number, target: number): number => {
  const progress = (current / target) * 100;
  return Math.min(progress, 100); // Cap at 100%
};

/**
 * Format a percentage value
 */
export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};
