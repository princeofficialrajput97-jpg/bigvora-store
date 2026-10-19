import React from 'react';

export const getYouTubeVideoId = (url?: string): string | null => {
  if (!url) return null;
  // Match youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

export const getYouTubeEmbedUrl = (url?: string): string | null => {
  const id = getYouTubeVideoId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=0&rel=0&modestbranding=1` : null;
};

export const isYouTubeUrl = (url?: string): boolean => {
  return !!getYouTubeVideoId(url);
};

interface VideoEmbedPlayerProps {
  url: string;
  title?: string;
  autoPlay?: boolean;
  className?: string;
}

export const VideoEmbedPlayer: React.FC<VideoEmbedPlayerProps> = ({ 
  url, 
  title = 'Video Preview', 
  autoPlay = false,
  className = '' 
}) => {
  const youtubeEmbed = getYouTubeEmbedUrl(url);

  if (youtubeEmbed) {
    const embedWithAutoplay = autoPlay ? `${youtubeEmbed}&autoplay=1` : youtubeEmbed;
    return (
      <div className={`relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl ${className}`}>
        <iframe
          src={embedWithAutoplay}
          title={title}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  // Fallback to HTML5 native video player for MP4 / WebM / Direct Links
  return (
    <div className={`relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl ${className}`}>
      <video
        src={url}
        controls
        autoPlay={autoPlay}
        playsInline
        className="w-full h-full object-contain"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};
