export class ApiResponseDTO<T> {
  public readonly timestamp: string;

  private constructor(
    public readonly success: boolean,
    public readonly statusCode: number,
    public readonly data: T | null = null,
    public readonly error: string | null = null
  ) {
    this.timestamp = new Date().toISOString();
  }

  static success<T>(data: T, statusCode: number = 200): ApiResponseDTO<T> {
    return new ApiResponseDTO<T>(true, statusCode, data, null);
  }

  static error(message: string, statusCode: number = 500): ApiResponseDTO<null> {
    return new ApiResponseDTO<null>(false, statusCode, null, message);
  }
}
