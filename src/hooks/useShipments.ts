import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Shipment = Tables<"shipments">;
export type ShipmentInsert = TablesInsert<"shipments">;
export type ShipmentUpdate = TablesUpdate<"shipments">;

export const useShipments = () => {
  return useQuery({
    queryKey: ["shipments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shipments")
        .select("*")
        .order("shipment_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useShipment = (id: number) => {
  return useQuery({
    queryKey: ["shipment", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shipments")
        .select("*, importers(*), warehouses(*), containers(*)")
        .eq("shipment_number", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateShipment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (shipment: ShipmentInsert) => {
      const { data, error } = await supabase
        .from("shipments")
        .insert(shipment)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
  });
};

export const useUpdateShipment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: ShipmentUpdate }) => {
      const { data, error } = await supabase
        .from("shipments")
        .update(updates)
        .eq("shipment_number", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
  });
};
