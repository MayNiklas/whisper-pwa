import { Component } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { ApiRoutes } from '../enums/api-routes';
import { ActivatedRoute } from '@angular/router';

const apiUrl = env.apiUrl;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private route: ActivatedRoute) { }

  login() {
    const redirect_path: string = this.route.snapshot.paramMap.get('redirect_path') || '/app/home';
    window.location.href = apiUrl + ApiRoutes.Login + '?redirect=' + redirect_path;
  }

}
