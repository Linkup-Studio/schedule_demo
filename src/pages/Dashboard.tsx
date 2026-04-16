import { useNavigate } from 'react-router-dom';
import { useTeam } from '../contexts/TeamContext';
import { CalendarDays, Megaphone, ChevronRight, Trophy, MapPin, Clock } from 'lucide-react';

function getGreeting(): string {
  const h = new Date().getHours();
  const m = new Date().getMinutes();
  const t = h * 60 + m;
  if (t >= 181 && t <= 600) return 'おはようございます 👋';
  if (t >= 601 && t <= 1080) return 'こんにちは 👋';
  return 'こんばんは 🌙';
}

const eventTypeLabels: Record<string, { label: string; cls: string }> = {
  official: { label: '公式戦', cls: 'bg-[var(--color-official)] text-white' },
  practice: { label: '練習試合', cls: 'bg-[var(--color-practice)] text-white' },
  other: { label: 'その他', cls: 'bg-[var(--color-other)] text-white' },
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

  const formatMonth = (iso: string) => {
    const d = new Date(iso);
    return `${d.getMonth() + 1}月`;
  };
  const formatDay = (iso: string) => String(new Date(iso).getDate());
  const formatDow = (iso: string) => ['日','月','火','水','木','金','土'][new Date(iso).getDay()];
  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  };
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getMonth()+1}/${d.getDate()}`;
  };

  return (
    <div className="px-4 py-4 space-y-4">
      {/* ウェルカムバナー */}
      <section
        className="rounded-2xl p-4 text-white relative overflow-hidden animate-fade-in-up"
        style={{ background: `linear-gradient(135deg, ${currentTeam.themeColor}, ${currentTeam.themeColorLight})` }}
      >
        <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
          <Trophy className="w-full h-full" />
        </div>
        <div className="relative z-10">
          <p className="text-white/70 text-[11px] font-medium mb-0.5">
            {new Date().getMonth()+1}月{new Date().getDate()}日（{formatDow(new Date().toISOString())}）
          </p>
          <h1 className="text-lg font-black mb-0.5">{getGreeting()}</h1>
          <p className="text-xs text-white/70">{currentTeam.name}の予定をチェック</p>
        </div>
      </section>

      {/* 今後の試合 */}
      <section className="animate-fade-in-up delay-2">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="flex items-center gap-1.5 font-black text-[15px]">
            <CalendarDays className="w-4 h-4" style={{ color: currentTeam.themeColor }} />
            今後の試合
          </h2>
          <button
            onClick={() => navigate('/events')}
            className="flex items-center gap-0.5 text-[11px] font-bold active:opacity-60"
            style={{ color: currentTeam.themeColor }}
          >
            すべて見る
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 text-center">
            <CalendarDays className="w-8 h-8 text-[var(--color-muted)] mx-auto mb-1.5" />
            <p className="text-xs text-[var(--color-muted)]">今後の試合はありません</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {upcomingEvents.map((ev) => {
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
                  key={ev.id}
                  onClick={() => navigate(`/events/${ev.id}`)}
                  className="w-full bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-3.5 text-left active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-start gap-2.5 mb-2.5">
                    {/* 日付ブロック */}
                    <div
                      className="w-11 h-[52px] rounded-xl text-white flex flex-col items-center justify-center shrink-0"
                      style={{ background: `linear-gradient(135deg, ${currentTeam.themeColor}, ${currentTeam.themeColorLight})` }}
                    >
                      <span className="text-[9px] font-medium leading-tight">{formatMonth(ev.dateStart)}</span>
                      <span className="text-lg font-black leading-tight">{formatDay(ev.dateStart)}</span>
                      <span className="text-[9px] font-medium leading-tight">{formatDow(ev.dateStart)}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-0.5 flex-wrap">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${typeInfo.cls}`}>
                          {typeInfo.label}
                        </span>
                        {ev.targetGrades.map((g) => (
                          <span key={g} className="text-[9px] font-bold text-[var(--color-muted)] bg-gray-100 px-1.5 py-0.5 rounded">
                            中{g}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-bold text-[13px] truncate">{ev.title}</h3>
                      <div className="flex flex-wrap gap-x-2.5 text-[10px] text-[var(--color-muted)] mt-0.5">
                        <span className="flex items-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5" />{ev.venueName}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />{formatTime(ev.dateStart)}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--color-muted)] shrink-0 mt-2" />
                  </div>

                  {/* 出欠サマリーバー */}
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
            })}
          </div>
        )}
      </section>

      {/* お知らせ */}
      <section className="animate-fade-in-up delay-3">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="flex items-center gap-1.5 font-black text-[15px]">
            <Megaphone className="w-4 h-4" style={{ color: currentTeam.themeColor }} />
            最新のお知らせ
          </h2>
          <button
            onClick={() => navigate('/announcements')}
            className="flex items-center gap-0.5 text-[11px] font-bold active:opacity-60"
            style={{ color: currentTeam.themeColor }}
          >
            すべて見る
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {recentAnnouncements.length === 0 ? (
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 text-center">
            <Megaphone className="w-8 h-8 text-[var(--color-muted)] mx-auto mb-1.5" />
            <p className="text-xs text-[var(--color-muted)]">お知らせはまだありません</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {recentAnnouncements.map((ann) => (
              <button
                key={ann.id}
                onClick={() => navigate(`/announcements/${ann.id}`)}
                className="w-full flex items-center gap-2.5 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-3 text-left active:scale-[0.98] transition-transform"
              >
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${ann.isPinned ? 'bg-[var(--color-error)]' : ''}`}
                  style={!ann.isPinned ? { backgroundColor: currentTeam.themeColor } : {}}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 flex-wrap">
                    {ann.isPinned && (
                      <span className="text-[9px] font-bold text-[var(--color-error)] bg-red-50 px-1 py-0.5 rounded">📌 固定</span>
                    )}
                    {ann.targetGrades.includes(0) ? (
                      <span className="text-[9px] font-bold text-[var(--color-muted)] bg-gray-100 px-1.5 py-0.5 rounded">全学年</span>
                    ) : (
                      ann.targetGrades.map((g) => (
                        <span key={g} className="text-[9px] font-bold text-[var(--color-muted)] bg-gray-100 px-1.5 py-0.5 rounded">中{g}</span>
                      ))
                    )}
                  </div>
                  <h3 className="font-bold text-[13px] truncate mt-0.5">{ann.title}</h3>
                  <p className="text-[10px] text-[var(--color-muted)] mt-0.5">{formatDate(ann.createdAt)}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[var(--color-muted)] shrink-0" />
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
