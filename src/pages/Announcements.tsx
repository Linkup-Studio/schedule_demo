import { useNavigate } from 'react-router-dom';
import { useTeam } from '../contexts/TeamContext';

export default function Announcements() {
  const { currentTeam, getAnnouncements } = useTeam();
  const navigate = useNavigate();

  if (!currentTeam) return null;

  const list = getAnnouncements();

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold text-gray-800">📢 お知らせ</h2>

      {list.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center text-gray-400">
          お知らせはありません
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((ann) => (
            <button
              key={ann.id}
              onClick={() => navigate(`/announcements/${ann.id}`)}
              className="w-full bg-white rounded-xl p-4 shadow-sm text-left hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-2">
                {ann.isPinned && <span className="text-sm mt-0.5">📌</span>}
                <div className="flex-1">
                  <div className="font-bold text-gray-900">{ann.title}</div>
                  <div className="text-sm text-gray-500 mt-1 line-clamp-2">{ann.body}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-400">{formatDate(ann.createdAt)}</span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: currentTeam.themeColor }}
                    >
                      {ann.targetGrades.includes(0) ? '全学年' : `中${ann.targetGrades.join('・')}`}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
