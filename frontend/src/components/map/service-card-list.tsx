import type { EmergencyService } from "../../data/nh48-services";

type ServiceCardListProps = {
  services: EmergencyService[];
  highlightedIds?: string[];
};

const serviceTypeLabel: Record<EmergencyService["type"], string> = {
  hospital: "Hospital",
  trauma: "Trauma",
  ambulance: "Ambulance",
  police: "Police",
  rescue: "Rescue"
};

export function ServiceCardList({ services, highlightedIds = [] }: ServiceCardListProps) {
  const sortedServices = [...services].sort((a, b) => {
    const aHighlighted = highlightedIds.includes(a.id) ? 1 : 0;
    const bHighlighted = highlightedIds.includes(b.id) ? 1 : 0;
    return bHighlighted - aHighlighted;
  });

  return (
    <div className="grid gap-3 border-t border-[var(--panel-border)] bg-[var(--panel-bg)] p-4 sm:grid-cols-2 xl:grid-cols-3">
      {sortedServices.map((service) => {
        const highlighted = highlightedIds.includes(service.id);
        return (
          <article
            key={service.id}
            className={`rounded-[22px] border p-4 ${
              highlighted
                ? "border-[var(--accent-strong)] bg-[var(--accent-soft)]"
                : "border-[var(--panel-border)] bg-[var(--panel-muted)]"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--text-faint)]">
                {serviceTypeLabel[service.type]}
              </span>
              <span className="rounded-full bg-[var(--chip-bg)] px-2 py-1 text-xs text-[var(--text-secondary)]">
                ETA {service.eta}
              </span>
            </div>
            <h3 className="mt-3 text-base font-semibold text-[var(--text-primary)]">{service.name}</h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{service.area}</p>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">{service.capability}</p>
          </article>
        );
      })}
    </div>
  );
}
