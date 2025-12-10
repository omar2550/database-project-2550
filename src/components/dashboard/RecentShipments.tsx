import { useShipments } from "@/hooks/useShipments";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Ship, MapPin, Calendar } from "lucide-react";

const statusColors: Record<string, string> = {
  "Delivered": "bg-success/10 text-success border-success/20",
  "In Transit": "bg-info/10 text-info border-info/20",
  "Processing": "bg-warning/10 text-warning border-warning/20",
  "Pending": "bg-muted text-muted-foreground",
};

export function RecentShipments() {
  const { data: shipments, isLoading } = useShipments();

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <h3 className="text-lg font-semibold font-cairo mb-4">أحدث الشحنات</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse flex gap-4">
              <div className="h-12 w-12 rounded-lg bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const recentShipments = shipments?.slice(0, 5) || [];

  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="text-lg font-semibold font-cairo mb-4">أحدث الشحنات</h3>
      <div className="space-y-4">
        {recentShipments.map((shipment) => (
          <div
            key={shipment.shipment_number}
            className="flex items-center gap-4 rounded-lg border bg-background/50 p-4 transition-all hover:bg-background"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Ship className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground">
                  شحنة #{shipment.shipment_number}
                </p>
                <Badge
                  variant="outline"
                  className={cn("text-xs", statusColors[shipment.status] || statusColors["Pending"])}
                >
                  {shipment.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {shipment.origin_port} → {shipment.destination_port}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(shipment.shipment_date).toLocaleDateString("ar-EG")}
                </span>
              </div>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">{shipment.total_weight} كجم</p>
              <p className="text-xs text-muted-foreground">{shipment.tracking_number}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
