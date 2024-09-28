export class ApiError {
  message?: string;
  type?: string;
  errors?: { [key: string]: string[] };

  private constructor({
    message,
    type,
    errors,
  }: {
    message?: string;
    type?: string;
    errors?: { [key: string]: string[] };
  }) {
    this.message = message;
    this.type = type;
    this.errors = errors;
  }

  static fromJson(json: Record<string, any>): ApiError {
    return new ApiError({
      message: json.message,
      type: json.type,
      errors: json.errors,
    });
  }
}
