
'use client';

import Link from 'next/link';
import { Match } from '@/lib/api';
import { PlayCircle, Calendar, Clock } from 'lucide-react';
import styles from './MatchCard.module.css';
import { useEffect, useState } from 'react';

interface MatchCardProps {
    match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
    const [localTime, setLocalTime] = useState<string>('');
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        const date = new Date(match.date);
        setLocalTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

        // Simple check for live status based on common API responses
        // This might need adjustment based on actual API values
        const status = match.status?.toLowerCase() || '';
        const isLiveStatus = status.includes("'") ||
            status === 'live' ||
            status === 'ht' ||
            (status !== 'ns' && status !== 'ft' && status !== 'postponed' && !status.includes(':'));
        setIsLive(isLiveStatus);
    }, [match.date, match.status]);

    return (
        <Link href={`/match/${match.matchId}`} className={styles.card}>
            <div className={styles.imageContainer}>
                {match.poster ? (
                    <img src={`https://watchfooty.st${match.poster}`} alt={match.title} className={styles.poster} />
                ) : (
                    <div className={styles.placeholder} />
                )}

                <div className={styles.overlay}>
                    <div className={`${styles.statusBadge} ${isLive ? styles.live : ''}`}>
                        {isLive ? (
                            <>
                                <span className={styles.pulsingDot}></span>
                                LIVE
                            </>
                        ) : (
                            <>
                                <Clock size={12} />
                                {localTime || match.status}
                            </>
                        )}
                    </div>
                </div>

                <div className={styles.teamsOverlay}>
                    <div className={styles.team}>
                        <div className={styles.logoWrapper}>
                            {match.teams.home.logoUrl ? (
                                <img src={`https://watchfooty.st${match.teams.home.logoUrl}`} alt={match.teams.home.name} className={styles.teamLogo} />
                            ) : (
                                <div className={styles.logoPlaceholder}>{match.teams.home.name.substring(0, 2)}</div>
                            )}
                        </div>
                        <span className={styles.teamName}>{match.teams.home.name}</span>
                    </div>

                    <div className={styles.vsContainer}>
                        <span className={styles.vs}>VS</span>
                    </div>

                    <div className={styles.team}>
                        <div className={styles.logoWrapper}>
                            {match.teams.away.logoUrl ? (
                                <img src={`https://watchfooty.st${match.teams.away.logoUrl}`} alt={match.teams.away.name} className={styles.teamLogo} />
                            ) : (
                                <div className={styles.logoPlaceholder}>{match.teams.away.name.substring(0, 2)}</div>
                            )}
                        </div>
                        <span className={styles.teamName}>{match.teams.away.name}</span>
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>{match.title}</h3>
                <div className={styles.meta}>
                    <span className={styles.league}>{match.league}</span>
                    {match.sport && <span className={styles.sportTag}>{match.sport}</span>}
                </div>
            </div>
        </Link>
    );
}
