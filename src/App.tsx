import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TeamProvider } from './contexts/TeamContext';
import Layout from './components/Layout';
import TeamSelect from './pages/TeamSelect';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Announcements from './pages/Announcements';
import AnnouncementDetail from './pages/AnnouncementDetail';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <HashRouter>
      <TeamProvider>
        <Routes>
          <Route path="/" element={<TeamSelect />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/announcements/:id" element={<AnnouncementDetail />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TeamProvider>
    </HashRouter>
  );
}
