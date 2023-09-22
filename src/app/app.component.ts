import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileUploader } from 'ng2-file-upload';

import { Transcipt } from '../common/types';

const API_URL = 'https://dev.my-fast.de/api/v1/'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'whisper-pwa';

  uploader:FileUploader;
  hasBaseDropZoneOver:boolean; // true if file hovering over drop zone, for styling

  history: Transcipt[] = [];

  constructor (private http: HttpClient){
    this.uploader = new FileUploader({
      url: API_URL + 'transcribe',
      formatDataFunctionIsAsync: false
    });

    this.hasBaseDropZoneOver = false;
  }

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  ngOnInit(): void {
    this.uploader.response.subscribe( res => {
      this.history.push(JSON.parse(res) as Transcipt);
    });
  }

  loadTranscript(trc: Transcipt) {
    this.http.get(API_URL + 'status', {params : {"task_id" : trc.task_id}}).subscribe( res => {
      this.history[this.history.indexOf(trc)] = res as Transcipt;
    });
  }

  public reloadUnfinished() {
    this.history.forEach(trc => {
    if (trc.status != 'finished') {
        this.loadTranscript(trc);
      }
    });
  }
}
