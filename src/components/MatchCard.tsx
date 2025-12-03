
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

    const [timeUntilMatch, setTimeUntilMatch] = useState<string>('');

    useEffect(() => {
        // Use timestamp if available for accurate time, otherwise fallback to date string
        let date: Date;
        if (match.timestamp) {
            // Check if timestamp is in seconds or milliseconds
            const timestamp = match.timestamp < 10000000000 ? match.timestamp * 1000 : match.timestamp;
            date = new Date(timestamp);
        } else {
            date = new Date(match.date);
        }

        setLocalTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

        // More accurate live status detection
        const status = match.status?.toLowerCase() || '';
        const currentMinute = match.currentMinute?.toLowerCase() || '';

        // A match is live if:
        // 1. Status is explicitly "live", "in", or "ht" (halftime)
        // 2. currentMinute contains a minute marker like "45'" or "90+2'"
        // 3. Status contains a minute marker
        const hasMinuteMarker = (str: string) => /\d+['′]/.test(str);
        const isLiveStatus =
            status === 'live' ||
            status === 'in' ||
            status === 'ht' ||
            hasMinuteMarker(status) ||
            hasMinuteMarker(currentMinute);

        setIsLive(isLiveStatus);

        // Calculate time until match for upcoming matches
        if (!isLiveStatus && status !== 'ft' && status !== 'post') {
            const updateCountdown = () => {
                const now = new Date().getTime();
                const matchTime = date.getTime();
                const diff = matchTime - now;

                if (diff > 0) {
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

                    if (days > 0) {
                        setTimeUntilMatch(`in ${days}d ${hours}h`);
                    } else if (hours > 0) {
                        setTimeUntilMatch(`in ${hours}h ${minutes}m`);
                    } else if (minutes > 0) {
                        setTimeUntilMatch(`in ${minutes}m`);
                    } else {
                        setTimeUntilMatch('Starting soon');
                    }
                } else {
                    setTimeUntilMatch('');
                }
            };

            updateCountdown();
            const interval = setInterval(updateCountdown, 60000); // Update every minute
            return () => clearInterval(interval);
        }
    }, [match.date, match.status, match.timestamp, match.currentMinute]);

    return (
        <Link href={`/match/${match.matchId}`} className={styles.card}>
            <div className={styles.imageContainer}>
                {match.poster ? (
                    <img src={`https://api.watchfooty.st${match.poster}`} alt={match.title} className={styles.poster} />
                ) : (
                    <div className={styles.placeholder} />
                )}

                <div className={styles.overlay}>
                    <div className={`${styles.statusBadge} ${isLive ? styles.live : ''}`}>
                        {isLive ? (
                            <>
                                <span className={styles.pulsingDot}></span>
                                {match.currentMinute || 'LIVE'}
                            </>
                        ) : match.status === 'FT' || match.status === 'post' ? (
                            <>
                                FT
                            </>
                        ) : (
                            <>
                                <Clock size={12} />
                                {timeUntilMatch || localTime}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.meta}>
                    <span className={styles.league}>{match.league}</span>
                    {match.sport && <span className={styles.sportTag}>{match.sport}</span>}
                </div>

                <div className={styles.teamsContainer}>
                    <div className={styles.team}>
                        <div className={styles.logoWrapper}>
                            {match.teams?.home?.logoUrl ? (
                                <img src={`https://api.watchfooty.st${match.teams.home.logoUrl}`} alt={match.teams.home.name} className={styles.teamLogo} />
                            ) : (
                                <div className={styles.logoPlaceholder}>{match.teams?.home?.name?.substring(0, 2) || 'H'}</div>
                            )}
                        </div>
                        <span className={styles.teamName}>{match.teams?.home?.name || 'Home'}</span>
                    </div>

                    <div className={styles.vsContainer}>
                        <span className={styles.vs}>VS</span>
                    </div>

                    <div className={styles.team}>
                        <div className={styles.logoWrapper}>
                            {match.teams?.away?.logoUrl ? (
                                <img src={`https://api.watchfooty.st${match.teams.away.logoUrl}`} alt={match.teams.away.name} className={styles.teamLogo} />
                            ) : (
                                <div className={styles.logoPlaceholder}>{match.teams?.away?.name?.substring(0, 2) || 'A'}</div>
                            )}
                        </div>
                        <span className={styles.teamName}>{match.teams?.away?.name || 'Away'}</span>
                    </div>
                </div>

                {/* <h3 className={styles.title}>{match.title}</h3> */}
            </div>
        </Link>
    );
}
