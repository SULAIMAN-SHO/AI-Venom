

import React, { useState } from 'react';
import { AspectRatio } from '../types';

interface ResultAreaProps {
  image: string | null;
  isProcessing: boolean;
  processingStep: string;
  aspectRatio?: AspectRatio;
}

export const ResultArea: React.FC<ResultAreaProps> = ({ image, isProcessing, processingStep, aspectRatio = AspectRatio.SQUARE }) => {
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const handleDownload = (format: 'png' | 'jpg') => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image; 
    link.download = `venom-royal-${Date.now()}.${format}`;
    link.click();
    setShowDownloadMenu(false);
  };

  if (isProcessing) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-studio-base/50 rounded-xl">
        <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
        
        <div className="relative z-10 flex flex-col items-center">
            {/* Platinum Loading Spinner */}
            <div className="w-24 h-24 rounded-full border-4 border-studio-panel border-t-white animate-spin mb-8 shadow-[0_0_20px_rgba(255,255,255,0.1)]"></div>
            
            <h3 className="text-xl font-bold text-white tracking-widest uppercase animate-pulse">Creating Magic</h3>
            <p className="text-xs font-mono text-white/70 mt-2 px-6 text-center uppercase tracking-wider bg-studio-panel/80 py-1 rounded-full border border-white/10">{processingStep}</p>
        </div>
      </div>
    );
  }

  if (image) {
    return (
      <div className="w-full h-full flex items-center justify-center relative bg-studio-base/50 rounded-xl overflow-hidden">
        {/* Checkerboard pattern for transparency */}
        <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }}></div>

        <img 
            src={image} 
            alt="AI Generated" 
            className="max-w-full max-h-full object-contain z-10 shadow-2xl drop-shadow-2xl" 
        />
        
        <div className="absolute bottom-6 right-6 z-30 flex flex-col items-end">
            {showDownloadMenu && (
                <div className="mb-2 bg-studio-panel border border-studio-border p-1 shadow-xl w-32 rounded-lg overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                    <button onClick={() => handleDownload('png')} className="w-full text-right px-4 py-3 text-xs font-medium hover:bg-white hover:text-black text-white transition-colors uppercase">
                        PNG (HD)
                    </button>
                    <button onClick={() => handleDownload('jpg')} className="w-full text-right px-4 py-3 text-xs font-medium hover:bg-white hover:text-black text-white transition-colors uppercase border-t border-white/5">
                        JPG (Web)
                    </button>
                </div>
            )}
            
            <button 
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                className="bg-white text-black hover:bg-slate-200 hover:scale-105 px-6 py-3 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.3)] text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2"
            >
                <span>Download</span>
                <span className="text-lg leading-none">↓</span>
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-studio-base/30 rounded-xl border border-white/5">
       <div className="text-center p-8 opacity-40">
            <div className="w-16 h-16 border-2 border-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">✨</span>
            </div>
            <p className="text-white text-xs tracking-[0.2em] uppercase font-bold">Result Will Appear Here</p>
       </div>
    </div>
  );
};