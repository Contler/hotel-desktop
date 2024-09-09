import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HotelService } from '../../services/hotel.service';
import { Auth, signOut, user } from '@angular/fire/auth';
import { filter, first, firstValueFrom, switchMap, tap } from 'rxjs';
import { Firestore, doc, updateDoc, arrayUnion } from '@angular/fire/firestore';
import { IEmployer, IHotel } from '../../interfaces/employer.interfaces';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  isLoading = signal<boolean>(true);
  isError = signal(false);
  hotelService = inject(HotelService);
  authFirebase = inject(Auth);
  firestore = inject(Firestore);
  http = inject(HttpClient);
  hotel?: IHotel;
  private router = inject(Router);

  constructor() {
    user(this.authFirebase)
      .pipe(
        filter((user) => !!user),
        first(),
        switchMap((user) =>
          this.hotelService.getEmployerById(user?.uid as string),
        ),
      )
      .subscribe((employer) => {
        this.hotel = employer.hotel;
        window.electron.registerFCMToken().then(async (token: string) => {
          console.log(token);
          if (employer.role === 'admin' || employer.role === 'administrator') {
            const ref = doc(this.firestore, 'hotelConfig', employer.hotel.uid);
            updateDoc(ref, { notificationTokens: arrayUnion(token) });
          } else if (employer.role === 'chief') {
            await firstValueFrom(this.hotelService.updateEmployerDesktopToken(token, employer.uid));
          }
          window.electron.startFCMListener();
          this.isLoading.set(false);
        }).catch(err => {
          this.isLoading.set(false);
          this.isError.set(true);
          console.error(err);
        })
      });
  }

  logOut() {
    signOut(this.authFirebase).then(() => this.router.navigate(['login']));
  }

}
