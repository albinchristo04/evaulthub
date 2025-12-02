
import Link from 'next/link';
import { getSports, getMatches } from '@/lib/api';
import MatchCard from '@/components/MatchCard';
import { Trophy } from 'lucide-react';
import styles from './page.module.css';

export default async function Home() {
  const sports = await getSports();
  const footballMatches = await getMatches('football');
  const basketballMatches = await getMatches('basketball');

  const popularFootball = footballMatches.slice(0, 5);
  const popularBasketball = basketballMatches.slice(0, 5);

  return (
    <div className="container py-8">
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

      {popularFootball.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              ⚽ Popular Football <span className={styles.liveBadge}>Live (0)</span>
            </h2>
            <div className={styles.navButtons}>
              <button className={styles.navButton}>←</button>
              <button className={styles.navButton}>→</button>
            </div>
          </div>
          <div className={styles.matchesGrid}>
            {popularFootball.map((match) => (
              <MatchCard key={match.matchId} match={match} />
            ))}
          </div>
        </section>
      )}

      {popularBasketball.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              🏀 Popular Basketball <span className={styles.liveBadge}>Live (0)</span>
            </h2>
            <div className={styles.navButtons}>
              <button className={styles.navButton}>←</button>
              <button className={styles.navButton}>→</button>
            </div>
          </div>
          <div className={styles.matchesGrid}>
            {popularBasketball.map((match) => (
              <MatchCard key={match.matchId} match={match} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
