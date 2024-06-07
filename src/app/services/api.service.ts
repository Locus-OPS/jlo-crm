import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { ApiResponse } from '../model/api-response.model';
import { Dropdown } from '../model/dropdown.model';
import { DropdownModel } from '../model/dropdown.model';
import { ApiRequest } from '../model/api-request.model';
import { ApiPageRequest } from '../model/api-page-request.model';
import { ApiPageResponse } from '../model/api-page-response.model';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {


  private rootPath = environment.endpoint;

  constructor(
    private http: HttpClient
  ) { }

  getRootPath() {
    return this.rootPath;
  }

  call(path: string, param: ApiRequest<any> | ApiPageRequest<any>): Promise<ApiResponse<any>> | Promise<ApiPageResponse<any>> {
    return this.http.post(this.rootPath + path, param).toPromise();
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

  getMultipleCodebookByCodeType(param: ApiRequest<any>): Promise<ApiResponse<Map<string, Dropdown[]>>> {
    return this.http.post(this.rootPath + '/api/selector/getMultipleCodebookByCodeType', param).toPromise();
  }

  getCodebookByCodeType(param: ApiRequest<any>): Promise<ApiResponse<Dropdown[]>> {
    return this.http.post(this.rootPath + '/api/selector/getCodebookByCodeType', param).toPromise();
  }

  getCodebookByCodeTypeAndParentId(param: ApiRequest<any>): Promise<ApiResponse<Dropdown[]>> {
    return this.http.post(this.rootPath + '/api/selector/getCodebookByCodeTypeAndParentId', param).toPromise();
  }

  getBusinessUnit(): Promise<ApiResponse<Dropdown[]>> {
    return this.http.post(this.rootPath + '/api/selector/getBusinessUnit', {}).toPromise();
  }

  getRole(): Promise<ApiResponse<Dropdown[]>> {
    return this.http.post(this.rootPath + '/api/selector/getRole', {}).toPromise();
  }

  getPosition(): Promise<ApiResponse<Dropdown[]>> {
    return this.http.post(this.rootPath + '/api/selector/getPosition', {}).toPromise();
  }

  getProgram(): Promise<ApiResponse<Dropdown[]>> {
    return this.http.post(this.rootPath + '/api/selector/getProgram', {}).toPromise();
  }

  getParentProductCategory(param): Promise<ApiResponse<Dropdown[]>> {
    return this.http.post(this.rootPath + '/api/selector/getParentProductCategory', param).toPromise();
  }

  getProductCategory(): Promise<ApiResponse<Dropdown[]>> {
    return this.http.post(this.rootPath + '/api/selector/getProductCategory', {}).toPromise();
  }

  getSaleProductCategory(): Promise<ApiResponse<DropdownModel[]>> {
    return this.http.post(this.rootPath + '/api/selector/getSaleProductCategory', {}).toPromise();
  }

  getCampaign(): Promise<ApiResponse<Dropdown[]>> {
    return this.http.post(this.rootPath + '/api/selector/getCampaign', {}).toPromise();
  }


  getShopType(): Promise<ApiResponse<Dropdown[]>> {
    return this.http.post(this.rootPath + '/api/selector/getShopType', {}).toPromise();
  }

  getMemberTier(): Promise<ApiResponse<Dropdown[]>> {
    return this.http.post(this.rootPath + '/api/selector/getMemberTier', {}).toPromise();
  }

  getCodebookType(): Promise<ApiResponse<Dropdown[]>> {
    return this.http.post(this.rootPath + '/api/selector/getCodebookType', {}).toPromise();
  }

  // Should have a common function for the below functions.
  uploadExcelApi(param: any): Promise<ApiResponse<any>> {
    return this.http.post(this.rootPath + '/api/loyalty/promotion/uploadExcel', param).toPromise();
  }

  uploadMemberExcelApi(param: any): Promise<ApiResponse<any>> {
    return this.http.post(this.rootPath + '/api/loyalty/promotion/uploadPromotionMemberExcel', param).toPromise();
  }

  uploadShopExcelApi(param: any): Promise<ApiResponse<any>> {
    return this.http.post(this.rootPath + '/api/loyalty/promotion/uploadPromotionShopExcel', param).toPromise();
  }

  uploadProgramShopExcelApi(param: any): Promise<ApiResponse<any>> {
    return this.http.post(this.rootPath + '/api/loyalty/program/uploadProgramShopExcel', param).toPromise();
  }

  getPartnerType(): Promise<any> {
    return this.http.post(this.rootPath + '/api/selector/getPartnerType', {}).toPromise();
  }

  getParentMenu(): Promise<any> {
    return this.http.post(this.rootPath + '/api/selector/getParentMenu', {}).toPromise();
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
    return this.http.get(url, { responseType: 'blob'});
  }

  uploadAttachmentApi(file: File, formdata: FormData,url : string): Observable<HttpEvent<{}>> {      
    const req = new HttpRequest('POST', this.getRootPath() + url, formdata, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
  }

  getTableList(): Promise<ApiResponse<Dropdown[]>> {
    return this.http.post(this.rootPath + '/api/selector/getTableList', {}).toPromise();
  }
 
}
