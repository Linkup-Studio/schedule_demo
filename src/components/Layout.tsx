import { useState, useRef, useCallback, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, Megaphone, Plus } from 'lucide-react';
import { useTeam } from '../contexts/TeamContext';

export default function Layout() {
  const { currentTeam, isAdmin, setIsAdmin, setCurrentTeam } = useTeam();
  const navigate = useNavigate();
  const location = useLocation();

  const [tapCount, setTapCount] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [passcode, setPasscode] = useState('');
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!currentTeam) navigate('/');
  }, [currentTeam, navigate]);

  const handleLogoTap = useCallback(() => {
    const next = tapCount + 1;
    setTapCount(next);
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => setTapCount(0), 2000);

    if (next >= 5) {
      setTapCount(0);
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
      if (isAdmin) {
        setIsAdmin(false);
      } else {
        setShowDialog(true);
        setPasscode('');
      }
    }
  }, [tapCount, isAdmin, setIsAdmin]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTeam && passcode === currentTeam.adminPin) {
      setIsAdmin(true);
      setShowDialog(false);
    } else {
      alert('パスコードが違います');
    }
  };

  const handleLogout = () => {
    setCurrentTeam(null as unknown as ReturnType<typeof Object>);
    setIsAdmin(false);
    navigate('/');
  };

  if (!currentTeam) return null;

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'ホーム' },
    { to: '/events', icon: Calendar, label: '予定' },
    { to: '/announcements', icon: Megaphone, label: '連絡' },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* ヘッダー（SKアプリ準拠: glass-card, 中央寄せ） */}
      <header className="sticky top-0 z-50 glass-card">
        <div className="px-4 h-12 flex items-center justify-center">
          <button type="button" onClick={handleLogoTap} className="flex items-center gap-2.5 select-none">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
              style={{
                background: isAdmin
                  ? 'linear-gradient(135deg, #f59e0b, #ea580c)'
                  : `linear-gradient(135deg, ${currentTeam.themeColor}, ${currentTeam.themeColorLight})`,
              }}
            >
              <span className="text-white font-black text-[11px]">
                {currentTeam.name.slice(0, 2)}
              </span>
            </div>
            <span className="font-black text-sm" style={{ color: currentTeam.themeColor }}>
              {currentTeam.name}
            </span>
            {isAdmin && (
              <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                管理者
              </span>
            )}
          </button>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      {/* ボトムナビ（SKアプリ準拠） */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-[var(--color-border)]">
        <div className="flex items-end justify-around px-1 pt-1 pb-1">
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = to === '/dashboard'
              ? location.pathname === '/dashboard'
              : location.pathname.startsWith(to);

            return (
              <NavLink
                key={to}
                to={to}
                className="flex flex-col items-center justify-center min-w-[56px] py-1.5 rounded-xl transition-all active:scale-95"
              >
                <div
                  className="w-8 h-8 flex items-center justify-center rounded-xl transition-all"
                  style={isActive ? { backgroundColor: `${currentTeam.themeColor}15` } : {}}
                >
                  <Icon
                    className="w-[22px] h-[22px]"
                    strokeWidth={isActive ? 2.5 : 1.8}
                    style={{ color: isActive ? currentTeam.themeColor : 'var(--color-muted)' }}
                  />
                </div>
                <span
                  className={`text-[9px] mt-0.5 ${isActive ? 'font-black' : 'font-bold'}`}
                  style={{ color: isActive ? currentTeam.themeColor : 'var(--color-muted)' }}
                >
                  {label}
                </span>
              </NavLink>
            );
          })}

          {/* 管理者のみ: 予定登録ボタン */}
          {isAdmin && (
            <NavLink to="/events" className="flex flex-col items-center justify-center -mt-4 active:scale-95 transition-transform">
              <div
                className="w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center"
                style={{ backgroundColor: currentTeam.themeColor, boxShadow: `0 4px 14px ${currentTeam.themeColor}40` }}
              >
                <Plus className="w-6 h-6 text-white" />
              </div>
              <span className="text-[9px] font-bold mt-0.5" style={{ color: currentTeam.themeColor }}>
                予定登録
              </span>
            </NavLink>
          )}
        </div>
      </nav>

      {/* ログアウトリンク（小さく画面上部に） */}
      <button
        onClick={handleLogout}
        className="fixed top-0 right-0 z-50 px-3 h-12 flex items-center text-[10px] text-[var(--color-muted)] active:opacity-50"
      >
        退出
      </button>

      {/* パスコード入力ダイアログ */}
      {showDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-white rounded-2xl p-5 mx-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-black text-base text-center mb-1">🔒 管理者ログイン</h3>
            <p className="text-[11px] text-[var(--color-muted)] text-center mb-4">代表者パスコードを入力してください</p>
            <form onSubmit={handlePinSubmit} className="space-y-3">
              <input
                type="password"
                placeholder="パスコード"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                autoFocus
                className="w-full bg-[var(--color-background)] border border-[var(--color-border)] px-4 py-3 rounded-xl text-[15px] text-center tracking-widest focus:outline-none focus:ring-2 shadow-sm"
                style={{ '--tw-ring-color': `${currentTeam.themeColor}30` } as React.CSSProperties}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowDialog(false)}
                  className="flex-1 py-3 bg-gray-100 text-[var(--color-muted)] text-[13px] font-bold rounded-xl active:bg-gray-200 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-white font-bold text-[13px] rounded-xl active:scale-95 transition-all shadow-sm"
                  style={{ backgroundColor: currentTeam.themeColor }}
                >
                  解除
                </button>
              </div>
            </form>
            <div className="mt-3 p-2.5 bg-blue-50 rounded-lg text-[10px] text-blue-600 text-center">
              💡 デモ用: <strong>{currentTeam.adminPin}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
