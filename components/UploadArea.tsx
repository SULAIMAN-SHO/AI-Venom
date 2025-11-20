import React, { useRef } from 'react';

interface UploadAreaProps {
  image: string | null;
  onImageUpload: (base64: string) => void;
  onClear: () => void;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ image, onImageUpload, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full h-full min-h-[500px] bg-[#0f0f0f]/60 rounded-3xl border border-white/5 hover:border-studio-accent/40 transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden group shadow-2xl backdrop-blur-sm">
      {image ? (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>
          <img 
            src={image} 
            alt="Original" 
            className="w-full h-full object-contain p-10 z-10 drop-shadow-2xl" 
          />
          <div className="absolute top-4 right-4 z-20">
            <button 
              onClick={onClear}
              className="bg-black/60 hover:bg-red-500/20 text-white/60 hover:text-red-400 p-2.5 rounded-full backdrop-blur-md transition-all border border-white/10 hover:border-red-500/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          </div>
        </>
      ) : (
        <div 
          onClick={triggerUpload}
          className="flex flex-col items-center justify-center cursor-pointer w-full h-full p-8 z-10"
        >
          <div className="relative mb-8 group-hover:scale-105 transition-transform duration-500">
             <div className="absolute inset-0 bg-studio-accent/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
             <div className="w-24 h-24 bg-[#1a1a1a] rounded-full flex items-center justify-center relative border border-white/5 group-hover:border-studio-accent/50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10 text-white/50 group-hover:text-studio-accent transition-colors">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
             </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2 text-center">Upload Person or Product</h3>
          <p className="text-white/40 text-center text-sm">Supports PNG, JPG, WEBP</p>
        </div>
      )}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
    </div>
  );
};