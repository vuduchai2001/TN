declare namespace API {
  type ErrorResponse<T> = {
    data?: T;
    msg?: string;
  };
  type SuccessResponse = {
    success: boolean;
  };
}
