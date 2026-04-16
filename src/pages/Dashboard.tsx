import { useNavigate } from 'react-router-dom';
import { useTeam } from '../contexts/TeamContext';
import { Calendar, ChevronRight, Pin } from 'lucide-react';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h >= 3 && h < 10) return 'おはようございます 👋';
  if (h >= 10 && h < 18) return 'こんにちは 👋';
  return 'こんばんは 🌙';
}

const eventTypeLabels: Record<string, { label: string; color: string }> = {
  official: { label: '公式戦', color: 'var(--color-official)' },
  practice: { label: '練習試合', color: 'var(--color-practice)' },
  other: { label: 'その他', color: 'var(--color-other)' },
};

export default function Dashboard() {
  const { currentTeam, getEvents, getAttendances, getAnnouncements } = useTeam();
  const navigate = useNavigate();

  if (!currentTeam) return null;

  const now = new Date();
  const upcomingEvents = getEvents()
    .filter((e) => new Date(e.dateStart) >= now)
    .slice(0, 2);
  const recentAnnouncements = getAnnouncements().slice(0, 3);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return `${d.getMonth() + 1}/${d.getDate()}(${days[d.getDay()]})`;
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="p-4 space-y-6">
      <div className="text-lg font-bold text-gray-800">{getGreeting()}</div>

      {/* 今後の試合 */}
      <section>
        <h2 className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-1">
          <Calendar size={16} /> 今後の予定
        </h2>
        {upcomingEvents.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center text-gray-400">
            予定はありません
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingEvents.map((ev) => {
              const atts = getAttendances(ev.id);
              const attend = atts.filter((a) => a.status === 'attend').length;
              const absent = atts.filter((a) => a.status === 'absent').length;
              const undecided = atts.filter((a) => a.status === 'undecided').length;
              const typeInfo = eventTypeLabels[ev.eventType];

              return (
                <button
                  key={ev.id}
                  onClick={() => navigate(`/events/${ev.id}`)}
                  className="w-full bg-white rounded-xl p-4 shadow-sm text-left hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span
                        className="text-xs font-bold text-white px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: typeInfo.color }}
                      >
                        {typeInfo.label}
                      </span>
                      <div className="font-bold text-gray-900 mt-1">{ev.title}</div>
                    </div>
                    <ChevronRight size={20} className="text-gray-300 mt-1" />
                  </div>
                  <div className="text-sm text-gray-500 space-y-1">
                    <div>📅 {formatDate(ev.dateStart)} {formatTime(ev.dateStart)}</div>
                    <div>📍 {ev.venueName}</div>
                    {ev.opponent && <div>⚔️ vs {ev.opponent}</div>}
                  </div>
                  <div className="flex gap-3 mt-3 text-xs">
                    <span className="text-green-700 font-bold">○ {attend}</span>
                    <span className="text-red-700 font-bold">× {absent}</span>
                    <span className="text-yellow-700 font-bold">△ {undecided}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* お知らせ */}
      <section>
        <h2 className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-1">
          <Pin size={16} /> お知らせ
        </h2>
        {recentAnnouncements.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center text-gray-400">
            お知らせはありません
          </div>
        ) : (
          <div className="space-y-2">
            {recentAnnouncements.map((ann) => (
              <button
                key={ann.id}
                onClick={() => navigate(`/announcements/${ann.id}`)}
                className="w-full bg-white rounded-xl p-4 shadow-sm text-left hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2">
                  {ann.isPinned && <span className="text-xs">📌</span>}
                  <span className="font-bold text-gray-900 text-sm">{ann.title}</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {formatDate(ann.createdAt)}
                  {ann.targetGrades.includes(0)
                    ? ' | 全学年'
                    : ` | 中${ann.targetGrades.join('・')}`}
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
