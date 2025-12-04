
import Link from 'next/link';
import { getAllMatches, getSports, Match } from '@/lib/api';
import MatchCard from '@/components/MatchCard';
import DraggableCarousel from '@/components/DraggableCarousel';
import { Flame, Calendar, Trophy, Activity } from 'lucide-react';
import styles from './page.module.css';

export default async function Home() {
  const [allMatches, sports] = await Promise.all([getAllMatches(), getSports()]);

  // Filter Live Matches
  const liveMatches = allMatches.filter(match => {
    const status = match.status?.toLowerCase() || '';
    return status.includes("'") ||
      status === 'live' ||
      status === 'ht' ||
      (status !== 'ns' && status !== 'ft' && status !== 'postponed' && status !== 'cancelled' && !status.includes(':') && status !== 'post');
  });

  // Helper to sort matches
  const sortMatches = (matches: Match[]) => {
    return matches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Group Upcoming Matches by Sport
  const upcomingMatches = allMatches.filter(match => {
    const isLive = liveMatches.some(m => m.matchId === match.matchId);
    if (isLive) return false;
    const status = match.status?.toLowerCase() || '';
    if (status === 'ft' || status === 'aet' || status === 'pen' || status === 'post') return false;
    return true;
  });

  const matchesBySport: { [key: string]: Match[] } = {};
  upcomingMatches.forEach(match => {
    const sport = match.sport || 'Other';
    if (!matchesBySport[sport]) {
      matchesBySport[sport] = [];
    }
    matchesBySport[sport].push(match);
  });

  // Prioritize specific sports
  const prioritySports = ['Football', 'Basketball', 'Tennis', 'Cricket', 'Baseball', 'Ice Hockey'];
  const sortedSports = Object.keys(matchesBySport).sort((a, b) => {
    const indexA = prioritySports.indexOf(a);
    const indexB = prioritySports.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="container py-8">
      {/* Sports Categories - Top Column */}
      <section className={styles.section}>
        <div className={styles.sportsList}>
          {sports.map((sport) => (
            <Link
              key={sport.name}
              href={`/${sport.name}`}
              className={styles.sportPill}
            >
              <Trophy size={16} className={styles.iconGold} />
              <span>{sport.displayName}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Live Section */}
      {liveMatches.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <Flame className="text-red-500 mr-2" /> Popular Live <span className={styles.liveBadge}>({liveMatches.length})</span>
            </h2>
          </div>
          <DraggableCarousel>
            {liveMatches.map((match) => (
              <MatchCard key={match.matchId} match={match} />
            ))}
          </DraggableCarousel>
        </section>
      )}

      {/* Sports Sections */}
      {sortedSports.map(sport => {
        const matches = sortMatches(matchesBySport[sport]);
        if (matches.length === 0) return null;

        return (
          <section key={sport} className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <Activity className="text-blue-400 mr-2" /> Popular {sport}
              </h2>
            </div>
            <DraggableCarousel>
              {matches.map((match) => (
                <MatchCard key={match.matchId} match={match} />
              ))}
            </DraggableCarousel>
          </section>
        );
      })}

      {/* If no matches at all */}
      {liveMatches.length === 0 && upcomingMatches.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p>No matches available at the moment.</p>
        </div>
      )}
    </div>
  );
}
