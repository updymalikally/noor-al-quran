'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { Sun, Moon, Search, Menu, X, BookOpen, Compass, Clock, Heart, BookMarked, Home, Bookmark } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim() !== '') {
            router.push(`/quran?q=${encodeURIComponent(searchQuery)}`);
            setIsMenuOpen(false);
            setSearchQuery('');
        }
    };

    const navLinks = [
        { name: 'Home', href: '/', icon: <Home size={20} /> },
        { name: 'Quran', href: '/quran', icon: <BookOpen size={20} /> },
        { name: 'Tasbih', href: '/tasbih', icon: <Compass size={20} /> },
        { name: 'Dua', href: '/duas', icon: <Heart size={20} /> },
        { name: 'Hadith', href: '/hadith', icon: <BookMarked size={20} /> },
        { name: 'Bookmarks', href: '/bookmarks', icon: <Bookmark size={20} /> },
        { name: 'Prayer', href: '/prayer-times', icon: <Clock size={20} /> },
    ];

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link href="/" className="logo">
                    <span className="logo-icon">🌙</span>
                    <span className="logo-text">Noor Al-Quran</span>
                </Link>

                <div className="search-container desktop-only">
                    <div className="search-icon-wrapper">
                        <Search size={18} />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search Surah, Dua..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                </div>

                <div className="nav-links desktop-only">
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} className="nav-link">
                            {link.name}
                        </Link>
                    ))}
                    <button onClick={toggleTheme} className="theme-toggle">
                        {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
                    </button>
                </div>

                <button className="menu-toggle mobile-only" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                <div className="mobile-search">
                    <div className="search-icon-wrapper">
                        <Search size={18} />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                </div>
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className="mobile-link"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        {link.icon}
                        {link.name}
                    </Link>
                ))}
                <button onClick={() => { toggleTheme(); setIsMenuOpen(false); }} className="mobile-link theme-switch">
                    {theme === 'light' ? <><Moon size={20} /> Dark Mode</> : <><Sun size={20} /> Light Mode</>}
                </button>
            </div>

            <style jsx>{`
        .navbar {
          height: var(--nav-height);
          background-color: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
          position: sticky;
          top: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
        }
        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          font-size: 1.2rem;
          color: var(--accent-green);
        }
        .logo-icon {
          font-size: 1.5rem;
        }
        .search-container {
          position: relative;
          width: 300px;
        }
        .search-icon-wrapper {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
        }
        .search-container input {
          width: 100%;
          padding: 8px 12px 8px 40px;
          border-radius: 20px;
          border: 1px solid var(--border-color);
          background-color: var(--bg-primary);
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.2s;
        }
        .search-container input:focus {
          border-color: var(--accent-green);
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        :global(.nav-link) {
          position: relative;
          font-weight: 500;
          color: var(--text-secondary);
          transition: color 0.3s ease;
          padding: 5px 0;
        }
        :global(.nav-link::after) {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: 0;
          left: 50%;
          background-color: var(--accent-green);
          transition: all 0.3s ease;
          transform: translateX(-50%);
          border-radius: 2px;
        }
        :global(.nav-link:hover) {
          color: var(--accent-green);
        }
        :global(.nav-link:hover::after) {
          width: 100%;
        }
        .theme-toggle {
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 5px;
          border-radius: 50%;
          transition: background-color 0.2s;
        }
        .theme-toggle:hover {
          background-color: var(--accent-light-green);
        }
        .mobile-only {
          display: none;
        }
        .mobile-menu {
          position: fixed;
          top: var(--nav-height);
          left: 0;
          width: 100%;
          background-color: var(--bg-secondary);
          height: 0;
          overflow: hidden;
          transition: height 0.3s ease-in-out;
          display: flex;
          flex-direction: column;
          padding: 0 20px;
          border-bottom: 1px solid var(--border-color);
        }
        .mobile-menu.open {
          height: calc(100vh - var(--nav-height));
          padding: 20px;
          overflow-y: auto;
        }
        .mobile-search {
          position: relative;
          margin-bottom: 20px;
          flex-shrink: 0;
        }
        .mobile-search input {
          width: 100%;
          padding: 12px 12px 12px 40px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background-color: var(--bg-primary);
          color: var(--text-primary);
        }
        .mobile-link {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px 0;
          font-size: 1.1rem;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-primary);
          flex-shrink: 0;
        }
        .theme-switch {
          width: 100%;
          border-bottom: none;
          margin-bottom: 20px;
        }

        @media (max-width: 1024px) {
          .desktop-only {
            display: none;
          }
          .mobile-only {
            display: block;
          }
        }
      `}</style>
        </nav>
    );
}
