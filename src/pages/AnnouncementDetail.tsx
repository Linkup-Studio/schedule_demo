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
      <div className="p-4 text-center text-gray-400 mt-20">
        お知らせが見つかりません
        <button onClick={() => navigate('/announcements')} className="block mx-auto mt-4 text-blue-500">
          一覧に戻る
        </button>
      </div>
    );
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日(${days[d.getDay()]})`;
  };

  return (
    <div className="p-4 space-y-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-500 text-sm">
        <ArrowLeft size={18} /> 戻る
      </button>

      <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          {ann.isPinned && <span>📌</span>}
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: currentTeam.themeColor }}
          >
            {ann.targetGrades.includes(0) ? '全学年' : `中${ann.targetGrades.join('・')}`}
          </span>
        </div>

        <h1 className="text-xl font-bold text-gray-900">{ann.title}</h1>
        <div className="text-xs text-gray-400">{formatDate(ann.createdAt)}</div>
        <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">{ann.body}</div>
      </div>
    </div>
  );
}
