import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context?: string;
  message: string;
  data?: unknown;
}

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logLevel: LogLevel;
  private readonly isProduction: boolean;

  constructor() {
    this.logLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_PRIORITY[level] <= LOG_LEVEL_PRIORITY[this.logLevel];
  }

  private formatMessage(entry: LogEntry): string {
    if (this.isProduction) {
      return JSON.stringify(entry);
    }

    const { timestamp, level, context, message, data } = entry;
    const contextStr = context ? `[${context}] ` : '';
    const dataStr = data ? `\n${JSON.stringify(data, null, 2)}` : '';
    const levelColor = this.getLevelColor(level);

    return `${timestamp} ${levelColor}${level.toUpperCase().padEnd(5)}\x1b[0m ${contextStr}${message}${dataStr}`;
  }

  private getLevelColor(level: LogLevel): string {
    const colors: Record<LogLevel, string> = {
      error: '\x1b[31m', // Red
      warn: '\x1b[33m', // Yellow
      info: '\x1b[36m', // Cyan
      debug: '\x1b[35m', // Magenta
    };
    return colors[level];
  }

  private writeLog(
    level: LogLevel,
    message: string,
    context?: string,
    data?: unknown,
  ): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      context,
      message,
      ...(data !== undefined && { data }),
    };

    const output = this.formatMessage(entry);

    if (level === 'error') {
      console.error(output);
    } else if (level === 'warn') {
      console.warn(output);
    } else {
      console.log(output);
    }
  }

  error(message: string, trace?: string, context?: string): void {
    this.writeLog('error', message, context, trace ? { trace } : undefined);
  }

  warn(message: string, context?: string): void {
    this.writeLog('warn', message, context);
  }

  log(message: string, context?: string): void {
    this.writeLog('info', message, context);
  }

  debug(message: string, context?: string): void {
    this.writeLog('debug', message, context);
  }

  // Extended methods for structured logging
  info(message: string, data?: unknown, context?: string): void {
    this.writeLog('info', message, context, data);
  }

  errorWithData(message: string, data?: unknown, context?: string): void {
    this.writeLog('error', message, context, data);
  }

  warnWithData(message: string, data?: unknown, context?: string): void {
    this.writeLog('warn', message, context, data);
  }

  debugWithData(message: string, data?: unknown, context?: string): void {
    this.writeLog('debug', message, context, data);
  }
}
