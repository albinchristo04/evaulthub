'use client';

import { useRef, useState, MouseEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './DraggableCarousel.module.css';

interface DraggableCarouselProps {
    children: React.ReactNode;
}

export default function DraggableCarousel({ children }: DraggableCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: MouseEvent) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll-fast
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className={styles.wrapper}>
            <button
                className={`${styles.navButton} ${styles.prev}`}
                onClick={() => scroll('left')}
                aria-label="Scroll left"
            >
                <ChevronLeft size={20} />
            </button>

            <div
                className={styles.carousel}
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                {children}
            </div>

            <button
                className={`${styles.navButton} ${styles.next}`}
                onClick={() => scroll('right')}
                aria-label="Scroll right"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
}
