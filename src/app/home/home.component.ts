import { Component, OnInit } from '@angular/core';

import { interval, Subscription } from 'rxjs';

import { HistoryElement, Transcipt } from 'src/common/types';

import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  history: HistoryElement[] = []; // TODO: reimplement as a service/component?

  test_auth: string = 'UNTESTED';

  secondInterval = interval(1000);
  updateSubscription: Subscription = new Subscription();

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.updateSubscription = this.secondInterval.subscribe(() => {
      this.reloadUnfinished();
    });
  }

  ngOnDestroy() {
    this.updateSubscription.unsubscribe();
  }

  reloadUnfinished() {
    this.history.forEach(he => {
      this.updateHistoryElement(he);
    });

  }

  addHistoryElement(trc: Transcipt) {
    this.history.push(new HistoryElement(trc));
  }

  updateHistoryElement(he: HistoryElement) {
    if (he.transcript.status != 'finished' && he.transcript.status != 'failed') {
      this.api.status(he.transcript).subscribe(res => {
        var trc: Transcipt = res as Transcipt;
        var he_upd: HistoryElement = he;
        he_upd.transcript = trc;
        switch (trc.status) {
          case 'new':
            break;
          case 'pending':
            he_upd.short = 'Waiting...';
            he_upd.pbar.mode = 'query';
            he_upd.pbar.value = 0;
            he_upd.pbar.color = 'accent';
            break;
          case 'processing':
            he_upd.short = 'Processing...';
            he_upd.pbar.mode = 'indeterminate';
            he_upd.pbar.value = 0;
            he_upd.pbar.color = 'primary';
            break;
          case 'finished':
            he_upd.short = trc.transcript;
            he_upd.pbar.show = false;
            he_upd.pbar.mode = 'determinate';
            he_upd.pbar.value = 100;
            he_upd.pbar.color = 'primary';
            break;
          case 'failed':
            he_upd.short = 'Failed';
            he_upd.pbar.mode = 'determinate';
            he_upd.pbar.value = 100;
            he_upd.pbar.color = 'warn';
            break;
        }
        this.history[this.history.indexOf(he)] = he_upd;
      });
    }
  }

  uploadFiles(files: File[]) {
    for (const file of files) {
      this.api.transcribe(file).subscribe(res => {
        this.addHistoryElement(res as Transcipt); // multi-file problem is just the subscription firing multiple times
      });
    }
  }

  onFileSelected(event: any) {
    this.uploadFiles(event.target.files);
  }

  async onPaste() {
    navigator.clipboard.readText().then(text => {
      var blob = new Blob([text], { type: 'text/plain' });
      var file = new File([blob], 'clipboard.txt');
      this.uploadFiles([file]);
    });
    try {
      /*
      const permission = await navigator.permissions.query({ name: "clipboard-read"  }); // TODO: check if this is needed
      if (permission.state === "denied") {
        throw new Error("Not allowed to read clipboard.");
      }
      */
      const clipboardContents = await navigator.clipboard.read();
      for (const item of clipboardContents) {
        if (!item.types.includes("audio/*")) {
          throw new Error("Clipboard contains non-audio data.");
        }
        const blob = await item.getType("audio/*");
        const file = new File([blob], 'clipboard.' + blob.type.split('/')[1]);
        this.uploadFiles([file]);
      }
    } catch (error: any) {
      console.error(error.message);
    }
  }


}
