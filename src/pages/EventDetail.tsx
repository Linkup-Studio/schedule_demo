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
      <div className="p-4 text-center text-gray-400 mt-20">
        予定が見つかりません
        <button onClick={() => navigate('/events')} className="block mx-auto mt-4 text-blue-500">
          一覧に戻る
        </button>
      </div>
    );
  }

  const attendanceList = getAttendances(event.id);
  const attend = attendanceList.filter((a) => a.status === 'attend');
  const absent = attendanceList.filter((a) => a.status === 'absent');
  const undecided = attendanceList.filter((a) => a.status === 'undecided');

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日(${days[d.getDay()]})`;
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const eventTypeLabels: Record<string, { label: string; color: string }> = {
    official: { label: '公式戦', color: 'var(--color-official)' },
    practice: { label: '練習試合', color: 'var(--color-practice)' },
    other: { label: 'その他', color: 'var(--color-other)' },
  };
  const typeInfo = eventTypeLabels[event.eventType];

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
    <div className="p-4 space-y-4 pb-24">
      {/* 戻るボタン */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-500 text-sm">
        <ArrowLeft size={18} /> 戻る
      </button>

      {/* イベント情報 */}
      <div className="bg-white rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold text-white px-2 py-0.5 rounded-full"
            style={{ backgroundColor: typeInfo.color }}
          >
            {typeInfo.label}
          </span>
          <span className="text-xs text-gray-400">対象: 中{event.targetGrades.join('・')}</span>
        </div>

        <h1 className="text-xl font-bold text-gray-900">{event.title}</h1>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
            <span>{formatDate(event.dateStart)} {formatTime(event.dateStart)}</span>
            {event.dateEnd && <span>〜 {formatTime(event.dateEnd)}</span>}
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-400" />
            <span>{event.venueName}</span>
          </div>
          {event.opponent && (
            <div className="flex items-center gap-2">
              <Swords size={16} className="text-gray-400" />
              <span>vs {event.opponent}</span>
            </div>
          )}
          {event.meetingTime && (
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              <span>集合 {event.meetingTime} {event.meetingPlace && `| ${event.meetingPlace}`}</span>
            </div>
          )}
          {event.items && (
            <div className="flex items-start gap-2">
              <Package size={16} className="text-gray-400 mt-0.5" />
              <span>{event.items}</span>
            </div>
          )}
          {event.notes && (
            <div className="flex items-start gap-2">
              <StickyNote size={16} className="text-gray-400 mt-0.5" />
              <span>{event.notes}</span>
            </div>
          )}
        </div>

        {event.rsvpDeadline && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-center text-sm text-red-600 font-bold">
            ⏰ 締切: {new Date(event.rsvpDeadline).getMonth() + 1}月{new Date(event.rsvpDeadline).getDate()}日まで
          </div>
        )}
      </div>

      {/* 出欠サマリー */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h2 className="text-sm font-bold text-gray-500 mb-3">出欠状況</h2>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-green-50 rounded-lg p-2">
            <div className="text-xl font-bold text-green-700">{attend.length}</div>
            <div className="text-xs text-green-600">参加</div>
          </div>
          <div className="bg-red-50 rounded-lg p-2">
            <div className="text-xl font-bold text-red-700">{absent.length}</div>
            <div className="text-xs text-red-600">欠席</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-2">
            <div className="text-xl font-bold text-yellow-700">{undecided.length}</div>
            <div className="text-xs text-yellow-600">未定</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-xl font-bold text-gray-500">
              {(() => {
                const totalPlayers = event.targetGrades.reduce((sum, g) => {
                  const key = `grade${g}` as keyof typeof currentTeam.playerCounts;
                  return sum + (currentTeam.playerCounts[key] || 0);
                }, 0);
                return Math.max(0, totalPlayers - attendanceList.length);
              })()}
            </div>
            <div className="text-xs text-gray-500">未回答</div>
          </div>
        </div>
      </div>

      {/* 出欠回答フォーム */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h2 className="text-sm font-bold text-gray-500 mb-3">出欠を回答する</h2>

        {submitted && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700 mb-3">
            ✅ 回答を送信しました！
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-xs text-blue-600 mb-3 text-center">
          🔄 同じお名前で再送信すると、回答を修正できます
        </div>

        {showForm ? (
          <div className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="お名前を入力"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400"
            />
            <select
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400"
            >
              <option value={1}>中1</option>
              <option value={2}>中2</option>
              <option value={3}>中3</option>
            </select>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleAnswer('attend')}
                disabled={!name.trim()}
                className="py-4 rounded-xl text-lg font-bold bg-green-500 text-white disabled:opacity-40 active:scale-95 transition-transform"
              >
                ○ 参加
              </button>
              <button
                onClick={() => handleAnswer('absent')}
                disabled={!name.trim()}
                className="py-4 rounded-xl text-lg font-bold bg-red-500 text-white disabled:opacity-40 active:scale-95 transition-transform"
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
                className="py-4 rounded-xl text-lg font-bold bg-yellow-500 text-white disabled:opacity-40 active:scale-95 transition-transform"
              >
                △ 未定
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => { setShowForm(true); setSubmitted(false); }}
            className="w-full py-3 border-2 border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50"
          >
            別の人の回答を追加する
          </button>
        )}
      </div>

      {/* 回答済み一覧 */}
      {attendanceList.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-sm font-bold text-gray-500 mb-3">回答済み</h2>
          <div className="space-y-2">
            {attendanceList.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <span className="font-bold text-gray-800 text-sm">{a.respondentName}</span>
                  <span className="text-xs text-gray-400 ml-2">中{a.grade}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-bold ${
                      a.status === 'attend'
                        ? 'text-green-600'
                        : a.status === 'absent'
                        ? 'text-red-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    {a.status === 'attend' ? '○ 参加' : a.status === 'absent' ? '× 欠席' : '△ 未定'}
                  </span>
                  {isAdmin && (
                    <button className="text-gray-300 hover:text-red-400 text-xs">🗑️</button>
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
