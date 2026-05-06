'use client';

import { useState } from 'react';
import { Heart, Search } from 'lucide-react';

export default function Duas() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Morning', 'Evening', 'Sleeping', 'Prayer', 'Protection'];

  const duas = [
    {
      title: 'Dua before sleeping',
      arabic: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ',
      translation: 'In Your name, my Lord, I lie down, and in Your name I rise.',
      category: 'Sleeping'
    },
    {
      title: 'Dua for protection when sleeping',
      arabic: 'أعوذُ بِكَلماتِ اللهِ التَّامَّةِ من غضبهِ وعقابهِ وشرِّ عبادهِ',
      translation: 'I seek refuge in the perfect words of Allah from His anger and punishment, and from the evil of His slaves.',
      category: 'Sleeping'
    },
    {
      title: 'Dua after waking up',
      arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
      translation: 'Praise be to Allah who has given us life after taking it from us and unto Him is the resurrection.',
      category: 'Morning'
    },
    {
      title: 'Morning Protection',
      arabic: 'أصْبَحْنَا وَأَصْبَحَ المُلْكُ لِلَّهِ وَالحَمْدُ لِلَّهِ، لا إلهَ إلاَّ اللهُ وَحْدَهُ لا شَرِيكَ لَهُ',
      translation: 'We have reached the morning and at this very time unto Allah belongs all sovereignty, and all praise is for Allah.',
      category: 'Morning'
    },
    {
      title: 'Evening Remembrance',
      arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ',
      translation: 'We have reached the evening and at this very time unto Allah belongs all sovereignty, and all praise is for Allah.',
      category: 'Evening'
    },
    {
      title: 'Protection from Evil',
      arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
      translation: 'In the name of Allah, with whose name nothing on earth or in the sky can harm.',
      category: 'Protection'
    },
    {
      title: 'Dua for Parents',
      arabic: 'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
      translation: 'My Lord, have mercy upon them as they brought me up [when I was] small.',
      category: 'Prayer'
    },
    {
      title: 'Dua for Knowledge',
      arabic: 'رَّبِّ زِدْنِي عِلْمًا',
      translation: 'My Lord, increase me in knowledge.',
      category: 'Protection'
    },
    {
      title: 'Dua for Ease',
      arabic: 'اللَّهُمَّ لاَ سَهْلَ إِلاَّ مَا جَعَلْتَهُ سَهْلاً وَأَنْتَ تَجْعَلُ الحَزْنَ إِذَا شِئْتَ سَهْلاً',
      translation: 'O Allah, there is no ease except in what You have made easy.',
      category: 'Protection'
    },
    {
      title: 'Dua for Guidance',
      arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى',
      translation: 'O Allah, I ask You for guidance, piety, chastity, and self-sufficiency.',
      category: 'Prayer'
    }
  ];

  const filteredDuas = duas.filter(d =>
    (activeCategory === 'All' || d.category === activeCategory) &&
    (d.title.toLowerCase().includes(search.toLowerCase()) || d.translation.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="container duas-page">
      <header className="section-header">
        <h1 className="section-title">Daily Duas</h1>
        <p>Supplications for various occasions from Quran and Sunnah.</p>
      </header>

      <div className="duas-controls">
        <div className="search-field">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search duas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="category-list">
          {categories.map(cat => (
            <button
              key={cat}
              className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="duas-grid">
        {filteredDuas.map((dua, index) => (
          <div key={index} className="dua-card">
            <div className="dua-header">
              <Heart size={20} className="heart-icon" />
              <h3>{dua.title}</h3>
              <span className="cat-tag">{dua.category}</span>
            </div>
            <p className="dua-arabic arabic-text">{dua.arabic}</p>
            <p className="dua-translation">{dua.translation}</p>
          </div>
        ))}
      </div>

      <style jsx>{`
        .duas-page {
          padding-top: 40px;
        }
        .section-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .duas-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          margin-bottom: 40px;
        }
        .search-field {
          position: relative;
          width: 100%;
          max-width: 500px;
        }
        .search-field input {
          width: 100%;
          padding: 12px 15px 12px 45px;
          border-radius: 10px;
          border: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
          color: var(--text-primary);
        }
        .search-field svg {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
        }
        .category-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }
        .cat-btn {
          padding: 8px 18px;
          border-radius: 20px;
          border: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
          color: var(--text-secondary);
          transition: all 0.2s;
        }
        .cat-btn.active {
          background-color: var(--accent-green);
          color: white;
          border-color: var(--accent-green);
        }
        .duas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 25px;
        }
        .dua-card {
          background-color: var(--bg-secondary);
          padding: 30px;
          border-radius: 20px;
          box-shadow: var(--card-shadow);
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
        }
        .dua-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 20px;
        }
        .heart-icon {
          color: var(--accent-green);
          flex-shrink: 0;
          margin-top: 4px;
        }
        .dua-header h3 {
          flex-grow: 1;
          font-size: 1.1rem;
        }
        .cat-tag {
          font-size: 0.75rem;
          background-color: var(--accent-light-green);
          color: var(--accent-green);
          padding: 4px 8px;
          border-radius: 5px;
          font-weight: 600;
        }
        .dua-arabic {
          font-size: 1.8rem;
          line-height: 1.6;
          text-align: right;
          margin-bottom: 20px;
          color: var(--text-primary);
        }
        .dua-translation {
          color: var(--text-secondary);
          font-style: italic;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .duas-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
