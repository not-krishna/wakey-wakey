import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

export default function ShareAppButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: 'Wakey Waky',
      text: "Never miss your stop again — Koa's got your back 🐨🚏",
      url: window.location.origin
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Web Share failed:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {
        console.error('Clipboard copy failed:', err);
      }
    }
  };

  return (
    <button onClick={handleShare} className="btn-secondary share-btn">
      {copied ? <Check size={18} /> : <Share2 size={18} />}
      {copied ? 'Link Copied!' : 'Share Wakey Waky'}
      <style>{`
        .share-btn {
          width: 100%;
          min-height: 48px;
        }
      `}</style>
    </button>
  );
}
