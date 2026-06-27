'use client';
import { useRef, useState } from 'react';
import { uploadToSupabase } from '@/lib/supabase';
import styles from './SupabaseUploader.module.css';

type Folder = 'hero' | 'team';

interface Props {
  folder: Folder;
  currentUrl?: string;
  onUploaded: (url: string) => void;
  label?: string;
}

export default function SupabaseUploader({ folder, currentUrl, onUploaded, label = 'Image' }: Props) {
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [url, setUrl] = useState(currentUrl ?? '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(currentUrl ?? '');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError('');
    setUploading(true);
    try {
      const publicUrl = await uploadToSupabase(file, folder);
      setPreview(publicUrl);
      setUrl(publicUrl);
      onUploaded(publicUrl);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleUrlSubmit() {
    if (!url.trim()) return;
    setPreview(url.trim());
    onUploaded(url.trim());
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${tab === 'upload' ? styles.active : ''}`}
          onClick={() => setTab('upload')}
        >
          ↑ Upload file
        </button>
        <button
          type="button"
          className={`${styles.tab} ${tab === 'url' ? styles.active : ''}`}
          onClick={() => setTab('url')}
        >
          🔗 Paste URL
        </button>
      </div>

      {tab === 'upload' && (
        <div
          className={styles.dropzone}
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
        >
          {uploading
            ? <span className={styles.hint}>Uploading…</span>
            : <>
                <span className={styles.icon}>📁</span>
                <span className={styles.hint}>Click or drag &amp; drop</span>
                <span className={styles.sub}>JPEG · PNG · WebP · GIF · SVG · MP4 · WebM</span>
              </>}
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            className={styles.hidden}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </div>
      )}

      {tab === 'url' && (
        <div className={styles.urlRow}>
          <input
            type="url"
            className={styles.urlInput}
            placeholder="https://example.com/image.jpg"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleUrlSubmit()}
          />
          <button type="button" className={styles.urlBtn} onClick={handleUrlSubmit}>
            Use
          </button>
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}

      {preview && (
        <div className={styles.preview}>
          <img src={preview} alt={label} className={styles.previewImg} />
          <span className={styles.previewLabel}>{label} preview</span>
        </div>
      )}
    </div>
  );
}
