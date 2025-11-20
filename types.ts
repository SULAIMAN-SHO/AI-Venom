export enum StylePreset {
  DEVELOPER_PRO = 'DEVELOPER_PRO',
  SMART_AD = 'SMART_AD',
  REMOVE_BG = 'REMOVE_BG', 
  PORTRAIT = 'PORTRAIT',
  VINTAGE = 'VINTAGE',
  HYPER_REAL = 'HYPER_REAL',
  MINIMALIST = 'MINIMALIST',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  THREE_D = 'THREE_D',
  OCTANE = 'OCTANE',
  NATURE = 'NATURE',
  LUXURY = 'LUXURY',
  AD_FANTASY = 'AD_FANTASY',
  UPSCALE = 'UPSCALE'
}

export enum SubjectPose {
  DEFAULT = 'تلقائي (حسب الصورة)',
  SITTING_DESK = 'جالس على كرسي مكتب (عمل)',
  STANDING_CONFIDENT = 'واقف بثقة (Presentation)',
  FULL_BODY = 'صورة كاملة للجسم (Full Body)',
  CLOSE_UP = 'صورة قريبة للوجه (Headshot)',
  LOW_ANGLE_HERO = 'زاوية بطولية من الأسفل',
  SIDE_PROFILE = 'بروفايل جانبي',
  BUSY_TYPING = 'منهمك في الكتابة (Coding)',
  WIDE_SHOT = 'لقطة واسعة مع المحيط'
}

export enum FaceDirection {
  CAMERA = 'نظر للكاميرا مباشرة (Eye Contact)',
  AWAY = 'نظر بعيداً (شارد / Candid)',
  LEFT = 'نظر لجهة اليسار',
  RIGHT = 'نظر لجهة اليمين',
  UP = 'نظر للأعلى (إلهام/تفكير)',
  DOWN = 'نظر للأسفل (تركيز/عمل)',
  SCREEN = 'نظر للشاشة (للمبرمجين)',
  CLOSED = 'مغمض العينين (تأمل)'
}

export enum CameraAngle {
  EYE_LEVEL = 'مستوى العين (طبيعي)',
  LOW_ANGLE = 'زاوية سفلية (Hero)',
  TOP_DOWN = 'من الأعلى (Flat Lay)',
  RIGHT_SIDE = 'من اليمين',
  LEFT_SIDE = 'من اليسار',
  BACK = 'من الخلف'
}

export enum LightingPreset {
  NONE = 'تلقائي (Auto)',
  SOFTBOX = 'إضاءة استوديو ناعمة (Softbox)',
  RIM = 'إضاءة خلفية (Rim Light)',
  SPOTLIGHT = 'إضاءة مركزة (Spotlight)',
  AMBIENT = 'إضاءة محيطية هادئة',
  NEON = 'نيون (Cyberpunk)',
  SUNLIGHT = 'ضوء شمس طبيعي',
  DRAMATIC = 'سينمائي درامي'
}

export enum Resolution {
  FHD = 'دقة عالية (FHD)',
  QHD = 'دقة فائقة (2K)',
  UHD = 'دقة سينمائية (4K)'
}

export enum AspectRatio {
  SQUARE = '1:1 (مربع)',
  PORTRAIT = '4:5 (بورتريه)',
  STORY = '9:16 (ستوري)',
  LANDSCAPE = '16:9 (عريض)',
  WIDE = '2:1 (سينمائي)'
}

export enum SocialPlatform {
  INSTAGRAM_POST = 'Instagram Post',
  INSTAGRAM_PORTRAIT = 'Instagram Portrait',
  INSTAGRAM_STORY = 'Story / TikTok',
  YOUTUBE_THUMBNAIL = 'YouTube Thumbnail',
  FACEBOOK_COVER = 'Facebook Cover',
  TWITTER_POST = 'Twitter / X Post'
}

export interface GenerationConfig {
  prompt: string; 
  style: StylePreset;
  angle: CameraAngle;
  lighting: LightingPreset;
  resolution: Resolution;
  aspectRatio: AspectRatio; 
  backgroundColor: string;
}

export interface AppState {
  originalImage: string | null; 
  referenceImage: string | null;
  generatedImage: string | null; 
  isProcessing: boolean;
  error: string | null;
  processingStep: string; 
}

export const STYLE_DEFINITIONS: Record<StylePreset, { label: string; icon: string; promptSuffix: string }> = {
  [StylePreset.DEVELOPER_PRO]: {
    label: 'محترف برمجيات (شخصي)',
    icon: '👨‍💻',
    promptSuffix: 'Masterpiece portrait of a software engineer, futuristic setup, holographic screens, matrix code, cyber atmosphere.'
  },
  [StylePreset.SMART_AD]: {
    label: 'إعلان ذكي (منتجات)',
    icon: '🧠',
    promptSuffix: 'Analyze the product category. Generate a suitable commercial background.'
  },
  [StylePreset.REMOVE_BG]: { 
    label: 'تفريغ الخلفية', 
    icon: '✂️', 
    promptSuffix: 'Solid white background #FFFFFF. Product isolation. No shadows, no props. Pure clean studio cutout style.' 
  },
  [StylePreset.UPSCALE]: { 
    label: 'رفع الدقة فقط', 
    icon: '⚡', 
    promptSuffix: 'high fidelity, 4k upscaling, sharpen details, denoise, preserve original background' 
  },
  [StylePreset.AD_FANTASY]: { 
    label: 'إعلان خيالي', 
    icon: '✨', 
    promptSuffix: 'surreal advertising masterpiece, defying gravity, magical atmosphere, electric energy' 
  },
  [StylePreset.PORTRAIT]: { 
    label: 'بورتريه', 
    icon: '👤', 
    promptSuffix: 'portrait photography, bokeh background, focus on product' 
  },
  [StylePreset.VINTAGE]: { 
    label: 'كلاسيكي', 
    icon: '📻', 
    promptSuffix: 'vintage aesthetic, retro styling, warm film grain' 
  },
  [StylePreset.HYPER_REAL]: { 
    label: 'واقعي جداً', 
    icon: '👁️', 
    promptSuffix: 'hyper-realistic, 8k resolution, sharp focus' 
  },
  [StylePreset.MINIMALIST]: { 
    label: 'بسيط', 
    icon: '⬜', 
    promptSuffix: 'minimalist design, clean solid background, modern' 
  },
  [StylePreset.SOCIAL_MEDIA]: { 
    label: 'سوشيال ميديا', 
    icon: '📱', 
    promptSuffix: 'instagram aesthetic, bright colors, lifestyle setting' 
  },
  [StylePreset.THREE_D]: { 
    label: 'ثلاثي الأبعاد', 
    icon: '🧊', 
    promptSuffix: '3D render style, perfect geometry, soft shadows' 
  },
  [StylePreset.OCTANE]: { 
    label: 'سينمائي', 
    icon: '🎬', 
    promptSuffix: 'cinematic lighting, octane render, dramatic atmosphere' 
  },
  [StylePreset.NATURE]: { 
    label: 'طبيعة', 
    icon: '🌿', 
    promptSuffix: 'surrounded by nature, organic elements, sunlight' 
  },
  [StylePreset.LUXURY]: { 
    label: 'فاخر', 
    icon: '💎', 
    promptSuffix: 'luxury setting, black marble, gold accents, premium' 
  }
};