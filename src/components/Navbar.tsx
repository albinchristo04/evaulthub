import { Link } from 'react-router-dom';
import { MonitorPlay } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <header className={styles.header}>
            <div className={`container ${styles.container}`}>
                <Link to="/" className={styles.logo}>
                    <MonitorPlay className={styles.logoIcon} size={28} />
                    <span>EvaultHub</span>
                </Link>
            </div>
        </header>
    );
}
