import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [shipments, products, employees, warehouses, payments, containers] = await Promise.all([
        supabase.from("shipments").select("*", { count: "exact" }),
        supabase.from("products").select("*", { count: "exact" }),
        supabase.from("employees").select("*", { count: "exact" }),
        supabase.from("warehouses").select("*", { count: "exact" }),
        supabase.from("payments").select("amount"),
        supabase.from("containers").select("*", { count: "exact" }),
      ]);

      const totalRevenue = payments.data?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
      
      const activeShipments = shipments.data?.filter(s => 
        s.status === "In Transit" || s.status === "Processing"
      ).length || 0;

      return {
        totalShipments: shipments.count || 0,
        activeShipments,
        totalProducts: products.count || 0,
        totalEmployees: employees.count || 0,
        totalWarehouses: warehouses.count || 0,
        totalRevenue,
        totalContainers: containers.count || 0,
      };
    },
  });
};
