import { ApiResponse } from './api-response.model';

export interface ApiPageResponse<T> extends ApiResponse<T> {
  total?: number;
}
