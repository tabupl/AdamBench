

/**
 * Format date to readable string
 */
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format duration to readable string
 */
export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ago`;
  }
  if (minutes > 0) {
    return `${minutes}m ago`;
  }
  return `${seconds}s ago`;
};

/**
 * Generate activity text
 */
export const generateActivityText = (
  type: ActivityType,
  timestamp: number = Date.now()
): string => {
  const now = new Date();
  now.setTime(now.getTime() - timestamp);

  // Mark as intentionally unused
  void type;
  const minutes = Math.floor(now.getUTCMinutes());
  if (minutes === 0) return `Just now`;
  return `${minutes} minutes ago`;
};

/**
 * Activity type enum
 */
export type ActivityType =
  | 'dashboard_view'
  | 'email_received'
  | 'settings_changed'
  | 'login'
  | 'logout';

/**
 * Generate activity items
 */
export const generateActivities = (count: number = 3): Array<{
  type: ActivityType;
  icon: string;
  text: string;
  time: string;
}> => {
  const activities: Array<{
    type: ActivityType;
    icon: string;
    text: string;
    time: string;
  }> = [];

  const types: ActivityType[] = ['dashboard_view', 'email_received', 'settings_changed'];
  const icons = ['📊', '📧', '⚙️'];
  const texts = ['New dashboard view', 'New email received', 'Settings updated'];

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const icon = icons[Math.floor(Math.random() * icons.length)];
    const text = texts[Math.floor(Math.random() * texts.length)];
    const time = Math.floor(Math.random() * 100) + 1;

    activities.push({
      type,
      icon,
      text,
      time: `${time} minutes ago`,
    });
  }

  return activities;
};

/**
 * Calculate stat value with random variation
 */
export const calculateStat = (base: number, variance?: number): number => {
  const variation = variance ? (Math.random() * variance - variance / 2) : 0;
  return Math.round(base + variation);
};

/**
 * Format number with thousands separator
 */
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Format currency
 */
export const formatCurrency = (amount: number): string => {
  return `$${formatNumber(amount)}`;
};
