import type { ApiResponse } from "@/types";

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return { data, error: null, success: true };
}

export function createErrorResponse<T>(error: string): ApiResponse<T> {
  return { data: null, error, success: false };
}

export async function handleApiError(error: unknown): Promise<ApiResponse<never>> {
  if (error instanceof ApiError) {
    return createErrorResponse(error.message);
  }
  if (error instanceof Error) {
    return createErrorResponse(error.message);
  }
  return createErrorResponse("An unexpected error occurred");
}
