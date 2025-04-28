import { formatNumber, formatPercentage } from '../../utils/formatters';

describe('formatNumber utility', () => {
  test('formats numbers with thousand separators', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1000000)).toBe('1,000,000');
    expect(formatNumber(1234567)).toBe('1,234,567');
  });

  test('handles zero correctly', () => {
    expect(formatNumber(0)).toBe('0');
  });

  test('handles negative numbers correctly', () => {
    expect(formatNumber(-1000)).toBe('-1,000');
    expect(formatNumber(-1234567)).toBe('-1,234,567');
  });

  test('adds plus sign when addPlus is true and number is positive', () => {
    expect(formatNumber(1000, true)).toBe('+1,000');
    expect(formatNumber(0, true)).toBe('0'); // Zero doesn't get plus sign
    expect(formatNumber(-1000, true)).toBe('-1,000'); // Negative doesn't change
  });

  test('handles null and undefined values', () => {
    expect(formatNumber(null)).toBe('N/A');
    expect(formatNumber(undefined)).toBe('N/A');
  });
});

describe('formatPercentage utility', () => {
  test('formats percentage values with fixed decimal places', () => {
    expect(formatPercentage(10)).toBe('10.0%');
    expect(formatPercentage(10.5)).toBe('10.5%');
    expect(formatPercentage(10.56)).toBe('10.6%'); // Rounds to one decimal place
  });

  test('handles zero correctly', () => {
    expect(formatPercentage(0)).toBe('0.0%');
  });

  test('handles negative values correctly', () => {
    expect(formatPercentage(-10.5)).toBe('-10.5%');
  });

  test('omits percentage symbol when includeSymbol is false', () => {
    expect(formatPercentage(10.5, false)).toBe('10.5');
    expect(formatPercentage(0, false)).toBe('0.0');
  });

  test('handles null and undefined values', () => {
    expect(formatPercentage(null)).toBe('N/A');
    expect(formatPercentage(undefined)).toBe('N/A');
  });
});