import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CurriculumView from './components/CurriculumView';
import FlashcardsView from './components/FlashcardsView';
import QuizView from './components/QuizView';
import GrammarBankView from './components/GrammarBankView';

// Import extracted datasets
import ttmikCurriculum from './data/ttmikCurriculum.json';
import cards720 from './data/flashcards720.json';
import indoWords from './data/indonesianTOPIK.json';
import grammarList from './data/topikGrammar.json';
import topikVocab from './data/topikVocab.json';
import quizzes from './data/quizzes.json';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('hm_active_tab') || 'dashboard';
  });

  // Gamification & Settings State
  const [streak, setStreak] = useState(() => {
    return parseInt(localStorage.getItem('hm_streak') || '3', 10);
  });

  const [xp, setXp] = useState(() => {
    return parseInt(localStorage.getItem('hm_xp') || '250', 10);
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('hm_sound') !== 'false';
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('hm_theme') || 'dark';
  });

  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hm_completed_lessons') || '["l1-01"]');
    } catch {
      return ['l1-01'];
    }
  });

  const [masteredCards, setMasteredCards] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hm_mastered_cards') || '[]');
    } catch {
      return [];
    }
  });

  const [bookmarkedGrammar, setBookmarkedGrammar] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hm_bookmarks') || '[]');
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('hm_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('hm_streak', streak.toString());
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('hm_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('hm_sound', soundEnabled.toString());
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('hm_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('hm_completed_lessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem('hm_mastered_cards', JSON.stringify(masteredCards));
  }, [masteredCards]);

  useEffect(() => {
    localStorage.setItem('hm_bookmarks', JSON.stringify(bookmarkedGrammar));
  }, [bookmarkedGrammar]);

  // Handlers
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const addXp = (amount) => {
    setXp(prev => prev + amount);
  };

  const handleToggleLessonComplete = (lessonId) => {
    setCompletedLessons(prev => {
      if (prev.includes(lessonId)) {
        return prev.filter(id => id !== lessonId);
      } else {
        return [...prev, lessonId];
      }
    });
  };

  const handleMarkCard = (cardId, isMastered) => {
    setMasteredCards(prev => {
      if (isMastered) {
        return prev.includes(cardId) ? prev : [...prev, cardId];
      } else {
        return prev.filter(id => id !== cardId);
      }
    });
  };

  const handleToggleBookmark = (grammarId) => {
    setBookmarkedGrammar(prev => {
      if (prev.includes(grammarId)) {
        return prev.filter(id => id !== grammarId);
      } else {
        return [...prev, grammarId];
      }
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Sticky Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        streak={streak}
        xp={xp}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        theme={theme}
        toggleTheme={toggleTheme}
        masteredCount={masteredCards.length}
      />

      {/* Main View Area */}
      <main className="app-container" style={{ flexGrow: 1 }}>
        {activeTab === 'dashboard' && (
          <Dashboard
            setActiveTab={setActiveTab}
            completedLessons={completedLessons}
            masteredCards={masteredCards}
            soundEnabled={soundEnabled}
            stats={{ streak, xp, completedLessonsCount: completedLessons.length }}
            ttmikCurriculum={ttmikCurriculum}
            grammarList={grammarList}
            cards720={cards720}
            indoWords={indoWords}
          />
        )}

        {activeTab === 'curriculum' && (
          <CurriculumView
            curriculum={ttmikCurriculum}
            completedLessons={completedLessons}
            onToggleComplete={handleToggleLessonComplete}
            soundEnabled={soundEnabled}
            addXp={addXp}
          />
        )}

        {activeTab === 'flashcards' && (
          <FlashcardsView
            cards720={cards720}
            indoWords={indoWords}
            topikVocab={topikVocab}
            masteredCards={masteredCards}
            onMarkCard={handleMarkCard}
            soundEnabled={soundEnabled}
            addXp={addXp}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizView
            quizzes={quizzes}
            soundEnabled={soundEnabled}
            addXp={addXp}
          />
        )}

        {activeTab === 'grammar' && (
          <GrammarBankView
            grammarList={grammarList}
            bookmarkedGrammar={bookmarkedGrammar}
            onToggleBookmark={handleToggleBookmark}
            soundEnabled={soundEnabled}
          />
        )}
      </main>

      {/* Modern Footer */}
      <footer style={{
        marginTop: '60px',
        padding: '24px 0',
        borderTop: '1px solid var(--border-color)',
        background: 'var(--bg-secondary)',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: 'var(--text-muted)'
      }}>
        <div className="app-container">
          <p style={{ marginBottom: '6px' }}>
            🇰🇷 <strong>한글마루 HangulMaru</strong> — Platform Pembelajaran Bahasa Korea Interaktif.
          </p>
          <p>
            Materi diolah langsung dari TTMIK Level 1-9, 720 Everyday Words, dan Modul Kosakata TOPIK II Indonesia.
          </p>
        </div>
      </footer>

    </div>
  );
}
