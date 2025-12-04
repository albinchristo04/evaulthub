export interface Match {
    matchId: string;
    title: string;
    poster: string;
    teams: {
        home: {
            name: string;
            logoUrl?: string;
        };
        away: {
            name: string;
            logoUrl?: string;
        };
    };
    status: string;
    currentMinute?: string;
    date: string;
    timestamp: number;
    league: string;
    sport: string;
    streams: {
        url: string;
        label: string;
    }[];
}

interface RawMatch {
    matchId: string;
    title: string;
    league: string;
    start_time: string;
    teams: {
        home: { name: string; logo_url: string };
        away: { name: string; logo_url: string };
    };
    poster_url: string;
    resolved_streams: { label: string; url: string }[];
    raw: any;
}

const API_URL = 'https://raw.githubusercontent.com/albinchristo04/streameast/refs/heads/main/matches_clean.json';

function inferSportFromLeague(league: string): string {
    const l = league.toLowerCase();

    if (l.includes('nba') || l.includes('basketball') || l.includes('euroleague')) return 'Basketball';
    if (l.includes('nfl') || l.includes('ncaaf')) return 'American Football';
    if (l.includes('mlb') || l.includes('baseball')) return 'Baseball';
    if (l.includes('nhl') || l.includes('hockey')) return 'Ice Hockey';
    if (l.includes('tennis') || l.includes('atp') || l.includes('wta')) return 'Tennis';
    if (l.includes('cricket') || l.includes('ipl')) return 'Cricket';
    if (l.includes('ufc') || l.includes('mma')) return 'MMA';

    return 'Football';
}

export async function fetchMatches(): Promise<Match[]> {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const matches: RawMatch[] = data.matches || [];

        return matches.map((m): Match => {
            const date = new Date(m.start_time);
            return {
                matchId: m.matchId,
                title: m.title,
                poster: m.poster_url,
                teams: {
                    home: {
                        name: m.teams.home.name,
                        logoUrl: m.teams.home.logo_url,
                    },
                    away: {
                        name: m.teams.away.name,
                        logoUrl: m.teams.away.logo_url,
                    },
                },
                status: m.raw?.status || 'NS',
                currentMinute: m.raw?.currentMinute,
                date: m.start_time,
                timestamp: date.getTime() / 1000,
                league: m.league,
                sport: m.raw?.sport || inferSportFromLeague(m.league),
                streams: m.resolved_streams,
            };
        });
    } catch (error) {
        console.error('Error fetching matches:', error);
        return [];
    }
}

export function filterRelevantMatches(matches: Match[]): Match[] {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return matches.filter(match => {
        const matchDate = new Date(match.date);

        // Must be today or future
        if (matchDate < todayStart) return false;

        // Exclude finished matches
        const status = match.status?.toLowerCase() || 'ns';
        const finishedStatuses = ['ft', 'aet', 'pen', 'post', 'finished', 'cancelled', 'postponed'];
        if (finishedStatuses.includes(status)) return false;

        // Exclude old matches that should have finished
        const hoursElapsed = (now.getTime() - matchDate.getTime()) / (1000 * 60 * 60);
        if (hoursElapsed > 2.5 && status === 'ns') return false;

        return true;
    });
}

export function isLiveMatch(match: Match): boolean {
    const status = match.status?.toLowerCase() || '';
    return status.includes("'") || status === 'live' || status === 'ht' || status === 'in' || status.includes('+');
}

export function groupMatchesBySport(matches: Match[]): Record<string, Match[]> {
    const grouped: Record<string, Match[]> = {};

    matches.forEach(match => {
        const sport = match.sport || 'Other';
        if (!grouped[sport]) {
            grouped[sport] = [];
        }
        grouped[sport].push(match);
    });

    return grouped;
}
