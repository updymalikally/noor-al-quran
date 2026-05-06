'use client';

import Link from 'next/link';
import { BookOpen, Compass, Heart, BookMarked, Clock, Star } from 'lucide-react';

export default function Home() {
  const sections = [
    {
      title: 'The Noble Quran',
      desc: 'Read, explore and study the holy Quran with translations.',
      icon: <BookOpen size={40} />,
      link: '/quran',
      color: '#2d5a27'
    },
    {
      title: 'Tasbih',
      desc: 'Simplify your dhikr with a digital Tasbih counter.',
      icon: <Compass size={40} />,
      link: '/tasbih',
      color: '#5d4037'
    },
    {
      title: 'Daily Duas',
      desc: 'Praise and ask Allah through prophetic supplications.',
      icon: <Heart size={40} />,
      link: '/duas',
      color: '#c2185b'
    },
    {
      title: 'Prayer Times',
      desc: 'Stay on time with accurate prayer schedules.',
      icon: <Clock size={40} />,
      link: '/prayer-times',
      color: '#0288d1'
    },
  ];

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container hero-content">
          <h1>Welcome to <span className="highlight">Noor Al-Quran</span></h1>
          <p>Your peaceful companion for spiritual growth and Islamic learning.</p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-val">114</span>
              <span className="stat-label">Surahs</span>
            </div>
            <div className="stat-item">
              <span className="stat-val">30</span>
              <span className="stat-label">Juz</span>
            </div>
            <div className="stat-item">
              <span className="stat-val">6236</span>
              <span className="stat-label">Ayahs</span>
            </div>
          </div>
          <Link href="/quran" className="btn btn-primary">Start Reading</Link>
        </div>
      </section>

      <div className="container section-grid">
        {sections.map((sec) => (
          <Link key={sec.title} href={sec.link} className="feature-card">
            <div className="icon-wrapper" style={{ color: sec.color }}>
              {sec.icon}
            </div>
            <h3>{sec.title}</h3>
            <p>{sec.desc}</p>
            <span className="learn-more">Explore →</span>
          </Link>
        ))}
      </div>

      <section className="reminders container">
        <div className="reminder-card">
          <div className="reminder-header">
            <Star size={24} className="star-icon" />
            <h3>Daily Reminder</h3>
          </div>
          <p className="arabic-text">فَإِنَّ مَعَ الْعُسْرِ يُسْرًا</p>
          <p className="translation">"For indeed, with hardship [will be] ease." (Quran 94:5)</p>
        </div>
      </section>

      <style jsx>{`
        .home-page {
          padding-bottom: 50px;
        }
        .hero {
          background: linear-gradient(135deg, var(--accent-light-green) 0%, var(--accent-blue) 100%);
          padding: 80px 0;
          text-align: center;
          margin-bottom: 50px;
          border-radius: 0 0 50px 50px;
        }
        .hero h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }
        .highlight {
          color: var(--accent-green);
        }
        .hero p {
          font-size: 1.2rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
        }
        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-bottom: 30px;
        }
        .stat-item {
          display: flex;
          flex-direction: column;
        }
        .stat-val {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--accent-green);
        }
        .stat-label {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .btn {
          display: inline-block;
          padding: 12px 30px;
          border-radius: 30px;
          font-weight: 600;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-primary {
          background-color: var(--accent-green);
          color: white;
          box-shadow: 0 4px 15px rgba(45, 90, 39, 0.3);
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(45, 90, 39, 0.4);
        }
        .section-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
          margin-bottom: 60px;
        }
        .feature-card {
          background-color: var(--bg-secondary);
          padding: 30px;
          border-radius: 20px;
          box-shadow: var(--card-shadow);
          text-align: center;
          transition: transform 0.3s;
          border: 1px solid var(--border-color);
        }
        .feature-card:hover {
          transform: translateY(-10px);
        }
        .icon-wrapper {
          margin-bottom: 20px;
          display: flex;
          justify-content: center;
        }
        .feature-card h3 {
          margin-bottom: 10px;
        }
        .feature-card p {
          font-size: 0.95rem;
          color: var(--text-secondary);
          margin-bottom: 15px;
        }
        .learn-more {
          font-weight: 600;
          color: var(--accent-green);
        }
        .reminders {
          margin-top: 20px;
        }
        .reminder-card {
          background: var(--bg-secondary);
          padding: 40px;
          border-radius: 25px;
          border-left: 5px solid var(--accent-green);
          box-shadow: var(--card-shadow);
          text-align: center;
        }
        .reminder-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 20px;
          color: var(--accent-green);
        }
        .star-icon {
          fill: var(--accent-green);
        }
        .arabic-text {
          font-size: 2rem;
          margin-bottom: 15px;
        }
        .translation {
          font-style: italic;
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .hero h1 {
            font-size: 2.2rem;
          }
          .hero-stats {
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
}
