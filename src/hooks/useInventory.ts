import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Inventory = Tables<"inventory">;
export type InventoryInsert = TablesInsert<"inventory">;
export type InventoryUpdate = TablesUpdate<"inventory">;

export const useInventory = () => {
  return useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory")
        .select("*, products(*), warehouses(*)")
        .order("last_updated", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ 
      productId, 
      warehouseCode, 
      updates 
    }: { 
      productId: number; 
      warehouseCode: string; 
      updates: InventoryUpdate 
    }) => {
      const { data, error } = await supabase
        .from("inventory")
        .update(updates)
        .eq("product_id", productId)
        .eq("warehouse_code", warehouseCode)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
};
