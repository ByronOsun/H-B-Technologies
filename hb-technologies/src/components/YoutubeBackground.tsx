'use client';
import { useEffect, useRef } from 'react';
import styles from './HeroSection.module.css';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

interface Props {
  videoId: string;
  startSec: number;
  endSec: number;
}

function loadYTApi(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return;
    if (window.YT?.Player) { resolve(); return; }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { prev?.(); resolve(); };
    if (!document.getElementById('yt-iframe-api')) {
      const s = document.createElement('script');
      s.id = 'yt-iframe-api';
      s.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(s);
    }
  });
}

export default function YoutubeBackground({ videoId, startSec, endSec }: Props) {
  const mountRef  = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let alive = true;

    loadYTApi().then(() => {
      if (!alive || !mountRef.current) return;

      /* Clear any previous player */
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch {}
      }
      const host = document.createElement('div');
      mountRef.current.appendChild(host);

      playerRef.current = new window.YT.Player(host, {
        videoId,
        playerVars: {
          autoplay:        1,
          mute:            1,
          controls:        0,
          disablekb:       1,
          fs:              0,
          iv_load_policy:  3,
          modestbranding:  1,
          rel:             0,
          showinfo:        0,
          start:           startSec,
          playsinline:     1,
          origin:          typeof window !== 'undefined' ? window.location.origin : '',
        },
        events: {
          onReady(e: any) {
            e.target.seekTo(startSec, true);
            e.target.playVideo();

            /* Poll every 150 ms — seek back when we reach endSec */
            timerRef.current = setInterval(() => {
              if (!playerRef.current?.getCurrentTime) return;
              const t: number = playerRef.current.getCurrentTime();
              if (t >= endSec) {
                playerRef.current.seekTo(startSec, true);
              }
            }, 150);
          },
          onStateChange(e: any) {
            /* If the player paused/ended unexpectedly, restart */
            if (e.data === 0 || e.data === 2) {
              e.target.seekTo(startSec, true);
              e.target.playVideo();
            }
          },
        },
      });
    });

    return () => {
      alive = false;
      if (timerRef.current) clearInterval(timerRef.current);
      try { playerRef.current?.destroy(); } catch {}
      playerRef.current = null;
    };
  }, [videoId, startSec, endSec]);

  return <div ref={mountRef} className={styles.ytWrap} />;
}
