export type Gender = 'Male' | 'Female';

export type OpportunityStatus = 'OPEN' | 'PARTIALLY_FILLED' | 'CLOSED' | 'CANCELLED';

export type AttendanceStatus = 'PENDING' | 'PRESENT' | 'ABSENT' | 'CANCELLED';

export interface VolunteerRequirement {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g., "11:00 AM"
  endTime: string; // e.g., "02:00 PM"
  location: string;
  maleRequired: number;
  femaleRequired: number;
  maleRegistered: number;
  femaleRegistered: number;
  status: OpportunityStatus;
  instructions: string;
  registrationDeadline?: string;
  createdAt: string;
}

export interface VolunteerRegistration {
  id: string;
  requirementId: string;
  requirementDate: string;
  requirementTitle: string;
  serviceTimings: string;
  location: string;
  fullName: string;
  mobile: string;
  gender: Gender;
  registeredAt: string;
  attendanceStatus: AttendanceStatus;
  notes?: string;
}

export interface CoordinatorProfile {
  id: string;
  name: string;
  phone: string;
  securityPin: string;
  role: string;
  location: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface VolunteerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  password?: string;
  authProvider: 'email' | 'google';
  gender?: Gender;
  city?: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface DailyStats {
  volunteersRequiredToday: number;
  volunteersRegisteredToday: number;
  remainingPositionsToday: number;
  fullyFilledCount: number;
  totalUpcomingOpportunities: number;
}
