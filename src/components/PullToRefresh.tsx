import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { RefreshCw, ArrowDown } from 'lucide-react';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void> | void;
  isRefreshing?: boolean;
}

const PULL_THRESHOLD = 70; // pixels to trigger refresh
const MAX_PULL_DISTANCE = 110; // max stretch distance

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  isRefreshing = false,
}) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [internalRefreshing, setInternalRefreshing] = useState(false);
  const startYRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeRefreshing = isRefreshing || internalRefreshing;

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    // Only allow pull-to-refresh if the container is scrolled to the very top
    if (containerRef.current && containerRef.current.scrollTop > 5) {
      return;
    }
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    startYRef.current = clientY;
    isDraggingRef.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDraggingRef.current || startYRef.current === null || activeRefreshing) return;

    if (containerRef.current && containerRef.current.scrollTop > 5) {
      startYRef.current = null;
      isDraggingRef.current = false;
      setPullDistance(0);
      return;
    }

    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const diff = clientY - startYRef.current;

    if (diff > 0) {
      // Apply elastic damping resistance
      const dampedDistance = Math.min(diff * 0.45, MAX_PULL_DISTANCE);
      setPullDistance(dampedDistance);
    } else {
      setPullDistance(0);
    }
  };

  const handleTouchEnd = async () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    startYRef.current = null;

    if (pullDistance >= PULL_THRESHOLD && !activeRefreshing) {
      setInternalRefreshing(true);
      setPullDistance(50); // Keep at resting loading height during refresh

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate(30);
        } catch {
          // ignore
        }
      }

      try {
        await Promise.resolve(onRefresh());
      } finally {
        setTimeout(() => {
          setInternalRefreshing(false);
          setPullDistance(0);
        }, 600);
      }
    } else {
      setPullDistance(0);
    }
  };

  useEffect(() => {
    if (!activeRefreshing && !isDraggingRef.current) {
      setPullDistance(0);
    }
  }, [activeRefreshing]);

  const progress = Math.min(pullDistance / PULL_THRESHOLD, 1);
  const isReadyToRelease = pullDistance >= PULL_THRESHOLD;

  return (
    <div
      ref={containerRef}
      id="pull-to-refresh-container"
      className="relative overflow-y-auto w-full h-full flex flex-col scroll-smooth overscroll-contain"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
    >
      {/* Pull / Refresh Indicator Header */}
      <div
        id="pull-indicator-banner"
        className="w-full flex items-center justify-center pointer-events-none transition-all duration-200 overflow-hidden"
        style={{
          height: `${pullDistance}px`,
          opacity: pullDistance > 10 ? 1 : 0,
        }}
      >
        <div className="flex items-center space-x-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-gray-200/80 text-xs font-semibold text-slate-800">
          {activeRefreshing ? (
            <>
              <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
              <span className="text-emerald-700">Updating live earnings...</span>
            </>
          ) : (
            <>
              <div
                className="transition-transform duration-200 text-slate-600"
                style={{
                  transform: `rotate(${progress * 180}deg)`,
                }}
              >
                <ArrowDown className="w-4 h-4 text-emerald-600" />
              </div>
              <span className={isReadyToRelease ? 'text-emerald-600 font-bold' : 'text-slate-600'}>
                {isReadyToRelease ? 'Release to refresh' : 'Swipe down to refresh'}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full">{children}</div>
    </div>
  );
};
