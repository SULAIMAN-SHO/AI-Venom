

import React, { useRef, useState } from 'react';
import { StylePreset } from '../types';

interface UploadAreaProps {
  images: string[];
  onImagesChange: (newImages: string[]) => void;
  onClear: () => void;
  selectedStyle?: StylePreset;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ images, onImagesChange, onClear, selectedStyle }) => {
  const [slotCount, setSlotCount] = useState<number>(1);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isTextMode = selectedStyle === StylePreset.IMAGINE_V5 || selectedStyle === StylePreset.PURE_CREATION;
  const isCrazyMode = selectedStyle === StylePreset.IMAGINE_V5;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...images];
        // Ensure array is big enough
        while (newImages.length <= index) newImages.push(""); 
        newImages[index] = reader.result as string;
        onImagesChange(newImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSlot = (index: number, e: React.MouseEvent) => {
      e.stopPropagation();
      const newImages = [...images];
      newImages.splice(index, 1);
      onImagesChange(newImages);
  };

  const triggerUpload = (index: number) => {
    if (isTextMode) return; 
    fileInputRefs.current[index]?.click();
  };

  const setSlots = (count: number) => {
      setSlotCount(count);
      // Optional: trim images if reducing count? Or keep them. Let's keep them in memory but hide UI.
  }

  // Text Mode UI
  if (isTextMode) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-studio-base/50 rounded-xl relative overflow-hidden group border-2 border-dashed border-studio-border hover:border-slate-300 transition-colors">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)] opacity-50"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center p-8">
                <div className="w-20 h-20 bg-studio-panel rounded-full flex items-center justify-center mb-4 shadow-lg border border-white/5">
                    <span className="text-4xl">{isCrazyMode ? '🌌' : '🎨'}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wider">
                    {isCrazyMode ? 'Creation from Scratch' : 'Realistic Scene'}
                </h3>
                <p className="text-studio-secondary text-xs max-w-xs">
                   Image upload is disabled.<br/>Describe your vision in the prompt bar above.
                </p>
            </div>
        </div>
      );
  }

  // Grid Mode UI
  return (
    <div className="w-full h-full flex flex-col gap-2">
        
        {/* Slot Selector Header */}
        <div className="flex justify-between items-center px-2">
             <span className="text-[10px] uppercase font-bold text-studio-secondary tracking-widest">Original Images (Angles)</span>
             <div className="flex bg-studio-base border border-white/5 rounded-lg p-1 gap-1">
                {[1, 2, 3, 4].map(n => (
                    <button 
                        key={n}
                        onClick={() => setSlots(n)}
                        className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold transition-all ${slotCount === n ? 'bg-studio-accent text-black shadow-gold-glow' : 'text-white/30 hover:bg-white/5'}`}
                    >
                        {n}
                    </button>
                ))}
             </div>
        </div>

        {/* Dynamic Grid */}
        <div className={`flex-1 grid gap-3 ${
            slotCount === 1 ? 'grid-cols-1' : 
            slotCount === 2 ? 'grid-cols-2' : 
            'grid-cols-2 grid-rows-2' // 3 and 4 fit in 2x2
        }`}>
            {Array.from({ length: slotCount }).map((_, index) => {
                const image = images[index];
                return (
                    <div 
                        key={index}
                        onClick={() => triggerUpload(index)}
                        className="w-full h-full bg-studio-base/50 rounded-xl flex flex-col items-center justify-center relative group border-2 border-dashed border-studio-border hover:border-studio-accent/50 hover:bg-white/5 transition-all overflow-hidden cursor-pointer"
                    >
                        {image ? (
                            <>
                                <div className="absolute inset-0 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:20px_20px] opacity-5"></div>
                                <img 
                                    src={image} 
                                    alt={`Slot ${index + 1}`} 
                                    className="w-full h-full object-contain p-2 z-10 relative" 
                                />
                                <button 
                                    onClick={(e) => clearSlot(index, e)}
                                    className="absolute top-2 right-2 z-20 bg-red-500/80 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md backdrop-blur-md text-xs"
                                >
                                    ✕
                                </button>
                                <span className="absolute bottom-2 left-2 bg-black/50 text-white text-[9px] px-2 py-1 rounded backdrop-blur">
                                    Angle {index + 1}
                                </span>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-4 z-10 opacity-50 group-hover:opacity-100 transition-opacity">
                                <span className="text-2xl mb-2 text-studio-secondary">+</span>
                                <span className="text-[9px] uppercase tracking-wider text-studio-secondary">Upload Angle {index + 1}</span>
                            </div>
                        )}
                        <input 
                            type="file" 
                            ref={el => fileInputRefs.current[index] = el} 
                            onChange={(e) => handleFileChange(e, index)} 
                            accept="image/*" 
                            className="hidden" 
                        />
                    </div>
                );
            })}
        </div>
        
    </div>
  );
};