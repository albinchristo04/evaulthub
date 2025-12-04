
export interface Sport {
  name: string;
  displayName: string;
}

export interface Team {
  name: string;
  logoUrl?: string;
  logoId?: string;
}

export interface Stream {
  id: string;
  url: string;
  quality: string;
  language: string;
  isRedirect: boolean;
  nsfw: boolean;
  ads: boolean;
}


export interface Match {
  matchId: string;
  title: string;
  poster: string;
  teams: {
    home: Team;
    away: Team;
  };
  scores?: {
    home: number;
    away: number;
  };
  status: string;
  currentMinute?: string;
  currentMinuteNumber?: number;
  isEvent: boolean;
  date: string;
  timestamp: number;
  league: string;
  leagueLogo?: string;
  sport: string;
  streams: Stream[];
}

export interface MatchDetails extends Match {
  venue?: string;
  note?: string;
  eventName?: string;
  eventLogo?: string;
  eventPoster?: string;
  eventId?: string;
  eventCompetitors?: any[];
}

const API_BASE = 'https://api.watchfooty.st/api/v1';
const NEW_SOURCE_URL = 'https://raw.githubusercontent.com/albinchristo04/streameast/refs/heads/main/matches_clean.json';

interface NewMatch {
  matchId: string;
  title: string;
  league: string;
  start_time: string;
  teams: {
    home: { name: string; logo_url: string };
    away: { name: string; logo_url: string };
  };
  score: any;
  poster_url: string;
  resolved_streams: { label: string; url: string }[];
  raw: any;
}

async function fetchNewMatches(): Promise<NewMatch[]> {
  try {
    const res = await fetch(NEW_SOURCE_URL, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch matches from new source');
    const data = await res.json();
    return data.matches || [];
  } catch (error) {
    console.error('Error fetching new matches:', error);
    return [];
  }
}

function mapNewMatchToMatch(newMatch: NewMatch): Match {
  const date = new Date(newMatch.start_time);
  return {
    matchId: newMatch.matchId,
    title: newMatch.title,
    poster: newMatch.poster_url,
    teams: {
      home: {
        name: newMatch.teams.home.name,
        logoUrl: newMatch.teams.home.logo_url,
      },
      away: {
        name: newMatch.teams.away.name,
        logoUrl: newMatch.teams.away.logo_url,
      },
    },
    scores: newMatch.score, // Assuming score structure is compatible or null
    status: newMatch.raw?.status || 'NS', // Fallback to NS if not found
    currentMinute: newMatch.raw?.currentMinute,
    currentMinuteNumber: newMatch.raw?.currentMinuteNumber,
    isEvent: false, // Default
    date: newMatch.start_time,
    timestamp: date.getTime() / 1000, // Convert to seconds if needed, or keep ms. Old code checked < 10000000000.
    league: newMatch.league,
    leagueLogo: newMatch.raw?.leagueLogo,
    sport: newMatch.raw?.sport || 'Football', // Default to Football or infer
    streams: newMatch.resolved_streams.map((s, i) => ({
      id: `stream-${i}`,
      url: s.url,
      quality: s.label,
      language: 'en', // Default
      isRedirect: false,
      nsfw: false,
      ads: false,
    })),
  };
}

export async function getAllMatches(): Promise<Match[]> {
  const newMatches = await fetchNewMatches();
  return newMatches.map(mapNewMatchToMatch);
}


export async function getSports(): Promise<Sport[]> {
  try {
    const res = await fetch(`${API_BASE}/sports`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Failed to fetch sports');
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getMatches(sport: string, date?: string): Promise<Match[]> {
  try {
    const url = new URL(`${API_BASE}/matches/${sport}`);
    if (date) {
      url.searchParams.append('date', date);
    }
    const res = await fetch(url.toString(), { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch matches');
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getMatchDetails(id: string): Promise<MatchDetails | null> {
  try {
    // Try to find the match in the new source first
    const allMatches = await getAllMatches();
    const match = allMatches.find(m => m.matchId === id);

    if (match) {
      return {
        ...match,
        // Add any missing MatchDetails specific fields if needed
      };
    }

    // Fallback to old API if not found (optional, but might be safer to remove if we fully switch)
    // For now, let's stick to the new source as requested.
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}
