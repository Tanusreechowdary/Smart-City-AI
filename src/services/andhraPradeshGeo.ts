export interface APDistrict {
  id: string;
  name: string;
  regionalTitle: string;
  center: [number, number];
  defaultZoom: number;
  streetZoom: number;
  badge: string;
  description: string;
  keyStreets: string[];
  sampleHouses: {
    address: string;
    colony: string;
    lat: number;
    lng: number;
    type: 'residential' | 'commercial' | 'civic';
    smartFeatures: string[];
  }[];
}

// Entire Andhra Pradesh Geographical Bounds
export const AP_BOUNDS: [[number, number], [number, number]] = [
  [12.6, 76.7], // South-West
  [19.2, 84.8], // North-East
];

export const AP_CENTER: [number, number] = [15.9129, 79.7400];

// Andhra Pradesh Border Polygon Approximation (for state boundary overlay)
export const AP_STATE_BOUNDARY: [number, number][] = [
  // Northern Coast & Srikakulam / Ichchapuram
  [19.10, 84.70],
  [18.70, 84.40],
  [18.30, 83.90],
  // Visakhapatnam & Kakinada Coastline (Bay of Bengal)
  [17.70, 83.35],
  [17.30, 82.55],
  [16.95, 82.25],
  // Godavari Delta
  [16.70, 82.20],
  [16.35, 81.65],
  // Krishna Delta & Machilipatnam
  [16.15, 81.15],
  [15.80, 80.85],
  // Prakasam & Nellore Coastline
  [15.50, 80.20],
  [15.00, 80.05],
  [14.45, 80.00],
  [13.80, 80.20],
  [13.50, 80.15],
  // Southern border (Tirupati / Chittoor / Kuppam)
  [13.25, 79.60],
  [12.80, 78.60],
  [12.75, 78.35],
  // Western border (Anantapur / Hindupur / Kadiri)
  [13.80, 77.50],
  [14.30, 77.20],
  [14.70, 76.95],
  // Kurnool & Tungabhadra border
  [15.30, 77.10],
  [15.80, 77.60],
  [16.00, 78.20],
  // Krishna River border with Telangana
  [16.30, 79.30],
  [16.60, 80.10],
  [16.85, 80.50],
  // Northern Eastern Ghats & Godavari gorge
  [17.40, 81.30],
  [17.80, 81.60],
  [18.20, 82.30],
  [18.60, 83.10],
  [18.90, 83.80],
  [19.10, 84.70],
];

export const AP_DISTRICTS: APDistrict[] = [
  {
    id: 'state_ap',
    name: 'Entire Andhra Pradesh',
    regionalTitle: 'ఆంధ్ర ప్రదేశ్ రాష్ట్ర సమగ్ర GIS',
    center: [15.9129, 79.7400],
    defaultZoom: 7,
    streetZoom: 18,
    badge: 'Statewide',
    description: 'Statewide Command & Control monitoring 26 districts, coastal corridors, and urban local bodies.',
    keyStreets: ['NH-16 Coastal Highway', 'NH-65 Vijayawada-Hyderabad', 'NH-44 Bangalore-Rayalaseema', 'AP Amaravati Seed Access Road'],
    sampleHouses: [],
  },
  {
    id: 'vijayawada',
    name: 'Vijayawada & Amaravati',
    regionalTitle: 'విజయవాడ - అమరావతి రాజధాని ప్రాంతం',
    center: [16.5062, 80.6480],
    defaultZoom: 14,
    streetZoom: 18,
    badge: 'Capital & Commercial Hub',
    description: 'VMC urban core along Krishna River, Benz Circle, MG Road, Governorpet, and Amaravati Seed Access corridor.',
    keyStreets: [
      'Mahatma Gandhi Road (Bandar Rd)',
      'Eluru Road & Governorpet Main St',
      'Prakasam Barrage Promenade',
      'Bhavanipuram Bypass (NH-65)',
      'Benz Circle Flyover Corridor',
      'Guru Nanak Colony Main Road',
    ],
    sampleHouses: [
      {
        address: 'House #40-9/1-12, Near Trendset Mall',
        colony: 'MG Road, Benz Circle',
        lat: 16.4982,
        lng: 80.6548,
        type: 'residential',
        smartFeatures: ['Smart Electric Meter (3.6 kW)', 'AP FiberNet 1Gbps', 'AP Smart Power Grid Meter'],
      },
      {
        address: 'Door 28-14-3, Near Pushpa Hotel',
        colony: 'Governorpet Commercial & Residential',
        lat: 16.5124,
        lng: 80.6285,
        type: 'residential',
        smartFeatures: ['Rooftop Solar Grid 5kW', 'VMC Piped Water SCADA', 'Streetlight Sensor #ZH-402'],
      },
      {
        address: 'Villa 14, River View Enclave',
        colony: 'Bhavanipuram Riverfront',
        lat: 16.5235,
        lng: 80.5982,
        type: 'residential',
        smartFeatures: ['Smart Rainwater Harvesting', 'Underground Drainage Telemetry', 'EV Home Charger #12'],
      },
    ],
  },
  {
    id: 'visakhapatnam',
    name: 'Visakhapatnam (Vizag)',
    regionalTitle: 'విశాఖపట్నం స్మార్ట్ పోర్ట్ సిటీ',
    center: [17.6868, 83.2185],
    defaultZoom: 13,
    streetZoom: 18,
    badge: 'Executive & Port Hub',
    description: 'Greater Visakhapatnam Smart City spanning Beach Road, Rushikonda IT Hill, MVP Colony, Siripuram, and Gajuwaka.',
    keyStreets: [
      'Beach Road Marine Promenade',
      'Siripuram Junction & AU Road',
      'MVP Double Road Colony',
      'Rushikonda IT Park Access Way',
      'Dwaraka Nagar High Street',
      'Gajuwaka Industrial Highway',
    ],
    sampleHouses: [
      {
        address: 'Apartment 4B, Coastal Crest Towers',
        colony: 'Sector 3, MVP Colony',
        lat: 17.7342,
        lng: 83.3358,
        type: 'residential',
        smartFeatures: ['Tsunami Warning Siren Hookup', 'Cyclone Resilient Power Grid', 'Smart Clean Water Meter'],
      },
      {
        address: 'House #12-8, Balaji Nagar Street',
        colony: 'Siripuram, Andhra University Area',
        lat: 17.7210,
        lng: 83.3150,
        type: 'residential',
        smartFeatures: ['GVMC Smart Water Meter', 'Automated LED Streetlight Node', 'Air Quality Monitor Node'],
      },
      {
        address: 'Villa 88, Ocean View Estates',
        colony: 'Rushikonda Beach Enclave',
        lat: 17.7815,
        lng: 83.3820,
        type: 'residential',
        smartFeatures: ['Solar Rooftop 8kW', 'High Speed IT Corridor Fiber', 'Smart Sump Water Sensor'],
      },
    ],
  },
  {
    id: 'tirupati',
    name: 'Tirupati',
    regionalTitle: 'తిరుపతి స్మార్ట్ హెరిటేజ్ సిటీ',
    center: [13.6288, 79.4192],
    defaultZoom: 13,
    streetZoom: 18,
    badge: 'Pilgrimage & Heritage Hub',
    description: 'Smart Pilgrim City at the foothills of Tirumala hills, Alipiri Gateway, Korlagunta, and Renigunta tech corridor.',
    keyStreets: [
      'Alipiri Bypass Road',
      'Korlagunta Main Road',
      'Renigunta Airport Road',
      'Air Bypass Road',
      'SV University Avenue',
    ],
    sampleHouses: [
      {
        address: 'House #19-8-12, 3rd Cross Road',
        colony: 'Korlagunta Residential Layout',
        lat: 13.6350,
        lng: 79.4320,
        type: 'residential',
        smartFeatures: ['TMC Smart Water Meter', 'Heritage LED Sensor System', 'Smart Bin RFID #TPT-12'],
      },
      {
        address: 'Plot 42, Sri Padmavathi Enclave',
        colony: 'Air Bypass Road',
        lat: 13.6240,
        lng: 79.4080,
        type: 'residential',
        smartFeatures: ['Smart Solar Water Heater', 'Clean Energy Grid Tie-in', 'IoT Traffic Flow Sensor'],
      },
    ],
  },
  {
    id: 'guntur',
    name: 'Guntur & Tenali',
    regionalTitle: 'గుంటూరు వాణిజ్య కేంద్రం',
    center: [16.3067, 80.4365],
    defaultZoom: 13,
    streetZoom: 18,
    badge: 'Agri-Tech & Commercial',
    description: 'GMC urban jurisdiction, Brodipet high street, Arundelpet residential sectors, and Amaravati connecting belt.',
    keyStreets: [
      'Brodipet Main Road (1st to 4th Lines)',
      'Arundelpet Residential Streets',
      'Lakshmipuram Main Road',
      'Collectorate Road',
      'Guntur-Amaravati Express Way',
    ],
    sampleHouses: [
      {
        address: 'House 4-22-15, 3rd Line',
        colony: 'Brodipet Residential Quarter',
        lat: 16.3082,
        lng: 80.4398,
        type: 'residential',
        smartFeatures: ['GMC Digital Water Supply', 'Smart Streetlight Zhaga Node', 'Home Energy Monitor'],
      },
      {
        address: 'Plot 71, Venkateswara Colony',
        colony: 'Lakshmipuram 2nd Lane',
        lat: 16.2995,
        lng: 80.4280,
        type: 'residential',
        smartFeatures: ['AP FiberNet Broadband', 'Automated Bin Level Sensor', 'AQI Station Feed'],
      },
    ],
  },
  {
    id: 'kurnool',
    name: 'Kurnool',
    regionalTitle: 'కర్నూలు - రాయలసీమ గేట్‌వే',
    center: [15.8281, 78.0373],
    defaultZoom: 13,
    streetZoom: 18,
    badge: 'Rayalaseema Regional Center',
    description: 'Historic Tungabhadra river city, Kondareddy Buruju heritage precinct, Rajvihar Circle, and B-Camp residential colony.',
    keyStreets: [
      'Rajvihar Circle Main Street',
      'Kondareddy Buruju Fort Road',
      'B-Camp Residential Avenue',
      'Nandyal Road High Corridor',
      'Bellary Road',
    ],
    sampleHouses: [
      {
        address: 'House 14-B, 2nd Cross',
        colony: 'B-Camp Residential Sector',
        lat: 15.8210,
        lng: 78.0460,
        type: 'residential',
        smartFeatures: ['KMC Smart Water Pipeline Node', 'Underground Drainage Monitor', 'Solar Inverter 4kW'],
      },
    ],
  },
  {
    id: 'kakinada',
    name: 'Kakinada',
    regionalTitle: 'కాకినాడ స్మార్ట్ పోర్ట్ సిటీ',
    center: [16.9891, 82.2475],
    defaultZoom: 13,
    streetZoom: 18,
    badge: 'Smart Coastal Port',
    description: 'Grid-planned coastal smart city, Bhanugudi Junction, Gandhi Nagar, and Deepwater Port logistic zone.',
    keyStreets: [
      'Bhanugudi Junction Main Street',
      'Gandhi Nagar Residential Lane',
      'Smart Port Road & Canal Bund',
      'Cinema Road High Street',
    ],
    sampleHouses: [
      {
        address: 'House #8-12-4, 5th Street',
        colony: 'Gandhi Nagar Ward 12',
        lat: 16.9840,
        lng: 82.2410,
        type: 'residential',
        smartFeatures: ['Smart Canal Overflow Alert', 'KMC Smart Grid Meter', 'AP Solar Rooftop Monitor'],
      },
    ],
  },
  {
    id: 'rajahmundry',
    name: 'Rajamahendravaram',
    regionalTitle: 'రాజమహేంద్రవరం గోదావరి నగరం',
    center: [17.0005, 81.8040],
    defaultZoom: 13,
    streetZoom: 18,
    badge: 'Godavari Cultural Center',
    description: 'Picturesque Godavari River city, Arch Bridge promenade, Pushkar Ghat, and Danavaipeta colony.',
    keyStreets: [
      'Godavari Bund Road',
      'Danavaipeta Main Road',
      'Kotipalli Bus Stand Road',
      'Jampeta Commercial Street',
    ],
    sampleHouses: [
      {
        address: 'Door 10-4-32, Riverfront Row',
        colony: 'Danavaipeta Residential',
        lat: 17.0042,
        lng: 81.7985,
        type: 'residential',
        smartFeatures: ['Godavari Flood Level Sensor', 'Smart Water Pumping Node', 'Rooftop Solar 6kW'],
      },
    ],
  },
  {
    id: 'nellore',
    name: 'Nellore',
    regionalTitle: 'నెల్లూరు పెన్నా నగరం',
    center: [14.4426, 79.9865],
    defaultZoom: 13,
    streetZoom: 18,
    badge: 'Penna Coastal Hub',
    description: 'Penna River delta city, Trunk Road high corridor, Magunta Layout, and Krishnapatnam port access highway.',
    keyStreets: ['Trunk Road (Grand Trunk)', 'Magunta Layout Main Road', 'Dargamitta Collectorate Road', 'VRC Centre'],
    sampleHouses: [
      {
        address: 'House #24-11, 2nd Cross',
        colony: 'Magunta Layout',
        lat: 14.4380,
        lng: 79.9790,
        type: 'residential',
        smartFeatures: ['NMC Smart Water SCADA', 'Smart LED Zhaga Luminaire', 'Home Power Telemetry'],
      },
    ],
  },
  {
    id: 'kadapa',
    name: 'YSR Kadapa',
    regionalTitle: 'కడప నగరం',
    center: [14.4673, 78.8242],
    defaultZoom: 13,
    streetZoom: 18,
    badge: 'Central Rayalaseema',
    description: 'Seven Roads hub, Buggavanka riverfront, Nagarajupalli, and RIMS hospital corridor.',
    keyStreets: ['Seven Roads Circle', 'Nagarajupalli Main St', 'Madras Road', 'RIMS Hospital Road'],
    sampleHouses: [
      {
        address: 'House 5-14, 1st Lane',
        colony: 'Nagarajupalli Colony',
        lat: 14.4690,
        lng: 78.8290,
        type: 'residential',
        smartFeatures: ['Solar Water Heating Sensor', 'Smart Prepaid Power Meter', 'AP FiberNet Link'],
      },
    ],
  },
  {
    id: 'anantapur',
    name: 'Anantapur',
    regionalTitle: 'అనంతపురం',
    center: [14.6819, 77.6006],
    defaultZoom: 13,
    streetZoom: 18,
    badge: 'Western AP Technology Hub',
    description: 'Clock Tower circle, Subash Road, JNTU Anantapur campus, and Housing Board Colony.',
    keyStreets: ['Clock Tower Circle Road', 'Subash Road', 'Housing Board Colony Main St', 'JNTU University Way'],
    sampleHouses: [
      {
        address: 'House #32, Block 4',
        colony: 'Housing Board Colony',
        lat: 14.6750,
        lng: 77.5920,
        type: 'residential',
        smartFeatures: ['Rainwater Recharge Well Monitor', 'Smart Energy Meter', 'Solar Rooftop Telemetry'],
      },
    ],
  },
];

// Available Map Tile Layers designed for satellite, traffic, street, and thematic GIS viewing
export interface MapTileProvider {
  id: string;
  name: string;
  category: 'satellite' | 'traffic' | 'streets' | 'hybrid' | 'thematic' | 'topo';
  icon: string;
  url: string;
  attribution: string;
  maxZoom: number;
  subdomains?: string;
  hasHouseLevelZoom: boolean;
  hasTrafficOverlay: boolean;
  badge: string;
  description: string;
}

export const MAP_PROVIDERS: MapTileProvider[] = [
  {
    id: 'satellite_roofs',
    name: 'High-Res Satellite (House Roofs)',
    category: 'satellite',
    icon: '🛰️',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Esri, Maxar, Earthstar Geographics, CNES/Airbus',
    maxZoom: 19,
    hasHouseLevelZoom: true,
    hasTrafficOverlay: false,
    badge: 'Zoom 19x Roofs',
    description: 'True aerial satellite showing individual house rooftops, compounds, lanes, and tree covers.',
  },
  {
    id: 'satellite_hybrid',
    name: 'Satellite Hybrid (Roofs + City Labels)',
    category: 'hybrid',
    icon: '🛰️🏷️',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Esri, Maxar, Earthstar Geographics',
    maxZoom: 19,
    hasHouseLevelZoom: true,
    hasTrafficOverlay: false,
    badge: 'Satellite + Names',
    description: 'Aerial satellite imagery with labeled city names, colonies, and administrative boundaries overlaid.',
  },
  {
    id: 'water_grid',
    name: 'Water SCADA & Krishna Reservoir Grid',
    category: 'thematic',
    icon: '💧',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'AP Water Resources Dept',
    maxZoom: 19,
    hasHouseLevelZoom: true,
    hasTrafficOverlay: false,
    badge: 'Barrage & SCADA',
    description: 'Prakasam Barrage & Krishna Delta canal telemetry, trunk water mains, and reservoir levels.',
  },
  {
    id: 'esri_topo',
    name: 'Topographic & River Basins',
    category: 'topo',
    icon: '🏔️',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Esri, Intermap, USGS, FAO',
    maxZoom: 19,
    hasHouseLevelZoom: false,
    hasTrafficOverlay: false,
    badge: 'Rivers & Terrain',
    description: 'Krishna & Godavari river basins, delta canals, Eastern Ghats terrain, and elevation contours.',
  },
  {
    id: 'aqi_thematic',
    name: 'Environmental & Air Quality GIS',
    category: 'thematic',
    icon: '🌦️',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'AP Pollution Control Board GIS',
    maxZoom: 19,
    hasHouseLevelZoom: true,
    hasTrafficOverlay: false,
    badge: 'AQI & Clean Air',
    description: 'Industrial particulate sensors, ambient air quality stations, and real-time microclimate zones.',
  },
];

// Live Traffic Corridor Model across Andhra Pradesh
export interface TrafficCorridor {
  id: string;
  name: string;
  district: string;
  category: 'national_highway' | 'arterial' | 'bridge' | 'bypass';
  coordinates: [number, number][];
  status: 'free' | 'moderate' | 'congested' | 'blocked';
  currentSpeedKmh: number;
  normalSpeedKmh: number;
  delayMinutes: number;
  lengthKm: number;
  vehiclesPerHour: number;
  alert?: string;
  detour?: string;
}

export const AP_TRAFFIC_CORRIDORS: TrafficCorridor[] = [
  // 1. Benz Circle Flyover & MG Road Corridor (Vijayawada core)
  {
    id: 'COR-VJA-01',
    name: 'Benz Circle Flyover & MG Road (Bandar Rd)',
    district: 'Vijayawada',
    category: 'arterial',
    coordinates: [
      [16.4920, 80.6410],
      [16.4950, 80.6480],
      [16.4971, 80.6557], // Benz Circle
      [16.5015, 80.6650],
      [16.5050, 80.6720],
    ],
    status: 'congested',
    currentSpeedKmh: 19,
    normalSpeedKmh: 45,
    delayMinutes: 14,
    lengthKm: 4.8,
    vehiclesPerHour: 3400,
    alert: 'Peak commute bottleneck at Benz Circle lower ramp. Smart adaptive green wave active.',
    detour: 'Alternate via Pantakaluva Road or Ring Road Bypass.',
  },
  // 2. Prakasam Barrage Krishna Bridge (Vijayawada - Guntur Connector)
  {
    id: 'COR-VJA-02',
    name: 'Prakasam Barrage Bridge Corridor',
    district: 'Vijayawada',
    category: 'bridge',
    coordinates: [
      [16.5160, 80.6080],
      [16.5074, 80.6062], // Barrage Center
      [16.4980, 80.6030],
      [16.4910, 80.6010], // Undavalli side
    ],
    status: 'moderate',
    currentSpeedKmh: 28,
    normalSpeedKmh: 40,
    delayMinutes: 8,
    lengthKm: 2.9,
    vehiclesPerHour: 2200,
    alert: 'Lane contraction near barrage sluice gates due to maintenance inspection.',
    detour: 'Heavy multi-axle freight re-routed via Kanaka Durga Flyover.',
  },
  // 3. Kanaka Durga Flyover & Bypass
  {
    id: 'COR-VJA-03',
    name: 'Kanaka Durga Temple Flyover (NH-65 Bypass)',
    district: 'Vijayawada',
    category: 'arterial',
    coordinates: [
      [16.5120, 80.6020],
      [16.5170, 80.6090],
      [16.5220, 80.6180],
      [16.5280, 80.6270],
    ],
    status: 'free',
    currentSpeedKmh: 58,
    normalSpeedKmh: 60,
    delayMinutes: 0,
    lengthKm: 3.2,
    vehiclesPerHour: 1950,
  },
  // 4. NH-16 Vijayawada - Guntur Express Corridor
  {
    id: 'COR-AP-04',
    name: 'NH-16 Vijayawada-Guntur Express Corridor',
    district: 'Guntur / Krishna',
    category: 'national_highway',
    coordinates: [
      [16.4900, 80.6000],
      [16.4500, 80.5600],
      [16.4100, 80.5100],
      [16.3600, 80.4700],
      [16.3067, 80.4365], // Guntur
    ],
    status: 'free',
    currentSpeedKmh: 74,
    normalSpeedKmh: 80,
    delayMinutes: 2,
    lengthKm: 34.0,
    vehiclesPerHour: 4800,
  },
  // 5. Amaravati Seed Access Road
  {
    id: 'COR-AMR-05',
    name: 'Amaravati Seed Access Expressway',
    district: 'Amaravati',
    category: 'arterial',
    coordinates: [
      [16.5050, 80.5950],
      [16.5100, 80.5600],
      [16.5131, 80.5158], // Velagapudi Secretariat
      [16.5180, 80.4800],
    ],
    status: 'free',
    currentSpeedKmh: 68,
    normalSpeedKmh: 70,
    delayMinutes: 0,
    lengthKm: 16.5,
    vehiclesPerHour: 1100,
  },
  // 6. Visakhapatnam Beach Road Marine Promenade
  {
    id: 'COR-VIZ-06',
    name: 'Vizag Beach Road Marine Drive',
    district: 'Visakhapatnam',
    category: 'arterial',
    coordinates: [
      [17.7050, 83.3150],
      [17.7150, 83.3240], // RK Beach
      [17.7300, 83.3420], // VUDA Park
      [17.7550, 83.3650], // Tenneti Park
      [17.7815, 83.3820], // Rushikonda
    ],
    status: 'moderate',
    currentSpeedKmh: 35,
    normalSpeedKmh: 50,
    delayMinutes: 6,
    lengthKm: 14.2,
    vehiclesPerHour: 2600,
    alert: 'Coastal tourist and university commuter density along RK Beach.',
  },
  // 7. NH-16 North Coastal Corridor (Vijayawada -> Vizag)
  {
    id: 'COR-AP-07',
    name: 'NH-16 North Coastal Highway (Vijayawada -> Vizag)',
    district: 'Statewide AP',
    category: 'national_highway',
    coordinates: [
      [16.5300, 80.6800], // Vijayawada East
      [16.7107, 81.0952], // Eluru
      [17.0005, 81.8040], // Rajamahendravaram
      [16.9891, 82.2475], // Kakinada turnoff
      [17.4000, 82.7000], // Tuni
      [17.6868, 83.2185], // Visakhapatnam
    ],
    status: 'free',
    currentSpeedKmh: 76,
    normalSpeedKmh: 80,
    delayMinutes: 3,
    lengthKm: 350.0,
    vehiclesPerHour: 6200,
  },
  // 8. Tirupati Alipiri Bypass & Ghat Road Access
  {
    id: 'COR-TPT-08',
    name: 'Tirupati Alipiri Gateway & Bypass',
    district: 'Tirupati',
    category: 'arterial',
    coordinates: [
      [13.6200, 79.4300],
      [13.6350, 79.4180],
      [13.6510, 79.4010], // Alipiri Tollgate
      [13.6650, 79.3850], // 1st Ghat ascent
    ],
    status: 'congested',
    currentSpeedKmh: 22,
    normalSpeedKmh: 45,
    delayMinutes: 12,
    lengthKm: 7.8,
    vehiclesPerHour: 2900,
    alert: 'High pilgrim bus and private vehicle volume towards Ghat checkpoint.',
    detour: 'Devotees recommended to use Pilgrim Transit Electric Buses from Central Bus Stand.',
  },
  // 9. Kurnool NH-44 Rayalaseema Express
  {
    id: 'COR-KRN-09',
    name: 'NH-44 Bangalore-Kurnool-Hyderabad Express',
    district: 'Kurnool',
    category: 'national_highway',
    coordinates: [
      [15.7500, 78.0200],
      [15.8281, 78.0373], // Kurnool
      [15.9100, 78.0600],
      [16.0200, 78.0900],
    ],
    status: 'free',
    currentSpeedKmh: 82,
    normalSpeedKmh: 85,
    delayMinutes: 0,
    lengthKm: 42.0,
    vehiclesPerHour: 3800,
  },
];

// Live Traffic Incidents
export interface TrafficIncident {
  id: string;
  title: string;
  location: string;
  coordinates: [number, number];
  type: 'accident' | 'construction' | 'congestion' | 'signal_fault';
  severity: 'low' | 'medium' | 'high';
  delayMin: number;
  reportedAgo: string;
  recommendation: string;
}

export const AP_TRAFFIC_INCIDENTS: TrafficIncident[] = [
  {
    id: 'INC-VJA-101',
    title: 'Benz Circle Lower Underpass Heavy Slowdown',
    location: 'Benz Circle Flyover, MG Road, Vijayawada',
    coordinates: [16.4971, 80.6557],
    type: 'congestion',
    severity: 'high',
    delayMin: 14,
    reportedAgo: '4 mins ago',
    recommendation: 'Use Bandar Road overhead flyover lane or route via Siddhartha College road.',
  },
  {
    id: 'INC-VJA-102',
    title: 'Prakasam Barrage Sluice Deck Resurfacing',
    location: 'Prakasam Barrage, Krishna River, Vijayawada',
    coordinates: [16.5074, 80.6062],
    type: 'construction',
    severity: 'medium',
    delayMin: 8,
    reportedAgo: '18 mins ago',
    recommendation: 'Single lane operation in effect. Heavy commercial vehicles divert to Kanaka Durga Flyover.',
  },
  {
    id: 'INC-TPT-103',
    title: 'Alipiri Tollgate Pilgrim Vehicle Queue',
    location: 'Alipiri Checkpoint Bypass, Tirupati',
    coordinates: [13.6510, 79.4010],
    type: 'congestion',
    severity: 'medium',
    delayMin: 12,
    reportedAgo: '10 mins ago',
    recommendation: 'FastTag Lane 3 open for electric buses; private cars expect 10-12 min queue.',
  },
  {
    id: 'INC-VIZ-104',
    title: 'RK Beach Promenade Cultural Festival Foot Traffic',
    location: 'Beach Road, Visakhapatnam',
    coordinates: [17.7150, 83.3240],
    type: 'congestion',
    severity: 'medium',
    delayMin: 6,
    reportedAgo: '25 mins ago',
    recommendation: 'Pedestrian safety zone active. Speed capped at 25 km/h.',
  },
];

