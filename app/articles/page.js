'use client';

import { FileText, ArrowRight } from 'lucide-react';

export default function Articles() {
    const articles = [
        {
            title: 'Understanding the Five Pillars of Islam',
            excerpt: 'The foundation of Muslim life and spiritual practice explained in detail.',
            date: 'Jan 28, 2026',
            readTime: '8 min'
        },
        {
            title: 'The Importance of Prayer (Salah)',
            excerpt: 'How prayer serves as the spiritual anchor for believers in a busy world.',
            date: 'Jan 25, 2026',
            readTime: '6 min'
        },
        {
            title: 'Character and Ethics in Islam',
            excerpt: 'Exploring the prophetic teachings on honesty, kindness, and patience.',
            date: 'Jan 20, 2026',
            readTime: '10 min'
        }
    ];

    return (
        <div className="container articles-page">
            <header className="section-header">
                <h1 className="section-title">Islamic Articles</h1>
                <p>Educational resources and reflections to deepen your understanding.</p>
            </header>

            <div className="articles-grid">
                {articles.map((art, i) => (
                    <div key={i} className="article-card">
                        <div className="art-icon"><FileText size={32} /></div>
                        <div className="art-content">
                            <div className="art-meta">
                                <span>{art.date}</span>
                                <span className="dot">•</span>
                                <span>{art.readTime} read</span>
                            </div>
                            <h3>{art.title}</h3>
                            <p>{art.excerpt}</p>
                            <button className="read-btn">
                                Read Article <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
        .articles-page { padding-top: 40px; }
        .section-header { text-align: center; margin-bottom: 50px; }
        .articles-grid { display: flex; flex-direction: column; gap: 30px; max-width: 800px; margin: 0 auto; }
        .article-card {
          background-color: var(--bg-secondary);
          padding: 30px;
          border-radius: 20px;
          border: 1px solid var(--border-color);
          box-shadow: var(--card-shadow);
          display: flex;
          gap: 25px;
          transition: transform 0.2s;
        }
        .article-card:hover { transform: translateX(10px); border-color: var(--accent-green); }
        .art-icon {
          width: 70px;
          height: 70px;
          background-color: var(--accent-light-green);
          color: var(--accent-green);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .art-content { flex-grow: 1; }
        .art-meta { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 10px; }
        .dot { font-size: 1.2rem; line-height: 0; }
        .art-content h3 { font-size: 1.4rem; margin-bottom: 15px; color: var(--text-primary); }
        .art-content p { color: var(--text-secondary); margin-bottom: 20px; line-height: 1.5; }
        .read-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--accent-green);
          font-weight: 700;
          font-size: 0.95rem;
          transition: gap 0.2s;
        }
        .read-btn:hover { gap: 12px; }

        @media (max-width: 600px) {
          .article-card { flex-direction: column; }
          .art-icon { width: 60px; height: 60px; }
        }
      `}</style>
        </div>
    );
}
