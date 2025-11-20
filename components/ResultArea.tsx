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

  // Calculate aspect ratio CSS class
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case AspectRatio.PORTRAIT: return 'aspect-[4/5]';
      case AspectRatio.STORY: return 'aspect-[9/16]';
      case AspectRatio.LANDSCAPE: return 'aspect-[16/9]';
      case AspectRatio.WIDE: return 'aspect-[2/1]';
      default: return 'aspect-square';
    }
  };

  const handleDownload = (format: 'png' | 'jpg') => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image; 
    link.download = `venom-studio-${Date.now()}.${format}`;
    link.click();
    setShowDownloadMenu(false);
  };

  if (isProcessing) {
    return (
      <div className={`w-full bg-[#0f0f0f] rounded-3xl border border-studio-accent/20 flex flex-col items-center justify-center relative overflow-hidden ${getAspectRatioClass()} transition-all duration-500`}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#d946ef10_1px,transparent_1px),linear-gradient(to_bottom,#d946ef10_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
        
        <div className="relative z-10 flex flex-col items-center">
            <div className="relative">
                <div className="w-20 h-20 rounded-full border-2 border-studio-accent/20 border-t-studio-accent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-studio-accent/10 rounded-full animate-pulse shadow-neon"></div>
                </div>
            </div>
            <h3 className="text-xl font-bold text-white mt-8 animate-pulse tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-studio-accent to-white">Generating</h3>
            <p className="text-xs font-mono text-studio-accent mt-3 px-6 text-center uppercase tracking-widest opacity-80">{processingStep}</p>
        </div>
      </div>
    );
  }

  if (image) {
    return (
      <div className={`w-full bg-[#0f0f0f] rounded-3xl border border-white/10 flex flex-col items-center justify-center relative overflow-hidden group shadow-2xl ${getAspectRatioClass()} transition-all duration-500`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black/0 to-black/60 z-10 pointer-events-none"></div>
        <img 
            src={image} 
            alt="AI Generated" 
            className="w-full h-full object-contain z-0" 
        />
        
        <div className="absolute bottom-6 right-6 z-30 flex flex-col items-end">
            {showDownloadMenu && (
                <div className="mb-3 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden w-48 animate-in fade-in slide-in-from-bottom-4">
                    <button onClick={() => handleDownload('png')} className="w-full text-right px-4 py-3 text-xs font-medium hover:bg-studio-accent/20 text-white transition-colors">
                        PNG <span className="opacity-50 text-[10px] mr-1">(High Res)</span>
                    </button>
                    <button onClick={() => handleDownload('jpg')} className="w-full text-right px-4 py-3 text-xs font-medium hover:bg-studio-accent/20 text-white transition-colors">
                        JPG <span className="opacity-50 text-[10px] mr-1">(Web)</span>
                    </button>
                </div>
            )}
            
            <button 
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                className="bg-white text-black hover:bg-studio-accent hover:text-white px-6 py-3 rounded-full text-xs font-bold shadow-glow flex items-center gap-2 transition-all hover:scale-105"
            >
                <span>DOWNLOAD</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-3 h-3 transition-transform ${showDownloadMenu ? 'rotate-180' : ''}`}>
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full bg-[#0f0f0f]/40 rounded-3xl border border-white/5 border-dashed flex flex-col items-center justify-center relative overflow-hidden ${getAspectRatioClass()} transition-all duration-500 group hover:border-white/10`}>
       <div className="text-center p-8 opacity-30 group-hover:opacity-50 transition-opacity">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-2xl flex items-center justify-center rotate-3 group-hover:rotate-6 transition-transform duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
            </div>
       </div>
    </div>
  );
};