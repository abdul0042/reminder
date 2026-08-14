// Reliable high-res brand logo URLs for popular subscription services
const BRAND_LOGOS = {
  spotify: 'https://cdn.simpleicons.org/spotify/1DB954',
  netflix: 'https://cdn.simpleicons.org/netflix/E50914',
  youtube: 'https://cdn.simpleicons.org/youtube/FF0000',
  google: 'https://cdn.simpleicons.org/google/4285F4',
  'google one': 'https://cdn.simpleicons.org/google/4285F4',
  chatgpt: 'https://cdn.simpleicons.org/openai/10A37F',
  openai: 'https://cdn.simpleicons.org/openai/10A37F',
  amazon: 'https://cdn.simpleicons.org/amazon/FF9900',
  'amazon prime': 'https://cdn.simpleicons.org/amazon/FF9900',
  prime: 'https://cdn.simpleicons.org/amazon/FF9900',
  apple: 'https://cdn.simpleicons.org/apple/000000',
  'apple icloud+': 'https://cdn.simpleicons.org/apple/000000',
  adobe: 'https://cdn.simpleicons.org/adobe/FF0000',
  'adobe creative cloud': 'https://cdn.simpleicons.org/adobe/FF0000',
  figma: 'https://cdn.simpleicons.org/figma/F24E1E',
  github: 'https://cdn.simpleicons.org/github/181717',
  'github copilot': 'https://cdn.simpleicons.org/github/181717',
  disney: 'https://cdn.simpleicons.org/disneyplus/113CCF',
  'disney+ hotstar': 'https://cdn.simpleicons.org/disneyplus/113CCF',
  hotstar: 'https://cdn.simpleicons.org/disneyplus/113CCF',
  xbox: 'https://cdn.simpleicons.org/xbox/107C41',
  'xbox game pass': 'https://cdn.simpleicons.org/xbox/107C41',
  linkedin: 'https://cdn.simpleicons.org/linkedin/0A66C2',
  canva: 'https://cdn.simpleicons.org/canva/00C4CC',
  notion: 'https://cdn.simpleicons.org/notion/000000',
  midjourney: 'https://cdn.simpleicons.org/midjourney/000000',
  hulu: 'https://cdn.simpleicons.org/hulu/1CE783',
  playstation: 'https://cdn.simpleicons.org/playstation/003791',
  slack: 'https://cdn.simpleicons.org/slack/4A154B',
  jio: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Reliance_Jio_Logo.svg',
  airtel: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Airtel_logo.svg',
  vi: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Vodafone_Idea_Logo.svg',
  vodafone: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Vodafone_Idea_Logo.svg'
};

export function getLogoUrl(serviceName, website = '') {
  if (!serviceName) return null;
  const nameLower = serviceName.toLowerCase().trim();

  // 1. Direct match or key match in BRAND_LOGOS
  for (const [key, logoUrl] of Object.entries(BRAND_LOGOS)) {
    if (nameLower.includes(key)) {
      return logoUrl;
    }
  }

  // 2. Domain-based fallback from website url if provided
  if (website) {
    try {
      const cleanHost = website.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
      if (cleanHost) {
        return `https://www.google.com/s2/favicons?domain=${cleanHost}&sz=128`;
      }
    } catch (e) {
      // Fallback
    }
  }

  // 3. Fallback to Google Favicons using service name + .com
  const sanitized = nameLower.replace(/[^a-z0-9]/g, '');
  if (sanitized) {
    return `https://www.google.com/s2/favicons?domain=${sanitized}.com&sz=128`;
  }

  return null;
}
