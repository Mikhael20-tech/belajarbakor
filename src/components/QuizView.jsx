import React, { useState } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Volume2, 
  Sparkles, 
  Award,
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import { speakKorean } from '../utils/speech';
import confetti from 'canvas-confetti';

export default function QuizView({ 
  quizzes, 
  soundEnabled, 
  addXp 
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  // Filter quizzes
  const filteredQuizzes = selectedFilter === 'ALL' 
    ? quizzes 
    : quizzes.filter(q => q.category.includes(selectedFilter) || q.type === selectedFilter);

  const currentQuiz = filteredQuizzes[currentIdx] || filteredQuizzes[0];

  const handleSpeak = (text) => {
    if (soundEnabled) speakKorean(text);
  };

  const handleSelectOption = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQuiz.answer;
    if (isCorrect) {
      setScore(s => s + 1);
      addXp(25);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < filteredQuizzes.length) {
      setCurrentIdx(c => c + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
      addXp(50); // Completion bonus
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  // Render question sentence with bold highlight
  const renderSentence = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return (
      <span className="hangul-text" style={{ fontSize: '1.4rem', fontWeight: '600', lineHeight: '1.6' }}>
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            const word = part.slice(2, -2);
            return (
              <span 
                key={i} 
                style={{
                  color: 'var(--accent-korean-red)',
                  fontWeight: '800',
                  padding: '2px 8px',
                  background: 'rgba(244, 63, 94, 0.15)',
                  borderRadius: '6px'
                }}
              >
                {word}
              </span>
            );
          }
          return part;
        })}
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '780px', margin: '0 auto', width: '100%' }}>
      
      {/* Quiz Filter Tabs */}
      {!isFinished && (
        <div className="glass-panel" style={{ padding: '12px 18px', display: 'flex', gap: '8px', overflowX: 'auto' }}>
          <button
            onClick={() => { setSelectedFilter('ALL'); handleRestart(); }}
            className={`btn ${selectedFilter === 'ALL' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.85rem', padding: '6px 14px' }}
          >
            Semua Soal ({quizzes.length})
          </button>
          <button
            onClick={() => { setSelectedFilter('Tebak Nuansa Kalimat'); handleRestart(); }}
            className={`btn ${selectedFilter === 'Tebak Nuansa Kalimat' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.85rem', padding: '6px 14px' }}
          >
            Tebak Nuansa Kalimat (TOPIK II)
          </button>
          <button
            onClick={() => { setSelectedFilter('Tata Bahasa'); handleRestart(); }}
            className={`btn ${selectedFilter === 'Tata Bahasa' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.85rem', padding: '6px 14px' }}
          >
            Tata Bahasa & Partikel
          </button>
        </div>
      )}

      {/* Main Quiz Card */}
      {!isFinished ? (
        currentQuiz ? (
          <div className="glass-panel" style={{ padding: '36px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Header: Progress & Category */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span className="badge badge-amber">
                  {currentQuiz.category}
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  Soal {currentIdx + 1} dari {filteredQuizzes.length}
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{
                  width: `${((currentIdx + 1) / filteredQuizzes.length) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-korean-red))',
                  transition: 'width 0.3s'
                }} />
              </div>
            </div>

            {/* Question Title */}
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '14px' }}>
                {currentQuiz.question}
              </h2>

              {/* Sentence Display Box */}
              {currentQuiz.sentenceKo && (
                <div style={{
                  padding: '24px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, rgba(30, 41, 66, 0.7), rgba(15, 23, 42, 0.8))',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}>
                  <div>
                    {renderSentence(currentQuiz.sentenceKo)}
                  </div>
                  <button
                    onClick={() => handleSpeak(currentQuiz.sentenceKo)}
                    className="btn btn-sound"
                    style={{ flexShrink: 0 }}
                    title="Dengarkan kalimat ini"
                  >
                    <Volume2 size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Options List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentQuiz.options.map((option, optIdx) => {
                let btnStyle = {
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: isAnswered ? 'default' : 'pointer',
                  fontSize: '1.05rem',
                  fontWeight: '600',
                  textAlign: 'left',
                  transition: 'all 0.15s'
                };

                if (isAnswered) {
                  if (optIdx === currentQuiz.answer) {
                    btnStyle.background = 'rgba(16, 185, 129, 0.15)';
                    btnStyle.border = '2px solid var(--accent-emerald)';
                    btnStyle.color = '#34D399';
                  } else if (optIdx === selectedOption) {
                    btnStyle.background = 'rgba(244, 63, 94, 0.15)';
                    btnStyle.border = '2px solid var(--accent-korean-red)';
                    btnStyle.color = '#FB7185';
                  } else {
                    btnStyle.opacity = 0.5;
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    style={btnStyle}
                    disabled={isAnswered}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem'
                      }}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {isAnswered && (
                      optIdx === currentQuiz.answer ? (
                        <CheckCircle2 size={20} color="var(--accent-emerald)" />
                      ) : optIdx === selectedOption ? (
                        <XCircle size={20} color="var(--accent-korean-red)" />
                      ) : null
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Next Button when answered */}
            {isAnswered && (
              <div style={{
                marginTop: '10px',
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                background: selectedOption === currentQuiz.answer 
                  ? 'rgba(16, 185, 129, 0.08)' 
                  : 'rgba(244, 63, 94, 0.08)',
                border: selectedOption === currentQuiz.answer 
                  ? '1px solid rgba(16, 185, 129, 0.3)' 
                  : '1px solid rgba(244, 63, 94, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lightbulb size={20} color={selectedOption === currentQuiz.answer ? '#10B981' : '#F43F5E'} />
                  <span style={{
                    fontWeight: '700',
                    color: selectedOption === currentQuiz.answer ? 'var(--accent-emerald)' : 'var(--accent-korean-red)'
                  }}>
                    {selectedOption === currentQuiz.answer ? 'Hebat, Jawaban Tepat! (+25 XP)' : 'Kurang Tepat! Pembahasan:'}
                  </span>
                </div>
                
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {currentQuiz.explanation}
                </p>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                  <button
                    onClick={handleNext}
                    className="btn btn-primary"
                    style={{ padding: '10px 22px' }}
                  >
                    <span>{currentIdx + 1 < filteredQuizzes.length ? 'Soal Selanjutnya' : 'Lihat Hasil Akhir'}</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
            <p>Tidak ada kuis dalam kategori ini.</p>
          </div>
        )
      ) : (
        /* Results View */
        <div className="glass-panel" style={{ padding: '48px 36px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFF',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)'
          }}>
            <Award size={40} />
          </div>

          <div>
            <span className="badge badge-indigo" style={{ marginBottom: '8px' }}>
              Kuis Selesai!
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', marginTop: '6px' }}>
              Skor Anda: {score} / {filteredQuizzes.length}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '6px' }}>
              Tingkat Akurasi: {Math.round((score / filteredQuizzes.length) * 100)}%
            </p>
          </div>

          <div style={{
            padding: '16px 28px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Sparkles size={20} color="var(--accent-primary)" />
            <span style={{ fontWeight: '700', color: 'var(--accent-primary)' }}>
              Total Bonus Diperoleh: +{score * 25 + 50} XP!
            </span>
          </div>

          <button
            onClick={handleRestart}
            className="btn btn-primary"
            style={{ padding: '14px 28px', fontSize: '1rem', marginTop: '12px' }}
          >
            <RotateCcw size={18} />
            <span>Ulangi Kuis</span>
          </button>

        </div>
      )}

    </div>
  );
}
