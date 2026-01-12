
import { Region } from './types';

export const REGIONS: Region[] = [
  { 
    id: 'ukraine', 
    name: 'Ukraine', 
    lat: 48.3794, 
    lng: 31.1656, 
    zoom: 6, 
    description: 'Ongoing Russo-Ukrainian war dynamics.',
    monitoredSources: [
      { name: 'DeepStateUA', url: 'https://t.me/DeepStateUA', alignment: 'Pro-Ukraine/Map' },
      { name: 'War Mapper', url: 'https://x.com/War_Mapper', alignment: 'OSINT/Visual' },
      { name: 'Osinttechnical', url: 'https://x.com/Osinttechnical', alignment: 'Combat Footage/OSINT' }
    ]
  },
  { 
    id: 'syria', 
    name: 'Syria', 
    lat: 34.8021, 
    lng: 38.9968, 
    zoom: 7, 
    description: 'Consolidated political landscape following major shifts in governance.',
    monitoredSources: [
      { name: 'Intel Rojava', url: 'https://t.me/Intel_Rojava', alignment: 'Pro-SDF/Rojava' },
      { name: 'Kurdish Front Reports', url: 'https://t.me/KurdishFrontReports', alignment: 'Pro-SDF/Rojava' },
      { name: 'Kurdish Front News', url: 'https://t.me/KurdishFrontNews', alignment: 'Pro-SDF/Rojava' },
      { name: 'HRE Official', url: 'https://t.me/HRE_official_kurdish', alignment: 'Pro-SDF/Rojava' },
      { name: 'Idlib Marsad', url: 'https://t.me/idlib_marsad', alignment: 'pro-government' },
      { name: 'ALLMHARAR', url: 'https://t.me/ALLMHARAR', alignment: 'pro-government' },
      { name: 'Step News', url: 'https://t.me/stepnews', alignment: 'pro-government' },
      { name: 'Azaz News', url: 'https://t.me/Azaz_News1', alignment: 'pro-government' },
      { name: 'Khalil Kh', url: 'https://t.me/khalil124kh', alignment: 'pro-government' },
      { name: 'Hawran OSINT', url: 'https://t.me/hawran_osint', alignment: 'Druze/Southern' },
      { name: 'Suwayda 24/7', url: 'https://t.me/+g7Jum6v4Pwc5Nzc8', alignment: 'Druze/Southern' },
      { name: 'Assyria News', url: 'https://t.me/AssyriaNewsNetwork', alignment: 'Assyrian/Minority' },
      { name: 'Assyrian Files', url: 'https://t.me/AssyrianFiles', alignment: 'Assyrian/Minority' },
      { name: 'Protest Syria', url: 'https://t.me/protest_syria', alignment: 'pro-government' }
    ],
    territories: [
      {
        id: 'pro-government',
        name: 'Pro-Government (Consolidated)',
        color: '#22c55e', // Green
        coordinates: [[
          // NORTH: High-precision trace south of Turkey Border
          [36.65, 36.15], [36.65, 36.40], [36.60, 36.60], [36.62, 36.90], [36.55, 37.10], [36.50, 37.40], [36.45, 37.80], [36.10, 38.30], [35.80, 38.40], [35.50, 38.80], [34.80, 40.20],
          // EAST: Iraq border trace
          [34.40, 40.85], [33.80, 40.10], [33.40, 39.50], [33.10, 39.00], [32.35, 38.80],
          // SOUTH: Jordan border trace (32.3N)
          [32.30, 38.50], [32.30, 38.00], [32.35, 37.50], [32.30, 37.20], [32.30, 36.80], [32.35, 36.50],
          // LEBANON: High-fidelity mountain-ridge tracing (Safe Buffer)
          [33.10, 36.05], [33.25, 36.20], [33.50, 36.40], [33.80, 36.55], [34.10, 36.65], [34.45, 36.50], [34.65, 36.15], [34.80, 35.95],
          // COAST: Buffer from Mediterranean Sea
          [35.10, 35.85], [35.40, 35.90], [35.80, 35.85], [36.10, 35.90], [36.40, 36.00]
        ]]
      },
      {
        id: 'sdf-rojava',
        name: 'SDF (Rojava)',
        color: '#fbbf24', // Yellow
        coordinates: [[
          // NORTH: High-precision trace south of Turkish Border
          [36.75, 38.10], [36.85, 39.00], [36.95, 40.00], [37.05, 41.00], [37.15, 41.80], [37.20, 42.20],
          // EAST: Iraq border trace
          [36.50, 42.30], [36.00, 42.10], [35.50, 40.90], [35.20, 40.60],
          // SOUTH/WEST: Front-line boundary trace (Euphrates/Tabqa line)
          [35.40, 40.00], [35.70, 39.50], [35.90, 38.80], [36.20, 38.20], [36.50, 38.00]
        ]]
      },
      {
        id: 'druze-suwayda',
        name: 'Druze Autonomy (Suwayda)',
        color: '#3b82f6', // Blue
        coordinates: [[
          [32.40, 36.45], [32.85, 36.45], [32.95, 36.65], [32.95, 36.90], [32.40, 36.90]
        ]]
      }
    ]
  },
  { 
    id: 'israel-palestine', 
    name: 'Israel-Palestine', 
    lat: 31.0461, 
    lng: 34.8516, 
    zoom: 8, 
    description: 'Active combat monitoring across Gaza and regional borders.',
    monitoredSources: [
      { name: 'Aurora Intel', url: 'https://x.com/AuroraIntel', alignment: 'OSINT/Regional' },
      { name: 'Sentinel Defender', url: 'https://x.com/sentdefender', alignment: 'Geo-Intelligence' },
      { name: 'Palestine RCS', url: 'https://x.com/PalestineRCS', alignment: 'Humanitarian/Gaza' }
    ]
  }
];

export const SEVERITY_COLORS = {
  low: '#fbbf24',
  medium: '#f97316',
  high: '#ef4444',
  critical: '#7f1d1d'
};
