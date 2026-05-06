const BASE_URL = 'https://api.alquran.cloud/v1';

export const getSurahs = async () => {
    const res = await fetch(`${BASE_URL}/surah`);
    const data = await res.json();
    return data.data;
};

export const getSurahDetail = async (id, edition = 'quran-uthmani') => {
    const res = await fetch(`${BASE_URL}/surah/${id}/${edition}`);
    const data = await res.json();
    return data.data;
};

export const getSurahTranslation = async (id, edition = 'en.sahih') => {
    const res = await fetch(`${BASE_URL}/surah/${id}/${edition}`);
    const data = await res.json();
    return data.data;
};

export const getDailyAyah = async () => {
    const randomAyah = Math.floor(Math.random() * 6236) + 1;
    const res = await fetch(`${BASE_URL}/ayah/${randomAyah}/en.sahih`);
    const data = await res.json();
    return data.data;
};

export const getSurahAudio = async (id, edition = 'ar.alafasy') => {
    const res = await fetch(`${BASE_URL}/surah/${id}/${edition}`);
    const data = await res.json();
    return data.data;
};
