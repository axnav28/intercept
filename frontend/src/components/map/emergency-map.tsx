import { useEffect, useMemo, useRef, useState } from "react";

import type { EmergencyService } from "../../data/nh48-services";
import { districtCenter } from "../../data/nh48-services";
import { ServiceCardList } from "./service-card-list";

type EmergencyMapProps = {
  services: EmergencyService[];
  highlightedIds?: string[];
  focus?: { latitude: number; longitude: number; label: string } | null;
};

const serviceColors: Record<EmergencyService["type"], string> = {
  hospital: "#0284c7",
  trauma: "#dc2626",
  ambulance: "#16a34a",
  police: "#7c3aed",
  rescue: "#f97316"
};

export function EmergencyMap({
  services,
  highlightedIds = [],
  focus = districtCenter
}: EmergencyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const serviceLayerRef = useRef<any>(null);
  const focusLayerRef = useRef<any>(null);
  const [leaflet, setLeaflet] = useState<any>(null);
  const highlightedSet = useMemo(() => new Set(highlightedIds), [highlightedIds]);

  useEffect(() => {
    let mounted = true;

    Promise.all([import("leaflet"), import("leaflet/dist/leaflet.css")]).then(([module]) => {
      if (!mounted) {
        return;
      }
      setLeaflet(module);
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!leaflet || !mapContainerRef.current || mapRef.current) {
      return;
    }

    const map = leaflet.map(mapContainerRef.current, {
      zoomControl: false,
      scrollWheelZoom: true
    });
    mapRef.current = map;
    map.setView([districtCenter.latitude, districtCenter.longitude], 9.4);
    leaflet.control.zoom({ position: "topright" }).addTo(map);
    tileLayerRef.current = leaflet
      .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19
      })
      .addTo(map);

    serviceLayerRef.current = leaflet.layerGroup().addTo(map);
    focusLayerRef.current = leaflet.layerGroup().addTo(map);
    window.setTimeout(() => map.invalidateSize(), 150);

    return () => {
      focusLayerRef.current?.clearLayers();
      serviceLayerRef.current?.clearLayers();
      tileLayerRef.current?.remove();
      map.remove();
      mapRef.current = null;
      tileLayerRef.current = null;
      serviceLayerRef.current = null;
      focusLayerRef.current = null;
    };
  }, [leaflet]);

  useEffect(() => {
    if (!mapRef.current || !leaflet || !serviceLayerRef.current) {
      return;
    }

    serviceLayerRef.current.clearLayers();
    services.forEach((service) => {
      const highlighted = highlightedSet.has(service.id);
      const marker = leaflet.circleMarker([service.latitude, service.longitude], {
        radius: highlighted ? 10 : 7,
        color: "#ffffff",
        weight: highlighted ? 3 : 2,
        fillColor: serviceColors[service.type],
        fillOpacity: 0.95
      });
      marker.bindTooltip(
        `<strong>${service.name}</strong><br/>${service.area} • ETA ${service.eta}<br/>${service.capability}`,
        { direction: "top", offset: [0, -8] }
      );
      marker.addTo(serviceLayerRef.current);
    });
  }, [highlightedSet, leaflet, services]);

  useEffect(() => {
    if (!mapRef.current || !leaflet || !focus || !focusLayerRef.current) {
      return;
    }

    focusLayerRef.current.clearLayers();
    leaflet
      .circle([focus.latitude, focus.longitude], {
        radius: focus.label === districtCenter.label ? 5200 : 1400,
        color: "#0f8f63",
        weight: 2,
        fillColor: "#34d399",
        fillOpacity: 0.15
      })
      .addTo(focusLayerRef.current);
    leaflet
      .circleMarker([focus.latitude, focus.longitude], {
        radius: 8,
        color: "#0f8f63",
        weight: 3,
        fillColor: "#ffffff",
        fillOpacity: 1
      })
      .bindTooltip(focus.label, { permanent: false, direction: "top", offset: [0, -10] })
      .addTo(focusLayerRef.current);

    mapRef.current.flyTo([focus.latitude, focus.longitude], focus.label === districtCenter.label ? 9.4 : 13.4, {
      animate: true,
      duration: 1.8
    });
    window.setTimeout(() => mapRef.current?.invalidateSize(), 180);
  }, [focus, leaflet]);

  return (
    <section className="grid h-full grid-rows-[minmax(0,1fr)_auto]">
      <div className="relative min-h-[360px]">
        <div ref={mapContainerRef} className="h-full min-h-[360px]" />
        <div className="pointer-events-none absolute left-4 top-4 rounded-2xl border border-white/70 bg-white/88 px-4 py-3 shadow-lg backdrop-blur">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent-strong)]">
            Live district map
          </p>
          <p className="mt-2 text-sm text-slate-700">{focus?.label ?? districtCenter.label}</p>
        </div>
      </div>
      <ServiceCardList services={services} highlightedIds={highlightedIds} />
    </section>
  );
}
