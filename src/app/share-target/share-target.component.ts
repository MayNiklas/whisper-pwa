import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-share-target',
  templateUrl: './share-target.component.html',
  styleUrls: ['./share-target.component.scss']
})
export class ShareTargetComponent implements OnInit {

  test_outputs: string[] = ["First Test Message"]; // TODO: remove

  constructor(private api: ApiService) { }

  ngOnInit(): void {

    navigator.serviceWorker.addEventListener('message', (event: MessageEvent) => {
      this.test_outputs.push("Got message \n" + JSON.stringify(event.data));
      if (event.data.hasOwnProperty('audio') || event.data.hasOwnProperty('video')) {
        this.api.transcribe(event.data).subscribe(res => {
          this.test_outputs.push("Got response \n" + JSON.stringify(res));
        });
      }

    });
  }
}
