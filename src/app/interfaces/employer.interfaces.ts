export interface IEmployer {
  uid: string;
  name: string;
  lastName: string;
  role: string;
  totalScore: number;
  averageScore: string;
  totalServices: number;
  averageTime: string | null;
  totalTime: string;
  active: boolean;
  pushToken: string | null;
  wakeZone: boolean;
  lateZone: boolean;
  receptionZone: boolean;
  cleanZone: boolean;
  maintainZone: boolean;
  deliveryZone: boolean;
  bookingZone: boolean;
  email: string;
  language: string;
  hotel: IHotel;
  leaderZones: any[]; // Dependiendo de lo que contenga este array, podrías reemplazar `any` con un tipo más específico.
  leaderEcommerce: any[]; // Igual que con `leaderZones`.
  leaderSpecialZone: any[]; // Igual que con `leaderZones`.
}

export interface IHotel {
  uid: string;
  name: string;
  color: string;
  colorSecond: string;
  colorText: string;
  colorTextSecond: string;
  outlineText: string | null;
  logo: string;
  city: string;
  country: string;
  state: boolean;
  initialConfiguration: boolean;
  orderText: string | null;
  currency: string;
}
