import { Injectable } from '@angular/core';
import { AuthHttpHandleService } from './auth-http-handle.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { IEmployer } from '../interfaces/employer.interfaces';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private http: HttpClient;
  private readonly url = environment.apiUrl;

  constructor(private authHandle: AuthHttpHandleService) {
    this.http = new HttpClient(this.authHandle);
  }

  getEmployerById(uid: string) {
    const url = new URL(`/employer/${uid}`,this.url);
    return this.http.get<IEmployer>(url.href);
  }

  updateEmployerDesktopToken(token: string, employerId: string) {
    const url = new URL('/employer/set-desktop-token', this.url);
    return this.http.post(url.href, { token, employerId });
  }
}
