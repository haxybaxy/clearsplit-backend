import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from './logger.service';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly context = 'HTTP';

  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const startTime = Date.now();
    const method = req.method;
    const originalUrl = req.originalUrl;
    const body: unknown = req.body;

    // Log incoming request
    this.logger.debugWithData(
      `→ ${method} ${originalUrl}`,
      this.sanitizeBody(body),
      this.context,
    );

    // Capture response
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const { statusCode } = res;

      const logData = {
        method,
        url: originalUrl,
        statusCode,
        duration: `${duration}ms`,
      };

      if (statusCode >= 500) {
        this.logger.errorWithData(
          `← ${method} ${originalUrl} ${statusCode}`,
          logData,
          this.context,
        );
      } else if (statusCode >= 400) {
        this.logger.warnWithData(
          `← ${method} ${originalUrl} ${statusCode}`,
          logData,
          this.context,
        );
      } else {
        this.logger.info(
          `← ${method} ${originalUrl} ${statusCode} (${duration}ms)`,
          undefined,
          this.context,
        );
      }
    });

    next();
  }

  private sanitizeBody(body: unknown): unknown {
    if (!body || typeof body !== 'object') return body;

    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'authorization',
      'apiKey',
    ];
    const sanitized = { ...body } as Record<string, unknown>;

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }
}
