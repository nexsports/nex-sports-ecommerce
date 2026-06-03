import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  type: string;
  label: string;
  date: string;
  detail?: string;
}

export function OrderTimeline({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhum evento registrado.</p>;
  }

  return (
    <div className="relative pl-6">
      {/* Vertical line */}
      <div className="absolute left-2.5 top-2 bottom-2 w-px bg-border" />

      <div className="space-y-6">
        {events.map((ev, i) => (
          <div key={ev.id} className="relative">
            {/* Dot */}
            <div
              className={cn(
                "absolute -left-[1.05rem] top-1 h-3 w-3 rounded-full border-2 border-border",
                i === 0 ? "bg-primary" : "bg-card"
              )}
            />
            <div>
              <p className="text-sm font-medium">{ev.label}</p>
              <p className="text-xs text-muted-foreground">{ev.date}</p>
              {ev.detail && (
                <p className="text-xs text-muted-foreground mt-0.5">{ev.detail}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
