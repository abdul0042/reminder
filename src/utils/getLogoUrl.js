// Reliable logo mappings for popular services
const DOMAIN_MAPPINGS = {
  chatgpt: 'chatgpt.com',
  openai: 'openai.com',
  adobe: 'adobe.com',
  'adobe creative cloud': 'adobe.com',
  spotify: 'spotify.com',
  netflix: 'netflix.com',
  youtube: 'youtube.com',
  'youtube music': 'youtube.com',
  amazon: 'amazon.in',
  'amazon prime': 'amazon.in',
  apple: 'apple.com',
  'apple icloud+': 'apple.com',
  figma: 'figma.com',
  github: 'github.com',
  'github copilot': 'github.com',
  hotstar: 'hotstar.com',
  'disney+ hotstar': 'hotstar.com',
  'jio cinema': 'jiocinema.com',
  sonyliv: 'sonyliv.com',
  zee5: 'zee5.com',
  audible: 'audible.in',
  notion: 'notion.so',
  slack: 'slack.com',
  zoom: 'zoom.us',
  canva: 'canva.com',
  swiggy: 'swiggy.com',
  zomato: 'zomato.com',
  duolingo: 'duolingo.com',
  coursera: 'coursera.org',
  nordvpn: 'nordvpn.com',
  xbox: 'xbox.com',
  playstation: 'playstation.com',
  discord: 'discord.com'
};

export function getLogoUrl(serviceName, website = '') {
  if (!serviceName) return null;
  const nameLower = serviceName.toLowerCase().trim();

  // 1. If explicit website domain provided
  if (website) {
    try {
      const cleanHost = website.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
      if (cleanHost) {
        return `https://www.google.com/s2/favicons?domain=${cleanHost}&sz=128`;
      }
    } catch (e) {}
  }

  // 2. Check DOMAIN_MAPPINGS
  for (const [key, domain] of Object.entries(DOMAIN_MAPPINGS)) {
    if (nameLower.includes(key)) {
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    }
  }

  // 3. Fallback to Google Favicons using sanitized name + .com
  const sanitized = nameLower.replace(/[^a-z0-9]/g, '');
  if (sanitized) {
    return `https://www.google.com/s2/favicons?domain=${sanitized}.com&sz=128`;
  }

  return null;
}
