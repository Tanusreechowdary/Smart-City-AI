import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Crosshair,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Car,
  Wind,
  Zap,
  Droplets,
  Lightbulb,
  Radio,
  MapPin,
  X,
  Compass,
  Map as MapIcon,
  Globe,
  Navigation,
  Eye,
  Search,
  Home,
  CheckCircle2,
  ShieldCheck,
  ChevronDown,
  AlertTriangle,
  Clock,
  Gauge,
  Sliders,
  Sparkles,
  Info,
} from 'lucide-react';
import { useCityData } from '../context/CityDataContext';
import { MapNode } from '../types';
import {
  AP_DISTRICTS,
  AP_BOUNDS,
  AP_CENTER,
  AP_STATE_BOUNDARY,
  MAP_PROVIDERS,
  AP_TRAFFIC_CORRIDORS,
  AP_TRAFFIC_INCIDENTS,
  APDistrict,
  MapTileProvider,
  TrafficCorridor,
  TrafficIncident,
} from '../services/andhraPradeshGeo';

export const DigitalTwinMap: React.FC = () => {
  const { mapNodes, selectedMapNode, setSelectedMapNode } = useCityData();
  const [filterType, setFilterType] = useState<string>('all');
  const [activeProviderId, setActiveProviderId] = useState<string>('satellite_roofs');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('state_ap');
  const [currentZoom, setCurrentZoom] = useState<number>(7.5);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMapCatalogOpen, setIsMapCatalogOpen] = useState<boolean>(false);

  // Overlays toggle state
  const [showTrafficCorridors, setShowTrafficCorridors] = useState<boolean>(true);
  const [showTrafficIncidents, setShowTrafficIncidents] = useState<boolean>(true);
  const [showHousePlots, setShowHousePlots] = useState<boolean>(true);
  const [showIotNodes, setShowIotNodes] = useState<boolean>(true);

  // Selected telemetry items
  const [selectedCorridor, setSelectedCorridor] = useState<TrafficCorridor | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<TrafficIncident | null>(null);
  const [selectedHouseDetail, setSelectedHouseDetail] = useState<{
    address: string;
    colony: string;
    district: string;
    lat: number;
    lng: number;
    smartFeatures: string[];
  } | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const labelLayerRef = useRef<L.TileLayer | null>(null);
  const trafficCorridorsLayerRef = useRef<L.LayerGroup | null>(null);
  const trafficIncidentsLayerRef = useRef<L.LayerGroup | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const houseMarkersLayerRef = useRef<L.LayerGroup | null>(null);
  const stateBoundaryLayerRef = useRef<L.Polygon | null>(null);

  const filteredNodes =
    filterType === 'all'
      ? mapNodes
      : mapNodes.filter((n) => n.type === filterType);

  // Filter map providers by active category
  const filteredProviders =
    activeCategoryFilter === 'all'
      ? MAP_PROVIDERS
      : MAP_PROVIDERS.filter((p) => p.category === activeCategoryFilter);

  const currentProvider =
    MAP_PROVIDERS.find((p) => p.id === activeProviderId) || MAP_PROVIDERS[0];

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: AP_CENTER,
      zoom: 7.5,
      minZoom: 6,
      maxZoom: 19,
      zoomControl: false,
      attributionControl: false,
    });

    // Fit to Andhra Pradesh bounds initially
    map.fitBounds(AP_BOUNDS, { padding: [20, 20] });

    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    // Active tile provider
    const provider = MAP_PROVIDERS.find((p) => p.id === activeProviderId) || MAP_PROVIDERS[0];
    const tileLayer = L.tileLayer(provider.url, {
      maxZoom: provider.maxZoom,
      subdomains: provider.subdomains || 'abc',
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Overlay labels if Satellite Roofs or Satellite Hybrid
    if (activeProviderId === 'satellite_roofs' || activeProviderId === 'satellite_hybrid') {
      const labelsLayer = L.tileLayer(
        'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19, opacity: 0.88 }
      ).addTo(map);
      labelLayerRef.current = labelsLayer;
    }

    // Add Andhra Pradesh State Boundary outline
    const apBorder = L.polygon(AP_STATE_BOUNDARY, {
      color: '#0284c7',
      weight: 2.5,
      dashArray: '6, 5',
      fillColor: '#38bdf8',
      fillOpacity: 0.03,
    }).addTo(map);
    stateBoundaryLayerRef.current = apBorder;

    // Layer groups
    trafficCorridorsLayerRef.current = L.layerGroup().addTo(map);
    trafficIncidentsLayerRef.current = L.layerGroup().addTo(map);
    markersLayerRef.current = L.layerGroup().addTo(map);
    houseMarkersLayerRef.current = L.layerGroup().addTo(map);

    // Interactive map click for House / Plot Inspector
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      let closestDist = AP_DISTRICTS[1];
      let minDistance = 999;
      AP_DISTRICTS.slice(1).forEach((d) => {
        const dist = Math.hypot(d.center[0] - lat, d.center[1] - lng);
        if (dist < minDistance) {
          minDistance = dist;
          closestDist = d;
        }
      });

      const houseNo = Math.abs(Math.floor((lat * 1000) % 80)) + 1;
      const streetName =
        closestDist.keyStreets[Math.abs(Math.floor((lng * 1000) % closestDist.keyStreets.length))] ||
        'Main Sector Road';

      setSelectedHouseDetail({
        address: `House / Plot #${houseNo}, ${streetName}`,
        colony: `${closestDist.name} Municipal Ward ${Math.abs(Math.floor((lat * 100) % 25)) + 1}`,
        district: `${closestDist.name}, Andhra Pradesh`,
        lat,
        lng,
        smartFeatures: [
          'AP Smart Power Grid Meter (Connected)',
          'Piped Drinking Water SCADA Node Active',
          'AP FiberNet High-Speed Optical Connected',
          'Smart Streetlighting Zhaga Grid Monitored',
        ],
      });
      setSelectedCorridor(null);
      setSelectedIncident(null);
    });

    leafletMapRef.current = map;

    const resizeTimer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      clearTimeout(resizeTimer);
      resizeObserver.disconnect();
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when Provider changes
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

    const provider = MAP_PROVIDERS.find((p) => p.id === activeProviderId) || MAP_PROVIDERS[0];
    const newTile = L.tileLayer(provider.url, {
      maxZoom: provider.maxZoom,
      subdomains: provider.subdomains || 'abc',
    }).addTo(map);
    tileLayerRef.current = newTile;

    if (activeProviderId === 'satellite_roofs' || activeProviderId === 'satellite_hybrid') {
      const labels = L.tileLayer(
        'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19, opacity: 0.88 }
      ).addTo(map);
      labelLayerRef.current = labels;
    }

    // Auto-enable traffic overlays if traffic map selected
    if (provider.hasTrafficOverlay) {
      setShowTrafficCorridors(true);
      setShowTrafficIncidents(true);
    }
  }, [activeProviderId]);

  // Update Live Traffic Corridors on Map
  useEffect(() => {
    if (!leafletMapRef.current || !trafficCorridorsLayerRef.current) return;
    const layer = trafficCorridorsLayerRef.current;
    layer.clearLayers();

    if (!showTrafficCorridors) return;

    AP_TRAFFIC_CORRIDORS.forEach((corridor) => {
      const isSelected = selectedCorridor?.id === corridor.id;
      let strokeColor = '#22c55e'; // free flow green
      if (corridor.status === 'moderate') strokeColor = '#f59e0b'; // orange
      if (corridor.status === 'congested') strokeColor = '#ef4444'; // red
      if (corridor.status === 'blocked') strokeColor = '#881337'; // dark red

      // Base shadow / glow
      const glowPoly = L.polyline(corridor.coordinates, {
        color: strokeColor,
        weight: isSelected ? 11 : 8,
        opacity: isSelected ? 0.45 : 0.25,
        lineCap: 'round',
        lineJoin: 'round',
      });

      // Sharp central line
      const linePoly = L.polyline(corridor.coordinates, {
        color: strokeColor,
        weight: isSelected ? 6 : 4.5,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: corridor.status === 'congested' ? '8, 6' : undefined,
      });

      linePoly.on('click', () => {
        setSelectedCorridor(corridor);
        setSelectedHouseDetail(null);
        setSelectedIncident(null);
      });

      linePoly.bindTooltip(
        `<div style="font-family: system-ui; font-size: 11px; padding: 2px 4px;">
          <strong style="color: ${strokeColor}; font-weight: bold;">${corridor.name}</strong><br/>
          <span>Speed: <b>${corridor.currentSpeedKmh} km/h</b> (Normal: ${corridor.normalSpeedKmh} km/h)</span><br/>
          <span>Delay: <b>+${corridor.delayMinutes} mins</b> • Vol: ${corridor.vehiclesPerHour} veh/h</span>
        </div>`,
        { sticky: true }
      );

      layer.addLayer(glowPoly);
      layer.addLayer(linePoly);
    });
  }, [showTrafficCorridors, selectedCorridor]);

  // Update Live Traffic Incident Markers
  useEffect(() => {
    if (!leafletMapRef.current || !trafficIncidentsLayerRef.current) return;
    const layer = trafficIncidentsLayerRef.current;
    layer.clearLayers();

    if (!showTrafficIncidents) return;

    AP_TRAFFIC_INCIDENTS.forEach((inc) => {
      const isCongestion = inc.type === 'congestion';
      const isHigh = inc.severity === 'high';
      const markerBg = isHigh ? '#ef4444' : '#f59e0b';
      const iconSymbol = isCongestion ? '🚨' : '⚠️';

      const customIcon = L.divIcon({
        className: 'custom-traffic-incident-marker',
        html: `
          <div style="
            background: ${markerBg};
            color: #ffffff;
            width: 28px;
            height: 28px;
            border-radius: 9999px;
            border: 2px solid #ffffff;
            box-shadow: 0 0 12px ${markerBg};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            cursor: pointer;
            animation: pulse 2s infinite;
          ">
            ${iconSymbol}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker(inc.coordinates, { icon: customIcon });
      marker.on('click', () => {
        setSelectedIncident(inc);
        setSelectedCorridor(null);
        setSelectedHouseDetail(null);
      });

      marker.bindTooltip(
        `<div style="font-family: system-ui; font-size: 11px;">
          <strong style="color: ${markerBg};">${inc.title}</strong><br/>
          <span>${inc.location}</span><br/>
          <span style="color: #ef4444; font-weight: bold;">Delay: +${inc.delayMin} mins (${inc.reportedAgo})</span>
        </div>`,
        { direction: 'top', offset: [0, -14] }
      );

      layer.addLayer(marker);
    });
  }, [showTrafficIncidents]);

  // Update IoT Nodes & Residential House Markers
  useEffect(() => {
    if (!leafletMapRef.current || !markersLayerRef.current || !houseMarkersLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    if (showIotNodes) {
      filteredNodes.forEach((node) => {
        const isSelected = selectedMapNode?.id === node.id;
        const isCritical = node.status === 'critical';
        const isWarning = node.status === 'warning';

        const colorHex = isCritical ? '#f43f5e' : isWarning ? '#f59e0b' : '#0284c7';
        const bgHex = isCritical
          ? 'rgba(244,63,94,0.25)'
          : isWarning
          ? 'rgba(245,158,11,0.25)'
          : 'rgba(2,132,199,0.25)';

        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div style="
              position: relative;
              width: 32px;
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 9999px;
              background: ${bgHex};
              border: 2px solid ${colorHex};
              box-shadow: 0 0 ${isSelected ? '16px' : '6px'} ${colorHex};
              transform: ${isSelected ? 'scale(1.25)' : 'scale(1)'};
              transition: all 0.2s ease;
              cursor: pointer;
            ">
              <div style="
                width: 10px;
                height: 10px;
                border-radius: 9999px;
                background: ${colorHex};
              "></div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([node.lat, node.lng], { icon: customIcon });
        marker.on('click', () => {
          setSelectedMapNode(node);
          setSelectedCorridor(null);
          setSelectedIncident(null);
          setSelectedHouseDetail(null);
        });

        marker.bindTooltip(
          `<div style="font-family: system-ui; font-size: 11px; padding: 2px 4px;">
            <strong style="color: ${colorHex}">${node.id}</strong><br/>
            <span style="font-weight: 600;">${node.name}</span><br/>
            <strong style="color: ${colorHex}">● ${node.value}</strong>
          </div>`,
          { direction: 'top', offset: [0, -16] }
        );

        markersLayerRef.current?.addLayer(marker);
      });
    }

    // Sample houses markers
    houseMarkersLayerRef.current.clearLayers();
    if (showHousePlots) {
      AP_DISTRICTS.forEach((dist) => {
        dist.sampleHouses.forEach((house) => {
          const houseIcon = L.divIcon({
            className: 'custom-house-marker',
            html: `
              <div style="
                background: #10b981;
                border: 2px solid #ffffff;
                color: #ffffff;
                border-radius: 6px;
                padding: 2px 5px;
                font-size: 10px;
                font-weight: bold;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                white-space: nowrap;
                display: flex;
                align-items: center;
                gap: 3px;
                cursor: pointer;
              ">
                <span>🏠</span>
                <span>House</span>
              </div>
            `,
            iconSize: [60, 22],
            iconAnchor: [30, 11],
          });

          const hMarker = L.marker([house.lat, house.lng], { icon: houseIcon });
          hMarker.on('click', () => {
            setSelectedHouseDetail({
              address: house.address,
              colony: house.colony,
              district: `${dist.name}, Andhra Pradesh`,
              lat: house.lat,
              lng: house.lng,
              smartFeatures: house.smartFeatures,
            });
            setSelectedCorridor(null);
            setSelectedIncident(null);
            if (leafletMapRef.current) {
              leafletMapRef.current.flyTo([house.lat, house.lng], 18, { duration: 1.0 });
            }
          });
          houseMarkersLayerRef.current?.addLayer(hMarker);
        });
      });
    }
  }, [filteredNodes, selectedMapNode, showIotNodes, showHousePlots, setSelectedMapNode]);

  // Fly to Andhra Pradesh District or Street level
  const flyToDistrict = (district: APDistrict, zoomToStreet = false) => {
    setSelectedDistrictId(district.id);
    if (!leafletMapRef.current) return;

    if (district.id === 'state_ap') {
      leafletMapRef.current.fitBounds(AP_BOUNDS, { padding: [25, 25], duration: 1.5 });
      return;
    }

    const targetZoom = zoomToStreet ? 18.2 : district.defaultZoom;
    leafletMapRef.current.flyTo(district.center, targetZoom, { duration: 1.4 });
  };

  // Zoom directly to street & house level (18.2x)
  const zoomToHousesAndStreets = () => {
    if (!leafletMapRef.current) return;
    const currentCenter = leafletMapRef.current.getCenter();
    leafletMapRef.current.flyTo(currentCenter, 18.2, { duration: 1.2 });
  };

  // Search execution for Andhra Pradesh locations
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !leafletMapRef.current) return;
    const query = searchQuery.toLowerCase().trim();

    // Check corridors first
    const matchedCorridor = AP_TRAFFIC_CORRIDORS.find((c) =>
      c.name.toLowerCase().includes(query) || c.district.toLowerCase().includes(query)
    );
    if (matchedCorridor) {
      setSelectedCorridor(matchedCorridor);
      leafletMapRef.current.flyTo(matchedCorridor.coordinates[0], 16, { duration: 1.2 });
      return;
    }

    // Check districts
    const matchedDistrict = AP_DISTRICTS.find(
      (d) =>
        d.name.toLowerCase().includes(query) ||
        d.regionalTitle.toLowerCase().includes(query) ||
        d.keyStreets.some((s) => s.toLowerCase().includes(query))
    );

    if (matchedDistrict) {
      flyToDistrict(matchedDistrict, true);
      return;
    }

    // Check sample houses
    for (const d of AP_DISTRICTS) {
      for (const h of d.sampleHouses) {
        if (
          h.address.toLowerCase().includes(query) ||
          h.colony.toLowerCase().includes(query)
        ) {
          leafletMapRef.current.flyTo([h.lat, h.lng], 18.5, { duration: 1.2 });
          setSelectedHouseDetail({
            address: h.address,
            colony: h.colony,
            district: `${d.name}, Andhra Pradesh`,
            lat: h.lat,
            lng: h.lng,
            smartFeatures: h.smartFeatures,
          });
          return;
        }
      }
    }

    if (query.includes('benz') || query.includes('mg road') || query.includes('bandar')) {
      leafletMapRef.current.flyTo([16.4971, 80.6557], 18.2, { duration: 1.2 });
    } else if (query.includes('beach') || query.includes('vizag')) {
      leafletMapRef.current.flyTo([17.7150, 83.3240], 18.2, { duration: 1.2 });
    } else if (query.includes('alipiri') || query.includes('tirupati')) {
      leafletMapRef.current.flyTo([13.6510, 79.4010], 18.2, { duration: 1.2 });
    } else {
      leafletMapRef.current.flyTo(leafletMapRef.current.getCenter(), 18.2, { duration: 1.2 });
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden relative border border-slate-200 bg-white flex flex-col h-[780px] shadow-sm select-none">
      {/* Top Map HUD Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-col gap-2 pointer-events-none">
        {/* Main Row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Title Badge with State Scope */}
          <div className="pointer-events-auto flex items-center gap-2.5 bg-white/95 backdrop-blur-md border border-slate-200/90 px-3.5 py-1.5 rounded-xl shadow-md">
            <MapPin className="w-4 h-4 text-cyan-600 animate-pulse" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold tracking-wide text-slate-900">
                  ANDHRA PRADESH GIS DIGITAL TWIN
                </span>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                  {currentProvider.badge}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium block">
                {currentProvider.name} • Zoom {currentZoom.toFixed(1)}x
              </span>
            </div>
          </div>

          {/* Search Street / Colony Bar */}
          <form
            onSubmit={handleSearch}
            className="pointer-events-auto flex items-center bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl px-2.5 py-1 shadow-md w-64 md:w-72"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search AP street, highway, house..."
              className="w-full text-xs text-slate-800 placeholder:text-slate-400 bg-transparent focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </form>

          {/* Quick "Zoom to Streets & Houses" Action Button */}
          <button
            onClick={zoomToHousesAndStreets}
            className="pointer-events-auto flex items-center gap-1.5 bg-[#1366d9] hover:bg-[#0f52b0] text-white px-3 py-1.5 rounded-xl font-semibold text-xs shadow-md transition-all hover:scale-102 cursor-pointer"
            title="Zoom into high-resolution street and individual house roof level (Zoom 18x)"
          >
            <Home className="w-3.5 h-3.5" />
            <span>18x Houses</span>
          </button>

          {/* Map Catalog / All Maps Switcher Button */}
          <div className="pointer-events-auto relative">
            <button
              onClick={() => setIsMapCatalogOpen(!isMapCatalogOpen)}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl font-semibold text-xs shadow-md transition-all cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Map Catalog ({MAP_PROVIDERS.length})</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMapCatalogOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Map Catalog Dropdown Modal */}
            {isMapCatalogOpen && (
              <div className="absolute right-0 top-10 w-96 max-h-[480px] overflow-y-auto bg-white/98 backdrop-blur-xl border border-slate-200 rounded-2xl p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#1366d9]" />
                    <span className="font-bold text-slate-900">Select GIS Map Layer</span>
                  </div>
                  <button
                    onClick={() => setIsMapCatalogOpen(false)}
                    className="text-slate-400 hover:text-slate-700 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Categories Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1.5 mb-2 border-b border-slate-100 text-[10px]">
                  {[
                    { id: 'all', label: 'All Maps' },
                    { id: 'satellite', label: '🛰️ Satellite' },
                    { id: 'thematic', label: '💧 SCADA & Environment' },
                    { id: 'topo', label: '🏔️ River Basins' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategoryFilter(cat.id)}
                      className={`px-2 py-0.5 rounded-md font-medium shrink-0 cursor-pointer ${
                        activeCategoryFilter === cat.id
                          ? 'bg-[#1366d9] text-white font-bold'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Map Providers Grid */}
                <div className="space-y-1.5">
                  {filteredProviders.map((provider) => (
                    <div
                      key={provider.id}
                      onClick={() => {
                        setActiveProviderId(provider.id);
                        setIsMapCatalogOpen(false);
                      }}
                      className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        activeProviderId === provider.id
                          ? 'border-[#1366d9] bg-blue-50/70 shadow-xs'
                          : 'border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="text-xl shrink-0 mt-0.5">{provider.icon}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 text-xs">{provider.name}</span>
                            <span className="text-[9px] bg-slate-100 text-slate-700 font-bold px-1.5 py-0.2 rounded">
                              {provider.badge}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                            {provider.description}
                          </p>
                        </div>
                      </div>

                      {activeProviderId === provider.id && (
                        <CheckCircle2 className="w-4 h-4 text-[#1366d9] shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Second Row: Quick Filter Bar & Overlays Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Andhra Pradesh District Quick-Jump Scrollbar */}
          <div className="pointer-events-auto flex items-center gap-1.5 overflow-x-auto pb-1 bg-white/95 backdrop-blur-md border border-slate-200/80 p-1.5 rounded-xl shadow-sm text-xs no-scrollbar max-w-[620px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 shrink-0">
              Districts:
            </span>
            {AP_DISTRICTS.map((dist) => (
              <button
                key={dist.id}
                onClick={() => flyToDistrict(dist, false)}
                onDoubleClick={() => flyToDistrict(dist, true)}
                className={`px-2 py-0.5 rounded-lg shrink-0 font-medium transition-all flex items-center gap-1 cursor-pointer text-[11px] ${
                  selectedDistrictId === dist.id
                    ? 'bg-slate-900 text-white font-bold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100 bg-white border border-slate-200'
                }`}
                title={`${dist.name} - Double click to zoom into streets & houses`}
              >
                <span>{dist.name.split(' ')[0]}</span>
                {dist.id !== 'state_ap' && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      flyToDistrict(dist, true);
                    }}
                    className="text-[9px] bg-blue-100 text-blue-700 px-1 rounded hover:bg-blue-200 cursor-pointer font-bold"
                  >
                    18x
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Layer Overlay Toggles */}
          <div className="pointer-events-auto flex items-center gap-1 bg-white/95 backdrop-blur-md border border-slate-200 p-1 rounded-xl shadow-sm text-[11px]">
            <button
              onClick={() => setShowTrafficCorridors(!showTrafficCorridors)}
              className={`px-2 py-0.5 rounded-lg font-medium transition-all flex items-center gap-1 cursor-pointer ${
                showTrafficCorridors ? 'bg-amber-500 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Toggle Live Highway Traffic Flow Corridors"
            >
              <Car className="w-3 h-3" />
              <span>Traffic</span>
            </button>
            <button
              onClick={() => setShowTrafficIncidents(!showTrafficIncidents)}
              className={`px-2 py-0.5 rounded-lg font-medium transition-all flex items-center gap-1 cursor-pointer ${
                showTrafficIncidents ? 'bg-rose-500 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Toggle Traffic Incidents & Construction"
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Incidents</span>
            </button>
            <button
              onClick={() => setShowHousePlots(!showHousePlots)}
              className={`px-2 py-0.5 rounded-lg font-medium transition-all flex items-center gap-1 cursor-pointer ${
                showHousePlots ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Toggle Residential House Plots"
            >
              <Home className="w-3 h-3" />
              <span>Houses</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Zoom & Controls Bottom-Right */}
      <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-1.5 pointer-events-auto">
        <button
          onClick={() => {
            if (leafletMapRef.current) leafletMapRef.current.zoomIn();
          }}
          className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 shadow-md transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            if (leafletMapRef.current) leafletMapRef.current.zoomOut();
          }}
          className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 shadow-md transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            if (leafletMapRef.current) {
              leafletMapRef.current.fitBounds(AP_BOUNDS, { padding: [20, 20] });
              setSelectedDistrictId('state_ap');
            }
          }}
          className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 shadow-md transition-colors cursor-pointer"
          title="View Entire Andhra Pradesh"
        >
          <Compass className="w-4 h-4" />
        </button>
        <button
          onClick={zoomToHousesAndStreets}
          className="p-2.5 rounded-xl bg-[#1366d9] text-white hover:bg-blue-700 shadow-md transition-colors cursor-pointer"
          title="Zoom straight to house & street level (18.2x)"
        >
          <Home className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Map Display */}
      <div className="flex-1 w-full h-full relative">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* Live Traffic Corridor Telemetry Detail Card (Bottom-Left) */}
      {selectedCorridor && (
        <div className="absolute bottom-4 left-4 z-30 bg-white/95 border border-slate-200 rounded-2xl p-4 w-96 max-w-[calc(100vw-2rem)] text-xs shadow-xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span className={`p-1.5 rounded-lg text-white ${
                selectedCorridor.status === 'congested' ? 'bg-rose-500' : selectedCorridor.status === 'moderate' ? 'bg-amber-500' : 'bg-emerald-500'
              }`}>
                <Car className="w-3.5 h-3.5" />
              </span>
              <div>
                <span className="font-bold text-slate-900 text-xs block">
                  {selectedCorridor.name}
                </span>
                <span className="text-[10px] text-slate-500">
                  {selectedCorridor.district} • {selectedCorridor.lengthKm} km segment
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedCorridor(null)}
              className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-2.5 text-center">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Flow Speed</span>
              <span className="text-sm font-bold text-slate-900">{selectedCorridor.currentSpeedKmh} km/h</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Current Delay</span>
              <span className={`text-sm font-bold ${selectedCorridor.delayMinutes > 5 ? 'text-rose-600' : 'text-emerald-600'}`}>
                +{selectedCorridor.delayMinutes} mins
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Volume</span>
              <span className="text-sm font-bold text-slate-900">{selectedCorridor.vehiclesPerHour} v/h</span>
            </div>
          </div>

          {selectedCorridor.alert && (
            <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] mb-2 flex items-start gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
              <span>{selectedCorridor.alert}</span>
            </div>
          )}

          {selectedCorridor.detour && (
            <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-[11px] mb-2 flex items-start gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span><b>Detour Recommendation:</b> {selectedCorridor.detour}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
            <span className="text-slate-500">Normal Flow: {selectedCorridor.normalSpeedKmh} km/h</span>
            <button
              onClick={() => {
                if (leafletMapRef.current) {
                  leafletMapRef.current.flyTo(selectedCorridor.coordinates[0], 16, { duration: 1.0 });
                }
              }}
              className="text-[#1366d9] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Eye className="w-3 h-3" /> Focus Corridor
            </button>
          </div>
        </div>
      )}

      {/* Selected Traffic Incident Detail Card (Bottom-Left) */}
      {selectedIncident && !selectedCorridor && (
        <div className="absolute bottom-4 left-4 z-30 bg-white/95 border border-slate-200 rounded-2xl p-4 w-92 max-w-[calc(100vw-2rem)] text-xs shadow-xl backdrop-blur-xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="p-1.5 rounded-lg bg-rose-500 text-white">
                <AlertTriangle className="w-3.5 h-3.5" />
              </span>
              <div>
                <span className="font-bold text-slate-900 text-xs block">{selectedIncident.title}</span>
                <span className="text-[10px] text-slate-500">{selectedIncident.reportedAgo}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedIncident(null)}
              className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-2.5">
            <p className="text-[11px] font-medium text-slate-800">{selectedIncident.location}</p>
            <div className="mt-1 flex items-center gap-2 text-rose-600 font-bold text-[11px]">
              <span>Delay: +{selectedIncident.delayMin} mins</span>
              <span>• Severity: {selectedIncident.severity.toUpperCase()}</span>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] mb-2 flex items-start gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span><b>Advisory:</b> {selectedIncident.recommendation}</span>
          </div>

          <div className="flex items-center justify-end pt-1">
            <button
              onClick={() => {
                if (leafletMapRef.current) {
                  leafletMapRef.current.flyTo(selectedIncident.coordinates, 17, { duration: 1.0 });
                }
              }}
              className="text-[#1366d9] hover:underline font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <Eye className="w-3 h-3" /> Zoom to Incident (17x)
            </button>
          </div>
        </div>
      )}

      {/* House & Plot Inspector Popover / Card (Bottom-Left) */}
      {selectedHouseDetail && !selectedCorridor && !selectedIncident && (
        <div className="absolute bottom-4 left-4 z-30 bg-white/95 border border-slate-200 rounded-2xl p-4 w-92 max-w-[calc(100vw-2rem)] text-xs shadow-xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="p-1 rounded-md bg-emerald-100 text-emerald-700">
                <Home className="w-3.5 h-3.5" />
              </span>
              <div>
                <span className="font-bold text-slate-900 text-xs block">
                  House & Street Telemetry
                </span>
                <span className="text-[10px] text-slate-500">
                  {selectedHouseDetail.district}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedHouseDetail(null)}
              className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-2.5">
            <p className="font-semibold text-slate-900 text-xs">
              {selectedHouseDetail.address}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {selectedHouseDetail.colony}
            </p>
            <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400 font-mono">
              <span>GPS: {selectedHouseDetail.lat.toFixed(5)}, {selectedHouseDetail.lng.toFixed(5)}</span>
            </div>
          </div>

          <div className="space-y-1 mb-2.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Smart City Utilities
            </span>
            {selectedHouseDetail.smartFeatures.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                if (leafletMapRef.current) {
                  leafletMapRef.current.flyTo(
                    [selectedHouseDetail.lat, selectedHouseDetail.lng],
                    18.5,
                    { duration: 1.0 }
                  );
                }
              }}
              className="text-[#1366d9] hover:underline font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <Eye className="w-3 h-3" /> Focus House Roof (18.5x)
            </button>
            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
              ● All Services Normal
            </span>
          </div>
        </div>
      )}

      {/* Selected IoT Node Details Floating HUD Panel */}
      {selectedMapNode && !selectedHouseDetail && !selectedCorridor && !selectedIncident && (
        <div className="absolute bottom-4 left-4 z-30 bg-white/95 border border-slate-200 rounded-2xl p-4 w-88 max-w-[calc(100vw-2rem)] text-xs shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1366d9] text-sm">
                {selectedMapNode.id}
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase font-semibold">
                {selectedMapNode.type}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[9px] px-2 py-0.5 rounded-full uppercase font-bold border bg-blue-100 text-blue-700 border-blue-300">
                {selectedMapNode.status}
              </span>
              <button
                onClick={() => setSelectedMapNode(null)}
                className="text-slate-400 hover:text-slate-800 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <h4 className="text-slate-900 font-semibold text-xs mb-2">
            {selectedMapNode.name}
          </h4>

          <div className="space-y-1.5 bg-slate-50 border border-slate-100 p-2.5 rounded-xl mb-3 text-slate-700">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Live Reading:</span>
              <span className="text-[#1366d9] font-bold text-xs">{selectedMapNode.value}</span>
            </div>

            {Object.entries(selectedMapNode.telemetry).map(([k, v]) => (
              <div key={k} className="flex justify-between items-center text-[11px]">
                <span className="text-slate-500 capitalize">
                  {k.replace(/([A-Z])/g, ' $1')}:
                </span>
                <span className="text-slate-800 font-medium">{String(v)}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span>GPS: {selectedMapNode.lat.toFixed(4)}, {selectedMapNode.lng.toFixed(4)}</span>
            <button
              onClick={() => {
                if (leafletMapRef.current) {
                  leafletMapRef.current.flyTo([selectedMapNode.lat, selectedMapNode.lng], 18, { duration: 1.0 });
                }
              }}
              className="text-[#1366d9] hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
            >
              <Eye className="w-3 h-3" /> Focus (Zoom 18x)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
