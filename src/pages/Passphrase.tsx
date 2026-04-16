import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeam } from '../contexts/TeamContext';

export default function Passphrase() {
  const { currentTeam } = useTeam();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  if (!currentTeam) {
    navigate('/');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === currentTeam.passphrase) {
      navigate('/dashboard');
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: `linear-gradient(135deg, ${currentTeam.themeColor}, ${currentTeam.themeColorLight})` }}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3"
            style={{ backgroundColor: currentTeam.themeColor }}
          >
            {currentTeam.name[0]}
          </div>
          <h2 className="text-xl font-bold text-gray-900">{currentTeam.name}</h2>
          <p className="text-sm text-gray-500 mt-1">合言葉を入力してください</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="合言葉"
            className={`w-full px-4 py-3 border-2 rounded-xl text-center text-lg focus:outline-none transition-colors ${
              error ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-400'
            }`}
            autoFocus
          />
          {error && (
            <p className="text-red-500 text-sm text-center">合言葉が違います</p>
          )}
          <button
            type="submit"
            className="w-full py-3 rounded-xl text-white font-bold text-lg transition-transform active:scale-[0.97]"
            style={{ backgroundColor: currentTeam.themeColor }}
          >
            入室する
          </button>
        </form>

        <button
          onClick={() => navigate('/')}
          className="w-full mt-4 text-sm text-gray-400 hover:text-gray-600"
        >
          ← チーム選択に戻る
        </button>

        <div className="mt-6 p-3 bg-blue-50 rounded-lg text-xs text-blue-600 text-center">
          💡 デモ用合言葉: <strong>{currentTeam.passphrase}</strong>
        </div>
      </div>
    </div>
  );
}
