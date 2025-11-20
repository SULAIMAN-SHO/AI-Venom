import { GoogleGenAI, Modality } from "@google/genai";
import { StylePreset, CameraAngle, LightingPreset, AspectRatio, SubjectPose, FaceDirection, STYLE_DEFINITIONS } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Translates and optimizes prompts.
 */
export const optimizePrompt = async (
  arabicText: string, 
  style: StylePreset, 
  angle: CameraAngle,
  lighting: LightingPreset,
  pose: SubjectPose,
  faceDirection: FaceDirection,
  hasReference: boolean,
  backgroundColor: string,
  aspectRatio: AspectRatio
): Promise<string> => {
  
  // Short circuit for simple tasks
  if (style === StylePreset.REMOVE_BG) {
    return "Solid white background #FFFFFF. Isolate the object. No shadows. Clean cutout.";
  }
  if (style === StylePreset.UPSCALE) {
    return "Upscale and enhance.";
  }

  // SPECIAL HANDLER FOR DEVELOPER PRO MODE
  if (style === StylePreset.DEVELOPER_PRO) {
    return `
      Professional Cinematic Portrait of a Senior Software Engineer / Hacker.
      Setting: High-Tech futuristic workspace command center.
      Details:
      - Surrounded by multiple curved monitors displaying complex neon blue and purple code (Python/React/C++).
      - Floating holographic data interfaces in the air.
      - Cyberpunk city skyline visible through large glass windows in the back.
      - Lighting: Dramatic mix of deep purple (Venom) and electric blue neon rim lighting.
      - Atmosphere: Serious, professional, tech-savvy, futuristic, high-end production value.
      - Quality: 8k, Unreal Engine 5 render style, raytracing, sharp focus on the person.
      - POSE: ${pose} (Ensure the subject follows this pose in a natural, professional way).
      - EYE GAZE / FACE DIRECTION: ${faceDirection}.
    `;
  }

  const basePrompt = arabicText ? `User description: "${arabicText}"` : "A professional product shot.";
  const styleDetails = STYLE_DEFINITIONS[style].promptSuffix;
  const refNote = hasReference ? "Match the style/vibe of the provided reference image." : "";
  const bgInstruction = backgroundColor ? `BACKGROUND MUST BE SOLID COLOR: ${backgroundColor}.` : "";
  
  // We pass the Arabic enum strings directly. The System Instruction will handle translation.
  
  const systemInstruction = `
    You are an Expert Product Photography Prompt Engineer.
    Your goal is to convert user requests (which may contain Arabic enum values) into a precise, high-quality ENGLISH prompt for an Image Generation Model (like Imagen/Gemini).
    
    The User has provided specific configurations:
    1. Angle: "${angle}" (Translate this to English camera terminology).
    2. Lighting: "${lighting}" (Translate to English lighting setup).
    3. Subject Pose: "${pose}" (Translate this. If it implies action, describe it).
    4. Face Direction: "${faceDirection}" (Where the subject is looking).
    5. Aspect Ratio: "${aspectRatio}".
    6. Background Color: "${bgInstruction}".
    7. Style Context: "${styleDetails}".
    8. User Custom Description: "${basePrompt}".
    
    OUTPUT FORMAT:
    "[Camera Angle], [Subject Pose Description], [Face Direction], [Lighting Setup], [Background Description], [Style Keywords/Texture/Vibe]"
    
    Constraint: Refer to the subject as "the central subject".
    Ensure the prompt is descriptive and artistic.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ parts: [{ text: "Optimize prompt." }] }],
      config: { systemInstruction }
    });
    
    return response.text || `${angle}, ${lighting}, ${pose}, ${styleDetails}`;
  } catch (error) {
    return `${angle}, ${lighting}, ${styleDetails}`;
  }
};

/**
 * Edits the image.
 */
export const generateProductScene = async (
  imageBase64: string,
  referenceImageBase64: string | null,
  optimizedPrompt: string,
  resolution: string,
  style: StylePreset,
  aspectRatio: AspectRatio
): Promise<string> => {
  
  const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
  let promptParts: any[] = [];

  promptParts.push({
    inlineData: { mimeType: 'image/png', data: cleanBase64 }
  });

  if (referenceImageBase64 && style !== StylePreset.REMOVE_BG) {
    const cleanRefBase64 = referenceImageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
    promptParts.push({
      inlineData: { mimeType: 'image/png', data: cleanRefBase64 }
    });
  }

  let taskDescription = "";

  if (style === StylePreset.UPSCALE) {
     taskDescription = `
        Task: Upscale and Enhance.
        1. Upscale input to ${resolution}.
        2. Preserve original background EXACTLY.
        3. Sharpen details and denoise.
     `;
  } else if (style === StylePreset.REMOVE_BG) {
     taskDescription = `
        Task: Background Removal / Extraction.
        1. Place the product on a pure SOLID WHITE background (#FFFFFF).
        2. NO shadows, NO gradient, NO props.
        3. Keep product edges perfectly sharp.
        4. Maintain resolution and aspect ratio ${aspectRatio}.
     `;
  } else {
    // General Generation + Developer Mode
    taskDescription = `
        Task: Background Replacement / In-Painting / Scene Generation.
        1. Keep the central subject (person or product) EXACTLY as is (Face/Product Details must not change). 
        2. Generate a new scene based on: ${optimizedPrompt}
        3. ${referenceImageBase64 ? 'Mimic the style of Image 2.' : ''}
        4. Output Aspect Ratio: ${aspectRatio}.
        5. Target Resolution: ${resolution}.
        6. Ensure realistic integration (shadows/reflections) between subject and new background.
    `;
  }

  promptParts.push({ text: taskDescription });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: promptParts },
      config: { responseModalities: [Modality.IMAGE] }
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts?.[0]?.inlineData?.data) {
        return `data:image/png;base64,${parts[0].inlineData.data}`;
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Generation Error:", error);
    throw error;
  }
};