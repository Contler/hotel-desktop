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
import { filter, first, firstValueFrom, switchMap } from 'rxjs';
import { Firestore, doc, updateDoc, arrayUnion } from '@angular/fire/firestore';
import { IEmployer } from '../../interfaces/employer.interfaces';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  isLoading = signal<boolean>(true);
  hotelService = inject(HotelService);
  authFirebase = inject(Auth);
  firestore = inject(Firestore);
  http = inject(HttpClient);

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
        window.electron.registerFCMToken().then(async (token: string) => {
          if (employer.role === 'admin' || employer.role === 'administrator') {
            const ref = doc(this.firestore, 'hotelConfig', employer.hotel.uid);
            updateDoc(ref, { notificationTokens: arrayUnion(token) });
          } else if (employer.role === 'chief') {
            await firstValueFrom(this.hotelService.updateEmployerDesktopToken(token, employer.uid));
          }
          window.electron.startFCMListener();
          this.isLoading.set(false);
        });
      });
  }

}
