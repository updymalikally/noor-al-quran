'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSurahs } from '@/services/quranApi';
import { Search, Loader2, BookOpen, ChevronRight, Bookmark } from 'lucide-react';

export default function Quran() {
    const [surahs, setSurahs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [lastRead, setLastRead] = useState(null);

    useEffect(() => {
        const fetchSurahs = async () => {
            try {
                const data = await getSurahs();
                setSurahs(data);
            } catch (error) {
                console.error('Error fetching surahs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSurahs();
        
        // Read search query from URL if present
        const urlParams = new URLSearchParams(window.location.search);
        const q = urlParams.get('q');
        if (q) setSearch(q);
        
        // Read last read from local storage
        const savedLastRead = localStorage.getItem('lastRead');
        if (savedLastRead) {
            try {
                setLastRead(JSON.parse(savedLastRead));
            } catch (e) {
                console.error('Error parsing last read:', e);
            }
        }
    }, []);

    const filteredSurahs = surahs.filter(s =>
        s.englishName.toLowerCase().includes(search.toLowerCase()) ||
        s.name.includes(search) ||
        s.number.toString() === search
    );

    return (
        <div className="container quran-page">
            <header className="section-header">
                <h1 className="section-title">The Holy Quran</h1>
                <p>Explore all 114 Surahs of the Noble Quran</p>
            </header>

            {lastRead && (
                <Link href={`/quran/${lastRead.id}`} className="continue-reading-card">
                    <div className="continue-info">
                        <Bookmark className="bookmark-icon" size={24} />
                        <div>
                            <h3>Continue Reading</h3>
                            <p>{lastRead.name}</p>
                        </div>
                    </div>
                    <ChevronRight size={24} className="continue-arrow" />
                </Link>
            )}

            <div className="search-bar-container">
                <div className="search-icon-wrapper">
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    placeholder="Search by Surah name or number..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="loader-container">
                    <Loader2 className="spinner" size={40} />
                    <p>Loading Surahs...</p>
                </div>
            ) : (
                <div className="surah-grid">
                    {filteredSurahs.map((surah) => (
                        <Link key={surah.number} href={`/quran/${surah.number}`} className="surah-card">
                            <div className="surah-number">{surah.number}</div>
                            <div className="surah-info">
                                <div className="surah-names">
                                    <h3>{surah.englishName}</h3>
                                    <p className="arabic-name arabic-text">{surah.name}</p>
                                </div>
                                <div className="surah-meta">
                                    <span>{surah.revelationType}</span>
                                    <span className="dot">•</span>
                                    <span>{surah.numberOfAyahs} Verses</span>
                                </div>
                            </div>
                            <div className="surah-meaning">
                                {surah.englishNameTranslation}
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {(!loading && filteredSurahs.length === 0) && (
                <div className="no-results">
                    <BookOpen size={48} />
                    <p>No Surahs found matching "{search}"</p>
                </div>
            )}

            <style jsx>{`
        .quran-page {
          padding-top: 40px;
        }
        .section-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .section-header p {
          color: var(--text-secondary);
        }
        .continue-reading-card {
          background: linear-gradient(135deg, var(--accent-green) 0%, var(--accent-light-green) 100%);
          color: white;
          padding: 20px 25px;
          border-radius: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0 auto 30px;
          max-width: 600px;
          box-shadow: 0 10px 20px rgba(45, 90, 39, 0.2);
          transition: transform 0.2s, box-shadow 0.2s;
          text-decoration: none;
        }
        .continue-reading-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 25px rgba(45, 90, 39, 0.3);
        }
        .continue-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .bookmark-icon {
          background: rgba(255, 255, 255, 0.2);
          padding: 10px;
          border-radius: 12px;
          width: 44px;
          height: 44px;
        }
        .continue-info h3 {
          font-size: 0.9rem;
          opacity: 0.9;
          margin-bottom: 2px;
          font-weight: 500;
        }
        .continue-info p {
          font-size: 1.2rem;
          font-weight: 700;
        }
        .continue-arrow {
          opacity: 0.8;
          transition: transform 0.2s;
        }
        .continue-reading-card:hover .continue-arrow {
          transform: translateX(5px);
        }
        .search-bar-container {
          position: relative;
          max-width: 600px;
          margin: 0 auto 40px;
        }
        .search-icon-wrapper {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
        }
        .search-bar-container input {
          width: 100%;
          padding: 15px 15px 15px 50px;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 1rem;
          outline: none;
          box-shadow: var(--card-shadow);
        }
        .search-bar-container input:focus {
          border-color: var(--accent-green);
        }
        .loader-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 100px 0;
          color: var(--accent-green);
        }
        .spinner {
          animation: spin 1s linear infinite;
          margin-bottom: 10px;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .surah-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .surah-card {
          background-color: var(--bg-secondary);
          padding: 20px;
          border-radius: 15px;
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          gap: 20px;
          transition: transform 0.2s, border-color 0.2s;
          box-shadow: var(--card-shadow);
          position: relative;
          overflow: hidden;
        }
        .surah-card:hover {
          transform: translateY(-5px);
          border-color: var(--accent-green);
        }
        .surah-number {
          width: 50px;
          height: 50px;
          background-color: var(--accent-light-green);
          color: var(--accent-green);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          font-weight: 700;
          font-size: 1.2rem;
          flex-shrink: 0;
          transform: rotate(45deg);
        }
        .surah-number {
          /* Restore rotation for text */
          perspective: 1000px;
        }
        /* A trick to make it look like an internal diamond */
        .surah-info {
          flex-grow: 1;
        }
        .surah-names {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 5px;
        }
        .surah-names h3 {
          font-size: 1.1rem;
        }
        .arabic-name {
          font-size: 1.3rem;
          color: var(--accent-green);
        }
        .surah-meta {
          font-size: 0.85rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .dot {
          font-size: 1.2rem;
          line-height: 0;
        }
        .surah-meaning {
          position: absolute;
          bottom: 10px;
          right: 20px;
          font-size: 0.75rem;
          color: var(--text-secondary);
          opacity: 0.6;
        }
        .no-results {
          text-align: center;
          padding: 60px 0;
          color: var(--text-secondary);
        }
        .no-results p {
          margin-top: 15px;
          font-size: 1.1rem;
        }
      `}</style>
        </div>
    );
}
