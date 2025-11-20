import React, { useRef } from 'react';
import { StylePreset, CameraAngle, Resolution, LightingPreset, AspectRatio, SocialPlatform, SubjectPose, FaceDirection, STYLE_DEFINITIONS } from '../types';

interface ControlsProps {
  selectedStyle: StylePreset;
  setSelectedStyle: (s: StylePreset) => void;
  selectedAngle: CameraAngle;
  setSelectedAngle: (a: CameraAngle) => void;
  selectedLighting: LightingPreset;
  setSelectedLighting: (l: LightingPreset) => void;
  selectedResolution: Resolution;
  setSelectedResolution: (r: Resolution) => void;
  selectedPose: SubjectPose;
  setSelectedPose: (p: SubjectPose) => void;
  selectedFaceDirection: FaceDirection;
  setSelectedFaceDirection: (f: FaceDirection) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (ar: AspectRatio) => void;
  backgroundColor: string;
  setBackgroundColor: (c: string) => void;
  prompt: string;
  setPrompt: (p: string) => void;
  onGenerate: () => void;
  isProcessing: boolean;
  hasImage: boolean;
  referenceImage: string | null;
  onReferenceUpload: (base64: string) => void;
  onClearReference: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  selectedStyle,
  setSelectedStyle,
  selectedAngle,
  setSelectedAngle,
  selectedLighting,
  setSelectedLighting,
  selectedResolution,
  setSelectedResolution,
  selectedPose,
  setSelectedPose,
  selectedFaceDirection,
  setSelectedFaceDirection,
  aspectRatio,
  setAspectRatio,
  backgroundColor,
  setBackgroundColor,
  prompt,
  setPrompt,
  onGenerate,
  isProcessing,
  hasImage,
  referenceImage,
  onReferenceUpload,
  onClearReference
}) => {
  const refInputRef = useRef<HTMLInputElement>(null);

  const handleRefChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onReferenceUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSocialPreset = (platform: SocialPlatform) => {
    switch (platform) {
      case SocialPlatform.INSTAGRAM_POST: setAspectRatio(AspectRatio.SQUARE); break;
      case SocialPlatform.INSTAGRAM_PORTRAIT: setAspectRatio(AspectRatio.PORTRAIT); break;
      case SocialPlatform.INSTAGRAM_STORY: setAspectRatio(AspectRatio.STORY); break;
      case SocialPlatform.YOUTUBE_THUMBNAIL: 
      case SocialPlatform.TWITTER_POST:
      case SocialPlatform.FACEBOOK_COVER:
        setAspectRatio(AspectRatio.LANDSCAPE); break;
    }
  };

  return (
    <div className="space-y-5 font-sans text-sm" dir="rtl">
      
      {/* Reference Image */}
      <div className="glass-panel p-5 rounded-3xl">
         <div className="flex justify-between items-center mb-3">
            <h3 className="text-[10px] font-bold text-studio-accent uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-3 bg-studio-accent rounded-full"></span>
                استلهام من صورة (Reference)
            </h3>
         </div>
         
         {referenceImage ? (
             <div className="relative w-full h-28 rounded-xl overflow-hidden group border border-white/10">
                 <img src={referenceImage} className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-all duration-500" alt="Ref" />
                 <button 
                    onClick={onClearReference}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-red-500/80 p-1.5 rounded-full text-white transition-colors backdrop-blur-md"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                        <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                    </svg>
                 </button>
             </div>
         ) : (
             <div 
                onClick={() => refInputRef.current?.click()}
                className="w-full h-16 border border-dashed border-white/20 hover:border-studio-accent hover:bg-studio-accent/5 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all group"
             >
                 <span className="text-[10px] text-white/50 group-hover:text-studio-accent transition-colors">اضغط لرفع صورة مرجعية (اختياري)</span>
             </div>
         )}
         <input type="file" ref={refInputRef} onChange={handleRefChange} className="hidden" accept="image/*" />
      </div>

      {/* Social Sizes */}
      <div className="glass-panel p-5 rounded-3xl">
        <h3 className="text-[10px] font-bold text-studio-accent uppercase tracking-widest mb-3 flex items-center gap-2">
           <span className="w-1 h-3 bg-studio-secondary rounded-full"></span>
           مقاسات السوشيال ميديا
        </h3>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
            {[
                { id: SocialPlatform.INSTAGRAM_POST, label: 'بوست انستجرام (1:1)' },
                { id: SocialPlatform.INSTAGRAM_STORY, label: 'ستوري / تيك توك (9:16)' },
                { id: SocialPlatform.YOUTUBE_THUMBNAIL, label: 'يوتيوب (16:9)' },
                { id: SocialPlatform.INSTAGRAM_PORTRAIT, label: 'انستجرام بورتريه (4:5)' },
            ].map((item) => (
                <button
                    key={item.id}
                    onClick={() => handleSocialPreset(item.id)}
                    className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-studio-accent/20 border border-white/5 hover:border-studio-accent/50 transition-all text-right"
                >
                    <span className="text-[10px] font-bold text-white/80 block">{item.label}</span>
                </button>
            ))}
        </div>

        {/* Manual Aspect Ratio & Color */}
        <div className="grid grid-cols-2 gap-3">
            <div className="relative">
                <select 
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                    className="w-full appearance-none bg-black/40 border border-white/10 text-white text-xs rounded-lg p-3 outline-none focus:border-studio-accent transition-colors text-right"
                >
                    {Object.values(AspectRatio).map((ratio) => (
                        <option key={ratio} value={ratio}>{ratio}</option>
                    ))}
                </select>
            </div>

            <div className="relative flex items-center bg-black/40 border border-white/10 rounded-lg px-2 overflow-hidden">
                <input 
                    type="color" 
                    value={backgroundColor || '#000000'}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-6 h-6 rounded border-none bg-transparent cursor-pointer"
                />
                <span className="text-[10px] text-white/50 mr-2 truncate flex-1">
                    {backgroundColor || 'لون الخلفية'}
                </span>
                {backgroundColor && (
                    <button onClick={() => setBackgroundColor('')} className="text-white/50 hover:text-white p-1">✕</button>
                )}
            </div>
        </div>
      </div>

      {/* Prompt */}
      <div className="glass-panel p-5 rounded-3xl">
        <label className="block text-[10px] font-bold text-studio-accent uppercase tracking-widest mb-2 flex items-center gap-2">
           <span className="w-1 h-3 bg-studio-accent rounded-full"></span>
           وصف إبداعي (Prompt)
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="صف التعديل الذي تريده هنا (يدعم العربية والعامية)..."
          className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/30 focus:border-studio-accent focus:bg-black/60 outline-none h-20 resize-none transition-all"
          dir="rtl"
        />
      </div>

      {/* Style Grid */}
      <div>
        <h3 className="text-[10px] font-bold text-studio-muted uppercase tracking-widest mb-3 px-1">النمط الفني (Styles)</h3>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(STYLE_DEFINITIONS).map(([key, def]) => {
            const isSelected = selectedStyle === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedStyle(key as StylePreset)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 aspect-square relative overflow-hidden ${
                  isSelected 
                    ? 'bg-studio-accent/20 border-studio-accent shadow-neon scale-105' 
                    : `bg-white/5 hover:bg-white/10 border-white/5 hover:border-white/20`
                }`}
              >
                <span className={`text-2xl mb-2 ${isSelected ? 'scale-110' : 'opacity-60 grayscale group-hover:grayscale-0'}`}>{def.icon}</span>
                <span className={`text-[9px] font-bold text-center leading-tight ${isSelected ? 'text-white' : 'text-white/50'}`}>{def.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Parameters */}
      <div className="glass-panel p-5 rounded-3xl space-y-4">
        
        {/* Pose Selector */}
        <div className="grid grid-cols-1 gap-3">
            <div>
               <h3 className="text-[10px] font-bold text-studio-muted uppercase tracking-widest mb-2">وضعية الشخص/المنتج</h3>
               <select 
                    value={selectedPose}
                    onChange={(e) => setSelectedPose(e.target.value as SubjectPose)}
                    className="w-full bg-studio-panel border border-white/10 text-white text-xs rounded-xl focus:border-studio-accent block p-3 outline-none text-right"
                >
                    {Object.values(SubjectPose).map((pose) => (
                        <option key={pose} value={pose}>{pose}</option>
                    ))}
               </select>
            </div>
            
            <div>
               <h3 className="text-[10px] font-bold text-studio-muted uppercase tracking-widest mb-2">اتجاه الوجه (النظر)</h3>
               <select 
                    value={selectedFaceDirection}
                    onChange={(e) => setSelectedFaceDirection(e.target.value as FaceDirection)}
                    className="w-full bg-studio-panel border border-white/10 text-white text-xs rounded-xl focus:border-studio-accent block p-3 outline-none text-right"
                >
                    {Object.values(FaceDirection).map((dir) => (
                        <option key={dir} value={dir}>{dir}</option>
                    ))}
               </select>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
           <div>
              <h3 className="text-[10px] font-bold text-studio-muted uppercase tracking-widest mb-2">نوع الإضاءة</h3>
              <select 
                  value={selectedLighting}
                  onChange={(e) => setSelectedLighting(e.target.value as LightingPreset)}
                  className="w-full bg-studio-panel border border-white/10 text-white text-xs rounded-xl focus:border-studio-accent block p-3 outline-none text-right"
              >
                  {Object.values(LightingPreset).map((light) => (
                      <option key={light} value={light}>{light}</option>
                  ))}
              </select>
           </div>
           
          <div>
             <h3 className="text-[10px] font-bold text-studio-muted uppercase tracking-widest mb-2">زاوية الكاميرا</h3>
             <select 
                  value={selectedAngle}
                  onChange={(e) => setSelectedAngle(e.target.value as CameraAngle)}
                  className="w-full bg-studio-panel border border-white/10 text-white text-xs rounded-xl focus:border-studio-accent block p-3 outline-none text-right"
              >
                  {Object.values(CameraAngle).map((angle) => (
                      <option key={angle} value={angle}>{angle}</option>
                  ))}
             </select>
          </div>
        </div>

        <div>
            <h3 className="text-[10px] font-bold text-studio-muted uppercase tracking-widest mb-2">جودة المخرج</h3>
            <select 
                value={selectedResolution}
                onChange={(e) => setSelectedResolution(e.target.value as Resolution)}
                className="w-full bg-studio-panel border border-white/10 text-white text-xs rounded-xl focus:border-studio-accent block p-3 outline-none text-right"
            >
                {Object.values(Resolution).map((res) => (
                    <option key={res} value={res}>{res}</option>
                ))}
            </select>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={isProcessing || !hasImage}
        className={`w-full py-4 rounded-2xl font-bold text-sm shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mt-6 border border-white/5 overflow-hidden ${
          isProcessing || !hasImage
            ? 'bg-white/5 text-white/30 cursor-not-allowed'
            : 'bg-studio-gradient text-white hover:shadow-neon hover:scale-[1.02]'
        }`}
      >
        {isProcessing ? (
            <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span className="tracking-wider">جاري المعالجة...</span>
            </div>
        ) : (
            <>
                <span className="tracking-widest">ابدأ التخيل (GENERATE)</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 transform rotate-180">
                   <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436h.004c-1.228.824-2.619 1.496-4.105 1.982.087.576.169 1.143.225 1.713a.75.75 0 0 1-.75.819H2.5a.75.75 0 0 1-.75-.75V8.25a.75.75 0 0 1 .819-.75c.57.056 1.137.138 1.713.225.486-1.486 1.158-2.877 1.982-4.105v.004Zm4.155 3.641a7.55 7.55 0 0 0-2.677-1.655A5.338 5.338 0 0 0 9.25 6.375a5.338 5.338 0 0 0-3.193 3.193 7.55 7.55 0 0 0-1.655 2.677c.486.344.993.65 1.518.915.46-.31.928-.61 1.396-.903A6.836 6.836 0 0 1 9 10.5a6.836 6.836 0 0 1 1.759-1.243c-.293.468-.593.936-.903 1.396.264.525.571 1.032.915 1.518Z" clipRule="evenodd" />
                </svg>
            </>
        )}
      </button>
    </div>
  );
};