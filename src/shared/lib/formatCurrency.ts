/**
 * Formats a number as USD currency
 * @param value - The numeric value to format
 * @param options - Intl.NumberFormat options
 * @returns Formatted currency string (e.g., "$50,123.45")
 */
export function formatCurrency(
  value: number,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
}

