'use client';

import Link from 'next/link';
import { Match } from '@/lib/api';
import { Clock } from 'lucide-react';
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
        let date: Date;
        if (match.timestamp) {
            const timestamp = match.timestamp < 10000000000 ? match.timestamp * 1000 : match.timestamp;
            date = new Date(timestamp);
        } else {
            date = new Date(match.date);
        }

        setLocalTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

        const status = match.status?.toLowerCase() || '';
        const currentMinute = match.currentMinute?.toLowerCase() || '';

        const hasMinuteMarker = (str: string) => /\d+['′]/.test(str);
        const isLiveStatus =
            status === 'live' ||
            status === 'in' ||
            status === 'ht' ||
            hasMinuteMarker(status) ||
            hasMinuteMarker(currentMinute);

        setIsLive(isLiveStatus);

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
                        setTimeUntilMatch(`${days}d ${hours}h`);
                    } else if (hours > 0) {
                        setTimeUntilMatch(`${hours}h ${minutes}m`);
                    } else if (minutes > 0) {
                        setTimeUntilMatch(`${minutes}m`);
                    } else {
                        setTimeUntilMatch('Soon');
                    }
                } else {
                    setTimeUntilMatch('');
                }
            };

            updateCountdown();
            const interval = setInterval(updateCountdown, 60000);
            return () => clearInterval(interval);
        }
    }, [match.date, match.status, match.timestamp, match.currentMinute]);

    const title = match.title || `${match.teams?.home?.name || 'Home'} vs ${match.teams?.away?.name || 'Away'}`;

    return (
        <Link href={`/match/${match.matchId}`} className={styles.card}>
            <div className={styles.imageContainer}>
                {match.poster ? (
                    <img src={`https://api.watchfooty.st${match.poster}`} alt={title} className={styles.poster} />
                ) : (
                    <div className={styles.fallbackThumbnail}>
                        {match.teams?.home?.logoUrl && (
                            <img src={`https://api.watchfooty.st${match.teams.home.logoUrl}`} alt={match.teams.home.name} className={styles.fallbackLogo} />
                        )}
                        <span className={styles.fallbackVs}>VS</span>
                        {match.teams?.away?.logoUrl && (
                            <img src={`https://api.watchfooty.st${match.teams.away.logoUrl}`} alt={match.teams.away.name} className={styles.fallbackLogo} />
                        )}
                    </div>
                )}

                <div className={styles.overlay}>
                    <div className={`${styles.statusBadge} ${isLive ? styles.live : ''}`}>
                        {isLive ? (
                            <>
                                <span className={styles.pulsingDot}></span>
                                {match.currentMinute || 'LIVE'}
                            </>
                        ) : match.status === 'FT' || match.status === 'post' ? (
                            'FT'
                        ) : (
                            timeUntilMatch || localTime
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                <div className={styles.meta}>
                    <span>{match.sport || 'Sport'}</span>
                    <span className={styles.separator}></span>
                    <span>{localTime}</span>
                </div>
            </div>
        </Link>
    );
}
