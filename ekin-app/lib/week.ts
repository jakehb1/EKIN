export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function formatWeek(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

export function getPreviousWeek(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - 7);
  return getWeekStart(d);
}

export function getNextWeek(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + 7);
  return getWeekStart(d);
}

export function isCurrentWeek(date: Date): boolean {
  const currentWeekStart = getWeekStart(new Date());
  const weekStart = getWeekStart(date);
  return currentWeekStart.getTime() === weekStart.getTime();
}

export function canEditWeek(weekStart: Date): boolean {
  const currentWeekStart = getWeekStart(new Date());
  return weekStart.getTime() === currentWeekStart.getTime();
}
