import React from 'react';
import { 
  Play, 
  Layers, 
  HelpCircle, 
  BookMarked, 
  Volume2, 
  CheckCircle2, 
  Award, 
  TrendingUp,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { speakKorean } from '../utils/speech';

export default function Dashboard({ 
  setActiveTab, 
  completedLessons, 
  masteredCards, 
  soundEnabled, 
  stats,
  ttmikCurriculum,
  grammarList,
  cards720,
  indoWords
}) {
  const proverb = {
    ko: "시작이 반이다",
    pron: "Si-jag-i ban-i-da",
    id: "Memulai adalah separuh dari keberhasilan (Well begun is half done).",
    context: "Pepatah klasik Korea yang mengajarkan bahwa langkah pertama yang Anda ambil hari ini sudah membawa Anda separuh jalan menuju fasih berbahasa Korea!"
  };

  const handleSpeak = (text) => {
    if (soundEnabled) speakKorean(text);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Hero Proverb Banner */}
      <div className="glass-panel" style={{
        padding: '36px',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.22) 0%, rgba(244, 63, 94, 0.15) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.35)'
      }}>
        {/* Glow circle background decoration */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '200px',
          height: '200px',
          background: 'rgba(99, 102, 241, 0.3)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <span className="badge badge-indigo">
            <Sparkles size={14} /> Kata Motivasi Hari Ini
          </span>
          <span className="badge badge-rose">한국 속담</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
              <h1 className="hangul-text" style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1.2 }}>
                {proverb.ko}
              </h1>
              <button 
                onClick={() => handleSpeak(proverb.ko)} 
                className="btn btn-sound"
                title="Dengarkan pengucapan penutur Korea"
              >
                <Volume2 size={18} />
                <span>Audio</span>
              </button>
            </div>
            <p style={{ color: 'var(--accent-primary)', fontWeight: '600', fontSize: '1.05rem', marginBottom: '8px' }}>
              [{proverb.pron}]
            </p>
            <p style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '10px' }}>
              "{proverb.id}"
            </p>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', fontSize: '0.95rem' }}>
              {proverb.context}
            </p>
          </div>

          <button 
            onClick={() => setActiveTab('curriculum')}
            className="btn btn-primary"
            style={{ padding: '14px 26px', fontSize: '1.05rem' }}
          >
            <Play size={20} fill="#FFF" />
            <span>Mulai Belajar Sekarang</span>
          </button>
        </div>
      </div>

      {/* Materials & Progress Summary Grid */}
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <TrendingUp size={22} color="var(--accent-primary)" />
          <span>Statistik Bahan Belajar yang Terpasang</span>
        </h2>
        
        <div className="grid-4">
          <div className="glass-panel" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600' }}>Kurikulum TTMIK</span>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8' }}>
                <Play size={18} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
              Level 1 - 9
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {completedLessons.length} Pelajaran Selesai
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600' }}>720 Everyday Words</span>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.15)', color: '#FB7185' }}>
                <Layers size={18} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
              {cards720.length || 720}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              31 Kategori & Hari Belajar
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600' }}>TOPIK II Grammar</span>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>
                <BookMarked size={18} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
              {grammarList.length || 148}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Rumus Tata Bahasa Lengkap
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600' }}>Kosakata Indonesia-TOPIK</span>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24' }}>
                <Award size={18} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
              {indoWords.length || 53}+
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Dengan Kalimat & Arti Nyata
            </p>
          </div>
        </div>
      </div>

      {/* Main Learning Hub Quick Cards */}
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: '700', marginBottom: '16px' }}>
          Pilih Mode Belajar Anda
        </h2>

        <div className="grid-2">
          
          {/* Card 1: TTMIK Curriculum */}
          <div 
            onClick={() => setActiveTab('curriculum')}
            className="glass-panel" 
            style={{ 
              padding: '28px', 
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s, border-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span className="badge badge-indigo">Kurikulum Inti</span>
                <div style={{ 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '12px', 
                  background: 'linear-gradient(135deg, #4F46E5, #0284C7)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#FFF'
                }}>
                  <Play size={22} fill="#FFF" />
                </div>
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '8px' }}>
                Kurikulum TTMIK Level 1 - 9
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Pelajari percakapan dan tata bahasa Korea dari nol secara berjenjang. Dilengkapi penjelasan rumus, dialog asli, dan audio pengucapan.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px', color: 'var(--accent-primary)', fontWeight: '700' }}>
              <span>Buka Kurikulum</span>
              <ArrowRight size={18} />
            </div>
          </div>

          {/* Card 2: Flashcards Interaktif */}
          <div 
            onClick={() => setActiveTab('flashcards')}
            className="glass-panel" 
            style={{ 
              padding: '28px', 
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s, border-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span className="badge badge-rose">Spaced Repetition</span>
                <div style={{ 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '12px', 
                  background: 'linear-gradient(135deg, #F43F5E, #FB7185)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#FFF'
                }}>
                  <Layers size={22} />
                </div>
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '8px' }}>
                Flashcard 3D & Hafalan Kosakata
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Latih daya ingat Anda dengan flashcard 3D yang dapat dibalik: 720 kosakata sehari-hari (31 hari) dan kosakata TOPIK berbahasa Indonesia.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px', color: 'var(--accent-korean-red)', fontWeight: '700' }}>
              <span>Buka Flashcards</span>
              <ArrowRight size={18} />
            </div>
          </div>

          {/* Card 3: Quiz & Simulasi TOPIK */}
          <div 
            onClick={() => setActiveTab('quiz')}
            className="glass-panel" 
            style={{ 
              padding: '28px', 
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s, border-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span className="badge badge-amber">Uji Pemahaman</span>
                <div style={{ 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '12px', 
                  background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#FFF'
                }}>
                  <HelpCircle size={22} />
                </div>
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '8px' }}>
                Kuis & Latihan Soal Interaktif
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Tebak arti kosakata melalui nuansa konteks kalimat asli TOPIK 2, kuis tata bahasa, dan uji kecepatan kosakata harian.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px', color: 'var(--accent-amber)', fontWeight: '700' }}>
              <span>Mulai Kuis</span>
              <ArrowRight size={18} />
            </div>
          </div>

          {/* Card 4: Grammar Bank */}
          <div 
            onClick={() => setActiveTab('grammar')}
            className="glass-panel" 
            style={{ 
              padding: '28px', 
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s, border-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span className="badge badge-emerald">Kamus Lengkap</span>
                <div style={{ 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '12px', 
                  background: 'linear-gradient(135deg, #10B981, #34D399)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#FFF'
                }}>
                  <BookMarked size={22} />
                </div>
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '8px' }}>
                Kamus Tata Bahasa (148+ Pola)
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Kumpulan referensi cepat tata bahasa TOPIK II: rumus awalan/akhiran, arti mendalam, contoh kalimat, dan audio pengucapan.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px', color: 'var(--accent-emerald)', fontWeight: '700' }}>
              <span>Cari Tata Bahasa</span>
              <ArrowRight size={18} />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
