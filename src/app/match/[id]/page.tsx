
'use client';

import { getMatchDetails } from '@/lib/api';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import { Shield, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { use, useState, useEffect } from 'react';

export const runtime = 'edge';

interface MatchPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function MatchPage({ params }: MatchPageProps) {
    const { id } = use(params);
    const [match, setMatch] = useState<any>(null);
    const [selectedStreamIndex, setSelectedStreamIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    // Fetch match details on component mount
    useEffect(() => {
        const fetchMatch = async () => {
            const matchData = await getMatchDetails(id);
            if (!matchData) {
                notFound();
            }
            setMatch(matchData);
            setLoading(false);
        };
        fetchMatch();
    }, [id]);

    if (loading || !match) {
        return (
            <div className="container py-8">
                <div className={styles.loading}>Loading match details...</div>
            </div>
        );
    }

    const streams = match.streams || [];
    const selectedStream = streams[selectedStreamIndex];

    return (
        <div className="container py-8">
            <div className={styles.matchHeader}>
                <div className={styles.teams}>
                    <div className={styles.team}>
                        {match.teams.home.logoUrl && <img src={`https://api.watchfooty.st${match.teams.home.logoUrl}`} alt={match.teams.home.name} className={styles.teamLogoBig} />}
                        <h2 className={styles.teamName}>{match.teams.home.name}</h2>
                    </div>
                    <div className={styles.vsInfo}>
                        <span className={styles.vsText}>VS</span>
                        <span className={styles.matchTime}>{format(new Date(match.date), 'HH:mm')}</span>
                        <span className={styles.matchDate}>{format(new Date(match.date), 'MMM d, yyyy')}</span>
                    </div>
                    <div className={styles.team}>
                        {match.teams.away.logoUrl && <img src={`https://api.watchfooty.st${match.teams.away.logoUrl}`} alt={match.teams.away.name} className={styles.teamLogoBig} />}
                        <h2 className={styles.teamName}>{match.teams.away.name}</h2>
                    </div>
                </div>
            </div>

            {streams.length > 0 && (
                <div className={styles.streamSelector}>
                    <span className={styles.streamLabel}>Select Stream:</span>
                    <div className={styles.streamButtons}>
                        {streams.map((stream: any, index: number) => (
                            <button
                                key={stream.id}
                                onClick={() => setSelectedStreamIndex(index)}
                                className={`${styles.streamButton} ${index === selectedStreamIndex ? styles.active : ''}`}
                            >
                                Stream {index + 1} ({stream.quality})
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className={styles.playerContainer}>
                {selectedStream ? (
                    <iframe
                        key={selectedStream.id}
                        src={selectedStream.url}
                        className={styles.iframe}
                        allowFullScreen
                        scrolling="no"
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                    ></iframe>
                ) : (
                    <div className={styles.noStream}>
                        <p>Stream not available yet. Please check back closer to match time.</p>
                    </div>
                )}
            </div>

            <div className={styles.details}>
                <div className={styles.detailItem}>
                    <Shield size={20} className="text-yellow-600" />
                    <span>{match.league}</span>
                </div>
                {match.venue && (
                    <div className={styles.detailItem}>
                        <MapPin size={20} className="text-blue-500" />
                        <span>{match.venue}</span>
                    </div>
                )}
                <div className={styles.detailItem}>
                    <Calendar size={20} className="text-green-500" />
                    <span>{format(new Date(match.date), 'EEEE, MMMM d, yyyy')}</span>
                </div>
            </div>
        </div>
    );
}
