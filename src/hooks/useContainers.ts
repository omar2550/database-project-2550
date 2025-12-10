import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Container = Tables<"containers">;
export type ContainerInsert = TablesInsert<"containers">;
export type ContainerUpdate = TablesUpdate<"containers">;

export const useContainers = () => {
  return useQuery({
    queryKey: ["containers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("containers")
        .select("*")
        .order("container_number");
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateContainer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (container: ContainerInsert) => {
      const { data, error } = await supabase
        .from("containers")
        .insert(container)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["containers"] });
    },
  });
};

export const useUpdateContainer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      container_number,
      updates,
    }: {
      container_number: string;
      updates: ContainerUpdate;
    }) => {
      const { data, error } = await supabase
        .from("containers")
        .update(updates)
        .eq("container_number", container_number)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["containers"] });
    },
  });
};

export const useContainerProducts = (containerNumber: string) => {
  return useQuery({
    queryKey: ["container_products", containerNumber],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("container_products")
        .select("*, products(*)")
        .eq("container_number", containerNumber);
      if (error) throw error;
      return data;
    },
    enabled: !!containerNumber,
  });
};
