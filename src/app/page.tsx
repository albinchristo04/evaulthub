
import Link from 'next/link';
import { getAllMatches, Match } from '@/lib/api';
import MatchCard from '@/components/MatchCard';
import { Flame, Calendar } from 'lucide-react';
import styles from './page.module.css';

export default async function Home() {
  const allMatches = await getAllMatches();

  // Filter Live Matches
  const liveMatches = allMatches.filter(match => {
    const status = match.status?.toLowerCase() || '';
    // Check for common live indicators
    return status.includes("'") ||
      status === 'live' ||
      status === 'ht' ||
      (status !== 'ns' && status !== 'ft' && status !== 'postponed' && status !== 'cancelled' && !status.includes(':') && status !== 'post');
  });

  // Sort Live Matches: Popular leagues and teams first
  const popularLeagues = [
    'Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'UEFA Champions League', 'UEFA Europa League',
    'NBA', 'EuroLeague',
    'NFL', 'MLB', 'NHL',
    'Indian Super League', 'Champions League', 'ISL', 'FIFA Arab Cup'
  ];

  const popularTeams = [
    'Real Madrid', 'Barcelona', 'Manchester United', 'Manchester City', 'Liverpool', 'Chelsea', 'Arsenal',
    'Bayern Munich', 'PSG', 'Juventus', 'AC Milan', 'Inter Milan', 'Atletico Madrid', 'Borussia Dortmund',
    'Tottenham', 'Ajax', 'Benfica', 'Porto', 'Napoli', 'Roma', 'Lazio', 'Sevilla', 'Valencia',
    'Lakers', 'Warriors', 'Celtics', 'Heat', 'Bucks', 'Nets', 'Clippers', 'Mavericks',
    'India', 'Pakistan', 'England', 'Australia', 'South Africa', 'New Zealand', 'West Indies', 'Sri Lanka'
  ];

  liveMatches.sort((a, b) => {
    const aPopularLeague = popularLeagues.some(league => a.league?.includes(league));
    const bPopularLeague = popularLeagues.some(league => b.league?.includes(league));
    const aPopularTeam = popularTeams.some(team =>
      a.teams?.home?.name?.includes(team) || a.teams?.away?.name?.includes(team)
    );
    const bPopularTeam = popularTeams.some(team =>
      b.teams?.home?.name?.includes(team) || b.teams?.away?.name?.includes(team)
    );

    // Prioritize: popular team + popular league > popular team > popular league > others
    const aScore = (aPopularTeam && aPopularLeague ? 3 : aPopularTeam ? 2 : aPopularLeague ? 1 : 0);
    const bScore = (bPopularTeam && bPopularLeague ? 3 : bPopularTeam ? 2 : bPopularLeague ? 1 : 0);

    return bScore - aScore;
  });

  // Upcoming Matches
  const upcomingMatches = allMatches.filter(match => {
    // Exclude matches already shown in Live section
    const isLive = liveMatches.some(m => m.matchId === match.matchId);
    if (isLive) return false;

    // Exclude finished matches
    const status = match.status?.toLowerCase() || '';
    if (status === 'ft' || status === 'aet' || status === 'pen' || status === 'post') return false;

    return true;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="container py-8">
      {/* Live Section */}
      {liveMatches.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <Flame className="text-red-500 mr-2" /> Live Matches <span className={styles.liveBadge}>({liveMatches.length})</span>
            </h2>
          </div>
          <div className={styles.carousel}>
            {liveMatches.map((match) => (
              <MatchCard key={match.matchId} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Matches Section */}
      {upcomingMatches.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <Calendar className="text-blue-400 mr-2" /> Upcoming Matches
            </h2>
          </div>
          <div className={styles.carousel}>
            {upcomingMatches.map((match) => (
              <MatchCard key={match.matchId} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* If no matches at all */}
      {liveMatches.length === 0 && upcomingMatches.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p>No matches available at the moment.</p>
        </div>
      )}
    </div>
  );
}
