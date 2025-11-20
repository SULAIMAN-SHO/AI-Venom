import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { UploadArea } from './components/UploadArea';
import { ResultArea } from './components/ResultArea';
import { Controls } from './components/Controls';
import { StylePreset, CameraAngle, Resolution, LightingPreset, AspectRatio, SubjectPose, FaceDirection } from './types';
import { optimizePrompt, generateProductScene } from './services/geminiService';

const App: React.FC = () => {
  // State
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [referenceImage, setReferenceImage] = useState<string | null>(null); 
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Inputs
  const [selectedStyle, setSelectedStyle] = useState<StylePreset>(StylePreset.SMART_AD);
  const [selectedAngle, setSelectedAngle] = useState<CameraAngle>(CameraAngle.EYE_LEVEL);
  const [selectedLighting, setSelectedLighting] = useState<LightingPreset>(LightingPreset.SOFTBOX);
  const [selectedResolution, setSelectedResolution] = useState<Resolution>(Resolution.FHD);
  const [selectedPose, setSelectedPose] = useState<SubjectPose>(SubjectPose.DEFAULT); 
  const [selectedFaceDirection, setSelectedFaceDirection] = useState<FaceDirection>(FaceDirection.CAMERA); // New State
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [backgroundColor, setBackgroundColor] = useState<string>(''); 
  const [prompt, setPrompt] = useState('');

  const handleGenerate = useCallback(async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    setError(null);
    setGeneratedImage(null);

    try {
      // Step 1: Arabic NLP & Translation
      setProcessingStep('تحليل المشهد وكتابة التوجيه الفني...');
      const optimizedEnglishPrompt = await optimizePrompt(
        prompt, 
        selectedStyle, 
        selectedAngle, 
        selectedLighting,
        selectedPose,
        selectedFaceDirection,
        !!referenceImage,
        backgroundColor,
        aspectRatio
      );
      
      // Step 2: Generation
      if (selectedStyle === StylePreset.UPSCALE) {
        setProcessingStep('جاري رفع الدقة وتحسين التفاصيل...');
      } else {
        setProcessingStep('جاري التخيل والإخراج النهائي (Venom AI)...');
      }
      
      const resultImage = await generateProductScene(
        originalImage, 
        referenceImage, 
        optimizedEnglishPrompt, 
        selectedResolution, 
        selectedStyle,
        aspectRatio
      );
      
      setGeneratedImage(resultImage);
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء المعالجة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  }, [originalImage, referenceImage, prompt, selectedStyle, selectedAngle, selectedLighting, selectedResolution, selectedPose, selectedFaceDirection, backgroundColor, aspectRatio]);

  return (
    <div className="min-h-screen pb-12 bg-studio-base text-studio-text font-sans selection:bg-studio-accent selection:text-white" dir="rtl">
      <Header />

      <main className="container mx-auto px-4 pt-8 max-w-[1600px]">
        {/* Error Banner */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-4 rounded-xl mb-6 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Canvas Area (Display) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto">
                    {/* Input Canvas */}
                    <div className="h-full min-h-[500px]">
                        <UploadArea 
                            image={originalImage} 
                            onImageUpload={setOriginalImage}
                            onClear={() => {
                                setOriginalImage(null);
                                setGeneratedImage(null);
                            }}
                        />
                    </div>
                    {/* Output Canvas */}
                    <div className="h-full min-h-[500px] flex items-center justify-center">
                        <ResultArea 
                            image={generatedImage} 
                            isProcessing={isProcessing}
                            processingStep={processingStep}
                            aspectRatio={aspectRatio}
                        />
                    </div>
                </div>
            </div>

            {/* Right Column: Controls */}
            <div className="lg:col-span-4">
                <div className="bg-studio-panel rounded-3xl p-6 border border-studio-border sticky top-28 shadow-2xl">
                   <Controls 
                      selectedStyle={selectedStyle}
                      setSelectedStyle={setSelectedStyle}
                      selectedAngle={selectedAngle}
                      setSelectedAngle={setSelectedAngle}
                      selectedLighting={selectedLighting}
                      setSelectedLighting={setSelectedLighting}
                      selectedResolution={selectedResolution}
                      setSelectedResolution={setSelectedResolution}
                      selectedPose={selectedPose}
                      setSelectedPose={setSelectedPose}
                      selectedFaceDirection={selectedFaceDirection}
                      setSelectedFaceDirection={setSelectedFaceDirection}
                      aspectRatio={aspectRatio}
                      setAspectRatio={setAspectRatio}
                      backgroundColor={backgroundColor}
                      setBackgroundColor={setBackgroundColor}
                      prompt={prompt}
                      setPrompt={setPrompt}
                      onGenerate={handleGenerate}
                      isProcessing={isProcessing}
                      hasImage={!!originalImage}
                      referenceImage={referenceImage}
                      onReferenceUpload={setReferenceImage}
                      onClearReference={() => setReferenceImage(null)}
                   />
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;