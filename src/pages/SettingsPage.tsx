import { useState } from 'react';
import { useTeam } from '../contexts/TeamContext';
import { Shield, Users, Info } from 'lucide-react';

export default function SettingsPage() {
  const { currentTeam, isAdmin, setIsAdmin } = useTeam();
  const [tapCount, setTapCount] = useState(0);
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  if (!currentTeam) return null;

  const handleLogoTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    if (newCount >= 5) {
      setShowPinInput(true);
      setTapCount(0);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === currentTeam.adminPin) {
      setIsAdmin(true);
      setShowPinInput(false);
      setPin('');
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 2000);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold text-gray-800">⚙️ 設定</h2>

      {/* チーム情報 */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogoTap}
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0 active:scale-95 transition-transform"
            style={{ backgroundColor: currentTeam.themeColor }}
          >
            {currentTeam.name[0]}
          </button>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{currentTeam.name}</h3>
            <p className="text-sm text-gray-500">{currentTeam.description}</p>
          </div>
        </div>
      </div>

      {/* 管理者パスコード入力 */}
      {showPinInput && !isAdmin && (
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Shield size={18} /> 管理者パスコード
          </h3>
          <form onSubmit={handlePinSubmit} className="space-y-3">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="パスコードを入力"
              className={`w-full px-4 py-3 border-2 rounded-xl text-center focus:outline-none ${
                pinError ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-400'
              }`}
              autoFocus
            />
            {pinError && <p className="text-red-500 text-sm text-center">パスコードが違います</p>}
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-bold"
              style={{ backgroundColor: currentTeam.themeColor }}
            >
              認証する
            </button>
          </form>
          <div className="mt-3 p-3 bg-blue-50 rounded-lg text-xs text-blue-600 text-center">
            💡 デモ用パスコード: <strong>{currentTeam.adminPin}</strong>
          </div>
        </div>
      )}

      {/* 管理者メニュー */}
      {isAdmin && (
        <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Shield size={18} className="text-amber-500" /> 管理者メニュー
          </h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
            ✅ 管理者モードが有効です
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Users size={18} className="text-gray-400" />
            <div>
              <div className="text-sm font-bold text-gray-800">選手人数</div>
              <div className="text-xs text-gray-500">
                中1: {currentTeam.playerCounts.grade1}名 /
                中2: {currentTeam.playerCounts.grade2}名 /
                中3: {currentTeam.playerCounts.grade3}名
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsAdmin(false)}
            className="w-full py-2 text-sm text-red-500 border border-red-200 rounded-xl hover:bg-red-50"
          >
            管理者モードを解除
          </button>
        </div>
      )}

      {/* アプリ情報 */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Info size={18} /> このアプリについて
        </h3>
        <div className="text-sm text-gray-500 space-y-2">
          <p>BallPark — マルチテナントデモ</p>
          <p>1つのアプリで複数チームを管理できます。</p>
          <p className="text-xs text-gray-400">チームごとにテーマカラー・データが完全分離。</p>
        </div>
      </div>

      {!isAdmin && !showPinInput && (
        <p className="text-xs text-gray-300 text-center">💡 管理者モード: ロゴを5回タップ</p>
      )}
    </div>
  );
}
