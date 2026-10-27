import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  Check, 
  X, 
  Search, 
  HelpCircle,
  Sparkles,
  Layers,
  Filter
} from 'lucide-react';
import { speakKorean } from '../utils/speech';
import confetti from 'canvas-confetti';

export default function FlashcardsView({ 
  cards720, 
  indoWords, 
  topikVocab, 
  masteredCards, 
  onMarkCard, 
  soundEnabled, 
  addXp 
}) {
  const [deckType, setDeckType] = useState('720'); // '720' | 'indo' | 'topik'
  const [selectedDay, setSelectedDay] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Get active raw list based on deckType
  let rawList = [];
  if (deckType === '720') {
    rawList = cards720.map(c => ({
      id: `720-${c.id}`,
      hangul: c.hangul,
      meaning: c.meaning,
      category: c.category,
      day: c.day,
      examples: []
    }));
  } else if (deckType === 'indo') {
    rawList = indoWords.map(c => ({
      id: `indo-${c.id}`,
      hangul: c.hangul,
      meaning: c.meaningId,
      category: 'TOPIK II Kata Kerja & Sifat',
      day: `Hal ${c.page}`,
      examples: c.examples || []
    }));
  } else {
    rawList = topikVocab.map(c => ({
      id: `topik-${c.id}`,
      hangul: c.hangul,
      meaning: c.meaning,
      category: 'TOPIK II Intermediate',
      day: 'Vocab Bank',
      examples: []
    }));
  }

  // Filter list
  const filteredList = rawList.filter(item => {
    const matchesSearch = item.hangul.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDay = selectedDay === 'ALL' || item.day === selectedDay;
    return matchesSearch && matchesDay;
  });

  // Keep index within bounds
  const currentCard = filteredList[currentIndex] || filteredList[0];
  const isMastered = currentCard ? masteredCards.includes(currentCard.id) : false;

  // Extract unique days for 720
  const uniqueDays = ['ALL', ...Array.from(new Set(cards720.map(c => c.day))).slice(0, 31)];

  const handleSpeak = (e, text) => {
    e.stopPropagation();
    if (soundEnabled) speakKorean(text);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredList.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredList.length) % filteredList.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const randomIndex = Math.floor(Math.random() * filteredList.length);
    setCurrentIndex(randomIndex);
  };

  const handleMarkMastery = (status) => {
    if (!currentCard) return;
    if (status === 'mastered') {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
      addXp(15);
      onMarkCard(currentCard.id, true);
    } else {
      onMarkCard(currentCard.id, false);
    }
    handleNext();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(f => !f);
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredList.length]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Top Controls: Deck Selector & Search */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          
          {/* Deck Type Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => { setDeckType('720'); setCurrentIndex(0); setIsFlipped(false); }}
              className={`btn ${deckType === '720' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.9rem' }}
            >
              <Layers size={16} />
              <span>720 Everyday Words (31 Hari)</span>
            </button>

            <button
              onClick={() => { setDeckType('indo'); setCurrentIndex(0); setIsFlipped(false); }}
              className={`btn ${deckType === 'indo' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.9rem' }}
            >
              <Sparkles size={16} />
              <span>TOPIK Indonesia (Contoh Kalimat)</span>
            </button>

            <button
              onClick={() => { setDeckType('topik'); setCurrentIndex(0); setIsFlipped(false); }}
              className={`btn ${deckType === 'topik' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.9rem' }}
            >
              <span>Bank Kosakata TOPIK II</span>
            </button>
          </div>

          {/* Search Bar */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            minWidth: '240px',
            flexGrow: 1,
            maxWidth: '360px'
          }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
            <input
              type="text"
              placeholder="Cari kata Korea atau arti..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentIndex(0); }}
              style={{
                width: '100%',
                padding: '10px 14px 10px 36px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Day selector for 720 deck */}
        {deckType === '720' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', whiteSpace: 'nowrap' }}>
              Pilih Hari:
            </span>
            {uniqueDays.map(day => (
              <button
                key={day}
                onClick={() => { setSelectedDay(day); setCurrentIndex(0); setIsFlipped(false); }}
                style={{
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: selectedDay === day ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  background: selectedDay === day ? 'var(--accent-primary)' : 'transparent',
                  color: selectedDay === day ? '#FFF' : 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s'
                }}
              >
                {day}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Flashcard Stage */}
      {currentCard ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          
          {/* Card Meta Indicator */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '580px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              Kartu ke-{currentIndex + 1} dari {filteredList.length}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {isMastered && (
                <span className="badge badge-emerald">
                  <Check size={14} /> Sudah Dikuasai
                </span>
              )}
              <button 
                onClick={handleShuffle} 
                className="btn btn-ghost" 
                style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                title="Acak Urutan Kartu"
              >
                <Shuffle size={16} />
                <span>Acak</span>
              </button>
            </div>
          </div>

          {/* 3D Flip Card */}
          <div 
            className={`flip-card-container ${isFlipped ? 'is-flipped' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="flip-card-inner">
              
              {/* FRONT OF CARD */}
              <div className="flip-card-front">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-indigo">
                    {currentCard.category || 'Kosakata Korea'}
                  </span>
                  <span className="badge badge-rose">
                    {currentCard.day}
                  </span>
                </div>

                <div style={{ margin: 'auto 0' }}>
                  <div className="hangul-text" style={{ fontSize: '3.4rem', fontWeight: '800', color: '#FFF', marginBottom: '14px' }}>
                    {currentCard.hangul}
                  </div>
                  <button
                    onClick={(e) => handleSpeak(e, currentCard.hangul)}
                    className="btn btn-sound"
                    style={{ fontSize: '0.95rem', padding: '8px 18px', margin: '0 auto' }}
                  >
                    <Volume2 size={18} />
                    <span>Dengarkan Pengucapan</span>
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <RotateCw size={14} />
                  <span>Klik kartu atau tekan [Spasi] untuk melihat arti</span>
                </div>
              </div>

              {/* BACK OF CARD */}
              <div className="flip-card-back">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-amber">
                    Arti & Makna
                  </span>
                  <button
                    onClick={(e) => handleSpeak(e, currentCard.hangul)}
                    className="btn btn-sound"
                    style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                  >
                    <Volume2 size={14} />
                  </button>
                </div>

                <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="hangul-text" style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-primary)' }}>
                    {currentCard.hangul}
                  </div>
                  
                  <div style={{ fontSize: '1.45rem', fontWeight: '700', color: '#FFFFFF', padding: '0 10px' }}>
                    {currentCard.meaning}
                  </div>

                  {/* Real-life Example Sentences (if available, e.g. Indonesian TOPIK deck) */}
                  {currentCard.examples && currentCard.examples.length > 0 && (
                    <div style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      textAlign: 'left',
                      marginTop: '6px'
                    }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', fontWeight: '700', marginBottom: '4px' }}>
                        CONTOH KALIMAT NYATA:
                      </div>
                      <div className="hangul-text" style={{ fontSize: '0.95rem', fontWeight: '600', color: '#FFF' }}>
                        {currentCard.examples[0].ko}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {currentCard.examples[0].id}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <RotateCw size={14} />
                  <span>Klik lagi untuk kembali ke depan</span>
                </div>
              </div>

            </div>
          </div>

          {/* Mastery & Navigation Control Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '10px' }}>
            
            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="btn btn-secondary"
              style={{ padding: '12px 18px' }}
              title="Kartu Sebelumnya [←]"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Belum Hafal */}
            <button
              onClick={() => handleMarkMastery('again')}
              className="btn btn-secondary"
              style={{
                border: '1px solid rgba(244, 63, 94, 0.4)',
                color: 'var(--accent-korean-red)',
                padding: '12px 20px'
              }}
            >
              <X size={18} />
              <span>Belum Hafal</span>
            </button>

            {/* Sudah Hafal */}
            <button
              onClick={() => handleMarkMastery('mastered')}
              className="btn btn-primary"
              style={{
                background: 'linear-gradient(135deg, #10B981, #059669)',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                padding: '12px 24px'
              }}
            >
              <Check size={18} />
              <span>Sudah Hafal (+15 XP)</span>
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="btn btn-secondary"
              style={{ padding: '12px 18px' }}
              title="Kartu Selanjutnya [→]"
            >
              <ChevronRight size={20} />
            </button>

          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Shortcut Keyboard: [Spasi] Balik kartu, [←] Sebelumnya, [→] Selanjutnya
          </p>

        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Tidak ada kosakata yang cocok dengan pencarian "{searchQuery}".
          </p>
        </div>
      )}

    </div>
  );
}
