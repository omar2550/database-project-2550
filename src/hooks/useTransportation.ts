import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Transportation = Tables<"transportation">;
export type TransportationInsert = TablesInsert<"transportation">;
export type TransportationUpdate = TablesUpdate<"transportation">;

export const useTransportation = () => {
  return useQuery({
    queryKey: ["transportation"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transportation")
        .select("*")
        .order("registration_number");
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateTransportation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vehicle: TransportationInsert) => {
      const { data, error } = await supabase
        .from("transportation")
        .insert(vehicle)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transportation"] });
    },
  });
};

export const useUpdateTransportation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      registration_number,
      updates,
    }: {
      registration_number: string;
      updates: TransportationUpdate;
    }) => {
      const { data, error } = await supabase
        .from("transportation")
        .update(updates)
        .eq("registration_number", registration_number)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transportation"] });
    },
  });
};

export const useShipmentTransportation = (shipmentNo: number) => {
  return useQuery({
    queryKey: ["shipment_transportation", shipmentNo],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shipment_transportation")
        .select("*, transportation(*)")
        .eq("shipment_no", shipmentNo);
      if (error) throw error;
      return data;
    },
    enabled: !!shipmentNo,
  });
};
