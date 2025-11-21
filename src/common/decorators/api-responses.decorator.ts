import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

/**
 * Common API error response decorator for 400 Bad Request
 */
export const ApiBadRequestResponse = () =>
  ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data or validation failed',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          oneOf: [
            { type: 'string', example: 'Validation failed' },
            {
              type: 'array',
              items: { type: 'string' },
              example: ['email must be a valid email', 'password is required'],
            },
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  });

/**
 * Common API error response decorator for 401 Unauthorized
 */
export const ApiUnauthorizedResponseCustom = () =>
  ApiResponse({
    status: 401,
    description:
      'Unauthorized - Authentication failed or token is invalid/missing',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
      },
    },
  });

/**
 * Common API error response decorator for 404 Not Found
 */
export const ApiNotFoundResponseCustom = (resourceName = 'Resource') =>
  ApiResponse({
    status: 404,
    description: `${resourceName} not found`,
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: `${resourceName} not found` },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  });

/**
 * Common API error response decorator for 409 Conflict
 */
export const ApiConflictResponseCustom = (
  message = 'Resource already exists',
) =>
  ApiResponse({
    status: 409,
    description: 'Conflict - Resource already exists',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: { type: 'string', example: message },
        error: { type: 'string', example: 'Conflict' },
      },
    },
  });

/**
 * Common API error response decorator for 500 Internal Server Error
 */
export const ApiInternalServerErrorResponseCustom = () =>
  ApiResponse({
    status: 500,
    description: 'Internal Server Error - Unexpected error occurred',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: {
          type: 'string',
          example: 'Internal server error',
        },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  });

/**
 * Combines common error responses for convenience
 */
export const ApiCommonErrorResponses = () =>
  applyDecorators(
    ApiBadRequestResponse(),
    ApiUnauthorizedResponseCustom(),
    ApiInternalServerErrorResponseCustom(),
  );

/**
 * Success response with custom type
 */
export const ApiSuccessResponse = <T>(
  status: number,
  description: string,
  type?: Type<T>,
) => {
  if (type) {
    return ApiResponse({
      status,
      description,
      type,
    });
  }
  return ApiResponse({
    status,
    description,
  });
};
