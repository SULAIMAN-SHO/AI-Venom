import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full h-[80px] px-8 flex justify-between items-center bg-studio-panel border-b border-studio-accent/20 shadow-luxury z-50">
      <div className="flex items-center gap-5">
        {/* Logo Icon */}
        <div className="w-12 h-12 bg-gradient-to-br from-studio-accent to-yellow-600 rounded-xl shadow-gold-glow flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform duration-300">
            <span className="text-black font-bold text-2xl font-serif">V</span>
        </div>
        
        <div className="flex flex-col justify-center">
          <h1 className="text-2xl font-bold tracking-wider text-white uppercase drop-shadow-md">
            Venom <span className="text-studio-accent">Studio</span>
          </h1>
          <p className="text-[11px] text-studio-secondary tracking-[0.2em] font-medium uppercase">
            Professional AI Photography
          </p>
        </div>
      </div>
      
      <div className="hidden md:flex items-center gap-4 bg-studio-base/50 px-6 py-2 rounded-full border border-white/5">
         <div className="flex flex-col items-end">
             <span className="text-[10px] text-studio-secondary uppercase tracking-wider">Status</span>
             <span className="text-xs font-bold text-green-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Online
             </span>
         </div>
      </div>
    </header>
  );
};