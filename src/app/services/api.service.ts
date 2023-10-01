import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';

import { environment as env } from 'src/environments/environment';
import { ApiRoutes } from '../enums/api-routes';
import { Transcipt } from 'src/common/types';
import { Observable } from 'rxjs';

const API_URL = env.apiUrl;


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  status(trc: Transcipt): Observable<Transcipt> {
    return new Observable<Transcipt>((observer) => {
      this.http.get(API_URL + ApiRoutes.Status, { params: { "task_id": trc.task_id } }).subscribe({
        next(res) {
          observer.next(res as Transcipt);
        },
        error(err) {
          observer.error(err);
        },
        complete() {
          observer.complete();
        },
      });
    });
  }

  transcribe(file: File): Observable<Transcipt> {
    const formData = new FormData();
    formData.append('file', file);
    return new Observable<Transcipt>((observer) => {
      this.http.post(API_URL + ApiRoutes.Transcribe, formData).subscribe({
        next(res) {
          observer.next(res as Transcipt);
        },
        error(err) {
          observer.error(err);
        },
        complete() {
          observer.complete();
        },
      });
    });
  }

  isAuthenticated(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.userInfo().subscribe({
        next() { observer.next(true); },
        error() { observer.next(false); }
      });
    });
  }

  translate(file: File) {
    // TODO: implement
  }

  private userInfo() {
    return this.http.get(API_URL + ApiRoutes.UserInfo);
  }

}
