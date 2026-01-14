/**
 * Safely converts a value to a Date object
 * @param dateValue - Can be Date, string, number, or undefined
 * @returns Date object or null if invalid
 */
export const safeDate = (dateValue: Date | string | number | undefined): Date | null => {
  if (!dateValue) return null;
  
  try {
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
};

/**
 * Formats a date value to a readable string
 * @param dateValue - Can be Date, string, number, or undefined
 * @returns Formatted date string or empty string if invalid
 */
export const formatDate = (dateValue: Date | string | number | undefined): string => {
  const date = safeDate(dateValue);
  if (!date) return '';
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Gets ISO string from date value
 * @param dateValue - Can be Date, string, number, or undefined
 * @returns ISO string or empty string if invalid
 */
export const toISOString = (dateValue: Date | string | number | undefined): string => {
  const date = safeDate(dateValue);
  return date ? date.toISOString() : '';
};