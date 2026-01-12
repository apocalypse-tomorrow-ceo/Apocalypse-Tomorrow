
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon } from 'react-leaflet';
import L from 'leaflet';
import { ConflictEvent, EventType, Territory } from '../types';
import { SEVERITY_COLORS } from '../constants';

// Fix for default marker icons in Leaflet + React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const getIconSvg = (type: EventType) => {
  switch (type) {
    case EventType.CONFLICT:
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="22" y1="12" x2="18" y2="12"></line><line x1="6" y1="12" x2="2" y2="12"></line><line x1="12" y1="6" x2="12" y2="2"></line><line x1="12" y1="22" x2="12" y2="18"></line></svg>`;
    case EventType.PROTEST:
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`;
    case EventType.RIOT:
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>`;
    case EventType.MILITARY_MOVE:
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 17l5-5-5-5M6 17l5-5-5-5"></path></svg>`;
    case EventType.STRIKE:
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>`;
    default:
      return `<circle cx="12" cy="12" r="8" fill="currentColor"></circle>`;
  }
};

const createCustomIcon = (type: EventType, severity: string) => {
  const color = SEVERITY_COLORS[severity as keyof typeof SEVERITY_COLORS] || '#666';
  const iconContent = getIconSvg(type);
  
  return L.divIcon({
    html: `
      <div class="relative flex items-center justify-center group">
        <div class="absolute w-10 h-10 rounded-full opacity-20 transition-all duration-500 group-hover:scale-125" style="background-color: ${color}; filter: blur(4px);"></div>
        <div class="absolute w-8 h-8 rounded-full opacity-10 animate-ping" style="background-color: ${color}"></div>
        <div class="w-7 h-7 rounded-full border-2 border-white/40 shadow-xl flex items-center justify-center transition-transform hover:scale-110" style="background-color: ${color}; color: white; padding: 5px;">
          ${iconContent}
        </div>
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

const MapResizer = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
};

interface MapComponentProps {
  events: ConflictEvent[];
  center: [number, number];
  zoom: number;
  onEventClick: (event: ConflictEvent) => void;
  territories?: Territory[];
  showControlLayer?: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  events, 
  center, 
  zoom, 
  onEventClick, 
  territories = [], 
  showControlLayer = true 
}) => {
  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%', backgroundColor: '#0a0a0a' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapResizer center={center} zoom={zoom} />
        
        {showControlLayer && territories.map((territory) => (
          <Polygon
            key={territory.id}
            positions={territory.coordinates}
            pathOptions={{
              fillColor: territory.color,
              fillOpacity: 0.15,
              color: territory.color,
              weight: 1.5,
              dashArray: '5, 10',
            }}
          >
            <Popup>
              <div className="p-1 font-bold text-[10px] uppercase tracking-widest">{territory.name}</div>
            </Popup>
          </Polygon>
        ))}

        {events.map((event) => (
          <Marker 
            key={event.id} 
            position={[event.lat, event.lng]} 
            icon={createCustomIcon(event.type, event.severity)}
            eventHandlers={{
              click: () => onEventClick(event),
            }}
          >
            <Popup className="custom-popup">
              <div className="p-3 bg-[#111] text-slate-100 rounded border border-white/10 min-w-[200px]">
                <div className="flex justify-between items-start mb-2">
                   <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-white/10 text-white">
                    {event.type.replace('_', ' ')}
                  </span>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: SEVERITY_COLORS[event.severity as keyof typeof SEVERITY_COLORS] }}></div>
                </div>
                <h3 className="font-bold text-sm mb-1 text-white">{event.title}</h3>
                <p className="text-[11px] text-slate-400 mb-2">{event.locationName}</p>
                <button 
                  onClick={() => onEventClick(event)}
                  className="w-full mt-2 py-1.5 bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest border border-white/10 transition-colors"
                >
                  View Intelligence
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend */}
      {showControlLayer && territories.length > 0 && (
        <div className="absolute bottom-24 right-4 z-[400] bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-sm shadow-2xl pointer-events-auto">
          <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2 border-b border-white/5 pb-1">Territorial Control</h4>
          <div className="flex flex-col gap-1.5">
            {territories.map(t => (
              <div key={t.id} className="flex items-center gap-2">
                <div className="w-3 h-3 border border-white/20" style={{ backgroundColor: t.color, opacity: 0.6 }}></div>
                <span className="text-[10px] text-slate-300 font-mono tracking-tighter uppercase">{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
