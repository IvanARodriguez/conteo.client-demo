type ErrorResponse = {
  error: true
  response: Response
}

export function createErrorResponse(response: Response): ErrorResponse {
  return { error: true, response }
}

export function isErrorResponse<T>(
  res: (T extends Promise<unknown> ? never : T) | ErrorResponse,
): res is ErrorResponse {
  return typeof (res as any).error === 'boolean' && (res as any).error === true
}
