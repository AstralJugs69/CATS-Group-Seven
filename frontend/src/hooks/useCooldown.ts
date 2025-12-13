import { useState, useEffect } from 'react';

export function useCooldown(key: string, durationMs: number = 120000) {
    const [remainingTime, setRemainingTime] = useState<number>(0);
    const isActive = remainingTime > 0;

    // Load start time from local storage on mount
    useEffect(() => {
        const storedStartTime = localStorage.getItem(`cooldown_${key}`);
        if (storedStartTime) {
            const startTime = parseInt(storedStartTime, 10);
            const elapsed = Date.now() - startTime;

            if (elapsed < durationMs) {
                setRemainingTime(durationMs - elapsed);
            } else {
                localStorage.removeItem(`cooldown_${key}`);
            }
        }
    }, [key, durationMs]);

    // Timer tick
    useEffect(() => {
        if (!isActive) return;

        const interval = setInterval(() => {
            setRemainingTime((prev) => {
                const newTime = prev - 1000;
                if (newTime <= 0) {
                    localStorage.removeItem(`cooldown_${key}`);
                    return 0;
                }
                return newTime;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, key]);

    const startCooldown = () => {
        const now = Date.now();
        localStorage.setItem(`cooldown_${key}`, now.toString());
        setRemainingTime(durationMs);
    };

    const formatTime = (ms: number) => {
        const totalSeconds = Math.ceil(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return { isActive, remainingTime, startCooldown, formatTime };
}
