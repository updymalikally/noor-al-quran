'use client';

import { useState, useEffect } from 'react';
import { Clock, MapPin, Loader2, Calendar, Search, BellRing } from 'lucide-react';

export default function PrayerTimes() {
  const [times, setTimes] = useState(null);
  const [locationName, setLocationName] = useState('Mecca');
  const [searchCity, setSearchCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [nextPrayer, setNextPrayer] = useState(null);
  const [countdown, setCountdown] = useState('');
  const [userTz, setUserTz] = useState('');

  useEffect(() => {
    const savedCity = localStorage.getItem('prayerCity');
    if (savedCity) {
      fetchPrayerTimesByCity(savedCity);
    } else {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setLocationName(`Coordinates: ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
            await fetchPrayerTimes(latitude, longitude);
          },
          (err) => {
            setError("Location access denied. Using default (Mecca).");
            fetchPrayerTimesByCity('Mecca');
          }
        );
      } else {
        setError("Geolocation not supported. Using default (Mecca).");
        fetchPrayerTimesByCity('Mecca');
      }
    }
  }, []);

  useEffect(() => {
    if (!times) return;

    const timings = times.timings;

    const updateCountdown = () => {
      const tz = times.meta.timezone;
      const nowStr = new Date().toLocaleString("en-US", { timeZone: tz });
      const now = new Date(nowStr);

      const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
      let upcoming = null;
      let minDiff = Infinity;

      for (const p of prayers) {
        const [hours, minutes] = timings[p].split(':');
        const prayerTime = new Date(nowStr);
        prayerTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

        const diff = prayerTime - now;
        if (diff > 0 && diff < minDiff) {
          minDiff = diff;
          upcoming = p;
        }
      }

      if (!upcoming) {
        const [hours, minutes] = timings['Fajr'].split(':');
        const tomorrowFajr = new Date(nowStr);
        tomorrowFajr.setDate(now.getDate() + 1);
        tomorrowFajr.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

        const diff = tomorrowFajr - now;
        minDiff = diff;
        upcoming = 'Fajr';
      }

      setNextPrayer(upcoming);

      const hours = Math.floor(minDiff / (1000 * 60 * 60));
      const mins = Math.floor((minDiff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((minDiff % (1000 * 60)) / 1000);

      setCountdown(`${hours}h ${mins}m ${secs}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [times]);

  const fetchPrayerTimes = async (lat, lon) => {
    setLoading(true);
    try {
      const today = new Date();
      const date = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;

      const res = await fetch(`https://api.aladhan.com/v1/timings/${date}?latitude=${lat}&longitude=${lon}&method=2`);
      const data = await res.json();
      setTimes(data.data);

      try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`);
        const geoData = await geoRes.json();
        if (geoData && geoData.address) {
          const city = geoData.address.city || geoData.address.town || geoData.address.state || 'Unknown Location';
          const country = geoData.address.country || '';
          setLocationName(`${city}${country ? `, ${country}` : ''}`);
        }
      } catch (e) {
        console.error("Reverse geocoding failed");
      }

    } catch (err) {
      setError("Failed to fetch prayer times.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPrayerTimesByCity = async (city) => {
    setLoading(true);
    setError(null);
    try {
      // Step 1: Geocode city using open-meteo
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError(`Could not find location for ${city}. Try another city.`);
        setLoading(false);
        return;
      }

      const location = geoData.results[0];
      const { latitude, longitude, name, country } = location;
      const formattedLocation = `${name}${country ? `, ${country}` : ''}`;

      setLocationName(formattedLocation);
      localStorage.setItem('prayerCity', city);
      setSearchCity('');

      // Step 2: Fetch times using coordinates
      const today = new Date();
      const date = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
      const res = await fetch(`https://api.aladhan.com/v1/timings/${date}?latitude=${latitude}&longitude=${longitude}&method=2`);
      const data = await res.json();

      if (data.code === 200) {
        setTimes(data.data);
      } else {
        setError(`Could not find prayer times.`);
      }
    } catch (err) {
      setError("Failed to fetch prayer times. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchPrayerTimesByCity(searchCity.trim());
    }
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading && !times) {
    return (
      <div className="loader-container">
        <Loader2 className="spinner" size={48} />
        <p>Calculating prayer times...</p>
        <style jsx>{`
          .loader-container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 60vh; color: var(--accent-green); }
          .spinner { animation: spin 1s linear infinite; margin-bottom: 15px; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const prayers = times ? [
    { name: 'Fajr', time: times.timings.Fajr },
    { name: 'Dhuhr', time: times.timings.Dhuhr },
    { name: 'Asr', time: times.timings.Asr },
    { name: 'Maghrib', time: times.timings.Maghrib },
    { name: 'Isha', time: times.timings.Isha },
  ] : [];

  return (
    <div className="container prayer-page">
      <header className="section-header">
        <h1 className="section-title">Prayer Times</h1>
        <div className="location-info">
          <MapPin size={18} />
          <span>{locationName}</span>
        </div>
      </header>

      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-input-wrapper">
          <div className="search-icon-wrapper">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search by city (e.g. London)..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
          />
        </div>
        <button type="submit" className="search-btn">Find</button>
      </form>

      {error && <p className="error-msg">{error}</p>}

      {times && (
        <>
          {nextPrayer && (
            <div className="next-prayer-card">
              <div className="next-prayer-info">
                <BellRing className="bell-icon" size={24} />
                <div>
                  <h3 className="next-prayer-title">Next Prayer: {nextPrayer}</h3>
                  <p className="countdown">in {countdown}</p>
                </div>
              </div>
            </div>
          )}

          <div className="date-card">
            <div className="hijri-date">
              <Calendar size={20} />
              <span>{`${times.date.hijri.month.en} ${times.date.hijri.day}, ${times.date.hijri.year} AH`}</span>
            </div>
            <div className="gregorian-date">
              {`${times.date.gregorian.month.en} ${times.date.gregorian.day}, ${times.date.gregorian.year}`}
            </div>
          </div>

          <div className="prayer-list">
            {prayers.map((prayer) => {
              const isNext = prayer.name === nextPrayer;
              return (
                <div key={prayer.name} className={`prayer-card ${isNext ? 'highlight' : ''}`}>
                  <div className="prayer-name">
                    <Clock size={24} className="prayer-icon" />
                    <h3>{prayer.name}</h3>
                  </div>
                  <div className="prayer-time">
                    {formatTime(prayer.time)}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <style jsx>{`
        .prayer-page {
          padding-top: 40px;
          max-width: 800px;
          padding-bottom: 40px;
        }
        .section-header {
          text-align: center;
          margin-bottom: 20px;
        }
        .location-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: var(--text-secondary);
          margin-top: 10px;
          font-weight: 500;
        }
        .search-form {
          display: flex;
          gap: 10px;
          max-width: 500px;
          margin: 0 auto 30px;
        }
        .search-input-wrapper {
          position: relative;
          flex: 1;
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
        .search-input-wrapper input {
          width: 100%;
          padding: 12px 15px 12px 45px;
          border-radius: 25px;
          border: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
          color: var(--text-primary);
          outline: none;
          transition: all 0.2s;
        }
        .search-input-wrapper input:focus {
          border-color: var(--accent-green);
          box-shadow: 0 0 0 3px rgba(45, 90, 39, 0.1);
        }
        .search-btn {
          padding: 0 25px;
          border-radius: 25px;
          background-color: var(--accent-green);
          color: white;
          font-weight: 600;
          transition: transform 0.2s, background-color 0.2s;
        }
        .search-btn:hover {
          transform: scale(1.05);
          background-color: var(--accent-light-green);
        }
        
        .next-prayer-card {
          background: linear-gradient(135deg, var(--accent-green) 0%, var(--accent-light-green) 100%);
          color: white;
          padding: 25px;
          border-radius: 20px;
          margin-bottom: 25px;
          box-shadow: 0 15px 30px rgba(45, 90, 39, 0.2);
          animation: pulse-soft 2s infinite;
        }
        .next-prayer-info {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .bell-icon {
          background: rgba(255, 255, 255, 0.2);
          padding: 12px;
          border-radius: 50%;
          width: 50px;
          height: 50px;
        }
        .next-prayer-title {
          font-size: 1.2rem;
          margin-bottom: 5px;
        }
        .countdown {
          font-size: 1.8rem;
          font-weight: 700;
          line-height: 1;
        }
        @keyframes pulse-soft {
          0% { box-shadow: 0 10px 20px rgba(45, 90, 39, 0.2); }
          50% { box-shadow: 0 15px 30px rgba(45, 90, 39, 0.4); }
          100% { box-shadow: 0 10px 20px rgba(45, 90, 39, 0.2); }
        }

        .date-card {
          background-color: var(--bg-secondary);
          color: var(--text-primary);
          padding: 20px;
          border-radius: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          border: 1px solid var(--border-color);
        }
        .hijri-date {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          color: var(--accent-green);
        }
        .prayer-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .prayer-card {
          background-color: var(--bg-secondary);
          padding: 25px;
          border-radius: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid var(--border-color);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .prayer-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
          border-color: var(--accent-light-green);
        }
        .prayer-card.highlight {
          border-color: var(--accent-green);
          background-color: rgba(45, 90, 39, 0.05);
          box-shadow: 0 0 0 1px var(--accent-green);
        }
        .prayer-name {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .prayer-icon {
          color: var(--accent-green);
        }
        .prayer-time {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .error-msg {
          text-align: center;
          color: #d32f2f;
          margin-top: -15px;
          margin-bottom: 20px;
          font-size: 0.9rem;
        }

        @media (max-width: 600px) {
          .date-card {
            flex-direction: column;
            gap: 10px;
            text-align: center;
          }
          .search-form {
            flex-direction: column;
          }
          .search-btn {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
}
