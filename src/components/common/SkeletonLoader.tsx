import React from 'react';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-[#0D1322] border border-slate-800/80 rounded-2xl overflow-hidden animate-pulse p-4 space-y-4">
      {/* Thumbnail Skeleton */}
      <div className="w-full aspect-video bg-slate-900 rounded-xl" />
      {/* Meta Row */}
      <div className="flex items-center gap-2">
        <div className="w-16 h-3 bg-slate-800 rounded" />
        <div className="w-8 h-3 bg-slate-800 rounded" />
      </div>
      {/* Title */}
      <div className="w-3/4 h-4 bg-slate-800 rounded" />
      {/* Description */}
      <div className="space-y-1.5">
        <div className="w-full h-3 bg-slate-800/60 rounded" />
        <div className="w-4/5 h-3 bg-slate-800/60 rounded" />
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
        <div className="w-16 h-5 bg-slate-800 rounded" />
        <div className="w-16 h-7 bg-purple-900/40 rounded-lg" />
      </div>
    </div>
  );
};

export const SkeletonList: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  );
};
