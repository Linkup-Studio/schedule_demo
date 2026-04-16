import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeam } from '../contexts/TeamContext';
import { CalendarDays, List, ChevronLeft, ChevronRight, MapPin, Clock } from 'lucide-react';

const WEEKDAYS = ['日','月','火','水','木','金','土'];

const eventTypeLabels: Record<string, { label: string; cls: string; dot: string }> = {
  official: { label: '公式戦', cls: 'bg-[var(--color-official)] text-white', dot: 'bg-[var(--color-official)]' },
  practice: { label: '練習試合', cls: 'bg-[var(--color-practice)] text-white', dot: 'bg-[var(--color-practice)]' },
  other: { label: 'その他', cls: 'bg-[var(--color-other)] text-white', dot: 'bg-[var(--color-other)]' },
};

export default function Events() {
  const { currentTeam, getEvents, getAttendances } = useTeam();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [gradeFilter, setGradeFilter] = useState<number | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  if (!currentTeam) return null;

  const allEvents = getEvents();
  const filteredEvents = gradeFilter
    ? allEvents.filter((e) => e.targetGrades.includes(gradeFilter))
    : allEvents;

  // カレンダー日付生成
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = firstDay.getDay();
  const calStart = new Date(year, month, 1 - startPad);
  const totalCells = startPad + lastDay.getDate();
  const rows = Math.ceil(totalCells / 7);
  const calendarDays: Date[] = [];
  for (let i = 0; i < rows * 7; i++) {
    calendarDays.push(new Date(calStart.getFullYear(), calStart.getMonth(), calStart.getDate() + i));
  }

  // 日付→イベントマップ
  const eventsByDate = useMemo(() => {
    const map = new Map<string, typeof filteredEvents>();
    filteredEvents.forEach((ev) => {
      const key = new Date(ev.dateStart).toISOString().slice(0, 10);
      const arr = map.get(key) || [];
      arr.push(ev);
      map.set(key, arr);
    });
    return map;
  }, [filteredEvents]);

  const selectedEvents = selectedDate ? (eventsByDate.get(selectedDate) || []) : [];

  // リスト表示用
  const now = new Date();
  const upcoming = filteredEvents.filter((e) => new Date(e.dateStart) >= now);
  const past = filteredEvents.filter((e) => new Date(e.dateStart) < now).reverse();

  const fmtMonth = (iso: string) => `${new Date(iso).getMonth()+1}月`;
  const fmtDay = (iso: string) => String(new Date(iso).getDate());
  const fmtDow = (iso: string) => WEEKDAYS[new Date(iso).getDay()];
  const fmtTime = (iso: string) => {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  };

  const isToday = (d: Date) => {
    const t = new Date();
    return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
  };
  const isSameMonth = (d: Date) => d.getMonth() === month && d.getFullYear() === year;

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

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
            <span className="text-[9px] font-medium leading-tight">{fmtMonth(ev.dateStart)}</span>
            <span className="text-lg font-black leading-tight">{fmtDay(ev.dateStart)}</span>
            <span className="text-[9px] font-medium leading-tight">{fmtDow(ev.dateStart)}</span>
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
              <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{fmtTime(ev.dateStart)}</span>
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
    <div className="px-4 py-4 space-y-4 pb-20">
      {/* ヘッダー: タイトル + 表示切替 */}
      <div className="flex items-center justify-between">
        <h1 className="font-black text-lg flex items-center gap-1.5">
          <CalendarDays className="w-5 h-5" style={{ color: currentTeam.themeColor }} />
          予定
        </h1>
        <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('calendar')}
            className={`p-1.5 rounded-md transition-all active:scale-95 ${viewMode === 'calendar' ? 'bg-white text-[var(--color-foreground)] shadow-sm' : 'text-[var(--color-muted)]'}`}
            style={viewMode === 'calendar' ? { color: currentTeam.themeColor } : {}}
          >
            <CalendarDays className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-all active:scale-95 ${viewMode === 'list' ? 'bg-white text-[var(--color-foreground)] shadow-sm' : 'text-[var(--color-muted)]'}`}
            style={viewMode === 'list' ? { color: currentTeam.themeColor } : {}}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 学年フィルター */}
      <div className="flex bg-gray-100 rounded-xl p-1 gap-0.5">
        {[
          { value: null, label: 'すべて' },
          { value: 1, label: '中1' },
          { value: 2, label: '中2' },
          { value: 3, label: '中3' },
        ].map((opt) => (
          <button
            key={opt.label}
            onClick={() => setGradeFilter(opt.value)}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all min-w-[48px] ${
              gradeFilter === opt.value
                ? 'text-white shadow-md'
                : 'text-[var(--color-muted)]'
            }`}
            style={gradeFilter === opt.value ? { backgroundColor: currentTeam.themeColor } : {}}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {viewMode === 'calendar' ? (
        <>
          {/* カレンダー表示 */}
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">
            {/* 月切り替え */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--color-border)]">
              <button onClick={prevMonth} className="p-2 -ml-2 rounded-full active:bg-gray-100 transition-colors">
                <ChevronLeft className="w-5 h-5 text-[var(--color-muted)]" />
              </button>
              <h2 className="font-black text-sm">{year}年 {month+1}月</h2>
              <button onClick={nextMonth} className="p-2 -mr-2 rounded-full active:bg-gray-100 transition-colors">
                <ChevronRight className="w-5 h-5 text-[var(--color-muted)]" />
              </button>
            </div>

            {/* 曜日ヘッダー */}
            <div className="grid grid-cols-7 border-b border-[var(--color-border)]">
              {WEEKDAYS.map((day, i) => (
                <div
                  key={day}
                  className={`py-1.5 text-center text-[10px] font-bold bg-gray-50 ${
                    i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-[var(--color-muted)]'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* カレンダー本体 */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day) => {
                const dayKey = `${day.getFullYear()}-${String(day.getMonth()+1).padStart(2,'0')}-${String(day.getDate()).padStart(2,'0')}`;
                const dayEvents = eventsByDate.get(dayKey) || [];
                const inMonth = isSameMonth(day);
                const selected = selectedDate === dayKey;
                const dow = day.getDay();

                return (
                  <button
                    key={dayKey}
                    onClick={() => setSelectedDate(selected ? null : dayKey)}
                    className={`relative min-h-[48px] p-1 border-b border-r border-[var(--color-border)]/30 transition-colors active:bg-gray-100 ${
                      !inMonth ? 'opacity-30' : ''
                    } ${selected ? 'bg-blue-50 ring-1 ring-inset ring-blue-200' : ''} ${
                      isToday(day) && !selected ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold mx-auto ${
                      isToday(day) ? 'bg-[var(--color-practice)] text-white shadow-sm'
                      : dow === 0 ? 'text-red-500'
                      : dow === 6 ? 'text-blue-500'
                      : 'text-[var(--color-foreground)]'
                    }`}>
                      {day.getDate()}
                    </span>
                    {dayEvents.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-0.5 mt-1 px-0.5">
                        {dayEvents.map((ev) => (
                          <span key={ev.id} className={`w-1.5 h-1.5 rounded-full ${eventTypeLabels[ev.eventType].dot}`} />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 凡例 */}
          <div className="flex flex-wrap justify-center gap-2 text-[10px] text-[var(--color-muted)]">
            {Object.entries(eventTypeLabels).map(([key, t]) => (
              <div key={key} className="flex items-center gap-1 bg-[var(--color-surface)] py-0.5 px-2 rounded-full border border-[var(--color-border)]">
                <span className={`w-1.5 h-1.5 rounded-full ${t.dot}`} />
                {t.label}
              </div>
            ))}
          </div>

          {/* 選択日の試合 */}
          {selectedDate && (
            <div className="space-y-2.5 animate-fade-in-up">
              <h3 className="font-bold text-xs text-[var(--color-muted)] flex items-center gap-1">
                <span className="block w-1 h-3 rounded-full" style={{ backgroundColor: currentTeam.themeColor }} />
                {new Date(selectedDate).getMonth()+1}月{new Date(selectedDate).getDate()}日（{WEEKDAYS[new Date(selectedDate).getDay()]}）の予定
              </h3>
              {selectedEvents.length > 0 ? (
                selectedEvents.map((ev) => <EventCard key={ev.id} ev={ev} />)
              ) : (
                <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 text-center">
                  <p className="text-[11px] text-[var(--color-muted)]">この日の予定はありません</p>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        /* リスト表示 */
        <div className="space-y-4">
          {upcoming.length > 0 && (
            <section>
              <h2 className="font-black text-[13px] text-[var(--color-muted)] mb-2">今後の予定</h2>
              <div className="space-y-2.5">
                {upcoming.map((ev) => <EventCard key={ev.id} ev={ev} />)}
              </div>
            </section>
          )}
          {past.length > 0 && (
            <section>
              <h2 className="font-black text-[13px] text-[var(--color-muted)] mb-2">終了した予定</h2>
              <div className="space-y-2.5">
                {past.map((ev) => <EventCard key={ev.id} ev={ev} isPast />)}
              </div>
            </section>
          )}
          {filteredEvents.length === 0 && (
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-8 text-center">
              <CalendarDays className="w-10 h-10 text-[var(--color-muted)] mx-auto mb-2" />
              <p className="text-[11px] text-[var(--color-muted)]">予定はまだ登録されていません</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
