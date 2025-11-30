

import React, { useRef, useState } from 'react';
import { StylePreset, CameraAngle, CameraDistance, Resolution, LightingPreset, AspectRatio, SocialPlatform, SubjectPose, FaceDirection, STYLE_DEFINITIONS, ImageAnalysisResult } from '../types';
import { analyzeImage } from '../services/geminiService';

interface ControlsProps {
  selectedStyle: StylePreset;
  setSelectedStyle: (s: StylePreset) => void;
  selectedAngle: CameraAngle;
  setSelectedAngle: (a: CameraAngle) => void;
  selectedDistance: CameraDistance;
  setSelectedDistance: (d: CameraDistance) => void;
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
  fixedElements?: string; 
  setFixedElements?: (s: string) => void; 
  onGenerate: () => void;
  isProcessing: boolean;
  hasImage: boolean;
  referenceImage: string | null;
  onReferenceUpload: (base64: string) => void;
  onClearReference: () => void;
  // Passing original images array for analysis
  originalImages?: string[];
}

export const Controls: React.FC<ControlsProps> = ({
  selectedStyle,
  setSelectedStyle,
  selectedAngle,
  setSelectedAngle,
  selectedDistance,
  setSelectedDistance,
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
  fixedElements = '',
  setFixedElements,
  onGenerate,
  isProcessing,
  hasImage,
  referenceImage,
  onReferenceUpload,
  onClearReference,
  originalImages
}) => {
  const refInputRef = useRef<HTMLInputElement>(null);
  const [showSocialMenu, setShowSocialMenu] = useState(false);
  
  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ImageAnalysisResult | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  
  const isTextMode = selectedStyle === StylePreset.IMAGINE_V5 || selectedStyle === StylePreset.PURE_CREATION;
  const canGenerate = !isProcessing && (hasImage || isTextMode);

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
    setShowSocialMenu(false);
  };

  const handleAnalyzeImage = async () => {
    if (!originalImages || originalImages.length === 0) return;
    setIsAnalyzing(true);
    try {
        const result = await analyzeImage(originalImages);
        setAnalysisResult(result);
        setShowAnalysisModal(true);
    } catch (e) {
        alert("Failed to analyze image");
    } finally {
        setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col gap-6 w-full" dir="rtl">
      
      {/* ROW 1: INPUTS & GENERATE BUTTON */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        
        {/* Prompts Container */}
        <div className="flex-1 flex flex-col gap-3">
             <div className="flex gap-4">
                 {/* Reference Upload Button */}
                 <div className="relative shrink-0">
                    <button 
                        onClick={() => !referenceImage && refInputRef.current?.click()}
                        className={`h-full min-h-[60px] w-[60px] rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${
                            referenceImage 
                            ? 'border-studio-accent bg-studio-accent/10' 
                            : 'border-white/10 hover:border-studio-accent/50 bg-studio-base'
                        }`}
                        title="تحميل صورة مرجعية (Reference)"
                    >
                        {referenceImage ? (
                            <>
                                <span className="text-xl">🖼️</span>
                                <span onClick={(e) => { e.stopPropagation(); onClearReference(); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md hover:bg-red-600">✕</span>
                            </>
                        ) : (
                            <>
                                <span className="text-xl opacity-50">+</span>
                                <span className="text-[8px] uppercase tracking-wider opacity-50">إلهام</span>
                            </>
                        )}
                    </button>
                    <input type="file" ref={refInputRef} onChange={handleRefChange} className="hidden" accept="image/*" />
                 </div>

                 {/* Main Inputs */}
                 <div className="flex-1 flex flex-col gap-3">
                    {/* Top Row: Description */}
                    <div className="relative flex-1 flex gap-2">
                        <div className="relative flex-1">
                            <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={isTextMode ? "صف خيالك هنا... (ماتريكس، فضاء، مدينة مستقبلية)" : "صف التعديل المطلوب... (خلفية مكتب، إضاءة سينمائية)"}
                            className="w-full h-[50px] bg-studio-base border-2 border-white/10 rounded-xl px-4 text-sm text-white placeholder-white/30 focus:border-studio-accent focus:shadow-gold-glow outline-none transition-all"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-studio-accent opacity-50">
                                ✎
                            </div>
                        </div>
                        
                        {/* Vision Analysis Button */}
                         {hasImage && !isTextMode && (
                            <button
                                onClick={handleAnalyzeImage}
                                disabled={isAnalyzing}
                                className="h-[50px] px-4 rounded-xl border border-studio-accent/30 bg-studio-accent/10 hover:bg-studio-accent/20 text-studio-accent flex items-center justify-center gap-2 transition-all"
                                title="وصف الصورة بالذكاء الاصطناعي"
                            >
                                {isAnalyzing ? <span className="animate-spin">⌛</span> : <span>🔮</span>}
                            </button>
                        )}
                    </div>

                    {/* Bottom Row: Fixed Elements */}
                     {setFixedElements && (
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={fixedElements}
                                onChange={(e) => setFixedElements(e.target.value)}
                                placeholder="عناصر ثابتة إلزامية (مثل: شعار أحمر، بدون أشخاص، أرضية خشبية)..."
                                className="w-full h-[40px] bg-studio-base/50 border border-white/10 rounded-lg px-4 text-xs text-studio-accent font-medium placeholder-studio-accent/40 focus:border-studio-accent focus:ring-1 focus:ring-studio-accent outline-none"
                            />
                        </div>
                    )}
                 </div>
             </div>
        </div>

        {/* Big Generate Button */}
        <button
            onClick={onGenerate}
            disabled={!canGenerate}
            className={`h-auto min-h-[60px] lg:w-64 rounded-xl font-bold text-lg tracking-widest uppercase shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 ${
            !canGenerate
                ? 'bg-studio-base border border-white/5 text-white/20 cursor-not-allowed'
                : 'bg-gradient-to-r from-studio-accent to-yellow-500 text-black hover:shadow-gold-glow'
            }`}
        >
            {isProcessing ? (
                <>
                    <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                    <span>جاري المعالجة</span>
                </>
            ) : (
                <>
                    <span>✨ إنشاء</span>
                </>
            )}
        </button>
      </div>

      {/* ROW 2: STYLE SELECTION (GRID - PLATINUM STYLE) */}
      <div>
         <h3 className="text-studio-secondary text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-studio-accent"></span>
            اختر النمط (Style)
         </h3>
         <div className="flex flex-wrap gap-3">
            {Object.entries(STYLE_DEFINITIONS).map(([key, def]) => {
                const isSelected = selectedStyle === key;
                return (
                <button
                    key={key}
                    onClick={() => setSelectedStyle(key as StylePreset)}
                    className={`min-w-fit px-[20px] py-4 rounded-xl border transition-all duration-200 group relative overflow-hidden flex flex-col items-center justify-center gap-2 ${
                    isSelected 
                        ? 'bg-slate-200 border-white text-slate-900 shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-105 z-10' // Platinum/Silver Style
                        : 'bg-studio-base border-white/5 text-white/60 hover:border-white/20 hover:text-white'
                    }`}
                >
                    <span className={`text-3xl filter drop-shadow-md transition-transform duration-300 ${isSelected ? 'scale-110' : 'grayscale group-hover:grayscale-0'}`}>{def.icon}</span>
                    <span className="text-[10px] font-bold tracking-wide text-center leading-tight whitespace-nowrap">{def.label}</span>
                    {isSelected && <div className="absolute inset-0 bg-white/40 animate-pulse pointer-events-none"></div>}
                </button>
                );
            })}
         </div>
      </div>

      {/* ROW 3: ADVANCED SETTINGS (Clean Grid Including Ratio) */}
      <div className="bg-studio-base/50 p-4 rounded-xl border border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            
            {/* Controls */}
            <div className="flex flex-col gap-1">
                 <label className="text-[9px] text-studio-secondary font-bold uppercase">الزاوية</label>
                 <select value={selectedAngle} onChange={(e) => setSelectedAngle(e.target.value as CameraAngle)} 
                    className="h-10 w-full bg-studio-panel border border-studio-border rounded-lg px-2 text-xs text-white focus:border-studio-accent outline-none appearance-none">
                    {Object.values(CameraAngle).map(a => <option key={a} value={a}>{a}</option>)}
                 </select>
            </div>

            {/* New Distance Control */}
            <div className="flex flex-col gap-1">
                 <label className="text-[9px] text-studio-secondary font-bold uppercase">البعد/التقريب</label>
                 <select value={selectedDistance} onChange={(e) => setSelectedDistance(e.target.value as CameraDistance)} 
                    className="h-10 w-full bg-studio-panel border border-studio-border rounded-lg px-2 text-xs text-white focus:border-studio-accent outline-none appearance-none">
                    {Object.values(CameraDistance).map(d => <option key={d} value={d}>{d}</option>)}
                 </select>
            </div>

            <div className="flex flex-col gap-1">
                 <label className="text-[9px] text-studio-secondary font-bold uppercase">الإضاءة</label>
                 <select value={selectedLighting} onChange={(e) => setSelectedLighting(e.target.value as LightingPreset)}
                    className="h-10 w-full bg-studio-panel border border-studio-border rounded-lg px-2 text-xs text-white focus:border-studio-accent outline-none appearance-none">
                    {Object.values(LightingPreset).map(l => <option key={l} value={l}>{l}</option>)}
                 </select>
            </div>

            <div className="flex flex-col gap-1">
                 <label className="text-[9px] text-studio-secondary font-bold uppercase">الوضعية</label>
                 <select value={selectedPose} onChange={(e) => setSelectedPose(e.target.value as SubjectPose)}
                    className="h-10 w-full bg-studio-panel border border-studio-border rounded-lg px-2 text-xs text-white focus:border-studio-accent outline-none appearance-none">
                    {Object.values(SubjectPose).map(p => <option key={p} value={p}>{p}</option>)}
                 </select>
            </div>

             <div className="flex flex-col gap-1">
                 <label className="text-[9px] text-studio-secondary font-bold uppercase">اتجاه الوجه</label>
                 <select value={selectedFaceDirection} onChange={(e) => setSelectedFaceDirection(e.target.value as FaceDirection)}
                    className="h-10 w-full bg-studio-panel border border-studio-border rounded-lg px-2 text-xs text-white focus:border-studio-accent outline-none appearance-none">
                    {Object.values(FaceDirection).map(f => <option key={f} value={f}>{f}</option>)}
                 </select>
            </div>

            <div className="flex flex-col gap-1">
                 <label className="text-[9px] text-studio-secondary font-bold uppercase">الدقة</label>
                 <select value={selectedResolution} onChange={(e) => setSelectedResolution(e.target.value as Resolution)}
                    className="h-10 w-full bg-studio-panel border border-studio-border rounded-lg px-2 text-xs text-white focus:border-studio-accent outline-none appearance-none">
                    {Object.values(Resolution).map(r => <option key={r} value={r}>{r}</option>)}
                 </select>
            </div>

            {/* Moved Aspect Ratio Here for Logical Flow */}
            <div className="flex flex-col gap-1">
                 <label className="text-[9px] text-studio-secondary font-bold uppercase">الأبعاد</label>
                 <div className="relative">
                    <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                        className="h-10 w-full bg-studio-panel border border-studio-border rounded-lg px-2 text-xs text-white focus:border-studio-accent outline-none appearance-none">
                        {Object.values(AspectRatio).map(r => <option key={r} value={r}>{r}</option>)}
                     </select>
                      {/* Social Quick Link */}
                    <button onClick={() => setShowSocialMenu(!showSocialMenu)} className="absolute top-1/2 -translate-y-1/2 left-2 text-[14px] opacity-50 hover:opacity-100" title="Social Sizes">📱</button>
                    {showSocialMenu && (
                        <div className="absolute bottom-full left-0 mb-1 bg-studio-panel border border-studio-border p-2 w-32 rounded-lg shadow-xl z-50">
                            {[{ id: SocialPlatform.INSTAGRAM_POST, label: 'Instagram Sq' }, { id: SocialPlatform.INSTAGRAM_STORY, label: 'Story 9:16' }, { id: SocialPlatform.YOUTUBE_THUMBNAIL, label: 'YouTube' }].map(p => (
                                <div key={p.id} onClick={() => handleSocialPreset(p.id)} className="p-2 hover:bg-studio-accent hover:text-black rounded text-[10px] text-white cursor-pointer">{p.label}</div>
                            ))}
                        </div>
                    )}
                 </div>
            </div>

            {/* Background Color */}
            <div className="flex flex-col gap-1">
                 <label className="text-[9px] text-studio-secondary font-bold uppercase">لون الخلفية</label>
                 <div className="relative h-10 w-full">
                     <input type="color" value={backgroundColor || '#000000'} onChange={(e) => setBackgroundColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"/>
                     <div className="w-full h-full rounded-lg border border-studio-border flex items-center justify-center gap-2" style={{backgroundColor: backgroundColor || '#1e293b'}}>
                        <span className="text-[10px] mix-blend-difference text-white/70">{backgroundColor ? backgroundColor : 'تلقائي'}</span>
                     </div>
                 </div>
            </div>

          </div>
      </div>

      {/* Analysis Result Modal */}
      {showAnalysisModal && analysisResult && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-studio-panel border border-studio-accent/30 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-studio-base p-4 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <span>🔮</span> نتيجة تحليل الصورة
                    </h3>
                    <button onClick={() => setShowAnalysisModal(false)} className="text-white/50 hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10">✕</button>
                </div>
                
                <div className="p-6 flex flex-col gap-6 max-h-[70vh] overflow-y-auto">
                    
                    {/* Creation Prompt */}
                    <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-studio-accent text-xs font-bold uppercase tracking-widest">وصف تخيلي (لإعادة البناء من الصفر)</span>
                            <button onClick={() => copyToClipboard(analysisResult.creationPrompt)} className="text-[10px] bg-white/10 hover:bg-studio-accent hover:text-black px-3 py-1 rounded-md transition-colors text-white">
                                نسخ النص
                            </button>
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed font-mono">{analysisResult.creationPrompt}</p>
                    </div>

                    {/* Preservation Prompt */}
                    <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                        <div className="flex justify-between items-center mb-2">
                             <span className="text-green-400 text-xs font-bold uppercase tracking-widest">وصف الحفاظ على العنصر (للتعديل)</span>
                             <button onClick={() => copyToClipboard(analysisResult.preservationPrompt)} className="text-[10px] bg-white/10 hover:bg-green-400 hover:text-black px-3 py-1 rounded-md transition-colors text-white">
                                نسخ النص
                            </button>
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed font-mono">{analysisResult.preservationPrompt}</p>
                    </div>
                    
                </div>
            </div>
        </div>
      )}

    </div>
  );
};