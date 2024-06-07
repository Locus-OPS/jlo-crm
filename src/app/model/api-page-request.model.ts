import { ApiRequest } from './api-request.model';

export interface ApiPageRequest<T> extends ApiRequest<T> {
  pageSize: number;
  pageNo: number;
}
