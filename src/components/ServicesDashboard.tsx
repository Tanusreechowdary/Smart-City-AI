import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Phone,
  PhoneCall,
  Navigation,
  Clock,
  Shield,
  HeartPulse,
  Flame,
  Bus,
  Train,
  Landmark,
  UtensilsCrossed,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  Share2,
  X,
  Crosshair,
  Compass,
  Layers,
} from 'lucide-react';
import {
  PlaceItem,
  LocationPreset,
  POPULAR_LOCATIONS,
  NEARBY_SERVICES_DATA,
  calculateDistanceKm,
  estimateTravelTime,
} from '../services/nearbyPlacesData';

export interface EnrichedPlaceItem extends PlaceItem {
  distanceKm: number;
  driveMin: number;
  walkMin: number;
}

type ServiceCategoryFilter =
  | 'all'
  | 'hospital'
  | 'police'
  | 'fire'
  | 'bus_station'
  | 'railway_station'
  | 'tourist_place'
  | 'restaurant';

export const ServicesDashboard: React.FC = () => {
  // Current user search location
  const [typedLocation, setTypedLocation] = useState<string>('Benz Circle, Vijayawada');
  const [activePreset, setActivePreset] = useState<LocationPreset>(POPULAR_LOCATIONS[0]);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>({
    lat: POPULAR_LOCATIONS[0].lat,
    lng: POPULAR_LOCATIONS[0].lng,
  });
  const [locationNameDisplay, setLocationNameDisplay] = useState<string>(POPULAR_LOCATIONS[0].name);

  // Filters & State
  const [activeCategory, setActiveCategory] = useState<ServiceCategoryFilter>('all');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(35);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedPlace, setSelectedPlace] = useState<EnrichedPlaceItem | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [copiedPlaceId, setCopiedPlaceId] = useState<string | null>(null);

  // Calculate distance & sort by nearest first
  const enrichedPlaces = useMemo(() => {
    return NEARBY_SERVICES_DATA.map((p) => {
      const distanceKm = calculateDistanceKm(userCoords.lat, userCoords.lng, p.lat, p.lng);
      const times = estimateTravelTime(distanceKm);
      return {
        ...p,
        distanceKm,
        driveMin: times.driveMin,
        walkMin: times.walkMin,
      };
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [userCoords]);

  // Filtered places based on category and distance
  const filteredPlaces = useMemo(() => {
    return enrichedPlaces.filter((p) => {
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      const matchesDistance = p.distanceKm <= maxDistanceKm;
      const matchesQuery =
        !searchFilter.trim() ||
        p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        p.address.toLowerCase().includes(searchFilter.toLowerCase()) ||
        p.zone.toLowerCase().includes(searchFilter.toLowerCase()) ||
        (p.cuisineOrSpecialty && p.cuisineOrSpecialty.toLowerCase().includes(searchFilter.toLowerCase()));
      return matchesCategory && matchesDistance && matchesQuery;
    });
  }, [enrichedPlaces, activeCategory, maxDistanceKm, searchFilter]);

  // Quick emergency highlights
  const nearestHospital = useMemo(
    () => enrichedPlaces.find((p) => p.category === 'hospital'),
    [enrichedPlaces]
  );
  const nearestPolice = useMemo(
    () => enrichedPlaces.find((p) => p.category === 'police'),
    [enrichedPlaces]
  );
  const nearestFire = useMemo(
    () => enrichedPlaces.find((p) => p.category === 'fire'),
    [enrichedPlaces]
  );

  // Handle location search form submit
  const handleLocationSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedLocation.trim()) return;

    const query = typedLocation.toLowerCase().trim();

    // Check if matched preset
    const matchedPreset = POPULAR_LOCATIONS.find(
      (loc) =>
        loc.name.toLowerCase().includes(query) ||
        loc.district.toLowerCase().includes(query) ||
        query.includes(loc.id)
    );

    if (matchedPreset) {
      applyLocation(matchedPreset.lat, matchedPreset.lng, matchedPreset.name);
      return;
    }

    // Keyword heuristics for Andhra Pradesh cities and Vijayawada neighborhoods
    if (query.includes('benz') || query.includes('mg road')) {
      applyLocation(16.4971, 80.6557, 'Benz Circle, Vijayawada');
    } else if (query.includes('durga') || query.includes('one town') || query.includes('temple')) {
      applyLocation(16.5164, 80.6125, 'One Town Durga Temple, Vijayawada');
    } else if (query.includes('pnbs') || query.includes('bus stand') || query.includes('bus complex')) {
      applyLocation(16.5090, 80.6230, 'Pandit Nehru Bus Station (PNBS), Vijayawada');
    } else if (query.includes('railway') || query.includes('bza') || query.includes('station')) {
      applyLocation(16.5175, 80.6200, 'Vijayawada Junction Railway Station');
    } else if (query.includes('governorpet') || query.includes('besant')) {
      applyLocation(16.5120, 80.6280, 'Governorpet & Besant Road, Vijayawada');
    } else if (query.includes('auto nagar') || query.includes('industrial')) {
      applyLocation(16.4886, 80.6780, 'Auto Nagar Industrial Area, Vijayawada');
    } else if (query.includes('bhavanipuram') || query.includes('gollapudi')) {
      applyLocation(16.5280, 80.5900, 'Bhavanipuram & Gollapudi, Vijayawada');
    } else if (query.includes('gunadala') || query.includes('ramavarappadu')) {
      applyLocation(16.5250, 80.6790, 'Gunadala & Ramavarappadu NH-16');
    } else if (query.includes('amaravati') || query.includes('secretariat') || query.includes('velagapudi')) {
      applyLocation(16.5131, 80.5158, 'Velagapudi Secretariat, Amaravati');
    } else if (query.includes('guntur') || query.includes('brodipet')) {
      applyLocation(16.3082, 80.4398, 'Brodipet & Central Guntur');
    } else if (query.includes('vizag') || query.includes('visakhapatnam') || query.includes('beach')) {
      applyLocation(17.7150, 83.3240, 'Beach Road, Visakhapatnam');
    } else if (query.includes('tirupati') || query.includes('alipiri') || query.includes('tirumala')) {
      applyLocation(13.6510, 79.4010, 'Alipiri Gateway, Tirupati');
    } else if (query.includes('kakinada')) {
      applyLocation(16.9891, 82.2475, 'Town & Port, Kakinada');
    } else {
      // Default nearby Vijayawada center with custom label
      applyLocation(16.5062, 80.6480, typedLocation);
    }
  };

  const applyLocation = (lat: number, lng: number, label: string) => {
    setUserCoords({ lat, lng });
    setLocationNameDisplay(label);
    setTypedLocation(label);
    setGpsError(null);
  };

  // Browser Geolocation API ("Use My Location")
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        applyLocation(latitude, longitude, 'Current GPS Location');
      },
      (err) => {
        setIsLocating(false);
        setGpsError('Unable to retrieve GPS position. Defaulting to Benz Circle, Vijayawada.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Copy place info / share
  const handleSharePlace = (place: PlaceItem) => {
    const text = `${place.name}\n${place.address}\nPhone: ${place.phone}\nGoogle Maps: https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;
    navigator.clipboard?.writeText(text);
    setCopiedPlaceId(place.id);
    setTimeout(() => setCopiedPlaceId(null), 2500);
  };

  // Select place from list
  const handleSelectPlace = (place: EnrichedPlaceItem) => {
    setSelectedPlace((prev) => (prev?.id === place.id ? null : place));
  };

  // Helper category badge info
  const getCategoryMeta = (cat: PlaceItem['category']) => {
    switch (cat) {
      case 'hospital':
        return { label: 'Hospital', icon: HeartPulse, color: 'text-rose-600 bg-rose-50 border-rose-200' };
      case 'police':
        return { label: 'Police', icon: Shield, color: 'text-blue-600 bg-blue-50 border-blue-200' };
      case 'fire':
        return { label: 'Fire & Rescue', icon: Flame, color: 'text-orange-600 bg-orange-50 border-orange-200' };
      case 'bus_station':
        return { label: 'Bus Stand', icon: Bus, color: 'text-purple-600 bg-purple-50 border-purple-200' };
      case 'railway_station':
        return { label: 'Railway Station', icon: Train, color: 'text-cyan-700 bg-cyan-50 border-cyan-200' };
      case 'tourist_place':
        return { label: 'Tourist Place', icon: Landmark, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      case 'restaurant':
        return { label: 'Restaurant', icon: UtensilsCrossed, color: 'text-amber-700 bg-amber-50 border-amber-200' };
      default:
        return { label: 'Service', icon: MapPin, color: 'text-slate-700 bg-slate-50 border-slate-200' };
    }
  };

  return (
    <div className="space-y-5">
      {/* 1. Emergency Assistance SOS Quick Dial Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 rounded-2xl p-4 sm:p-5 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          <HeartPulse className="w-48 h-48" />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
                <HeartPulse className="w-5 h-5 text-white animate-pulse" />
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-bold tracking-tight">
                  Emergency Assistance & 24/7 Helpline Services
                </h2>
                <p className="text-xs text-white/90">
                  Direct connection to Andhra Pradesh emergency dispatch, hospital trauma care, police, and fire rescue.
                </p>
              </div>
            </div>

            <span className="text-[10px] bg-white/20 backdrop-blur-md px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-white/30">
              ● Live 24/7 Dispatch
            </span>
          </div>

          {/* Quick Call SOS Action Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
            <a
              href="tel:108"
              className="flex items-center justify-between p-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 transition-all text-left group"
            >
              <div>
                <span className="text-[10px] uppercase font-semibold text-white/80 block">Medical Emergency</span>
                <span className="text-base font-extrabold tracking-wide">108 Ambulance</span>
              </div>
              <PhoneCall className="w-4 h-4 text-white group-hover:scale-110 transition-transform shrink-0" />
            </a>

            <a
              href="tel:100"
              className="flex items-center justify-between p-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 transition-all text-left group"
            >
              <div>
                <span className="text-[10px] uppercase font-semibold text-white/80 block">Police Dispatch</span>
                <span className="text-base font-extrabold tracking-wide">100 / 112 SOS</span>
              </div>
              <Shield className="w-4 h-4 text-white group-hover:scale-110 transition-transform shrink-0" />
            </a>

            <a
              href="tel:101"
              className="flex items-center justify-between p-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 transition-all text-left group"
            >
              <div>
                <span className="text-[10px] uppercase font-semibold text-white/80 block">Fire & Rescue</span>
                <span className="text-base font-extrabold tracking-wide">101 Fire Office</span>
              </div>
              <Flame className="w-4 h-4 text-white group-hover:scale-110 transition-transform shrink-0" />
            </a>

            <a
              href="tel:1091"
              className="flex items-center justify-between p-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 transition-all text-left group"
            >
              <div>
                <span className="text-[10px] uppercase font-semibold text-white/80 block">Women Safety</span>
                <span className="text-base font-extrabold tracking-wide">1091 Disha SOS</span>
              </div>
              <PhoneCall className="w-4 h-4 text-white group-hover:scale-110 transition-transform shrink-0" />
            </a>

            <a
              href="tel:104"
              className="flex items-center justify-between p-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 transition-all text-left group col-span-2 sm:col-span-1"
            >
              <div>
                <span className="text-[10px] uppercase font-semibold text-white/80 block">Health & Blood Bank</span>
                <span className="text-base font-extrabold tracking-wide">104 Helpline</span>
              </div>
              <HeartPulse className="w-4 h-4 text-white group-hover:scale-110 transition-transform shrink-0" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. Location Input & Distance Search Engine */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#1366d9]" />
              <span>Enter Your Location to Find Nearest Emergency & Civic Services</span>
            </h3>
            <p className="text-xs text-slate-500">
              Type your address, colony, landmark, or select a preset to instantly calculate distance to hospitals, police, transit & dining.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-[#1366d9] hover:bg-blue-100 font-semibold text-xs border border-blue-200 transition-colors cursor-pointer"
            >
              <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating...' : 'Use My GPS Location'}</span>
            </button>
          </div>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleLocationSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={typedLocation}
              onChange={(e) => setTypedLocation(e.target.value)}
              placeholder="Type your location (e.g. Benz Circle, PNBS, Besant Road, Bhavanipuram, Vizag Beach Road, Tirupati, Amaravati)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#1366d9] focus:bg-white transition-all shadow-inner"
            />
            {typedLocation && (
              <button
                type="button"
                onClick={() => setTypedLocation('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#1366d9] hover:bg-[#0f52b0] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Search Nearby Services</span>
          </button>
        </form>

        {gpsError && (
          <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{gpsError}</span>
          </div>
        )}

        {/* Location Presets Quick Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Quick Locality:
          </span>
          {POPULAR_LOCATIONS.map((loc) => {
            const isSelected = activePreset.id === loc.id;
            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => {
                  setActivePreset(loc);
                  applyLocation(loc.lat, loc.lng, loc.name);
                }}
                className={`px-2.5 py-1 rounded-lg shrink-0 font-medium transition-all text-[11px] cursor-pointer flex items-center gap-1 ${
                  isSelected
                    ? 'bg-slate-900 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>📍</span>
                <span>{loc.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Nearest Emergency Highlights Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {nearestHospital && (
          <div
            onClick={() => handleSelectPlace(nearestHospital)}
            className="bg-white rounded-2xl p-3.5 border border-rose-200 hover:border-rose-400 transition-all shadow-xs cursor-pointer flex items-start gap-3 bg-gradient-to-br from-white to-rose-50/40"
          >
            <span className="p-2.5 rounded-xl bg-rose-100 text-rose-600 shrink-0">
              <HeartPulse className="w-5 h-5" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                  Nearest Hospital
                </span>
                <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                  {nearestHospital.distanceKm} km ({nearestHospital.driveMin} min)
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs truncate mt-0.5">{nearestHospital.name}</h4>
              <p className="text-[11px] text-slate-500 truncate">{nearestHospital.address}</p>
              <div className="mt-2 flex items-center justify-between">
                <a
                  href={`tel:${nearestHospital.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:underline"
                >
                  <Phone className="w-3 h-3" /> Call: {nearestHospital.phone}
                </a>
                <span className="text-[10px] text-slate-400">Tap to focus</span>
              </div>
            </div>
          </div>
        )}

        {nearestPolice && (
          <div
            onClick={() => handleSelectPlace(nearestPolice)}
            className="bg-white rounded-2xl p-3.5 border border-blue-200 hover:border-blue-400 transition-all shadow-xs cursor-pointer flex items-start gap-3 bg-gradient-to-br from-white to-blue-50/40"
          >
            <span className="p-2.5 rounded-xl bg-blue-100 text-blue-600 shrink-0">
              <Shield className="w-5 h-5" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  Nearest Police Station
                </span>
                <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                  {nearestPolice.distanceKm} km ({nearestPolice.driveMin} min)
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs truncate mt-0.5">{nearestPolice.name}</h4>
              <p className="text-[11px] text-slate-500 truncate">{nearestPolice.address}</p>
              <div className="mt-2 flex items-center justify-between">
                <a
                  href={`tel:${nearestPolice.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                >
                  <Phone className="w-3 h-3" /> Call: {nearestPolice.phone}
                </a>
                <span className="text-[10px] text-slate-400">Tap to focus</span>
              </div>
            </div>
          </div>
        )}

        {nearestFire && (
          <div
            onClick={() => handleSelectPlace(nearestFire)}
            className="bg-white rounded-2xl p-3.5 border border-orange-200 hover:border-orange-400 transition-all shadow-xs cursor-pointer flex items-start gap-3 bg-gradient-to-br from-white to-orange-50/40"
          >
            <span className="p-2.5 rounded-xl bg-orange-100 text-orange-600 shrink-0">
              <Flame className="w-5 h-5" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                  Nearest Fire Station
                </span>
                <span className="text-xs font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                  {nearestFire.distanceKm} km ({nearestFire.driveMin} min)
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs truncate mt-0.5">{nearestFire.name}</h4>
              <p className="text-[11px] text-slate-500 truncate">{nearestFire.address}</p>
              <div className="mt-2 flex items-center justify-between">
                <a
                  href={`tel:${nearestFire.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:underline"
                >
                  <Phone className="w-3 h-3" /> Call: {nearestFire.phone}
                </a>
                <span className="text-[10px] text-slate-400">Tap to focus</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Category Filter Buttons Bar */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {[
            { id: 'all', label: 'All Services', count: enrichedPlaces.length, icon: Layers },
            { id: 'hospital', label: 'Hospitals (24x7)', count: enrichedPlaces.filter((p) => p.category === 'hospital').length, icon: HeartPulse },
            { id: 'police', label: 'Police Stations', count: enrichedPlaces.filter((p) => p.category === 'police').length, icon: Shield },
            { id: 'fire', label: 'Fire Offices', count: enrichedPlaces.filter((p) => p.category === 'fire').length, icon: Flame },
            { id: 'bus_station', label: 'Bus Stands', count: enrichedPlaces.filter((p) => p.category === 'bus_station').length, icon: Bus },
            { id: 'railway_station', label: 'Railway Stations', count: enrichedPlaces.filter((p) => p.category === 'railway_station').length, icon: Train },
            { id: 'tourist_place', label: 'Tourist Places', count: enrichedPlaces.filter((p) => p.category === 'tourist_place').length, icon: Landmark },
            { id: 'restaurant', label: 'Restaurants', count: enrichedPlaces.filter((p) => p.category === 'restaurant').length, icon: UtensilsCrossed },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as ServiceCategoryFilter)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1366d9] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Result Count Badge */}
        <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
          <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl font-bold">
            {filteredPlaces.length} Services Found
          </span>
          <span className="text-[11px] bg-blue-50 text-[#1366d9] px-2.5 py-1.5 rounded-xl font-semibold">
            Within {maxDistanceKm} km of {locationNameDisplay}
          </span>
        </div>
      </div>

      {/* 5. Main Content Area (Full Width Responsive Services Grid) */}
      <div className="w-full">
        {filteredPlaces.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500 space-y-3 shadow-xs">
            <MapPin className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-base">No services found within {maxDistanceKm} km</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try increasing the search distance radius or selecting a different category from the filters above.
            </p>
            <button
              onClick={() => {
                setMaxDistanceKm(60);
                setActiveCategory('all');
                setSearchFilter('');
              }}
              className="px-4 py-2 rounded-xl bg-[#1366d9] text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
            >
              Expand Search Radius to 60 km
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredPlaces.map((place) => {
              const meta = getCategoryMeta(place.category);
              const isSelected = selectedPlace?.id === place.id;

              return (
                <div
                  key={place.id}
                  onClick={() => handleSelectPlace(place)}
                  className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between gap-3 group ${
                    isSelected
                      ? 'border-[#1366d9] ring-2 ring-blue-500/20 shadow-md bg-blue-50/15'
                      : 'border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Place Image + Category Badge */}
                    <div className="relative w-full h-40 rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                      <img
                        src={place.imageUrl}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border shadow-xs ${meta.color}`}>
                          {meta.label}
                        </span>
                      </div>
                      <div className="absolute top-2.5 right-2.5">
                        <span className="text-xs font-bold text-[#1366d9] bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-xs">
                          {place.distanceKm} km
                        </span>
                      </div>
                      {place.is24x7 && (
                        <div className="absolute bottom-2.5 left-2.5">
                          <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded shadow-xs">
                            24/7 OPEN
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Place Header & Address */}
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-[#1366d9] transition-colors">
                        {place.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{place.address}</p>

                      {place.cuisineOrSpecialty && (
                        <p className="text-xs text-slate-700 font-medium mt-1">
                          <span className="text-slate-400 font-normal">Details:</span> {place.cuisineOrSpecialty}
                        </p>
                      )}
                    </div>

                    {/* Travel Estimates & Badges */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
                      <span className="flex items-center gap-1 font-semibold bg-slate-100 px-2 py-0.5 rounded-md text-slate-800">
                        <Navigation className="w-3 h-3 text-[#1366d9]" />
                        <span>~{place.driveMin} min drive</span>
                      </span>
                      <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{place.timings}</span>
                      </span>
                      {place.rating && (
                        <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          ★ {place.rating} ({place.reviewsCount ?? 0})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action Buttons */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                    <a
                      href={`tel:${place.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call: {place.phone}</span>
                    </a>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
                      title="Open directions in Google Maps"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#1366d9]" />
                      <span>Directions</span>
                    </a>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSharePlace(place);
                      }}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                      title="Copy details"
                    >
                      {copiedPlaceId === place.id ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
