import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-5 px-6 flex justify-between items-center bg-[#0f0f0f]/90 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-studio-gradient flex items-center justify-center shadow-neon relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white relative z-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
            </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-wider text-white font-sans flex items-center gap-2">
            DEVPRO <span className="text-transparent bg-clip-text bg-studio-gradient drop-shadow-lg">STUDIO</span>
          </h1>
          <p className="text-[10px] text-studio-accent font-medium tracking-[0.1em] opacity-80">محترف البرمجيات - AI GENERATION</p>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-3">
         <div className="bg-white/5 border border-white/5 px-3 py-1 rounded-full text-[10px] font-mono text-studio-muted flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-studio-success animate-pulse"></span>
            V 2.0 ONLINE
         </div>
      </div>
    </header>
  );
};