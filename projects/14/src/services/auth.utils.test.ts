import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatDuration,
  generateActivityText,
  type ActivityType,
  generateActivities,
  calculateStat,
  formatNumber,
  formatCurrency,
} from './utils/auth.utils';

describe('auth.utils', () => {
  describe('formatDate', () => {
    it('should format date to readable string', () => {
      const date = new Date('2024-03-20T14:30:00');
      const formatted = formatDate(date);

      expect(formatted).toContain('Mar');
      expect(formatted).toMatch(/\d{1,2}/);
      expect(formatted).toMatch(/\d{1,2}/);
    });

    it('should format date from string', () => {
      const formatted = formatDate('2024-03-20T14:30:00');

      expect(formatted).toBeDefined();
    });
  });

  describe('formatDuration', () => {
    it('should format milliseconds to seconds ago', () => {
      const formatted = formatDuration(5000);
      expect(formatted).toMatch(/5s ago/);
    });

    it('should format milliseconds to minutes ago', () => {
      const formatted = formatDuration(300000);
      expect(formatted).toMatch(/5m ago/);
    });

    it('should format hours ago', () => {
      const formatted = formatDuration(3600000);
      expect(formatted).toMatch(/1h/);
    });
  });

  describe('generateActivityText', () => {
    it('should generate activity text for dashboard view', () => {
      const text = generateActivityText('dashboard_view');
      expect(text).toBeDefined();
      expect(text).not.toBe('');
    });

    it('should generate different activity texts', () => {
      const activities: ActivityType[] = [
        'dashboard_view',
        'email_received',
        'settings_changed',
        'login',
        'logout',
      ];

      activities.forEach((type) => {
        const text = generateActivityText(type);
        expect(text).toBeDefined();
        expect(text).not.toBe('');
      });
    });
  });

  describe('generateActivities', () => {
    it('should generate multiple activities', () => {
      const activities = generateActivities(3);

      expect(activities).toHaveLength(3);
      expect(activities.every((a) => a.type)).toBe(true);
      expect(activities.every((a) => a.icon)).toBe(true);
      expect(activities.every((a) => a.text)).toBe(true);
      expect(activities.every((a) => a.time)).toBe(true);
    });

    it('should accept custom count', () => {
      const activities = generateActivities(5);

      expect(activities).toHaveLength(5);
    });
  });

  describe('calculateStat', () => {
    it('should return base value with no variance', () => {
      const value = calculateStat(100);
      expect(value).toBe(100);
    });

    it('should return value with variance', () => {
      const value = calculateStat(1000, 50);
      expect(value).toBeGreaterThanOrEqual(950);
      expect(value).toBeLessThanOrEqual(1050);
    });
  });

  describe('formatNumber', () => {
    it('should format 1000 as 1,000', () => {
      expect(formatNumber(1000)).toBe('1,000');
    });

    it('should format 12345 as 12,345', () => {
      expect(formatNumber(12345)).toBe('12,345');
    });

    it('should handle large numbers', () => {
      expect(formatNumber(1234567)).toBe('1,234,567');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(45230)).toBe('$45,230');
      expect(formatCurrency(100)).toBe('$100');
      expect(formatCurrency(0)).toBe('$0');
    });
  });
});
