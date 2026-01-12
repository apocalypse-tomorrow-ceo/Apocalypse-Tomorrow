
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { REGIONS } from './constants';
import { ConflictEvent, Region, GroundingSource, EventType } from './types';
import { analyzeRegion } from './services/geminiService';
import MapComponent from './components/MapComponent';

const App: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<Region>(REGIONS[0]);
  const [events, setEvents] = useState<ConflictEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<ConflictEvent[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<ConflictEvent | null>(null);
  const [activeFilters, setActiveFilters] = useState<EventType[]>(Object.values(EventType));
  const [activeMediaTab, setActiveMediaTab] = useState<'mainstream' | 'independent'>('mainstream');
  const [showAssets, setShowAssets] = useState<boolean>(false);
  const [showControlLayer, setShowControlLayer] = useState<boolean>(true);

  const fetchData = useCallback(async (region: Region) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await analyzeRegion(region);
      setEvents(data.events);
      setSummary(data.summary);
      setSources(data.sources);
    } catch (err: any) {
      console.error("Error fetching regional data:", err);
      if (err?.message?.includes('429') || err?.status === 'RESOURCE_EXHAUSTED') {
        setError("API Rate limit exceeded. The system is retrying or cooling down. Please wait a moment.");
      } else {
        setError("Intelligence link failed. Check your network or API key permissions.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(selectedRegion);
  }, [selectedRegion, fetchData]);

  useEffect(() => {
    setFilteredEvents(events.filter(e => activeFilters.includes(e.type)));
  }, [events, activeFilters]);

  const toggleFilter = (type: EventType) => {
    setActiveFilters(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const mainstreamEvents = useMemo(() => 
    filteredEvents.filter(e => e.sourceCategory === 'mainstream'), [filteredEvents]
  );
  const independentEvents = useMemo(() => 
    filteredEvents.filter(e => e.sourceCategory === 'independent'), [filteredEvents]
  );

  const displayedEvents = activeMediaTab === 'mainstream' ? mainstreamEvents : independentEvents;

  const getAlignmentStyles = (alignment?: string) => {
    if (!alignment) return 'bg-slate-800 text-slate-400';
    const a = alignment.toLowerCase();
    if (a.includes('pro-sdf')) return 'bg-yellow-900/40 text-yellow-400';
    if (a.includes('assadist')) return 'bg-red-900/40 text-red-400';
    if (a.includes('pro-government')) return 'bg-green-900/40 text-green-400';
    if (a.includes('druze')) return 'bg-blue-900/40 text-blue-400';
    if (a.includes('pro-ukraine')) return 'bg-blue-900/40 text-blue-400';
    return 'bg-slate-800 text-slate-400';
  };

  const EventCard: React.FC<{ event: ConflictEvent }> = ({ event }) => (
    <div 
      onClick={() => setSelectedEvent(event)}
      className={`p-4 rounded-sm border transition-all cursor-pointer group ${
        selectedEvent?.id === event.id 
          ? 'border-red-500/50 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
          : 'border-white/5 bg-white/2 hover:bg-white/5'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0 ${
            event.type === EventType.CONFLICT ? 'bg-red-900/40 text-red-400' :
            event.type === EventType.PROTEST ? 'bg-amber-900/40 text-amber-400' :
            'bg-slate-800 text-slate-300'
          }`}>
            {event.type}
          </span>
          {event.sourceCategory === 'independent' && event.sourceAlignment && (
            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded truncate ${getAlignmentStyles(event.sourceAlignment)}`}>
              {event.sourceAlignment}
            </span>
          )}
        </div>
        <span className="text-[10px] font-mono text-slate-500 shrink-0">
          {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      <h3 className="text-sm font-bold text-slate-100 mb-1 group-hover:text-white transition-colors">
        {event.title}
      </h3>
      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
        {event.description}
      </p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] text-slate-500 font-mono italic truncate mr-2">@{event.locationName}</span>
        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
          event.severity === 'critical' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' :
          event.severity === 'high' ? 'bg-orange-500' :
          'bg-amber-500'
        }`}></div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-slate-200">
      {/* Header */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0a0a0a]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-4">
          <div className="bg-red-600 p-1.5 rounded-sm">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter uppercase leading-none">Apocalypse Tomorrow</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Global Conflict & Instability Monitor</p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto max-w-2xl px-4 no-scrollbar">
          {REGIONS.map(region => (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region)}
              disabled={isLoading}
              className={`px-3 py-1.5 rounded-sm text-xs font-semibold whitespace-nowrap transition-all ${
                selectedRegion.id === region.id 
                  ? 'bg-white text-black' 
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 disabled:opacity-50'
              }`}
            >
              {region.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
             <span className="text-[10px] text-slate-500 uppercase">System Status</span>
             <span className={`flex items-center gap-1.5 text-xs font-mono ${error ? 'text-red-500' : 'text-green-500'}`}>
               <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${error ? 'bg-red-500' : 'bg-green-500'}`}></span>
               {error ? 'Protocol Failure' : 'Operational'}
             </span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <main className="flex-1 relative">
          <MapComponent 
            events={filteredEvents} 
            center={[selectedRegion.lat, selectedRegion.lng]} 
            zoom={selectedRegion.zoom}
            onEventClick={setSelectedEvent}
            territories={selectedRegion.territories}
            showControlLayer={showControlLayer}
          />
          
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 max-h-[90vh] overflow-y-auto no-scrollbar">
            {/* Layers Toggle */}
            <div className="bg-black/80 backdrop-blur-md p-3 rounded-sm border border-white/10 w-64 shadow-2xl">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Display Layers</h2>
              <button
                onClick={() => setShowControlLayer(!showControlLayer)}
                className={`flex items-center justify-between w-full p-2 rounded-sm border transition-colors ${
                  showControlLayer ? 'border-white/20 bg-white/5 text-white' : 'border-transparent text-slate-500'
                }`}
              >
                <span className="text-[9px] font-bold uppercase">Territorial Control</span>
                <div className={`w-3 h-3 rounded-sm border ${showControlLayer ? 'bg-blue-500 border-blue-400' : 'border-slate-700'}`}></div>
              </button>
            </div>

            {/* Active Filters */}
            <div className="bg-black/80 backdrop-blur-md p-4 rounded-sm border border-white/10 w-64 shadow-2xl">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center justify-between">
                <span>Active Filters</span>
                {isLoading && <span className="animate-spin text-red-500 font-bold">◌</span>}
              </h2>
              <div className="flex flex-col gap-2">
                {Object.values(EventType).map(type => (
                  <button
                    key={type}
                    onClick={() => toggleFilter(type)}
                    className={`flex items-center justify-between p-2 rounded-sm border transition-colors ${
                      activeFilters.includes(type) 
                        ? 'border-white/20 bg-white/5' 
                        : 'border-transparent text-slate-600 grayscale'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider">{type.replace('_', ' ')}</span>
                    <div className={`w-3 h-3 rounded-full ${
                      type === EventType.CONFLICT ? 'bg-red-500' :
                      type === EventType.PROTEST ? 'bg-amber-500' :
                      type === EventType.RIOT ? 'bg-orange-500' :
                      type === EventType.STRIKE ? 'bg-blue-500' : 'bg-slate-400'
                    }`}></div>
                  </button>
                ))}
              </div>
            </div>

            {/* Region Intel Summary */}
            <div className="bg-black/80 backdrop-blur-md p-4 rounded-sm border border-white/10 w-80 shadow-2xl">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Regional Intel</h2>
              <p className="text-sm font-semibold mb-1">{selectedRegion.name}</p>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{selectedRegion.description}</p>
              
              <div className="border-t border-white/10 pt-4">
                 <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Gemini OSINT Analysis</h3>
                 {isLoading ? (
                   <div className="space-y-2 animate-pulse">
                     <div className="h-2 bg-white/5 rounded w-full"></div>
                     <div className="h-2 bg-white/5 rounded w-5/6"></div>
                     <div className="h-2 bg-white/5 rounded w-4/6"></div>
                   </div>
                 ) : error ? (
                   <div className="p-3 bg-red-900/20 border border-red-500/20 rounded-sm">
                     <p className="text-[10px] text-red-400 uppercase font-bold mb-1">Link Broken</p>
                     <p className="text-[10px] text-red-300/70 leading-tight mb-2">{error}</p>
                     <button 
                        onClick={() => fetchData(selectedRegion)}
                        className="text-[9px] font-bold uppercase tracking-widest underline hover:text-white"
                      >
                        Re-establish Link
                      </button>
                   </div>
                 ) : (
                   <div className="text-[11px] leading-relaxed text-slate-300">
                     {summary || "Syncing with prioritized ground assets..."}
                   </div>
                 )}
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-4">
             <div className="bg-black/90 px-4 py-2 rounded-full border border-white/10 flex items-center gap-6 shadow-2xl backdrop-blur-sm">
                <div className="flex flex-col items-center">
                  <span className="text-[8px] text-slate-500 uppercase font-bold">Signals</span>
                  <span className="text-sm font-mono font-bold text-red-500">{filteredEvents.length} Active</span>
                </div>
                <div className="w-px h-6 bg-white/10"></div>
                <div className="flex flex-col items-center">
                  <span className="text-[8px] text-slate-500 uppercase font-bold">Threat Level</span>
                  <span className="text-sm font-mono font-bold text-amber-500">
                    {filteredEvents.some(e => e.severity === 'critical') ? 'CRITICAL' : 'ELEVATED'}
                  </span>
                </div>
                <div className="w-px h-6 bg-white/10"></div>
                <button 
                  onClick={() => fetchData(selectedRegion)}
                  disabled={isLoading}
                  className={`p-1 hover:text-red-500 transition-colors ${isLoading ? 'opacity-30 cursor-not-allowed' : ''}`}
                >
                  <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
             </div>
          </div>
        </main>

        <aside className="w-96 bg-[#0a0a0a] border-l border-white/10 flex flex-col z-20">
          <div className="p-6 border-b border-white/10 bg-[#0c0c0c]">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-100 flex items-center justify-between">
              Live Intel Feed
              <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-500 text-[10px] animate-pulse uppercase tracking-wider">Intercepting</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 bg-[#0c0c0c] border-b border-white/5">
            <button 
              onClick={() => setActiveMediaTab('mainstream')}
              className={`py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative ${
                activeMediaTab === 'mainstream' ? 'text-blue-400 bg-white/5' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Mainstream
              {activeMediaTab === 'mainstream' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></div>}
            </button>
            <button 
              onClick={() => setActiveMediaTab('independent')}
              className={`py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative ${
                activeMediaTab === 'independent' ? 'text-purple-400 bg-white/5' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Independent
              {activeMediaTab === 'independent' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500"></div>}
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {isLoading && (
              <div className="p-4 space-y-4">
                 {Array.from({length: 4}).map((_, i) => (
                  <div key={i} className="p-4 bg-white/5 rounded-sm animate-pulse space-y-2">
                    <div className="h-3 bg-white/10 rounded w-1/2"></div>
                    <div className="h-2 bg-white/10 rounded w-full"></div>
                    <div className="h-2 bg-white/10 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            )}
            
            {!isLoading && displayedEvents.length === 0 && (
              <div className="text-center py-20 px-6">
                <p className="text-slate-500 italic text-sm font-mono tracking-tight">SILENCE IN SECTOR</p>
                <p className="text-[10px] text-slate-600 uppercase mt-2">{error ? 'SYSTEM OFFLINE' : 'No incoming signals matched the current protocol.'}</p>
              </div>
            )}

            {!isLoading && displayedEvents.length > 0 && (
              <div className="p-4 space-y-4">
                {displayedEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>

          {/* Verification Logs & Tracked Assets Footer Area */}
          <div className="border-t border-white/10 bg-black/40 flex flex-col min-h-0">
            <div className="flex bg-black/60 border-b border-white/5">
              <button 
                onClick={() => setShowAssets(false)}
                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${!showAssets ? 'text-red-400 bg-white/5' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Verification Logs
              </button>
              <button 
                onClick={() => setShowAssets(true)}
                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${showAssets ? 'text-purple-400 bg-white/5' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Tracked Assets
              </button>
            </div>

            <div className="p-4 max-h-60 overflow-y-auto custom-scrollbar">
              {!showAssets ? (
                <div className="flex flex-col gap-2">
                  <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-1">Signal Grounding</h3>
                  {sources.length === 0 ? (
                    <p className="text-[10px] text-slate-600 italic">No grounding logs for current window.</p>
                  ) : (
                    sources.slice(0, 5).map((source, i) => (
                      <a 
                        key={i} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] text-slate-400 hover:text-red-400 transition-colors flex items-center gap-2 truncate"
                      >
                        <svg className="w-3 h-3 shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        {source.title}
                      </a>
                    ))
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-1">Active OSINT Nodes</h3>
                  <div className="grid grid-cols-1 gap-1.5">
                    {selectedRegion.monitoredSources?.map(source => (
                      <div key={source.url} className="flex flex-col p-2 bg-white/2 border border-white/5 rounded-sm hover:border-purple-500/30 transition-colors group">
                        <div className="flex items-center justify-between gap-2">
                          <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-slate-300 group-hover:text-purple-400 transition-colors truncate">
                            {source.name}
                          </a>
                          <span className={`text-[8px] px-1.5 py-0.5 rounded-full uppercase font-mono tracking-tighter shrink-0 ${getAlignmentStyles(source.alignment)}`}>
                            {source.alignment}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 w-full max-w-lg rounded-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-white/10 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm ${
                    selectedEvent.sourceCategory === 'mainstream' ? 'bg-blue-900/40 text-blue-300' : 'bg-purple-900/40 text-purple-300'
                  }`}>
                    {selectedEvent.sourceCategory} • {selectedEvent.type}
                  </span>
                  {selectedEvent.sourceCategory === 'independent' && selectedEvent.sourceAlignment && (
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm ${getAlignmentStyles(selectedEvent.sourceAlignment)}`}>
                      {selectedEvent.sourceAlignment}
                    </span>
                  )}
                  <span className="text-xs text-slate-500 font-mono">ID: {selectedEvent.id.slice(0, 8)}</span>
                </div>
                <h2 className="text-xl font-bold text-white leading-tight">{selectedEvent.title}</h2>
                <p className="text-sm text-red-500 font-mono mt-1 uppercase tracking-wider">{selectedEvent.locationName}</p>
              </div>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-black/40 p-4 rounded-sm border border-white/5">
                <p className="text-sm leading-relaxed text-slate-300">{selectedEvent.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Impact Magnitude</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                       <div 
                         className={`h-full ${
                           selectedEvent.severity === 'critical' ? 'bg-red-600' :
                           selectedEvent.severity === 'high' ? 'bg-orange-500' : 'bg-amber-500'
                         }`}
                         style={{ width: selectedEvent.severity === 'critical' ? '100%' : selectedEvent.severity === 'high' ? '70%' : '40%' }}
                       ></div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">{selectedEvent.severity}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Signal Timestamp</span>
                  <p className="text-xs font-mono text-slate-300">
                    {new Date(selectedEvent.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                {selectedEvent.sourceUrl ? (
                  <a 
                    href={selectedEvent.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-white text-black py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Direct Field Signal
                  </a>
                ) : (
                  <div className="flex-1 text-center text-[10px] text-slate-500 italic py-2">
                    Signal metadata missing; source verification required.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
