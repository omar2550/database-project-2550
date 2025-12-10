import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Warehouse = Tables<"warehouses">;
export type WarehouseInsert = TablesInsert<"warehouses">;
export type WarehouseUpdate = TablesUpdate<"warehouses">;

export const useWarehouses = () => {
  return useQuery({
    queryKey: ["warehouses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warehouses")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });
};

export const useWarehouse = (code: string) => {
  return useQuery({
    queryKey: ["warehouse", code],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warehouses")
        .select("*, employees(*)")
        .eq("code", code)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!code,
  });
};

export const useCreateWarehouse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (warehouse: WarehouseInsert) => {
      const { data, error } = await supabase
        .from("warehouses")
        .insert(warehouse)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
    },
  });
};

export const useUpdateWarehouse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ code, updates }: { code: string; updates: WarehouseUpdate }) => {
      const { data, error } = await supabase
        .from("warehouses")
        .update(updates)
        .eq("code", code)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
    },
  });
};
