'use client';

import { Book, Quote } from 'lucide-react';

export default function Hadith() {
    const hadiths = [
        {
            source: 'Sahih Bukhari',
            content: 'The deeds are considered by the intentions, and a person will get the reward according to his intention.',
            arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
            narrator: 'Umar bin Al-Khattab'
        },
        {
            source: 'Sahih Muslim',
            content: 'Cleanliness is half of faith.',
            arabic: 'الطُّهُورُ شَطْرُ الإِيمَانِ',
            narrator: 'Abu Malik Al-Ashari'
        },
        {
            source: 'Sunan At-Tirmidhi',
            content: 'The best among you are those who have the best manners and character.',
            arabic: 'أَكْمَلُ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا',
            narrator: 'Abu Hurairah'
        }
    ];

    return (
        <div className="container hadith-page">
            <header className="section-header">
                <h1 className="section-title">Hadith Collection</h1>
                <p>Profound sayings and actions of the Prophet Muhammad (peace be upon him).</p>
            </header>

            <div className="daily-hadith">
                <div className="hadith-badge">Featured Hadith</div>
                <Quote className="quote-icon" size={40} />
                <p className="hadith-arabic arabic-text">{hadiths[0].arabic}</p>
                <p className="hadith-text">"{hadiths[0].content}"</p>
                <div className="hadith-meta">
                    <span className="narrator">— {hadiths[0].narrator}</span>
                    <span className="source">{hadiths[0].source}</span>
                </div>
            </div>

            <div className="hadith-list">
                <h3>More Sayings</h3>
                <div className="grid">
                    {hadiths.slice(1).map((h, i) => (
                        <div key={i} className="hadith-card">
                            <Book className="book-icon" size={24} />
                            <p className="h-arabic arabic-text">{h.arabic}</p>
                            <p className="h-text">"{h.content}"</p>
                            <div className="h-footer">
                                <span>{h.narrator}</span>
                                <span>{h.source}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .hadith-page { padding-top: 40px; }
        .section-header { text-align: center; margin-bottom: 50px; }
        .daily-hadith {
          background-color: var(--bg-secondary);
          padding: 60px 40px;
          border-radius: 30px;
          text-align: center;
          position: relative;
          box-shadow: var(--card-shadow);
          border: 1px solid var(--border-color);
          margin-bottom: 60px;
        }
        .hadith-badge {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          background-color: var(--accent-green);
          color: white;
          padding: 5px 20px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.85rem;
        }
        .quote-icon { color: var(--accent-light-green); margin-bottom: 20px; opacity: 0.5; }
        .hadith-arabic { font-size: 2.2rem; margin-bottom: 25px; color: var(--accent-green); }
        .hadith-text { font-size: 1.4rem; font-style: italic; line-height: 1.5; margin-bottom: 30px; color: var(--text-primary); }
        .hadith-meta { display: flex; flex-direction: column; gap: 5px; }
        .narrator { font-weight: 600; }
        .source { color: var(--text-secondary); font-size: 0.9rem; }
        
        .hadith-list h3 { margin-bottom: 25px; color: var(--accent-green); border-bottom: 2px solid var(--accent-light-green); display: inline-block; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .hadith-card {
          background-color: var(--bg-secondary);
          padding: 30px;
          border-radius: 20px;
          border: 1px solid var(--border-color);
          box-shadow: var(--card-shadow);
        }
        .book-icon { color: var(--accent-green); margin-bottom: 15px; }
        .h-arabic { font-size: 1.4rem; margin-bottom: 15px; text-align: right; }
        .h-text { font-size: 1rem; font-style: italic; margin-bottom: 20px; }
        .h-footer { display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-secondary); border-top: 1px solid var(--border-color); padding-top: 15px; }

        @media (max-width: 768px) {
          .hadith-arabic { font-size: 1.8rem; }
          .hadith-text { font-size: 1.1rem; }
        }
      `}</style>
        </div>
    );
}
