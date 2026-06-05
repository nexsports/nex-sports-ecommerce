"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  subscribeAdminActivity,
  type ActivityLogEntry,
} from "@/lib/realtime/admin-channel";

const actionLabels: Record<string, string> = {
  created: "criou",
  updated: "editou",
  deleted: "removeu",
};

const actionColors: Record<string, string> = {
  created: "bg-green-500/20 text-green-500",
  updated: "bg-primary/20 text-primary",
  deleted: "bg-destructive/20 text-destructive",
};

interface ActivityFeedProps {
  initial: ActivityLogEntry[];
}

export function ActivityFeed({ initial }: ActivityFeedProps) {
  const [events, setEvents] = useState<ActivityLogEntry[]>(initial);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = subscribeAdminActivity((entry) => {
      setEvents((prev) => [entry, ...prev].slice(0, 50));
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events.length]);

  return (
    <Card className="rounded-2xl border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">Atividade recente</CardTitle>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhuma atividade registrada ainda
          </p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] border-0 shrink-0 mt-0.5",
                    actionColors[ev.action] ?? "bg-muted text-muted-foreground",
                  )}
                >
                  {actionLabels[ev.action] ?? ev.action}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium capitalize">{ev.entity_type}</span>
                    {ev.entity_id && (
                      <span className="text-muted-foreground ml-1 font-mono text-xs">
                        {ev.entity_id.slice(0, 8)}
                      </span>
                    )}
                  </p>
                  {ev.metadata && typeof ev.metadata === "object" && "name" in ev.metadata && (
                    <p className="text-xs text-muted-foreground truncate">
                      {(ev.metadata as Record<string, unknown>).name as string}
                    </p>
                  )}
                </div>
                <time className="text-[10px] text-muted-foreground shrink-0">
                  {new Date(ev.created_at).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
