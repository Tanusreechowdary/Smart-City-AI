import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Globe,
  Map as MapIcon,
  Home,
  Plus,
  Minus,
  Maximize2,
  Compass,
  Car,
  Moon,
  AlertTriangle,
} from 'lucide-react';
import {
  AP_DISTRICTS,
  AP_BOUNDS,
  AP_STATE_BOUNDARY,
  AP_TRAFFIC_CORRIDORS,
  AP_TRAFFIC_INCIDENTS,
} from '../services/andhraPradeshGeo';

interface DashboardMiniMapProps {
  onNavigateFullMap: () => void;
  onSelectPinInfo: (info: string) => void;
}

export const DashboardMiniMap: React.FC<DashboardMiniMapProps> = ({
  onNavigateFullMap,
  onSelectPinInfo,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const labelLayerRef = useRef<L.TileLayer | null>(null);
  const trafficLayerRef = useRef<L.LayerGroup | null>(null);
  const [mapType, setMapType] = useState<'satellite' | 'traffic' | 'streets' | 'dark'>('satellite');
  const [activeDistrict, setActiveDistrict] = useState<string>('vijayawada');
  const [currentZoom, setCurrentZoom] = useState<number>(14);

  // Initialize mini map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [16.5062, 80.6480],
      zoom: 14,
      minZoom: 6,
      maxZoom: 19,
      zoomControl: false,
      attributionControl: false,
    });

    // Determine initial tile URL
    let tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    if (mapType === 'streets') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    } else if (mapType === 'traffic') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    } else if (mapType === 'dark') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    }

    const tile = L.tileLayer(tileUrl, { maxZoom: 19, subdomains: 'abcd' }).addTo(map);
    tileLayerRef.current = tile;

    if (mapType === 'satellite') {
      const labels = L.tileLayer(
        'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19, opacity: 0.85 }
      ).addTo(map);
      labelLayerRef.current = labels;
    }

    // Add Andhra Pradesh boundary
    L.polygon(AP_STATE_BOUNDARY, {
      color: '#0284c7',
      weight: 2,
      dashArray: '5, 5',
      fillColor: '#38bdf8',
      fillOpacity: 0.04,
    }).addTo(map);

    // Traffic corridors group
    const trafficGroup = L.layerGroup().addTo(map);
    trafficLayerRef.current = trafficGroup;

    // Render traffic lines if traffic mode
    if (mapType === 'traffic') {
      AP_TRAFFIC_CORRIDORS.forEach((c) => {
        const color = c.status === 'congested' ? '#ef4444' : c.status === 'moderate' ? '#f59e0b' : '#22c55e';
        const poly = L.polyline(c.coordinates, {
          color,
          weight: 5.5,
          opacity: 0.9,
          dashArray: c.status === 'congested' ? '6, 5' : undefined,
        });
        poly.on('click', () => {
          onSelectPinInfo(`🚗 ${c.name} (${c.district}): Flow speed ${c.currentSpeedKmh} km/h (Delay: +${c.delayMinutes} mins). Vol: ${c.vehiclesPerHour} v/h.`);
        });
        poly.bindTooltip(`${c.name} • ${c.currentSpeedKmh} km/h`, { sticky: true });
        trafficGroup.addLayer(poly);
      });
    }

    // Add Pins matching the screenshot pins plus statewide AP pins
    const pins = [
      {
        id: 'aqi',
        title: 'Air Quality Station: Benz Circle',
        lat: 16.4982,
        lng: 80.6548,
        color: '#10b981',
        icon: '🌿',
        info: 'Air Quality Monitoring Station: Benz Circle, Vijayawada. Real-time AQI 42 (Good), PM2.5: 14 µg/m³.',
      },
      {
        id: 'bus',
        title: 'Bus Stop: PNBS Central Terminal',
        lat: 16.5098,
        lng: 80.6200,
        color: '#2563eb',
        icon: '🚌',
        info: 'Bus Stop Node: PNBS Inter-City Bus Terminal. 6 arrivals in next 10 mins (APSRTC Live).',
      },
      {
        id: 'traffic',
        title: 'Traffic Alert: Prakasam Barrage',
        lat: 16.5074,
        lng: 80.6062,
        color: '#f43f5e',
        icon: '🚨',
        info: 'Traffic Alert: Prakasam Barrage Bridge. Flow speed 22 km/h. Single lane repair in effect.',
      },
      {
        id: 'waste',
        title: 'Smart Bin: Governorpet Market',
        lat: 16.5124,
        lng: 80.6285,
        color: '#f59e0b',
        icon: '🗑️',
        info: 'Smart Bin: Governorpet Commercial Area. Fill level 48%. Next scheduled cycle at 14:00.',
      },
      {
        id: 'facility',
        title: 'Public Facility: VMC Civic Center',
        lat: 16.5160,
        lng: 80.6380,
        color: '#3b82f6',
        icon: '🏢',
        info: 'Public Facility: VMC Citizen Service Center. Citizen queries counter active.',
      },
      {
        id: 'vizag_pin',
        title: 'Vizag Smart Coastal Hub',
        lat: 17.7150,
        lng: 83.3240,
        color: '#06b6d4',
        icon: '🌊',
        info: 'Visakhapatnam Smart City: Beach Road & Rushikonda corridor. Telemetry: Normal, AQI 34.',
      },
      {
        id: 'tpt_pin',
        title: 'Tirupati Alipiri Gateway',
        lat: 13.6510,
        lng: 79.4010,
        color: '#8b5cf6',
        icon: '🛕',
        info: 'Tirupati Alipiri Gateway: Pilgrim traffic flow active, 92 veh/min.',
      },
      {
        id: 'amr_pin',
        title: 'Amaravati Secretariat',
        lat: 16.5131,
        lng: 80.5158,
        color: '#10b981',
        icon: '🏛️',
        info: 'Amaravati Velagapudi Secretariat: State Grid SCADA Online, 18.4 MW Clean Load.',
      },
    ];

    pins.forEach((p) => {
      const pinIcon = L.divIcon({
        className: 'dashboard-pin-marker',
        html: `
          <div style="
            background: ${p.color};
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 9999px;
            border: 2px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            cursor: pointer;
            transition: transform 0.15s ease;
          ">
            ${p.icon}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([p.lat, p.lng], { icon: pinIcon });
      marker.on('click', () => {
        onSelectPinInfo(p.info);
      });
      marker.bindTooltip(p.title, { direction: 'top', offset: [0, -14] });
      marker.addTo(map);
    });

    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    leafletMapRef.current = map;

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(timer);
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Update tile layer & traffic overlay when mapType changes
  useEffect(() => {
    if (!leafletMapRef.current) return;
    const map = leafletMapRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
      tileLayerRef.current = null;
    }
    if (labelLayerRef.current) {
      map.removeLayer(labelLayerRef.current);
      labelLayerRef.current = null;
    }

    let tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    if (mapType === 'streets') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    } else if (mapType === 'traffic') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    } else if (mapType === 'dark') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    }

    const tile = L.tileLayer(tileUrl, { maxZoom: 19, subdomains: 'abcd' }).addTo(map);
    tileLayerRef.current = tile;

    if (mapType === 'satellite') {
      const labels = L.tileLayer(
        'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19, opacity: 0.85 }
      ).addTo(map);
      labelLayerRef.current = labels;
    }

    // Refresh traffic overlay
    if (trafficLayerRef.current) {
      trafficLayerRef.current.clearLayers();
      if (mapType === 'traffic') {
        AP_TRAFFIC_CORRIDORS.forEach((c) => {
          const color = c.status === 'congested' ? '#ef4444' : c.status === 'moderate' ? '#f59e0b' : '#22c55e';
          const poly = L.polyline(c.coordinates, {
            color,
            weight: 5.5,
            opacity: 0.9,
            dashArray: c.status === 'congested' ? '6, 5' : undefined,
          });
          poly.on('click', () => {
            onSelectPinInfo(`🚗 ${c.name} (${c.district}): Flow speed ${c.currentSpeedKmh} km/h (Delay: +${c.delayMinutes} mins). Vol: ${c.vehiclesPerHour} v/h.`);
          });
          poly.bindTooltip(`${c.name} • ${c.currentSpeedKmh} km/h`, { sticky: true });
          trafficLayerRef.current?.addLayer(poly);
        });

        // Add incident alert pins
        AP_TRAFFIC_INCIDENTS.slice(0, 3).forEach((inc) => {
          const marker = L.circleMarker(inc.coordinates, {
            radius: 8,
            color: '#ffffff',
            weight: 2,
            fillColor: '#ef4444',
            fillOpacity: 0.9,
          });
          marker.on('click', () => {
            onSelectPinInfo(`🚨 ${inc.title}: ${inc.location}. Delay +${inc.delayMin} mins.`);
          });
          marker.bindTooltip(inc.title, { sticky: true });
          trafficLayerRef.current?.addLayer(marker);
        });
      }
    }
  }, [mapType, onSelectPinInfo]);

  const flyTo = (lat: number, lng: number, zoom: number, distId: string) => {
    setActiveDistrict(distId);
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo([lat, lng], zoom, { duration: 1.0 });
    }
  };

  const flyToState = () => {
    setActiveDistrict('state');
    if (leafletMapRef.current) {
      leafletMapRef.current.fitBounds(AP_BOUNDS, { padding: [15, 15], duration: 1.2 });
    }
  };

  const zoomToHouses = () => {
    if (leafletMapRef.current) {
      const center = leafletMapRef.current.getCenter();
      leafletMapRef.current.flyTo(center, 18.2, { duration: 1.0 });
    }
  };

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-200 select-none bg-slate-100 flex flex-col h-[290px]">
      {/* Mini Controls Top Bar */}
      <div className="absolute top-2 left-2 right-2 z-20 flex items-center justify-between gap-1 pointer-events-none">
        {/* District Quick Chips */}
        <div className="pointer-events-auto flex items-center gap-1 bg-white/95 backdrop-blur-md px-1.5 py-1 rounded-lg border border-slate-200 shadow-xs text-[10px]">
          <button
            onClick={flyToState}
            className={`px-1.5 py-0.5 rounded cursor-pointer font-medium ${
              activeDistrict === 'state' ? 'bg-[#1366d9] text-white font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All AP
          </button>
          <button
            onClick={() => flyTo(16.5062, 80.6480, 14, 'vijayawada')}
            className={`px-1.5 py-0.5 rounded cursor-pointer font-medium ${
              activeDistrict === 'vijayawada' ? 'bg-[#1366d9] text-white font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Vijayawada
          </button>
          <button
            onClick={() => flyTo(17.6868, 83.2185, 13, 'vizag')}
            className={`px-1.5 py-0.5 rounded cursor-pointer font-medium ${
              activeDistrict === 'vizag' ? 'bg-[#1366d9] text-white font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Vizag
          </button>
          <button
            onClick={() => flyTo(13.6288, 79.4192, 13, 'tirupati')}
            className={`px-1.5 py-0.5 rounded cursor-pointer font-medium ${
              activeDistrict === 'tirupati' ? 'bg-[#1366d9] text-white font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tirupati
          </button>
        </div>

        {/* Maps Selector Bar: Satellite, Traffic, Streets, Dark */}
        <div className="pointer-events-auto flex items-center gap-1 bg-white/95 backdrop-blur-md border border-slate-200 p-0.5 rounded-lg shadow-xs text-[10px]">
          <button
            onClick={() => setMapType('satellite')}
            className={`px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold cursor-pointer transition-all ${
              mapType === 'satellite' ? 'bg-[#1366d9] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="High-Resolution Satellite Map (House Roofs)"
          >
            <Globe className="w-3 h-3 text-cyan-500" />
            <span>Satellite</span>
          </button>

          <button
            onClick={() => setMapType('traffic')}
            className={`px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold cursor-pointer transition-all ${
              mapType === 'traffic' ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Live Traffic Congestion Corridors & Speed"
          >
            <Car className="w-3 h-3 text-amber-500" />
            <span>Traffic</span>
          </button>

          <button
            onClick={() => setMapType('streets')}
            className={`px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold cursor-pointer transition-all ${
              mapType === 'streets' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="OpenStreetMap Streets & Building Footprints"
          >
            <MapIcon className="w-3 h-3 text-emerald-500" />
            <span>Streets</span>
          </button>

          <button
            onClick={() => setMapType('dark')}
            className={`px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold cursor-pointer transition-all ${
              mapType === 'dark' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Command Center Dark GIS"
          >
            <Moon className="w-3 h-3 text-indigo-400" />
            <span>Dark</span>
          </button>

          <button
            onClick={zoomToHouses}
            className="flex items-center gap-1 bg-blue-50 text-[#1366d9] hover:bg-blue-100 px-1.5 py-0.5 rounded font-bold border border-blue-200 cursor-pointer ml-0.5"
            title="Zoom directly to streets and houses (18x)"
          >
            <Home className="w-2.5 h-2.5" />
            <span>18x</span>
          </button>
        </div>
      </div>

      {/* Floating Zoom & Compass Buttons Bottom-Right */}
      <div className="absolute bottom-2 right-2 z-20 flex flex-col bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden pointer-events-auto">
        <button
          onClick={() => {
            if (leafletMapRef.current) leafletMapRef.current.zoomIn();
          }}
          className="p-1 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          title="Zoom in"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <div className="border-t border-slate-200" />
        <button
          onClick={() => {
            if (leafletMapRef.current) leafletMapRef.current.zoomOut();
          }}
          className="p-1 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          title="Zoom out"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <div className="border-t border-slate-200" />
        <button
          onClick={onNavigateFullMap}
          className="p-1 hover:bg-slate-100 text-[#1366d9] transition-colors cursor-pointer"
          title="Expand to Full Digital Twin Map"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Zoom indicator chip */}
      <div className="absolute bottom-2 left-2 z-20 bg-slate-900/80 text-white text-[9px] font-mono px-1.5 py-0.5 rounded shadow pointer-events-none flex items-center gap-1">
        <span>{mapType === 'traffic' ? '🚦 Live Traffic Flow' : mapType === 'satellite' ? '🛰️ Satellite' : '🗺️ Street Map'}</span>
        <span>•</span>
        <span>{currentZoom >= 17 ? '🏠 Street & House Detail' : `Zoom ${currentZoom.toFixed(1)}x`}</span>
      </div>

      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
