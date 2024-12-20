import { format, parseISO, isValid } from 'date-fns';

export function formatDate(date: string | Date): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return isValid(parsedDate) ? format(parsedDate, 'MMM dd, yyyy') : 'Invalid date';
}

export function formatDateTime(date: string | Date): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return isValid(parsedDate) ? format(parsedDate, 'MMM dd, yyyy HH:mm') : 'Invalid date';
}