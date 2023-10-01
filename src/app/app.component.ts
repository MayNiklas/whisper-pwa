import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor() { }

  redirectPath() {
    const path = window.location.pathname.split(';')[0];
    return path == '/app/login' ? '/app/home' : path;
  }
}
