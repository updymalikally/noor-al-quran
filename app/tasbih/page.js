'use client';

import { useState, useEffect } from 'react';
import { RotateCcw, Plus, Minus, Info, Smartphone, SmartphoneNfc } from 'lucide-react';

export default function Tasbih() {
    const [count, setCount] = useState(0);
    const [goal, setGoal] = useState(33);
    const [phrase, setPhrase] = useState('SubhanAllah');
    const [vibrationEnabled, setVibrationEnabled] = useState(true);

    const phrases = [
        { name: 'SubhanAllah', arabic: 'سُبْحَانَ ٱللَّٰهِ', meaning: 'Glory be to Allah' },
        { name: 'Alhamdulillah', arabic: 'ٱلْحَمْدُ لِلَّٰهِ', meaning: 'Praise be to Allah' },
        { name: 'Allahu Akbar', arabic: 'ٱللَّٰهُ أَكْبَرُ', meaning: 'Allah is the Greatest' },
        { name: 'Astaghfirullah', arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ', meaning: 'I seek forgiveness from Allah' },
        { name: 'La ilaha illa Allah', arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', meaning: 'There is no god but Allah' },
    ];

    useEffect(() => {
        const savedCount = localStorage.getItem('tasbihCount');
        const savedVib = localStorage.getItem('tasbihVibration');
        if (savedCount) setCount(parseInt(savedCount));
        if (savedVib !== null) setVibrationEnabled(savedVib === 'true');
    }, []);

    useEffect(() => {
        localStorage.setItem('tasbihCount', count);
    }, [count]);

    const toggleVibration = () => {
        const newVal = !vibrationEnabled;
        setVibrationEnabled(newVal);
        localStorage.setItem('tasbihVibration', newVal.toString());
        if (newVal && window.navigator.vibrate) {
            window.navigator.vibrate(50);
        }
    };

    const increment = () => {
        setCount(prev => prev + 1);
        if (vibrationEnabled && window.navigator.vibrate) {
            window.navigator.vibrate(50);
        }
    };

    const decrement = () => {
        if (count > 0) setCount(prev => prev - 1);
    };

    const reset = () => {
        if (confirm('Reset counter?')) setCount(0);
    };

    const currentPhrase = phrases.find(p => p.name === phrase);
    const goalReached = count >= goal;

    return (
        <div className="container tasbih-page">
            <header className="section-header">
                <h1 className="section-title">Tasbih Counter</h1>
                <p>Keep track of your dhikr and stay connected with Allah.</p>
            </header>

            <div className="tasbih-container">
                <div className="phrase-selector">
                    {phrases.map((p) => (
                        <button
                            key={p.name}
                            className={`phrase-btn ${phrase === p.name ? 'active' : ''}`}
                            onClick={() => { setPhrase(p.name); setCount(0); }}
                        >
                            {p.name}
                        </button>
                    ))}
                </div>

                <div className="settings-row">
                    <button 
                        className={`vibrate-toggle ${vibrationEnabled ? 'on' : 'off'}`} 
                        onClick={toggleVibration}
                        title="Toggle Vibration"
                    >
                        {vibrationEnabled ? <SmartphoneNfc size={18} /> : <Smartphone size={18} />}
                        <span>Vibration {vibrationEnabled ? 'On' : 'Off'}</span>
                    </button>
                </div>

                <div className={`counter-card ${goalReached ? 'goal-reached' : ''}`}>
                    <div className="phrase-display">
                        <h2 className="arabic-text">{currentPhrase.arabic}</h2>
                        <p className="meaning">{currentPhrase.meaning}</p>
                    </div>

                    <div className="counter-display">
                        <span className="count-number">{count}</span>
                        <span className="goal-status">Target: {goal} {goalReached && '🎉'}</span>
                    </div>

                    <div className="controls">
                        <button className="control-btn secondary" onClick={decrement} title="Decrease">
                            <Minus size={24} />
                        </button>
                        <button className="control-btn main" onClick={increment} title="Increase">
                            <Plus size={40} />
                        </button>
                        <button className="control-btn secondary" onClick={reset} title="Reset">
                            <RotateCcw size={24} />
                        </button>
                    </div>
                </div>

                <div className="goals-selector">
                    <span>Set Target:</span>
                    {[33, 99, 100, 1000].map(g => (
                        <button
                            key={g}
                            className={`goal-btn ${goal === g ? 'active' : ''}`}
                            onClick={() => setGoal(g)}
                        >
                            {g}
                        </button>
                    ))}
                </div>
            </div>

            <div className="dhikr-info">
                <h3><Info size={20} /> Why Dhikr?</h3>
                <p>"Verily, in the remembrance of Allah do hearts find rest." (Quran 13:28)</p>
            </div>

            <style jsx>{`
        .tasbih-page {
          padding-top: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .section-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .tasbih-container {
          width: 100%;
          max-width: 600px;
          display: flex;
          flex-direction: column;
          gap: 25px;
        }
        .phrase-selector {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }
        .phrase-btn {
          padding: 8px 15px;
          border-radius: 20px;
          border: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
          color: var(--text-secondary);
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        .phrase-btn.active {
          background-color: var(--accent-green);
          color: white;
          border-color: var(--accent-green);
          transform: scale(1.05);
        }
        
        .settings-row {
          display: flex;
          justify-content: flex-end;
          padding: 0 10px;
        }
        .vibrate-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 1px solid var(--border-color);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          transition: all 0.2s;
        }
        .vibrate-toggle.on {
          color: var(--accent-green);
          border-color: var(--accent-green);
          background-color: rgba(45, 90, 39, 0.05);
        }

        .counter-card {
          background-color: var(--bg-secondary);
          padding: 50px;
          border-radius: 30px;
          box-shadow: var(--card-shadow);
          text-align: center;
          border: 2px solid transparent;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
          transition: all 0.3s ease;
        }
        .counter-card.goal-reached {
          border-color: var(--accent-green);
          box-shadow: 0 0 30px rgba(45, 90, 39, 0.15);
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(45, 90, 39, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(45, 90, 39, 0); }
          100% { box-shadow: 0 0 0 0 rgba(45, 90, 39, 0); }
        }

        .phrase-display h2 {
          font-size: 2.5rem;
          margin-bottom: 10px;
          color: var(--accent-green);
          transition: color 0.3s ease;
        }
        .meaning {
          color: var(--text-secondary);
          font-style: italic;
        }
        .counter-display {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .count-number {
          font-size: 6rem;
          font-weight: 800;
          line-height: 1;
          color: var(--text-primary);
          font-variant-numeric: tabular-nums;
        }
        .goal-status {
          font-size: 1rem;
          color: var(--text-secondary);
          margin-top: 10px;
          transition: color 0.3s ease;
        }
        .goal-reached .goal-status {
          color: var(--accent-green);
          font-weight: bold;
        }

        .controls {
          display: flex;
          align-items: center;
          gap: 30px;
        }
        .control-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: transform 0.1s, background-color 0.2s, box-shadow 0.2s;
        }
        .control-btn:active {
          transform: scale(0.9);
        }
        .control-btn.main {
          width: 100px;
          height: 100px;
          background-color: var(--accent-green);
          color: white;
          box-shadow: 0 10px 20px rgba(45, 90, 39, 0.3);
        }
        .control-btn.main:hover {
          background-color: var(--accent-light-green);
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 15px 25px rgba(45, 90, 39, 0.4);
        }
        .control-btn.main:active {
          transform: scale(0.95);
        }
        .control-btn.secondary {
          width: 60px;
          height: 60px;
          background-color: var(--bg-primary);
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
        }
        .control-btn.secondary:hover {
          background-color: var(--border-color);
          color: var(--text-primary);
        }

        .goals-selector {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          color: var(--text-secondary);
        }
        .goal-btn {
          padding: 5px 12px;
          border-radius: 6px;
          border: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        .goal-btn:hover {
          border-color: var(--accent-light-green);
        }
        .goal-btn.active {
          border-color: var(--accent-green);
          background-color: var(--accent-green);
          color: white;
          font-weight: 600;
        }
        .dhikr-info {
          margin-top: 60px;
          text-align: center;
          color: var(--text-secondary);
          max-width: 500px;
          padding-bottom: 40px;
        }
        .dhikr-info h3 {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 10px;
          color: var(--accent-green);
        }

        @media (max-width: 768px) {
          .counter-card {
            padding: 30px;
          }
          .count-number {
            font-size: 4.5rem;
          }
          .control-btn.main {
            width: 80px;
            height: 80px;
          }
          .controls {
            gap: 20px;
          }
        }
      `}</style>
        </div>
    );
}
