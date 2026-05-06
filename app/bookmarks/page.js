'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bookmark, ArrowRight, Trash2 } from 'lucide-react';

export default function BookmarksPage() {
    const [bookmarks, setBookmarks] = useState([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const savedBookmarks = localStorage.getItem('quranBookmarks');
        if (savedBookmarks) {
            try {
                setBookmarks(JSON.parse(savedBookmarks));
            } catch (e) {
                console.error('Failed to parse bookmarks');
            }
        }
    }, []);

    const removeBookmark = (surahId, ayahNumber) => {
        const newBookmarks = bookmarks.filter(b => !(b.surahId === surahId && b.ayahNumber === ayahNumber));
        setBookmarks(newBookmarks);
        localStorage.setItem('quranBookmarks', JSON.stringify(newBookmarks));
    };

    if (!isMounted) return null;

    return (
        <div className="container bookmarks-page">
            <header className="section-header">
                <Bookmark size={40} className="header-icon" />
                <h1 className="section-title">My Bookmarks</h1>
                <p className="section-desc">Continue reading your saved Ayahs.</p>
            </header>

            {bookmarks.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon-wrapper">
                        <Bookmark size={48} className="empty-icon" />
                    </div>
                    <h2>No Bookmarks Yet</h2>
                    <p>When reading the Quran, click the bookmark icon next to any Ayah to save it here.</p>
                    <Link href="/quran" className="btn-primary">Browse Quran</Link>
                </div>
            ) : (
                <div className="bookmarks-grid">
                    {bookmarks.map((bookmark) => (
                        <div key={`${bookmark.surahId}-${bookmark.ayahNumber}`} className="bookmark-card">
                            <div className="bookmark-header">
                                <h3>Surah {bookmark.surahName}</h3>
                                <span className="ayah-badge">Ayah {bookmark.ayahNumber}</span>
                            </div>
                            
                            <p className="bookmark-text arabic-text">{bookmark.text}</p>
                            
                            <div className="bookmark-actions">
                                <button 
                                    className="remove-btn" 
                                    onClick={() => removeBookmark(bookmark.surahId, bookmark.ayahNumber)}
                                    title="Remove Bookmark"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <Link href={`/quran/${bookmark.surahId}#ayah-${bookmark.ayahNumber}`} className="read-btn">
                                    Read Context <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style jsx>{`
                .bookmarks-page {
                    padding-top: 40px;
                    padding-bottom: 60px;
                    min-height: 80vh;
                }
                .section-header {
                    text-align: center;
                    margin-bottom: 50px;
                }
                .header-icon {
                    color: var(--accent-green);
                    margin-bottom: 15px;
                }
                .section-title {
                    margin-bottom: 10px;
                }
                .section-desc {
                    color: var(--text-secondary);
                    font-size: 1.1rem;
                }
                
                .empty-state {
                    text-align: center;
                    background-color: var(--bg-secondary);
                    padding: 60px 20px;
                    border-radius: 20px;
                    border: 1px dashed var(--border-color);
                    max-width: 600px;
                    margin: 0 auto;
                }
                .empty-icon-wrapper {
                    background-color: var(--accent-light-green);
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                }
                .empty-icon {
                    color: var(--accent-green);
                }
                .empty-state h2 {
                    margin-bottom: 15px;
                    color: var(--text-primary);
                }
                .empty-state p {
                    color: var(--text-secondary);
                    margin-bottom: 30px;
                }
                .btn-primary {
                    display: inline-block;
                    background-color: var(--accent-green);
                    color: white;
                    padding: 12px 30px;
                    border-radius: 30px;
                    font-weight: 600;
                    transition: transform 0.2s, background-color 0.2s;
                }
                .btn-primary:hover {
                    transform: translateY(-2px);
                    background-color: var(--accent-light-green);
                }

                .bookmarks-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 25px;
                }
                .bookmark-card {
                    background-color: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 15px;
                    padding: 25px;
                    display: flex;
                    flex-direction: column;
                    transition: transform 0.3s, box-shadow 0.3s;
                }
                .bookmark-card:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--card-shadow);
                    border-color: var(--accent-green);
                }
                .bookmark-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid var(--border-color);
                }
                .bookmark-header h3 {
                    color: var(--text-primary);
                    font-size: 1.2rem;
                }
                .ayah-badge {
                    background-color: var(--accent-light-green);
                    color: var(--accent-green);
                    padding: 5px 12px;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    font-weight: 600;
                }
                .bookmark-text {
                    font-size: 1.5rem;
                    line-height: 1.8;
                    color: var(--text-primary);
                    margin-bottom: 25px;
                    flex-grow: 1;
                }
                .bookmark-actions {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .remove-btn {
                    color: #e74c3c;
                    padding: 8px;
                    border-radius: 50%;
                    background-color: rgba(231, 76, 60, 0.1);
                    transition: background-color 0.2s;
                }
                .remove-btn:hover {
                    background-color: rgba(231, 76, 60, 0.2);
                }
                .read-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: var(--accent-green);
                    font-weight: 600;
                    font-size: 0.95rem;
                }
                .read-btn:hover {
                    text-decoration: underline;
                }

                @media (max-width: 768px) {
                    .bookmarks-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}
