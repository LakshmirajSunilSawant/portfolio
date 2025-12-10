import { useEffect, useState } from 'react';

interface TrailPoint {
    x: number;
    y: number;
    opacity: number;
}

export const CursorTrail = () => {
    const [trail, setTrail] = useState<TrailPoint[]>([]);

    useEffect(() => {
        let animationFrameId: number;
        const maxTrailLength = 20;

        const handleMouseMove = (e: MouseEvent) => {
            setTrail(prevTrail => {
                const newPoint = { x: e.clientX, y: e.clientY, opacity: 1 };
                const newTrail = [newPoint, ...prevTrail].slice(0, maxTrailLength);
                return newTrail;
            });
        };

        const fadeTrail = () => {
            setTrail(prevTrail =>
                prevTrail
                    .map(point => ({ ...point, opacity: point.opacity - 0.05 }))
                    .filter(point => point.opacity > 0)
            );
            animationFrameId = requestAnimationFrame(fadeTrail);
        };

        window.addEventListener('mousemove', handleMouseMove);
        animationFrameId = requestAnimationFrame(fadeTrail);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-50">
            {trail.map((point, index) => (
                <div
                    key={index}
                    className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                        left: `${point.x}px`,
                        top: `${point.y}px`,
                        opacity: point.opacity * 0.6,
                        transform: `translate(-50%, -50%) scale(${1 - index / trail.length})`,
                    }}
                />
            ))}
        </div>
    );
};
