export type CityZoneId =
  | 'benz_circle'
  | 'prakasam_barrage'
  | 'one_town'
  | 'auto_nagar'
  | 'bhavanipuram'
  | 'gunadala'
  | 'visakhapatnam'
  | 'tirupati'
  | 'guntur'
  | 'amaravati'
  | 'kurnool'
  | 'kakinada'
  | 'nellore'
  | 'rajahmundry'
  | 'anantapur'
  | string;

export type UserRole = 'admin' | 'operator' | 'citizen';
export type AppTheme = 'light' | 'dark';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}

export interface CityZone {
  id: CityZoneId;
  name: string;
  population: number;
  areaSqKm: number;
  center: [number, number]; // lat, lng
  congestion: number; // 0 - 100
  aqi: number;
  energyLoadMw: number;
  waterFlowRate: number; // L/s
}

export interface OverviewMetrics {
  traffic: {
    congestion_index: number;
    average_speed_kmh: number;
    active_vehicles: number;
    trend: string;
    flow_rate_veh_min: number;
    v2i_connected_vehicles: number;
  };
  environment: {
    aqi: number;
    pm2_5: number;
    pm10: number;
    temp_c: number;
    humidity_pct: number;
    noise_db: number;
    co2_ppm: number;
    status: 'GOOD' | 'MODERATE' | 'UNHEALTHY_SENSITIVE' | 'UNHEALTHY';
  };
  energy: {
    grid_load_mw: number;
    solar_generation_mw: number;
    grid_capacity_mw: number;
    streetlights_online: number;
    streetlights_total: number;
    savings_pct: number;
    peak_warning: boolean;
  };
  water: {
    main_reservoir_pct: number;
    daily_consumption_ml: number;
    trunk_pressure_bar: number;
    active_leaks_detected: number;
    pipeline_health_pct: number;
    anomaly_score: number;
  };
  waste: {
    average_fill_pct: number;
    total_bins: number;
    bins_requiring_pickup: number;
    optimized_fleet_active: number;
    diverted_tons_today: number;
  };
  alerts: CityAlert[];
}

export interface CityAlert {
  id: string;
  title: string;
  zone: string;
  type: 'traffic' | 'water' | 'energy' | 'waste' | 'environment';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  message: string;
  timestamp: string;
  acknowledged?: boolean;
}

export interface MapNode {
  id: string;
  name: string;
  zone: CityZoneId;
  lat: number;
  lng: number;
  type: 'traffic' | 'aqi' | 'energy' | 'waste' | 'water' | 'streetlight';
  status: 'active' | 'warning' | 'critical' | 'offline';
  value: string;
  telemetry: Record<string, string | number>;
  lastUpdated: string;
}

export interface SmartBin {
  id: string;
  district: string;
  location: string;
  coordinates: [number, number];
  type: 'General' | 'Recyclable' | 'Organic' | 'Hazardous';
  fillPct: number;
  capacityLiters: number;
  batteryPct: number;
  temperatureC: number;
  lastEmptied: string;
  status: 'Normal' | 'Pickup Required' | 'Overflow Hazard';
  priorityScore: number; // 0 - 100
}

export interface Streetlight {
  node_id: string;
  district: string;
  pole_number: string;
  is_active: boolean;
  brightness_pct: number;
  power_watts: number;
  voltage_v: number;
  lux_ambient: number;
  protocol: 'ZHAGA-D4i' | 'NEMA-7';
}

export interface WaterPipelineNode {
  id: string;
  sector: string;
  pressureBar: number;
  normalPressureBar: number;
  flowRateLps: number;
  vibrationMmS: number;
  acousticLeakScore: number;
  status: 'OPTIMAL' | 'DEVIATION' | 'LEAK_DETECTED';
  valveOpen: boolean;
}

export interface Complaint {
  ticket_id: string;
  category: 'Pothole' | 'Overflowing Bin' | 'Water Leak' | 'Streetlight' | 'Noise Violation' | 'Traffic Hazard';
  location: string;
  zone: string;
  description: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PENDING' | 'DISPATCHED' | 'IN_PROGRESS' | 'RESOLVED';
  created_at: string;
  reporterName: string;
  imageUrl?: string;
  assignedUnit?: string;
  notes?: string;
}

export interface AIModelPrediction {
  timestamp: string;
  predictedValue: number;
  confidence: number;
  lowerBound: number;
  upperBound: number;
}
