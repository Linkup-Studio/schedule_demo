import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Swords, Package, StickyNote } from 'lucide-react';
import { useTeam } from '../contexts/TeamContext';
import type { AttendanceStatus } from '../data/types';

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentTeam, getEvents, getAttendances, addAttendance, isAdmin } = useTeam();

  const [name, setName] = useState('');
  const [grade, setGrade] = useState<number>(3);
  const [reason, setReason] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  if (!currentTeam) return null;

  const event = getEvents().find((e) => e.id === id);
  if (!event) {
    return (
      <div className="p-4 text-center text-[var(--color-muted)] mt-20">
        予定が見つかりません
        <button onClick={() => navigate('/events')} className="block mx-auto mt-4 text-[var(--color-practice)]">
          一覧に戻る
        </button>
      </div>
    );
  }

  const attendanceList = getAttendances(event.id);
  const attend = attendanceList.filter((a) => a.status === 'attend');
  const absent = attendanceList.filter((a) => a.status === 'absent');
  const undecided = attendanceList.filter((a) => a.status === 'undecided');
  const total = event.targetGrades.reduce((s, g) => {
    const key = `grade${g}` as keyof typeof currentTeam.playerCounts;
    return s + (currentTeam.playerCounts[key] || 0);
  }, 0);
  const noAnswer = Math.max(0, total - attendanceList.length);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const days = ['日','月','火','水','木','金','土'];
    return `${d.getMonth()+1}月${d.getDate()}日(${days[d.getDay()]})`;
  };
  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  };

  const typeLabels: Record<string, { label: string; cls: string }> = {
    official: { label: '公式戦', cls: 'bg-[var(--color-official)] text-white' },
    practice: { label: '練習試合', cls: 'bg-[var(--color-practice)] text-white' },
    other: { label: 'その他', cls: 'bg-[var(--color-other)] text-white' },
  };
  const typeInfo = typeLabels[event.eventType];

  const handleAnswer = (status: AttendanceStatus) => {
    if (!name.trim()) return;
    addAttendance({
      id: `att-${Date.now()}`,
      eventId: event.id,
      teamId: currentTeam.id,
      respondentName: name.trim(),
      grade,
      status,
      reason: status === 'undecided' ? reason : undefined,
      answeredAt: new Date().toISOString(),
    });
    setSubmitted(true);
    setShowForm(false);
    setReason('');
  };

  return (
    <div className="px-4 py-4 space-y-3 pb-24">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[var(--color-muted)] text-[13px] font-bold active:opacity-60">
        <ArrowLeft className="w-4 h-4" /> 戻る
      </button>

      {/* イベント情報 */}
      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-4 space-y-3 animate-fade-in-up">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${typeInfo.cls}`}>{typeInfo.label}</span>
          {event.targetGrades.map((g) => (
            <span key={g} className="text-[9px] font-bold text-[var(--color-muted)] bg-gray-100 px-1.5 py-0.5 rounded">中{g}</span>
          ))}
        </div>

        <h1 className="text-[17px] font-black">{event.title}</h1>

        <div className="space-y-1.5 text-[12px] text-[var(--color-muted)]">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{formatDate(event.dateStart)} {formatTime(event.dateStart)}
            {event.dateEnd && ` 〜 ${formatTime(event.dateEnd)}`}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>{event.venueName}</span>
          </div>
          {event.opponent && (
            <div className="flex items-center gap-2">
              <Swords className="w-3.5 h-3.5 shrink-0" />
              <span>vs {event.opponent}</span>
            </div>
          )}
          {event.meetingTime && (
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>集合 {event.meetingTime} {event.meetingPlace && `| ${event.meetingPlace}`}</span>
            </div>
          )}
          {event.items && (
            <div className="flex items-start gap-2">
              <Package className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{event.items}</span>
            </div>
          )}
          {event.notes && (
            <div className="flex items-start gap-2">
              <StickyNote className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{event.notes}</span>
            </div>
          )}
        </div>

        {event.rsvpDeadline && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-2.5 text-center text-[12px] text-[var(--color-error)] font-bold">
            ⏰ 回答締切: {new Date(event.rsvpDeadline).getMonth()+1}月{new Date(event.rsvpDeadline).getDate()}日まで
          </div>
        )}
      </div>

      {/* 出欠サマリー */}
      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-4 animate-fade-in-up delay-1">
        <h2 className="text-[13px] font-black mb-2.5">出欠状況</h2>
        <div className="grid grid-cols-4 gap-1.5 text-center">
          <div className="bg-green-50 rounded-xl py-2">
            <div className="text-[18px] font-black text-[var(--color-attend)]">{attend.length}</div>
            <div className="text-[9px] font-bold text-[var(--color-attend)]">参加</div>
          </div>
          <div className="bg-red-50 rounded-xl py-2">
            <div className="text-[18px] font-black text-[var(--color-absent)]">{absent.length}</div>
            <div className="text-[9px] font-bold text-[var(--color-absent)]">欠席</div>
          </div>
          <div className="bg-yellow-50 rounded-xl py-2">
            <div className="text-[18px] font-black text-[var(--color-undecided)]">{undecided.length}</div>
            <div className="text-[9px] font-bold text-[var(--color-undecided)]">未定</div>
          </div>
          <div className="bg-gray-50 rounded-xl py-2">
            <div className="text-[18px] font-black text-[var(--color-no-answer)]">{noAnswer}</div>
            <div className="text-[9px] font-bold text-[var(--color-no-answer)]">未回答</div>
          </div>
        </div>
      </div>

      {/* 出欠回答フォーム */}
      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-4 animate-fade-in-up delay-2">
        <h2 className="text-[13px] font-black mb-2.5">出欠を回答する</h2>

        {submitted && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-2.5 text-[12px] text-[var(--color-success)] font-bold mb-2.5 text-center">
            ✅ 回答を送信しました！
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-2 text-[10px] text-blue-600 mb-3 text-center font-bold">
          🔄 同じお名前で再送信すると、回答を修正できます
        </div>

        {showForm ? (
          <div className="space-y-2.5">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="お名前を入力"
              className="w-full bg-[var(--color-background)] border border-[var(--color-border)] px-4 py-3 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <select
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value))}
              className="w-full bg-[var(--color-background)] border border-[var(--color-border)] px-4 py-3 rounded-xl text-[14px] focus:outline-none"
            >
              <option value={1}>中1</option>
              <option value={2}>中2</option>
              <option value={3}>中3</option>
            </select>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleAnswer('attend')}
                disabled={!name.trim()}
                className="py-3.5 rounded-xl text-[15px] font-black bg-[var(--color-attend)] text-white disabled:opacity-30 active:scale-95 transition-transform shadow-sm"
              >
                ○ 参加
              </button>
              <button
                onClick={() => handleAnswer('absent')}
                disabled={!name.trim()}
                className="py-3.5 rounded-xl text-[15px] font-black bg-[var(--color-absent)] text-white disabled:opacity-30 active:scale-95 transition-transform shadow-sm"
              >
                × 欠席
              </button>
              <button
                onClick={() => {
                  if (!name.trim()) return;
                  const r = window.prompt('理由を入力（任意）');
                  setReason(r || '');
                  handleAnswer('undecided');
                }}
                disabled={!name.trim()}
                className="py-3.5 rounded-xl text-[15px] font-black bg-[var(--color-undecided)] text-white disabled:opacity-30 active:scale-95 transition-transform shadow-sm"
              >
                △ 未定
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => { setShowForm(true); setSubmitted(false); }}
            className="w-full py-3 border-2 border-[var(--color-border)] rounded-xl text-[var(--color-muted)] text-[13px] font-bold active:bg-gray-50"
          >
            別の人の回答を追加する
          </button>
        )}
      </div>

      {/* 回答済み一覧 */}
      {attendanceList.length > 0 && (
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-4 animate-fade-in-up delay-3">
          <h2 className="text-[13px] font-black mb-2.5">回答済み</h2>
          <div className="space-y-0">
            {attendanceList.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-2.5 border-b border-[var(--color-border)] last:border-0">
                <div>
                  <span className="font-bold text-[13px]">{a.respondentName}</span>
                  <span className="text-[10px] text-[var(--color-muted)] ml-1.5">中{a.grade}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[12px] font-black ${
                    a.status === 'attend' ? 'text-[var(--color-attend)]'
                    : a.status === 'absent' ? 'text-[var(--color-absent)]'
                    : 'text-[var(--color-undecided)]'
                  }`}>
                    {a.status === 'attend' ? '○ 参加' : a.status === 'absent' ? '× 欠席' : '△ 未定'}
                  </span>
                  {isAdmin && (
                    <button className="text-[var(--color-no-answer)] hover:text-[var(--color-error)] text-[11px]">🗑️</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
