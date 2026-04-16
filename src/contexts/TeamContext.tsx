import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Team, GameEvent, Attendance, Announcement } from '../data/types';
import { teams, events, attendances, announcements } from '../data/mock';

interface TeamContextValue {
  currentTeam: Team | null;
  setCurrentTeam: (team: Team) => void;
  isAdmin: boolean;
  setIsAdmin: (v: boolean) => void;
  getEvents: () => GameEvent[];
  getAttendances: (eventId: string) => Attendance[];
  addAttendance: (att: Attendance) => void;
  getAnnouncements: () => Announcement[];
  allTeams: Team[];
}

const TeamContext = createContext<TeamContextValue | null>(null);

export function TeamProvider({ children }: { children: ReactNode }) {
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [attendanceList, setAttendanceList] = useState<Attendance[]>(attendances);

  const getEvents = useCallback(() => {
    if (!currentTeam) return [];
    return events
      .filter((e) => e.teamId === currentTeam.id)
      .sort((a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime());
  }, [currentTeam]);

  const getAttendances = useCallback(
    (eventId: string) => attendanceList.filter((a) => a.eventId === eventId),
    [attendanceList]
  );

  const addAttendance = useCallback((att: Attendance) => {
    setAttendanceList((prev) => {
      const idx = prev.findIndex(
        (a) => a.eventId === att.eventId && a.respondentName === att.respondentName
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = att;
        return next;
      }
      return [...prev, att];
    });
  }, []);

  const getAnnouncements = useCallback(() => {
    if (!currentTeam) return [];
    return announcements
      .filter((a) => a.teamId === currentTeam.id)
      .sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [currentTeam]);

  return (
    <TeamContext.Provider
      value={{
        currentTeam,
        setCurrentTeam,
        isAdmin,
        setIsAdmin,
        getEvents,
        getAttendances,
        addAttendance,
        getAnnouncements,
        allTeams: teams,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error('useTeam must be inside TeamProvider');
  return ctx;
}
