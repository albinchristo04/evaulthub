
import Link from 'next/link';
import { Match } from '@/lib/api';
import { PlayCircle } from 'lucide-react';
import styles from './MatchCard.module.css';

interface MatchCardProps {
    match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
    const date = new Date(match.date);
    const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

    return (
        <Link href={`/match/${match.matchId}`} className={styles.card}>
            <div className={styles.imageContainer}>
                {/* Use poster if available, otherwise a default gradient or pattern */}
                {match.poster ? (
                    <img src={`https://watchfooty.st${match.poster}`} alt={match.title} className={styles.poster} />
                ) : (
                    <div className={styles.placeholder} />
                )}
                <div className={styles.overlay}>
                    <div className={styles.timeBadge}>{time}</div>
                    <div className={styles.brandBadge}>
                        <PlayCircle size={14} /> Watch Footy
                    </div>
                </div>

                <div className={styles.teamsOverlay}>
                    <div className={styles.team}>
                        {match.teams.home.logoUrl && <img src={`https://watchfooty.st${match.teams.home.logoUrl}`} alt={match.teams.home.name} className={styles.teamLogo} />}
                        {/* <span className={styles.teamName}>{match.teams.home.name}</span> */}
                    </div>
                    <div className={styles.vs}>VS</div>
                    <div className={styles.team}>
                        {match.teams.away.logoUrl && <img src={`https://watchfooty.st${match.teams.away.logoUrl}`} alt={match.teams.away.name} className={styles.teamLogo} />}
                        {/* <span className={styles.teamName}>{match.teams.away.name}</span> */}
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>{match.title}</h3>
                <p className={styles.league}>{match.league}</p>
            </div>
        </Link>
    );
}
