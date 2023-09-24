import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileUploader } from 'ng2-file-upload';

import { environment as env } from 'src/environments/environment';
import { ApiRoutes } from '../enums/api-routes';
import { Transcipt } from 'src/common/types';
import { Observable } from 'rxjs';

const API_URL = env.apiUrl;


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public transcribeUploader: FileUploader;

  /*
  public translateUploader: FileUploader;
  */

  constructor(private http: HttpClient) {

    this.transcribeUploader = new FileUploader({
      url: API_URL + ApiRoutes.Transcribe,
      formatDataFunctionIsAsync: false,
      autoUpload: true
    });

    /*
    this.translateUploader = new FileUploader({
      url: API_URL + ApiRoutes.Translate,
      formatDataFunctionIsAsync: false,
      autoUpload: true
    });
    */

  }

  status(trc: Transcipt): Observable<Transcipt> {
    return new Observable<Transcipt>((observer) => {
      this.http.get(API_URL + ApiRoutes.Status, { params: { "task_id": trc.task_id } }).subscribe({
        next(res) {
          observer.next(res as Transcipt);
        },
        error(err) {
          console.error('Unknown Error: ' + err);
          observer.error(err);
        },
        complete() {
          observer.complete();
        },
      });
    });
  }

  transcribe(file: File): Observable<Transcipt> {
    this.transcribeUploader.addToQueue([file]);
    return new Observable<Transcipt>((observer) => {
      this.transcribeUploader.response.subscribe({
        next(res: Object) {
          const resObject = JSON.parse(res as string);
          observer.next(resObject as Transcipt);
        },
        error(err: any) {
          console.error('Unknown Error: ' + err);
          observer.error(err);
        },
        complete() {
          observer.complete();
        },
      });
    });
  }

  /*
  translate(file: File) {
    this.translateUploader.addToQueue([file]);
  }
  */

  userinfo() {
    return this.http.get(API_URL + ApiRoutes.UserInfo);
  }

}
