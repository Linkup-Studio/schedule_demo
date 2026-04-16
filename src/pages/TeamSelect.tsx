import { useNavigate } from 'react-router-dom';
import { useTeam } from '../contexts/TeamContext';
import type { Team } from '../data/types';

export default function TeamSelect() {
  const { allTeams, setCurrentTeam } = useTeam();
  const navigate = useNavigate();

  const handleSelect = (team: Team) => {
    setCurrentTeam(team);
    navigate('/passphrase');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">⚾</div>
        <h1 className="text-3xl font-bold text-white mb-2">BallPark</h1>
        <p className="text-slate-400">チームを選んでください</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        {allTeams.map((team) => (
          <button
            key={team.id}
            onClick={() => handleSelect(team)}
            className="w-full bg-white rounded-xl p-5 flex items-center gap-4 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0"
              style={{ backgroundColor: team.themeColor }}
            >
              {team.name[0]}
            </div>
            <div className="text-left">
              <div className="font-bold text-gray-900 text-lg">{team.name}</div>
              <div className="text-sm text-gray-500">{team.description}</div>
            </div>
          </button>
        ))}
      </div>

      <p className="text-slate-500 text-xs mt-10">
        マルチテナント デモ — 1つのアプリで複数チームを管理
      </p>
    </div>
  );
}
