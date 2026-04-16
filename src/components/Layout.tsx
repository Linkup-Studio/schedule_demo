import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Calendar, Bell, Settings, LogOut } from 'lucide-react';
import { useTeam } from '../contexts/TeamContext';

export default function Layout() {
  const { currentTeam, isAdmin, setCurrentTeam, setIsAdmin } = useTeam();
  const navigate = useNavigate();

  if (!currentTeam) return null;

  const handleLogout = () => {
    setCurrentTeam(null as unknown as ReturnType<typeof Object>);
    setIsAdmin(false);
    navigate('/');
  };

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'ホーム' },
    { to: '/events', icon: Calendar, label: '予定' },
    { to: '/announcements', icon: Bell, label: 'お知らせ' },
    { to: '/settings', icon: Settings, label: '設定' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ヘッダー */}
      <header
        className="text-white px-4 py-3 flex items-center justify-between shadow-md"
        style={{ backgroundColor: currentTeam.themeColor }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
            {currentTeam.name[0]}
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight">{currentTeam.name}</h1>
            {isAdmin && (
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">管理者モード</span>
            )}
          </div>
        </div>
        <button onClick={handleLogout} className="p-2 hover:bg-white/10 rounded-lg" title="チーム選択に戻る">
          <LogOut size={20} />
        </button>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      {/* ボトムナビ */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 z-50">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
                isActive ? 'font-bold' : 'text-gray-400'
              }`
            }
            style={({ isActive }) => (isActive ? { color: currentTeam.themeColor } : {})}
          >
            <Icon size={22} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
