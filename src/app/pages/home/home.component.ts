import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HotelService } from '../../services/hotel.service';
import { Auth, user } from '@angular/fire/auth';
import { filter, first, switchMap } from 'rxjs';
import { Firestore, doc, updateDoc, arrayUnion } from '@angular/fire/firestore';

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
        window.electron.registerFCMToken().then((token: string) => {
          const ref = doc(this.firestore, 'hotelConfig', employer.hotel.uid);
          updateDoc(ref, { notificationTokens: arrayUnion(token) });
          window.electron.startFCMListener();
          this.isLoading.set(false);
          console.log(token);
        });
      });
  }
}
