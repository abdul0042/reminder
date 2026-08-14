export const PRESET_SERVICES = [
  {
    name: 'Netflix',
    category: 'Entertainment',
    defaultPrice: 649,
    accentColor: '#E50914',
    website: 'https://netflix.com',
    planTiers: ['Mobile (₹149)', 'Basic (₹199)', 'Standard (₹499)', 'Premium 4K (₹649)']
  },
  {
    name: 'Spotify',
    category: 'Music',
    defaultPrice: 119,
    accentColor: '#1DB954',
    website: 'https://spotify.com',
    planTiers: ['Individual (₹119)', 'Duo (₹149)', 'Family (₹179)', 'Student (₹59)']
  },
  {
    name: 'YouTube Premium',
    category: 'Entertainment',
    defaultPrice: 149,
    accentColor: '#FF0000',
    website: 'https://youtube.com',
    planTiers: ['Individual (₹149)', 'Family (₹189)', 'Student (₹79)']
  },
  {
    name: 'ChatGPT Plus',
    category: 'AI & Tech',
    defaultPrice: 1999,
    accentColor: '#10A37F',
    website: 'https://chatgpt.com',
    planTiers: ['Free (₹0)', 'Plus (₹1,999)', 'Team (₹2,200/user)']
  },
  {
    name: 'Amazon Prime',
    category: 'Shopping',
    defaultPrice: 299,
    accentColor: '#FF9900',
    website: 'https://amazon.in',
    planTiers: ['Monthly Prime (₹299)', 'Annual Prime (₹1,499)', 'Shopping Edition (₹399)']
  },
  {
    name: 'Apple iCloud+',
    category: 'Cloud Storage',
    defaultPrice: 219,
    accentColor: '#007AFF',
    website: 'https://apple.com',
    planTiers: ['50 GB (₹75)', '200 GB (₹219)', '2 TB (₹749)']
  },
  {
    name: 'Adobe Creative Cloud',
    category: 'Productivity',
    defaultPrice: 4230,
    accentColor: '#FF0000',
    website: 'https://adobe.com',
    planTiers: ['Single App (₹1,675)', 'All Apps Suite (₹4,230)']
  },
  {
    name: 'Figma',
    category: 'Design',
    defaultPrice: 1250,
    accentColor: '#F24E1E',
    website: 'https://figma.com',
    planTiers: ['Professional (₹1,250)', 'Organization (₹3,750)']
  },
  {
    name: 'GitHub Copilot',
    category: 'AI & Tech',
    defaultPrice: 850,
    accentColor: '#2DBA4E',
    website: 'https://github.com',
    planTiers: ['Individual (₹850)', 'Business (₹1,600)']
  },
  {
    name: 'Disney+ Hotstar',
    category: 'Entertainment',
    defaultPrice: 299,
    accentColor: '#113CCF',
    website: 'https://hotstar.com',
    planTiers: ['Super (₹299/3mo)', 'Premium Monthly (₹299)', 'Premium Annual (₹1,499)']
  },
  {
    name: 'Xbox Game Pass',
    category: 'Gaming',
    defaultPrice: 549,
    accentColor: '#107C41',
    website: 'https://xbox.com',
    planTiers: ['PC Pass (₹349)', 'Ultimate (₹549)']
  }
];

export const CATEGORIES = [
  'All',
  'Entertainment',
  'Music',
  'Productivity',
  'Design',
  'AI & Tech',
  'Cloud Storage',
  'Shopping',
  'Gaming',
  'Career'
];

export const CURRENCIES = [
  { code: 'INR', symbol: '₹', rate: 1 },
  { code: 'USD', symbol: '$', rate: 0.012 },
  { code: 'EUR', symbol: '€', rate: 0.011 },
  { code: 'GBP', symbol: '£', rate: 0.0094 }
];
