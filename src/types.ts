export interface EmergencyContact {
  name: string;
  phone: string;
  language: string;
}

export interface UserProfile {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  bloodGroup: string;
  city: string;
  contact1: EmergencyContact;
  contact2: EmergencyContact;
}

export type ScreenState = 'home' | 'setup' | 'dashboard';