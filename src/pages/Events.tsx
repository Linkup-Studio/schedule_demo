import { useNavigate } from 'react-router-dom';
import { useTeam } from '../contexts/TeamContext';
import { CalendarDays, MapPin, Clock, ChevronRight } from 'lucide-react';

const eventTypeLabels: Record<string, { label: string; cls: string }> = {
  official: { label: '公式戦', cls: 'bg-[var(--color-official)] text-white' },
  practice: { label: '練習試合', cls: 'bg-[var(--color-practice)] text-white' },
  other: { label: 'その他', cls: 'bg-[var(--color-other)] text-white' },
};

export default function Events() {
  const { currentTeam, getEvents, getAttendances } = useTeam();
  const navigate = useNavigate();

  if (!currentTeam) return null;

  const allEvents = getEvents();
  const now = new Date();
  const upcoming = allEvents.filter((e) => new Date(e.dateStart) >= now);
  const past = allEvents.filter((e) => new Date(e.dateStart) < now);

  const formatMonth = (iso: string) => `${new Date(iso).getMonth()+1}月`;
  const formatDay = (iso: string) => String(new Date(iso).getDate());
  const formatDow = (iso: string) => ['日','月','火','水','木','金','土'][new Date(iso).getDay()];
  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  };

  const EventCard = ({ ev, isPast }: { ev: (typeof allEvents)[0]; isPast?: boolean }) => {
    const atts = getAttendances(ev.id);
    const attend = atts.filter((a) => a.status === 'attend').length;
    const absent = atts.filter((a) => a.status === 'absent').length;
    const undecided = atts.filter((a) => a.status === 'undecided').length;
    const total = ev.targetGrades.reduce((s, g) => {
      const key = `grade${g}` as keyof typeof currentTeam.playerCounts;
      return s + (currentTeam.playerCounts[key] || 0);
    }, 0);
    const noAnswer = Math.max(0, total - atts.length);
    const typeInfo = eventTypeLabels[ev.eventType];

    return (
      <button
        onClick={() => navigate(`/events/${ev.id}`)}
        className={`w-full bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-3.5 text-left active:scale-[0.98] transition-transform ${isPast ? 'opacity-50' : ''}`}
      >
        <div className="flex items-start gap-2.5 mb-2.5">
          <div
            className="w-11 h-[52px] rounded-xl text-white flex flex-col items-center justify-center shrink-0"
            style={{
              background: isPast
                ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
                : `linear-gradient(135deg, ${currentTeam.themeColor}, ${currentTeam.themeColorLight})`,
            }}
          >
            <span className="text-[9px] font-medium leading-tight">{formatMonth(ev.dateStart)}</span>
            <span className="text-lg font-black leading-tight">{formatDay(ev.dateStart)}</span>
            <span className="text-[9px] font-medium leading-tight">{formatDow(ev.dateStart)}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-0.5 flex-wrap">
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${typeInfo.cls}`}>{typeInfo.label}</span>
              {ev.targetGrades.map((g) => (
                <span key={g} className="text-[9px] font-bold text-[var(--color-muted)] bg-gray-100 px-1.5 py-0.5 rounded">中{g}</span>
              ))}
            </div>
            <h3 className="font-bold text-[13px] truncate">{ev.title}</h3>
            <div className="flex flex-wrap gap-x-2.5 text-[10px] text-[var(--color-muted)] mt-0.5">
              <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{ev.venueName}</span>
              <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{formatTime(ev.dateStart)}</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[var(--color-muted)] shrink-0 mt-2" />
        </div>

        <div className="flex items-center gap-1.5 text-[10px]">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
            {total > 0 && (
              <>
                <div className="bg-[var(--color-attend)] h-full" style={{ width: `${(attend/total)*100}%` }} />
                <div className="bg-[var(--color-absent)] h-full" style={{ width: `${(absent/total)*100}%` }} />
                <div className="bg-[var(--color-undecided)] h-full" style={{ width: `${(undecided/total)*100}%` }} />
              </>
            )}
          </div>
          <span className="text-[var(--color-attend)] font-bold">○{attend}</span>
          <span className="text-[var(--color-absent)] font-bold">×{absent}</span>
          <span className="text-[var(--color-undecided)] font-bold">△{undecided}</span>
          <span className="text-[var(--color-no-answer)] font-bold">?{noAnswer}</span>
        </div>
      </button>
    );
  };

  return (
    <div className="px-4 py-4 space-y-4">
      {upcoming.length > 0 && (
        <section className="animate-fade-in-up">
          <h2 className="flex items-center gap-1.5 font-black text-[15px] mb-2.5">
            <CalendarDays className="w-4 h-4" style={{ color: currentTeam.themeColor }} />
            今後の予定
          </h2>
          <div className="space-y-2.5">
            {upcoming.map((ev) => <EventCard key={ev.id} ev={ev} />)}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section className="animate-fade-in-up delay-2">
          <h2 className="flex items-center gap-1.5 font-black text-[15px] mb-2.5 text-[var(--color-muted)]">
            終了した予定
          </h2>
          <div className="space-y-2.5">
            {past.map((ev) => <EventCard key={ev.id} ev={ev} isPast />)}
          </div>
        </section>
      )}

      {allEvents.length === 0 && (
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-10 text-center">
          <CalendarDays className="w-8 h-8 text-[var(--color-muted)] mx-auto mb-1.5" />
          <p className="text-xs text-[var(--color-muted)]">予定はまだ登録されていません</p>
        </div>
      )}
    </div>
  );
}
