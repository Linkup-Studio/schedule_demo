import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeam } from '../contexts/TeamContext';

export default function TeamSelect() {
  const { allTeams, setCurrentTeam } = useTeam();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = allTeams.find((t) => t.passphrase === input.trim());
    if (matched) {
      setCurrentTeam(matched);
      navigate('/dashboard');
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">⚾</div>
        <h1 className="text-3xl font-bold text-white mb-2">BallPark</h1>
        <p className="text-slate-400">チームの合言葉を入力してください</p>
      </div>

      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false); }}
            placeholder="合言葉"
            className={`w-full px-5 py-4 border-2 rounded-2xl text-center text-lg bg-white focus:outline-none transition-colors ${
              error ? 'border-red-400 bg-red-50' : 'border-white/20 focus:border-blue-400'
            }`}
            autoFocus
          />
          {error && (
            <p className="text-red-400 text-sm text-center">合言葉が一致しません</p>
          )}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-white text-slate-800 font-bold text-lg hover:bg-gray-100 transition-colors active:scale-[0.97]"
          >
            入室する
          </button>
        </form>

        <div className="mt-8 p-4 bg-white/10 rounded-xl text-sm text-slate-400 text-center space-y-1">
          <p>💡 デモ用合言葉:</p>
          <p className="text-slate-300">一色SKクラブ → <strong>sk2026</strong></p>
          <p className="text-slate-300">港スターズ → <strong>stars2026</strong></p>
        </div>
      </div>
    </div>
  );
}
