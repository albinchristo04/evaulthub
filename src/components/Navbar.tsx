
import Link from 'next/link';
import { getSports } from '@/lib/api';
import { Search, MonitorPlay, MessageCircle } from 'lucide-react';
import styles from './Navbar.module.css';

export default async function Navbar() {
    const sports = await getSports();
    // Filter to show top 5-6 sports, put rest in "More" if needed, but for now just list them
    // The design shows: Football, Hockey, Baseball, Basketball, Racing, More
    const mainSports = sports.slice(0, 5);

    return (
        <header className={styles.header}>
            <div className={`container ${styles.container}`}>
                <Link href="/" className={styles.logo}>
                    <MonitorPlay className={styles.logoIcon} />
                    <span>Watch Footy</span>
                </Link>

                <nav className={styles.nav}>
                    {mainSports.map((sport) => (
                        <Link key={sport.name} href={`/${sport.name}`} className={styles.navLink}>
                            {sport.displayName}
                        </Link>
                    ))}
                    <Link href="/sports" className={styles.navLink}>More</Link>
                </nav>

                <div className={styles.actions}>
                    <div className={styles.search}>
                        <Search size={18} className={styles.searchIcon} />
                        <input type="text" placeholder="Search.." className={styles.searchInput} />
                        <span className={styles.kbd}>⌘ K</span>
                    </div>
                    <Link href="/multi-stream" className="btn btn-primary text-sm">
                        Multi Stream
                    </Link>
                    <a href="https://discord.gg/T38kUWZHtB" target="_blank" rel="noreferrer" className={styles.iconBtn}>
                        <MessageCircle size={20} />
                    </a>
                </div>
            </div>
        </header>
    );
}
