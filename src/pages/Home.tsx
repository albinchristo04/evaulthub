import { useEffect, useState } from 'react';
import { Flame, Activity } from 'lucide-react';
import MatchCard from '@/components/MatchCard';
import Carousel from '@/components/Carousel';
import {
    fetchMatches,
    filterRelevantMatches,
    isLiveMatch,
    groupMatchesBySport,
    Match
} from '@/utils/api';
import styles from './Home.module.css';

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [liveMatches, setLiveMatches] = useState<Match[]>([]);
    const [matchesBySport, setMatchesBySport] = useState<Record<string, Match[]>>({});

    useEffect(() => {
        loadMatches();
    }, []);

    async function loadMatches() {
        try {
            const allMatches = await fetchMatches();
            const relevant = filterRelevantMatches(allMatches);

            // Separate live and upcoming
            const live = relevant.filter(isLiveMatch);
            const upcoming = relevant.filter(m => !isLiveMatch(m));

            setLiveMatches(live);
            setMatchesBySport(groupMatchesBySport(upcoming));
        } catch (error) {
            console.error('Error loading matches:', error);
        } finally {
            setLoading(false);
        }
    }

    const prioritySports = ['Football', 'Basketball', 'American Football', 'Ice Hockey', 'Baseball', 'Tennis'];
    const sortedSports = Object.keys(matchesBySport).sort((a, b) => {
        const indexA = prioritySports.indexOf(a);
        const indexB = prioritySports.indexOf(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.localeCompare(b);
    });

    if (loading) {
        return (
            <div className="container">
                <div className={styles.loading}>Loading matches...</div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
            {/* Live Matches */}
            {liveMatches.length > 0 && (
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>
                            <Flame size={28} style={{ color: '#dc2626' }} />
                            Live Now
                            <span className={styles.liveBadge}>{liveMatches.length}</span>
                        </h2>
                    </div>
                    <Carousel>
                        {liveMatches.map(match => (
                            <MatchCard key={match.matchId} match={match} />
                        ))}
                    </Carousel>
                </section>
            )}

            {/* Sport Sections */}
            {sortedSports.map(sport => {
                const matches = matchesBySport[sport];
                if (!matches || matches.length === 0) return null;

                return (
                    <section key={sport} className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>
                                <Activity size={28} style={{ color: '#818cf8' }} />
                                {sport}
                            </h2>
                        </div>
                        <Carousel>
                            {matches.map(match => (
                                <MatchCard key={match.matchId} match={match} />
                            ))}
                        </Carousel>
                    </section>
                );
            })}

            {/* Empty State */}
            {liveMatches.length === 0 && sortedSports.length === 0 && (
                <div className={styles.emptyState}>
                    <div className={styles.emoji}>⚽🏀🎾</div>
                    <p className={styles.emptyTitle}>No matches available</p>
                    <p className={styles.emptyText}>Check back later for upcoming events</p>
                </div>
            )}
        </div>
    );
}
