
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
    const res = await fetch(`${API_BASE}/match/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch match details');
    const data = await res.json();
    // The API returns an array with one item for match details based on the docs
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
