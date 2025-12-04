
import styles from './page.module.css';

export default function Loading() {
    return (
        <div className="container py-8">
            <div className={styles.matchHeader}>
                <div className={styles.teams}>
                    <div className={styles.team}>
                        <div className="w-24 h-24 bg-zinc-800 rounded-full animate-pulse mx-auto mb-4" />
                        <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse mx-auto" />
                    </div>
                    <div className={styles.vsInfo}>
                        <div className="h-8 w-16 bg-zinc-800 rounded animate-pulse mx-auto mb-2" />
                        <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse mx-auto" />
                    </div>
                    <div className={styles.team}>
                        <div className="w-24 h-24 bg-zinc-800 rounded-full animate-pulse mx-auto mb-4" />
                        <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse mx-auto" />
                    </div>
                </div>
            </div>

            <div className="w-full aspect-video bg-zinc-800 rounded-xl animate-pulse mb-8" />

            <div className="flex gap-4">
                <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse" />
                <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse" />
                <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse" />
            </div>
        </div>
    );
}
