export interface ApiResponse<T> {
  status?: boolean;
  message?: string;
  errorCode?: string;
  data?: T;
}
