export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email?: string | null;
  relation: string;
  countryCode: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmergencyContact {
  name: string;
  phone: string;
  email: string;
  relation: string;
}

export interface UpdateEmergencyContact {
  name?: string;
  phone?: string;
  email?: string;
  relation?: string;
}