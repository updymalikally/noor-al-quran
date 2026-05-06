'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getSurahDetail, getSurahTranslation, getSurahAudio } from '@/services/quranApi';
import { Loader2, ChevronLeft, ChevronRight, Play, Pause, Bookmark, Globe, Volume2 } from 'lucide-react';
import Link from 'next/link';

export default function SurahDetail() {
    const { id } = useParams();
    const router = useRouter();
    
    // Core data
    const [surah, setSurah] = useState(null);
    const [translation, setTranslation] = useState(null);
    const [audioData, setAudioData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Feature States
    const [language, setLanguage] = useState('en'); // 'en', 'so', 'none'
    const [playingIndex, setPlayingIndex] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [bookmarks, setBookmarks] = useState([]);
    
    const audioRef = useRef(null);

    // Initialize Settings from LocalStorage
    useEffect(() => {
        const savedLang = localStorage.getItem('quranLanguage');
        if (savedLang) setLanguage(savedLang);
        
        const savedBookmarks = localStorage.getItem('quranBookmarks');
        if (savedBookmarks) {
            try {
                setBookmarks(JSON.parse(savedBookmarks));
            } catch (e) {
                console.error('Failed to parse bookmarks');
            }
        }
    }, []);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let transEdition = 'en.sahih';
                if (language === 'so') transEdition = 'so.abduh';

                const fetchPromises = [
                    getSurahDetail(id),
                    getSurahAudio(id)
                ];
                
                if (language !== 'none') {
                    fetchPromises.push(getSurahTranslation(id, transEdition));
                }

                const results = await Promise.all(fetchPromises);
                
                setSurah(results[0]);
                setAudioData(results[1]);
                if (language !== 'none') {
                    setTranslation(results[2]);
                } else {
                    setTranslation(null);
                }

                // Save Last Read
                localStorage.setItem('lastRead', JSON.stringify({ 
                    id: results[0].number, 
                    name: results[0].englishName 
                }));

            } catch (error) {
                console.error('Error fetching surah data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, language]);

    // Handle Language Change
    const handleLanguageChange = (e) => {
        const lang = e.target.value;
        setLanguage(lang);
        localStorage.setItem('quranLanguage', lang);
    };

    // Audio Playback Logic
    const toggleAudio = (index) => {
        if (playingIndex === index && isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            setPlayingIndex(index);
            setIsPlaying(true);
            setTimeout(() => {
                if (audioRef.current) {
                    audioRef.current.play().catch(e => console.error("Audio playback error:", e));
                }
            }, 50);
        }
    };

    const playFullSurah = () => {
        if (isPlaying && playingIndex !== null) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            let startIndex = 0;
            if (playingIndex === null && surah.number !== 1 && surah.number !== 9) {
                startIndex = 'bismillah';
            } else if (playingIndex !== null) {
                startIndex = playingIndex;
            }
            setPlayingIndex(startIndex);
            setIsPlaying(true);
            setTimeout(() => {
                if (audioRef.current) {
                    audioRef.current.play().catch(e => console.error("Audio playback error:", e));
                }
            }, 50);
        }
    };

    const handleAudioEnded = () => {
        if (playingIndex === 'bismillah') {
            setPlayingIndex(0);
            setTimeout(() => {
                if (audioRef.current && isPlaying) {
                    audioRef.current.play().catch(e => console.error("Audio auto-advance error:", e));
                }
            }, 300);
        } else if (playingIndex !== null && playingIndex < surah.ayahs.length - 1) {
            const nextIndex = playingIndex + 1;
            setPlayingIndex(nextIndex);
            setTimeout(() => {
                if (audioRef.current && isPlaying) {
                    audioRef.current.play().catch(e => console.error("Audio auto-advance error:", e));
                }
            }, 300); // Brief pause between Ayahs
        } else {
            setPlayingIndex(null);
            setIsPlaying(false);
        }
    };

    const toggleBookmark = (ayah) => {
        const bookmarkKey = `${surah.number}:${ayah.numberInSurah}`;
        const isBookmarked = bookmarks.some(b => `${b.surahId}:${b.ayahNumber}` === bookmarkKey);
        
        let newBookmarks;
        if (isBookmarked) {
            newBookmarks = bookmarks.filter(b => `${b.surahId}:${b.ayahNumber}` !== bookmarkKey);
        } else {
            newBookmarks = [...bookmarks, {
                surahId: surah.number,
                surahName: surah.englishName,
                ayahNumber: ayah.numberInSurah,
                text: ayah.text
            }];
        }
        setBookmarks(newBookmarks);
        localStorage.setItem('quranBookmarks', JSON.stringify(newBookmarks));
    };

    if (loading) {
        return (
            <div className="loader-container">
                <Loader2 className="spinner" size={48} />
                <p>Opening {id === '1' ? 'Al-Fatihah' : 'Surah'}...</p>
                <style jsx>{`
          .loader-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 60vh;
            color: var(--accent-green);
          }
          .spinner { animation: spin 1s linear infinite; margin-bottom: 15px; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
            </div>
        );
    }

    const nextId = parseInt(id) < 114 ? parseInt(id) + 1 : null;
    const prevId = parseInt(id) > 1 ? parseInt(id) - 1 : null;

    return (
        <div className="container surah-detail">
            <div className="detail-nav">
                <Link href="/quran" className="back-link">
                    <ChevronLeft size={20} /> Back to List
                </Link>
                <div className="surah-pagination">
                    {prevId && (
                        <Link href={`/quran/${prevId}`} className="pag-btn">
                            <ChevronLeft size={20} /> Prev
                        </Link>
                    )}
                    <span className="current-surah">{surah.englishName}</span>
                    {nextId && (
                        <Link href={`/quran/${nextId}`} className="pag-btn">
                            Next <ChevronRight size={20} />
                        </Link>
                    )}
                </div>
            </div>

            <header className="surah-header">
                <div className="header-main">
                    <h1>{surah.englishName}</h1>
                    <p className="arabic-header arabic-text">{surah.name}</p>
                </div>
                <div className="header-meta">
                    <span>{surah.revelationType}</span>
                    <span className="dot">•</span>
                    <span>{surah.numberOfAyahs} Ayahs</span>
                    <span className="dot">•</span>
                    <span>{surah.englishNameTranslation}</span>
                </div>
            </header>
            
            <div className="surah-controls">
                <div className="audio-controls">
                    <button onClick={playFullSurah} className="play-all-btn">
                        {isPlaying ? <><Pause size={20} /> Pause</> : <><Volume2 size={20} /> Play Surah</>}
                    </button>
                    {playingIndex !== null && (
                        <span className="now-playing">
                            Ayah {playingIndex + 1}
                        </span>
                    )}
                </div>
                
                <div className="translation-controls">
                    <Globe size={18} />
                    <select value={language} onChange={handleLanguageChange} className="lang-select">
                        <option value="en">English</option>
                        <option value="so">Somali</option>
                        <option value="none">Arabic Only</option>
                    </select>
                </div>
            </div>

            {surah.number !== 1 && surah.number !== 9 && (
                <div className={`bismillah-container ${playingIndex === 'bismillah' ? 'highlight-audio' : ''}`}>
                    <div className="bismillah-actions">
                        <button 
                            title="Play Bismillah" 
                            onClick={() => toggleAudio('bismillah')}
                            className={`play-bismillah-btn ${playingIndex === 'bismillah' && isPlaying ? 'active-btn' : ''}`}
                        >
                            {playingIndex === 'bismillah' && isPlaying ? <Pause size={18} /> : <Play size={18} />}
                        </button>
                    </div>
                    <div className="bismillah arabic-text">
                        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                    </div>
                    {language !== 'none' && (
                        <p className="bismillah-translation">
                            {language === 'so' ? "Magaca Eebe yaan kubillaabaynaa ee Naxariis guud iyo mid gaaraba Naxariista." : "In the name of Allah, the Entirely Merciful, the Especially Merciful."}
                        </p>
                    )}
                </div>
            )}

            {(playingIndex !== null || playingIndex === 'bismillah') && audioData && (
                <audio 
                    ref={audioRef}
                    src={playingIndex === 'bismillah' ? 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3' : audioData.ayahs[playingIndex].audio}
                    onEnded={handleAudioEnded}
                />
            )}

            <div className="ayahs-list">
                {surah.ayahs.map((ayah, index) => {
                    const isHighlighted = playingIndex === index;
                    const isBookmarked = bookmarks.some(b => b.surahId === surah.number && b.ayahNumber === ayah.numberInSurah);
                    return (
                        <div key={ayah.number} id={`ayah-${ayah.numberInSurah}`} className={`ayah-container ${isHighlighted ? 'highlight-audio' : ''}`}>
                            <div className="ayah-actions">
                                <span className="ayah-number">{ayah.numberInSurah}</span>
                                <button 
                                    title="Play Audio" 
                                    onClick={() => toggleAudio(index)}
                                    className={isHighlighted && isPlaying ? 'active-btn' : ''}
                                >
                                    {isHighlighted && isPlaying ? <Pause size={18} /> : <Play size={18} />}
                                </button>
                                <button 
                                    title="Bookmark" 
                                    onClick={() => toggleBookmark(ayah)}
                                    className={isBookmarked ? 'active-bookmark' : ''}
                                >
                                    <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
                                </button>
                            </div>
                            <div className="ayah-content">
                                <p className="ayah-arabic arabic-text">
                                    {surah.number === 1 || surah.number === 9 
                                        ? ayah.text 
                                        : (index === 0 
                                            ? ayah.text.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/, '').replace(/^بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\s*/, '') 
                                            : ayah.text)}
                                </p>
                                {language !== 'none' && translation && (
                                    <p className="ayah-translation">
                                        {translation.ayahs[index]?.text}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <style jsx>{`
        .surah-detail {
          padding-top: 30px;
          padding-bottom: 60px;
        }
        .detail-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }
        .back-link, .pag-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          color: var(--text-secondary);
          font-weight: 500;
          transition: color 0.2s;
        }
        .back-link:hover, .pag-btn:hover {
          color: var(--accent-green);
        }
        .surah-pagination {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .current-surah {
          font-weight: 700;
          color: var(--accent-green);
          font-size: 1.1rem;
        }
        .surah-header {
          text-align: center;
          background-color: var(--bg-secondary);
          padding: 40px;
          border-radius: 20px;
          box-shadow: var(--card-shadow);
          margin-bottom: 30px;
          border: 1px solid var(--border-color);
        }
        .header-main h1 {
          font-size: 2.5rem;
          margin-bottom: 5px;
        }
        .arabic-header {
          font-size: 2.2rem;
          color: var(--accent-green);
        }
        .header-meta {
          margin-top: 15px;
          color: var(--text-secondary);
          font-size: 0.95rem;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
        }
        
        .surah-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: var(--bg-secondary);
          padding: 15px 25px;
          border-radius: 15px;
          border: 1px solid var(--border-color);
          margin-bottom: 30px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.02);
          position: sticky;
          top: 80px;
          z-index: 10;
        }
        .audio-controls {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .play-all-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: var(--accent-green);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          transition: all 0.2s;
        }
        .play-all-btn:hover {
          background-color: var(--accent-light-green);
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(45, 90, 39, 0.2);
        }
        .now-playing {
          font-size: 0.9rem;
          color: var(--accent-green);
          font-weight: 600;
          animation: pulse-text 2s infinite;
        }
        @keyframes pulse-text {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        
        .translation-controls {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--text-secondary);
        }
        .lang-select {
          padding: 8px 15px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background-color: var(--bg-primary);
          color: var(--text-primary);
          outline: none;
          font-family: inherit;
        }
        .lang-select:focus {
          border-color: var(--accent-green);
        }

        .bismillah-container {
          text-align: center;
          margin: 30px 0 40px;
          padding: 20px;
          border-radius: 15px;
          transition: background-color 0.3s;
        }
        .bismillah-container.highlight-audio {
          background-color: var(--accent-light-green);
        }
        .bismillah-actions {
          display: flex;
          justify-content: center;
          margin-bottom: 15px;
        }
        .play-bismillah-btn {
          color: var(--text-secondary);
          padding: 8px;
          border-radius: 50%;
          background-color: var(--bg-primary);
          border: 1px solid var(--border-color);
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .play-bismillah-btn:hover {
          color: var(--accent-green);
          border-color: var(--accent-green);
        }
        .play-bismillah-btn.active-btn {
          color: var(--accent-green);
          border-color: var(--accent-green);
          background-color: rgba(45, 90, 39, 0.1);
        }
        .bismillah {
          font-size: 2.8rem;
          color: var(--text-primary);
          font-weight: 400;
          margin-bottom: 10px;
        }
        .bismillah-translation {
          color: var(--text-secondary);
          font-size: 1.1rem;
        }
        .ayahs-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .ayah-container {
          background-color: var(--bg-secondary);
          padding: 30px;
          border-radius: 15px;
          border-left: 4px solid transparent;
          border-right: 1px solid var(--border-color);
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          gap: 30px;
          transition: all 0.3s ease;
        }
        .ayah-container:hover {
          background-color: var(--accent-light-green);
        }
        .ayah-container.highlight-audio {
          border-left-color: var(--accent-green);
          background-color: rgba(45, 90, 39, 0.05);
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          transform: translateX(5px);
        }
        .ayah-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          color: var(--text-secondary);
        }
        .ayah-number {
          width: 35px;
          height: 35px;
          border: 1px solid var(--accent-green);
          color: var(--accent-green);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .ayah-actions button {
          color: var(--text-secondary);
          transition: color 0.2s, transform 0.2s;
        }
        .ayah-actions button:hover {
          color: var(--accent-green);
          transform: scale(1.1);
        }
        .active-btn {
          color: var(--accent-green) !important;
        }
        .active-bookmark {
          color: var(--accent-green) !important;
        }
        .ayah-content {
          flex-grow: 1;
        }
        .ayah-arabic {
          font-size: 2.2rem;
          line-height: 1.8;
          margin-bottom: 20px;
          text-align: right;
          transition: color 0.3s;
        }
        .highlight-audio .ayah-arabic {
          color: var(--accent-green);
        }
        .ayah-translation {
          font-size: 1.1rem;
          color: var(--text-primary);
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .surah-controls {
            flex-direction: column;
            gap: 15px;
            align-items: stretch;
          }
          .audio-controls {
            justify-content: space-between;
          }
          .translation-controls {
            justify-content: space-between;
          }
          .ayah-container {
            flex-direction: column-reverse;
            gap: 20px;
          }
          .ayah-actions {
            flex-direction: row;
            justify-content: flex-start;
          }
          .ayah-arabic {
            font-size: 1.8rem;
          }
        }
      `}</style>
        </div>
    );
}
