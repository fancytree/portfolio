export const BUSINESS_TIME_ZONE = 'Europe/Rome';

type DateValue = string | number | Date | null | undefined;

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: BUSINESS_TIME_ZONE,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const dateTimeMinuteFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: BUSINESS_TIME_ZONE,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

const dateTimeSecondFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: BUSINESS_TIME_ZONE,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

const timeMinuteFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: BUSINESS_TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

function parts(formatter: Intl.DateTimeFormat, value: Date) {
  return Object.fromEntries(
    formatter.formatToParts(value)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  );
}

function parseDateValue(value: DateValue): Date | null {
  if (value == null || value === '') return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** 用户界面日期：DD/MM/YYYY。纯日期值不经过时区换算。 */
export function formatBusinessDate(value: DateValue, fallback = '—'): string {
  if (typeof value === 'string') {
    const match = DATE_ONLY_PATTERN.exec(value.slice(0, 10));
    if (match && value.length === 10) return `${match[3]}/${match[2]}/${match[1]}`;
  }

  const date = parseDateValue(value);
  if (!date) return fallback;
  const valueParts = parts(dateFormatter, date);
  return `${valueParts.day}/${valueParts.month}/${valueParts.year}`;
}

/** 用户界面日期时间：DD/MM/YYYY HH:mm，固定 Europe/Rome 与 24 小时制。 */
export function formatBusinessDateTime(value: DateValue, fallback = '—'): string {
  const date = parseDateValue(value);
  if (!date) return fallback;
  const valueParts = parts(dateTimeMinuteFormatter, date);
  return `${valueParts.day}/${valueParts.month}/${valueParts.year} ${valueParts.hour}:${valueParts.minute}`;
}

/** 精确日志时间：DD/MM/YYYY HH:mm:ss。 */
export function formatBusinessDateTimeSeconds(value: DateValue, fallback = '—'): string {
  const date = parseDateValue(value);
  if (!date) return fallback;
  const valueParts = parts(dateTimeSecondFormatter, date);
  return `${valueParts.day}/${valueParts.month}/${valueParts.year} ${valueParts.hour}:${valueParts.minute}:${valueParts.second}`;
}

/** 时间段等需要单独显示时间时使用：HH:mm。 */
export function formatBusinessTime(value: DateValue, fallback = '—'): string {
  const date = parseDateValue(value);
  if (!date) return fallback;
  const valueParts = parts(timeMinuteFormatter, date);
  return `${valueParts.hour}:${valueParts.minute}`;
}
