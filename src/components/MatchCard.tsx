import { Link } from 'react-router-dom';
import { Match } from '@/utils/api';
import { format, isToday, isTomorrow } from 'date-fns';
import styles from './MatchCard.module.css';

interface MatchCardProps {
    match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
    const matchDate = new Date(match.date);
    const isLive = match.status?.toLowerCase().includes("'") ||
        match.status === 'LIVE' ||
        match.status === 'HT';

    let timeString = '';
    if (isToday(matchDate)) {
        timeString = format(matchDate, 'HH:mm');
    } else if (isTomorrow(matchDate)) {
        timeString = `Tmrw ${format(matchDate, 'HH:mm')}`;
    } else {
        timeString = format(matchDate, 'MMM d, HH:mm');
    }

    const baseImageUrl = 'https://api.watchfooty.st';

    return (
        <Link to={`/match/${match.matchId}`} className={styles.card}>
            <div className={styles.imageContainer}>
                {match.poster ? (
                    <img
                        src={`${baseImageUrl}${match.poster}`}
                        alt={match.title}
                        className={styles.poster}
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                ) : (
                    <div className={styles.fallbackThumbnail}>
                        {match.teams?.home?.logoUrl && (
                            <img
                                src={`${baseImageUrl}${match.teams.home.logoUrl}`}
                                alt={match.teams.home.name}
                                className={styles.fallbackLogo}
                            />
                        )}
                        <span className={styles.fallbackVs}>VS</span>
                        {match.teams?.away?.logoUrl && (
                            <img
                                src={`${baseImageUrl}${match.teams.away.logoUrl}`}
                                alt={match.teams.away.name}
                                className={styles.fallbackLogo}
                            />
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
                        ) : (
                            timeString
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>{match.title}</h3>
                <div className={styles.meta}>
                    <span>{match.sport}</span>
                    <span className={styles.separator}></span>
                    <span>{timeString}</span>
                </div>
            </div>
        </Link>
    );
}
