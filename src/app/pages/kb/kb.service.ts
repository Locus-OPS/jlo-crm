import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { Observable } from 'rxjs';
import { HttpEvent, HttpRequest, HttpClient } from '@angular/common/http';
import { KbDocument } from './kb.model';

@Injectable({
  providedIn: 'root'
})
export class KbService {

  constructor(
    private api: ApiService,
    private http: HttpClient
  ) { }

  getKbTreeList(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/kb/getKbTreeList', param);
  }

  getFavKbTreeList(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/kb/getFavKbTreeList', param);
  }

  getKbTreeFolderList(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/kb/getKbTreeFolderList', param);
  }

  saveKbDetail(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/kb/saveKbDetail', param);
  }

  saveKbDetailInfo(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/kb/saveKbDetailInfo', param);
  }

  findKbDetailById(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/kb/findKbDetailById', param);
  }

  getKbDetailInfoById(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/kb/findKbDetailInfoById', param);
  }

  getKbKeywordList(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/kb/getKbKeywordList', param);
  }

  updateKeywordByContentId(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/kb/updateKeywordByContentId', param);
  }

  getKbDocumentList(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/kb/getKbDocumentList2', param);
  }

  getKbMainDocument(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/kb/getKbMainDocument', param);
  }

  saveKbDocument(file: File, document: KbDocument): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    if (file) {
      formdata.append('file', file);
    }
    formdata.append('contentAttId', document.contentAttId ? document.contentAttId.toString() : '');
    formdata.append('attId', document.attId ? document.attId.toString() : '');
    formdata.append('contentId', document.contentId.toString());
    formdata.append('title', document.title);
    formdata.append('descp', document.descp ? document.descp.toString() : '');
    formdata.append('mainFlag', document.mainFlag);
    const req = new HttpRequest('POST', this.api.getRootPath() + '/api/kb/saveKbDocument', formdata, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
  }

  deleteKbDocumentById(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/kb/deleteKbDocumentById', param);
  }

  getKbDocPath(filePath: string, fileName: string) {
    return this.api.getRootPath() + '/api/kb/doc?filePath=' + encodeURI(filePath + '/' + fileName);
  }

  saveKBFolder(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/kb/saveKBFolder', param);
  }

  deleteKbFolder(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/kb/deleteKbFolderById', param);
  }

  updateKbFolderSequence(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/kb/updateKbFolderSequenceById', param);
  }

  deleteKbFile(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/kb/deleteKbFileById', param);
  }

  updateKbFileSequence(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/kb/updateKbFileSequenceById', param);
  }

}
