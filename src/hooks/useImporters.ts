import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Importer = Tables<"importers">;
export type ImporterInsert = TablesInsert<"importers">;
export type ImporterUpdate = TablesUpdate<"importers">;

export const useImporters = () => {
  return useQuery({
    queryKey: ["importers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("importers")
        .select("*")
        .order("company_name");
      if (error) throw error;
      return data;
    },
  });
};

export const useImporter = (isoCode: string) => {
  return useQuery({
    queryKey: ["importer", isoCode],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("importers")
        .select("*, importers_phone(*)")
        .eq("iso_code", isoCode)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!isoCode,
  });
};

export const useCreateImporter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (importer: ImporterInsert) => {
      const { data, error } = await supabase
        .from("importers")
        .insert(importer)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["importers"] });
    },
  });
};

export const useUpdateImporter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ isoCode, updates }: { isoCode: string; updates: ImporterUpdate }) => {
      const { data, error } = await supabase
        .from("importers")
        .update(updates)
        .eq("iso_code", isoCode)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["importers"] });
    },
  });
};
