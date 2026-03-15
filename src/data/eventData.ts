export type EventType = 'birthday' | 'engagement' | 'anniversary' | 'retirement' | 'babyshower' | 'housewarming' | 'corporate' | 'festival';
export type ThemeType = 'balloon' | 'floral' | 'elegant' | 'cartoon' | 'neon' | 'romantic' | 'royal';

export const eventTypes: { id: EventType; label: string; emoji: string; description: string }[] = [
  { id: 'birthday', label: 'Birthday', emoji: '🎂', description: 'Celebrate another trip around the sun!' },
  { id: 'engagement', label: 'Engagement', emoji: '💍', description: 'Mark the beginning of forever' },
  { id: 'anniversary', label: 'Marriage Anniversary', emoji: '💑', description: 'Celebrate years of togetherness' },
  { id: 'retirement', label: 'Retirement', emoji: '🎉', description: 'Honor a lifetime of achievement' },
  { id: 'babyshower', label: 'Baby Shower', emoji: '👶', description: 'Welcome the little one!' },
  { id: 'housewarming', label: 'Housewarming', emoji: '🏠', description: 'Celebrate your new home!' },
  { id: 'corporate', label: 'Corporate Party', emoji: '🏢', description: 'Professional events & team celebrations' },
  { id: 'festival', label: 'Festival Celebration', emoji: '🪔', description: 'Celebrate festivals with joy & color' },
];

export const budgetOptions = [10000, 25000, 50000, 100000, 200000];

export const allThemes: Record<ThemeType, { id: ThemeType; label: string; emoji: string; description: string; image: string }> = {
  balloon: { id: 'balloon', label: 'Balloon Theme', emoji: '🎈', description: 'Colorful balloons creating a festive atmosphere', image: '/balloon-stage-1.jpg' },
  floral: { id: 'floral', label: 'Floral Theme', emoji: '🌸', description: 'Beautiful flowers and natural elegance', image: '/floral-stage-1.jpg' },
  elegant: { id: 'elegant', label: 'Elegant Theme', emoji: '✨', description: 'Sophisticated and luxurious décor', image: '/elegant-stage-1.jpg' },
  cartoon: { id: 'cartoon', label: 'Cartoon Theme', emoji: '🦄', description: 'Fun and playful cartoon characters', image: '/cartoon-stage-1.jpg' },
  neon: { id: 'neon', label: 'Neon Glow Theme', emoji: '💡', description: 'Vibrant neon lights & UV glow party vibes', image: '/neon-stage-1.jpg' },
  romantic: { id: 'romantic', label: 'Romantic LED Theme', emoji: '💕', description: 'Fairy lights, roses & dreamy ambiance', image: '/romantic-stage-1.jpg' },
  royal: { id: 'royal', label: 'Royal Gold Theme', emoji: '👑', description: 'Traditional Indian royal gold grandeur', image: '/royal-stage-1.jpg' },
};

// Map each event to its relevant themes
export const eventThemeMap: Record<EventType, ThemeType[]> = {
  birthday: ['cartoon', 'balloon', 'neon'],
  engagement: ['floral', 'romantic', 'royal'],
  anniversary: ['elegant', 'floral', 'romantic'],
  retirement: ['elegant', 'balloon', 'floral'],
  babyshower: ['cartoon', 'balloon', 'floral'],
  housewarming: ['floral', 'elegant', 'royal'],
  corporate: ['elegant', 'balloon', 'neon'],
  festival: ['floral', 'royal', 'neon'],
};

export function getThemesForEvent(eventType: EventType) {
  return eventThemeMap[eventType].map(id => allThemes[id]);
}

// Keep backward compat
export const themes = Object.values(allThemes);

export interface DecorationItem {
  name: string;
  baseCost: number;
  amazonSearch: string;
}

export interface DecorationOption {
  id: string;
  label: string;
  image: string;
  description: string;
}

export type BudgetTier = 'basic' | 'standard' | 'premium' | 'luxury' | 'ultra';

export function getBudgetTier(budget: number): BudgetTier {
  if (budget <= 10000) return 'basic';
  if (budget <= 25000) return 'standard';
  if (budget <= 50000) return 'premium';
  if (budget <= 100000) return 'luxury';
  return 'ultra';
}

export const themeDecorations: Record<ThemeType, Record<BudgetTier, DecorationOption[]>> = {
  balloon: {
    basic: [
      { id: 'balloon-basic-1', label: 'Simple Balloon Bunch', image: '/balloon-basic-1.jpg', description: 'Colorful balloon bunch on table — cheerful home party setup' },
      { id: 'balloon-basic-2', label: 'DIY Balloon Garland', image: '/balloon-basic-2.jpg', description: 'Simple balloon garland on wall with birthday banner' },
    ],
    standard: [
      { id: 'balloon-std-1', label: 'Balloon Arch Stage', image: '/balloon-standard-1.jpg', description: 'Colorful balloon arch over decorated table with LED backdrop' },
      { id: 'balloon-std-2', label: 'Ceiling Balloon Clusters', image: '/balloon-standard-2.jpg', description: 'Floating balloon clusters on ceiling with table balloons' },
    ],
    premium: [
      { id: 'balloon-prem-1', label: 'Pink & Gold Balloon Wall', image: '/balloon-premium-1.jpg', description: 'Massive pink & gold balloon wall with chandelier and stage sofa' },
      { id: 'balloon-prem-2', label: 'Balloon Canopy Stage', image: '/balloon-premium-2.jpg', description: 'Full balloon canopy over stage with foil letters and columns' },
    ],
    luxury: [
      { id: 'balloon-lux-1', label: 'Chrome Balloon Archway', image: '/balloon-luxury-1.jpg', description: 'Grand chrome & metallic balloon archway in premium ballroom' },
      { id: 'balloon-lux-2', label: 'Designer Balloon Wall', image: '/balloon-luxury-2.jpg', description: 'White & gold balloon wall with crystal chandelier and formal seating' },
    ],
    ultra: [
      { id: 'balloon-ultra-1', label: 'Immersive Balloon Room', image: '/balloon-ultra-1.jpg', description: 'Thousands of balloons covering ceiling to floor with neon LED lighting' },
      { id: 'balloon-ultra-2', label: 'Balloon Palace Entrance', image: '/balloon-ultra-2.jpg', description: 'Multiple giant balloon arches with red carpet and chrome balloons' },
    ],
  },
  floral: {
    basic: [
      { id: 'floral-basic-1', label: 'Table Flower Vases', image: '/floral-basic-1.jpg', description: 'Simple flower vases with marigold garlands on wall' },
      { id: 'floral-basic-2', label: 'Doorway Flower Garlands', image: '/floral-basic-2.jpg', description: 'Artificial flower garlands on doorway with marigold strings' },
    ],
    standard: [
      { id: 'floral-std-1', label: 'Hanging Floral Ceiling', image: '/floral-standard-1.jpg', description: 'Flower garlands hanging from ceiling with table arrangements' },
      { id: 'floral-std-2', label: 'Flower Wall Stage', image: '/floral-standard-2.jpg', description: 'Pink & white flower wall backdrop with sofa and arrangements' },
    ],
    premium: [
      { id: 'floral-prem-1', label: 'Grand Floral Mandap', image: '/floral-premium-1.jpg', description: 'Elaborate flower mandap with roses, hanging garlands and warm lighting' },
      { id: 'floral-prem-2', label: 'Flower Wall & Chandeliers', image: '/floral-premium-2.jpg', description: 'Massive flower wall with cascading garlands and crystal chandeliers' },
    ],
    luxury: [
      { id: 'floral-lux-1', label: 'Luxury Flower Stage', image: '/floral-luxury-1.jpg', description: 'Thousands of flowers covering stage, ceiling and floor with chandeliers' },
      { id: 'floral-lux-2', label: 'Indoor Garden Paradise', image: '/floral-luxury-2.jpg', description: 'Venue transformed into garden with hanging flowers and archway' },
    ],
    ultra: [
      { id: 'floral-ultra-1', label: 'Enchanted Flower Tunnel', image: '/floral-ultra-1.jpg', description: 'Entire venue as enchanted garden with flower tunnels and chandeliers' },
      { id: 'floral-ultra-2', label: 'Exotic Flower Palace', image: '/floral-ultra-2.jpg', description: 'Exotic flower installations with cascading arrangements and petal floor' },
    ],
  },
  elegant: {
    basic: [
      { id: 'elegant-basic-1', label: 'Candle & Fairy Lights', image: '/elegant-basic-1.jpg', description: 'Simple candles and fairy lights on wall — cozy elegant setup' },
      { id: 'elegant-basic-2', label: 'White Drape & Candles', image: '/elegant-basic-2.jpg', description: 'White fabric backdrop with candle arrangements on dining table' },
    ],
    standard: [
      { id: 'elegant-std-1', label: 'Gold & White Drapes', image: '/elegant-standard-1.jpg', description: 'Gold and white drape backdrop with chandelier and formal tables' },
      { id: 'elegant-std-2', label: 'Formal Stage Setup', image: '/elegant-standard-2.jpg', description: 'Draped stage with gold runners, candelabras and chair covers' },
    ],
    premium: [
      { id: 'elegant-prem-1', label: 'Ceiling Drapes & Chandeliers', image: '/elegant-premium-1.jpg', description: 'Sweeping gold ceiling drapes with crystal chandelier and gold chargers' },
      { id: 'elegant-prem-2', label: 'Grand Satin Stage', image: '/elegant-premium-2.jpg', description: 'Satin chair covers, crystal chandeliers, gold sequin stage backdrop' },
    ],
    luxury: [
      { id: 'elegant-lux-1', label: 'Palace Ballroom', image: '/elegant-luxury-1.jpg', description: 'Massive crystal chandelier with floor-to-ceiling white & gold drapes' },
      { id: 'elegant-lux-2', label: 'Royal Crystal Stage', image: '/elegant-luxury-2.jpg', description: 'Multiple chandeliers, white drapes, tufted sofa and gold accents' },
    ],
    ultra: [
      { id: 'elegant-ultra-1', label: 'Royal Palace Setup', image: '/elegant-ultra-1.jpg', description: 'Complete royal palace with gold mirrors, crystal installations and luxury furniture' },
      { id: 'elegant-ultra-2', label: 'Bespoke Crystal Hall', image: '/elegant-ultra-2.jpg', description: 'Crystal string ceiling, thousands of candles, red carpet, gold throne' },
    ],
  },
  cartoon: {
    basic: [
      { id: 'cartoon-basic-1', label: 'Character Cutouts & Table', image: '/cartoon-basic-1.jpg', description: 'Simple character cutouts on wall with themed tablecloth and cake' },
      { id: 'cartoon-basic-2', label: 'Banner & Party Setup', image: '/cartoon-basic-2.jpg', description: 'Character banner with themed plates, cups and party hats' },
    ],
    standard: [
      { id: 'cartoon-std-1', label: 'Character Stage', image: '/cartoon-standard-1.jpg', description: 'Stage with character backdrop, balloon arch and themed tables' },
      { id: 'cartoon-std-2', label: 'Colorful Drape Setup', image: '/cartoon-standard-2.jpg', description: 'Colorful drapes with balloon columns and cartoon decorations' },
    ],
    premium: [
      { id: 'cartoon-prem-1', label: 'Grand Character Stage', image: '/cartoon-premium-1.jpg', description: 'Large character cutouts, balloon arch, themed backdrop with castle' },
      { id: 'cartoon-prem-2', label: 'Full Theme Venue', image: '/cartoon-premium-2.jpg', description: 'Complete venue themed with balloon ceiling, character standees and props' },
    ],
    luxury: [
      { id: 'cartoon-lux-1', label: 'Mini Theme Park', image: '/cartoon-luxury-1.jpg', description: 'Venue as mini theme park with castle stage, life-size characters' },
      { id: 'cartoon-lux-2', label: 'Fantasy Stage & LED', image: '/cartoon-luxury-2.jpg', description: 'Giant character balloon sculptures, LED screens and spotlight effects' },
    ],
    ultra: [
      { id: 'cartoon-ultra-1', label: 'Fantasy Castle World', image: '/cartoon-ultra-1.jpg', description: 'Custom built fairy tale castle with theatrical lighting and themed zones' },
      { id: 'cartoon-ultra-2', label: 'Immersive Character World', image: '/cartoon-ultra-2.jpg', description: 'Life-size animatronic characters, special effects and immersive play zones' },
    ],
  },
  neon: {
    basic: [
      { id: 'neon-basic-1', label: 'LED Strip Glow', image: '/neon-basic-1.jpg', description: 'Simple neon LED strips on wall with UV glow sticks — budget home party' },
      { id: 'neon-basic-2', label: 'Neon Sign & Balloons', image: '/neon-basic-2.jpg', description: 'Neon happy birthday sign with glow-in-dark balloons' },
    ],
    standard: [
      { id: 'neon-std-1', label: 'Neon Party Stage', image: '/neon-standard-1.jpg', description: 'Multiple LED neon signs, UV balloons and neon table centerpieces' },
      { id: 'neon-std-2', label: 'Glow Curtain Setup', image: '/neon-standard-2.jpg', description: 'LED curtain lights in neon colors with glow balloons and table setup' },
    ],
    premium: [
      { id: 'neon-prem-1', label: 'DJ Neon Stage', image: '/neon-premium-1.jpg', description: 'Neon ring lights, LED panels, fog machine — premium DJ stage setup' },
      { id: 'neon-prem-2', label: 'Neon Dance Floor', image: '/neon-premium-2.jpg', description: 'Neon arch entrance, LED dance floor and neon tube ceiling installations' },
    ],
    luxury: [
      { id: 'neon-lux-1', label: 'Neon Lounge', image: '/neon-luxury-1.jpg', description: 'Massive LED installations, neon ceiling art, VIP neon lounge areas' },
      { id: 'neon-lux-2', label: 'Neon Art Gallery', image: '/neon-luxury-2.jpg', description: 'Giant neon sculptures, LED pixel walls and laser light effects' },
    ],
    ultra: [
      { id: 'neon-ultra-1', label: 'Neon Tunnel Experience', image: '/neon-ultra-1.jpg', description: 'Immersive LED tunnel entrance with holographic neon art throughout' },
      { id: 'neon-ultra-2', label: 'Neon Palace', image: '/neon-ultra-2.jpg', description: 'Custom neon art ceiling, LED floor, laser shows and fog effects' },
    ],
  },
  romantic: {
    basic: [
      { id: 'romantic-basic-1', label: 'Fairy Lights & Candles', image: '/romantic-basic-1.jpg', description: 'Simple fairy string lights on wall with LED candles and rose petals' },
      { id: 'romantic-basic-2', label: 'LED Heart & Roses', image: '/romantic-basic-2.jpg', description: 'LED heart sign on wall with fairy light curtain and rose bouquets' },
    ],
    standard: [
      { id: 'romantic-std-1', label: 'Love Light Stage', image: '/romantic-standard-1.jpg', description: 'Fairy light backdrop curtain with LED love letters and rose arrangements' },
      { id: 'romantic-std-2', label: 'Candle Aisle Setup', image: '/romantic-standard-2.jpg', description: 'LED candle pathway, pink drapes, flower arrangements and couple stage' },
    ],
    premium: [
      { id: 'romantic-prem-1', label: 'Heart Arch Stage', image: '/romantic-premium-1.jpg', description: 'Cascading fairy light waterfall, LED heart arch and hundreds of roses' },
      { id: 'romantic-prem-2', label: 'Starry Canopy', image: '/romantic-premium-2.jpg', description: 'LED starry ceiling canopy, rose petal aisle and crystal candle holders' },
    ],
    luxury: [
      { id: 'romantic-lux-1', label: 'Fairy Tale Hall', image: '/romantic-luxury-1.jpg', description: 'Thousands of fairy lights as starry sky, massive rose installations' },
      { id: 'romantic-lux-2', label: 'Rose Tunnel', image: '/romantic-luxury-2.jpg', description: 'LED tunnel entrance, rose walls, floating candles and crystal decor' },
    ],
    ultra: [
      { id: 'romantic-ultra-1', label: 'Romantic Wonderland', image: '/romantic-ultra-1.jpg', description: 'Entire ceiling fairy lights, thousands of roses, crystal installations' },
      { id: 'romantic-ultra-2', label: 'Rose Palace', image: '/romantic-ultra-2.jpg', description: 'Massive rose wall backdrop, crystal chandelier, fog and spotlight effects' },
    ],
  },
  royal: {
    basic: [
      { id: 'royal-basic-1', label: 'Gold Drape & Diyas', image: '/royal-basic-1.jpg', description: 'Gold fabric drape on wall with marigold garlands and brass diya lamps' },
      { id: 'royal-basic-2', label: 'Traditional Puja Setup', image: '/royal-basic-2.jpg', description: 'Gold cloth backdrop with marigold torans, brass kalash and diyas' },
    ],
    standard: [
      { id: 'royal-std-1', label: 'Gold Throne Stage', image: '/royal-standard-1.jpg', description: 'Gold drape backdrop with throne chairs, red carpet and brass urlis' },
      { id: 'royal-std-2', label: 'Gold Mandap Stage', image: '/royal-standard-2.jpg', description: 'Gold and red fabric mandap with flower garlands and brass lamps' },
    ],
    premium: [
      { id: 'royal-prem-1', label: 'Royal Pillar Stage', image: '/royal-premium-1.jpg', description: 'Ornate gold mandap with carved pillars, marigold garlands and chandelier' },
      { id: 'royal-prem-2', label: 'Grand Ceremony Stage', image: '/royal-premium-2.jpg', description: 'Elaborate gold arch with red and gold flowers and professional lighting' },
    ],
    luxury: [
      { id: 'royal-lux-1', label: 'Palace Darbar', image: '/royal-luxury-1.jpg', description: 'Massive golden mandap with intricate carvings and crystal chandeliers' },
      { id: 'royal-lux-2', label: 'Royal Ballroom', image: '/royal-luxury-2.jpg', description: 'Gold pillars, red and gold drapes, multiple chandeliers, royal reception' },
    ],
    ultra: [
      { id: 'royal-ultra-1', label: 'Maharaja Palace', image: '/royal-ultra-1.jpg', description: 'Entire hall in gold, massive carved mandap, crystal chandeliers, royal throne' },
      { id: 'royal-ultra-2', label: 'Imperial Gold Hall', image: '/royal-ultra-2.jpg', description: 'Golden dome ceiling, enormous pillars, floral cascades, maharaja style' },
    ],
  },
};

export const themeItems: Record<ThemeType, DecorationItem[]> = {
  balloon: [
    { name: 'Helium Balloons (50 pcs)', baseCost: 800, amazonSearch: 'helium+balloons+party+50+pack' },
    { name: 'Balloon Arch Kit', baseCost: 1200, amazonSearch: 'balloon+arch+decoration+kit' },
    { name: 'LED Balloon Lights', baseCost: 500, amazonSearch: 'LED+balloon+lights+party' },
    { name: 'Balloon Pump', baseCost: 300, amazonSearch: 'balloon+pump+electric' },
    { name: 'Confetti Balloons (20 pcs)', baseCost: 400, amazonSearch: 'confetti+balloons+gold' },
    { name: 'Foil Number/Letter Balloons', baseCost: 600, amazonSearch: 'foil+letter+balloons+gold' },
    { name: 'Ribbon & String', baseCost: 150, amazonSearch: 'balloon+ribbon+curling' },
    { name: 'Balloon Weights', baseCost: 250, amazonSearch: 'balloon+weights+party' },
  ],
  floral: [
    { name: 'Artificial Flower Garlands (5 pcs)', baseCost: 1500, amazonSearch: 'artificial+flower+garland+decoration' },
    { name: 'Rose Petals (1000 pcs)', baseCost: 400, amazonSearch: 'rose+petals+decoration+1000' },
    { name: 'Flower Vases (Set of 3)', baseCost: 1200, amazonSearch: 'flower+vase+decoration+set' },
    { name: 'Marigold Strings (10 pcs)', baseCost: 600, amazonSearch: 'marigold+flower+string+decoration' },
    { name: 'Floral Backdrop Curtain', baseCost: 2000, amazonSearch: 'floral+backdrop+curtain+party' },
    { name: 'LED Fairy Lights', baseCost: 500, amazonSearch: 'LED+fairy+lights+warm+white' },
    { name: 'Floral Centerpieces', baseCost: 800, amazonSearch: 'floral+centerpiece+table+decoration' },
    { name: 'Potpourri & Fragrance', baseCost: 300, amazonSearch: 'potpourri+fragrance+party' },
  ],
  elegant: [
    { name: 'Gold & White Drapes', baseCost: 2500, amazonSearch: 'gold+white+drape+backdrop+decoration' },
    { name: 'Crystal Candle Holders (Set of 6)', baseCost: 1800, amazonSearch: 'crystal+candle+holder+set+elegant' },
    { name: 'LED Candles (12 pcs)', baseCost: 600, amazonSearch: 'LED+candles+flameless+elegant' },
    { name: 'Gold Table Runner', baseCost: 500, amazonSearch: 'gold+table+runner+elegant' },
    { name: 'Premium Photo Backdrop', baseCost: 2000, amazonSearch: 'premium+photo+backdrop+party' },
    { name: 'Champagne Glass Set (12 pcs)', baseCost: 1200, amazonSearch: 'champagne+glass+set+12+elegant' },
    { name: 'Satin Chair Covers (10 pcs)', baseCost: 1500, amazonSearch: 'satin+chair+covers+party' },
    { name: 'Gold Sequin Tablecloth', baseCost: 800, amazonSearch: 'gold+sequin+tablecloth' },
  ],
  cartoon: [
    { name: 'Cartoon Character Balloons', baseCost: 600, amazonSearch: 'cartoon+character+foil+balloons' },
    { name: 'Themed Paper Plates (50 pcs)', baseCost: 400, amazonSearch: 'cartoon+theme+paper+plates+party' },
    { name: 'Character Cutouts (5 pcs)', baseCost: 800, amazonSearch: 'cartoon+character+cutout+standee' },
    { name: 'Themed Tablecloth', baseCost: 300, amazonSearch: 'cartoon+themed+tablecloth+party' },
    { name: 'Party Hats (20 pcs)', baseCost: 250, amazonSearch: 'cartoon+party+hats+kids' },
    { name: 'Themed Banner & Bunting', baseCost: 350, amazonSearch: 'cartoon+banner+bunting+party' },
    { name: 'Goodie Bags (20 pcs)', baseCost: 500, amazonSearch: 'cartoon+goodie+bags+party+kids' },
    { name: 'Photo Props Kit', baseCost: 400, amazonSearch: 'cartoon+photo+props+party+kit' },
  ],
  neon: [
    { name: 'LED Neon Strip Lights (5m)', baseCost: 800, amazonSearch: 'LED+neon+strip+lights+party' },
    { name: 'Neon Sign (Happy Birthday/Party)', baseCost: 1500, amazonSearch: 'neon+sign+happy+birthday+party' },
    { name: 'UV Blacklight Bulbs (4 pcs)', baseCost: 600, amazonSearch: 'UV+blacklight+bulb+party' },
    { name: 'Glow Sticks (100 pcs)', baseCost: 400, amazonSearch: 'glow+sticks+party+bulk' },
    { name: 'Neon Balloons (30 pcs)', baseCost: 500, amazonSearch: 'neon+glow+balloons+UV+reactive' },
    { name: 'Fog Machine', baseCost: 2000, amazonSearch: 'fog+machine+party+LED' },
    { name: 'LED Curtain Lights', baseCost: 700, amazonSearch: 'LED+curtain+lights+neon+colors' },
    { name: 'Neon Table Centerpieces', baseCost: 450, amazonSearch: 'neon+glow+centerpiece+party' },
  ],
  romantic: [
    { name: 'Fairy Light Curtain (3m x 3m)', baseCost: 800, amazonSearch: 'fairy+light+curtain+warm+white' },
    { name: 'LED Heart Neon Sign', baseCost: 1200, amazonSearch: 'LED+heart+neon+sign+romantic' },
    { name: 'Rose Petals (2000 pcs)', baseCost: 600, amazonSearch: 'rose+petals+red+romantic+decoration' },
    { name: 'LED Candles (20 pcs)', baseCost: 800, amazonSearch: 'LED+candles+flameless+romantic' },
    { name: 'Pink Satin Drapes', baseCost: 1500, amazonSearch: 'pink+satin+drape+backdrop+romantic' },
    { name: 'Rose Bouquets (6 pcs)', baseCost: 1000, amazonSearch: 'artificial+rose+bouquet+romantic' },
    { name: 'Love Letter Marquee Lights', baseCost: 1200, amazonSearch: 'LOVE+marquee+letter+lights' },
    { name: 'Crystal Votive Holders (12 pcs)', baseCost: 900, amazonSearch: 'crystal+votive+candle+holder+romantic' },
  ],
  royal: [
    { name: 'Gold Fabric Drapes', baseCost: 2000, amazonSearch: 'gold+fabric+drape+backdrop+Indian' },
    { name: 'Marigold Garlands (20 pcs)', baseCost: 800, amazonSearch: 'marigold+garland+decoration+Indian' },
    { name: 'Brass Diya Lamps (12 pcs)', baseCost: 1000, amazonSearch: 'brass+diya+lamp+Indian+decoration' },
    { name: 'Gold Throne Chair Covers', baseCost: 1500, amazonSearch: 'gold+throne+chair+cover+royal' },
    { name: 'Red Carpet Runner', baseCost: 800, amazonSearch: 'red+carpet+runner+event' },
    { name: 'Brass Kalash & Urli Set', baseCost: 1200, amazonSearch: 'brass+kalash+urli+decoration' },
    { name: 'Gold Toran & Door Hangings', baseCost: 600, amazonSearch: 'gold+toran+door+hanging+Indian' },
    { name: 'Crystal Chandelier (LED)', baseCost: 2500, amazonSearch: 'crystal+chandelier+LED+party' },
  ],
};

export const themeImages: Record<ThemeType, string[]> = {
  balloon: ['/balloon-premium-1.jpg', '/balloon-luxury-1.jpg', '/balloon-ultra-1.jpg'],
  floral: ['/floral-premium-1.jpg', '/floral-luxury-1.jpg', '/floral-ultra-1.jpg'],
  elegant: ['/elegant-premium-1.jpg', '/elegant-luxury-1.jpg', '/elegant-ultra-1.jpg'],
  cartoon: ['/cartoon-premium-1.jpg', '/cartoon-luxury-1.jpg', '/cartoon-ultra-1.jpg'],
  neon: ['/neon-premium-1.jpg', '/neon-luxury-1.jpg', '/neon-ultra-1.jpg'],
  romantic: ['/romantic-premium-1.jpg', '/romantic-luxury-1.jpg', '/romantic-ultra-1.jpg'],
  royal: ['/royal-premium-1.jpg', '/royal-luxury-1.jpg', '/royal-ultra-1.jpg'],
};

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export function getScaledItems(theme: ThemeType, budget: number) {
  const decorationBudget = budget * 0.5;
  const items = themeItems[theme];
  const totalBaseCost = items.reduce((sum, item) => sum + item.baseCost, 0);
  const scale = decorationBudget / totalBaseCost;

  return items.map(item => ({
    ...item,
    scaledCost: Math.round(item.baseCost * scale),
    amazonUrl: `https://www.amazon.in/s?k=${item.amazonSearch}`,
  }));
}
