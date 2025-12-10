import { useInventory } from "@/hooks/useInventory";
import { Progress } from "@/components/ui/progress";
import { Package, AlertTriangle } from "lucide-react";

export function InventoryOverview() {
  const { data: inventory, isLoading } = useInventory();

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <h3 className="text-lg font-semibold font-cairo mb-4">نظرة على المخزون</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="h-4 w-1/3 rounded bg-muted" />
              <div className="h-2 w-full rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const inventoryItems = inventory?.slice(0, 6) || [];

  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="text-lg font-semibold font-cairo mb-4">نظرة على المخزون</h3>
      <div className="space-y-4">
        {inventoryItems.map((item) => {
          const maxQuantity = 1000;
          const percentage = Math.min((item.quantity / maxQuantity) * 100, 100);
          const isLow = item.quantity < 100;

          return (
            <div key={`${item.product_id}-${item.warehouse_code}`} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {item.products?.name || `منتج #${item.product_id}`}
                  </span>
                  {isLow && (
                    <AlertTriangle className="h-4 w-4 text-warning" />
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {item.quantity} وحدة
                </span>
              </div>
              <Progress
                value={percentage}
                className={isLow ? "[&>div]:bg-warning" : "[&>div]:bg-primary"}
              />
              <p className="text-xs text-muted-foreground">
                {item.warehouses?.name || item.warehouse_code} • {item.location_in_warehouse || "غير محدد"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
