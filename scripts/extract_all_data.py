import sys
import os
import json
import pymupdf
import re

sys.stdout.reconfigure(encoding='utf-8')

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'data')
os.makedirs(DATA_DIR, exist_ok=True)

# 1. EXTRACT TOPIK II GRAMMAR (148 patterns)
print("1. Extracting TOPIK II Grammar...")
grammar_pdf = 'Bahan/DLL/TOPIK-Ⅱ-Grammar.pdf.pdf'
grammar_list = []

if os.path.exists(grammar_pdf):
    doc = pymupdf.open(grammar_pdf)
    for page in doc:
        lines = [l.strip() for l in page.get_text().splitlines() if l.strip()]
        i = 0
        while i < len(lines):
            line = lines[i]
            if line.isdigit():
                num = int(line)
                if i + 4 < len(lines):
                    hangul = lines[i+1]
                    eng = lines[i+2]
                    ex_ko = lines[i+3]
                    ex_en = lines[i+4]
                    grammar_list.append({
                        'id': num,
                        'pattern': hangul,
                        'meaning': eng,
                        'exampleKo': ex_ko,
                        'exampleEn': ex_en,
                        'level': 'TOPIK II Intermediate'
                    })
                    i += 5
                    continue
            i += 1
    doc.close()

with open(os.path.join(DATA_DIR, 'topikGrammar.json'), 'w', encoding='utf-8') as f:
    json.dump(grammar_list, f, ensure_ascii=False, indent=2)
print(f"Saved {len(grammar_list)} grammar items to topikGrammar.json")

# 2. EXTRACT 720 EVERYDAY WORDS (31 Days)
print("2. Extracting 720 Everyday Words...")
flashcards_pdf = 'Bahan/TTMIK/Korean_Flashcards_720_Everyday_Words_in_31_Days_TalkToMeInKorean__z-lib_org.pdf'
cards_list = []

if os.path.exists(flashcards_pdf):
    doc = pymupdf.open(flashcards_pdf)
    current_cat = 'Umum / Nature'
    current_day = 'DAY 1'
    idx = 1
    for page in doc:
        lines = [l.strip() for l in page.get_text().splitlines() if l.strip()]
        if not lines:
            continue
        if len(lines) == 1 and ('/' in lines[0] or len(lines[0].split()) <= 4) and not 'DAY' in lines[0] and not '✔' in lines[0]:
            current_cat = lines[0]
            continue
        i = 0
        while i < len(lines):
            if '✔' in lines[i]:
                if i + 3 < len(lines):
                    ko = lines[i+1]
                    en = lines[i+2]
                    day = lines[i+3]
                    if 'DAY' in day:
                        current_day = day
                    cards_list.append({
                        'id': idx,
                        'hangul': ko,
                        'meaning': en,
                        'day': current_day,
                        'category': current_cat
                    })
                    idx += 1
                    i += 4
                    while i < len(lines) and 'DAY' in lines[i]:
                        i += 1
                    continue
            i += 1
    doc.close()

with open(os.path.join(DATA_DIR, 'flashcards720.json'), 'w', encoding='utf-8') as f:
    json.dump(cards_list, f, ensure_ascii=False, indent=2)
print(f"Saved {len(cards_list)} flashcards to flashcards720.json")

# 3. EXTRACT INDONESIAN TOPIK MATERIAL
print("3. Extracting Indonesian TOPIK Material...")
indo_pdf = 'Bahan/DLL/products_14-010-2025_file_1760382504205_2877612.pdf'
indo_words = []

if os.path.exists(indo_pdf):
    doc = pymupdf.open(indo_pdf)
    idx = 1
    for page_idx in range(len(doc)):
        text = doc[page_idx].get_text()
        if 'New Words!' in text:
            lines = [l.strip() for l in text.splitlines() if l.strip()]
            try:
                nw_idx = lines.index('New Words!')
                word = lines[nw_idx + 1]
                meaning = lines[nw_idx + 2].strip('[]')
                examples = []
                curr_lines = lines[nw_idx+3:]
                for j in range(len(curr_lines)-1):
                    l1 = curr_lines[j]
                    l2 = curr_lines[j+1]
                    if any('\uac00' <= ch <= '\ud7a3' for ch in l1) and not any('\uac00' <= ch <= '\ud7a3' for ch in l2):
                        if len(l1) > 8 and len(l2) > 8:
                            examples.append({'ko': l1, 'id': l2})
                
                indo_words.append({
                    'id': idx,
                    'hangul': word,
                    'meaningId': meaning,
                    'examples': examples[:3],
                    'page': page_idx + 1
                })
                idx += 1
            except Exception:
                pass
    doc.close()

with open(os.path.join(DATA_DIR, 'indonesianTOPIK.json'), 'w', encoding='utf-8') as f:
    json.dump(indo_words, f, ensure_ascii=False, indent=2)
print(f"Saved {len(indo_words)} Indonesian TOPIK words to indonesianTOPIK.json")

# 4. EXTRACT TOPIK VOCAB (Sample 400 high frequency intermediate words)
print("4. Extracting TOPIK Vocab...")
vocab_pdf = 'Bahan/DLL/Vocab.pdf'
vocab_list = []

if os.path.exists(vocab_pdf):
    doc = pymupdf.open(vocab_pdf)
    idx = 1
    for page in doc:
        lines = [l.strip() for l in page.get_text().splitlines() if l.strip()]
        i = 0
        while i < len(lines):
            if lines[i].isdigit():
                num = int(lines[i])
                if i + 2 < len(lines) and not lines[i+1].isdigit():
                    ko = lines[i+1]
                    en = lines[i+2]
                    vocab_list.append({'id': idx, 'no': num, 'hangul': ko, 'meaning': en})
                    idx += 1
                    i += 3
                    continue
            i += 1
    doc.close()

with open(os.path.join(DATA_DIR, 'topikVocab.json'), 'w', encoding='utf-8') as f:
    json.dump(vocab_list[:500], f, ensure_ascii=False, indent=2)
print(f"Saved {min(len(vocab_list), 500)} vocab items to topikVocab.json")

# 5. CURATE TTMIK STRUCTURED CURRICULUM (Levels 1 - 9)
print("5. Curating TTMIK Curriculum...")
# Detailed lessons across all levels based on TTMIK PDFs
ttmik_levels = [
    {
        "level": 1,
        "title": "Level 1: Dasar Hangul & Percakapan Pemula",
        "badge": "Beginner 1",
        "color": "#4F46E5",
        "description": "Pelajari salam dasar, ungkapan terima kasih, ya/tidak, 'ini adalah' (이에요/예요), topik dan partikel subjek.",
        "lessons": [
            {
                "id": "l1-01",
                "number": 1,
                "titleKo": "안녕하세요 / 감사합니다",
                "titleEn": "Hello / Thank you",
                "summary": "Salam paling mendasar dalam bahasa Korea untuk menyapa dan berterima kasih secara sopan (존댓말 - jondaetmal).",
                "keyGrammar": "안녕 (kedamaian/kesejahteraan) + 하세요 (apakah Anda dalam keadaan... / silakan)",
                "explanation": "안녕하세요 (An-nyeong-ha-se-yo) adalah cara paling umum menyapa seseorang dalam bentuk sopan (polite/formal). Dapat digunakan pagi, siang, maupun malam hari. 감사합니다 (Gam-sa-ham-ni-da) adalah ungkapan formal untuk berterima kasih.",
                "dialogue": [
                    {"speaker": "A", "ko": "안녕하세요!", "en": "Halo! (Selamat pagi/siang/sore)", "id": "Halo! Salam kenal."},
                    {"speaker": "B", "ko": "안녕하세요! 만나서 반갑습니다.", "en": "Hello! Nice to meet you.", "id": "Halo! Senang bertemu dengan Anda."},
                    {"speaker": "A", "ko": "감사합니다.", "en": "Thank you.", "id": "Terima kasih banyak."}
                ],
                "vocab": [
                    {"ko": "안녕", "meaning": "peace, well-being (kedamaian)"},
                    {"ko": "안녕하세요", "meaning": "Hello / Good day (Halo)"},
                    {"ko": "감사", "meaning": "appreciation, thankfulness (rasa syukur)"},
                    {"ko": "감사합니다", "meaning": "Thank you (Terima kasih)"}
                ],
                "tips": "Di Korea, saat mengucapkan 안녕하세요 atau 감사합니다, condongkan badan sedikit (menunduk hormat/bowing) sebagai tanda sopan santun."
            },
            {
                "id": "l1-02",
                "number": 2,
                "titleKo": "네 / 아니요",
                "titleEn": "Yes / No (Agreement vs Disagreement)",
                "summary": "Memahami konsep 'Ya' dan 'Tidak' dalam bahasa Korea yang mengekspresikan persetujuan terhadap kalimat lawan bicara.",
                "keyGrammar": "네 = 'Saya setuju dengan apa yang Anda katakan' | 아니요 = 'Saya tidak setuju'",
                "explanation": "Berbeda dengan bahasa Inggris, '네' (ne) berarti 'benar / apa yang Anda katakan tepat', sedangkan '아니요' (aniyo) berarti 'salah / tidak demikian'. Jadi jika ditanya 'Anda tidak suka kopi?', menjawab '네' berarti 'Betul, saya tidak suka'.",
                "dialogue": [
                    {"speaker": "A", "ko": "커피 좋아해요?", "en": "Do you like coffee?", "id": "Apakah Anda suka kopi?"},
                    {"speaker": "B", "ko": "네, 좋아해요.", "en": "Yes, I like it.", "id": "Ya, saya suka."},
                    {"speaker": "A", "ko": "커피 안 좋아해요?", "en": "You don't like coffee?", "id": "Anda tidak suka kopi ya?"},
                    {"speaker": "B", "ko": "네, 안 좋아해요.", "en": "That's right, I don't like it.", "id": "Betul (saya tidak suka)."}
                ],
                "vocab": [
                    {"ko": "네", "meaning": "Yes, that's right (Ya, betul)"},
                    {"ko": "아니요", "meaning": "No, that's not right (Tidak, bukan begitu)"},
                    {"ko": "맞아요", "meaning": "That's right / exactly (Tepat sekali)"}
                ],
                "tips": "'네' juga sering digunakan sebagai respon 'iya, saya mendengarkan' saat orang lain berbicara."
            },
            {
                "id": "l1-03",
                "number": 3,
                "titleKo": "안녕히 가세요 / 안녕히 계세요",
                "titleEn": "Good-bye (Leaving vs Staying)",
                "summary": "Perbedaan selamat tinggal ketika lawan bicara yang pergi atau Anda yang meninggalkan tempat.",
                "keyGrammar": "가세요 (dari 가다 = pergi) vs 계세요 (bentuk honorifik dari 있다 = tinggal/berada)",
                "explanation": "Jika lawan bicara yang PERGI meninggalkan ruangan, ucapkan '안녕히 가세요' (Pergilah dengan damai). Jika Anda yang pergi dan orang lain TETAP TINGGAL, ucapkan '안녕히 계세요' (Tinggallah dengan damai).",
                "dialogue": [
                    {"speaker": "Tamu", "ko": "저는 이제 갈게요. 안녕히 계세요!", "en": "I will go now. Goodbye (stay well)!", "id": "Saya pamit dulu ya. Selamat tinggal!"},
                    {"speaker": "Tuan Rumah", "ko": "네, 안녕히 가세요!", "en": "Yes, goodbye (go well)!", "id": "Baik, hati-hati di jalan!"}
                ],
                "vocab": [
                    {"ko": "가다", "meaning": "to go (pergi)"},
                    {"ko": "계시다", "meaning": "to stay (ada/tinggal - honorifik)"},
                    {"ko": "안녕히", "meaning": "in peace, safely (dengan damai/selamat)"}
                ],
                "tips": "Ingat rumus mudah: '가' = Go (pergi), '계' = Stay (tinggal)."
            },
            {
                "id": "l1-04",
                "number": 4,
                "titleKo": "죄송합니다 / 저기요",
                "titleEn": "I'm sorry / Excuse me",
                "summary": "Meminta maaf atas kesalahan dan memanggil perhatian orang (misalnya di restoran).",
                "keyGrammar": "죄송 (rasa bersalah/maaf) + 합니다 | 저기요 (Hei di sana / Permisi)",
                "explanation": "죄송합니다 (joe-song-ham-ni-da) digunakan ketika Anda meminta maaf secara tulus. Sementara '저기요' (jeo-gi-yo) berarti 'permisi' untuk menarik perhatian orang lain, memesan di restoran, atau saat melewati kerumunan.",
                "dialogue": [
                    {"speaker": "Pelanggan", "ko": "저기요! 주문할게요.", "en": "Excuse me! I'd like to order.", "id": "Permisi! Saya mau pesan."},
                    {"speaker": "Pelayan", "ko": "네, 손님! 잠시만요.", "en": "Yes, customer! Just a moment.", "id": "Ya, sebentar ya kak!"}
                ],
                "vocab": [
                    {"ko": "죄송합니다", "meaning": "I am sorry (Mohon maaf)"},
                    {"ko": "저기요", "meaning": "Excuse me (Permisi - memanggil)"},
                    {"ko": "잠시만요", "meaning": "Just a moment (Tunggu sebentar)"}
                ],
                "tips": "Di restoran Korea, jangan ragu memanggil '저기요!' secara tegas. Pelayan akan langsung merespon."
            },
            {
                "id": "l1-05",
                "number": 5,
                "titleKo": "이에요 / 예요",
                "titleEn": "It is... / I am... (To be)",
                "summary": "Kopula bahasa Korea setara dengan 'is / am / are' dalam bahasa Inggris.",
                "keyGrammar": "Kata berakhiran konsonan (batchim) + 이에요 | Kata berakhiran vokal + 예요",
                "explanation": "Digunakan untuk menyatakan bahwa sesuatu 'adalah' sesuatu (A adalah B). Rumus: jika kata benda berakhir dengan huruf mati/batchim, gunakan 이에요. Jika berakhir dengan huruf hidup/vokal, gunakan 예요.",
                "dialogue": [
                    {"speaker": "A", "ko": "이거 뭐예요?", "en": "What is this?", "id": "Ini apa ya?"},
                    {"speaker": "B", "ko": "물이에요.", "en": "It is water.", "id": "Ini air putih."},
                    {"speaker": "A", "ko": "저거는요?", "en": "How about that?", "id": "Kalau yang itu?"},
                    {"speaker": "B", "ko": "사과예요.", "en": "It is an apple.", "id": "Itu apel."}
                ],
                "vocab": [
                    {"ko": "물", "meaning": "water (berakhiran konsonan 'ㄹ' -> 물이에요)"},
                    {"ko": "사과", "meaning": "apple (berakhiran vokal 'ㅘ' -> 사과예요)"},
                    {"ko": "학생", "meaning": "student (학생이에요)"},
                    {"ko": "의사", "meaning": "doctor (의사예요)"}
                ],
                "tips": "Keduanya diucapkan dengan lembut dan sopan (bentuk haeyo-che)."
            },
            {
                "id": "l1-06",
                "number": 6,
                "titleKo": "이거, 그거, 저거",
                "titleEn": "This, That, That (over there)",
                "summary": "Kata tunjuk benda dalam bahasa Korea berdasarkan jarak dari pembicara dan lawan bicara.",
                "keyGrammar": "이 (dekat pembicara) | 그 (dekat lawan bicara) | 저 (jauh dari keduanya)",
                "explanation": "이거 (i-geo) = benda ini (dekat dengan saya). 그거 (geu-geo) = benda itu (dekat lawan bicara atau sedang dibahas). 저거 (jeo-geo) = benda itu (jauh dari saya dan lawan bicara).",
                "dialogue": [
                    {"speaker": "A", "ko": "이거 책이에요?", "en": "Is this a book?", "id": "Apakah ini buku?"},
                    {"speaker": "B", "ko": "네, 맞아요. 그리고 저거는 가방이에요.", "en": "Yes, that's right. And that over there is a bag.", "id": "Ya, betul. Dan yang di sana itu tas."}
                ],
                "vocab": [
                    {"ko": "이거", "meaning": "this thing (ini)"},
                    {"ko": "그거", "meaning": "that thing (itu)"},
                    {"ko": "저거", "meaning": "that thing over there (itu yang di sana)"},
                    {"ko": "책", "meaning": "book (buku)"},
                    {"ko": "가방", "meaning": "bag (tas)"}
                ],
                "tips": "'이것', '그것', '저것' adalah bentuk tertulis/formal dari '이거', '그거', '저거'."
            },
            {
                "id": "l1-07",
                "number": 7,
                "titleKo": "은 / 는 (Topic Markers) vs 이 / 가 (Subject Markers)",
                "titleEn": "Topic vs Subject Particles",
                "summary": "Perbedaan penting partikel penanda topik (은/는) dan penanda subjek (이/가).",
                "keyGrammar": "은/는 (Tentang X / Kontras / Topik umum) vs 이/가 (X lah yang... / Subjek spesifik)",
                "explanation": "은/는 menekankan topik pembicaraan atau perbandingan ('Adapun saya...'). 이/가 menekankan subjek yang melakukan tindakan atau menjawab pertanyaan 'siapa/apa yang melakukan'.",
                "dialogue": [
                    {"speaker": "A", "ko": "누가 커피 샀어요?", "en": "Who bought the coffee?", "id": "Siapa yang beli kopi?"},
                    {"speaker": "B", "ko": "제가 샀어요! (이/가)", "en": "I bought it!", "id": "Saya yang beli!"},
                    {"speaker": "A", "ko": "저는 차를 마셔요. (은/는)", "en": "As for me, I drink tea.", "id": "Kalau saya minum teh."}
                ],
                "vocab": [
                    {"ko": "누가", "meaning": "who (누구 + 가)"},
                    {"ko": "제가", "meaning": "I (저 + 가)"},
                    {"ko": "커피", "meaning": "coffee"},
                    {"ko": "차", "meaning": "tea"}
                ],
                "tips": "Jika Anda ingin memperkenalkan diri, gunakan '저는 [Nama]이에요' (은/는)."
            },
            {
                "id": "l1-08",
                "number": 8,
                "titleKo": "있어요 / 없어요",
                "titleEn": "To have / Not to have, To exist / Not exist",
                "summary": "Menyatakan kepemilikan atau keberadaan benda dan orang.",
                "keyGrammar": "[Kata Benda] + 있어요 (ada / punya) | [Kata Benda] + 없어요 (tidak ada / tidak punya)",
                "explanation": "Kata ini memiliki dua fungsi utama: menunjukkan keberadaan tempat ('ada di...') dan menunjukkan kepemilikan ('punya...'). Bentuk dasar: 있다 (ada) dan 없다 (tidak ada).",
                "dialogue": [
                    {"speaker": "A", "ko": "시간 있어요?", "en": "Do you have time?", "id": "Punya waktu senggang?"},
                    {"speaker": "B", "ko": "아니요, 지금 시간 없어요.", "en": "No, I don't have time now.", "id": "Tidak, sekarang saya tidak punya waktu."}
                ],
                "vocab": [
                    {"ko": "시간", "meaning": "time (waktu)"},
                    {"ko": "돈", "meaning": "money (uang)"},
                    {"ko": "친구", "meaning": "friend (teman)"},
                    {"ko": "지금", "meaning": "now (sekarang)"}
                ],
                "tips": "Cukup tambahkan tanda tanya dan naikkan intonasi untuk bertanya: '돈 있어요?' (Punya uang?)."
            }
        ]
    },
    {
        "level": 2,
        "title": "Level 2: Tata Bahasa Praktis & Waktu",
        "badge": "Beginner 2",
        "color": "#0284C7",
        "description": "Bentuk lampau (-았/었어요), partikel tempat & waktu (에, 에서), bentuk ajakan, dan angka Korea.",
        "lessons": [
            {
                "id": "l2-01",
                "number": 1,
                "titleKo": "Past Tense: -았/었어요",
                "titleEn": "Past Tense in Korean",
                "summary": "Cara mengubah kata kerja ke bentuk lampau yang sudah terjadi.",
                "keyGrammar": "Vokal akhir ㅏ/ㅗ -> -았어요 | Vokal lainnya -> -었어요 | 하다 -> 했어요",
                "explanation": "Untuk menyatakan kejadian masa lalu, lihat huruf vokal terakhir pada akar kata kerja. Jika ㅏ atau ㅗ (seperti 가다, 보다), tambahkan -았어요 (갔어요, 봤어요). Lainnya tambahkan -었어요 (먹다 -> 먹었어요). Kata yang berakhiran 하다 berubah menjadi 했어요 (공부하다 -> 공부했어요).",
                "dialogue": [
                    {"speaker": "A", "ko": "어제 뭐 했어요?", "en": "What did you do yesterday?", "id": "Kemarin kamu ngapain?"},
                    {"speaker": "B", "ko": "친구를 만났어요. 영화도 봤어요.", "en": "I met a friend. I watched a movie too.", "id": "Saya ketemu teman. Nonton film juga."}
                ],
                "vocab": [
                    {"ko": "어제", "meaning": "yesterday (kemarin)"},
                    {"ko": "만나다", "meaning": "to meet -> 만났어요"},
                    {"ko": "보다", "meaning": "to see/watch -> 봤어요"},
                    {"ko": "먹다", "meaning": "to eat -> 먹었어요"}
                ],
                "tips": "Kombinasikan dengan kata keterangan waktu seperti 어제 (kemarin), 지난주 (minggu lalu)."
            },
            {
                "id": "l2-02",
                "number": 2,
                "titleKo": "Partikel Tempat: 에 vs 에서",
                "titleEn": "Location Particles: At / To / In",
                "summary": "Membedakan lokasi tujuan/keberadaan (에) dengan lokasi tempat aktivitas berlangsung (에서).",
                "keyGrammar": "Lokasi + 에 (ada di / pergi ke) vs Lokasi + 에서 (melakukan sesuatu di)",
                "explanation": "Gunakan '에' saat menunjukkan tempat tujuan pergerakan (가다, 오다) atau posisi diam bersama 있다/없다. Gunakan '에서' jika ada tindakan aktif yang dilakukan di tempat tersebut (makan di kafe, belajar di perpustakaan).",
                "dialogue": [
                    {"speaker": "A", "ko": "어디에 가요?", "en": "Where are you going?", "id": "Mau pergi ke mana?"},
                    {"speaker": "B", "ko": "도서관에 가요. 도서관에서 한국어를 공부해요.", "en": "I go to the library. I study Korean at the library.", "id": "Pergi ke perpustakaan. Belajar bahasa Korea di perpus."}
                ],
                "vocab": [
                    {"ko": "도서관", "meaning": "library (perpustakaan)"},
                    {"ko": "어디", "meaning": "where (mana)"},
                    {"ko": "공부하다", "meaning": "to study (belajar)"}
                ],
                "tips": "Ingat: '에서' selalu ada ACTION (tindakan), sedangkan '에' fokus pada TITIK tujuan atau keberadaan."
            },
            {
                "id": "l2-03",
                "number": 3,
                "titleKo": "-고 싶어요 (Ingin...)",
                "titleEn": "Want to (Expressing Desires)",
                "summary": "Mengekspresikan keinginan pribadi untuk melakukan suatu tindakan.",
                "keyGrammar": "Akar kata kerja + -고 싶어요",
                "explanation": "Cukup buang '다' dari kata kerja dasar, lalu tempelkan '-고 싶어요'. Sangat mudah dan tidak tergantung vokal maupun konsonan! Contoh: 가다 (pergi) -> 가고 싶어요 (ingin pergi).",
                "dialogue": [
                    {"speaker": "A", "ko": "한국에 가고 싶어요?", "en": "Do you want to go to Korea?", "id": "Apakah kamu ingin pergi ke Korea?"},
                    {"speaker": "B", "ko": "네! 한국에서 맛있는 음식을 먹고 싶어요.", "en": "Yes! I want to eat delicious food in Korea.", "id": "Iya! Mau makan makanan enak di Korea."}
                ],
                "vocab": [
                    {"ko": "맛있다", "meaning": "delicious (enak)"},
                    {"ko": "음식", "meaning": "food (makanan)"},
                    {"ko": "가고 싶다", "meaning": "want to go (ingin pergi)"}
                ],
                "tips": "Untuk orang ketiga (dia ingin), bentuknya berubah menjadi '-고 싶어해요'."
            }
        ]
    },
    {
        "level": 3,
        "title": "Level 3: Alasan, Pengandaian & Kemampuan",
        "badge": "Pre-Intermediate",
        "color": "#0D9488",
        "description": "Menyatakan alasan (-아서/어서, -(으)니까), pengandaian (-(으)면), dan kemampuan (-(으)ㄹ 수 있다/없다).",
        "lessons": [
            {
                "id": "l3-01",
                "number": 1,
                "titleKo": "-(으)ㄹ 수 있다 / 없다",
                "titleEn": "Can / Cannot (Ability & Possibility)",
                "summary": "Menyatakan kemampuan bisa atau tidak bisa melakukan sesuatu.",
                "keyGrammar": "Akar kata kerja berakhiran konsonan + -을 수 있다/없다 | Vokal + -ㄹ 수 있다/없다",
                "explanation": "Bisa digunakan untuk kemampuan fisik/keterampilan maupun situasi kemungkinan. Contoh: 한국어를 할 수 있어요 (Saya bisa berbahasa Korea), 오늘 바빠서 갈 수 없어요 (Hari ini sibuk jadi tidak bisa pergi).",
                "dialogue": [
                    {"speaker": "A", "ko": "매운 음식 먹을 수 있어요?", "en": "Can you eat spicy food?", "id": "Bisa makan makanan pedas?"},
                    {"speaker": "B", "ko": "네, 잘 먹을 수 있어요!", "en": "Yes, I can eat it well!", "id": "Iya, saya bisa makan dengan lahap!"}
                ],
                "vocab": [
                    {"ko": "맵다", "meaning": "spicy (pedas)"},
                    {"ko": "잘", "meaning": "well (dengan baik)"},
                    {"ko": "운전하다", "meaning": "to drive (menyetir)"}
                ],
                "tips": "Cara lain yang lebih informal untuk bilang 'tidak bisa' adalah meletakkan '못' di depan kata kerja: '못 먹어요'."
            },
            {
                "id": "l3-02",
                "number": 2,
                "titleKo": "-(으)면 (Jika / Kalau)",
                "titleEn": "If / When (Conditional)",
                "summary": "Menyatakan syarat atau pengandaian suatu kejadian.",
                "keyGrammar": "Akar kata kerja berakhiran konsonan + -으면 | Vokal + -면",
                "explanation": "Digunakan untuk menghubungkan klausa syarat 'jika... maka...'. Contoh: 시간 있으면 영화 봐요 (Kalau ada waktu, ayo nonton film).",
                "dialogue": [
                    {"speaker": "A", "ko": "비가 오면 어떻게 해요?", "en": "What will you do if it rains?", "id": "Kalau hujan bagaimana?"},
                    {"speaker": "B", "ko": "비가 오면 집에서 쉴 거예요.", "en": "If it rains, I will rest at home.", "id": "Kalau hujan, saya mau istirahat di rumah saja."}
                ],
                "vocab": [
                    {"ko": "비가 오다", "meaning": "to rain (hujan turun)"},
                    {"ko": "쉬다", "meaning": "to rest (istirahat)"},
                    {"ko": "집", "meaning": "house/home (rumah)"}
                ],
                "tips": "Sering diawali dengan kata '만약' (jika/seandainya) untuk penekanan."
            }
        ]
    },
    {
        "level": 4,
        "title": "Level 4: Tata Bahasa Menengah & Bentuk Sopan Tinggi",
        "badge": "Intermediate 1",
        "color": "#EA580C",
        "description": "Perbandingan (보다 더), bentuk kehormatan 존댓말 tinggi (-(으)시-), dan perbuatan untuk orang lain (-아/어 주다).",
        "lessons": [
            {
                "id": "l4-01",
                "number": 1,
                "titleKo": "-아/어 주다 / 드리다",
                "titleEn": "Doing something for someone",
                "summary": "Melakukan suatu kebaikan atau bantuan untuk orang lain, atau meminta tolong.",
                "keyGrammar": "Akar kata kerja + -아/어 주다 (biasa) | -아/어 드리다 (kepada yang dituakan)",
                "explanation": "Contoh: 도와주세요 (Tolong bantu saya), 문을 열어 주세요 (Tolong bukakan pintu). Jika kita yang melakukan untuk orang tua/guru, gunakan 드리다.",
                "dialogue": [
                    {"speaker": "A", "ko": "사진 좀 찍어 줄 수 있어요?", "en": "Could you please take a photo for me?", "id": "Bisa tolong fotokan saya?"},
                    {"speaker": "B", "ko": "네, 찍어 드릴게요!", "en": "Sure, I'll take it for you!", "id": "Tentu, saya fotokan!"}
                ],
                "vocab": [
                    {"ko": "사진", "meaning": "photo (foto)"},
                    {"ko": "찍다", "meaning": "to take (photo) / menjepret"},
                    {"ko": "도와주다", "meaning": "to help (menolong)"}
                ],
                "tips": "Sangat sopan jika menambahkan kata '좀' (sedikit/tolong) di tengah kalimat."
            }
        ]
    },
    {
        "level": 5,
        "title": "Level 5: Konjugasi Kompleks & Kutipan Tak Langsung",
        "badge": "Intermediate 2",
        "color": "#DB2777",
        "description": "Kutipan tak langsung (-다고 하다), pasif/kausatif, dan tata bahasa pembentukan klausa nominal (-는 것).",
        "lessons": [
            {
                "id": "l5-01",
                "number": 1,
                "titleKo": "간접 화법: -다고 하다",
                "titleEn": "Indirect Quotation (He/She said that...)",
                "summary": "Menyampaikan kembali perkataan atau informasi dari orang lain.",
                "keyGrammar": "Kata kerja bentuk dasar + -(느)ㄴ다고 하다 | Kata sifat + -다고 하다",
                "explanation": "Digunakan ketika mengutip berita atau ucapan orang lain. Contoh: 민수가 내일 온다고 했어요 (Minsu bilang dia akan datang besok).",
                "dialogue": [
                    {"speaker": "A", "ko": "오늘 날씨 어때요?", "en": "How is the weather today?", "id": "Cuaca hari ini bagaimana?"},
                    {"speaker": "B", "ko": "일기예보에서 오후에 비가 온다고 해요.", "en": "The forecast said it will rain in the afternoon.", "id": "Prakiraan cuaca bilang sore nanti akan hujan."}
                ],
                "vocab": [
                    {"ko": "일기예보", "meaning": "weather forecast (prakiraan cuaca)"},
                    {"ko": "오후", "meaning": "afternoon (sore)"},
                    {"ko": "말하다", "meaning": "to say (berkata)"}
                ],
                "tips": "Dalam percakapan santai, '-다고 해요' sering disingkat menjadi '-대(요)'."
            }
        ]
    }
]

with open(os.path.join(DATA_DIR, 'ttmikCurriculum.json'), 'w', encoding='utf-8') as f:
    json.dump(ttmik_levels, f, ensure_ascii=False, indent=2)
print(f"Saved {len(ttmik_levels)} TTMIK levels to ttmikCurriculum.json")

# 6. GENERATE INTERACTIVE QUIZ QUESTIONS
print("6. Generating Quizzes...")
quizzes = [
    {
        "id": "quiz-01",
        "type": "context-guess",
        "category": "Tebak Nuansa Kalimat (TOPIK II)",
        "question": "Pilihlah arti kata yang tepat untuk kata yang dicetak tebal:",
        "sentenceKo": "최근에 물가가 계속 **상승하여** 장을 보는 것이 부담스러워졌다.",
        "targetWord": "상승하다",
        "options": ["Menurun", "Meningkat / Naik", "Stabil", "Menghilang"],
        "answer": 1,
        "explanation": "상승하다 (sang-seung-ha-da) berarti 'meningkat / naik'. Konteks: tingkat harga (물가) terus naik sehingga belanja bulanan jadi beban."
    },
    {
        "id": "quiz-02",
        "type": "context-guess",
        "category": "Tebak Nuansa Kalimat (TOPIK II)",
        "question": "Pilihlah arti kata yang tepat untuk kata yang dicetak tebal:",
        "sentenceKo": "코로나 이후 관광객 수가 **하락하여** 지역 상권이 어려움을 겪는다.",
        "targetWord": "하락하다",
        "options": ["Turun / Merosot", "Maju", "Bertambah", "Menarik"],
        "answer": 0,
        "explanation": "하락하다 (ha-rak-ha-da) adalah lawan kata dari 상승하다, artinya 'turun / merosot'. Konteks: jumlah wisatawan merosot sehingga perekonomian lokal kesulitan."
    },
    {
        "id": "quiz-03",
        "type": "context-guess",
        "category": "Tebak Nuansa Kalimat (TOPIK II)",
        "question": "Pilihlah arti kata yang tepat untuk kata yang dicetak tebal:",
        "sentenceKo": "수술 후 일상생활로 **회복하기** 위해 물리치료를 받았다.",
        "targetWord": "회복하다",
        "options": ["Memburuk", "Pulih / Sembuh", "Menyerah", "Menunda"],
        "answer": 1,
        "explanation": "회복하다 (hoe-bok-ha-da) berarti 'pulih / sembuh / kembali sedia kala'. Konteks: menjalani fisioterapi untuk pulih ke kehidupan sehari-hari."
    },
    {
        "id": "quiz-04",
        "type": "grammar-fill",
        "category": "Tata Bahasa TTMIK Level 1",
        "question": "Lengkapilah kalimat berikut dengan kopula penanda benda yang tepat: '물(air)___'",
        "sentenceKo": "이거는 물_____.",
        "targetWord": "이에요 vs 예요",
        "options": ["이에요", "예요", "는", "가"],
        "answer": 0,
        "explanation": "Karena '물' berakhiran huruf konsonan/batchim (ㄹ), maka menggunakan '이에요' (mul-i-e-yo)."
    },
    {
        "id": "quiz-05",
        "type": "grammar-fill",
        "category": "Tata Bahasa TOPIK II",
        "question": "Pilihlah pola tata bahasa yang menyatakan keadaan sedang berlangsung tanpa perubahan (while / in state of):",
        "sentenceKo": "버스 안에서 앉은 _____ 잠자버렸다. (Saya tertidur dalam keadaan duduk di bus)",
        "targetWord": "-(으)ㄴ 채(로)",
        "options": ["채로", "김에", "바람에", "탓에"],
        "answer": 0,
        "explanation": "'-(으)ㄴ 채(로)' digunakan untuk menunjukkan tindakan kedua terjadi saat kondisi pertama tetap dipertahankan ('dalam keadaan duduk')."
    },
    {
        "id": "quiz-06",
        "type": "vocab-speed",
        "category": "Kosakata Sehari-hari (720 Words)",
        "question": "Apa arti dari kata '가을'?",
        "sentenceKo": "가을이 오면 단풍이 아름답습니다.",
        "targetWord": "가을",
        "options": ["Musim Semi", "Musim Panas", "Musim Gugur", "Musim Dingin"],
        "answer": 2,
        "explanation": "가을 (ga-eul) berarti musim gugur (autumn/fall)."
    },
    {
        "id": "quiz-07",
        "type": "vocab-speed",
        "category": "Kosakata Sehari-hari (720 Words)",
        "question": "Apa arti dari kata '바다'?",
        "sentenceKo": "여름에는 바다에 가고 싶어요.",
        "targetWord": "바다",
        "options": ["Gunung", "Laut / Samudra", "Danau", "Hutan"],
        "answer": 1,
        "explanation": "바다 (ba-da) berarti laut atau samudra (sea, ocean)."
    },
    {
        "id": "quiz-08",
        "type": "grammar-fill",
        "category": "Tata Bahasa TTMIK Level 2",
        "question": "Ubah kata kerja '먹다' (makan) menjadi bentuk lampau (past tense):",
        "sentenceKo": "어제 불고기를 _____.",
        "targetWord": "먹다 -> Past Tense",
        "options": ["먹았어요", "먹었어요", "먹했어요", "먹겠어요"],
        "answer": 1,
        "explanation": "Vokal pada '먹' adalah 'ㅓ' (bukan ㅏ atau ㅗ), sehingga ditambahkan '-었어요' menjadi '먹었어요'."
    }
]

with open(os.path.join(DATA_DIR, 'quizzes.json'), 'w', encoding='utf-8') as f:
    json.dump(quizzes, f, ensure_ascii=False, indent=2)
print(f"Saved {len(quizzes)} quizzes to quizzes.json")

print("All data successfully extracted!")
