import { useNavigate } from 'react-router-dom';
import { useTeam } from '../contexts/TeamContext';
import { Megaphone, ChevronRight } from 'lucide-react';

export default function Announcements() {
  const { currentTeam, getAnnouncements } = useTeam();
  const navigate = useNavigate();

  if (!currentTeam) return null;

  const list = getAnnouncements();

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getMonth()+1}/${d.getDate()}`;
  };

  return (
    <div className="px-4 py-4 space-y-4">
      <h2 className="flex items-center gap-1.5 font-black text-[15px]">
        <Megaphone className="w-4 h-4" style={{ color: currentTeam.themeColor }} />
        お知らせ
      </h2>

      {list.length === 0 ? (
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-10 text-center">
          <Megaphone className="w-8 h-8 text-[var(--color-muted)] mx-auto mb-1.5" />
          <p className="text-xs text-[var(--color-muted)]">お知らせはありません</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {list.map((ann, i) => (
            <button
              key={ann.id}
              onClick={() => navigate(`/announcements/${ann.id}`)}
              className={`w-full flex items-center gap-2.5 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-3 text-left active:scale-[0.98] transition-transform animate-fade-in-up ${i === 1 ? 'delay-1' : i === 2 ? 'delay-2' : ''}`}
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
                <p className="text-[10px] text-[var(--color-muted)] mt-0.5 line-clamp-1">{ann.body}</p>
                <p className="text-[10px] text-[var(--color-muted)] mt-0.5">{formatDate(ann.createdAt)}</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--color-muted)] shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
