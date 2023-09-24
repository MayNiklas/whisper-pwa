import { Component, OnInit } from '@angular/core';

import { FileUploader } from 'ng2-file-upload';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

import { Transcipt } from 'src/common/types';

import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  files: NgxFileDropEntry[] = [];

  history: Transcipt[] = []; // TODO: reimplement as a service?

  test_auth: string = 'UNTESTED';

  constructor(private api: ApiService) { }

  ngOnInit(): void { }

  reloadUnfinished() {
    this.history.forEach(trc => {
      if (trc.status != 'finished') {
        this.api.status(trc).subscribe(res => {
          this.history[this.history.indexOf(trc)] = res as Transcipt;
        });
      }
    });
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // Here you can access the real file
          console.log(droppedFile.relativePath, file);

          this.api.transcribe(file).subscribe(res => {
            this.history.push(res as Transcipt);
          });

          /**
          // You could upload it like this:
          const formData = new FormData()
          formData.append('logo', file, relativePath)

          // Headers
          const headers = new HttpHeaders({
            'security-token': 'mytoken'
          })

          this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
          .subscribe(data => {
            // Sanitized logo returned from backend
          })
          **/

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

}
