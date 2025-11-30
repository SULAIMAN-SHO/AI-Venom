

import { GoogleGenAI, Modality, SchemaType, Type } from "@google/genai";
import { StylePreset, CameraAngle, CameraDistance, LightingPreset, AspectRatio, SubjectPose, FaceDirection, STYLE_DEFINITIONS, ImageAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes an image and returns two types of prompts:
 * 1. Creation Prompt: To recreate the image from scratch.
 * 2. Preservation Prompt: To preserve the subject during edits.
 */
export const analyzeImage = async (imagesBase64: string[]): Promise<ImageAnalysisResult> => {
  if (!imagesBase64 || imagesBase64.length === 0) throw new Error("No image provided for analysis.");

  // Use the first image for analysis
  const cleanBase64 = imagesBase64[0].replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

  const systemInstruction = `
    You are an AI Vision Expert for Photography.
    Analyze the provided image and output a JSON object with exactly two fields:
    
    1. "creationPrompt": A highly detailed, artistic English prompt that describes the image perfectly so it can be re-created by an AI generator from scratch. Include lighting, angle, mood, colors, and subject details.
    
    2. "preservationPrompt": A precise English description of the PRIMARY SUBJECT ONLY. This text will be used to tell an AI what NOT to change during an edit. Focus on the subject's physical traits, clothing, or product details.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: cleanBase64 } },
          { text: "Analyze this image and provide the JSON output." }
        ]
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            creationPrompt: { type: Type.STRING },
            preservationPrompt: { type: Type.STRING }
          },
          required: ["creationPrompt", "preservationPrompt"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      creationPrompt: result.creationPrompt || "Could not generate prompt.",
      preservationPrompt: result.preservationPrompt || "Could not identify subject."
    };

  } catch (error) {
    console.error("Analysis Error:", error);
    throw new Error("Failed to analyze image.");
  }
};

/**
 * Translates and optimizes prompts.
 */
export const optimizePrompt = async (
  arabicText: string, 
  fixedElements: string,
  style: StylePreset, 
  angle: CameraAngle,
  distance: CameraDistance,
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
    return "Upscale and enhance to 8k ultra resolution. Remove noise. sharpen details.";
  }

  // Common Constraint string
  const constraintString = fixedElements ? `MANDATORY ELEMENTS (Must be included/preserved): ${fixedElements}` : "";

  // SPECIAL HANDLER FOR IMAGINE MODE (Crazy/Sci-Fi Text to Image)
  if (style === StylePreset.IMAGINE_V5) {
    const topic = arabicText ? arabicText : "Future Technology";
    return `
        Create a mind-bending, futuristic, high-tech masterpiece concept art based on the concept: "${topic}".
        ${constraintString}
        Style: Unreal Engine 5, 8k Resolution, Cyberpunk/Sci-Fi Aesthetic, Volumetric Lighting, Neon Glow.
        Details: Intricate mechanical details, futuristic architecture, glowing data streams, obsidian and glass textures.
        Composition: Cinematic ${angle}, Shot Distance: ${distance}, Dynamic Lighting (${lighting}), Epic Scale.
        The image should look insanely detailed and "crazy" creative. Ultra-sharp.
    `;
  }

  // SPECIAL HANDLER FOR PURE CREATION MODE (Realistic Text to Image)
  if (style === StylePreset.PURE_CREATION) {
    const topic = arabicText ? arabicText : "A beautiful scene";
    return `
        Create a Professional, High-Quality, Photorealistic image based on the description: "${topic}".
        ${constraintString}
        Style: Cinematic Photography, Commercial Quality, Highly Detailed, Natural Textures.
        Lighting: ${lighting}.
        Angle: ${angle}.
        Distance: ${distance}.
        Composition: Balanced, professional, aesthetically pleasing. 
        Quality: 8k, Sharp Focus, Masterpiece.
    `;
  }

  // SPECIAL HANDLER FOR FREE EDIT MODE (New Feature)
  if (style === StylePreset.FREE_EDIT) {
    const topic = arabicText ? arabicText : "Enhance the image";
    return `
        Task: Creative Image Editing / Manipulation.
        User Instruction: "${topic}".
        ${constraintString}
        Guidelines:
        - Modify the image according to the user's instruction precisely.
        - You have creative freedom to change the subject, background, or atmosphere if the prompt implies it.
        - Lighting preference: ${lighting}.
        - Maintain high quality, 8k resolution.
    `;
  }

  // SPECIAL HANDLER FOR 3D FILES RENDER (New Feature)
  if (style === StylePreset.FILES_3D_RENDER) {
    return `
      Transform the UI Screenshot of files into a High-End 3D Isometric Illustration.
      ${constraintString}
      Subject: The Folders and Files visible in the image.
      Action: Convert the flat 2D icons into premium 3D Objects.
      CRITICAL PRIORITY: TEXT CLARITY.
      - The filenames (e.g., style.css, index.html) visible in the source image MUST be preserved and rendered as SHARP, HIGH-CONTRAST 3D TYPOGRAPHY.
      - Ensure the text is large enough to be readable.
      - Do not blur the text.
      Details:
      - Folders: Render as puffy, matte yellow 3D folders (Claymorphism style).
      - Files: Render as floating glossy sheets or 3D cards.
      - Composition: Floating dynamically above a frosted glass platform.
      - Elements: Add small floating 3D primitive shapes (cubes, spheres) around them for elegance.
      - Lighting: Soft, warm studio lighting with rim lights.
      - Background: Dark grey or clean dark studio environment.
      Style: Blender 3D Render, Cute, Elegant, Clean, High Quality.
    `;
  }

  // SPECIAL HANDLER FOR CODING HOLOGRAM (The new feature)
  if (style === StylePreset.CODING_HOLOGRAM) {
    return `
      Professional Futuristic Product Photography.
      ${constraintString}
      Subject: The Laptop/Computer screen.
      Effect: VISUALIZATION OF CODE AS HOLOGRAPHIC ART.
      Details:
      - The code/text on the screen transforms into glowing, 3D holographic data streams that flow OUT of the physical screen into the air.
      - Treat the code as a "Visual Texture" rather than readable text. 
      - The data flow wraps elegantly around the device like a magical tech aura.
      - Colors: Electric Blue, Neon Purple, and Cyber Cyan (Matrix style but modern and elegant).
      - Lighting: Volumetric lighting rays emanating from the display.
      - The laptop hardware remains sharp, realistic, and premium.
      Background: Dark, sleek, high-tech abstract environment (Depth of field).
      Vibe: Advertising for advanced AI or Quantum Computing.
      Quality: 8k, Unreal Engine Render style, Particle Effects.
    `;
  }

  // SPECIAL HANDLER FOR DEVELOPER PRO MODE
  if (style === StylePreset.DEVELOPER_PRO) {
    return `
      Professional Cinematic Portrait of a Senior Software Engineer / Hacker.
      ${constraintString}
      Setting: High-Tech futuristic workspace command center.
      Details:
      - Surrounded by multiple curved monitors displaying complex neon blue and purple code (Python/React/C++).
      - Floating holographic data interfaces in the air.
      - Cyberpunk city skyline visible through large glass windows in the back.
      - Lighting: Dramatic mix of deep purple (Venom) and electric blue neon rim lighting.
      - Atmosphere: Serious, professional, tech-savvy, futuristic, high-end production value.
      - Quality: 8k, Unreal Engine 5 render style, raytracing, sharp focus on the person.
      - POSE: ${pose} (Ensure the subject follows this pose in a natural, professional way).
      - DISTANCE: ${distance}.
      - EYE GAZE / FACE DIRECTION: ${faceDirection}.
    `;
  }

  // SPECIAL HANDLER FOR PHONE PHOTOGRAPHY
  if (style === StylePreset.SMARTPHONE_PHOTO) {
    return `
      Professional High-End Tech Product Photography for Smartphone.
      ${constraintString}
      Subject: The Smartphone (Display and Body).
      Style: Apple/Samsung Official Advertisement Style. Sleek, Minimalist, Premium.
      Details: 
      - Accentuate the screen vibrancy and bezel-less design.
      - Highlight the camera module lens reflections (Glass texture).
      - Body Material: Brushed Metal or Polished Glass.
      Lighting: ${lighting} (Softbox or Rim lighting to highlight edges).
      Background: Abstract Tech, Smooth Gradient, or Floating Geometry.
      Quality: 8k, Ultra-Sharp Macro details.
    `;
  }

  // SPECIAL HANDLER FOR TECH ACCESSORIES
  if (style === StylePreset.TECH_ACCESSORIES) {
    return `
      Professional Commercial Product Photography for Tech Accessories.
      ${constraintString}
      Subject: Gadget/Accessory (Headphones, Smartwatch, Case, or Charger).
      Style: Premium Tech Editorial (The Verge / MKBHD style).
      Details: 
      - Focus on premium materials: Matte Silicone, Brushed Aluminum, Leather texture, Mesh fabric.
      - Highlight LEDs or Screen displays if applicable.
      - Clean, modern, minimalist studio setting.
      Lighting: ${lighting} (Soft, controlled studio lighting to show form).
      Background: Monochrome matte surface or architectural concrete.
      Quality: 8k, Macro focus on textures.
    `;
  }

  // SPECIAL HANDLER FOR FOOD PHOTOGRAPHY
  if (style === StylePreset.FOOD_PHOTOGRAPHY) {
    return `
      Professional Commercial Food Photography.
      ${constraintString}
      Subject: The food item (Sweet, Biscuit, Dish, or Drink).
      Style: High-end culinary magazine style (Bon Appétit).
      Details: Focus on appetizing textures, crumbs, glaze, steam, freshness. 
      Lighting: Soft, diffused natural window lighting or professional studio food lighting to enhance appetite appeal.
      Background: Complementary culinary setting (marble counter, wooden table, cafe, bakery). 
      Composition: ${angle}, ${distance}, ${aspectRatio}. 
      Vibe: Delicious, Fresh, Premium.
      Quality: 8k, Macro focus.
    `;
  }

  // SPECIAL HANDLER FOR SHOES
  if (style === StylePreset.SHOES_ELEGANCE) {
    return `
      Professional Commercial Sneaker/Shoe Photography.
      ${constraintString}
      Style: Hypebeast Streetwear or Luxury Editorial.
      Details: Ultra-sharp focus on fabric/leather texture, stitching, and logos.
      Composition: ${angle === CameraAngle.EYE_LEVEL ? 'Floating dynamically' : angle}.
      Distance: ${distance}.
      Lighting: ${lighting} (Emphasis on rim lighting to show silhouette).
      Background: Concrete, Abstract Geometric, or Studio.
      Quality: 8k, Ultra-Sharp.
    `;
  }

  // SPECIAL HANDLER FOR FASHION
  if (style === StylePreset.FASHION_CLOTHING) {
    return `
      High Fashion Editorial Photography.
      ${constraintString}
      Style: Vogue/Harper's Bazaar Aesthetic.
      Details: Focus on fabric drape, texture, and fit.
      Subject Pose: ${pose}.
      Distance: ${distance}.
      Lighting: ${lighting} (Fashion Studio Lighting).
      Background: Minimalist luxury or urban chic.
      Quality: 8k, Texture rich.
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
    2. Distance: "${distance}" (Translate to English camera shot type).
    3. Lighting: "${lighting}" (Translate to English lighting setup).
    4. Subject Pose: "${pose}" (Translate this. If it implies action, describe it).
    5. Face Direction: "${faceDirection}" (Where the subject is looking).
    6. Aspect Ratio: "${aspectRatio}".
    7. Background Color: "${bgInstruction}".
    8. Style Context: "${styleDetails}".
    9. User Custom Description: "${basePrompt}".
    10. MANDATORY CONSTRAINTS: "${constraintString}".
    
    OUTPUT FORMAT:
    "[Camera Angle], [Camera Distance/Shot Type], [Subject Pose Description], [Face Direction], [Lighting Setup], [Background Description], [Style Keywords/Texture/Vibe], [Mandatory Constraints], 8k Ultra Resolution, Masterpiece"
    
    Constraint: Refer to the subject as "the central subject".
    Ensure the prompt is descriptive and artistic.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ parts: [{ text: "Optimize prompt." }] }],
      config: { systemInstruction }
    });
    
    return response.text || `${angle}, ${distance}, ${lighting}, ${pose}, ${styleDetails}, 8k Resolution`;
  } catch (error) {
    return `${angle}, ${distance}, ${lighting}, ${styleDetails}`;
  }
};

/**
 * Edits the image.
 */
export const generateProductScene = async (
  imagesBase64: string[] | null, // Changed to array of images
  referenceImageBase64: string | null,
  optimizedPrompt: string,
  resolution: string,
  style: StylePreset,
  aspectRatio: AspectRatio
): Promise<string> => {
  
  let promptParts: any[] = [];

  // If we have source images, add them
  if (imagesBase64 && imagesBase64.length > 0) {
      imagesBase64.forEach((img, index) => {
        const cleanBase64 = img.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
        promptParts.push({
            inlineData: { mimeType: 'image/png', data: cleanBase64 }
        });
      });
  }

  // Add reference image if exists and supported
  // Support reference image in all modes except Remove BG
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
        4. Output in 8K fidelity.
     `;
  } else if (style === StylePreset.REMOVE_BG) {
     taskDescription = `
        Task: Background Removal / Extraction.
        1. Place the product on a pure SOLID WHITE background (#FFFFFF).
        2. NO shadows, NO gradient, NO props.
        3. Keep product edges perfectly sharp.
        4. Maintain resolution and aspect ratio ${aspectRatio}.
     `;
  } else if (style === StylePreset.IMAGINE_V5 || style === StylePreset.PURE_CREATION) {
      // Pure Text to Image (Both Crazy and Realistic modes)
      taskDescription = `
          Task: Generate Image from Text (Concept Art / Scene Generation).
          Prompt: ${optimizedPrompt}
          Output Aspect Ratio: ${aspectRatio}.
          Target Resolution: ${resolution}.
          Quality: Photorealistic, Highly Detailed, Cinematic, 8k Ultra HD.
          ${referenceImageBase64 ? 'Style Reference: Use the provided image as a Style/Vibe reference.' : ''}
      `;
  } else if (style === StylePreset.FILES_3D_RENDER) {
     // Special Logic for 3D Files to ensure Text Readability
     taskDescription = `
        Task: Image Transformation & Style Transfer (2D to 3D).
        1. ANALYZE the source image to identify file names, folder names, and icons.
        2. RE-CREATE the scene as a 3D Isometric Render.
        3. CRITICAL: The names of the files (text) MUST be clearly written on the 3D objects.
        4. Maintain the exact spelling of filenames from the original image.
        5. Prompt: ${optimizedPrompt}
        6. Output Aspect Ratio: ${aspectRatio}.
        7. Target Resolution: ${resolution}.
     `;
  } else if (style === StylePreset.FREE_EDIT) {
     // Free Edit Mode
     taskDescription = `
        Task: Creative Image Editing / Manipulation.
        1. Modify the provided image based on the user's specific instruction: ${optimizedPrompt}
        2. Unlike strict product photography, you have the creative freedom to change the subject, colors, or background if the prompt asks for it.
        3. Maintain realism and high quality.
        4. Output Aspect Ratio: ${aspectRatio}.
        5. Target Resolution: ${resolution}.
     `;
  } else {
    // General Generation + Developer Mode (In-painting/Out-painting)
    taskDescription = `
        Task: Background Replacement / In-Painting / Scene Generation.
        1. Keep the central subject (person or product) EXACTLY as is (Face/Product Details must not change). 
        2. If multiple images are provided, use them to understand the 3D geometry of the object.
        3. Generate a new scene based on: ${optimizedPrompt}
        4. ${referenceImageBase64 ? 'Mimic the style of Image 2.' : ''}
        5. Output Aspect Ratio: ${aspectRatio}.
        6. Target Resolution: ${resolution}.
        7. Ensure realistic integration (shadows/reflections) between subject and new background.
        8. Output Quality: 8k Ultra Sharp.
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