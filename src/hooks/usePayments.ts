import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Payment = Tables<"payments"> & {
  payment_methods: Tables<"payment_methods"> | null;
};
export type PaymentMethod = Tables<"payment_methods">;

export const usePayments = () => {
  return useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*, payment_methods(*)")
        .order("payment_date", { ascending: false });
      if (error) throw error;
      return data as Payment[];
    },
  });
};
