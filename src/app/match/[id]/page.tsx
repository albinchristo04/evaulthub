
import { getMatchDetails } from '@/lib/api';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import { Shield, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';

export const runtime = 'edge';

interface MatchPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function MatchPage({ params }: MatchPageProps) {
    const { id } = await params;
    const match = await getMatchDetails(id);

    if (!match) {
        notFound();
    }

    const stream = match.streams && match.streams.length > 0 ? match.streams[0] : null;

    return (
        <div className="container py-8">
            <div className={styles.matchHeader}>
                <div className={styles.teams}>
                    <div className={styles.team}>
                        {match.teams.home.logoUrl && <img src={`https://watchfooty.st${match.teams.home.logoUrl}`} alt={match.teams.home.name} className={styles.teamLogoBig} />}
                        <h2 className={styles.teamName}>{match.teams.home.name}</h2>
                    </div>
                    <div className={styles.vsInfo}>
                        <span className={styles.vsText}>VS</span>
                        <span className={styles.matchTime}>{format(new Date(match.date), 'HH:mm')}</span>
                        <span className={styles.matchDate}>{format(new Date(match.date), 'MMM d, yyyy')}</span>
                    </div>
                    <div className={styles.team}>
                        {match.teams.away.logoUrl && <img src={`https://watchfooty.st${match.teams.away.logoUrl}`} alt={match.teams.away.name} className={styles.teamLogoBig} />}
                        <h2 className={styles.teamName}>{match.teams.away.name}</h2>
                    </div>
                </div>
            </div>

            <div className={styles.playerContainer}>
                {stream ? (
                    <iframe
                        src={stream.url}
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
