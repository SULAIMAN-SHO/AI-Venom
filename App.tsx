

import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { UploadArea } from './components/UploadArea';
import { ResultArea } from './components/ResultArea';
import { Controls } from './components/Controls';
import { StylePreset, CameraAngle, CameraDistance, Resolution, LightingPreset, AspectRatio, SubjectPose, FaceDirection } from './types';
import { optimizePrompt, generateProductScene } from './services/geminiService';

const App: React.FC = () => {
  // State
  const [originalImages, setOriginalImages] = useState<string[]>([]); // Changed to Array
  const [referenceImage, setReferenceImage] = useState<string | null>(null); 
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Inputs
  const [selectedStyle, setSelectedStyle] = useState<StylePreset>(StylePreset.SMART_AD);
  const [selectedAngle, setSelectedAngle] = useState<CameraAngle>(CameraAngle.EYE_LEVEL);
  const [selectedDistance, setSelectedDistance] = useState<CameraDistance>(CameraDistance.MEDIUM); // New State
  const [selectedLighting, setSelectedLighting] = useState<LightingPreset>(LightingPreset.SOFTBOX);
  const [selectedResolution, setSelectedResolution] = useState<Resolution>(Resolution.FHD);
  const [selectedPose, setSelectedPose] = useState<SubjectPose>(SubjectPose.DEFAULT); 
  const [selectedFaceDirection, setSelectedFaceDirection] = useState<FaceDirection>(FaceDirection.CAMERA); 
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [backgroundColor, setBackgroundColor] = useState<string>(''); 
  const [prompt, setPrompt] = useState('');
  const [fixedElements, setFixedElements] = useState(''); 

  const handleGenerate = useCallback(async () => {
    const isTextMode = selectedStyle === StylePreset.IMAGINE_V5 || selectedStyle === StylePreset.PURE_CREATION;
    
    // Check if array is empty
    if ((!originalImages || originalImages.length === 0) && !isTextMode) return; 

    setIsProcessing(true);
    setError(null);
    setGeneratedImage(null);

    try {
      setProcessingStep(isTextMode ? 'Conceptualizing...' : 'Analyzing Composition...');
      const optimizedEnglishPrompt = await optimizePrompt(
        prompt, 
        fixedElements,
        selectedStyle, 
        selectedAngle,
        selectedDistance, // Pass Distance
        selectedLighting,
        selectedPose,
        selectedFaceDirection,
        !!referenceImage,
        backgroundColor,
        aspectRatio
      );
      
      if (selectedStyle === StylePreset.UPSCALE) {
        setProcessingStep('Upscaling & Refining (8K)...');
      } else if (isTextMode) {
        setProcessingStep('Rendering Scene...');
      } else {
        setProcessingStep('Generating Masterpiece...');
      }
      
      const resultImage = await generateProductScene(
        originalImages, // Passing array
        referenceImage, 
        optimizedEnglishPrompt, 
        selectedResolution, 
        selectedStyle,
        aspectRatio
      );
      
      setGeneratedImage(resultImage);
    } catch (err) {
      console.error(err);
      setError('An error occurred during generation.');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  }, [originalImages, referenceImage, prompt, fixedElements, selectedStyle, selectedAngle, selectedDistance, selectedLighting, selectedResolution, selectedPose, selectedFaceDirection, backgroundColor, aspectRatio]);

  return (
    <div className="min-h-screen bg-studio-base text-studio-text font-sans flex flex-col" dir="rtl">
      <Header />

      {/* Main Layout: Top Controls, Bottom Canvas */}
      <main className="flex-1 flex flex-col w-full max-w-[1920px] mx-auto p-4 md:p-6 gap-6">
        
        {/* Top Deck: Controls */}
        <section className="w-full bg-studio-panel rounded-2xl border border-white/5 shadow-2xl p-6 relative overflow-visible z-30">
             <Controls 
                selectedStyle={selectedStyle}
                setSelectedStyle={setSelectedStyle}
                selectedAngle={selectedAngle}
                setSelectedAngle={setSelectedAngle}
                selectedDistance={selectedDistance} // New Prop
                setSelectedDistance={setSelectedDistance} // New Prop
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
                fixedElements={fixedElements}
                setFixedElements={setFixedElements}
                onGenerate={handleGenerate}
                isProcessing={isProcessing}
                hasImage={originalImages.length > 0}
                referenceImage={referenceImage}
                onReferenceUpload={setReferenceImage}
                onClearReference={() => setReferenceImage(null)}
                originalImages={originalImages} // Passed for analysis (using first one)
             />
        </section>

        {/* Bottom Deck: Canvas Area */}
        <section className="flex-1 w-full grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
            
            {/* Input Side */}
            <div className="relative bg-studio-panel rounded-2xl border border-white/5 shadow-inner overflow-hidden flex flex-col">
                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent z-10"></div>
                <div className="flex-1 p-2">
                   <UploadArea 
                        images={originalImages} 
                        onImagesChange={setOriginalImages}
                        onClear={() => {
                            setOriginalImages([]);
                            setGeneratedImage(null);
                        }}
                        selectedStyle={selectedStyle}
                    />
                </div>
            </div>

            {/* Output Side */}
            <div className="relative bg-studio-panel rounded-2xl border border-white/5 shadow-inner overflow-hidden flex flex-col">
                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-studio-accent to-transparent z-10"></div>
                {error && (
                    <div className="absolute top-4 left-4 right-4 z-50 text-center text-red-200 text-sm border border-red-500/30 p-3 bg-red-900/40 rounded-lg backdrop-blur-md">
                        {error}
                    </div>
                )}
                <div className="flex-1 p-2">
                    <ResultArea 
                        image={generatedImage} 
                        isProcessing={isProcessing}
                        processingStep={processingStep}
                        aspectRatio={aspectRatio}
                    />
                </div>
            </div>

        </section>

      </main>
    </div>
  );
};

export default App;