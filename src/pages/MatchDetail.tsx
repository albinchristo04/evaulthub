import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMatches, Match } from '@/utils/api';
import styles from './MatchDetail.module.css';

export default function MatchDetail() {
    const { id } = useParams<{ id: string }>();
    const [match, setMatch] = useState<Match | null>(null);
    const [selectedStream, setSelectedStream] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMatch();
    }, [id]);

    async function loadMatch() {
        try {
            const matches = await fetchMatches();
            const found = matches.find(m => m.matchId === id);
            setMatch(found || null);
        } catch (error) {
            console.error('Error loading match:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div className="container"><div className={styles.loading}>Loading...</div></div>;
    }

    if (!match) {
        return <div className="container"><div className={styles.error}>Match not found</div></div>;
    }

    const baseImageUrl = 'https://api.watchfooty.st';

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
            <div className={styles.matchHeader}>
                <div className={styles.teams}>
                    <div className={styles.team}>
                        {match.teams.home.logoUrl && (
                            <img
                                src={`${baseImageUrl}${match.teams.home.logoUrl}`}
                                alt={match.teams.home.name}
                                className={styles.teamLogo}
                            />
                        )}
                        <h2>{match.teams.home.name}</h2>
                    </div>

                    <div className={styles.vsContainer}>
                        <span className={styles.vs}>VS</span>
                    </div>

                    <div className={styles.team}>
                        {match.teams.away.logoUrl && (
                            <img
                                src={`${baseImageUrl}${match.teams.away.logoUrl}`}
                                alt={match.teams.away.name}
                                className={styles.teamLogo}
                            />
                        )}
                        <h2>{match.teams.away.name}</h2>
                    </div>
                </div>
            </div>

            {match.streams && match.streams.length > 0 && (
                <>
                    <div className={styles.streamSelector}>
                        {match.streams.map((stream, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedStream(index)}
                                className={`${styles.streamButton} ${index === selectedStream ? styles.active : ''}`}
                            >
                                Stream {index + 1} ({stream.label})
                            </button>
                        ))}
                    </div>

                    <div className={styles.playerContainer}>
                        <iframe
                            src={match.streams[selectedStream].url}
                            className={styles.iframe}
                            allowFullScreen
                            allow="autoplay; encrypted-media"
                        />
                    </div>
                </>
            )}

            {(!match.streams || match.streams.length === 0) && (
                <div className={styles.noStream}>
                    <p>No streams available yet. Check back closer to match time.</p>
                </div>
            )}
        </div>
    );
}
