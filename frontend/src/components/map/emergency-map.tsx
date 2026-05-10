import { useEffect, useMemo, useRef } from "react";

import type { EmergencyService } from "../../data/nh48-services";
import { districtCenter } from "../../data/nh48-services";
import { configureMapbox, mapboxgl } from "../../lib/mapbox";
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
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRefs = useRef<mapboxgl.Marker[]>([]);
  const token = configureMapbox();
  const highlightedSet = useMemo(() => new Set(highlightedIds), [highlightedIds]);

  useEffect(() => {
    if (!token || !mapContainerRef.current || mapRef.current) {
      return;
    }

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [districtCenter.longitude, districtCenter.latitude],
      zoom: 9.4,
      attributionControl: false
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");

    return () => {
      markerRefs.current.forEach((marker) => marker.remove());
      markerRefs.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [token]);

  useEffect(() => {
    if (!mapRef.current || !token) {
      return;
    }

    markerRefs.current.forEach((marker) => marker.remove());
    markerRefs.current = services.map((service) => {
      const markerNode = document.createElement("div");
      markerNode.className = "service-marker";
      markerNode.style.width = highlightedSet.has(service.id) ? "18px" : "14px";
      markerNode.style.height = highlightedSet.has(service.id) ? "18px" : "14px";
      markerNode.style.borderRadius = "9999px";
      markerNode.style.background = serviceColors[service.type];
      markerNode.style.border = highlightedSet.has(service.id) ? "3px solid rgba(255,255,255,0.95)" : "2px solid rgba(255,255,255,0.85)";
      markerNode.style.boxShadow = highlightedSet.has(service.id)
        ? "0 0 0 10px rgba(15,143,99,0.16)"
        : "0 4px 12px rgba(15,23,42,0.18)";

      return new mapboxgl.Marker(markerNode)
        .setLngLat([service.longitude, service.latitude])
        .addTo(mapRef.current!);
    });
  }, [highlightedSet, services, token]);

  useEffect(() => {
    if (!mapRef.current || !focus || !token) {
      return;
    }

    mapRef.current.flyTo({
      center: [focus.longitude, focus.latitude],
      zoom: focus.label === districtCenter.label ? 9.4 : 12.4,
      speed: 0.7
    });
  }, [focus, token]);

  if (!token) {
    return (
      <FallbackMap services={services} highlightedIds={highlightedIds} focus={focus} />
    );
  }

  return (
    <section className="grid h-full grid-rows-[minmax(0,1fr)_auto]">
      <div ref={mapContainerRef} className="min-h-[320px]" />
      <ServiceCardList services={services} highlightedIds={highlightedIds} />
    </section>
  );
}

function FallbackMap({
  services,
  highlightedIds,
  focus
}: {
  services: EmergencyService[];
  highlightedIds: string[];
  focus: { latitude: number; longitude: number; label: string } | null;
}) {
  return (
    <section className="grid h-full grid-rows-[minmax(0,1fr)_auto]">
      <div className="relative overflow-hidden bg-[linear-gradient(180deg,rgba(243,244,246,0.96),rgba(226,232,240,0.92))] dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.96))]">
        <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.18)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute left-5 top-5 rounded-2xl border border-white/50 bg-white/80 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-slate-950/70">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-strong)]">
            District map preview
          </p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">{focus?.label ?? districtCenter.label}</p>
        </div>

        {services.map((service, index) => {
          const top = 22 + (index % 3) * 18;
          const left = 18 + ((index * 17) % 62);
          const isHighlighted = highlightedIds.includes(service.id);

          return (
            <div
              key={service.id}
              className="absolute"
              style={{ top: `${top}%`, left: `${left}%` }}
            >
              <span
                className="block rounded-full border-2 border-white shadow-lg"
                style={{
                  width: isHighlighted ? 18 : 14,
                  height: isHighlighted ? 18 : 14,
                  background: serviceColors[service.type],
                  boxShadow: isHighlighted ? "0 0 0 10px rgba(15, 143, 99, 0.14)" : undefined
                }}
              />
            </div>
          );
        })}
      </div>

      <ServiceCardList services={services} highlightedIds={highlightedIds} />
    </section>
  );
}
