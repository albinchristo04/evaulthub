
import Link from 'next/link';
import { getSports, getMatches, Match } from '@/lib/api';
import MatchCard from '@/components/MatchCard';
import { Trophy, Flame, Star } from 'lucide-react';
import styles from './page.module.css';

export default async function Home() {
  const sports = await getSports();

  // Fetch matches for all sports in parallel
  const allMatchesPromises = sports.map(sport => getMatches(sport.name));
  const allMatchesResults = await Promise.all(allMatchesPromises);

  let allMatches: Match[] = [];
  allMatchesResults.forEach((matches) => {
    if (Array.isArray(matches)) {
      allMatches = [...allMatches, ...matches];
    }
  });

  // Filter Live Matches
  const liveMatches = allMatches.filter(match => {
    const status = match.status?.toLowerCase() || '';
    // Check for common live indicators
    return status.includes("'") ||
      status === 'live' ||
      status === 'ht' ||
      (status !== 'ns' && status !== 'ft' && status !== 'postponed' && status !== 'cancelled' && !status.includes(':'));
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

  // Filter Popular Matches (Upcoming)
  const popularMatches = allMatches.filter(match => {
    // Exclude matches already shown in Live section
    const isLive = liveMatches.some(m => m.matchId === match.matchId);
    if (isLive) return false;

    // Exclude finished matches
    if (match.status === 'FT' || match.status === 'AET' || match.status === 'Pen') return false;

    // Check if league is popular
    return popularLeagues.some(league => match.league?.includes(league));
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort by time
    .slice(0, 12); // Show top 12

  // Fallback: if no popular matches found, just show next upcoming matches
  const displayPopularMatches = popularMatches.length > 0 ? popularMatches : allMatches
    .filter(m => !liveMatches.some(live => live.matchId === m.matchId) && m.status !== 'FT')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 12);

  return (
    <div className="container py-8">
      {/* Sports Categories */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Trophy className={styles.iconGold} /> Sports
        </h2>
        <div className={styles.sportsGrid}>
          {sports.map((sport) => (
            <Link
              key={sport.name}
              href={`/${sport.name}`}
              className={styles.sportCard}
            >
              <span className={styles.sportName}>{sport.displayName}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Live Section */}
      {liveMatches.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <Flame className="text-red-500 mr-2" /> Popular Live <span className={styles.liveBadge}>Live ({liveMatches.length})</span>
            </h2>
          </div>
          <div className={styles.matchesGrid}>
            {liveMatches.map((match) => (
              <MatchCard key={match.matchId} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* Popular Matches Section */}
      {displayPopularMatches.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <Star className="text-yellow-400 mr-2" /> Popular Matches
            </h2>
          </div>
          <div className={styles.matchesGrid}>
            {displayPopularMatches.map((match) => (
              <MatchCard key={match.matchId} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* If no matches at all */}
      {liveMatches.length === 0 && displayPopularMatches.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p>No matches available at the moment.</p>
        </div>
      )}
    </div>
  );
}
