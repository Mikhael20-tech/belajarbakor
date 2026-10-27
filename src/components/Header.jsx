import React from 'react';
import { 
  Flame, 
  Zap, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  BookOpen, 
  Layers, 
  HelpCircle, 
  Bookmark, 
  LayoutDashboard 
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  streak, 
  xp, 
  soundEnabled, 
  setSoundEnabled, 
  theme, 
  toggleTheme,
  masteredCount
}) {
  const navItems = [
    { id: 'dashboard', label: 'Beranda', icon: LayoutDashboard },
    { id: 'curriculum', label: 'Kurikulum TTMIK', icon: BookOpen },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
    { id: 'quiz', label: 'Kuis & TOPIK', icon: HelpCircle },
    { id: 'grammar', label: 'Kamus Grammar', icon: Bookmark },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-color)',
      marginBottom: '28px'
    }}>
      <div className="app-container" style={{ paddingBottom: '12px', paddingTop: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          
          {/* Logo Brand */}
          <div 
            onClick={() => setActiveTab('dashboard')} 
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #4F46E5, #F43F5E)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)'
            }}>
              🇰🇷
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="hangul-text" style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
                  한글마루
                </span>
                <span style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
                  HangulMaru
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                Portal Belajar Korea Terstruktur
              </p>
            </div>
          </div>

          {/* Gamification Stats & Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Streak */}
            <div className="badge badge-amber" title="Streak Belajar Aktif" style={{ padding: '6px 12px' }}>
              <Flame size={16} fill="#F59E0B" color="#F59E0B" />
              <span>{streak} Hari</span>
            </div>

            {/* XP */}
            <div className="badge badge-indigo" title="Total XP Terkumpul" style={{ padding: '6px 12px' }}>
              <Zap size={16} fill="#6366F1" color="#6366F1" />
              <span>{xp} XP</span>
            </div>

            {/* Words Mastered */}
            <div className="badge badge-emerald hide-on-mobile" title="Kosakata Dikuasai" style={{ padding: '6px 12px' }}>
              <span>🧠 {masteredCount} Hafal</span>
            </div>

            {/* Sound Toggle */}
            <button 
              className="btn btn-ghost" 
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Audio Suara Aktif (Klik untuk Matikan)" : "Audio Suara Mati (Klik untuk Nyalakan)"}
              style={{ padding: '8px 10px', borderRadius: 'var(--radius-full)' }}
            >
              {soundEnabled ? <Volume2 size={18} color="var(--accent-primary)" /> : <VolumeX size={18} color="var(--text-muted)" />}
            </button>

            {/* Theme Toggle */}
            <button 
              className="btn btn-ghost" 
              onClick={toggleTheme}
              title={theme === 'dark' ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
              style={{ padding: '8px 10px', borderRadius: 'var(--radius-full)' }}
            >
              {theme === 'dark' ? <Sun size={18} color="#FBBF24" /> : <Moon size={18} color="#6366F1" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{
          display: 'flex',
          gap: '8px',
          marginTop: '16px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-tab-button ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
