import { useNavigate } from 'react-router-dom';
import { useTeam } from '../contexts/TeamContext';

const eventTypeLabels: Record<string, { label: string; color: string }> = {
  official: { label: '公式戦', color: 'var(--color-official)' },
  practice: { label: '練習試合', color: 'var(--color-practice)' },
  other: { label: 'その他', color: 'var(--color-other)' },
};

export default function Events() {
  const { currentTeam, getEvents, getAttendances } = useTeam();
  const navigate = useNavigate();

  if (!currentTeam) return null;

  const allEvents = getEvents();
  const now = new Date();
  const upcoming = allEvents.filter((e) => new Date(e.dateStart) >= now);
  const past = allEvents.filter((e) => new Date(e.dateStart) < now);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return `${d.getMonth() + 1}/${d.getDate()}(${days[d.getDay()]})`;
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const EventCard = ({ ev, isPast }: { ev: (typeof allEvents)[0]; isPast?: boolean }) => {
    const atts = getAttendances(ev.id);
    const attend = atts.filter((a) => a.status === 'attend').length;
    const absent = atts.filter((a) => a.status === 'absent').length;
    const undecided = atts.filter((a) => a.status === 'undecided').length;
    const typeInfo = eventTypeLabels[ev.eventType];

    return (
      <button
        onClick={() => navigate(`/events/${ev.id}`)}
        className={`w-full bg-white rounded-xl p-4 shadow-sm text-left hover:shadow-md transition-shadow ${isPast ? 'opacity-60' : ''}`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-xs font-bold text-white px-2 py-0.5 rounded-full"
            style={{ backgroundColor: typeInfo.color }}
          >
            {typeInfo.label}
          </span>
          <span className="text-xs text-gray-400">
            対象: 中{ev.targetGrades.join('・')}
          </span>
        </div>
        <div className="font-bold text-gray-900">{ev.title}</div>
        <div className="text-sm text-gray-500 mt-1">
          {formatDate(ev.dateStart)} {formatTime(ev.dateStart)} | {ev.venueName}
        </div>
        <div className="flex gap-3 mt-2 text-xs">
          <span className="text-green-700 font-bold">○ {attend}</span>
          <span className="text-red-700 font-bold">× {absent}</span>
          <span className="text-yellow-700 font-bold">△ {undecided}</span>
        </div>
      </button>
    );
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-bold text-gray-800">📅 予定一覧</h2>

      {upcoming.length > 0 && (
        <section>
          <h3 className="text-sm font-bold text-gray-500 mb-2">今後の予定</h3>
          <div className="space-y-3">
            {upcoming.map((ev) => (
              <EventCard key={ev.id} ev={ev} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h3 className="text-sm font-bold text-gray-500 mb-2">終了した予定</h3>
          <div className="space-y-3">
            {past.map((ev) => (
              <EventCard key={ev.id} ev={ev} isPast />
            ))}
          </div>
        </section>
      )}

      {allEvents.length === 0 && (
        <div className="bg-white rounded-xl p-10 text-center text-gray-400">
          予定はまだ登録されていません
        </div>
      )}
    </div>
  );
}
