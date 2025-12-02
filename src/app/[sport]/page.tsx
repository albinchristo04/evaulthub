
import { getMatches } from '@/lib/api';
import MatchCard from '@/components/MatchCard';
import Link from 'next/link';
import { format, addDays, subDays, parseISO } from 'date-fns';
import styles from './page.module.css';

interface SportPageProps {
    params: Promise<{
        sport: string;
    }>;
    searchParams: Promise<{
        date?: string;
    }>;
}

export default async function SportPage({ params, searchParams }: SportPageProps) {
    const { sport } = await params;
    const { date } = await searchParams;
    const dateStr = date || format(new Date(), 'yyyy-MM-dd');
    const matches = await getMatches(sport, dateStr);

    const currentDate = parseISO(dateStr);
    const yesterday = format(subDays(currentDate, 1), 'yyyy-MM-dd');
    const tomorrow = format(addDays(currentDate, 1), 'yyyy-MM-dd');
    const today = format(new Date(), 'yyyy-MM-dd');

    return (
        <div className="container py-8">
            <div className={styles.header}>
                <h1 className={styles.title}>
                    <span className="capitalize">{sport}</span> Matches
                </h1>

                <div className={styles.dateFilters}>
                    <Link
                        href={`/${sport}?date=${yesterday}`}
                        className={`${styles.dateBtn} ${dateStr === yesterday ? styles.active : ''}`}
                    >
                        Yesterday
                    </Link>
                    <Link
                        href={`/${sport}?date=${today}`}
                        className={`${styles.dateBtn} ${dateStr === today ? styles.active : ''}`}
                    >
                        Today
                    </Link>
                    <Link
                        href={`/${sport}?date=${tomorrow}`}
                        className={`${styles.dateBtn} ${dateStr === tomorrow ? styles.active : ''}`}
                    >
                        Tomorrow
                    </Link>
                    <div className={styles.dateDisplay}>
                        {format(currentDate, 'EEEE, MMMM d, yyyy')}
                    </div>
                </div>
            </div>

            {matches.length === 0 ? (
                <div className={styles.noMatches}>
                    <p>No matches found for this date.</p>
                </div>
            ) : (
                <div className={styles.matchesGrid}>
                    {matches.map((match) => (
                        <MatchCard key={match.matchId} match={match} />
                    ))}
                </div>
            )}
        </div>
    );
}
