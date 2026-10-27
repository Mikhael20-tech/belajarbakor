import React, { useState } from 'react';
import { 
  Play, 
  Volume2, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Lightbulb, 
  BookOpen, 
  Sparkles,
  Award
} from 'lucide-react';
import { speakKorean } from '../utils/speech';
import confetti from 'canvas-confetti';

export default function CurriculumView({ 
  curriculum, 
  completedLessons, 
  onToggleComplete, 
  soundEnabled, 
  addXp 
}) {
  const [selectedLevelIdx, setSelectedLevelIdx] = useState(0);
  const [selectedLessonId, setSelectedLessonId] = useState(curriculum[0]?.lessons[0]?.id || null);

  const currentLevel = curriculum[selectedLevelIdx] || curriculum[0];
  const currentLesson = currentLevel.lessons.find(l => l.id === selectedLessonId) || currentLevel.lessons[0];

  const isCompleted = completedLessons.includes(currentLesson?.id);

  const handleSpeak = (text) => {
    if (soundEnabled) speakKorean(text);
  };

  const handlePlayAllDialogue = () => {
    if (!soundEnabled || !currentLesson.dialogue) return;
    let delay = 0;
    currentLesson.dialogue.forEach((line) => {
      setTimeout(() => {
        speakKorean(line.ko);
      }, delay);
      delay += 2500;
    });
  };

  const handleMarkComplete = () => {
    if (!isCompleted) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      addXp(50);
    }
    onToggleComplete(currentLesson.id);
  };

  // Find next and prev lessons
  const currentLessonIndex = currentLevel.lessons.findIndex(l => l.id === currentLesson?.id);
  const prevLesson = currentLessonIndex > 0 ? currentLevel.lessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < currentLevel.lessons.length - 1 ? currentLevel.lessons[currentLessonIndex + 1] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Level Selector Tabs */}
      <div style={{
        display: 'flex',
        gap: '12px',
        overflowX: 'auto',
        paddingBottom: '8px'
      }}>
        {curriculum.map((lvl, idx) => {
          const isActive = idx === selectedLevelIdx;
          const completedInLevel = lvl.lessons.filter(l => completedLessons.includes(l.id)).length;
          const progressPercent = Math.round((completedInLevel / lvl.lessons.length) * 100);

          return (
            <button
              key={lvl.level}
              onClick={() => {
                setSelectedLevelIdx(idx);
                setSelectedLessonId(lvl.lessons[0]?.id);
              }}
              className="glass-panel"
              style={{
                padding: '14px 20px',
                textAlign: 'left',
                minWidth: '220px',
                cursor: 'pointer',
                border: isActive ? `2px solid ${lvl.color || 'var(--accent-primary)'}` : '1px solid var(--border-color)',
                background: isActive ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="badge" style={{ background: `${lvl.color}25`, color: lvl.color, border: `1px solid ${lvl.color}50` }}>
                    {lvl.badge}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {completedInLevel}/{lvl.lessons.length}
                  </span>
                </div>
                <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Level {lvl.level}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  {lvl.title.split(':')[1]?.trim() || lvl.title}
                </p>
              </div>

              {/* Progress bar */}
              <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginTop: '12px', overflow: 'hidden' }}>
                <div style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  background: lvl.color || 'var(--accent-primary)',
                  transition: 'width 0.3s'
                }} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Content: Lessons Sidebar + Detail View */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Left: Lessons List */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>
              Daftar Pelajaran
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {currentLevel.lessons.length} Materi
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '680px', overflowY: 'auto' }}>
            {currentLevel.lessons.map(lesson => {
              const isCurrent = lesson.id === currentLesson?.id;
              const isDone = completedLessons.includes(lesson.id);

              return (
                <div
                  key={lesson.id}
                  onClick={() => setSelectedLessonId(lesson.id)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    background: isCurrent ? 'var(--bg-secondary)' : 'transparent',
                    border: isCurrent ? '1px solid var(--accent-primary)' : '1px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isCurrent) e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isCurrent) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: isDone ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.08)',
                      color: isDone ? 'var(--accent-emerald)' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      flexShrink: 0
                    }}>
                      {isDone ? <CheckCircle2 size={16} /> : lesson.number}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div className="hangul-text" style={{ fontSize: '0.95rem', fontWeight: '700', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {lesson.titleKo}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {lesson.titleEn}
                      </div>
                    </div>
                  </div>

                  <ChevronRight size={16} color={isCurrent ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Lesson Detail */}
        {currentLesson && (
          <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* Header of Lesson */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span className="badge badge-indigo">
                    Pelajaran #{currentLesson.number}
                  </span>
                  <span className="badge" style={{ background: `${currentLevel.color}25`, color: currentLevel.color }}>
                    Level {currentLevel.level}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <h2 className="hangul-text" style={{ fontSize: '2rem', fontWeight: '800' }}>
                    {currentLesson.titleKo}
                  </h2>
                  <button 
                    onClick={() => handleSpeak(currentLesson.titleKo)}
                    className="btn btn-sound"
                    title="Dengarkan pengucapan judul"
                  >
                    <Volume2 size={16} />
                    <span>Dengar</span>
                  </button>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '4px' }}>
                  {currentLesson.titleEn}
                </p>
              </div>

              {/* Mark Completed Button */}
              <button 
                onClick={handleMarkComplete}
                className={`btn ${isCompleted ? 'btn-secondary' : 'btn-primary'}`}
                style={{
                  border: isCompleted ? '1px solid var(--accent-emerald)' : 'none',
                  color: isCompleted ? 'var(--accent-emerald)' : '#FFF'
                }}
              >
                <CheckCircle2 size={18} />
                <span>{isCompleted ? 'Sudah Selesai ✓' : 'Tandai Selesai (+50 XP)'}</span>
              </button>
            </div>

            {/* Key Grammar Box */}
            <div style={{
              padding: '20px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.08))',
              border: '1px solid rgba(99, 102, 241, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', fontWeight: '700', fontSize: '0.9rem', marginBottom: '8px' }}>
                <Sparkles size={16} />
                <span>RUMUS TATA BAHASA KUNCI</span>
              </div>
              <div className="hangul-text" style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                {currentLesson.keyGrammar}
              </div>
            </div>

            {/* Explanation */}
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={18} color="var(--accent-primary)" />
                <span>Penjelasan Materi</span>
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.7' }}>
                {currentLesson.explanation}
              </p>
            </div>

            {/* Interactive Dialogue */}
            {currentLesson.dialogue && currentLesson.dialogue.length > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Play size={18} color="var(--accent-korean-blue)" />
                    <span>Contoh Percakapan Asli</span>
                  </h3>
                  <button 
                    onClick={handlePlayAllDialogue}
                    className="btn btn-secondary" 
                    style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                  >
                    <Volume2 size={16} />
                    <span>Putar Semua Dialog</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {currentLesson.dialogue.map((line, dIdx) => (
                    <div 
                      key={dIdx}
                      style={{
                        padding: '16px',
                        borderRadius: 'var(--radius-md)',
                        background: line.speaker === 'A' ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: line.speaker === 'A' ? 'var(--accent-primary)' : 'var(--accent-korean-blue)',
                          color: '#FFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '800',
                          fontSize: '0.85rem',
                          flexShrink: 0
                        }}>
                          {line.speaker}
                        </div>
                        <div>
                          <div className="hangul-text" style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                            {line.ko}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--accent-korean-blue)', fontWeight: '500', marginBottom: '2px' }}>
                            {line.id}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {line.en}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSpeak(line.ko)}
                        className="btn btn-sound"
                        style={{ padding: '6px 10px' }}
                        title="Dengarkan kalimat ini"
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lesson Vocabulary Grid */}
            {currentLesson.vocab && currentLesson.vocab.length > 0 && (
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '12px' }}>
                  Kosakata Utama Pada Pelajaran Ini
                </h3>
                <div className="grid-2">
                  {currentLesson.vocab.map((v, vIdx) => (
                    <div 
                      key={vIdx}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div className="hangul-text" style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                          {v.ko}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {v.meaning}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleSpeak(v.ko)}
                        className="btn btn-sound"
                        style={{ padding: '6px 8px' }}
                      >
                        <Volume2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pro Tip */}
            {currentLesson.tips && (
              <div style={{
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <Lightbulb size={20} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: '700', color: '#FBBF24', fontSize: '0.9rem', marginBottom: '4px' }}>
                    TIPS & CATATAN BUDAYA KOREA
                  </div>
                  <div style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    {currentLesson.tips}
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Lesson Navigation */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '20px',
              marginTop: '10px'
            }}>
              {prevLesson ? (
                <button
                  onClick={() => setSelectedLessonId(prevLesson.id)}
                  className="btn btn-secondary"
                >
                  <ChevronLeft size={18} />
                  <span>#{prevLesson.number} {prevLesson.titleKo}</span>
                </button>
              ) : <div />}

              {nextLesson && (
                <button
                  onClick={() => setSelectedLessonId(nextLesson.id)}
                  className="btn btn-primary"
                >
                  <span>#{nextLesson.number} {nextLesson.titleKo}</span>
                  <ChevronRight size={18} />
                </button>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
