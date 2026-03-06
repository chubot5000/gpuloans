import { format } from "date-fns";

import { printNumber } from "./numbers";

const ONE_DAY_IN_SECONDS = 86400;
const MILLISECONDS_IN_SECONDS = 1000;

export function getDaysFromSeconds(seconds: number): number {
  return Math.round(seconds / ONE_DAY_IN_SECONDS);
}

export function getSecondsFromDays(days: number): number {
  return Math.round(days * ONE_DAY_IN_SECONDS);
}

interface FormatDateOptions {
  showTime?: boolean;
  customFormat?: string;
}

export function formatDate(date: number | Date, options?: FormatDateOptions): string {
  const { showTime, customFormat } = options ?? {};

  const dateObj = typeof date === "number" ? new Date(date * MILLISECONDS_IN_SECONDS) : date;

  let fmt = customFormat;
  if (!fmt) {
    fmt = "dd MMM yyyy";
    if (showTime) fmt = `${fmt}, h:mm a`;
  }

  return format(dateObj, fmt);
}

export function formatTimeRemaining(seconds: number): string {
  const ago = seconds < 0;

  seconds = Math.abs(seconds);

  if (seconds <= 0) return "0s";

  if (seconds < 60) return `< 60s${ago ? " ago" : ""}`;

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  return `${parts.join(" ")}${ago ? " ago" : ""}`;
}

export function secondsToDaysOrMinutes(seconds: number): string {
  return seconds < 86400 ? `${Math.floor(seconds / 60)} Minutes` : `${getDaysFromSeconds(seconds)} Days`;
}

export function secondsToDaysMinutesOrYears(seconds: number) {
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return `${hours} hour${hours === 1 ? "" : "s"} ${minutes} minute${minutes === 1 ? "" : "s"}`;
  }

  if (seconds < 31536000) {
    const days = Math.floor(seconds / 86400);

    return `${days} day${days === 1 ? "" : "s"}`;
  }

  const yearsValue = seconds / 31536000;
  const isWholeNumber = yearsValue % 1 === 0;

  const years = printNumber(yearsValue, {
    maximumFractionDigits: isWholeNumber ? 0 : 1,
    minimumFractionDigits: 0,
  });

  return `${years} year${yearsValue === 1 ? "" : "s"}`;
}

export function dateToStartOfDayUTC(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0));
}

export function dateToEndOfDayUTC(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59));
}

/**
 * Formats a date using UTC values instead of local timezone
 * @dev This because date-fns output varies based on the user's timezone
 * @param date - The date to format
 * @param formatStr - The format string (e.g., "dd-MMM", "yyyy-MM-dd")
 * @returns Formatted date string in UTC
 */
export function formatUTC(date: Date, formatStr: string): string {
  // Create a date where local time = UTC time by offsetting by timezone difference
  const utcDate = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  );

  return format(utcDate, formatStr);
}

/**
 * Formats a date/time range in local timezone
 * @param start - ISO date string for start time
 * @param end - Optional ISO date string for end time
 * @returns Formatted string like "19:00 - 19:45, Monday, August 19, 2024"
 */
export function formatLocalDateTime(start: string, end?: string): string {
  const startDate = new Date(start);
  const timeStr = format(startDate, "HH:mm");
  const dateStr = format(startDate, "EEEE, MMMM d, yyyy");

  if (!end) return `${timeStr}, ${dateStr}`;

  const endTimeStr = format(new Date(end), "HH:mm");
  return `${timeStr} - ${endTimeStr}, ${dateStr}`;
}

export function formatDuration(duration: number) {
  const SECONDS_IN_MINUTE = 60;
  const SECONDS_IN_HOUR = 3600;
  const SECONDS_IN_DAY = 86400;
  //const SECONDS_IN_MONTH = 2592000; // 30 days

  //if (duration >= SECONDS_IN_MONTH) {
  //  const months = Math.floor(duration / SECONDS_IN_MONTH);
  //  return `${months} month${months == 1 ? "" : "s"}`;
  //}

  if (duration >= SECONDS_IN_DAY) {
    const days = Math.floor(duration / SECONDS_IN_DAY);
    return `${printNumber(days)} day${days == 1 ? "" : "s"}`;
  }

  if (duration >= SECONDS_IN_HOUR) {
    const hours = Math.floor(duration / SECONDS_IN_HOUR);
    return `${hours} hour${hours == 1 ? "" : "s"}`;
  }

  const minutes = Math.floor(duration / SECONDS_IN_MINUTE);
  return `${minutes} minute${minutes == 1 ? "" : "s"}`;
}
