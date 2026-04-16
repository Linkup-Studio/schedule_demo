import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTeam } from '../contexts/TeamContext';

export default function AnnouncementDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentTeam, getAnnouncements } = useTeam();

  if (!currentTeam) return null;

  const ann = getAnnouncements().find((a) => a.id === id);
  if (!ann) {
    return (
      <div className="p-4 text-center text-[var(--color-muted)] mt-20">
        お知らせが見つかりません
        <button onClick={() => navigate('/announcements')} className="block mx-auto mt-4 text-[var(--color-practice)]">
          一覧に戻る
        </button>
      </div>
    );
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const days = ['日','月','火','水','木','金','土'];
    return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日(${days[d.getDay()]})`;
  };

  return (
    <div className="px-4 py-4 space-y-3">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[var(--color-muted)] text-[13px] font-bold active:opacity-60">
        <ArrowLeft className="w-4 h-4" /> 戻る
      </button>

      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-4 space-y-3 animate-fade-in-up">
        <div className="flex items-center gap-1.5 flex-wrap">
          {ann.isPinned && (
            <span className="text-[9px] font-bold text-[var(--color-error)] bg-red-50 px-1.5 py-0.5 rounded">📌 固定</span>
          )}
          {ann.targetGrades.includes(0) ? (
            <span className="text-[9px] font-bold text-[var(--color-muted)] bg-gray-100 px-1.5 py-0.5 rounded">全学年</span>
          ) : (
            ann.targetGrades.map((g) => (
              <span key={g} className="text-[9px] font-bold text-[var(--color-muted)] bg-gray-100 px-1.5 py-0.5 rounded">中{g}</span>
            ))
          )}
        </div>

        <h1 className="text-[17px] font-black">{ann.title}</h1>
        <div className="text-[10px] text-[var(--color-muted)]">{formatDate(ann.createdAt)}</div>
        <div className="text-[13px] text-[var(--color-foreground)] whitespace-pre-wrap leading-relaxed">
          {ann.body}
        </div>
      </div>
    </div>
  );
}
