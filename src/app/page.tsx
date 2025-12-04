
import Link from 'next/link';
import { getAllMatches, getSports, Match } from '@/lib/api';
import MatchCard from '@/components/MatchCard';
import DraggableCarousel from '@/components/DraggableCarousel';
import { Flame, Trophy, Activity } from 'lucide-react';
import styles from './page.module.css';
import { isAfter, startOfDay, parseISO } from 'date-fns';

export default async function Home() {
  const [allMatches, sports] = await Promise.all([getAllMatches(), getSports()]);

  // Get current time and today's start
  const now = new Date();
  const todayStart = startOfDay(now);

  console.log('Total matches fetched:', allMatches.length);

  // Filter matches: only future matches (not finished)
  const relevantMatches = allMatches.filter(match => {
    // Parse the match date
    let matchDate: Date;
    try {
      if (match.timestamp) {
        const timestamp = match.timestamp < 10000000000 ? match.timestamp * 1000 : match.timestamp;
        matchDate = new Date(timestamp);
      } else {
        matchDate = parseISO(match.date);
      }
    } catch (e) {
      console.error('Error parsing date for match:', match.matchId, e);
      return false;
    }

    // Must be today or later
    if (matchDate < todayStart) {
      return false;
    }

    // Exclude finished matches based on status
    const status = match.status?.toLowerCase() || 'ns';
    const finishedStatuses = ['ft', 'aet', 'pen', 'post', 'finished', 'cancelled', 'postponed', 'abandoned'];

    if (finishedStatuses.includes(status)) {
      return false;
    }

    // Exclude if match time has passed by more than 2.5 hours (likely finished)
    const timeDiff = now.getTime() - matchDate.getTime();
    const hoursElapsed = timeDiff / (1000 * 60 * 60);

    if (hoursElapsed > 2.5 && status === 'ns') {
      return false; // Match should have started but hasn't, likely cancelled/postponed
    }

    return true;
  });

  console.log('Relevant matches (today+):', relevantMatches.length);

  // Filter Live Matches
  const liveMatches = relevantMatches.filter(match => {
    const status = match.status?.toLowerCase() || '';
    const isLive = status.includes("'") ||
      status === 'live' ||
      status === 'ht' ||
      status === 'in' ||
      status.includes('+');

    return isLive;
  });

  console.log('Live matches:', liveMatches.length);

  // Helper to sort matches by date
  const sortMatches = (matches: Match[]) => {
    return matches.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB;
    });
  };

  // Upcoming Matches (not live, not finished)
  const upcomingMatches = relevantMatches.filter(match => {
    const isLive = liveMatches.some(m => m.matchId === match.matchId);
    return !isLive;
  });

  console.log('Upcoming matches:', upcomingMatches.length);

  // Group matches by sport
  const matchesBySport: { [key: string]: Match[] } = {};

  upcomingMatches.forEach(match => {
    const sport = match.sport || 'Other';
    if (!matchesBySport[sport]) {
      matchesBySport[sport] = [];
    }
    matchesBySport[sport].push(match);
  });

  // Log sport distribution
  Object.keys(matchesBySport).forEach(sport => {
    console.log(`${sport}: ${matchesBySport[sport].length} matches`);
  });

  // Prioritize specific sports and sort
  const prioritySports = ['Football', 'Basketball', 'American Football', 'Ice Hockey', 'Baseball', 'Tennis', 'Cricket', 'MMA', 'Golf'];
  const sortedSports = Object.keys(matchesBySport)
    .filter(sport => matchesBySport[sport].length > 0) // Only show sports with matches
    .sort((a, b) => {
      const indexA = prioritySports.indexOf(a);
      const indexB = prioritySports.indexOf(b);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });

  return (
    <div className="container py-8">
      {/* Sports Categories - Top Row */}
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

      {/* Live Matches Section */}
      {liveMatches.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <Flame className="text-red-500 mr-2" />
              Live Now
              <span className={styles.liveBadge}>{liveMatches.length}</span>
            </h2>
          </div>
          <DraggableCarousel>
            {sortMatches(liveMatches).map((match) => (
              <MatchCard key={match.matchId} match={match} />
            ))}
          </DraggableCarousel>
        </section>
      )}

      {/* Sport Sections */}
      {sortedSports.map(sport => {
        const matches = sortMatches(matchesBySport[sport]);

        return (
          <section key={sport} className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <Activity className="text-blue-400 mr-2" />
                {sport}
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

      {/* Empty State */}
      {liveMatches.length === 0 && upcomingMatches.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emoji}>⚽🏀🎾</div>
          <p className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>No matches available</p>
          <p className="text-gray-400">Check back later for upcoming events</p>
        </div>
      )}
    </div>
  );
}
