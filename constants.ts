
import { Region } from './types';

export const REGIONS: Region[] = [
  { 
    id: 'ukraine', 
    name: 'Ukraine', 
    lat: 48.3794, 
    lng: 31.1656, 
    zoom: 6, 
    description: 'Ongoing Russo-Ukrainian war dynamics and frontline shifts.',
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
    description: 'Complex landscape following the collapse of central authority in major hubs.',
    monitoredSources: [
      { name: 'Intel Rojava', url: 'https://t.me/Intel_Rojava', alignment: 'Pro-SDF/Rojava' },
      { name: 'Kurdish Front News', url: 'https://t.me/KurdishFrontNews', alignment: 'Pro-SDF/Rojava' },
      { name: 'Idlib Marsad', url: 'https://t.me/idlib_marsad', alignment: 'Pro-Gov/Consolidated' },
      { name: 'Step News', url: 'https://t.me/stepnews', alignment: 'Pro-Gov/Consolidated' },
      { name: 'Suwayda 24/7', url: 'https://t.me/+g7Jum6v4Pwc5Nzc8', alignment: 'Druze/Southern' },
      { name: 'Protest Syria', url: 'https://t.me/protest_syria', alignment: 'Pro-Gov/Consolidated' }
    ],
    territories: [
      {
        id: 'pro-government',
        name: 'Pro-Gov Consolidated',
        color: '#22c55e',
        coordinates: [[
          [36.65, 36.15], [36.65, 36.40], [36.60, 36.60], [36.62, 36.90], [36.55, 37.10], [36.50, 37.40], [36.45, 37.80], [36.10, 38.30], [35.80, 38.40], [35.50, 38.80], [34.80, 40.20],
          [34.40, 40.85], [33.80, 40.10], [33.40, 39.50], [33.10, 39.00], [32.35, 38.80],
          [32.30, 38.50], [32.30, 38.00], [32.35, 37.50], [32.30, 37.20], [32.30, 36.80], [32.35, 36.50],
          [33.10, 36.05], [33.25, 36.20], [33.50, 36.40], [33.80, 36.55], [34.10, 36.65], [34.45, 36.50], [34.65, 36.15], [34.80, 35.95],
          [35.10, 35.85], [35.40, 35.90], [35.80, 35.85], [36.10, 35.90], [36.40, 36.00]
        ]]
      },
      {
        id: 'sdf-rojava',
        name: 'SDF (Rojava)',
        color: '#fbbf24',
        coordinates: [[
          [36.75, 38.10], [36.85, 39.00], [36.95, 40.00], [37.05, 41.00], [37.15, 41.80], [37.20, 42.20],
          [36.50, 42.30], [36.00, 42.10], [35.50, 40.90], [35.20, 40.60],
          [35.40, 40.00], [35.70, 39.50], [35.90, 38.80], [36.20, 38.20], [36.50, 38.00]
        ]]
      }
    ],
    militantGroups: [
      { name: 'Hayat Tahrir al-Sham (HTS)', description: 'The dominant force in Idlib, formerly affiliated with al-Qaeda, now positioning as a localized governing authority.', status: 'Active', areaOfOperation: 'Idlib Governorate', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Flag_of_Hayat_Tahrir_al-Sham.svg/512px-Flag_of_Hayat_Tahrir_al-Sham.svg.png' },
      { name: 'Syrian National Army (SNA)', description: 'A coalition of Turkish-backed opposition groups primarily active in northern "safe zones".', status: 'Active', areaOfOperation: 'Northern Syria', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Flag_of_the_Syrian_National_Army.svg/512px-Flag_of_the_Syrian_National_Army.svg.png' },
      { name: 'National Defense Forces (NDF)', description: 'Pro-government paramilitary organization formed to support regular army operations.', status: 'Active', areaOfOperation: 'Nationwide', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/National_Defence_Forces_logo.svg/512px-National_Defence_Forces_logo.svg.png' }
    ]
  },
  {
    id: 'lebanon',
    name: 'Lebanon',
    lat: 33.8547,
    lng: 35.8623,
    zoom: 9,
    description: 'Monitoring domestic instability and regional spillover effects.',
    monitoredSources: [
      { name: 'MTV Lebanon News', url: 'https://x.com/MTVLebanonNews', alignment: 'Independent/Local' },
      { name: 'News Hub Lebanon', url: 'https://t.me/LebanonNews', alignment: 'OSINT/Regional' },
      { name: 'Faytuks News', url: 'https://x.com/Faytuks', alignment: 'OSINT/Global' }
    ],
    territories: [
      {
        id: 'lebanon-sovereign',
        name: 'Lebanon Sovereign',
        color: '#ef4444',
        coordinates: [[
          [33.10, 35.10], [33.10, 35.80], [33.35, 35.85], [33.45, 36.25], [33.80, 36.50], [34.15, 36.65], [34.40, 36.55], [34.65, 36.05], [34.60, 35.95],
          [34.40, 35.80], [34.10, 35.60], [33.80, 35.40], [33.40, 35.30], [33.20, 35.15]
        ]]
      },
      {
        id: 'unifil-zone',
        name: 'UNIFIL Buffer Zone',
        color: '#3b82f6',
        coordinates: [[
          [33.10, 35.10], [33.10, 35.80], [33.30, 35.80], [33.35, 35.40], [33.30, 35.10]
        ]]
      }
    ],
    militantGroups: [
      { name: 'Hezbollah', description: 'Powerful Shiite political party and militant group with a massive arsenal, heavily supported by Iran.', status: 'Active', areaOfOperation: 'Southern Lebanon / Beqaa', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_Hezbollah.svg/512px-Flag_of_Hezbollah.svg.png' },
      { name: 'Amal Movement', description: 'Shiite political party and former militia, led by Nabih Berri, allied with Hezbollah.', status: 'Active', areaOfOperation: 'Beirut / Southern Lebanon', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Logo_of_the_Amal_Movement.svg/512px-Logo_of_the_Amal_Movement.svg.png' },
      { name: 'Palestinian Islamic Jihad', description: 'Active in Palestinian refugee camps, maintains an armed presence and coordinate with local factions.', status: 'Active', areaOfOperation: 'Refugee Camps', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Flag_of_Palestinian_Islamic_Jihad.svg/512px-Flag_of_Palestinian_Islamic_Jihad.svg.png' },
      { name: 'al-Fajr Forces (Islamic Group)', description: 'The armed wing of al-Jama’a al-Islamiya, recently re-emerged in cross-border engagements.', status: 'Active', areaOfOperation: 'Southern Lebanon', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Jamaa_Islamiya_Lebanon_Logo.svg/512px-Jamaa_Islamiya_Lebanon_Logo.svg.png' },
      { name: 'Syrian Social Nationalist Party (SSNP)', description: 'A secular nationalist group with armed wings that support regional resistance axes.', status: 'Active', areaOfOperation: 'Nationwide', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/SSNP_Logo.svg/512px-SSNP_Logo.svg.png' }
    ]
  },
  {
    id: 'iran',
    name: 'Iran',
    lat: 32.4279,
    lng: 53.6880,
    zoom: 5,
    description: 'Internal security dynamics, protest monitoring, and regional strategic posture.',
    monitoredSources: [
      { name: 'Iran International', url: 'https://x.com/IranIntl', alignment: 'Opposition/Independent' },
      { name: '1500tasvir', url: 'https://x.com/1500tasvir', alignment: 'Protest Monitoring' },
      { name: 'Jason Brodsky', url: 'https://x.com/JasonMBrodsky', alignment: 'Security Analyst' }
    ],
    territories: [
      {
        id: 'iran-sovereign',
        name: 'Iran Sovereign',
        color: '#10b981',
        coordinates: [[
          [39.7, 44.1], [39.7, 48.0], [38.4, 48.4], [37.5, 49.0], [37.0, 54.0], [38.0, 56.5], [37.3, 59.0], [35.5, 61.2], [33.0, 60.5], [30.0, 62.0], [25.0, 61.5], [25.5, 57.0], [27.0, 54.0], [29.0, 48.5], [31.0, 47.5], [33.5, 45.8], [37.0, 44.5], [39.7, 44.1]
        ]]
      }
    ],
    militantGroups: [
      { name: 'IRGC (Quds Force)', description: 'Elite wing of the Revolutionary Guard responsible for unconventional warfare and regional operations.', status: 'Active', areaOfOperation: 'Foreign / Regional', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Seal_of_the_Islamic_Revolutionary_Guard_Corps.svg/512px-Seal_of_the_Islamic_Revolutionary_Guard_Corps.svg.png' },
      { name: 'Basij', description: 'Large volunteer paramilitary organization under the IRGC used for internal security and social control.', status: 'Active', areaOfOperation: 'Nationwide', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Seal_of_the_Basij.svg/512px-Seal_of_the_Basij.svg.png' },
      { name: 'Jaish al-Adl', description: 'Salafi jihadist militant group operating primarily in the Sistan and Baluchestan Province.', status: 'Active', areaOfOperation: 'Southeastern Borders', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Flag_of_Jaish_al-Adl.svg/512px-Flag_of_Jaish_al-Adl.svg.png' }
    ]
  },
  { 
    id: 'israel-palestine', 
    name: 'Israel-Palestine', 
    lat: 31.0461, 
    lng: 34.8516, 
    zoom: 8, 
    description: 'Active combat monitoring across Gaza and regional northern/southern borders.',
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
