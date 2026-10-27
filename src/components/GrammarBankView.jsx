import React, { useState } from 'react';
import { 
  Bookmark, 
  Search, 
  Volume2, 
  BookMarked, 
  Star, 
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { speakKorean } from '../utils/speech';

export default function GrammarBankView({ 
  grammarList, 
  bookmarkedGrammar, 
  onToggleBookmark, 
  soundEnabled 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' | 'BOOKMARKED'
  const [expandedId, setExpandedId] = useState(null);

  const handleSpeak = (e, text) => {
    e.stopPropagation();
    if (soundEnabled) speakKorean(text);
  };

  const filteredList = grammarList.filter(item => {
    const matchesSearch = item.pattern.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.exampleKo && item.exampleKo.toLowerCase().includes(searchQuery.toLowerCase()));
    const isBookmarked = bookmarkedGrammar.includes(item.id);
    const matchesFilter = filterMode === 'ALL' || isBookmarked;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner & Search */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-emerald">
                <BookMarked size={14} /> Kamus Referensi
              </span>
              <span className="badge badge-indigo">
                {grammarList.length} Pola Tata Bahasa TOPIK II
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>
              Bank Tata Bahasa Korea (Grammar Bank)
            </h2>
          </div>

          {/* Filter Bookmarked */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setFilterMode('ALL')}
              className={`btn ${filterMode === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.85rem', padding: '8px 16px' }}
            >
              Semua ({grammarList.length})
            </button>
            <button
              onClick={() => setFilterMode('BOOKMARKED')}
              className={`btn ${filterMode === 'BOOKMARKED' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.85rem', padding: '8px 16px' }}
            >
              <Star size={16} fill={filterMode === 'BOOKMARKED' ? '#FFF' : 'none'} />
              <span>Tersimpan ({bookmarkedGrammar.length})</span>
            </button>
          </div>
        </div>

        {/* Search input */}
        <div style={{ position: 'relative' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Ketik pola tata bahasa (contoh: 채로, 김에, 치고) atau arti..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px 12px 42px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
              fontSize: '0.95rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Grammar Cards Grid */}
      {filteredList.length > 0 ? (
        <div className="grid-2">
          {filteredList.map(item => {
            const isBookmarked = bookmarkedGrammar.includes(item.id);
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className="glass-panel"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  border: isBookmarked ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-color)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <span className="badge badge-indigo">
                      #{item.id} {item.level}
                    </span>
                    
                    {/* Bookmark Star Button */}
                    <button
                      onClick={() => onToggleBookmark(item.id)}
                      className="btn btn-ghost"
                      style={{ padding: '6px' }}
                      title={isBookmarked ? "Hapus dari Simpanan" : "Simpan Tata Bahasa"}
                    >
                      <Star 
                        size={18} 
                        color={isBookmarked ? "#F59E0B" : "var(--text-muted)"} 
                        fill={isBookmarked ? "#F59E0B" : "none"} 
                      />
                    </button>
                  </div>

                  {/* Formula */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h3 className="hangul-text" style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-primary)' }}>
                      {item.pattern}
                    </h3>
                    <button
                      onClick={(e) => handleSpeak(e, item.pattern)}
                      className="btn btn-sound"
                      style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                    >
                      <Volume2 size={14} />
                      <span>Lafal</span>
                    </button>
                  </div>

                  {/* Meaning */}
                  <p style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '14px' }}>
                    Arti: {item.meaning}
                  </p>

                  {/* Example Box */}
                  <div style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                        CONTOH KALIMAT:
                      </span>
                      <button
                        onClick={(e) => handleSpeak(e, item.exampleKo)}
                        className="btn btn-ghost"
                        style={{ padding: '2px 6px', color: 'var(--accent-primary)' }}
                        title="Dengarkan contoh kalimat"
                      >
                        <Volume2 size={15} />
                      </button>
                    </div>

                    <p className="hangul-text" style={{ fontSize: '1rem', fontWeight: '700', color: '#FFF' }}>
                      {item.exampleKo}
                    </p>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      "{item.exampleEn}"
                    </p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Tidak ditemukan tata bahasa yang sesuai dengan pencarian Anda.
          </p>
        </div>
      )}

    </div>
  );
}
