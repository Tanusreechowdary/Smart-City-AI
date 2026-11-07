import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  CityZone,
  MapNode,
  SmartBin,
  Streetlight,
  WaterPipelineNode,
  Complaint,
  OverviewMetrics,
  CityAlert,
  UserRole,
  AppTheme,
  AuthUser,
} from '../types';
import {
  INITIAL_ZONES,
  INITIAL_MAP_NODES,
  INITIAL_STREETLIGHTS,
  INITIAL_SMART_BINS,
  INITIAL_WATER_NODES,
  INITIAL_COMPLAINTS,
  INITIAL_OVERVIEW_METRICS,
} from '../services/mockData';

interface CityDataContextType {
  metrics: OverviewMetrics;
  zones: CityZone[];
  mapNodes: MapNode[];
  streetlights: Streetlight[];
  smartBins: SmartBin[];
  waterNodes: WaterPipelineNode[];
  complaints: Complaint[];
  alerts: CityAlert[];
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  currentUser: AuthUser | null;
  login: (options?: { email?: string; role?: UserRole; name?: string }) => void;
  logout: () => void;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
  isSimulating: boolean;
  setIsSimulating: (sim: boolean) => void;
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;
  selectedMapNode: MapNode | null;
  setSelectedMapNode: (node: MapNode | null) => void;
  toggleStreetlight: (nodeId: string) => void;
  setStreetlightBrightness: (nodeId: string, brightness: number) => void;
  toggleAllStreetlights: (active: boolean) => void;
  emptyBin: (binId: string) => void;
  dispatchBinFleet: () => void;
  toggleWaterValve: (nodeId: string) => void;
  addComplaint: (complaint: Omit<Complaint, 'ticket_id' | 'created_at' | 'status'>) => void;
  updateComplaintStatus: (ticketId: string, status: Complaint['status'], notes?: string) => void;
  acknowledgeAlert: (alertId: string) => void;
  triggerEmergency: (type: 'traffic_jam' | 'pipe_burst' | 'grid_spike' | 'bin_overflow') => void;
}

const CityDataContext = createContext<CityDataContextType | undefined>(undefined);

export const CityDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [metrics, setMetrics] = useState<OverviewMetrics>(INITIAL_OVERVIEW_METRICS);
  const [zones, setZones] = useState<CityZone[]>(INITIAL_ZONES);
  const [mapNodes, setMapNodes] = useState<MapNode[]>(INITIAL_MAP_NODES);
  const [streetlights, setStreetlights] = useState<Streetlight[]>(INITIAL_STREETLIGHTS);
  const [smartBins, setSmartBins] = useState<SmartBin[]>(INITIAL_SMART_BINS);
  const [waterNodes, setWaterNodes] = useState<WaterPipelineNode[]>(INITIAL_WATER_NODES);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [alerts, setAlerts] = useState<CityAlert[]>(INITIAL_OVERVIEW_METRICS.alerts);
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [theme, setTheme] = useState<AppTheme>('light'); // default to light theme as requested
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [selectedMapNode, setSelectedMapNode] = useState<MapNode | null>(INITIAL_MAP_NODES[0]);

  // Auth state - default false so user immediately sees the exact login page
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('smart_city_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('smart_city_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      id: 'USR-2026-001',
      name: 'Tanusree Chowdary',
      email: 'tanusreechowdarysirigiri@gmail.com',
      role: 'citizen',
      department: 'Citizen Services & Grievance Cell',
    };
  });

  const login = (options?: { email?: string; role?: UserRole; name?: string }) => {
    let chosenRole: UserRole = options?.role || 'citizen';
    let chosenName = options?.name || 'Tanusree Chowdary';
    let chosenEmail = options?.email || 'tanusreechowdarysirigiri@gmail.com';

    if (options?.email) {
      const em = options.email.toLowerCase();
      if (em.includes('operator')) {
        chosenRole = 'operator';
        chosenName = options.name || 'S. K. Rao (VMC Operations)';
      } else if (em.includes('admin') || em.includes('commissioner')) {
        chosenRole = 'admin';
        chosenName = options.name || 'Dr. Ramesh Varma (Commissioner)';
      } else {
        chosenRole = 'citizen';
        chosenName = options.name || 'Tanusree Chowdary';
      }
    }

    const user: AuthUser = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: chosenName,
      email: chosenEmail,
      role: chosenRole,
      department:
        chosenRole === 'admin'
          ? 'Municipal Administration & Urban Development'
          : chosenRole === 'operator'
          ? 'IoT Operations & Traffic Command'
          : 'Citizen Services & Grievance Cell',
    };

    setCurrentUser(user);
    setUserRole(chosenRole);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('smart_city_auth', 'true');
      localStorage.setItem('smart_city_user', JSON.stringify(user));
    } catch {
      // ignore storage errors
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    try {
      localStorage.removeItem('smart_city_auth');
      localStorage.removeItem('smart_city_user');
    } catch {
      // ignore
    }
  };

  // Sync theme to root class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Real-time telemetry simulation loop
  useEffect(() => {
    if (!isSimulating) return;

    const intervalTime = Math.max(1000, 4000 / simulationSpeed);
    const timer = setInterval(() => {
      // Small realistic jitter
      setMetrics((prev) => {
        const trafficJitter = (Math.random() - 0.48) * 1.5;
        const newCongestion = Math.min(98, Math.max(25, Math.round((prev.traffic.congestion_index + trafficJitter) * 10) / 10));
        const newSpeed = Math.max(16, Math.min(55, Math.round((55 - newCongestion * 0.38 + (Math.random() - 0.5) * 2) * 10) / 10));

        const solarJitter = (Math.random() - 0.5) * 1.5;
        const gridJitter = (Math.random() - 0.48) * 2.8;

        const aqiJitter = (Math.random() - 0.5) * 2;
        const newAqi = Math.max(25, Math.min(160, Math.round(prev.environment.aqi + aqiJitter)));

        return {
          ...prev,
          traffic: {
            ...prev.traffic,
            congestion_index: newCongestion,
            average_speed_kmh: newSpeed,
            flow_rate_veh_min: Math.max(40, Math.min(120, Math.round(newCongestion * 1.1 + (Math.random() - 0.5) * 4))),
            active_vehicles: prev.traffic.active_vehicles + Math.floor((Math.random() - 0.49) * 25),
          },
          environment: {
            ...prev.environment,
            aqi: newAqi,
            pm2_5: Math.max(8, Math.round((prev.environment.pm2_5 + (Math.random() - 0.5) * 0.6) * 10) / 10),
            noise_db: Math.max(50, Math.min(85, Math.round(prev.environment.noise_db + (Math.random() - 0.5) * 1.5))),
            status: newAqi > 100 ? 'UNHEALTHY_SENSITIVE' : newAqi > 50 ? 'MODERATE' : 'GOOD',
          },
          energy: {
            ...prev.energy,
            grid_load_mw: Math.round((prev.energy.grid_load_mw + gridJitter) * 10) / 10,
            solar_generation_mw: Math.max(0, Math.round((prev.energy.solar_generation_mw + solarJitter) * 10) / 10),
          },
          water: {
            ...prev.water,
            trunk_pressure_bar: Math.max(1.8, Math.min(4.8, Math.round((prev.water.trunk_pressure_bar + (Math.random() - 0.5) * 0.04) * 100) / 100)),
          },
        };
      });

      // Update node telemetry
      setMapNodes((prevNodes) =>
        prevNodes.map((n) => {
          if (n.type === 'traffic') {
            const v = Math.round(60 + Math.random() * 35);
            return {
              ...n,
              value: `${v} veh/min`,
              telemetry: {
                ...n.telemetry,
                avgSpeedKmh: Math.round((55 - v * 0.3) * 10) / 10,
                v2iLatencyMs: Math.round(7 + Math.random() * 5),
              },
            };
          }
          return n;
        })
      );
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isSimulating, simulationSpeed]);

  // Streetlight controls
  const toggleStreetlight = (nodeId: string) => {
    setStreetlights((prev) =>
      prev.map((node) => {
        if (node.node_id === nodeId) {
          const nextActive = !node.is_active;
          return {
            ...node,
            is_active: nextActive,
            power_watts: nextActive ? Math.round(120 * (node.brightness_pct / 100)) : 0,
          };
        }
        return node;
      })
    );
  };

  const setStreetlightBrightness = (nodeId: string, brightness: number) => {
    setStreetlights((prev) =>
      prev.map((node) => {
        if (node.node_id === nodeId) {
          return {
            ...node,
            brightness_pct: brightness,
            power_watts: node.is_active ? Math.round(120 * (brightness / 100)) : 0,
          };
        }
        return node;
      })
    );
  };

  const toggleAllStreetlights = (active: boolean) => {
    setStreetlights((prev) =>
      prev.map((n) => ({
        ...n,
        is_active: active,
        power_watts: active ? Math.round(120 * (n.brightness_pct / 100)) : 0,
      }))
    );
  };

  // Waste controls
  const emptyBin = (binId: string) => {
    setSmartBins((prev) =>
      prev.map((b) =>
        b.id === binId
          ? {
              ...b,
              fillPct: 5,
              status: 'Normal',
              priorityScore: 5,
              lastEmptied: 'Just now',
            }
          : b
      )
    );
  };

  const dispatchBinFleet = () => {
    setSmartBins((prev) =>
      prev.map((b) => {
        if (b.fillPct >= 70) {
          return {
            ...b,
            fillPct: 8,
            status: 'Normal',
            priorityScore: 8,
            lastEmptied: 'Dispatched & Emptied',
          };
        }
        return b;
      })
    );

    const alert: CityAlert = {
      id: `ALT-VJA-${Date.now().toString().slice(-4)}`,
      title: 'VMC Waste Fleet Dispatched',
      zone: 'Citywide Logistics',
      type: 'waste',
      severity: 'INFO',
      message: '16 electric compactor vehicles routed to One Town, PNBS, and Rythu Bazaar compactors.',
      timestamp: 'Just now',
    };
    setAlerts((prev) => [alert, ...prev]);
  };

  // Water SCADA controls
  const toggleWaterValve = (nodeId: string) => {
    setWaterNodes((prev) =>
      prev.map((n) => {
        if (n.id === nodeId) {
          const nextValve = !n.valveOpen;
          return {
            ...n,
            valveOpen: nextValve,
            status: nextValve ? (n.pressureBar < 3.2 ? 'DEVIATION' : 'OPTIMAL') : 'OPTIMAL',
            flowRateLps: nextValve ? n.flowRateLps : 0,
          };
        }
        return n;
      })
    );
  };

  // Citizen Complaint submission
  const addComplaint = (complaint: Omit<Complaint, 'ticket_id' | 'created_at' | 'status'>) => {
    const newRecord: Complaint = {
      ...complaint,
      ticket_id: `VMC-${Math.floor(4000 + Math.random() * 5000)}`,
      status: 'PENDING',
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
      assignedUnit: 'VMC Triage Queue',
    };
    setComplaints((prev) => [newRecord, ...prev]);

    // Generate notification alert
    const newAlert: CityAlert = {
      id: `ALT-VJA-${Date.now().toString().slice(-4)}`,
      title: `VMC Incident Logged: ${complaint.category}`,
      zone: complaint.location,
      type: complaint.category === 'Water Leak' ? 'water' : complaint.category === 'Pothole' ? 'traffic' : 'environment',
      severity: complaint.urgency === 'CRITICAL' ? 'CRITICAL' : complaint.urgency === 'HIGH' ? 'WARNING' : 'INFO',
      message: `${complaint.description.slice(0, 70)}... reported by ${complaint.reporterName}`,
      timestamp: 'Just now',
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const updateComplaintStatus = (ticketId: string, status: Complaint['status'], notes?: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.ticket_id === ticketId
          ? {
              ...c,
              status,
              notes: notes || c.notes,
              assignedUnit: status === 'DISPATCHED' ? 'VMC Field Unit #08' : c.assignedUnit,
            }
          : c
      )
    );
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
  };

  // Simulation emergency triggers for Vijayawada
  const triggerEmergency = (type: 'traffic_jam' | 'pipe_burst' | 'grid_spike' | 'bin_overflow') => {
    if (type === 'traffic_jam') {
      setMetrics((prev) => ({
        ...prev,
        traffic: {
          ...prev.traffic,
          congestion_index: 94,
          average_speed_kmh: 12.5,
          flow_rate_veh_min: 112,
        },
      }));
      setAlerts((prev) => [
        {
          id: `ALT-EMG-${Date.now().toString().slice(-4)}`,
          title: 'BENZ CIRCLE FLYOVER SEVERE BOTTLENECK',
          zone: 'Benz Circle & MG Road',
          type: 'traffic',
          severity: 'CRITICAL',
          message: 'NH-16 interstate transit bottleneck at Benz Circle intersection. Adaptive green phase extended.',
          timestamp: 'Just now',
        },
        ...prev,
      ]);
    } else if (type === 'pipe_burst') {
      setMetrics((prev) => ({
        ...prev,
        water: {
          ...prev.water,
          trunk_pressure_bar: 2.12,
          active_leaks_detected: 2,
          anomaly_score: -0.86,
        },
      }));
      setWaterNodes((prev) =>
        prev.map((w) =>
          w.id === 'W-SEC-3'
            ? { ...w, pressureBar: 2.12, acousticLeakScore: 0.95, status: 'LEAK_DETECTED' }
            : w
        )
      );
      setAlerts((prev) => [
        {
          id: `ALT-EMG-${Date.now().toString().slice(-4)}`,
          title: 'BHAVANIPURAM PIPELINE PRESSURE COLLAPSE',
          zone: 'Bhavanipuram Head Works',
          type: 'water',
          severity: 'CRITICAL',
          message: 'Isolation Forest flagged sudden pressure drop to 2.12 Bar near Rythu Bazaar. Gate valve isolation advised.',
          timestamp: 'Just now',
        },
        ...prev,
      ]);
    } else if (type === 'grid_spike') {
      setMetrics((prev) => ({
        ...prev,
        energy: {
          ...prev.energy,
          grid_load_mw: 542.0,
          peak_warning: true,
        },
      }));
      setAlerts((prev) => [
        {
          id: `ALT-EMG-${Date.now().toString().slice(-4)}`,
          title: 'GUNADALA 220KV SUBSTATION LOAD SURGE',
          zone: 'Gunadala Industrial Zone',
          type: 'energy',
          severity: 'WARNING',
          message: 'Grid load reached 542.0 MW (90% capacity). APTRANSCO automated demand management triggered.',
          timestamp: 'Just now',
        },
        ...prev,
      ]);
    } else if (type === 'bin_overflow') {
      setSmartBins((prev) =>
        prev.map((b, idx) => (idx < 3 ? { ...b, fillPct: 98, status: 'Overflow Hazard' } : b))
      );
      setAlerts((prev) => [
        {
          id: `ALT-EMG-${Date.now().toString().slice(-4)}`,
          title: 'One Town & PNBS Market Bins Overflowing',
          zone: 'One Town & Governorpet',
          type: 'waste',
          severity: 'WARNING',
          message: 'Kaleswara Rao Market & PNBS bus station smart bins exceed 95% capacity. Immediate fleet routing advised.',
          timestamp: 'Just now',
        },
        ...prev,
      ]);
    }
  };

  return (
    <CityDataContext.Provider
      value={{
        metrics,
        zones,
        mapNodes,
        streetlights,
        smartBins,
        waterNodes,
        complaints,
        alerts,
        userRole,
        setUserRole,
        isAuthenticated,
        currentUser,
        login,
        logout,
        theme,
        setTheme,
        toggleTheme,
        isSimulating,
        setIsSimulating,
        simulationSpeed,
        setSimulationSpeed,
        selectedMapNode,
        setSelectedMapNode,
        toggleStreetlight,
        setStreetlightBrightness,
        toggleAllStreetlights,
        emptyBin,
        dispatchBinFleet,
        toggleWaterValve,
        addComplaint,
        updateComplaintStatus,
        acknowledgeAlert,
        triggerEmergency,
      }}
    >
      {children}
    </CityDataContext.Provider>
  );
};

export const useCityData = (): CityDataContextType => {
  const context = useContext(CityDataContext);
  if (!context) {
    throw new Error('useCityData must be used within a CityDataProvider');
  }
  return context;
};
