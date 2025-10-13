import { format } from 'date-fns';

type LogLevel = 'INFO' | 'ERROR' | 'WARN' | 'DEBUG';

interface LogContext {
  method?: string;
  url?: string;
  status?: number;
  error?: unknown;
  [key: string]: unknown;
}

// ANSI 색상 코드
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',

  gray: '\x1b[90m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
};

const getTimestamp = (): string => format(new Date(), 'yyyy-MM-dd HH:mm:ss');

const getLevelColor = (level: LogLevel): string => {
  switch (level) {
    case 'INFO': return colors.cyan;
    case 'ERROR': return colors.red;
    case 'WARN': return colors.yellow;
    case 'DEBUG': return colors.magenta;
  }
};

const getStatusColor = (status: number): string => {
  if (status >= 200 && status < 300) return colors.green;
  if (status >= 300 && status < 400) return colors.cyan;
  if (status >= 400 && status < 500) return colors.yellow;
  return colors.red;
};

const getMethodColor = (method: string): string => {
  switch (method.toUpperCase()) {
    case 'GET': return colors.blue;
    case 'POST': return colors.green;
    case 'PUT': return colors.yellow;
    case 'DELETE': return colors.red;
    case 'PATCH': return colors.magenta;
    default: return colors.gray;
  }
};

const formatMessage = (level: LogLevel, message: string, context?: LogContext): string => {
  const timestamp = `${colors.gray}[${getTimestamp()}]${colors.reset}`;
  const levelColor = getLevelColor(level);
  const levelText = `${levelColor}${level}${colors.reset}`;

  let formatted = `${timestamp} ${levelText}`;

  if (context?.method && context?.url) {
    const methodColor = getMethodColor(context.method);
    formatted += ` ${colors.dim}:${colors.reset} ${methodColor}${context.method}${colors.reset} ${colors.bright}${context.url}${colors.reset}`;
  }

  if (context?.status) {
    const statusColor = getStatusColor(context.status);
    formatted += ` ${statusColor}[${context.status}]${colors.reset}`;
  }

  formatted += ` ${colors.dim}-${colors.reset} ${message}`;

  return formatted;
};

const log = (level: LogLevel, message: string, context?: LogContext): void => {
  const formatted = formatMessage(level, message, context);

  if (level === 'ERROR') {
    console.error(formatted);
    if (context?.error) {
      console.error(`${colors.red}Error details:${colors.reset}`, context.error);
    }
  } else if (level === 'WARN') {
    console.warn(formatted);
  } else {
    console.log(formatted);
  }
};

export const logger = {
  info: (message: string, context?: LogContext) => log('INFO', message, context),
  error: (message: string, context?: LogContext) => log('ERROR', message, context),
  warn: (message: string, context?: LogContext) => log('WARN', message, context),
  debug: (message: string, context?: LogContext) => {
    if (process.env.NODE_ENV === 'development') log('DEBUG', message, context);
  },
  request: (method: string, url: string) => log('INFO', 'Request started', { method, url }),
  response: (method: string, url: string, status: number, duration?: number) => {
    const message = duration ? `Response completed in ${colors.cyan}${duration}ms${colors.reset}` : 'Response completed';
    log('INFO', message, { method, url, status });
  },
  apiError: (method: string, url: string, error: unknown) =>
    log('ERROR', 'API request failed', { method, url, error }),
};
