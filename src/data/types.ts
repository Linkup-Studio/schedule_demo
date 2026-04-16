// マルチテナント型定義

export type MembershipRole = 'owner' | 'admin' | 'coach' | 'parent' | 'player';
export type EventType = 'official' | 'practice' | 'other';
export type AttendanceStatus = 'attend' | 'absent' | 'undecided';

export interface Team {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  themeColor: string;
  themeColorLight: string;
  description: string;
  passphrase: string;
  adminPin: string;
  playerCounts: { grade1: number; grade2: number; grade3: number };
}

export interface GameEvent {
  id: string;
  teamId: string;
  title: string;
  eventType: EventType;
  opponent?: string;
  venueName: string;
  venueAddress?: string;
  dateStart: string; // ISO string
  dateEnd?: string;
  meetingTime?: string;
  meetingPlace?: string;
  items?: string;
  notes?: string;
  rsvpDeadline?: string;
  targetGrades: number[];
}

export interface Attendance {
  id: string;
  eventId: string;
  teamId: string;
  respondentName: string;
  grade: number;
  status: AttendanceStatus;
  reason?: string;
  answeredAt: string;
}

export interface Announcement {
  id: string;
  teamId: string;
  title: string;
  body: string;
  isPinned: boolean;
  targetGrades: number[];
  createdAt: string;
}
