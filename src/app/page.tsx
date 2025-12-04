
import Link from 'next/link';
import { getAllMatches, getSports, Match } from '@/lib/api';
import MatchCard from '@/components/MatchCard';
import DraggableCarousel from '@/components/DraggableCarousel';
import { Flame, Calendar, Trophy, Activity } from 'lucide-react';
import styles from './page.module.css';
import { startOfDay } from 'date-fns';

export default async function Home() {
  const [allMatches, sports] = await Promise.all([getAllMatches(), getSports()]);

  // Get today's start of day
  const todayStart = startOfDay(new Date());

  // Filter matches: only today and future, exclude finished matches
  const relevantMatches = allMatches.filter(match => {
    // Parse the match date
    let matchDate: Date;
    if (match.timestamp) {
      const timestamp = match.timestamp < 10000000000 ? match.timestamp * 1000 : match.timestamp;
      matchDate = new Date(timestamp);
    } else {
      matchDate = new Date(match.date);
    }

    // Exclude matches before today
    if (matchDate < todayStart) {
      return false;
    }

    // Exclude finished matches
    const status = match.status?.toLowerCase() || '';
    if (status === 'ft' || status === 'aet' || status === 'pen' || status === 'post' ||
      status === 'finished' || status === 'cancelled' || status === 'postponed') {
      return false;
    }

    return true;
  });

  // Filter Live Matches
  const liveMatches = relevantMatches.filter(match => {
    const status = match.status?.toLowerCase() || '';
    return status.includes("'") ||
      status === 'live' ||
      status === 'ht' ||
      status === 'in' ||
      (status !== 'ns' && !status.includes(':'));
  });

  // Helper to sort matches by date
  const sortMatches = (matches: Match[]) => {
    return matches.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB;
    });
  };

  // Group Upcoming Matches by Sport
  const upcomingMatches = relevantMatches.filter(match => {
    const isLive = liveMatches.some(m => m.matchId === match.matchId);
    return !isLive;
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
  const prioritySports = ['Football', 'Basketball', 'American Football', 'Ice Hockey', 'Baseball', 'Tennis', 'Cricket'];
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
            {sortMatches(liveMatches).map((match) => (
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
