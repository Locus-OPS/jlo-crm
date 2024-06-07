import { Injectable } from '@angular/core';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiService } from 'src/app/services/api.service';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private rootPath = environment.endpoint;

  constructor(
    private api: ApiService,
    private http: HttpClient
  ) { }

  getMemberById(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/member/getMemberById', param);
  }

  saveMember(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/member/saveMember', param);
  }

  getMemberAddressList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/member/getMemberAddressList', param);
  }

  saveMemberAddress(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/member/saveMemberAddress', param);
  }

  deleteMemberAddress(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/member/deleteMemberAddress', param);
  }

  getMemberAddressPrimary(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/member/getMemberAddressPrimary', param);
  }

  getMemberCardList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/member/getMemberCardList', param);
  }

  getMemberAttachmentList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/member/getMemberAttachmentList', param);
  }

  createAttachment(file: File, param) {
    const formdata: FormData = new FormData();
    if (file) {
      formdata.append('file', file);
    }
    formdata.append('memberId', param.memberId ? param.memberId.toString() : '');
    formdata.append('memberAttId', param.memberAttId ? param.memberAttId.toString() : '');
    formdata.append('attId', param.attId ? param.attId.toString() : '');
    formdata.append('title', param.title ? param.title.toString() : '');
    formdata.append('descp', param.descp ? param.descp.toString() : '');
  
    const req = new HttpRequest('POST', this.api.getRootPath() + '/api/member/createAttachment', formdata, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
  }

  deleteMemberAttachment(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/member/deleteMemberAttachment', param);
  }

  getDocPath(filePath: string, fileName: string) {
    const formdata: FormData = new FormData();
    formdata.append('fileName', fileName);

    const req = new HttpRequest('GET', this.api.getRootPath() + '/api/member/doc?filePath='+encodeURIComponent(filePath+"/"+fileName), formdata, {
      reportProgress: true,
      responseType: 'arraybuffer'      
    });
    this.http.get( this.api.getRootPath() + '/api/member/doc?filePath='+encodeURIComponent(filePath+"/"+fileName),
    {
      responseType: 'blob' as 'json'
    }).subscribe(response => this.downLoadFile(response,fileName));;
  }

  downLoadFile(response: any,filename) {
    console.log(response);
    let dataType = response.type;
    let binaryData = [];
    binaryData.push(response);
    let downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
    if (filename)
        downloadLink.setAttribute('download', filename);
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  getMemberCaseList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/member/getMemberCaseList', param);
  }

  getMemberTierList(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/member/getMemberTierList', param);
  }

  saveReIssuesCard(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/member/saveReIssuesCard', param);
  }

  saveBlockCard(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/member/saveBlockCard', param);
  }

  getMemberTransactionList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/member/getMemberTransactionList', param);
  }

  getMemberPoint(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/member/getMemberPoint', param);
  }
}
