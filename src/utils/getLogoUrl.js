// Sleek monochrome black brand logo URLs for popular subscription services
const BRAND_LOGOS = {
  spotify: 'https://cdn.simpleicons.org/spotify/1C1917',
  netflix: 'https://cdn.simpleicons.org/netflix/1C1917',
  youtube: 'https://cdn.simpleicons.org/youtube/1C1917',
  google: 'https://cdn.simpleicons.org/google/1C1917',
  'google one': 'https://cdn.simpleicons.org/google/1C1917',
  chatgpt: 'https://cdn.simpleicons.org/openai/1C1917',
  openai: 'https://cdn.simpleicons.org/openai/1C1917',
  amazon: 'https://cdn.simpleicons.org/amazon/1C1917',
  'amazon prime': 'https://cdn.simpleicons.org/amazon/1C1917',
  prime: 'https://cdn.simpleicons.org/amazon/1C1917',
  apple: 'https://cdn.simpleicons.org/apple/1C1917',
  'apple icloud+': 'https://cdn.simpleicons.org/apple/1C1917',
  adobe: 'https://cdn.simpleicons.org/adobe/1C1917',
  'adobe creative cloud': 'https://cdn.simpleicons.org/adobe/1C1917',
  figma: 'https://cdn.simpleicons.org/figma/1C1917',
  github: 'https://cdn.simpleicons.org/github/1C1917',
  'github copilot': 'https://cdn.simpleicons.org/github/1C1917',
  disney: 'https://cdn.simpleicons.org/disneyplus/1C1917',
  'disney+ hotstar': 'https://cdn.simpleicons.org/disneyplus/1C1917',
  hotstar: 'https://cdn.simpleicons.org/disneyplus/1C1917',
  xbox: 'https://cdn.simpleicons.org/xbox/1C1917',
  'xbox game pass': 'https://cdn.simpleicons.org/xbox/1C1917',
  linkedin: 'https://cdn.simpleicons.org/linkedin/1C1917',
  canva: 'https://cdn.simpleicons.org/canva/1C1917',
  notion: 'https://cdn.simpleicons.org/notion/1C1917',
  midjourney: 'https://cdn.simpleicons.org/midjourney/1C1917',
  hulu: 'https://cdn.simpleicons.org/hulu/1C1917',
  playstation: 'https://cdn.simpleicons.org/playstation/1C1917',
  slack: 'https://cdn.simpleicons.org/slack/1C1917',
  jio: 'https://cdn.simpleicons.org/jio/1C1917',
  airtel: 'https://cdn.simpleicons.org/airtel/1C1917',
  vi: 'https://cdn.simpleicons.org/vodafone/1C1917',
  vodafone: 'https://cdn.simpleicons.org/vodafone/1C1917'
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
