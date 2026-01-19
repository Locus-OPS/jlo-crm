import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { ApiResponse } from '../model/api-response.model';
import { Dropdown } from '../model/dropdown.model';
import { DropdownModel } from '../model/dropdown.model';
import { ApiRequest } from '../model/api-request.model';
import { ApiPageRequest } from '../model/api-page-request.model';
import { ApiPageResponse } from '../model/api-page-response.model';
import { map, Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private rootPath = environment.endpoint;

  // Cache for codebook/lookup data
  private cache = new Map<string, { data: any; timestamp: number }>();
  private CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(
    private http: HttpClient
  ) { }

  private getCacheKey(method: string, param?: any): string {
    return `${method}:${param ? JSON.stringify(param) : ''}`;
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data as T;
    }
    if (cached) {
      this.cache.delete(key);
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clearCache(): void {
    this.cache.clear();
  }

  getRootPath() {
    return this.rootPath;
  }

  call(path: string, param: ApiRequest<any> | ApiPageRequest<any>): Promise<ApiResponse<any>> | Promise<ApiPageResponse<any>> {
    return this.http.post(this.rootPath + path, param).toPromise();
  }

  callGet(path: string, param?: ApiRequest<any> | ApiPageRequest<any>): Promise<ApiResponse<any>> | Promise<ApiPageResponse<any>> | Promise<any> {
    return this.http.get(this.rootPath + path, { params: { ...param } }).toPromise();
  }

  getProfileImagePath(pictureUrl: string) {
    return this.rootPath + '/api/user/profile_image/' + pictureUrl;
  }

  getCustomerList(param): Promise<any> {
    return this.http.post(this.rootPath + '/api/customer/getCustomerList', param).toPromise();
  }

  saveCustomer(param): Promise<any> {
    return this.http.post(this.rootPath + '/api/customer/saveCustomer', param).toPromise();
  }

  getMemberList(param): Promise<any> {
    return this.http.post(this.rootPath + '/api/member/getMemberList', param).toPromise();
  }

  saveMember(param): Promise<any> {
    return this.http.post(this.rootPath + '/api/member/saveMember', param).toPromise();
  }

  getShopTypeList(param): Promise<any> {
    return this.http.post(this.rootPath + '/api/shop/getShopTypeList', param).toPromise();
  }

  saveShopType(param): Promise<any> {
    return this.http.post(this.rootPath + '/api/shop/saveShopType', param).toPromise();
  }

  uploadProfileImage(file: File, id: string, userId: string): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    formdata.append('id', id);
    formdata.append('userId', userId);
    const req = new HttpRequest('POST', this.rootPath + '/api/user/upload', formdata, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
  }

  async getMultipleCodebookByCodeType(param: ApiRequest<any>): Promise<ApiResponse<Map<string, Dropdown[]>>> {
    const cacheKey = this.getCacheKey('getMultipleCodebookByCodeType', param);
    const cached = this.getFromCache<ApiResponse<Map<string, Dropdown[]>>>(cacheKey);
    if (cached) {
      return cached;
    }
    const result = await this.http.post<ApiResponse<Map<string, Dropdown[]>>>(this.rootPath + '/common/selector/getMultipleCodebookByCodeType', param).toPromise();
    this.setCache(cacheKey, result);
    return result;
  }

  async getCodebookByCodeType(param: ApiRequest<any>): Promise<ApiResponse<Dropdown[]>> {
    const cacheKey = this.getCacheKey('getCodebookByCodeType', param);
    const cached = this.getFromCache<ApiResponse<Dropdown[]>>(cacheKey);
    if (cached) {
      return cached;
    }
    const result = await this.http.post<ApiResponse<Dropdown[]>>(this.rootPath + '/common/selector/getCodebookByCodeType', param).toPromise();
    this.setCache(cacheKey, result);
    return result;
  }

  getCodebookByCodeTypeAndParentId(param: ApiRequest<any>): Promise<ApiResponse<Dropdown[]>> {
    return this.http.post(this.rootPath + '/common/selector/getCodebookByCodeTypeAndParentId', param).toPromise();
  }

  async getBusinessUnit(): Promise<ApiResponse<Dropdown[]>> {
    const cacheKey = this.getCacheKey('getBusinessUnit');
    const cached = this.getFromCache<ApiResponse<Dropdown[]>>(cacheKey);
    if (cached) {
      return cached;
    }
    const result = await this.http.post<ApiResponse<Dropdown[]>>(this.rootPath + '/common/selector/getBusinessUnit', {}).toPromise();
    this.setCache(cacheKey, result);
    return result;
  }

  async getRole(): Promise<ApiResponse<Dropdown[]>> {
    const cacheKey = this.getCacheKey('getRole');
    const cached = this.getFromCache<ApiResponse<Dropdown[]>>(cacheKey);
    if (cached) {
      return cached;
    }
    const result = await this.http.post<ApiResponse<Dropdown[]>>(this.rootPath + '/common/selector/getRole', {}).toPromise();
    this.setCache(cacheKey, result);
    return result;
  }

  async getPosition(): Promise<ApiResponse<Dropdown[]>> {
    const cacheKey = this.getCacheKey('getPosition');
    const cached = this.getFromCache<ApiResponse<Dropdown[]>>(cacheKey);
    if (cached) {
      return cached;
    }
    const result = await this.http.post<ApiResponse<Dropdown[]>>(this.rootPath + '/common/selector/getPosition', {}).toPromise();
    this.setCache(cacheKey, result);
    return result;
  }

  async getDepartment(): Promise<ApiResponse<Dropdown[]>> {
    const cacheKey = this.getCacheKey('getDepartment');
    const cached = this.getFromCache<ApiResponse<Dropdown[]>>(cacheKey);
    if (cached) {
      return cached;
    }
    const result = await this.http.post<ApiResponse<Dropdown[]>>(this.rootPath + '/common/selector/getDepartment', {}).toPromise();
    this.setCache(cacheKey, result);
    return result;
  }

  getTeamByDepartmentId(param: ApiRequest<any>): Promise<ApiResponse<Dropdown[]>> {
    return this.http.post(this.rootPath + '/common/selector/getTeamByDepartmentId', param).toPromise();
  }


  async getCodebookType(): Promise<ApiResponse<Dropdown[]>> {
    const cacheKey = this.getCacheKey('getCodebookType');
    const cached = this.getFromCache<ApiResponse<Dropdown[]>>(cacheKey);
    if (cached) {
      return cached;
    }
    const result = await this.http.post<ApiResponse<Dropdown[]>>(this.rootPath + '/common/selector/getCodebookType', {}).toPromise();
    this.setCache(cacheKey, result);
    return result;
  }

  getParentMenu(): Promise<any> {
    return this.http.post(this.rootPath + '/common/selector/getParentMenu', {}).toPromise();
  }

  getProvince(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.http.post(this.rootPath + '/api/selector/getProvince', param).toPromise();
  }

  getDistrict(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.http.post(this.rootPath + '/api/selector/getDistrict', param).toPromise();
  }

  getSubDistrict(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.http.post(this.rootPath + '/api/selector/getSubDistrict', param).toPromise();
  }

  getPostCode(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.http.post(this.rootPath + '/api/selector/getPostCode', param).toPromise();
  }
  getPostCodeDetail(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.http.post(this.rootPath + '/api/selector/getPostCodeDetail', param).toPromise();
  }

  getAttachmentByAttId(attId: number) {
    const url = this.rootPath + '/api/attachment/getAttachmentByAttId?attId=' + attId;
    return this.http.get(url, { responseType: 'blob' });
  }

  uploadAttachmentApi(file: File, formdata: FormData, url: string): Observable<HttpEvent<{}>> {
    const req = new HttpRequest('POST', this.getRootPath() + url, formdata, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
  }

  getTableList(): Promise<ApiResponse<Dropdown[]>> {
    return this.http.post(this.rootPath + '/api/selector/getTableList', {}).toPromise();
  }

  downloadExcelFile(path, param): any {
    return this.http.post(this.rootPath + path, param, { responseType: "arraybuffer" }).pipe(
      map((res) => {
        return new Blob([res], { type: "application/vnd.openxmlformats-ficedocument.spreadsheetml.sheet" });
      })
    );
  }

}
